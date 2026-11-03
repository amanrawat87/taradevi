"use client";

import Link from "next/link";

export default function AlpineMetricsBar() {
  const metrics = [
    {
      id: "altitude",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      ),
      kicker: "ELEVATION",
      title: "6,500+ Feet",
      caption: "High Alpine Pine Belt",
      href: "#location",
    },
    {
      id: "air",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        </svg>
      ),
      kicker: "AIR PURITY",
      title: "Sub-25 AQI",
      caption: "Pristine Himalayan Freshness",
      href: "#location",
    },
    {
      id: "under-construction",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
        </svg>
      ),
      kicker: "UNDER CONSTRUCTION",
      title: "Tara Devi Enclave",
      caption: "Shimla • 2 & 3 BHK Mountain Residences",
      href: "#residences",
    },
    {
      id: "planned-estates",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      kicker: "PLANNED ESTATES",
      title: "Luxury Mountain Villas",
      caption: "Kufri • 4 & 5 BHK Private Sanctuaries",
      href: "#residences",
    },
  ];

  return (
    <section className="relative z-20 bg-[#081E16] text-white border-y border-[#CFA86E]/30 shadow-2xl py-6 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#CFA86E]/20">
          {metrics.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center text-center px-3 sm:px-6 py-2 transition-all duration-300 hover:bg-[#CFA86E]/5 rounded-xl"
            >
              {/* Icon & Kicker */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#CFA86E]/15 border border-[#CFA86E]/35 flex items-center justify-center text-[#E4C794] transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#CFA86E]">
                  {item.kicker}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-[#E4C794] transition-colors">
                {item.title}
              </h3>

              {/* Caption */}
              <p className="text-xs text-slate-300/85 font-light mt-1 tracking-wide leading-relaxed">
                {item.caption}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

