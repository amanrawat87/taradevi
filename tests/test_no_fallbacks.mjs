import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const BASE_URL = 'http://localhost:3001';

const token = jwt.sign(
  { id: '6a3cb9101c76d696f226e34e', email: 'superadmin@jindalmetal.com', role: 'super_admin' },
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long-here',
  { expiresIn: '7d' }
);

const headers = {
  Cookie: `admin_token=${token}`
};

async function run() {
  console.log('=== Verifying Complete Elimination of Fallback Schemas & Pure Admin-Driven Injection ===\n');

  // [1] Product Page: Verify zero fallback when empty, and custom schema when set
  console.log('[1] Testing Product Page Fallback Elimination...');
  const prodListRes = await fetch(`${BASE_URL}/api/products`);
  const products = await prodListRes.json();
  const testProd = products.find(p => p.slug === 'steel-foil') || products[0];

  // A. Set empty schema on product
  const fdEmpty = new FormData();
  fdEmpty.append('name', testProd.name);
  fdEmpty.append('slug', testProd.slug);
  fdEmpty.append('category', testProd.category._id || testProd.category);
  fdEmpty.append('schema', '{}');
  fdEmpty.append('schemaMarkup', '{}');

  const putEmptyRes = await fetch(`${BASE_URL}/api/products/${testProd._id}`, {
    method: 'PUT',
    headers,
    body: fdEmpty
  });
  if (putEmptyRes.status !== 200) throw new Error(`Product empty PUT failed: ${putEmptyRes.status}`);

  // Fetch public product page
  const catSlug = testProd.category.slug || 'stainless-steel';
  const prodPageRes = await fetch(`${BASE_URL}/${catSlug}/${testProd.slug}?t=${Date.now()}`);
  const prodHtml = await prodPageRes.text();

  const prodLdJson = [...prodHtml.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let hasProductSchema = false;
  for (const s of prodLdJson) {
    try {
      const parsed = JSON.parse(s);
      if (parsed['@type'] === 'Product') hasProductSchema = true;
    } catch {}
  }
  if (hasProductSchema) {
    throw new Error('FAIL: Product page rendered a fallback Product schema when DB schema was empty!');
  }
  console.log('  -> PASS: Zero fallback Product schema rendered when product schema is empty.');

  // B. Set custom schema on product
  const customProdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Verified Admin Schema Product',
    sku: 'VERIFIED-SKU-999'
  };
  const fdCustom = new FormData();
  fdCustom.append('name', testProd.name);
  fdCustom.append('slug', testProd.slug);
  fdCustom.append('category', testProd.category._id || testProd.category);
  fdCustom.append('schema', JSON.stringify(customProdSchema));

  const putCustomRes = await fetch(`${BASE_URL}/api/products/${testProd._id}`, {
    method: 'PUT',
    headers,
    body: fdCustom
  });
  if (putCustomRes.status !== 200) throw new Error(`Product custom PUT failed: ${putCustomRes.status}`);

  const prodPageRes2 = await fetch(`${BASE_URL}/${catSlug}/${testProd.slug}?t=${Date.now()}`);
  const prodHtml2 = await prodPageRes2.text();
  const prodLdJson2 = [...prodHtml2.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let foundCustomProd = false;
  for (const s of prodLdJson2) {
    try {
      const parsed = JSON.parse(s);
      if (parsed['@type'] === 'Product' && parsed.sku === 'VERIFIED-SKU-999') {
        foundCustomProd = true;
      }
    } catch {}
  }
  if (!foundCustomProd) {
    throw new Error('FAIL: Custom Product schema did not inject on public page!');
  }
  console.log('  -> PASS: Custom Product schema successfully injected when saved via admin.');

  // Clean up product schema back to empty
  await fetch(`${BASE_URL}/api/products/${testProd._id}`, {
    method: 'PUT',
    headers,
    body: fdEmpty
  });

  // [2] Category Page: Verify zero fallback when empty
  console.log('\n[2] Testing Category Page Fallback Elimination...');
  const catListRes = await fetch(`${BASE_URL}/api/categories`);
  const categories = await catListRes.json();
  const testCat = categories.find(c => c.slug === 'stainless-steel') || categories[0];

  const fdCatEmpty = new FormData();
  fdCatEmpty.append('name', testCat.name);
  fdCatEmpty.append('slug', testCat.slug);
  fdCatEmpty.append('schema', '{}');

  const catPutRes = await fetch(`${BASE_URL}/api/categories/${testCat._id}`, {
    method: 'PUT',
    headers,
    body: fdCatEmpty
  });
  if (catPutRes.status !== 200) throw new Error(`Category empty PUT failed: ${catPutRes.status}`);

  const catPageRes = await fetch(`${BASE_URL}/${testCat.slug}?t=${Date.now()}`);
  const catHtml = await catPageRes.text();
  const catLdJson = [...catHtml.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let hasCollectionPage = false;
  for (const s of catLdJson) {
    try {
      const parsed = JSON.parse(s);
      if (parsed['@type'] === 'CollectionPage') hasCollectionPage = true;
    } catch {}
  }
  if (hasCollectionPage) {
    throw new Error('FAIL: Category page rendered fallback CollectionPage schema when schema was empty!');
  }
  console.log('  -> PASS: Zero fallback CollectionPage schema rendered when category schema is empty.');

  // [3] Home Page: Verify zero fallback when empty
  console.log('\n[3] Testing Home Page Fallback Elimination...');
  const homeSeoPayload = {
    pageSlug: 'home',
    title: 'Jindal Metals & Alloys Ltd | Precision Stainless Steel Strips',
    schema: {}
  };
  const homeSeoRes = await fetch(`${BASE_URL}/api/home-seo`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(homeSeoPayload)
  });
  if (homeSeoRes.status !== 200) throw new Error(`HomeSeo POST failed: ${homeSeoRes.status}`);

  const homePageRes = await fetch(`${BASE_URL}/?t=${Date.now()}`);
  const homeHtml = await homePageRes.text();
  const homeLdJson = [...homeHtml.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let hasHomeFallback = false;
  for (const s of homeLdJson) {
    try {
      const parsed = JSON.parse(s);
      if (parsed['@graph'] || (parsed['@type'] === 'WebSite' && !parsed['@type']?.includes('Business'))) {
        hasHomeFallback = true;
      }
    } catch {}
  }
  if (hasHomeFallback) {
    throw new Error('FAIL: Home page rendered fallback Organization/WebSite schema when schema was empty!');
  }
  console.log('  -> PASS: Zero fallback Organization/WebSite schema rendered when home schema is empty.');

  // [4] Contact Page: Schema injection when configured, and absent when empty
  console.log('\n[4] Testing Contact Page Schema Injection...');
  const customContactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Jindal Metals & Alloys Ltd Contact Details',
    telephone: '+91 93235 82341'
  };
  const fdContact = new FormData();
  fdContact.append('schemaMarkup', JSON.stringify(customContactSchema));

  const contactPutRes = await fetch(`${BASE_URL}/api/contact-page`, {
    method: 'PUT',
    headers,
    body: fdContact
  });
  if (contactPutRes.status !== 200) throw new Error(`Contact page PUT failed: ${contactPutRes.status}`);

  const contactPageRes = await fetch(`${BASE_URL}/contact?t=${Date.now()}`);
  const contactHtml = await contactPageRes.text();
  const contactLdJson = [...contactHtml.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let foundContactSchema = false;
  for (const s of contactLdJson) {
    try {
      const parsed = JSON.parse(s);
      if (parsed['@type'] === 'ContactPage' && parsed.telephone === '+91 93235 82341') {
        foundContactSchema = true;
      }
    } catch {}
  }
  if (!foundContactSchema) {
    throw new Error('FAIL: Contact page did not render ContactPage schema from DB!');
  }
  console.log('  -> PASS: Contact page successfully rendered ContactPage schema configured in DB.');

  // [5] Breadcrumb URL: Verify canonical domain https://jindalmetal.com
  console.log('\n[5] Testing Breadcrumb Canonical URL in PageHeader...');
  let hasCorrectBreadcrumbUrl = false;
  let hasOldBreadcrumbUrl = false;
  for (const s of contactLdJson) {
    try {
      const parsed = JSON.parse(s);
      if (parsed['@type'] === 'BreadcrumbList') {
        for (const item of parsed.itemListElement) {
          if (item.item?.includes('https://jindalmetal.com')) hasCorrectBreadcrumbUrl = true;
          if (item.item?.includes('https://www.jindalmetals.com')) hasOldBreadcrumbUrl = true;
        }
      }
    } catch {}
  }
  if (hasOldBreadcrumbUrl) {
    throw new Error('FAIL: BreadcrumbList contains old https://www.jindalmetals.com URL!');
  }
  if (!hasCorrectBreadcrumbUrl) {
    throw new Error('FAIL: BreadcrumbList did not contain canonical https://jindalmetal.com URL!');
  }
  console.log('  -> PASS: BreadcrumbList structured data uses canonical https://jindalmetal.com.');

  // [6] Global Setting Schema: Verify RootLayout renders when set and is absent when empty
  console.log('\n[6] Testing Global Settings Schema in RootLayout...');
  // A. Set custom global schema
  const customGlobalSchema = {
    '@context': 'https://schema.org',
    '@type': 'ManufacturingBusiness',
    name: 'Jindal Metals & Alloys Ltd (Global Verified)',
    url: 'https://jindalmetal.com'
  };
  const fdGlobal = new FormData();
  fdGlobal.append('schemaMarkup', JSON.stringify(customGlobalSchema));
  const globalPutRes = await fetch(`${BASE_URL}/api/global-settings`, {
    method: 'PUT',
    headers,
    body: fdGlobal
  });
  if (globalPutRes.status !== 200) throw new Error(`Global settings PUT failed: ${globalPutRes.status}`);

  const globalPageRes = await fetch(`${BASE_URL}/?t=${Date.now()}`);
  const globalHtml = await globalPageRes.text();
  const globalLdJson = [...globalHtml.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let foundGlobal = false;
  for (const s of globalLdJson) {
    try {
      const parsed = JSON.parse(s);
      if (parsed.name === 'Jindal Metals & Alloys Ltd (Global Verified)') {
        foundGlobal = true;
      }
    } catch {}
  }
  if (!foundGlobal) {
    throw new Error('FAIL: Global schema from GlobalSetting did not render in RootLayout!');
  }
  console.log('  -> PASS: Global schema from GlobalSettings successfully rendered in RootLayout.');

  // B. Test clearing global schema -> must NOT render any ManufacturingBusiness script
  const fdGlobalEmpty = new FormData();
  fdGlobalEmpty.append('schemaMarkup', '{}');
  await fetch(`${BASE_URL}/api/global-settings`, {
    method: 'PUT',
    headers,
    body: fdGlobalEmpty
  });
  const globalPageResEmpty = await fetch(`${BASE_URL}/?t=${Date.now()}`);
  const globalHtmlEmpty = await globalPageResEmpty.text();
  const globalLdJsonEmpty = [...globalHtmlEmpty.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let hasAnyGlobal = false;
  for (const s of globalLdJsonEmpty) {
    try {
      const parsed = JSON.parse(s);
      if (parsed['@type'] === 'ManufacturingBusiness') {
        hasAnyGlobal = true;
      }
    } catch {}
  }
  if (hasAnyGlobal) {
    throw new Error('FAIL: RootLayout rendered global schema when GlobalSetting schema was empty!');
  }
  console.log('  -> PASS: RootLayout rendered 0 global schema scripts when global schema was cleared.');

  // Restore canonical ManufacturingBusiness in Global Settings for production
  const canonicalGlobalSchema = {
    '@context': 'https://schema.org',
    '@type': 'ManufacturingBusiness',
    name: 'Jindal Metals & Alloys Ltd',
    url: 'https://jindalmetal.com',
    logo: 'https://jindalmetal.com/images/logo.png',
    description: 'Specializing in the manufacturing of cold rolled precision stainless steel strips. Over 4 decades of stability, trust, and quality excellence.',
    foundingDate: '1980',
    email: 'info@jindalmetals.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hisar',
      addressRegion: 'Haryana',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://www.linkedin.com',
      'https://www.facebook.com'
    ]
  };
  const fdGlobalRestore = new FormData();
  fdGlobalRestore.append('schemaMarkup', JSON.stringify(canonicalGlobalSchema));
  await fetch(`${BASE_URL}/api/global-settings`, {
    method: 'PUT',
    headers,
    body: fdGlobalRestore
  });
  console.log('  -> Restored canonical ManufacturingBusiness into Global Settings DB.');

  console.log('\n=== ALL VERIFICATION CHECKS PASSED PERFECTLY! ===');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
