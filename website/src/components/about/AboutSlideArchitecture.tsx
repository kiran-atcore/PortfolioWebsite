"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ARCH_HIGHLIGHTS = [
  {
    icon: "bi-lightning-charge-fill",
    title: "Sub-Second AI Inference",
    desc: "Slashing API inference latency with Groq & Bedrock pipelines for instantaneous natural language responses.",
    tag: "APPLIED AI",
  },
  {
    icon: "bi-broadcast",
    title: "Real-Time WebSockets",
    desc: "Architecting concurrent event-driven channels for moderation and bi-directional communications.",
    tag: "HIGH CONCURRENCY",
  },
  {
    icon: "bi-diagram-3-fill",
    title: "Scalable Backends & Cloud",
    desc: "Robust Django REST architectures, automated cron data pipelines, and containerized AWS infrastructure.",
    tag: "DISTRIBUTED AWS",
  },
];

export default function AboutSlideArchitecture() {
  return (
    <div className="w-100 d-flex flex-column align-items-center justify-content-center text-center mt-0 mt-sm-3 px-3 px-md-4">
      {/* Telemetry Badge */}
      <div className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-1">
        <span className="pulse-cyan" aria-hidden="true" />
        <span className="text-light fw-medium font-syne tracking-wide about-telemetry-badge-text">
          {"// TELEMETRY: ARCHITECTURAL_FOCUS //"}
        </span>
      </div>

      {/* Slide Title */}
      <h2 className="font-syne fw-bold text-uppercase text-white cyber-title-glow about-slide-title mb-1">
        Systems &amp; Applied AI
      </h2>

      <p className="font-space-grotesk fw-semibold text-uppercase about-slide-subtitle mb-2 mb-lg-0" style={{ color: "#00f2fe" }}>
        High-Throughput Backends &bull; Sub-Second Inference &bull; Event Streams
      </p>

      {/* Grid of Architectural Feature Cards */}
      <div className="row g-1 g-md-3 justify-content-center w-100 about-arch-grid mb-2 mb-md-3">
        {ARCH_HIGHLIGHTS.map((item, idx) => (
          <div key={idx} className="col-12 col-sm-4">
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: 0.16 + idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -3,
                borderColor: "rgba(0, 242, 254, 0.45)",
                boxShadow: "0 12px 28px rgba(0, 0, 0, 0.65), 0 0 18px rgba(0, 242, 254, 0.16)",
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className="about-arch-card text-start d-flex flex-column justify-content-between position-relative"
            >
              {/* Cyber Scanner Shimmer Line */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "200%", opacity: [0, 0.4, 0] }}
                transition={{
                  duration: 1.0,
                  delay: 0.3 + idx * 0.1,
                  ease: "easeInOut",
                }}
                className="position-absolute top-0 bottom-0 w-50 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(0, 242, 254, 0.2), transparent)",
                  transform: "skewX(-20deg)",
                  zIndex: 1,
                }}
              />

              <div className="position-relative" style={{ zIndex: 2 }}>
                <div className="d-flex justify-content-between align-items-center gap-2 mb-1 mb-md-2">
                  <motion.i
                    initial={{ scale: 0.65, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.26 + idx * 0.1,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className={`bi ${item.icon} about-arch-icon`}
                    style={{ color: "#00f2fe" }}
                  />
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + idx * 0.1,
                      ease: "easeOut",
                    }}
                    className="badge font-space-grotesk rounded-pill about-arch-badge"
                  >
                    {item.tag}
                  </motion.span>
                </div>
                <motion.h3
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.34 + idx * 0.1,
                    ease: "easeOut",
                  }}
                  className="font-syne fw-bold text-white about-arch-card-title"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.4 + idx * 0.1,
                    ease: "easeOut",
                  }}
                  className="font-outfit text-light text-opacity-75 mb-0 about-arch-card-desc"
                >
                  {item.desc}
                </motion.p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Action Trigger */}
      <div className="font-syncopate mt-1 mt-md-2">
        <Link
          href="/projects"
          className="btn btn-neon-cyan rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center about-arch-btn mt-sm-3 mt-md-1 p-2 px-3"
        >
          <i className="bi bi-cpu-fill me-1"></i> Explore Production Projects &rarr;
        </Link>
      </div>
    </div>
  );
}
