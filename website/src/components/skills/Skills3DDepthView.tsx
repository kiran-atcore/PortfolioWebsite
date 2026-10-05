"use client";

import { useState, useRef, useEffect } from "react";
import { useMotionValue, useSpring, useVelocity, useMotionValueEvent } from "framer-motion";
import { SkillCategory, CertificationItem } from "@/data/portfolioData";
import SkillCanvas3DBackground from "./SkillCanvas3DBackground";
import DepthCardItem from "./DepthCardItem";
import CockpitFlightHUD from "./CockpitFlightHUD";

interface Skills3DDepthViewProps {
  items: (SkillCategory | CertificationItem)[];
  type: "skills" | "certifications";
}

export default function Skills3DDepthView({ items, type }: Skills3DDepthViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, { damping: 22, stiffness: 100, mass: 0.8 });
  const scrollVelocity = useVelocity(smoothProgress);

  const [activeIndex, setActiveIndex] = useState(0);
  const [bgVelocity, setBgVelocity] = useState(0);

  // Update background velocity and active index for HUD
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    setActiveIndex(Math.round(latest));
  });
  useMotionValueEvent(scrollVelocity, "change", (latest) => {
    setBgVelocity(latest * 0.05); // Scale velocity for background effect
  });

  // Touch swipe refs
  const touchStartY = useRef(0);
  const touchStartProgress = useRef(0);
  const touchStartTime = useRef(0);

  // Wheel and Touch listeners inside canvas container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Unconditionally trap scroll within the canvas!
      const current = scrollProgress.get();
      const maxProgress = items.length - 1;
      const step = e.deltaY * 0.0035; // adjust sensitivity
      const nextProgress = current + step;

      scrollProgress.set(Math.max(0, Math.min(maxProgress, nextProgress)));
    };

    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-cockpit-hud]")) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartProgress.current = scrollProgress.get();
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-cockpit-hud]")) return;
      // Unconditionally trap vertical swipe inside canvas; prevent entire page from scrolling!
      e.preventDefault();
      e.stopPropagation();

      const deltaY = touchStartY.current - e.touches[0].clientY;
      const maxProgress = items.length - 1;
      const nextProgress = touchStartProgress.current + deltaY * 0.012;

      scrollProgress.set(Math.max(0, Math.min(maxProgress, nextProgress)));
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-cockpit-hud]")) return;
      const elapsed = Date.now() - touchStartTime.current;
      const current = scrollProgress.get();
      const maxProgress = items.length - 1;

      // Snap on release or quick flick
      const deltaY = touchStartY.current - (e.changedTouches[0]?.clientY ?? touchStartY.current);
      let target = Math.round(current);
      if (elapsed < 280 && Math.abs(deltaY) > 25) {
        if (deltaY > 0) {
          target = Math.min(maxProgress, Math.floor(touchStartProgress.current) + 1);
        } else {
          target = Math.max(0, Math.ceil(touchStartProgress.current) - 1);
        }
      }
      scrollProgress.set(Math.max(0, Math.min(maxProgress, target)));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return;
      const current = scrollProgress.get();
      const maxProgress = items.length - 1;
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        scrollProgress.set(Math.max(0, current - 0.5));
      } else if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        scrollProgress.set(Math.min(maxProgress, current + 0.5));
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, scrollProgress]);

  const jumpToIndex = (index: number) => {
    scrollProgress.set(index);
  };

  return (
    <div
      ref={containerRef}
      className="position-relative w-100 h-100 d-flex flex-column justify-content-between overflow-hidden select-none"
      style={{
        perspective: "1100px",
        transformStyle: "preserve-3d",
        touchAction: "none",
      }}
    >
      {/* Three.js Cybernetic Background */}
      <SkillCanvas3DBackground velocity={bgVelocity} />

      {/* Navigation Hint Overlay (Top Center) */}
      <div
        className="position-absolute top-0 opacity-75 d-flex align-items-center justify-content-center w-100 pt-3"
        style={{ animation: "pulse 2s infinite" }}
      >
        <div
          className="font-space-grotesk text-info"
          style={{ letterSpacing: "0.3em", fontSize: "0.4rem" }}
        >
          [ SWIPE ] OR [ SCROLL ] TO NAVIGATE
        </div>
        <i className="bi bi-chevron-down text-info pulse-cyan ms-2" style={{ fontSize: "0.8rem" }} />
      </div>

      {/* 3D Depth Fly-Through Stage */}
      <div
        className="w-100 flex-grow-1 position-relative d-flex align-items-center justify-content-center"
        style={{
          transformStyle: "preserve-3d",
          minHeight: "180px",
          zIndex: 2,
        }}
      >
        {items.map((item, idx) => (
          <DepthCardItem
            key={idx}
            item={item}
            type={type}
            index={idx}
            progress={smoothProgress}
          />
        ))}
      </div>

      {/* Cyberpunk Cockpit Flight HUD Telemetry Navigation */}
      <CockpitFlightHUD
        items={items}
        type={type}
        scrollProgress={scrollProgress}
        smoothProgress={smoothProgress}
        scrollVelocity={scrollVelocity}
        activeIndex={activeIndex}
        jumpToIndex={jumpToIndex}
      />
    </div>
  );
}
