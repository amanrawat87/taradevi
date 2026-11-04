"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";

export default function LeadershipSection() {
  const swiperRef = useRef(null);

  const leaders = [
    {
      name: "Mr. Ajit",
      role: "Co-Founder & Director",
      focus: "Master Planning & Sustainable Mountain Development",
      bio: "A first-generation entrepreneur with an enduring passion for sustainable mountain development. Mr. Ajit oversees land acquisition, strategic vision, and master planning, ensuring every project integrates into Himachal's delicate ecosystem without disruption.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Mrs. Shukla",
      role: "Co-Founder & Senior Director",
      focus: "Design Excellence & Interior Curation",
      bio: "Championing design authenticity and spatial harmony, Mrs. Shukla leads interior curation. Inspired by the cultural heritage of Himachal, her vision ensures every residence is infused with warmth, elegance, and mountain comfort.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Mr. Digviay Jamwal",
      role: "Head of Brand & Strategic Growth",
      focus: "Global Brand Positioning & HNI Engagement",
      bio: "Leading brand positioning and high-net-worth outreach across major metropolitan hubs—including Delhi NCR, Chandigarh, and Punjab—connecting discerning buyers with their dream Himalayan sanctuaries.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Mr. Azal Ghosh",
      role: "General Manager – Sales",
      focus: "Sales Strategy & Customer Experience",
      bio: "With 14 years of international exposure across India, Singapore, the United Kingdom, and Dubai, Mr. Ghosh brings a global, customer-focused approach to luxury real estate advisory and project marketing.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Head of High-Altitude Engineering",
      role: "Engineering & Construction",
      focus: "Structural Integrity & Seismic Safety",
      bio: "Overseeing structural engineering and on-site execution. Responsible for advanced earthquake-resistant methodologies, sustainable mountain material sourcing, zero-waste site management, and strict timeline adherence.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section
      id="leadership"
      className="relative py-10 bg-[#f3eee9] text-[#0E3326] overflow-hidden flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      {/* 
        Background Texture & Ambient Glows on #f3eee9:
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
        {/* Section Header with Carousel Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-[#CFA86E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A27E47]">
                Leadership &amp; Craftsmanship
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] tracking-tight leading-[1.2]">
              Guided by Passion, Integrity, and Craftsmanship
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-[#5A6E65] font-light leading-relaxed">
              Our leadership combines visionary foresight with hands-on execution, ensuring that every residence reflects the highest standards of architectural refinement in Himachal Pradesh.
            </p>
          </div>

          {/* Left Arrow & Next Arrow Carousel Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous Slide"
              className="h-11 w-11 rounded-full border border-[#CFA86E]/50 bg-white/90 backdrop-blur-md flex items-center justify-center text-[#0E3326] hover:bg-[#0E3326] hover:text-[#E4C794] hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next Slide"
              className="h-11 w-11 rounded-full border border-[#CFA86E]/50 bg-white/90 backdrop-blur-md flex items-center justify-center text-[#0E3326] hover:bg-[#0E3326] hover:text-[#E4C794] hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swiper.js Carousel Container */}
        <div className="w-full">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            speed={750}
            loop={true}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="pb-4 [&_.swiper-wrapper]:!items-stretch"
          >
            {leaders.map((leader, idx) => (
              <SwiperSlide key={idx} className="!h-auto !flex">
                <div className="w-full flex-1 rounded-2xl border border-[#CFA86E]/35 bg-white/95 backdrop-blur-md p-6 transition-all duration-300 hover:border-[#CFA86E] hover:shadow-xl hover:shadow-[#CFA86E]/15 flex flex-col justify-between">
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3.5 mb-4 min-h-[56px]">
                      <div
                        className="relative h-13 w-13 overflow-hidden rounded-full border-2 border-[#CFA86E]/60 shadow-md flex-shrink-0"
                        style={{ width: "52px", height: "52px" }}
                      >
                        <Image
                          src={leader.avatar}
                          alt={leader.name}
                          fill
                          sizes="52px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-normal text-[#0E3326] leading-snug">
                          {leader.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-[#1A5A44] uppercase tracking-wider">
                          {leader.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] font-semibold text-[#A27E47] uppercase tracking-widest mb-2 border-b border-[#CFA86E]/20 pb-2 min-h-[36px] flex items-center">
                      {leader.focus}
                    </p>

                    <p className="text-xs text-[#5A6E65] leading-relaxed font-light line-clamp-4 flex-1">
                      {leader.bio}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#1A5A44] font-medium">
                    <span>Tara Devi's Group</span>
                    <span>Executive Advisory →</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}