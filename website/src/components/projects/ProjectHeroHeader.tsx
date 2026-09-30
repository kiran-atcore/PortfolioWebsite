"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DomainCyberCanvas3D from "./DomainCyberCanvas3D";
import HorizontalDomainDeck from "./HorizontalDomainDeck";

export default function ProjectHeroHeader({
  totalCount,
  onExplore,
  onSelectCategory,
}: {
  totalCount: number;
  onExplore?: () => void;
  onSelectCategory?: (category: string) => void;
}) {
  const [activeDomainIndex, setActiveDomainIndex] = useState(0);
  const [isExploreHovered, setIsExploreHovered] = useState(false);

  return (
    <div className="text-center pt-0 pb-2 px-1 flex-shrink-0 position-relative w-100" style={{ zIndex: 2 }}>
      {/* Telemetry Chip matching experience page */}
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-2"
      >
        <span className="pulse-cyan" aria-hidden="true" />
        <span className="text-light project-hero-telemetry-chip fw-medium font-syne tracking-wide" style={{ fontSize: "0.7rem", letterSpacing: "0.18em" }}>
          {"// TELEMETRY: PRODUCTION_PROJECTS //"}
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="font-syne fw-bold text-uppercase text-white cyber-title-glow mb-1 project-main-title"
        style={{ fontSize: "clamp(1.4rem, 4.2vw, 2.6rem)", letterSpacing: "0.06em" }}
      >
        Featured Projects
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="font-space-grotesk fw-semibold text-uppercase mb-2.5 mx-auto px-2"
        style={{
          maxWidth: "720px",
          color: "#00f2fe",
          fontSize: "clamp(0.7rem, 2vw, 0.88rem)",
          letterSpacing: "0.08em",
        }}
      >
        Production web applications &bull; Applied AI models &bull; Real-time platforms
      </motion.p>

      {/* Mini Telemetry Stats Ribbon (Concept 1: Segmented Cyber-HUD Capsule) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="project-hero-telemetry-chip d-inline-flex align-items-center justify-content-center flex-wrap gap-2 px-2 px-sm-3 py-3 rounded-pill position-relative overflow-hidden"
        style={{
          background: "rgba(4, 9, 22, 0.72)",
          border: "1px solid rgba(0, 242, 254, 0.25)",
          boxShadow: "0 0 15px rgba(0, 242, 254, 0.08), inset 0 1px 1px rgba(0, 242, 254, 0.2)",
          backdropFilter: "blur(12px)",
          maxWidth: "100%",
        }}
      >
        {/* Continuous Border Laser Scan Shimmer */}
        <motion.div
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "80px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #00f2fe, transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Segment 1: Systems Deployed */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="d-inline-flex align-items-center gap-1.5 font-mono text-light text-opacity-75"
          style={{ fontSize: "0.7rem" }}
        >
          <i className="bi bi-cpu me-2" style={{ color: "#00f2fe", fontSize: "0.68rem" }} />
          <span>
            <strong className="text-white">{totalCount}</strong> Systems Deployed
          </span>
        </motion.div>

        {/* Divider */}
        <span className="text-white-50 opacity-25 user-select-none" style={{ fontSize: "0.65rem" }}>|</span>

        {/* Segment 2: Verified Status */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="d-inline-flex align-items-center gap-1.5 font-mono"
          style={{ fontSize: "0.7rem", color: "#10b981" }}
        >
          <i className="bi bi-shield-check me-2" style={{ color: "#10b981", fontSize: "0.68rem" }} />
          <span>100% Verified</span>
        </motion.div>

        {/* Divider */}
        <span className="text-white-50 opacity-25 user-select-none" style={{ fontSize: "0.65rem" }}>|</span>

        {/* Segment 3: Live Signal Frequency Wave + Tech Stack */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="d-inline-flex align-items-center gap-1.5 font-mono text-light text-opacity-75"
          style={{ fontSize: "0.7rem" }}
        >
          {/* 3 Animated Micro Data Signal Bars */}
          <span className="d-inline-flex align-items-end me-2" style={{ height: "9px", gap: "2px" }}>
            {[0.1, 0.35, 0.2].map((delay, i) => (
              <motion.span
                key={i}
                animate={{ height: ["3px", "9px", "4px"] }}
                transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", delay }}
                style={{
                  display: "inline-block",
                  width: "2px",
                  background: "#00f2fe",
                  borderRadius: "1px",
                }}
              />
            ))}
          </span>
          <span>Next.js &bull; Python &bull; Applied AI</span>
        </motion.div>
      </motion.div>

      {/* 3D Cyber Deck Section: Reactive Horizon + Warp Filaments + Expandable Deck */}
      <div className="position-relative w-100 d-flex flex-column align-items-center justify-content-center">
        <DomainCyberCanvas3D
          activeDomainIndex={activeDomainIndex}
          isExploreHovered={isExploreHovered}
        />
        <HorizontalDomainDeck
          activeDomainIndex={activeDomainIndex}
          onDomainChange={setActiveDomainIndex}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* Explore Button routing to Bento Showcase (triggers warp accelerator on hover) */}
      {onExplore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-1"
        >
          <button
            type="button"
            onClick={onExplore}
            onMouseEnter={() => setIsExploreHovered(true)}
            onMouseLeave={() => setIsExploreHovered(false)}
            className="btn btn-neon-cyan rounded-pill px-4 py-2 font-syncopate fw-bold text-uppercase d-inline-flex align-items-center gap-2 shadow"
            style={{ fontSize: "clamp(0.6rem, 2vw, 0.8rem)", letterSpacing: "0.1em" }}
          >
            <span>Explore Showcase</span>
            <i className="bi bi-arrow-right" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
