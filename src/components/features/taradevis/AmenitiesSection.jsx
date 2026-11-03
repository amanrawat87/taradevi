"use client";

export default function AmenitiesSection({ amenities = [] }) {
  const defaultAmenities = [
    {
      title: "High-Altitude Engineering & Seismic Safety",
      content:
        "Engineered for high-altitude mountain topography with earthquake-resistant structural frameworks adhering to stringent seismic safety codes.",
      icon: "01",
    },
    {
      title: "Metro Living Conveniences",
      content:
        "Dedicated high-speed optical fiber, 24/7 power backup, central heating provisions, and smart home automation in mountain calm.",
      icon: "02",
    },
    {
      title: "Sustainable Topography Integration",
      content:
        "Zero-waste construction methodologies and eco-conscious architectural layouts that naturally contour with the hillside deodar slopes.",
      icon: "03",
    },
    {
      title: "Himalayan Wellness & Heated Pool",
      content:
        "Year-round temperature-controlled infinity pool overlooking breathtaking pine valleys, accompanied by a mountain meditation pavilion.",
      icon: "04",
    },
    {
      title: "Pristine Himalayan Air & Elevation",
      content:
        "Perched above 6,200 feet elevation with pristine Air Quality Index (AQI sub-25), providing unpolluted alpine freshness for life.",
      icon: "05",
    },
    {
      title: "Gated Security & Estate Concierge",
      content:
        "Round-the-clock 3-tier surveillance, biometric access, on-demand housekeeping, and private concierge for every residential need.",
      icon: "06",
    },
  ];

  const items = amenities && amenities.length > 0 ? amenities : defaultAmenities;

  return (
    <section
      id="amenities"
      className="relative py-[60px] bg-[#FFFFFF] flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "60px", paddingBottom: "60px" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-[#CFA86E]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#CFA86E]">
              Section 05 • Amenities &amp; Lifestyle
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] tracking-tight">
            Metro Living Conveniences in Mountain Calm
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[#5A6E65] font-light leading-relaxed">
            Every Tara Devi's project is planned with meticulous attention to detail so residents enjoy serenity without compromising on urban comfort or connectivity.
          </p>
        </div>

        {/* Amenities Cards Grid: 6 compact items fitting in 100vh */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-[#CFA86E]/25 bg-[#F7F9F6] p-5 transition-all duration-300 hover:border-[#CFA86E] hover:shadow-lg hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-[#CFA86E]">
                    {item.icon || `0${index + 1}`}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#CFA86E]" />
                </div>

                <h3 className="font-serif text-base font-medium text-[#0E3326] leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-[#5A6E65] leading-relaxed font-light line-clamp-3">
                  {item.content || item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#CFA86E]/15 flex items-center justify-between text-[11px] text-[#1A5A44] font-medium">
                <span>Tara Devi's Standard</span>
                <span className="group-hover:translate-x-1 transition-transform">✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}