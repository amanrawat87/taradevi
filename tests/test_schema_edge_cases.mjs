import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

async function run() {
  const token = jwt.sign(
    { id: '6a3cb9101c76d696f226e34e', email: 'superadmin@jindalmetal.com', role: 'super_admin' },
    process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long-here',
    { expiresIn: '7d' }
  );

  const prodRes = await fetch('http://localhost:3001/api/products', {
    headers: { Cookie: `admin_token=${token}` }
  });
  const prods = await prodRes.json();
  const prod = prods[0];
  console.log("Testing Product:", prod.name, prod._id);

  // Test 1: Paste with <script type="application/ld+json">...</script>
  console.log("\n--- Test 1: Paste with <script> tag ---");
  const scriptWrappedSchema = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Script Wrapped Product"
}
</script>`;
  let fd = new FormData();
  fd.append('name', prod.name);
  fd.append('slug', prod.slug);
  fd.append('category', prod.category?._id || prod.category);
  fd.append('schema', scriptWrappedSchema);
  let res = await fetch(`http://localhost:3001/api/products/${prod._id}`, {
    method: 'PUT',
    headers: { Cookie: `admin_token=${token}` },
    body: fd
  });
  console.log("PUT status:", res.status);
  let json = await res.json();
  console.log("Saved schema name:", json.schemaMarkup?.name);
  if (json.schemaMarkup?.name !== "Script Wrapped Product") {
    throw new Error("Failed Test 1");
  }

  // Test 2: Paste with markdown code fences ```json ... ```
  console.log("\n--- Test 2: Paste with markdown code fences ---");
  const markdownSchema = `\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Markdown Fenced Product"
}
\`\`\``;
  fd = new FormData();
  fd.append('name', prod.name);
  fd.append('slug', prod.slug);
  fd.append('category', prod.category?._id || prod.category);
  fd.append('schemaMarkup', markdownSchema); // Test with schemaMarkup key
  res = await fetch(`http://localhost:3001/api/products/${prod._id}`, {
    method: 'PUT',
    headers: { Cookie: `admin_token=${token}` },
    body: fd
  });
  console.log("PUT status:", res.status);
  json = await res.json();
  console.log("Saved schema name:", json.schemaMarkup?.name);
  if (json.schemaMarkup?.name !== "Markdown Fenced Product") {
    throw new Error("Failed Test 2");
  }

  // Test 3: Status toggle must NOT erase schema
  console.log("\n--- Test 3: Partial Status Toggle (no schema sent) ---");
  fd = new FormData();
  fd.append('name', prod.name);
  fd.append('slug', prod.slug);
  fd.append('category', prod.category?._id || prod.category);
  fd.append('isActive', 'true');
  res = await fetch(`http://localhost:3001/api/products/${prod._id}`, {
    method: 'PUT',
    headers: { Cookie: `admin_token=${token}` },
    body: fd
  });
  console.log("Status toggle PUT status:", res.status);
  json = await res.json();
  console.log("Schema after toggle:", json.schemaMarkup?.name);
  if (json.schemaMarkup?.name !== "Markdown Fenced Product") {
    throw new Error("Failed Test 3: Schema was erased on status toggle!");
  }

  // Test 4: Invalid JSON returns 400
  console.log("\n--- Test 4: Malformed JSON returns 400 ---");
  fd = new FormData();
  fd.append('name', prod.name);
  fd.append('slug', prod.slug);
  fd.append('category', prod.category?._id || prod.category);
  fd.append('schema', '{ bad json: true, }');
  res = await fetch(`http://localhost:3001/api/products/${prod._id}`, {
    method: 'PUT',
    headers: { Cookie: `admin_token=${token}` },
    body: fd
  });
  console.log("Malformed JSON PUT status:", res.status);
  const errJson = await res.json();
  console.log("Error message:", errJson.message);
  if (res.status !== 400) {
    throw new Error("Failed Test 4: Should return 400 on malformed JSON");
  }

  // Cleanup: clear schema back to empty object
  fd = new FormData();
  fd.append('name', prod.name);
  fd.append('slug', prod.slug);
  fd.append('category', prod.category?._id || prod.category);
  fd.append('schema', '');
  await fetch(`http://localhost:3001/api/products/${prod._id}`, {
    method: 'PUT',
    headers: { Cookie: `admin_token=${token}` },
    body: fd
  });
  console.log("\nAll schema edge case tests PASSED!");
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
