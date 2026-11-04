"use client";

import Link from "next/link";

export default function CareersSection() {
  const roles = [
    {
      title: "Project & Site Engineers",
      area: "High-Altitude & Structural Safety",
      type: "Full-Time • Shimla / Kufri",
      desc: "Supervising earthquake-resistant structural execution, zero-waste protocols, and sustainable mountain logistics.",
    },
    {
      title: "Architectural & Interior Designers",
      area: "Mountain Vernacular & Modern Luxury",
      type: "Full-Time • Studio / On-Site",
      desc: "Designing spatial layouts that integrate modern elegance with indigenous slate, cedar wood, and stone.",
    },
    {
      title: "Sales & Relationship Managers",
      area: "HNI & NRI Client Advisory",
      type: "Full-Time • Delhi / Chandigarh / Shimla",
      desc: "Engaging with high-net-worth families seeking permanent luxury sanctuaries in Himachal Pradesh.",
    },
    {
      title: "Digital & Performance Specialists",
      area: "Brand Outreach & Growth",
      type: "Full-Time / Hybrid",
      desc: "Leading virtual site tours, performance campaigns, and high-tier luxury real estate positioning.",
    },
  ];

  return (
    <section
      id="careers"
      className="relative py-10 bg-[#F7F9F6] border-t border-[#CFA86E]/20 flex items-center"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Vision & Contact */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-[#CFA86E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#CFA86E]">
                Careers &amp; Culture
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] tracking-tight leading-[1.2]">
              Build the Future of Mountain Luxury with Us
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-[#5A6E65] font-light leading-relaxed">
              At Tara Devi’s Group, our greatest asset is our team of engineers, architects, and strategists. We seek talent who share our reverence for the Himalayas and uncompromising craftsmanship.
            </p>

            <div className="mt-6 rounded-xl border border-[#CFA86E]/30 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A27E47]">
                Ready to elevate your career?
              </p>
              <p className="text-xs text-[#0E3326] mt-1 font-medium">
                Send your CV and portfolio directly to:
              </p>
              <a
                href="mailto:careers@taradevis.com"
                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[#1A5A44] hover:text-[#CFA86E] transition-colors"
              >
                <span>careers@taradevis.com</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Roles Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((role, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-[#CFA86E]/20 bg-white p-4 transition-all duration-300 hover:border-[#CFA86E] hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#A27E47] bg-[#CFA86E]/10 px-2 py-0.5 rounded-full inline-block mb-1.5">
                    {role.type}
                  </span>
                  <h3 className="font-serif text-sm font-semibold text-[#0E3326]">
                    {role.title}
                  </h3>
                  <p className="text-[10px] font-semibold text-[#1A5A44] uppercase tracking-wider mt-0.5 mb-1.5">
                    {role.area}
                  </p>
                  <p className="text-xs text-[#5A6E65] leading-relaxed font-light line-clamp-3">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#1A5A44] font-medium">
                  <span>Apply Now</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}