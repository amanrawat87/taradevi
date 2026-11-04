"use client";

import Image from "next/image";

export default function EnquirySection() {
  const handleOpenModal = () => {
    window.dispatchEvent(new CustomEvent("open-site-visit-modal"));
  };

  return (
    <section
      id="enquire"
      className="relative min-h-[360px] lg:min-h-[400px] w-full overflow-hidden flex items-center border-t border-[#CFA86E]/30"
      style={{ paddingTop: "50px", paddingBottom: "50px" }}
    >
      {/* ── BACKGROUND MOUNTAIN IMAGE (EXACT REFERENCE STYLE) ── */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src="/images/tara-enclave-banner-2.jpg"
          alt="Tara Devi Himalayan Peaks & Sea of Clouds"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.98] transition-transform duration-1000"
          priority
        />

        {/* ── LIGHTER CINEMATIC OVERLAY (CLEAR & VIBRANT) ── */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* ── FOREGROUND CONTENT CONTAINER ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
          {/* Left Column: Signature Headline & Subtitle (Original & Compact) */}
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight tracking-tight drop-shadow-md">
              Step Into Your<br />
              Private Mountain<br />
              Sanctuary
            </h2>

            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-md drop-shadow-sm">
              Schedule a private site visit to experience the tranquil pine heights, panoramic valley vistas, and bespoke craftsmanship first-hand.
            </p>
          </div>

          {/* Right Column: Compact Luxury Action Button */}
          <div className="flex items-center lg:justify-end flex-shrink-0">
            <button
              onClick={handleOpenModal}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C5A26B] hover:bg-[#D4B07B] text-[#0E3326] px-6 sm:px-8 py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <span>SCHEDULE A PRIVATE VISIT</span>
              <span className="text-sm leading-none">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
