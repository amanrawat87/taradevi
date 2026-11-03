"use client";

import { useState } from "react";
import Image from "next/image";

export default function ResidenceShowcase({ residences = [] }) {
  // Rich multi-photo gallery for each residence
  const defaultResidences = [
    {
      _id: "res-1",
      name: "Tara Devi Enclave — Shimla",
      grade: "2 & 3 BHK Mountain Residences",
      badge: "Under Active Construction",
      elevation: "6,500 ft",
      climate: "Temperate",
      possession: "End 2026",
      images: [
        "/images/residence-property-1.jpg",
        "/images/tara-enclave-banner-1.jpg",
        "/images/tara-enclave-banner-2.jpg",
        "/images/tara-gallery-1.jpg",
      ],
    },
    {
      _id: "res-2",
      name: "Tara Devi Luxury Villas — Kufri",
      grade: "4 & 5 BHK Private Mountain Estates",
      badge: "Planned Exclusive Enclave",
      elevation: "7,000 ft",
      climate: "Temperate",
      possession: "End 2027",
      images: [
        "/images/residence-property-2.jpg",
        "/images/tara-gallery-2.jpg",
        "/images/tara-gallery-3.jpg",
        "/images/slide2.jpg",
      ],
    },
  ];

  // Track active slide index for each card independently
  const [activeSlides, setActiveSlides] = useState({ 0: 0, 1: 0 });

  const handlePrevSlide = (e, cardIndex, total) => {
    e.stopPropagation();
    setActiveSlides((prev) => ({
      ...prev,
      [cardIndex]: prev[cardIndex] === 0 ? total - 1 : prev[cardIndex] - 1,
    }));
  };

  const handleNextSlide = (e, cardIndex, total) => {
    e.stopPropagation();
    setActiveSlides((prev) => ({
      ...prev,
      [cardIndex]: (prev[cardIndex] + 1) % total,
    }));
  };

  const handleOpenModal = (e) => {
    if (e) e.stopPropagation();
    window.dispatchEvent(new CustomEvent("open-site-visit-modal"));
  };

  return (
    <section
      id="residences"
      className="relative py-10 bg-[#FAF8F5] flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-[#CFA86E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#CFA86E]">
                Section 04 • Signature Developments
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] tracking-tight">
              Homes of Lasting Value in Himachal
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[#5A6E65] font-light leading-relaxed">
            Every project brings contemporary luxury into complete harmony with natural topography, delivering permanence and peace of mind.
          </p>
        </div>

        {/* 2-Column Side-by-Side Visual Showcase Cards (Image-Predominant) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {defaultResidences.map((res, index) => {
            const currentSlide = activeSlides[index] || 0;
            const images = res.images;

            return (
              <div
                key={res._id || index}
                className="group relative rounded-2xl border border-[#CFA86E]/30 bg-[#081E16] overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#CFA86E] transition-all duration-300 flex flex-col"
              >
                {/* ── EXPANSIVE HIGH-RESOLUTION IMAGE CONTAINER ── */}
                <div className="relative w-full h-[400px] sm:h-[460px] md:h-[490px] overflow-hidden bg-[#0A1A14] select-none">
                  {/* Active Property Image */}
                  <Image
                    src={images[currentSlide]}
                    alt={`${res.name} Photo ${currentSlide + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-all duration-700 brightness-[0.95] group-hover:scale-105"
                    priority={index === 0}
                  />

                  {/* Subtle Vignette Gradient for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/60 pointer-events-none" />

                  {/* ── OVERLAID MINIMAL TOP HEADER ── */}
                  <div className="absolute top-0 inset-x-0 p-5 sm:p-6 flex items-start justify-between z-10 pointer-events-auto">
                    <div>
                      <span className="inline-block rounded-full bg-[#0E3326]/90 backdrop-blur-md px-3.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#E4C794] border border-[#CFA86E]/40 shadow-md mb-2">
                        {res.badge}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white drop-shadow-md">
                        {res.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 font-light mt-0.5 tracking-wide">
                        {res.grade}
                      </p>
                    </div>

                    {/* Book Site Visit Quick Button */}
                    <button
                      onClick={handleOpenModal}
                      type="button"
                      className="rounded-full bg-gradient-to-r from-[#CFA86E] via-[#E4C794] to-[#CFA86E] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0E3326] shadow-lg transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      Book Visit
                    </button>
                  </div>

                  {/* ── SLIDE NAVIGATION CHEVRONS ── */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => handlePrevSlide(e, index, images.length)}
                        aria-label="Previous Photo"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-20 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => handleNextSlide(e, index, images.length)}
                        aria-label="Next Photo"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-20 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Pagination Indicator Dots */}
                      <div className="absolute bottom-3.5 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
                        {images.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              dotIdx === currentSlide
                                ? "w-6 bg-[#CFA86E]"
                                : "w-1.5 bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* ── SOLID DEEP FOREST GREEN STATS RIBBON (EXACT REFERENCE DESIGN) ── */}
                <div className="bg-[#0A2318] py-4 sm:py-5 px-4 sm:px-6 border-t border-[#CFA86E]/20 z-10">
                  <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
                    {/* Elevation */}
                    <div className="px-2">
                      <span className="block font-serif text-xl sm:text-2xl text-white font-light tracking-wide leading-tight">
                        {res.elevation}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] tracking-[0.25em] text-[#CFA86E] uppercase font-semibold mt-1">
                        ELEVATION
                      </span>
                    </div>

                    {/* Climate */}
                    <div className="px-2">
                      <span className="block font-serif text-xl sm:text-2xl text-white font-light tracking-wide leading-tight">
                        {res.climate}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] tracking-[0.25em] text-[#CFA86E] uppercase font-semibold mt-1">
                        CLIMATE
                      </span>
                    </div>

                    {/* Possession */}
                    <div className="px-2">
                      <span className="block font-serif text-xl sm:text-2xl text-white font-light tracking-wide leading-tight">
                        {res.possession}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] tracking-[0.25em] text-[#CFA86E] uppercase font-semibold mt-1">
                        POSSESSION
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
