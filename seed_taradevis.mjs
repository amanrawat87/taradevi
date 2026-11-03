import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "dns";

// Use Google DNS for SRV resolution
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Minimal schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["super_admin", "admin"], default: "admin" },
  isActive: { type: Boolean, default: true },
  permissions: { type: Map, of: [String], default: {} },
}, { timestamps: true });

const globalSettingSchema = new mongoose.Schema({
  logoImage: { type: String, default: "/images/tara-devis-seal.png" },
  adminLogo: { type: String, default: "/images/tara-devis-seal.png" },
  favicon: { type: String, default: "/images/tara-devis-seal.png" },
  adminTitle: { type: String, default: "Tara Devi's Group" },
  footerDescription: { type: String, default: "" },
  primaryEmail: { type: String, default: "careers@taradevis.com" },
  primaryPhone: { type: String, default: "+91-9871177761" },
  footerPhone: { type: String, default: "+91-9871177761" },
  address: { type: String, default: "Shimla & Kufri Foothills, Himachal Pradesh, India" },
  socialLinks: { type: Array, default: [] },
}, { timestamps: true });

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  url: String,
  buttonText: String,
  image: String,
  alt: String,
  status: { type: String, default: "active" },
  sort: { type: Number, default: 0 },
}, { timestamps: true });

const homeAboutSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  alt: String,
}, { timestamps: true });

const homeExtraSchema = new mongoose.Schema({
  choose_title: String,
  choose_subtitle: String,
  product_title: String,
  product_subtitle: String,
  work_title: String,
  work_subtitle: String,
  contact_title: String,
  contact_subtitle: String,
}, { timestamps: true });

