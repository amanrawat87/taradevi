import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

async function run() {
  const token = jwt.sign(
    { id: '6a3cb9101c76d696f226e34e', email: 'superadmin@jindalmetal.com', role: 'super_admin' },
    process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long-here',
    { expiresIn: '7d' }
  );

  console.log("=== Running Full End-to-End Verification ===");

  // 1. Product Schema & Frontend JSON-LD Verification
  console.log("\n[1] Testing Product Schema & Public Page JSON-LD...");
  const prodListRes = await fetch('http://localhost:3001/api/products');
  const products = await prodListRes.json();
  const testProd = products.find(p => p.slug === 'cold-rolled-precision-stainless-steel-strips') || products[0];
  console.log(`Using product: "${testProd.name}" (${testProd.slug})`);

  const customSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cold Rolled Precision Stainless Steel Strips Premium",
    "description": "Custom verified schema for testing",
    "sku": "JMA-SS-001"
  };

  const fd = new FormData();
  fd.append('name', testProd.name);
  fd.append('slug', testProd.slug);
  fd.append('category', testProd.category?._id || testProd.category);
  fd.append('schema', JSON.stringify(customSchema, null, 2));

  const updateRes = await fetch(`http://localhost:3001/api/products/${testProd._id}`, {
    method: 'PUT',
    headers: { Cookie: `admin_token=${token}` },
    body: fd
  });
  console.log("Product PUT status:", updateRes.status);
  const updatedData = await updateRes.json();
  if (updatedData.schemaMarkup?.sku !== "JMA-SS-001") {
    throw new Error("Product schemaMarkup SKU mismatch in API response");
  }

  // Verify GET /api/products/[id]
  const singleRes = await fetch(`http://localhost:3001/api/products/${testProd._id}`);
  const singleData = await singleRes.json();
  if (singleData.schemaMarkup?.sku !== "JMA-SS-001") {
    throw new Error("Product schemaMarkup SKU mismatch on GET /api/products/[id]");
  }
  console.log("GET /api/products/[id] schemaMarkup successfully persisted!");

  // Verify public product page JSON-LD
  const categorySlug = testProd.category?.slug || 'stainless-steel';
  const publicUrl = `http://localhost:3001/${categorySlug}/${testProd.slug}?t=${Date.now()}`;
  console.log(`Fetching public page: ${publicUrl}`);
  const pageRes = await fetch(publicUrl);
  const pageHtml = await pageRes.text();
  
  const schemaRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let foundCustomSchema = false;
  while ((match = schemaRegex.exec(pageHtml)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.sku === "JMA-SS-001" && parsed.name === customSchema.name) {
        foundCustomSchema = true;
        break;
      }
    } catch (e) {}
  }
  if (!foundCustomSchema) {
    throw new Error("Custom schema not found in public product page HTML!");
  }
  console.log("Public product page rendered valid, uncorrupted JSON-LD with custom schema!");

  // 2. Category Schema Persistence
  console.log("\n[2] Testing Category Schema Persistence...");
  const catListRes = await fetch('http://localhost:3001/api/categories');
  const categories = await catListRes.json();
  const testCat = categories[0];
  console.log(`Using category: "${testCat.name}" (${testCat.slug})`);

  const catFd = new FormData();
  catFd.append('name', testCat.name);
  catFd.append('slug', testCat.slug);
  catFd.append('schema', JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": testCat.name
  }));
  const catUpdateRes = await fetch(`http://localhost:3001/api/categories/${testCat._id}`, {
    method: 'PUT',
    headers: { Cookie: `admin_token=${token}` },
    body: catFd
  });
  console.log("Category PUT status:", catUpdateRes.status);
  const catUpdated = await catUpdateRes.json();
  if (catUpdated.schemaMarkup?.['@type'] !== "CollectionPage") {
    throw new Error("Category schemaMarkup not persisted");
  }
  console.log("Category schemaMarkup successfully persisted!");

  // 3. Sitemap Verification
  console.log("\n[3] Testing Sitemap XML...");
  const sitemapRes = await fetch('http://localhost:3001/sitemap.xml');
  const sitemapXml = await sitemapRes.text();
  if (sitemapXml.includes('/blogs/')) {
    throw new Error("Sitemap still contains broken /blogs/ URLs!");
  }
  if (!sitemapXml.includes('/blog/')) {
    throw new Error("Sitemap missing valid /blog/ URLs!");
  }
  console.log("Sitemap XML has valid /blog/ URLs and zero /blogs/ errors!");

  // 4. Cleanup test product schema
  const cleanFd = new FormData();
  cleanFd.append('name', testProd.name);
  cleanFd.append('slug', testProd.slug);
  cleanFd.append('category', testProd.category?._id || testProd.category);
  cleanFd.append('schema', '');
  await fetch(`http://localhost:3001/api/products/${testProd._id}`, {
    method: 'PUT',
    headers: { Cookie: `admin_token=${token}` },
    body: cleanFd
  });
  console.log("Cleaned test product schema back to baseline.");

  console.log("\nALL END-TO-END VERIFICATION CHECKS PASSED!");
}

run().catch(e => {
  console.error("Verification failed:", e);
  process.exit(1);
});
