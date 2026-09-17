"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Telemetry3DCarousel, { TelemetryMetric } from "./Telemetry3DCarousel";

interface HomeTelemetryProps {
  isExiting?: boolean;
}

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(10px)",
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: -24, scale: 0.88, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: "blur(8px)",
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 16,
    filter: "blur(8px)",
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const carouselVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const TELEMETRY_METRICS: TelemetryMetric[] = [
  {
    value: "75%",
    label: "Reporting Latency Reduction",
    detail: "Automated cron & PDF export pipelines",
    icon: "bi-lightning-charge",
    badge: "// EFFICIENCY",
    accent: "#00f2fe",
    progress: "75%",
  },
  {
    value: "50+",
    label: "Production API Endpoints",
    detail: "Django REST + fault-tolerant WebSockets",
    icon: "bi-hdd-network",
    badge: "// SCALABILITY",
    accent: "#38bdf8",
    progress: "90%",
  },
  {
    value: "4+",
    label: "Production & AI Systems",
    detail: "Groq LLMs, AWS Bedrock & Next.js",
    icon: "bi-cpu",
    badge: "// APPLIED AI",
    accent: "#ff2a85",
    progress: "85%",
  },
  {
    value: "8+",
    label: "Cloud & AI Certifications",
    detail: "AWS, DeepLearning.AI & Coursera accredited",
    icon: "bi-patch-check",
    badge: "// VERIFIED",
    accent: "#38f9d7",
    progress: "100%",
  },
];

export default function HomeTelemetry({ isExiting = false }: HomeTelemetryProps) {
  return (
    <div id="hero-telemetry" className="w-100 pt-3 py-sm-0 telemetry-offset-wrapper d-flex flex-column justify-content-start h-100 pb-3 pb-lg-0" style={{ marginTop: -30 }}>
      <div className="row justify-content-center m-0">
        <div className="col-12 col-md-11 col-lg-11 col-xl-10 p-0">
          {/* Compact Responsive Telemetry HUD Top Header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isExiting ? "exit" : "visible"}
            className="text-center mb-0 pb-2 border-bottom"
            style={{ borderColor: "rgba(0, 242, 254, 0.15)" }}
          >
            <motion.div
              variants={badgeVariants}
              className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-2"
            >
              <span className="pulse-cyan"></span>
              <span className="text-light fw-medium font-syne tracking-wide py-1 telemetry-badge-text" style={{ letterSpacing: "0.22em" }}>
                {"// SYSTEM TELEMETRY // PRODUCTION METRICS"}
              </span>
            </motion.div>
            <motion.h2
              variants={titleVariants}
              className="font-syne telemetry-section-title text-uppercase text-white cyber-title-glow mb-0"
            >
              Engineered Impact
            </motion.h2>
          </motion.div>

          {/* 3D Holographic Cylindrical Rotor Carousel (Horizontal) */}
          <motion.div
            variants={carouselVariants}
            initial="hidden"
            animate={isExiting ? "exit" : "visible"}
            className="w-100 mt-0 mt-lg-n2 mt-xl-n3 position-relative"
            style={{ minHeight: "330px" }}
          >
            <Telemetry3DCarousel metrics={TELEMETRY_METRICS} isExiting={isExiting} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