const whyChooseSchema = new mongoose.Schema({
  title: String,
  icon: String,
  content: String,
  status: { type: String, default: "active" },
  sort: { type: Number, default: 0 },
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  sort: { type: Number, default: 0 },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  grade: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  alt: { type: String, default: '' },
  sort: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const gallerySchema = new mongoose.Schema({
  caption: { type: String, default: "" },
  url: { type: String, required: true },
  date: { type: String, default: "" },
  sort: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const homeSeoSchema = new mongoose.Schema({
  pageSlug: { type: String, default: 'home' },
  title: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  robots: { type: String, default: 'index, follow' },
  h1: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const GlobalSetting = mongoose.models.GlobalSetting || mongoose.model("GlobalSetting", globalSettingSchema);
const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
const HomeAbout = mongoose.models.HomeAbout || mongoose.model("HomeAbout", homeAboutSchema);
const HomeExtra = mongoose.models.HomeExtra || mongoose.model("HomeExtra", homeExtraSchema);
const WhyChoose = mongoose.models.WhyChoose || mongoose.model("WhyChoose", whyChooseSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const GalleryImage = mongoose.models.GalleryImage || mongoose.model("GalleryImage", gallerySchema);
const HomeSeo = mongoose.models.HomeSeo || mongoose.model("HomeSeo", homeSeoSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, { dbName: "taradevis_db" });
    console.log("✅ Successfully connected to taradevis_db");

    // 1. Super Admin
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@taradevis.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || "TaraDevis@Admin2026", 12);
      await User.create({
        name: process.env.SUPER_ADMIN_NAME || "Tara Devi's Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "super_admin",
        isActive: true,
      });
      console.log(`✅ Super Admin created: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Super Admin already exists: ${adminEmail}`);
    }

    // 2. Global Settings
    await GlobalSetting.deleteMany({});
    await GlobalSetting.create({
      logoImage: "/images/tara-devis-seal.png",
      adminLogo: "/images/tara-devis-seal.png",
      favicon: "/images/tara-devis-seal.png",
      adminTitle: "Tara Devi's Group",
      footerDescription: "Tara Devi's Group — First-generation visionaries setting a new standard for luxury mountain living in Himachal Pradesh. Uncompromising standards, worthy of its landscapes.",
      primaryEmail: "careers@taradevis.com",
      primaryPhone: "+91-9871177761",
      footerPhone: "+91-9871177761",
      address: "Tara Devi Enclave, Shimla & Kufri Foothills, Himachal Pradesh, India",
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com", icon: "bi-instagram", isActive: true },
        { platform: "LinkedIn", url: "https://linkedin.com", icon: "bi-linkedin", isActive: true },
        { platform: "Facebook", url: "https://facebook.com", icon: "bi-facebook", isActive: true },
      ],
    });
    console.log("✅ Global Settings seeded with Tara Devi's brand & seal");

    // 3. Hero Banners
    await Banner.deleteMany({});
    await Banner.create([
      {
        title: "Setting a New Standard for Luxury Mountain Living",
        subtitle: "Tara Devi Enclave — Premium 2 & 3 BHK Mountain Residences Under Active Construction in Shimla",
        url: "#residences",
        buttonText: "Explore Residences",
        image: "/images/tara-enclave-banner-2.jpg",
        alt: "Tara Devi Enclave Mountain View",
        status: "active",
        sort: 1,
      },
      {
        title: "Where Modern Architecture Meets Himalayan Serenity",
        subtitle: "Tara Devi Enclave — Harmonized with Natural Alpine Topography & Ancient Deodar Pine Slopes at 6,200+ Ft.",
        url: "#enquire",
        buttonText: "Schedule Site Visit",
        image: "/images/tara-enclave-banner-1.jpg",
        alt: "Luxury Himalayan Mountain Villa",
        status: "active",
        sort: 2,
      },
    ]);
    console.log("✅ Hero Banners seeded");

    // 4. Home About
    await HomeAbout.deleteMany({});
    await HomeAbout.create({
      title: "First-Generation Visionaries Setting a New Standard for Luxury Mountain Living in Himachal",
      description: "Tara Devi’s Group was founded on a single conviction: that Himachal Pradesh deserves residences of an uncompromising standard, worthy of its landscapes. As first-generation developers, we build without inherited shortcuts or conventional builder thinking. Our approach is defined by clarity of vision, humility and meticulous attention to detail. We do not simply construct buildings; we create homes of lasting value. Every Tara Devi’s Group project is designed to bring contemporary luxury into harmony with the natural topography, offering those who seek a retreat in the hills a residence of permanence, refinement and complete peace of mind. Guided by the blessings of Maa Tara Devi, we build with humility and a long-term commitment to our customers.",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop",
      alt: "Tara Devi's Mountain Retreat",
    });
    console.log("✅ Home About seeded");

    // 5. Home Extra (Section Titles)
    await HomeExtra.deleteMany({});
    await HomeExtra.create({
      choose_title: "Metro Living Conveniences in the Calm of the Mountains",
      choose_subtitle: "The Tara Devi's Standard",
      product_title: "Our Signature Mountain Developments",
      product_subtitle: "Handcrafted for permanence, elegance, and peace of mind",
      work_title: "Curated Amenities & Mountain Experiences",
      work_subtitle: "Contemporary comfort harmonized with Himalayan topography",
      contact_title: "Schedule Your Private Himalayan Consultation",
      contact_subtitle: "Connect directly with our senior advisory team in Shimla, Delhi NCR, and Chandigarh",
    });
    console.log("✅ Home Extra seeded");

    // 6. Why Choose / Amenities
    await WhyChoose.deleteMany({});
    await WhyChoose.create([
      {
        title: "High-Altitude Engineering & Seismic Safety",
        icon: "bi-shield-check",
        content: "Engineered specifically for high-altitude mountain topography with earthquake-resistant structural frameworks adhering to stringent seismic safety standards.",
        status: "active",
        sort: 1,
      },
      {
        title: "Metro Living Conveniences",
        icon: "bi-lightning-charge",
        content: "Bringing metro infrastructure to mountain sanctuaries: dedicated high-speed optical fiber, 24/7 power backup, central heating provisions, and smart home automation.",
        status: "active",
        sort: 2,
      },
      {
        title: "Sustainable Topography Integration",
        icon: "bi-tree",
        content: "Zero-waste construction methodologies and eco-conscious architectural layouts that naturally contour with the hillside, preserving native deodars and pines.",
        status: "active",
        sort: 3,
      },
      {
        title: "Himalayan Wellness & Heated Pool",
        icon: "bi-water",
        content: "Year-round temperature-controlled infinity pool overlooking breathtaking valleys, accompanied by a curated mountain spa and meditation pavilion.",
        status: "active",
        sort: 4,
      },
      {
        title: "Pristine Himalayan Air & Elevation",
        icon: "bi-cloud-sun",
        content: "Perched above 6,500 feet elevation with pristine Air Quality Index (AQI consistently sub-25), providing unpolluted alpine freshness for life.",
        status: "active",
        sort: 5,
      },
      {
        title: "Gated Security & Estate Concierge",
        icon: "bi-key",
        content: "Round-the-clock 3-tier surveillance, biometric access, on-demand housekeeping, and private concierge to cater to every residential requirement.",
        status: "active",
        sort: 6,
      },
    ]);
    console.log("✅ Why Choose & Amenities seeded");

    // 7. Categories & Residences
    await Category.deleteMany({});
    const cat = await Category.create({
      name: "Mountain Residences",
      slug: "residences",
      isActive: true,
      sort: 1,
    });

    await Product.deleteMany({});
    await Product.create([
      {
        name: "Tara Devi Enclave — Shimla",
        slug: "tara-devi-enclave-shimla",
        category: cat._id,
        grade: "Under Active Construction • 2 & 3 BHK Luxury Residences",
        description: "Situated in the tranquil foothills of Shimla, Tara Devi Enclave is under active construction. Each residence offers floor-to-ceiling panoramic glass windows, expansive cantilevered timber decks overlooking verdant pine slopes, radiant underfloor heating, and Italian marble finishes. Created for those seeking an uncompromising mountain retreat.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
        alt: "Tara Devi Enclave Shimla",
        sort: 1,
        isActive: true,
      },
      {
        name: "Tara Devi Luxury Villas — Kufri",
        slug: "tara-devi-luxury-villas-kufri",
        category: cat._id,
        grade: "Planned Private Mountain Estates • 4 & 5 BHK",
        description: "An exclusive private enclave planned for Kufri at majestic mountain elevation. These bespoke hillside villas feature sweeping views of snow-dusted Himalayan peaks, expansive private forest lawns, wood-burning stone hearths, private heated Jacuzzis, and personalized butler service.",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
        alt: "Tara Devi Luxury Villas Kufri",
        sort: 2,
        isActive: true,
      },
    ]);
    console.log("✅ Projects & Residences seeded");

    // 8. Gallery
    await GalleryImage.deleteMany({});
    await GalleryImage.create([
      {
        caption: "Panoramic Himalayan Valley View from Tara Devi Enclave",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
        date: "2026",
        sort: 1,
        isActive: true,
      },
      {
        caption: "Contemporary Mountain Living Room with Hearth & Cedar Wood",
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
        date: "2026",
        sort: 2,
        isActive: true,
      },
      {
        caption: "Sunset Over Kufri Peaks & Private Forest Estates",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
        date: "2026",
        sort: 3,
        isActive: true,
      },
      {
        caption: "Architectural Deck Overlooking Ancient Pine Canopies",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
        date: "2026",
        sort: 4,
        isActive: true,
      },
    ]);
    console.log("✅ Gallery seeded");

    // 9. Home SEO
    await HomeSeo.deleteMany({});
    await HomeSeo.create({
      pageSlug: "home",
      title: "Tara Devi's Group | Luxury Mountain Residences in Shimla & Kufri",
      metaDescription: "Tara Devi's Group sets a new standard for luxury mountain living in Himachal Pradesh. Explore Tara Devi Enclave in Shimla and luxury planned villas in Kufri.",
      canonicalUrl: "https://taradevis.com",
      ogTitle: "Tara Devi's Group — Setting a New Standard for Luxury Mountain Living",
      ogDescription: "Contemporary luxury in harmony with Himalayan topography. Uncompromising standard, worthy of Himachal's landscapes.",
      ogImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
      h1: "Tara Devi's Group — Setting a New Standard for Luxury Mountain Living in Himachal",
    });
    console.log("✅ Home SEO seeded");

    console.log("\n🎉 ALL TARA DEVI'S DATA SUCCESSFULLY SEEDED INTO taradevis_db!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();

