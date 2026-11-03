"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOTAL_FRAMES = 142;

export default function VideoShowcase() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const promptRef = useRef(null);
  const canvasRef = useRef(null);

  // Animation references
  const imagesRef = useRef([]);
  const isLoadedRef = useRef(new Array(TOTAL_FRAMES).fill(false));
  const currentScrollFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const proxyRef = useRef({ frame: 0 });

  // Draw frame to canvas
  const drawFrame = (targetIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Direct hit: If requested frame is loaded and valid
    const targetImg = imagesRef.current[targetIndex];
    if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
      ctx.drawImage(targetImg, 0, 0, canvas.width, canvas.height);
      lastDrawnFrameRef.current = targetIndex;
      return;
    }

    // 2. Fallback: Find the closest loaded frame to targetIndex
    let bestIndex = -1;
    let minDiff = Infinity;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = imagesRef.current[i];
      if (img && img.complete && img.naturalWidth > 0) {
        const diff = Math.abs(i - targetIndex);
        if (diff < minDiff) {
          minDiff = diff;
          bestIndex = i;
        }
      }
    }

    if (bestIndex !== -1 && bestIndex !== lastDrawnFrameRef.current) {
      ctx.drawImage(imagesRef.current[bestIndex], 0, 0, canvas.width, canvas.height);
      lastDrawnFrameRef.current = bestIndex;
    }
  };

  // 1. Smart Stride Preloading Engine: Frame 0 -> Keyframes -> All Frames
  useEffect(() => {
    let isMounted = true;
    const images = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    // Helper: Load a single frame
    const loadFrame = (index, onLoadedCallback) => {
      if (images[index]) return images[index];
      const img = new Image();
      const frameNum = String(index).padStart(3, "0");
      img.src = `/frames/tara/frame_${frameNum}.webp`;

      img.onload = () => {
        if (!isMounted) return;
        isLoadedRef.current[index] = true;
        if (onLoadedCallback) onLoadedCallback();

        // If user's current scroll position wants this frame, redraw
        if (
          Math.abs(currentScrollFrameRef.current - index) <= 1 ||
          lastDrawnFrameRef.current === -1
        ) {
          drawFrame(currentScrollFrameRef.current);
        }
      };

      images[index] = img;
      return img;
    };

    // Priority 1: Frame 0 loads instantly
    loadFrame(0, () => {
      drawFrame(0);
    });

    // Priority 2: Keyframes across the timeline (every 5th frame)
    for (let k = 5; k < TOTAL_FRAMES; k += 5) {
      loadFrame(k);
    }
    loadFrame(TOTAL_FRAMES - 1);

    // Priority 3: Fill in all intermediate frames sequentially
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (!images[i]) {
        loadFrame(i);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. GSAP ScrollTrigger Timeline with Generous Scroll Distance for Slow Cinematic Scrubbing
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const card = cardRef.current;
    const header = headerRef.current;
    const prompt = promptRef.current;
    if (!section || !card) return;

    // Use GSAP Context for 100% clean lifecycle
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8, // Smooth dampening to prevent fast or jerky frame jumps
        },
      });

      // PHASE 1: Card expands smoothly to fullscreen (0% to 15% of scroll)
      if (header) {
        tl.to(
          header,
          {
            opacity: 0,
            y: -25,
            scale: 0.96,
            ease: "power1.out",
            duration: 0.15,
          },
          0
        );
      }

      if (prompt) {
        tl.to(
          prompt,
          {
            opacity: 0,
            y: 15,
            ease: "power1.out",
            duration: 0.12,
          },
          0
        );
      }

      tl.to(
        card,
        {
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          borderRadius: "0px",
          borderWidth: "0px",
          borderColor: "transparent",
          boxShadow: "none",
          ease: "power2.inOut",
          duration: 0.15,
        },
        0
      );

      // PHASE 2: Slower, cinematic frame-by-frame scrubbing (15% to 100% of scroll = 340vh distance)
      tl.to(
        proxyRef.current,
        {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          duration: 0.85,
          onUpdate: () => {
            const frameIndex = Math.min(
              TOTAL_FRAMES - 1,
              Math.max(0, Math.floor(proxyRef.current.frame))
            );
            currentScrollFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          },
        },
        0.15
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="walkthrough"
      className="relative w-full bg-[#081E16]"
      style={{ height: "500vh" }}
    >
      {/* 
        Native CSS Sticky Viewport:
        - 100vh tall, pinned at top: 0
        - Header sits safely above the card with no overlap
        - Card is the only item in center flow, expanding to 100% edge-to-edge
      */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#081E16]">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-[#1A5A44]/15 blur-[160px] pointer-events-none rounded-full" />

        {/* Section Header: Compact & positioned safely near top, zero overlap with card */}
        <div
          ref={headerRef}
          className="absolute top-6 sm:top-8 md:top-10 inset-x-0 mx-auto max-w-xl px-6 text-center z-20 pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#CFA86E]" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#E4C794]">
              Cinematic Showcase • Tara Devi Enclave
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#CFA86E]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-tight">
            Experience the Property in Motion
          </h2>
        </div>

        {/* 
          Expanding Video Card:
          - Starts centered at 72vw x 48vh with generous space above and below
          - Expands smoothly to true 100% width x 100% height (edge-to-edge fullscreen)
          - ZERO dark overlays, ZERO text boxes, ZERO progress bars inside the video
        */}
        <div
          ref={cardRef}
          className="relative overflow-hidden bg-black shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-[#CFA86E]/35 flex items-center justify-center will-change-transform z-10"
          style={{
            width: "72vw",
            maxWidth: "1050px",
            height: "48vh",
            borderRadius: "28px",
          }}
        >
          {/* Fallback Image: Ensures zero blank screen on initial paint */}
          <img
            src="/frames/tara/frame_000.webp"
            alt="Tara Devi Enclave"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
          />

          {/* 60FPS Frame Scrubbing Canvas */}
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
          />
        </div>

        {/* Scroll Prompt: Positioned at bottom */}
        <div
          ref={promptRef}
          className="absolute bottom-6 sm:bottom-8 inset-x-0 mx-auto flex items-center justify-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#CFA86E] z-20 pointer-events-none"
        >
          <span className="animate-bounce">↓</span>
          <span>Scroll to expand &amp; explore</span>
        </div>
      </div>
    </section>
  );
}