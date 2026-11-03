"use client";

import Link from "next/link";

export default function LocationSection() {
  const connectivity = [
    {
      destination: "Maa Tara Devi Temple",
      time: "08 Mins",
      type: "Spiritual Sanctuary & Historic Heritage",
      distance: "4.2 km",
    },
    {
      destination: "Shimla Mall Road & Ridge",
      time: "15 Mins",
      type: "Colonial Cafes, Culture & High Street",
      distance: "9.8 km",
    },
    {
      destination: "Kalka-Shimla Toy Train",
      time: "25 Mins",
      type: "UNESCO World Heritage Rail Corridor",
      distance: "16 km",
    },
    {
      destination: "Kufri Skiing & Nature Park",
      time: "35 Mins",
      type: "High Alpine Snow Slopes & Forest Trails",
      distance: "22 km",
    },
    {
      destination: "Chandigarh Int'l Airport (IXC)",
      time: "2.5 Hours",
      type: "Seamless 4-Lane Himalayan Expressway",
      distance: "115 km",
    },
    {
      destination: "New Delhi NCR",
      time: "5.5 Hours",
      type: "Direct Drive via NH-5 & GT Corridor",
      distance: "330 km",
    },
  ];

  return (
    <section
      id="location"
      className="relative py-[60px] bg-[#f3eee9] text-[#0E3326] overflow-hidden flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "60px", paddingBottom: "60px" }}
    >
      {/* 
        Background Texture & Ambient Glows on #f3eee9 (Matching Section 06):
        - Architectural geometric mesh texture
        - Soft warm champagne / amber radial glows
      */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `linear-gradient(rgba(162,126,71,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(162,126,71,0.18) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#CFA86E]/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-[#E4C794]/25 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-[#CFA86E]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A27E47]">
              Section 05 • Strategic Himalayan Location
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] tracking-tight">
            Nestled in the Tranquil Foothills of Himachal
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[#5A6E65] font-light leading-relaxed">
            Perched at an invigorating elevation above 6,200 feet with effortless 4-lane expressway connectivity to Shimla, Chandigarh, and Delhi NCR.
          </p>
        </div>

        {/* Connectivity Matrix Grid: Compact & elegant, fits in 100vh */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectivity.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl border border-[#CFA86E]/25 bg-white p-5 transition-all duration-300 hover:border-[#CFA86E] hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A27E47]">
                    {item.distance}
                  </span>
                  <span className="rounded-full bg-[#0E3326]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0E3326]">
                    {item.time}
                  </span>
                </div>

                <h3 className="font-serif text-base font-medium text-[#0E3326]">
                  {item.destination}
                </h3>

                <p className="mt-1 text-xs text-[#5A6E65] font-light line-clamp-2">
                  {item.type}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#1A5A44] font-medium">
                <span>Scenic Route</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Location Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#CFA86E]/25">
          <p className="text-xs text-[#0E3326] font-medium flex items-center">
            <i className="fa-solid fa-location-dot text-[#A27E47] mr-2"></i>
            <span>Site Visits operate daily from Shimla &amp; Chandigarh with private vehicle pickup.</span>
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-site-visit-modal"))}
            type="button"
            className="rounded-full bg-[#0E3326] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1A5A44] transition-colors whitespace-nowrap cursor-pointer"
          >
            Plan Your Route &amp; Visit →
          </button>
        </div>
      </div>
    </section>
  );
}