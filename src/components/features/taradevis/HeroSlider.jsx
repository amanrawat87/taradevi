"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AtmosphereCanvas from "./AtmosphereCanvas";

export default function HeroSlider({ slides = [] }) {
  const authenticSlides = [
    {
      _id: "banner-1",
      title: "Setting a New Standard for Luxury Mountain Living",
      subtitle:
        "Tara Devi Enclave — Premium 2 & 3 BHK Mountain Residences Under Active Construction in the Foothills of Shimla",
      buttonText: "Explore Residences",
      url: "#residences",
      image: "/images/tara-enclave-banner-2.jpg",
      alt: "Tara Devi Enclave Himalayan Valley Panorama",
    },
    {
      _id: "banner-2",
      title: "Where Modern Architecture Meets Himalayan Serenity",
      subtitle:
        "Tara Devi Enclave — Harmonized with Natural Alpine Topography & Ancient Deodar Pine Slopes at 6,200+ Ft.",
      buttonText: "Explore Residences",
      url: "#residences",
      image: "/images/tara-enclave-banner-1.jpg",
      alt: "Tara Devi Enclave Aerial Drone View",
    },
  ];

  // Map incoming slides to prioritize the authentic property banner photos
  const activeSlides =
    slides && slides.length > 0
      ? slides.map((s, idx) => ({
          ...s,
          image:
            !s.image || s.image.includes("unsplash.com")
              ? idx % 2 === 0
                ? "/images/tara-enclave-banner-2.jpg"
                : "/images/tara-enclave-banner-1.jpg"
              : s.image,
        }))
      : authenticSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 4500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 4500);

    return () => clearInterval(timerRef.current);
  }, [activeSlides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
    resetTimer();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    resetTimer();
  };

  const handleDotClick = (idx) => {
    setCurrentIndex(idx);
    resetTimer();
  };

  const current = activeSlides[currentIndex] || activeSlides[0];

  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-[#0A1A14]">
      {/* 3D Atmospheric Mist Canvas */}
      <AtmosphereCanvas />

      {/* Slide Background Images (Authentic Property Aerials) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={current.image || authenticSlides[0].image}
            alt={current.alt || current.title || "Tara Devi Enclave"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.92]"
          />
          {/* Subtle Overlays for Readability without Dimming the Landscape */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Container */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16 pt-24 sm:pt-28 pb-16">
          <div className="max-w-2xl">
            {/* Top Brand Crest Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#CFA86E]/40 bg-[#0E3326]/80 px-3.5 py-1 backdrop-blur-md mb-4"
            >
              <Image
                src="/images/tara-devis-seal.png"
                alt="Tara Devi's Seal"
                width={22}
                height={22}
                style={{ width: "22px", height: "22px", minWidth: "22px" }}
                className="object-contain"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E4C794]">
                Tara Devi's Group • Himachal Pradesh
              </span>
            </motion.div>

            {/* Dynamic Headline: Refined font size */}
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light leading-[1.15] text-white tracking-tight"
            >
              {current.title}
            </motion.h1>

            {/* Dynamic Subtitle: Compact font size */}
            <motion.p
              key={`sub-${currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 text-xs sm:text-sm text-slate-200/90 leading-relaxed font-light max-w-xl"
            >
              {current.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Link
                href={current.url && current.url !== "#enquire" ? current.url : "#residences"}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#CFA86E] via-[#E4C794] to-[#CFA86E] px-7 py-3 text-xs font-bold tracking-wider uppercase text-[#0E3326] shadow-lg shadow-[#CFA86E]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-[#CFA86E]/40"
                style={{ textDecoration: "none" }}
              >
                <span>
                  {current.buttonText && !current.buttonText.toLowerCase().includes("site visit")
                    ? current.buttonText
                    : "Explore Residences"}
                </span>
                <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-site-visit-modal"))}
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3 text-xs font-semibold tracking-wider uppercase text-white backdrop-blur-md transition-all duration-300 hover:border-[#CFA86E] hover:bg-white/20 cursor-pointer"
              >
                Schedule Site Visit
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Slider Navigation Pod */}
      <div className="absolute bottom-8 right-6 md:right-16 z-20 flex items-center gap-3 rounded-full border border-[#CFA86E]/35 bg-[#081E16]/80 px-3.5 py-1.5 backdrop-blur-md shadow-xl">
        {/* Prev Arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="text-[#E4C794] hover:text-white transition-colors p-1 cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Counter */}
        <span className="text-[11px] font-mono font-medium text-slate-300">
          0{currentIndex + 1} <span className="text-[#CFA86E]">/</span> 0{activeSlides.length}
        </span>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="text-[#E4C794] hover:text-white transition-colors p-1 cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/20">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? "w-5 bg-[#CFA86E]" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}