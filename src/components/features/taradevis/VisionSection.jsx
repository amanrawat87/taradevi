"use client";

import Link from "next/link";

export default function VisionSection() {
  const portfolios = [
    {
      type: "Studio Suites",
      subtitle: "Alpine Escapes for Creative Solitude",
      specs: "Compact Luxury • Forest Balcony • Smart Automation",
      description:
        "Intelligently designed open-plan studios for individuals and couples seeking a peaceful mountain workspace or weekend Himalayan getaway.",
      highlight: "High-Yield Mountain Homestays & Solo Retreats",
    },
    {
      type: "2 & 3 BHK Residences",
      subtitle: "Tara Devi Enclave — Shimla",
      specs: "Under Active Construction • Double-Height Decks • Radiant Warmth",
      description:
        "Expansive family homes with wide valley-facing balconies, sound-insulated double glazing, Italian marble accents, and master bedrooms gazing upon pine ridges.",
      highlight: "Under Active Construction in Shimla Foothills",
      featured: true,
    },
    {
      type: "Luxury Private Villas",
      subtitle: "Planned Private Estates — Kufri",
      specs: "Exclusive Gated Enclave • 4 & 5 BHK • Private Pine Lawns",
      description:
        "Bespoke hillside mansions featuring stone hearths, private indoor Jacuzzis, panoramic snow-peak views, and private helipad access.",
      highlight: "Planned for Kufri at Majestic High Alpine Elevations",
    },
  ];

  return (
    <section
      id="vision"
      className="relative py-[60px] bg-[#f3eee9] text-[#0E3326] overflow-hidden flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "60px", paddingBottom: "60px" }}
    >
      {/* 
        Luxury Background Texture & Glowing Effects on #f3eee9:
        - Architectural micro-dot pattern
        - Soft warm champagne / gold ambient glow
      */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(162, 126, 71, 0.35) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient Glowing Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-[#CFA86E]/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[380px] bg-[#E4C794]/25 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#CFA86E]/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-[#CFA86E]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A27E47]">
              Section 02 • Our Vision
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-[1.2] tracking-tight text-[#0E3326]">
            A Home for Every Need in the Hills
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#5A6E65] font-light leading-relaxed">
            Tara Devi’s Group provides a home for every need in the hills of Himachal Pradesh—spanning open-plan studio suites and 2 &amp; 3 BHK residences to bespoke mountain villas, delivering metro living conveniences in high-altitude peace.
          </p>
        </div>

        {/* Portfolio Cards Grid: Fits neatly in 100vh screen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolios.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${
                item.featured
                  ? "bg-[#0E3326] text-white border-2 border-[#CFA86E] shadow-2xl shadow-[#CFA86E]/25 md:-translate-y-1.5"
                  : "bg-white/90 border border-[#CFA86E]/35 text-[#0E3326] shadow-md hover:border-[#CFA86E] hover:bg-white hover:shadow-xl"
              }`}
            >
              {item.featured && (
                <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-[#CFA86E] to-[#E4C794] px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#081E16] shadow-md">
                  Active Construction
                </div>
              )}

              <div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-widest ${
                    item.featured ? "text-[#E4C794]" : "text-[#A27E47]"
                  }`}
                >
                  {item.subtitle}
                </span>

                <h3
                  className={`font-serif text-xl sm:text-2xl font-light mt-1.5 ${
                    item.featured ? "text-white" : "text-[#0E3326]"
                  }`}
                >
                  {item.type}
                </h3>

                <p
                  className={`mt-1.5 text-[11px] font-medium tracking-wide border-b pb-3 ${
                    item.featured
                      ? "text-slate-300/80 border-white/10"
                      : "text-[#5A6E65] border-[#CFA86E]/15"
                  }`}
                >
                  {item.specs}
                </p>

                <p
                  className={`mt-3 text-xs leading-relaxed font-light ${
                    item.featured ? "text-slate-200" : "text-[#5A6E65]"
                  }`}
                >
                  {item.description}
                </p>
              </div>

              <div
                className={`mt-6 pt-4 border-t ${
                  item.featured ? "border-white/10" : "border-[#CFA86E]/20"
                }`}
              >
                <p
                  className={`text-[11px] font-medium ${
                    item.featured ? "text-[#E4C794]" : "text-[#1A5A44]"
                  }`}
                >
                  {item.highlight}
                </p>
                <Link
                  href="#residences"
                  className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    item.featured
                      ? "text-white hover:text-[#E4C794]"
                      : "text-[#1A5A44] hover:text-[#CFA86E]"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  <span>Explore specifications</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}