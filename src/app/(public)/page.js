import { cache } from "react";
import { connectDB } from "../lib/config";
import Banner from "../models/Banner";
import HomeAbout from "../models/HomeAbout";
import HomeExtra from "../models/HomeExtra";
import WhyChoose from "../models/whyChoose";
import Product from "../models/Product";
import GalleryImage from "../models/GalleryImage";
import HomeSeo from "../models/HomeSeo";
import GlobalSetting from "../models/GlobalSetting";

import HeroSlider from "src/components/features/taradevis/HeroSlider";
import AlpineMetricsBar from "src/components/features/taradevis/AlpineMetricsBar";
import AboutHeritage from "src/components/features/taradevis/AboutHeritage";
import VisionSection from "src/components/features/taradevis/VisionSection";
import ResidenceShowcase from "src/components/features/taradevis/ResidenceShowcase";
import LeadershipSection from "src/components/features/taradevis/LeadershipSection";
import VideoShowcase from "src/components/features/taradevis/VideoShowcase";
import GallerySection from "src/components/features/taradevis/GallerySection";
import CareersSection from "src/components/features/taradevis/CareersSection";
import EnquirySection from "src/components/features/taradevis/EnquirySection";

// Ensure dashboard updates (images, titles, residences) reflect immediately on the homepage
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Deduplicate the HomeSeo DB call — used in both generateMetadata and Home()
const getHomeSeo = cache(async () => {
  try {
    await connectDB();
    return await HomeSeo.findOne({ pageSlug: "home" }).lean();
  } catch (err) {
    console.error("Failed to fetch HomeSeo:", err);
    return null;
  }
});

export async function generateMetadata() {
  const seoData = await getHomeSeo();

  if (!seoData) {
    return {
      title: "Tara Devi's Group | Luxury Mountain Residences in Shimla & Kufri",
      description: "First-generation visionaries setting a new standard for luxury mountain living in Himachal Pradesh. Explore Tara Devi Enclave in Shimla and luxury mountain villas in Kufri.",
    };
  }

  return {
    title: seoData.title || "Tara Devi's Group | Luxury Mountain Residences in Himachal Pradesh",
    description: seoData.metaDescription || "First-generation visionaries setting a new standard for luxury mountain living in Himachal Pradesh.",
    alternates: {
      canonical: seoData.canonicalUrl || "https://taradevis.com",
    },
    openGraph: {
      title: seoData.ogTitle || seoData.title,
      description: seoData.ogDescription || seoData.metaDescription,
      images: seoData.ogImage ? [{ url: seoData.ogImage, width: 1200, height: 630, alt: seoData.title }] : [],
      type: "website",
      url: seoData.canonicalUrl || "https://taradevis.com",
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.ogTitle || seoData.title,
      description: seoData.ogDescription || seoData.metaDescription,
      images: seoData.ogImage ? [seoData.ogImage] : [],
    },
    robots: seoData.robots || "index, follow",
  };
}

export default async function Home() {
  const seoData = await getHomeSeo();

  let banners = [];
  let homeAbout = null;
  let homeExtra = null;
  let whyChooseList = [];
  let residences = [];
  let galleryImages = [];
  let globalSettings = null;

  try {
    await connectDB();

    const results = await Promise.all([
      Banner.find({ status: "active" }).sort({ sort: 1 }).lean(),
      HomeAbout.findOne().lean(),
      HomeExtra.findOne().lean(),
      WhyChoose.find({ status: "active" }).sort({ sort: 1 }).lean(),
      Product.find({ isActive: true }).sort({ sort: 1 }).lean(),
      GalleryImage.find({ isActive: true }).sort({ sort: 1 }).lean(),
      GlobalSetting.findOne().lean(),
    ]);

    banners = results[0] || [];
    homeAbout = results[1] || null;
    homeExtra = results[2] || null;
    whyChooseList = results[3] || [];
    residences = results[4] || [];
    galleryImages = results[5] || [];
    globalSettings = results[6] || null;
  } catch (err) {
    console.error("Home Data Fetching Error:", err);
  }

  // Deep serialize MongoDB documents for Client Components
  const serialize = (doc) => {
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#14221D] font-sans">
      {/* 1. Hero Section */}
      <HeroSlider slides={serialize(banners)} />

      {/* High Alpine Key Vitals & Project Metrics Ribbon */}
      <AlpineMetricsBar />

      {/* 2. About Us Story */}
      <AboutHeritage data={serialize(homeAbout)} />

      {/* 3. Our Vision: A Home for Every Need in the Hills */}
      <VisionSection />

      {/* 4. Cinematic Property Walkthrough (Tara Devi Enclave Film) */}
      <VideoShowcase />

      {/* 4. Signature Mountain Developments (Tara Devi Enclave & Kufri Villas) */}
      <ResidenceShowcase residences={serialize(residences)} />

      {/* 5. Leadership & Team */}
      <LeadershipSection />

      {/* 9. Visual Gallery */}
      <GallerySection images={serialize(galleryImages)} />

      {/* 10. Careers & Culture */}
      <CareersSection />

      {/* 11. Private Consultation & Site Visit Booking */}
      <EnquirySection />
    </main>
  );
}
