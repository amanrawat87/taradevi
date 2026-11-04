"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutHeritage({ data }) {
  const defaultHeadline =
    "First-Generation Visionaries Setting a New Standard for Luxury Mountain Living in Himachal";
  const defaultStory =
    "Tara Devi’s Group was founded on a single conviction: that Himachal Pradesh deserves residences of an uncompromising standard, worthy of its landscapes. As first-generation developers, we build without inherited shortcuts or conventional builder thinking. Our approach is defined by clarity of vision, humility and meticulous attention to detail.\n\nWe do not simply construct buildings; we create homes of lasting value. Every Tara Devi’s Group project is designed to bring contemporary luxury into harmony with the natural topography, offering those who seek a retreat in the hills a residence of permanence, refinement and complete peace of mind.";

  const headline = data?.title || defaultHeadline;
  const rawStory = data?.description || defaultStory;

  // Clean any raw HTML tags (e.g. <p>, </p>, &nbsp;) leaking from database / rich-text fields
  const cleanStory = rawStory
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/;(?=\s*$)/, "")
    .trim();

  const image =
    data?.image && !data.image.includes("unsplash.com")
      ? data.image
      : "/images/about-tara-devi.jpg";

  return (
    <section
      id="about"
      className="relative py-10 bg-[#FFFFFF] overflow-hidden flex items-center"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Narrative with Badge directly above Heading (No Gap) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Header Badge — Directly above heading with zero extra gap */}
            <div className="flex items-center gap-3 mb-2.5">
              <span className="h-px w-8 bg-[#CFA86E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#CFA86E]">
                About Tara Devi's Group
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] leading-[1.2] tracking-tight">
              {headline}
            </h2>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-[#5A6E65] leading-relaxed font-light">
              {cleanStory.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-site-visit-modal"))}
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#0E3326] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[#1A5A44] transition-colors cursor-pointer"
              >
                <span>Schedule a Private Site Visit</span>
                <span>→</span>
              </button>
              <Link
                href="#residences"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A5A44] hover:text-[#CFA86E] transition-colors"
                style={{ textDecoration: "none" }}
              >
                <span>Explore residences</span>
                <span>↓</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Imagery — Wider Expansive Width */}
          <div className="lg:col-span-6 relative w-full">
            <div className="relative w-full">
              {/* Main Image Frame with Gold Border — Increased Height for Majestic Presence */}
              <div className="relative h-[380px] sm:h-[460px] lg:h-[510px] w-full overflow-hidden rounded-2xl border border-[#CFA86E]/30 shadow-xl">
                <Image
                  src={image}
                  alt="Tara Devi's Mountain Retreat"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E3326]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-[10px] uppercase tracking-widest text-[#E4C794]">
                    Himachal Pradesh
                  </p>
                  <p className="font-serif text-base font-light mt-0.5">
                    Harmony with Natural Topography
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
