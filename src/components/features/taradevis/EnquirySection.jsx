"use client";

import { useState } from "react";
import Image from "next/image";

export default function EnquirySection() {
  const [formData, setFormData] = useState({
    contactPerson: "",
    email: "",
    contactNo: "",
    companyName: "Private Investor",
    selectOne: "Tara Devi Enclave — Shimla (2 & 3 BHK)",
    specialRequirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit enquiry");

      setSuccess(true);
      setFormData({
        contactPerson: "",
        email: "",
        contactNo: "",
        companyName: "Private Investor",
        selectOne: "Tara Devi Enclave — Shimla (2 & 3 BHK)",
        specialRequirements: "",
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="enquire"
      className="relative py-10 bg-[#081E16] text-white overflow-hidden flex items-center border-t border-[#CFA86E]/20"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1A5A44]/20 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: VIP Booking Narrative */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-[#CFA86E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E4C794]">
                Section 10 • Private Advisory
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight leading-[1.2]">
              Schedule a Private Consultation &amp; Site Visit
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Experience the tranquility of Tara Devi Enclave in person. Our executive team arranges bespoke private site tours departing from Shimla and Chandigarh with dedicated architectural briefings.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="w-8 h-8 rounded-full bg-[#CFA86E]/15 border border-[#CFA86E]/30 flex items-center justify-center text-xs text-[#E4C794] flex-shrink-0">
                  <i className="fa-solid fa-phone"></i>
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Direct Concierge Line</p>
                  <a href="tel:+919871177761" className="text-xs font-semibold text-white hover:text-[#E4C794] transition-colors">
                    +91-9871177761 / +91-9323582341
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="w-8 h-8 rounded-full bg-[#CFA86E]/15 border border-[#CFA86E]/30 flex items-center justify-center text-xs text-[#E4C794] flex-shrink-0">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Executive Correspondence</p>
                  <a href="mailto:info@taradevis.com" className="text-xs font-semibold text-white hover:text-[#E4C794] transition-colors">
                    info@taradevis.com / sales@taradevis.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Compact VIP Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#CFA86E]/40 bg-[#0E3326]/80 backdrop-blur-md p-6 sm:p-7 shadow-2xl">
              {success ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#CFA86E]/20 text-[#E4C794] text-xl border border-[#CFA86E]/40">
                    ✓
                  </div>
                  <h3 className="font-serif text-xl font-light text-white">
                    Private Consultation Requested
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thank you. Our senior executive concierge will contact you within 2 hours to confirm your private site visit and transportation.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-5 rounded-full bg-[#CFA86E] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#081E16]"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="font-serif text-lg font-light text-white">
                      Request Private Itinerary
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest text-[#E4C794] font-semibold">
                      VIP Registration
                    </span>
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#E4C794] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        required
                        placeholder="e.g. Vikramaditya Rathore"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#CFA86E] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#E4C794] mb-1">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        name="contactNo"
                        required
                        placeholder="+91-9876543210"
                        value={formData.contactNo}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#CFA86E] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#E4C794] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#CFA86E] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#E4C794] mb-1">
                        Residence of Interest
                      </label>
                      <select
                        name="selectOne"
                        value={formData.selectOne}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-[#081E16] border border-white/10 px-2.5 py-2 text-xs text-white focus:border-[#CFA86E] focus:outline-none"
                      >
                        <option value="Tara Devi Enclave — Shimla (2 & 3 BHK)">
                          Tara Devi Enclave — Shimla (2 &amp; 3 BHK)
                        </option>
                        <option value="Tara Devi Luxury Villas — Kufri (4 & 5 BHK)">
                          Tara Devi Luxury Villas — Kufri (4 &amp; 5 BHK)
                        </option>
                        <option value="Studio Mountain Suites">Studio Mountain Suites</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#E4C794] mb-1">
                      Preferred Date &amp; Chauffeur Needs
                    </label>
                    <textarea
                      name="specialRequirements"
                      rows={2}
                      placeholder="Specify preferred site visit date, time slot, or Shimla/Chandigarh pickup requirements..."
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-[#CFA86E] focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-to-r from-[#CFA86E] via-[#E4C794] to-[#CFA86E] py-2.5 text-xs font-bold uppercase tracking-wider text-[#081E16] shadow-lg shadow-[#CFA86E]/20 hover:scale-[1.01] transition-transform disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Scheduling Site Visit..." : "Confirm Site Visit Request →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}