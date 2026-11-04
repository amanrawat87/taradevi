"use client";

import { useState } from "react";
import Image from "next/image";

export default function ResidenceShowcase({ residences = [] }) {
  const defaultResidences = [
    {
      _id: "res-1",
      name: "Tara Devi Enclave — Shimla",
      grade: "2 & 3 BHK Luxury Mountain Residences",
      badge: "Under Active Construction",
      elevation: "6,500 ft",
      climate: "Temperate",
      possession: "End 2026",
      image: "/images/residence-property-1.jpg",
    },
    {
      _id: "res-2",
      name: "Tara Devi Luxury Villas — Kufri",
      grade: "4 & 5 BHK Private Mountain Estates",
      badge: "Planned Exclusive Enclave",
      elevation: "7,000 ft",
      climate: "Temperate",
      possession: "End 2027",
      image: "/images/residence-property-2.jpg",
    },
  ];

  // Merge live database residences from Dashboard with authentic defaults
  const activeResidences =
    residences && residences.length > 0
      ? residences.map((res, idx) => {
          const fallback = defaultResidences[idx] || defaultResidences[0];

          let badge = fallback.badge;
          let grade = res.grade || fallback.grade;
          if (res.grade && res.grade.includes("•")) {
            const parts = res.grade.split("•");
            badge = parts[0].trim();
            grade = parts[1].trim();
          }

          const cleanName = res.name
            ? res.name.replace(/\?+/g, "—").replace(/—\s*—/g, "—")
            : fallback.name;

          return {
            _id: res._id || fallback._id,
            name: cleanName,
            grade: grade.replace(/\?+/g, "•"),
            badge: res.badge || badge,
            elevation: res.elevation || fallback.elevation,
            climate: res.climate || fallback.climate,
            possession: res.possession || fallback.possession,
            // Prioritize the live image uploaded from the dashboard
            image: res.image || fallback.image,
          };
        })
      : defaultResidences;

  // Active development filter: "all" | 0 | 1
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleOpenModal = (e) => {
    if (e) e.stopPropagation();
    window.dispatchEvent(new CustomEvent("open-site-visit-modal"));
  };

  const filteredResidences =
    selectedFilter === "all"
      ? activeResidences
      : activeResidences.filter((_, idx) => idx === selectedFilter);

  return (
    <section
      id="residences"
      className="relative py-12 bg-[#FAF8F5] border-t border-[#CFA86E]/20"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-[#CFA86E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#CFA86E]">
                Signature Developments
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] tracking-tight">
              Homes of Lasting Value in Himachal
            </h2>
          </div>

          {/* Quick Filter Switcher Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-[#0E3326] text-white shadow-sm"
                  : "bg-white text-[#0E3326] border border-[#CFA86E]/30 hover:border-[#CFA86E]"
              }`}
            >
              All Developments ({activeResidences.length})
            </button>
            {activeResidences.map((r, i) => (
              <button
                key={r._id || i}
                onClick={() => setSelectedFilter(i)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedFilter === i
                    ? "bg-[#0E3326] text-white shadow-sm"
                    : "bg-white text-[#0E3326] border border-[#CFA86E]/30 hover:border-[#CFA86E]"
                }`}
              >
                {r.name && r.name.toLowerCase().includes("kufri") ? "Kufri Villas" : "Shimla Enclave"}
              </button>
            ))}
          </div>
        </div>

        {/* ── FULL-WIDTH LUXURY SHOWCASE (STATIC IMAGES — NO SLIDER) ── */}
        <div className="flex flex-col gap-10 w-full">
          {filteredResidences.map((res, index) => {
            return (
              <div
                key={res._id || index}
                className="group relative w-full rounded-2xl border border-[#CFA86E]/40 bg-[#081E16] overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#CFA86E] transition-all duration-300 flex flex-col"
              >
                {/* ── EXPANSIVE FULL-WIDTH PROPERTY IMAGE WITH FROSTED GLASS PANE ── */}
                <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] xl:h-[560px] overflow-hidden bg-[#0A1A14] select-none">
                  <Image
                    src={res.image}
                    alt={res.name}
                    fill
                    sizes="100vw"
                    className="object-cover transition-all duration-700 brightness-[0.95] group-hover:scale-105"
                    priority={index === 0}
                  />

                  {/* Subtle Vignette for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/60 pointer-events-none" />

                  {/* ── MINIMAL LUXURY OVERLAY AT TOP ── */}
                  <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-start justify-between z-10 pointer-events-auto gap-4">
                    <div>
                      <span className="inline-block rounded-full bg-[#0E3326]/90 backdrop-blur-md px-3 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-[#E4C794] border border-[#CFA86E]/40 shadow-md mb-1.5">
                        {res.badge}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-white drop-shadow-md">
                        {res.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/85 font-light mt-0.5 tracking-wide">
                        {res.grade}
                      </p>
                    </div>

                    {/* Book Site Visit Quick Action Button */}
                    <button
                      onClick={handleOpenModal}
                      type="button"
                      className="rounded-full bg-gradient-to-r from-[#CFA86E] via-[#E4C794] to-[#CFA86E] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0E3326] shadow-lg transition-transform hover:scale-105 cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      Schedule Site Visit
                    </button>
                  </div>

                  {/* ── FROSTED GLASS PANE STATS RIBBON (COMPACT & REFINED) ── */}
                  <div className="absolute bottom-0 inset-x-0 z-20 bg-[#081E16]/60 backdrop-blur-xl border-t border-white/15 shadow-[0_-6px_28px_rgba(0,0,0,0.35)] py-3.5 px-6 sm:px-8 flex items-center justify-between">
                    {/* Golden specular glass reflection line at the top */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#CFA86E]/50 to-transparent pointer-events-none" />

                    {/* Compact, Left-Aligned Stats Group (Not Stretched) */}
                    <div className="flex items-center gap-8 sm:gap-14 text-left">
                      {/* Elevation */}
                      <div className="flex flex-col">
                        <span className="font-serif text-lg sm:text-xl text-white font-normal leading-tight drop-shadow-sm">
                          {res.elevation}
                        </span>
                        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#E4C794] uppercase font-medium mt-0.5">
                          ELEVATION
                        </span>
                      </div>

                      {/* Climate */}
                      <div className="flex flex-col">
                        <span className="font-serif text-lg sm:text-xl text-white font-normal leading-tight drop-shadow-sm">
                          {res.climate}
                        </span>
                        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#E4C794] uppercase font-medium mt-0.5">
                          CLIMATE
                        </span>
                      </div>

                      {/* Possession */}
                      <div className="flex flex-col">
                        <span className="font-serif text-lg sm:text-xl text-white font-normal leading-tight drop-shadow-sm">
                          {res.possession}
                        </span>
                        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#E4C794] uppercase font-medium mt-0.5">
                          POSSESSION
                        </span>
                      </div>
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
