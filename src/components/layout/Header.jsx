  "use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header({ initialNavData = [], initialGlobalSettings = null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenModal = (e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent("open-site-visit-modal"));
  };

  const logoSrc = initialGlobalSettings?.logoImage || "/images/tara-devis-seal.png";
  const phone = initialGlobalSettings?.primaryPhone || "+91-9871177761";

  // Navigation Links including Blogs and Contact Us
  const navLinks = [
    { label: "About Us", href: "/#about" },
    { label: "Residences", href: "/#residences" },
    { label: "Amenities", href: "/#amenities" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Blogs", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-black/5 border-b border-[#CFA86E]/30 py-3"
            : "bg-[#081E16]/40 backdrop-blur-md border-b border-white/10 py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full flex items-center justify-between">
          {/* Brand Logo & Medallion */}
          <Link
            href="/"
            className="flex items-center gap-3 group flex-shrink-0"
            style={{ textDecoration: "none" }}
          >
            <div
              className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ width: "42px", height: "42px" }}
            >
              <Image
                src={logoSrc}
                alt="Tara Devi's Group Medallion"
                width={42}
                height={42}
                priority
                className="object-contain"
                style={{ width: "42px", height: "42px" }}
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span
                className={`font-serif text-lg sm:text-xl font-bold tracking-tight leading-tight transition-colors duration-300 ${
                  isScrolled ? "text-[#0E3326]" : "text-white"
                }`}
              >
                TARA DEVI'S
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#CFA86E] font-semibold">
                Himachal Pradesh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered & Strictly No-Wrap */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 2xl:gap-7">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[11.5px] xl:text-[13px] font-semibold tracking-wider uppercase whitespace-nowrap transition-colors duration-300 py-1 relative group ${
                  isScrolled
                    ? "text-[#14221D] hover:text-[#CFA86E]"
                    : "text-white/90 hover:text-[#E4C794]"
                }`}
                style={{ textDecoration: "none" }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#CFA86E] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Action: Phone & Popup Modal Trigger Button */}
          <div className="hidden sm:flex items-center gap-3 xl:gap-5 flex-shrink-0">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className={`text-[12px] xl:text-[13px] font-semibold whitespace-nowrap transition-colors duration-300 hidden 2xl:inline-flex items-center gap-1.5 ${
                isScrolled
                  ? "text-[#1A5A44] hover:text-[#CFA86E]"
                  : "text-[#E4C794] hover:text-white"
              }`}
              style={{ textDecoration: "none" }}
            >
              <i className="fa-solid fa-phone text-xs"></i>
              <span>{phone}</span>
            </a>

            <button
              onClick={handleOpenModal}
              type="button"
              className="rounded-full bg-gradient-to-r from-[#CFA86E] via-[#E4C794] to-[#CFA86E] px-5 py-2.5 text-[11px] xl:text-xs font-bold uppercase tracking-wider text-[#0E3326] shadow-md shadow-[#CFA86E]/20 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              Schedule Site Visit
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? "text-[#0E3326] hover:text-[#CFA86E]" : "text-white hover:text-[#E4C794]"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#0E3326] text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="relative h-9 w-9">
                    <Image
                      src={logoSrc}
                      alt="Tara Devi's Group Medallion"
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-serif text-base font-bold text-white block">
                      TARA DEVI'S
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-[#CFA86E]">
                      Himachal Pradesh
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/70 hover:text-white p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold tracking-wider uppercase text-white/90 hover:text-[#CFA86E] py-2 border-b border-white/5 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-8 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={handleOpenModal}
                className="w-full text-center rounded-full bg-gradient-to-r from-[#CFA86E] to-[#E4C794] py-3 text-xs font-bold uppercase tracking-wider text-[#0E3326] shadow-lg"
              >
                Schedule Site Visit
              </button>
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="w-full text-center rounded-full border border-[#CFA86E]/40 py-2.5 text-xs font-semibold text-[#E4C794] flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-phone text-xs"></i>
                <span>{phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}