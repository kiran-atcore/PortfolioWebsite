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

  // Wheel listener inside canvas container
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
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, scrollProgress]);

  // Touch swipe support (continuous)
  const touchStartY = useRef(0);
  const touchStartProgress = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartProgress.current = scrollProgress.get();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // We can only preventDefault if e.cancelable is true in React Synthetic Events
    // To properly prevent native touch scroll, we should add a native event listener,
    // but doing it here prevents React's touch scroll if passive: false is set.
    if (e.cancelable) e.preventDefault();

    const deltaY = touchStartY.current - e.touches[0].clientY;
    const maxProgress = items.length - 1;
    const nextProgress = touchStartProgress.current + deltaY * 0.015;

    scrollProgress.set(Math.max(0, Math.min(maxProgress, nextProgress)));
  };

  const jumpToIndex = (index: number) => {
    scrollProgress.set(index);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="position-relative w-100 h-100 d-flex flex-column justify-content-between overflow-hidden select-none"
      style={{
        perspective: "1100px",
        transformStyle: "preserve-3d",
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
