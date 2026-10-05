"use client";

import { motion } from "framer-motion";

export default function SkillsHeroHeader() {
  return (
    <div className="text-center pt-2 pb-3 px-2 flex-shrink-0 position-relative w-100" style={{ zIndex: 2 }}>
      {/* Telemetry Status Chip */}
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="d-inline-flex align-items-center gap-2 px-3 py-2 hud-telemetry-chip rounded-pill mb-2"
      >
        <span className="pulse-cyan" aria-hidden="true" />
        <span
          className="text-light fw-medium font-syne tracking-wide"
          style={{ fontSize: "0.65rem", letterSpacing: "0.18em" }}
        >
          {"// KNOWLEDGE ARSENAL & CREDENTIALS //"}
        </span>
      </motion.div>

      {/* Role / Discipline Subheading */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="font-syne text-uppercase fw-semibold tracking-scifi mb-2 mt-4"
        style={{
          color: "#00f2fe",
          fontSize: "clamp(0.72rem, 1.8vw, 0.82rem)",
          letterSpacing: "0.22em",
        }}
      >
        Full Stack &bull; Applied AI &bull; Cloud Architecture
      </motion.div>

      {/* Main Section Title */}
      <motion.h1
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-syne fw-bold text-uppercase text-white cyber-title-glow mb-4"
        style={{ fontSize: "clamp(1.6rem, 4.2vw, 2.75rem)", letterSpacing: "0.06em" }}
      >
        Skills &amp; Accreditations
      </motion.h1>

      {/* Narrative Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="font-outfit text-light text-opacity-75 mb-0 mx-auto"
        style={{
          maxWidth: "680px",
          fontSize: "clamp(0.85rem, 1.8vw, 0.98rem)",
          lineHeight: 1.6,
          letterSpacing: "0.02em",
        }}
      >
        Technical competencies, production frameworks, cloud infrastructure, and verified industry credentials.
      </motion.p>
    </div>
  );
}
