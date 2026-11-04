"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export default function GallerySection({ images = [] }) {
  const defaultImages = [
    {
      _id: "gal-1",
      caption: "Tara Devi Enclave — Himalayan Valley & Mountain Horizon",
      url: "/images/tara-enclave-banner-2.jpg",
      category: "Vistas",
    },
    {
      _id: "gal-2",
      caption: "Tara Devi Residences — Multi-Story Hillside Elevation & Forest Backdrop",
      url: "/images/residence-property-1.jpg",
      category: "Architecture",
    },
    {
      _id: "gal-3",
      caption: "Panoramic Aerial View — Enclave Nestled in Pine Valleys",
      url: "/images/about-tara-devi.jpg",
      category: "Nature",
    },
    {
      _id: "gal-4",
      caption: "Tara Devi Enclave — Scenic Mountain Approach & Gated Living",
      url: "/images/tara-enclave-banner-1.jpg",
      category: "Vistas",
    },
    {
      _id: "gal-5",
      caption: "Signature Alpine Architecture & Distinctive Green Rooflines",
      url: "/images/residence-property-2.jpg",
      category: "Architecture",
    },
    {
      _id: "gal-6",
      caption: "Tara Devi Himalayan Sanctuary — Serene Forest Slopes at 6,200+ Ft.",
      url: "/images/tara-gallery-1.jpg",
      category: "Nature",
    },
  ];

  const galleryItems =
    images && images.length > 0 && !images[0]?.url?.includes("unsplash.com")
      ? images
      : defaultImages;
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = ["All", "Architecture", "Vistas", "Interiors", "Nature"];

  const filtered =
    activeTab === "All"
      ? galleryItems
      : galleryItems.filter((item) =>
          item.category
            ? item.category.toLowerCase() === activeTab.toLowerCase()
            : true
        );

  const handleClose = () => setLightboxIndex(null);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation & body scroll lock for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxIndex, filtered.length]);

  return (
    <section
      id="gallery"
      className="relative py-10 bg-[#F7F9F6] flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header with Tabs in 1 Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-[#CFA86E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#CFA86E]">
                Visual Gallery
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] tracking-tight">
              Life and Architecture in the Hills
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setLightboxIndex(null);
                }}
                className={`rounded-full px-3.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#0E3326] text-white shadow-sm"
                    : "bg-white text-[#5A6E65] hover:text-[#0E3326] border border-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Bento Grid: Asymmetric Architectural Editorial Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4">
          {/* Top Section: Hero Showcase (8 cols) */}
          {filtered[0] && (
            <div
              onClick={() => setLightboxIndex(0)}
              className={`group relative sm:col-span-2 ${
                filtered.length > 1 ? "lg:col-span-8" : "lg:col-span-12"
              } h-[280px] sm:h-[360px] lg:h-[450px] overflow-hidden rounded-2xl border border-[#CFA86E]/35 bg-black shadow-lg hover:shadow-2xl hover:border-[#CFA86E] transition-all duration-300 cursor-pointer`}
            >
              <Image
                src={filtered[0].url}
                alt={filtered[0].caption || "Tara Devi's Gallery Featured"}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                priority
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E3326]/85 backdrop-blur-md px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#E4C794] border border-[#CFA86E]/40 shadow-md">
                  ★ Featured Perspective
                </span>
              </div>
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-sm shadow-md">
                  ⤢
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 sm:p-6 transition-all">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#E4C794] font-semibold">
                  {filtered[0].category || "Himalayan Panorama"}
                </span>
                <p className="font-serif text-base sm:text-xl text-white font-light mt-1">
                  {filtered[0].caption}
                </p>
              </div>
            </div>
          )}

          {/* Right Column Stack (2 cards on desktop) */}
          {filtered.length > 1 && (
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 sm:gap-4">
              {filtered.slice(1, 3).map((img, idx) => (
                <div
                  key={img._id || idx + 1}
                  onClick={() => setLightboxIndex(idx + 1)}
                  className="group relative flex-1 h-[200px] sm:h-[170px] lg:h-[217px] overflow-hidden rounded-2xl border border-[#CFA86E]/30 bg-black shadow-md hover:shadow-xl hover:border-[#CFA86E] transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={img.url}
                    alt={img.caption || "Tara Devi's Gallery"}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-xs shadow-md">
                      ⤢
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] uppercase tracking-wider text-[#E4C794] font-semibold">
                      {img.category || "Architecture"}
                    </span>
                    <p className="font-serif text-xs sm:text-sm text-white font-light line-clamp-1 mt-0.5">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Row (Cards 3, 4, 5) — 3 Equal Panoramic Cards */}
          {filtered.slice(3, 6).map((img, idx) => (
            <div
              key={img._id || idx + 3}
              onClick={() => setLightboxIndex(idx + 3)}
              className="group relative sm:col-span-1 lg:col-span-4 h-[210px] sm:h-[230px] lg:h-[250px] overflow-hidden rounded-2xl border border-[#CFA86E]/30 bg-black shadow-md hover:shadow-xl hover:border-[#CFA86E] transition-all duration-300 cursor-pointer"
            >
              <Image
                src={img.url}
                alt={img.caption || "Tara Devi's Gallery"}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
              />
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-xs shadow-md">
                  ⤢
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] uppercase tracking-wider text-[#E4C794] font-semibold">
                  {img.category || "Himalayas"}
                </span>
                <p className="font-serif text-xs sm:text-sm text-white font-light line-clamp-1 mt-0.5">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal (Portal to body for absolute topmost z-index & clean viewport centering) */}
      {mounted && lightboxIndex !== null && filtered[lightboxIndex] && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200 select-none"
          onClick={handleClose}
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-50 pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="h-2 w-2 rounded-full bg-[#CFA86E]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E4C794] font-semibold">
                Tara Devi's Visual Gallery
              </span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/80 font-mono">
                {lightboxIndex + 1} / {filtered.length}
              </span>
            </div>

            <button
              onClick={handleClose}
              className="pointer-events-auto h-11 w-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              aria-label="Close Lightbox"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Previous Arrow Button */}
          {filtered.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 z-50 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/60 hover:bg-[#0E3326] border border-[#CFA86E]/40 text-[#E4C794] flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xl backdrop-blur-md"
              aria-label="Previous Image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Main Content Area */}
          <div
            className="relative max-w-6xl w-full flex flex-col items-center justify-center my-auto z-10 px-2 sm:px-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Direct High-Resolution Image Rendering */}
            <div className="relative max-h-[72vh] max-w-full flex items-center justify-center">
              <img
                src={filtered[lightboxIndex].url}
                alt={filtered[lightboxIndex].caption || "Tara Devi's Gallery"}
                className="max-h-[72vh] max-w-full object-contain rounded-2xl border border-[#CFA86E]/40 shadow-2xl shadow-black/90 select-none"
              />
            </div>

            {/* Bottom Caption Pill */}
            {filtered[lightboxIndex].caption && (
              <div className="mt-4 sm:mt-5 text-center max-w-2xl px-6 py-2.5 rounded-full bg-[#081E16]/90 border border-[#CFA86E]/35 backdrop-blur-md shadow-xl">
                <p className="font-serif text-xs sm:text-sm text-white font-light tracking-wide">
                  {filtered[lightboxIndex].caption}
                </p>
              </div>
            )}
          </div>

          {/* Next Arrow Button */}
          {filtered.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-6 z-50 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/60 hover:bg-[#0E3326] border border-[#CFA86E]/40 text-[#E4C794] flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xl backdrop-blur-md"
              aria-label="Next Image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>,
        document.body
      )}
    </section>
  );
}