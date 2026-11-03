"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SiteVisitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    contactPerson: "",
    contactNo: "",
    email: "",
    selectOne: "Tara Devi Enclave — Shimla (2 & 3 BHK)",
    preferredDate: "",
    preferredSlot: "Morning (10:00 AM – 01:00 PM)",
    specialRequirements: "",
    companyName: "Site Visit Request",
  });

  useEffect(() => {
    const handleOpen = () => {
      setSuccess(false);
      setError("");
      setIsOpen(true);
    };

    window.addEventListener("open-site-visit-modal", handleOpen);

    const handleClick = (e) => {
      const target = e.target.closest('a[href="#enquire"], [data-site-visit="true"]');
      if (target) {
        e.preventDefault();
        handleOpen();
      }
    };

    document.addEventListener("click", handleClick);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-site-visit-modal", handleOpen);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        contactPerson: formData.contactPerson,
        contactNo: formData.contactNo,
        email: formData.email,
        selectOne: formData.selectOne,
        companyName: `Site Visit: ${formData.preferredDate || "TBD"} (${formData.preferredSlot})`,
        specialRequirements: formData.specialRequirements,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit request.");

      setSuccess(true);
      setFormData({
        contactPerson: "",
        contactNo: "",
        email: "",
        selectOne: "Tara Devi Enclave — Shimla (2 & 3 BHK)",
        preferredDate: "",
        preferredSlot: "Morning (10:00 AM – 01:00 PM)",
        specialRequirements: "",
        companyName: "Site Visit Request",
      });
    } catch (err) {
      setError(err.message || "An error occurred while submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* 
        2-Column Modal Card:
        - Left: Image (Clean & Bright, ZERO overlays, ZERO badges)
        - Right: Form (White background, luxury deep pine & gold text)
      */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-[#CFA86E]/30 text-[#0E3326] shadow-2xl shadow-black/60 z-10 my-6 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-30 text-slate-500 hover:text-[#0E3326] transition-colors p-2 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer border border-slate-200"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ─── LEFT COLUMN: PROPERTY IMAGE WITH BLACK OVERLAY (col-span-5) ── */}
        <div className="relative hidden md:block md:col-span-5 min-h-[500px] overflow-hidden">
          <Image
            src="/images/tara-enclave-banner-2.jpg"
            alt="Tara Devi Enclave Himalayan Vistas"
            fill
            sizes="40vw"
            className="object-cover"
            priority
          />
          {/* Black Translucent Overlay with bottom gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 pointer-events-none" />

          {/* Bottom Card filling empty space with luxury property highlights */}
          <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#D4AF37] flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-[#D4AF37]"></i>
                Tara Devi Enclave &bull; Shimla
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/15 text-white/90">
                6,200+ Ft.
              </span>
            </div>
            <h4 className="text-xs font-semibold text-white mt-1">
              Luxury Mountain Residences (2 &amp; 3 BHK)
            </h4>
            <p className="text-[11px] text-white/75 mt-0.5">
              Nestled amidst pristine deodar forests with panoramic Himalayan views.
            </p>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: THE FORM (col-span-7 with White Background) ────── */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 flex flex-col justify-between relative">
          {/* Form Header */}
          <div className="flex items-center gap-3 mb-5 pr-8">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/images/tara-devis-seal.png"
                alt="Tara Devi's Medallion"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CFA86E]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A27E47]">
                  Private Consultation &amp; Site Visit
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#0E3326] tracking-tight">
                Schedule Your Private Tour
              </h3>
            </div>
          </div>

          {success ? (
            <div className="text-center py-10 my-auto">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#0E3326]/10 text-[#0E3326] text-2xl border border-[#CFA86E]/40">
                ✓
              </div>
              <h4 className="font-serif text-xl font-light text-[#0E3326]">
                Site Visit Requested
              </h4>
              <p className="mt-2 text-xs text-[#5A6E65] max-w-sm mx-auto leading-relaxed">
                Thank you for your interest. Our senior luxury relationship concierge will reach out within 2 hours to confirm your private itinerary.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 rounded-full bg-[#0E3326] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1A5A44] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0E3326] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    placeholder="e.g. Vikramaditya Rathore"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#F7F9F6] border border-[#CFA86E]/30 px-3 py-2 text-xs text-[#0E3326] placeholder-slate-400 focus:border-[#0E3326] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E3326]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0E3326] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNo"
                    required
                    placeholder="+91-9876543210"
                    value={formData.contactNo}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#F7F9F6] border border-[#CFA86E]/30 px-3 py-2 text-xs text-[#0E3326] placeholder-slate-400 focus:border-[#0E3326] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E3326]"
                  />
                </div>
              </div>

              {/* Email & Residence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0E3326] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#F7F9F6] border border-[#CFA86E]/30 px-3 py-2 text-xs text-[#0E3326] placeholder-slate-400 focus:border-[#0E3326] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E3326]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0E3326] mb-1">
                    Residence of Interest
                  </label>
                  <select
                    name="selectOne"
                    value={formData.selectOne}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#F7F9F6] border border-[#CFA86E]/30 px-2.5 py-2 text-xs text-[#0E3326] focus:border-[#0E3326] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E3326]"
                  >
                    <option value="Tara Devi Enclave — Shimla (2 & 3 BHK)">
                      Tara Devi Enclave — Shimla (2 &amp; 3 BHK)
                    </option>
                    <option value="Tara Devi Luxury Villas — Kufri (4 & 5 BHK)">
                      Tara Devi Luxury Villas — Kufri (4 &amp; 5 BHK)
                    </option>
                    <option value="Studio Mountain Suites">Studio Mountain Suites</option>
                    <option value="General VIP Consultation">General VIP Consultation</option>
                  </select>
                </div>
              </div>

              {/* Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0E3326] mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#F7F9F6] border border-[#CFA86E]/30 px-3 py-2 text-xs text-[#0E3326] placeholder-slate-400 focus:border-[#0E3326] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E3326]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0E3326] mb-1">
                    Preferred Time
                  </label>
                  <select
                    name="preferredSlot"
                    value={formData.preferredSlot}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#F7F9F6] border border-[#CFA86E]/30 px-2.5 py-2 text-xs text-[#0E3326] focus:border-[#0E3326] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E3326]"
                  >
                    <option value="Morning (10:00 AM – 01:00 PM)">
                      Morning (10:00 AM – 01:00 PM)
                    </option>
                    <option value="Afternoon (02:00 PM – 05:00 PM)">
                      Afternoon (02:00 PM – 05:00 PM)
                    </option>
                    <option value="Sunset Hour (05:00 PM – 06:30 PM)">
                      Sunset Hour (05:00 PM – 06:30 PM)
                    </option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0E3326] mb-1">
                  Special Requests / Notes
                </label>
                <textarea
                  name="specialRequirements"
                  rows={2}
                  placeholder="Mention private chauffeur pickup needs, specific floor preferences, or family guests..."
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#F7F9F6] border border-[#CFA86E]/30 px-3 py-1.5 text-xs text-[#0E3326] placeholder-slate-400 focus:border-[#0E3326] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E3326] resize-none"
                />
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-[#CFA86E] via-[#E4C794] to-[#CFA86E] py-2.5 text-xs font-bold uppercase tracking-wider text-[#081E16] shadow-lg shadow-[#CFA86E]/20 hover:scale-[1.01] transition-transform disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Scheduling Site Visit..." : "Confirm Site Visit Request →"}
              </button>

              <p className="text-center text-[10px] text-[#5A6E65] font-light pt-1">
                🔒 Confidential HNI advisory. Your information is never shared.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}