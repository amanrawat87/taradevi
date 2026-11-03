"use client";

import Image from "next/image";
import Link from "next/link";

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
      slug: "tara-devi-enclave-shimla",
      specs: [
        { label: "Configuration", val: "2 & 3 BHK Luxury" },
        { label: "Area", val: "1,450 – 2,350 Sq. Ft." },
        { label: "Elevation", val: "6,200 Ft. Above Sea Level" },
      ],
    },
    {
      _id: "res-2",
      name: "Tara Devi Luxury Villas — Kufri",
      grade: "Planned Private Mountain Estates • 4 & 5 BHK",
      description:
        "An exclusive private enclave planned for Kufri at majestic high elevation. Bespoke hillside villas with sweeping views of snow-dusted peaks, private forest lawns, and stone hearths.",
      image: "/images/residence-property-2.jpg",
      badge: "Planned Exclusive Enclave",
      slug: "tara-devi-luxury-villas-kufri",
      specs: [
        { label: "Configuration", val: "4 & 5 BHK Bespoke Villas" },
        { label: "Area", val: "3,800 – 5,800 Sq. Ft." },
        { label: "Elevation", val: "7,800 Ft. High Alpine" },
      ],
    },
  ];

  const authenticImages = [
    "/images/residence-property-1.jpg",
    "/images/residence-property-2.jpg",
  ];

  const baseItems = residences && residences.length > 0 ? residences : defaultResidences;
  const items = baseItems.slice(0, 2).map((res, idx) => ({
    ...res,
    image:
      !res.image || res.image.includes("unsplash.com")
        ? authenticImages[idx % authenticImages.length]
        : res.image,
  }));

  return (
    <section
      id="residences"
      className="relative py-[60px] bg-[#FFFFFF] flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "60px", paddingBottom: "60px" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header: Compact */}
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

        {/* 2-Column Side-by-Side Grid: Fits in 100vh without cutting off */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.slice(0, 2).map((res, index) => {
            const specs = res.specs || [
              { label: "Status", val: res.grade?.split("•")[0]?.trim() || "Active" },
              { label: "Type", val: res.grade?.split("•")[1]?.trim() || "Residences" },
              { label: "Elevation", val: "High Altitude" },
            ];

            return (
              <div
                key={res._id || index}
                className="group relative rounded-2xl border border-[#CFA86E]/30 bg-[#F7F9F6] p-5 shadow-md hover:border-[#CFA86E] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badge */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-black/5 shadow-sm">
                    <Image
                      src={res.image || defaultResidences[index % 2].image}
                      alt={res.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-[#0E3326]/85 backdrop-blur-md px-3 py-1 text-[10px] font-semibold text-[#E4C794] border border-[#CFA86E]/30">
                      {res.badge || "Signature Development"}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#CFA86E]">
                      {res.grade}
                    </p>
                    <h3 className="font-serif text-xl font-light text-[#0E3326] mt-1">
                      {res.name}
                    </h3>
                    <p className="mt-2 text-xs text-[#5A6E65] leading-relaxed font-light line-clamp-2">
                      {res.description}
                    </p>
                  </div>
                </div>

                {/* Specs Pills & CTA */}
                <div className="mt-4 pt-3 border-t border-[#CFA86E]/20">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {specs.slice(0, 3).map((sp, sIdx) => (
                      <div key={sIdx} className="bg-white/80 p-2 rounded-lg border border-black/5">
                        <span className="block text-[9px] uppercase tracking-wider text-[#A27E47] font-semibold">
                          {sp.label}
                        </span>
                        <span className="block text-[11px] font-medium text-[#0E3326] truncate">
                          {sp.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("open-site-visit-modal"))}
                      type="button"
                      className="rounded-full bg-[#0E3326] px-4 py-2 text-[11px] font-semibold text-white hover:bg-[#1A5A44] transition-colors cursor-pointer"
                    >
                      Book Private Site Tour
                    </button>
                    <Link
                      href={`/residences/${res.slug || (index === 0 ? "tara-devi-enclave-shimla" : "tara-devi-luxury-villas-kufri")}`}
                      className="text-xs font-semibold text-[#1A5A44] hover:text-[#CFA86E] transition-colors inline-flex items-center gap-1"
                      style={{ textDecoration: "none" }}
                    >
                      <span>Full Portfolio</span>
                      <span>→</span>
                    </Link>
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
