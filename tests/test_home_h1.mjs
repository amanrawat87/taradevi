import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

async function run() {
  const token = jwt.sign(
    { id: '6a3cb9101c76d696f226e34e', email: 'superadmin@jindalmetal.com', role: 'super_admin' },
    process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long-here',
    { expiresIn: '7d' }
  );

  console.log("=== Testing Home Page Single H1 Architecture ===");

  // Case 1: Fetch with current DB state (where h1 is empty)
  console.log("\n--- Case 1: When seoData.h1 is empty ---");
  let res = await fetch('http://localhost:3001/');
  let html = await res.text();
  let h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  console.log(`Found ${h1Matches.length} H1 tag(s):`);
  h1Matches.forEach((h, i) => console.log(`  [H1 #${i + 1}]`, h.substring(0, 100)));
  if (h1Matches.length !== 1) {
    throw new Error(`Expected exactly 1 H1, but found ${h1Matches.length}`);
  }

  // Case 2: Set h1 in HomeSeo via API
  console.log("\n--- Case 2: When seoData.h1 is populated via Admin API ---");
  const updatePayload = {
    pageSlug: 'home',
    title: 'Jindal Metal - Stainless Steel Manufacturer in India',
    h1: 'Stainless Steel Strips Manufacturer in India',
    metaDescription: 'Specializing in the manufacturing of cold rolled precision stainless steel strips.',
    canonicalUrl: 'https://jindalmetal.com',
    robots: 'index, follow'
  };

  const saveRes = await fetch('http://localhost:3001/api/home-seo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `admin_token=${token}`
    },
    body: JSON.stringify(updatePayload)
  });
  console.log("POST /api/home-seo status:", saveRes.status);
  const saveData = await saveRes.json();
  console.log("Saved HomeSeo h1:", saveData.data?.h1);

  // Fetch updated homepage
  res = await fetch('http://localhost:3001/?t=' + Date.now());
  html = await res.text();
  h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  console.log(`Found ${h1Matches.length} H1 tag(s) after setting h1:`);
  h1Matches.forEach((h, i) => console.log(`  [H1 #${i + 1}]`, h.substring(0, 120)));
  if (h1Matches.length !== 1) {
    throw new Error(`Expected exactly 1 H1 after setting seoData.h1, but found ${h1Matches.length}`);
  }

  // Verify HeroSlider rendered h2
  const h2Matches = html.match(/<h2 class="text-light h1">([\s\S]*?)<\/h2>/gi) || [];
  console.log(`HeroSlider successfully converted to H2: ${h2Matches.length > 0}`);
  if (h2Matches.length === 0) {
    throw new Error("HeroSlider did not switch to h2 when page has primary H1!");
  }

  // Verify Title tag
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  console.log("Page <title> tag:", titleMatch ? titleMatch[1] : 'none');

  // Case 3: Clear h1 back to empty and verify HeroSlider reverts to single H1
  console.log("\n--- Case 3: Reverting h1 to empty ---");
  updatePayload.h1 = '';
  await fetch('http://localhost:3001/api/home-seo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `admin_token=${token}`
    },
    body: JSON.stringify(updatePayload)
  });

  res = await fetch('http://localhost:3001/?t=' + Date.now());
  html = await res.text();
  h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  console.log(`Found ${h1Matches.length} H1 tag(s) after clearing h1:`);
  h1Matches.forEach((h, i) => console.log(`  [H1 #${i + 1}]`, h.substring(0, 100)));
  if (h1Matches.length !== 1) {
    throw new Error(`Expected exactly 1 H1 after clearing seoData.h1, but found ${h1Matches.length}`);
  }

  console.log("\nAll Home Page Single H1 Architecture tests PASSED!");
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
