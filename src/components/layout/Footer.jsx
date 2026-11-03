import Link from "next/link";
import Image from "next/image";
import GlobalSetting from "src/app/models/GlobalSetting";
import { connectDB } from "src/app/lib/config";

export default async function Footer() {
  let settings = null;
  try {
    await connectDB();
    settings = await GlobalSetting.findOne().lean();
  } catch (error) {
    console.error("Error fetching global settings for footer:", error);
  }

  const logo = settings?.logoImage || "/images/tara-devis-seal.png";
  const desc =
    settings?.footerDescription ||
    "First-generation visionaries setting a new standard for luxury mountain living in Himachal Pradesh. Residences of an uncompromising standard, worthy of its landscapes.";
  const email = settings?.primaryEmail || "careers@taradevis.com";
  const phone = settings?.footerPhone || "+91-9871177761";
  const address = settings?.address || "Tara Devi Enclave, Shimla & Kufri Foothills, Himachal Pradesh, India";

  return (
    <footer className="relative bg-[#081E16] text-white border-t border-[#CFA86E]/30 overflow-hidden">
      {/* Decorative Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#CFA86E] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand & Seal Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                <Image
                  src={logo}
                  alt="Tara Devi's Group Medallion"
                  width={56}
                  height={56}
                  className="object-contain"
                  style={{ width: '56px', height: '56px' }}
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
                  TARA DEVI'S
                </h3>
                <p className="text-xs uppercase tracking-[0.25em] text-[#E4C794] font-medium">
                  Group • Himachal Pradesh
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 font-light leading-relaxed max-w-md">
              {desc}
            </p>

            <p className="mt-4 text-xs text-[#E4C794] italic font-light">
              Guided by the blessings of Maa Tara Devi.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E4C794] mb-6">
              Developments
            </h4>
            <ul className="space-y-3 text-sm text-slate-300 font-light">
              <li>
                <Link href="#residences" className="hover:text-[#E4C794] transition-colors">
                  Tara Devi Enclave — Shimla
                </Link>
                <span className="block text-[10px] text-[#CFA86E] uppercase tracking-wider">Active Construction</span>
              </li>
              <li className="pt-2">
                <Link href="#residences" className="hover:text-[#E4C794] transition-colors">
                  Tara Devi Luxury Villas — Kufri
                </Link>
                <span className="block text-[10px] text-[#CFA86E] uppercase tracking-wider">Planned Private Enclave</span>
              </li>
              <li className="pt-2">
                <Link href="#amenities" className="hover:text-[#E4C794] transition-colors">
                  Curated Mountain Amenities
                </Link>
              </li>
              <li>
                <Link href="#location" className="hover:text-[#E4C794] transition-colors">
                  Strategic Himalayan Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Careers Column */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E4C794] mb-6">
              Advisory & Contact
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-300 font-light">
              <li className="flex items-start gap-3">
                <span className="text-[#E4C794] w-4 text-center mt-0.5">
                  <i className="fa-solid fa-location-dot"></i>
                </span>
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E4C794] w-4 text-center">
                  <i className="fa-solid fa-phone"></i>
                </span>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#E4C794] transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E4C794] w-4 text-center">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <a href={`mailto:${email}`} className="hover:text-[#E4C794] transition-colors">
                  {email}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="#careers"
                  className="inline-flex items-center gap-2 rounded-full border border-[#CFA86E]/40 px-4 py-1.5 text-xs text-[#E4C794] hover:bg-[#CFA86E] hover:text-[#0E3326] transition-all"
                >
                  <span>Join Our Team (Careers)</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-light gap-4">
          <p>© {new Date().getFullYear()} Tara Devi's Group. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#about" className="hover:text-white transition-colors">About Story</Link>
            <Link href="#vision" className="hover:text-white transition-colors">Our Vision</Link>
            <Link href="#enquire" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
