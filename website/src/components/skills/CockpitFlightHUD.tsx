"use client";

import { useState, useRef } from "react";
import { motion, MotionValue, useTransform, useMotionValueEvent } from "framer-motion";
import { SkillCategory, CertificationItem } from "@/data/portfolioData";

interface CockpitFlightHUDProps {
  items: (SkillCategory | CertificationItem)[];
  type: "skills" | "certifications";
  scrollProgress: MotionValue<number>;
  smoothProgress: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
  activeIndex: number;
  jumpToIndex: (index: number) => void;
}

export default function CockpitFlightHUD({
  items,
  type,
  scrollProgress,
  smoothProgress,
  scrollVelocity,
  activeIndex,
  jumpToIndex,
}: CockpitFlightHUDProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [velocityIntensity, setVelocityIntensity] = useState(0);

  // Derive puck position from smooth motion value
  const puckPercent = useTransform(smoothProgress, [0, Math.max(1, items.length - 1)], ["0%", "100%"]);

  useMotionValueEvent(scrollVelocity, "change", (latest) => {
    setVelocityIntensity(Math.min(1, Math.abs(latest) * 0.45));
  });

  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateProgressFromPointer = (clientX: number) => {
    if (!railRef.current) return;
    const rect = railRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    scrollProgress.set(ratio * (items.length - 1));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateProgressFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateProgressFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // safe ignore
      }
    }
  };

  const currentItem = items[activeIndex];
  const itemTitle = currentItem
    ? "title" in currentItem
      ? currentItem.title
      : ""
    : "";

  return (
    <div className="w-100 position-relative px-4 pb-4 pb-lg-0 px-sm-3" style={{ zIndex: 10 }}>
      <div
        className="w-100 p-2 p-sm-3 rounded-3 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(6, 14, 30, 0.7) 0%, rgba(3, 7, 16, 0.95) 100%)",
          border: "1px solid rgba(0, 242, 254, 0.28)",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 242, 254, 0.12), inset 0 1px 0 rgba(0, 242, 254, 0.4)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        {/* Cockpit HUD Top Telemetry Bar */}
        <div className="d-flex align-items-center justify-content-between mb-3 px-1">
          {/* Left: Sector & Title */}
          <div className="d-flex align-items-center gap-1 min-w-0" style={{ maxWidth: "50%" }}>
            <span
              className="d-inline-block rounded-circle flex-shrink-0"
              style={{
                width: 5,
                height: 5,
                background: "#00f2fe",
                boxShadow: "0 0 8px #00f2fe",
              }}
            />
            <div className="min-w-0 lh-sm">
              <span
                className="font-space-grotesk text-cyan d-block"
                style={{ fontSize: "clamp(0.45rem, 1vw, 0.55rem)", letterSpacing: "0.2em" }}
              >
                // SEC 0{activeIndex + 1}/0{items.length}
              </span>
            </div>
          </div>

          {/* Center: Waveform Velocity Equalizer & Warp Depth */}
          <div className="d-none d-sm-flex align-items-center gap-2">
            <div className="d-flex align-items-end gap-1" style={{ height: "12px" }}>
              {[0.4, 0.85, 1.0, 0.6, 0.95, 0.5, 0.75].map((mult, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    height: `${Math.max(3, mult * 10 * (0.8 + velocityIntensity * 1.6))}px`,
                    opacity: 0.4 + velocityIntensity * 0.6,
                  }}
                  transition={{ duration: 0.12 }}
                  style={{
                    width: "2px",
                    background: velocityIntensity > 0.25 ? "#00f2fe" : "rgba(0, 242, 254, 0.45)",
                    borderRadius: "1px",
                    boxShadow: velocityIntensity > 0.25 ? "0 0 6px #00f2fe" : "none",
                  }}
                />
              ))}
            </div>
            <span
              className="font-space-grotesk text-cyan text-opacity-70"
              style={{ fontSize: "0.5rem", letterSpacing: "0.2em" }}
            >
              WARP: {(1 + velocityIntensity * 3.5).toFixed(1)}X
            </span>
          </div>

          {/* Right: Flight Status Telemetry */}
          <div className="d-flex align-items-center gap-1 flex-shrink-0">
            <span
              className="badge font-mono rounded-pill px-2 py-1 border"
              style={{
                fontSize: "0.45rem",
                letterSpacing: "0.2em",
                background: velocityIntensity > 0.2 ? "rgba(0, 242, 254, 0.18)" : "rgba(0, 242, 254, 0.06)",
                borderColor: velocityIntensity > 0.2 ? "rgba(0, 242, 254, 0.6)" : "rgba(0, 242, 254, 0.25)",
                color: "#00f2fe",
              }}
            >
              {velocityIntensity > 0.2 ? "THRUSTING" : "LOCKED"}
            </span>
          </div>
        </div>

        {/* Cockpit Cyber-Rail & Controls */}
        <div className="d-flex align-items-center gap-4 px-1">
          {/* PREV Thruster */}
          <motion.button
            type="button"
            onClick={() => jumpToIndex(Math.max(0, Math.round(scrollProgress.get()) - 1))}
            disabled={activeIndex === 0}
            className="btn btn-sm border p-1 px-2 font-mono d-flex align-items-center gap-1 rounded-2"
            whileHover={activeIndex === 0 ? {} : { scale: 1.05, backgroundColor: "rgba(0, 242, 254, 0.2)" }}
            whileTap={activeIndex === 0 ? {} : { scale: 0.95, backgroundColor: "rgba(0, 242, 254, 0.3)" }}
            style={{
              opacity: activeIndex === 0 ? 0.4 : 1,
              cursor: activeIndex === 0 ? "default" : "pointer",
              fontSize: "0.5rem",
              fontWeight: 600,
              color: "#00f2fe",
              background: "rgba(0, 242, 254, 0.12)",
              borderColor: "rgba(0, 242, 254, 0.4)",
              boxShadow: activeIndex === 0 ? "none" : "0 0 10px rgba(0, 242, 254, 0.15)",
            }}
            aria-label="Previous card"
          >
            <i className="bi bi-chevron-left" />
            <span className="d-none d-md-inline">PREV</span>
          </motion.button>

          {/* Cyber Rail Scrubber Track */}
          <div
            ref={railRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="flex-grow-1 position-relative py-1"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              touchAction: "none",
              userSelect: "none",
            }}
            title="Slide or click to warp through cards"
          >
            {/* Guide Rail Base */}
            <div
              className="w-100 rounded-pill position-relative"
              style={{
                height: "2px",
                background: "rgba(0, 242, 254, 0.18)",
                boxShadow: "0 0 6px rgba(0, 242, 254, 0.25)",
                pointerEvents: "none",
              }}
            >
              {/* Active Rail Trail */}
              <motion.div
                className="h-100 rounded-pill position-absolute top-0 start-0"
                style={{
                  width: puckPercent,
                  background: "linear-gradient(90deg, rgba(0, 242, 254, 0.3) 0%, #00f2fe 100%)",
                  boxShadow: "0 0 8px #00f2fe",
                  pointerEvents: "none",
                }}
              />

              {/* Tick Marks for Sectors */}
              {items.map((_, i) => {
                const tickLeft = `${(i / Math.max(1, items.length - 1)) * 100}%`;
                const isActive = activeIndex === i;
                return (
                  <div
                    key={i}
                    className="position-absolute top-50"
                    style={{
                      left: tickLeft,
                      transform: "translate(-50%, -50%)",
                      width: isActive ? "4px" : "2px",
                      height: isActive ? "6px" : "4px",
                      borderRadius: "1px",
                      background: isActive ? "#00f2fe" : "rgba(255, 255, 255, 0.3)",
                      boxShadow: isActive ? "0 0 8px #00f2fe" : "none",
                      transition: "all 0.2s ease",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  />
                );
              })}

              {/* Magnetic Glowing Puck */}
              <motion.div
                className="position-absolute top-50 rounded-circle"
                style={{
                  left: puckPercent,
                  transform: "translate(-50%, -50%)",
                  width: isDragging ? "14px" : "10px",
                  height: isDragging ? "14px" : "10px",
                  background: "#ffffff",
                  border: isDragging ? "2.5px solid #00f2fe" : "2px solid #00f2fe",
                  boxShadow: isDragging
                    ? "0 0 16px #00f2fe, 0 0 28px rgba(0, 242, 254, 0.9)"
                    : "0 0 12px #00f2fe, 0 0 20px rgba(0, 242, 254, 0.8)",
                  transition: "width 0.15s ease, height 0.15s ease, box-shadow 0.15s ease",
                  zIndex: 3,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* NEXT Thruster */}
          <motion.button
            type="button"
            onClick={() => jumpToIndex(Math.min(items.length - 1, Math.round(scrollProgress.get()) + 1))}
            disabled={activeIndex === items.length - 1}
            className="btn btn-sm border p-1 px-2 font-mono d-flex align-items-center gap-1 rounded-2"
            whileHover={activeIndex === items.length - 1 ? {} : { scale: 1.05, backgroundColor: "rgba(0, 242, 254, 0.2)" }}
            whileTap={activeIndex === items.length - 1 ? {} : { scale: 0.95, backgroundColor: "rgba(0, 242, 254, 0.3)" }}
            style={{
              opacity: activeIndex === items.length - 1 ? 0.4 : 1,
              cursor: activeIndex === items.length - 1 ? "default" : "pointer",
              fontSize: "0.5rem",
              fontWeight: 600,
              color: "#00f2fe",
              background: "rgba(0, 242, 254, 0.12)",
              borderColor: "rgba(0, 242, 254, 0.4)",
              boxShadow: activeIndex === items.length - 1 ? "none" : "0 0 10px rgba(0, 242, 254, 0.15)",
            }}
            aria-label="Next card"
          >
            <span className="d-none d-md-inline">NEXT</span>
            <i className="bi bi-chevron-right" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
