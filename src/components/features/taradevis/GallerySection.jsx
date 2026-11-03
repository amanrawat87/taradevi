"use client";

import { useState } from "react";
import Image from "next/image";

export default function GallerySection({ images = [] }) {
  const defaultImages = [
    {
      _id: "gal-1",
      caption: "Tara Devi Enclave — Himalayan Valley & Mountain Horizon",
      url: "/images/tara-enclave-banner-2.jpg",
      category: "Vistas",
    },
    {
      _id: "gal-2",
      caption: "Tara Devi Residences — Multi-Story Hillside Elevation & Forest Backdrop",
      url: "/images/residence-property-1.jpg",
      category: "Architecture",
    },
    {
      _id: "gal-3",
      caption: "Panoramic Aerial View — Enclave Nestled in Pine Valleys",
      url: "/images/about-tara-devi.jpg",
      category: "Nature",
    },
    {
      _id: "gal-4",
      caption: "Tara Devi Enclave — Scenic Mountain Approach & Gated Living",
      url: "/images/tara-enclave-banner-1.jpg",
      category: "Vistas",
    },
    {
      _id: "gal-5",
      caption: "Signature Alpine Architecture & Distinctive Green Rooflines",
      url: "/images/residence-property-2.jpg",
      category: "Architecture",
    },
    {
      _id: "gal-6",
      caption: "Tara Devi Himalayan Sanctuary — Serene Forest Slopes at 6,200+ Ft.",
      url: "/images/tara-gallery-1.jpg",
      category: "Nature",
    },
  ];

  const galleryItems =
    images && images.length > 0 && !images[0]?.url?.includes("unsplash.com")
      ? images
      : defaultImages;
  const [activeTab, setActiveTab] = useState("All");
  const [activeLightbox, setActiveLightbox] = useState(null);

  const tabs = ["All", "Architecture", "Vistas", "Interiors", "Nature"];

  const filtered =
    activeTab === "All"
      ? galleryItems
      : galleryItems.filter((item) =>
          item.category
            ? item.category.toLowerCase() === activeTab.toLowerCase()
            : true
        );

  return (
    <section
      id="gallery"
      className="relative py-[60px] bg-[#F7F9F6] flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "60px", paddingBottom: "60px" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        {/* Section Header with Tabs in 1 Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-[#CFA86E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#CFA86E]">
                Section 08 • Visual Gallery
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#0E3326] tracking-tight">
              Life and Architecture in the Hills
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#0E3326] text-white shadow-sm"
                    : "bg-white text-[#5A6E65] hover:text-[#0E3326] border border-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid: 6 compact cards, fits in 100vh without cutting off */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.slice(0, 6).map((img, idx) => (
            <div
              key={img._id || idx}
              onClick={() => setActiveLightbox(img)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#CFA86E]/25 shadow-sm bg-black cursor-pointer"
            >
              <Image
                src={img.url}
                alt={img.caption || "Tara Devi's Gallery"}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5">
                <span className="text-[10px] uppercase tracking-wider text-[#E4C794] font-semibold">
                  {img.category || "Himalayas"}
                </span>
                <p className="font-serif text-xs text-white font-light line-clamp-1">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden bg-black border border-[#CFA86E]/40">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 text-white hover:text-[#CFA86E] text-2xl p-2"
            >
              ✕
            </button>
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={activeLightbox.url}
                alt={activeLightbox.caption || "Gallery Lightbox"}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-[#081E16] text-white">
              <p className="font-serif text-sm font-light">{activeLightbox.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}