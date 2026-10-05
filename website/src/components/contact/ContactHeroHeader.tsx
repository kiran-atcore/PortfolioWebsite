"use client";

import { motion } from "framer-motion";

export default function ContactHeroHeader() {
  return (
    <div className="text-center contact-hero-wrap px-2 flex-shrink-0 position-relative w-100" style={{ zIndex: 2 }}>
      {/* Telemetry Status Chip */}
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="d-inline-flex align-items-center gap-2 contact-hero-chip hud-telemetry-chip rounded-pill mb-1 mb-md-2"
      >
        <span className="pulse-cyan" aria-hidden="true" />
        <span className="text-light fw-medium font-syne tracking-wide contact-hero-chip-text">
          {"// COMMS PROTOCOL: ENCRYPTED // ACTIVE"}
        </span>
      </motion.div>

      {/* Role / Discipline Subheading */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="font-syne text-uppercase fw-semibold tracking-scifi contact-hero-role mb-1.5"
        style={{ color: "#00f2fe" }}
      >
        Full Stack Engineer &bull; Applied AI Architect
      </motion.div>

      {/* Main Section Title */}
      <motion.h1
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-syne fw-bold text-uppercase text-white cyber-title-glow contact-hero-title mb-1.5"
      >
        Contact &amp; Inquiries
      </motion.h1>

      {/* Narrative Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="font-outfit text-light text-opacity-75 contact-hero-desc mx-auto mb-0"
      >
        Available for full-time engineering roles, high-throughput systems architecture, and applied AI initiatives.
      </motion.p>
    </div>
  );
}
