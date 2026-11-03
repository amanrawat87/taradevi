/**
 * Tara Devi's Luxury Mountain Residences — Root Loading Shell
 * Designed strictly according to the luxury alpine aesthetic.
 */
export default function PublicLoading() {
  return (
    <div
      aria-hidden="true"
      className="min-h-screen bg-[#081E16] text-white flex flex-col font-sans overflow-hidden select-none"
    >
      {/* 1. Header Navigation Skeleton */}
      <div className="w-full border-b border-white/10 bg-[#081E16]/90 backdrop-blur-md py-4 px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Brand Logo & Medallion */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex-shrink-0 animate-pulse">
              <img
                src="/images/tara-devis-seal.png"
                alt="Tara Devi's"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-28 bg-[#CFA86E]/30 rounded-sm animate-pulse" />
              <div className="h-2 w-20 bg-[#CFA86E]/20 rounded-sm" />
            </div>
          </div>

          {/* Desktop Nav Skeleton */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="h-3 w-16 bg-white/15 rounded animate-pulse" />
            <div className="h-3 w-20 bg-white/15 rounded animate-pulse" />
            <div className="h-3 w-16 bg-white/15 rounded animate-pulse" />
            <div className="h-3 w-14 bg-white/15 rounded animate-pulse" />
            <div className="h-3 w-12 bg-white/15 rounded animate-pulse" />
            <div className="h-3 w-20 bg-white/15 rounded animate-pulse" />
          </div>

          {/* CTA Button Skeleton */}
          <div className="h-9 w-36 rounded-full bg-gradient-to-r from-[#CFA86E]/40 to-[#E4C794]/40 animate-pulse hidden sm:block" />
        </div>
      </div>

      {/* 2. Hero Section Skeleton */}
      <div className="relative flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-20 min-h-[75vh]">
        {/* Ambient Mountain Forest Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#1A5A44]/25 blur-[160px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-20 w-[400px] h-[300px] bg-[#CFA86E]/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-7xl w-full">
          {/* Subtle Tagline */}
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#CFA86E] animate-ping" />
            <div className="h-3.5 w-64 bg-[#CFA86E]/40 rounded animate-pulse" />
          </div>

          {/* Luxury Main Heading */}
          <div className="max-w-3xl space-y-4 mb-6">
            <div className="h-10 md:h-14 w-full bg-white/20 rounded-md animate-pulse" />
            <div className="h-10 md:h-14 w-4/5 bg-white/15 rounded-md animate-pulse" />
          </div>

          {/* Subtitle */}
          <div className="max-w-2xl space-y-2 mb-10">
            <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-12 w-44 rounded-full bg-gradient-to-r from-[#CFA86E]/50 via-[#E4C794]/50 to-[#CFA86E]/50 animate-pulse" />
            <div className="h-12 w-48 rounded-full border border-white/20 bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 3. Alpine Metrics Ribbon Skeleton */}
      <div className="w-full border-t border-[#CFA86E]/20 bg-[#061A13] py-5 px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="h-2.5 w-20 bg-[#CFA86E]/30 rounded animate-pulse" />
              <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
              <div className="h-2.5 w-24 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
