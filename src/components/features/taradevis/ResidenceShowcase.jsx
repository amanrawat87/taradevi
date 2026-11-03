"use client";

import Image from "next/image";

export default function ResidenceShowcase({ residences = [] }) {
  const defaultResidences = [
    {
      _id: "res-1",
      name: "Tara Devi Enclave — Shimla",
      grade: "Under Active Construction • 2 & 3 BHK Luxury Residences",
      description:
        "Situated in the tranquil foothills of Shimla. Floor-to-ceiling panoramic glass windows, expansive cantilevered timber decks overlooking pine slopes, and radiant underfloor heating provisions.",
      image: "/images/residence-property-1.jpg",
      badge: "Under Active Construction",
      elevation: "6,500 ft",
      climate: "Temperate",
      possession: "End 2026",
    },
    {
      _id: "res-2",
      name: "Tara Devi Luxury Villas — Kufri",
      grade: "Planned Private Mountain Estates • 4 & 5 BHK",
      description:
        "An exclusive private enclave planned for Kufri at majestic high elevation. Bespoke hillside villas with sweeping views of snow-dusted Himalayan peaks, private forest lawns, and stone hearths.",
      image: "/images/residence-property-2.jpg",
      badge: "Planned Exclusive Enclave",
      elevation: "7,000 ft",
      climate: "Temperate",
      possession: "End 2027",
    },
  ];

  const authenticImages = [
    "/images/residence-property-1.jpg",
    "/images/residence-property-2.jpg",
  ];

  const baseItems = residences && residences.length > 0 ? residences : defaultResidences;
  const items = baseItems.slice(0, 2).map((res, idx) => ({
    ...res,
    name: res.name || defaultResidences[idx].name,
    grade: res.grade || defaultResidences[idx].grade,
    description: res.description || defaultResidences[idx].description,
    badge: res.badge || defaultResidences[idx].badge,
    elevation: res.elevation || (idx === 0 ? "6,500 ft" : "7,000 ft"),
    climate: res.climate || "Temperate",
    possession: res.possession || (idx === 0 ? "End 2026" : "End 2027"),
    image:
      !res.image || res.image.includes("unsplash.com")
        ? authenticImages[idx % authenticImages.length]
        : res.image,
  }));

  const handleOpenModal = () => {
    window.dispatchEvent(new CustomEvent("open-site-visit-modal"));
  };

  const handleScrollToWalkthrough = (e) => {
    e.preventDefault();
    const elem = document.getElementById("walkthrough");
    if (elem) {
      const headerOffset = 70;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
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

        {/* 2-Column Luxury Side-by-Side Residence Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {items.slice(0, 2).map((res, index) => {
            return (
              <div
                key={res._id || index}
                className="group relative rounded-2xl border border-[#CFA86E]/30 bg-white overflow-hidden shadow-lg hover:border-[#CFA86E] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* ── TOP: FULL-BLEED IMAGE + SPECS RIBBON (MATCHING REFERENCE DESIGN) ── */}
                <div className="w-full">
                  {/* Property Image Container */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#0A1A14]">
                    <Image
                      src={res.image || defaultResidences[index % 2].image}
                      alt={res.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                    {/* Floating Status Pill */}
                    <div className="absolute top-4 left-4 rounded-full bg-[#0E3326]/85 backdrop-blur-md px-3.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#E4C794] border border-[#CFA86E]/40 shadow-md">
                      {res.badge || "Signature Development"}
                    </div>
                  </div>

                  {/* ── ALPINE STATS RIBBON (ELEVATION • CLIMATE • POSSESSION) ── */}
                  <div className="bg-[#0A2318] py-4 sm:py-5 px-4 sm:px-6 border-t border-b border-[#CFA86E]/20">
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

                {/* ── BOTTOM: CARD CONTENT & CALLS TO ACTION ── */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CFA86E] mb-2">
                      {res.grade}
                    </p>
                    <h3 className="font-serif text-2xl font-light text-[#0E3326] leading-snug">
                      {res.name}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-[#5A6E65] font-light leading-relaxed line-clamp-3">
                      {res.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-5 border-t border-[#CFA86E]/20 flex items-center justify-between gap-3">
                    <button
                      onClick={handleOpenModal}
                      type="button"
                      className="rounded-full bg-[#0E3326] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#1A5A44] transition-all shadow-md hover:shadow-lg hover:scale-105 cursor-pointer flex-shrink-0"
                    >
                      Book Private Site Tour
                    </button>
                    <button
                      onClick={handleScrollToWalkthrough}
                      type="button"
                      className="rounded-full border border-[#0E3326]/20 px-4 py-2 text-xs font-semibold text-[#0E3326] hover:bg-[#0E3326] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>View Walkthrough</span>
                      <span>→</span>
                    </button>
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
