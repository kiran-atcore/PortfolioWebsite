"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PERSONAL_INFO } from "../../data/portfolioData";

const FACTS = [
  {
    icon: "bi-geo-alt-fill",
    shade: "#38bdf8", // Sky Ice Cyan
    label: "Location",
    val: `${PERSONAL_INFO.location} (Open to Remote / Relocation)`,
    badge: "GLOBAL READY",
  },
  {
    icon: "bi-layers-fill",
    shade: "#00f2fe", // Electric Cyan (Flagship)
    label: "Core Stack",
    val: "Next.js, Python, Django REST, React Native, AWS",
    badge: "PRODUCTION STACK",
  },
  {
    icon: "bi-cpu-fill",
    shade: "#38f9d7", // Cyber Mint Aqua
    label: "Specialization",
    val: "Full Stack Systems, WebSockets & Applied AI",
    badge: "CORE ARCHITECTURE",
  },
  {
    icon: "bi-briefcase-fill",
    shade: "#4facfe", // Prism Cerulean
    label: "Availability",
    val: "Open to Full-Time Software Engineering Roles",
    badge: "ACTIVE CANDIDATE",
  },
];

export default function AboutSlideTelemetry() {
  return (
    <div className="w-100 d-flex flex-column align-items-center justify-content-center text-center mt-0 mt-sm-3 px-3 px-md-4">
      {/* Telemetry Badge */}
      <div className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-1">
        <span className="pulse-cyan" aria-hidden="true" />
        <span className="text-light fw-medium font-syne tracking-wide about-telemetry-badge-text">
          {"// TELEMETRY: OPERATIONAL_SPECS //"}
        </span>
      </div>

      {/* Slide Title */}
      <h2 className="font-syne fw-bold text-uppercase text-white cyber-title-glow about-slide-title mb-1">
        Telemetry &amp; Quick Facts
      </h2>

      <p className="font-space-grotesk fw-semibold text-uppercase about-slide-subtitle mb-2 mb-lg-0" style={{ color: "#00f2fe" }}>
        Deployment Readiness &bull; Operational Coordinates
      </p>

      {/* Quick Facts Grid */}
      <div className="row g-2 justify-content-center w-100 about-telemetry-grid mb-2 mb-md-3">
        {FACTS.map((fact, idx) => (
          <div key={idx} className="col-12 col-sm-6">
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: 0.16 + idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -2,
                borderColor: `${fact.shade}70`,
                borderLeftColor: fact.shade,
                boxShadow: `0 12px 28px rgba(0, 0, 0, 0.65), 0 0 18px ${fact.shade}25`,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className="about-telemetry-card text-start h-100 d-flex align-items-center gap-2 gap-md-2.5 py-2.5 py-sm-3 position-relative"
              style={{
                borderLeft: `2.5px solid ${fact.shade}`,
                borderColor: `${fact.shade}35`,
              }}
            >
              {/* Telemetry Neon Sweep Shimmer */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "200%", opacity: [0, 0.45, 0] }}
                transition={{
                  duration: 1.0,
                  delay: 0.3 + idx * 0.1,
                  ease: "easeInOut",
                }}
                className="position-absolute top-0 bottom-0 w-50 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${fact.shade}28, transparent)`,
                  transform: "skewX(-20deg)",
                  zIndex: 1,
                }}
              />

              <motion.div
                initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.26 + idx * 0.1,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="about-telemetry-icon-box d-flex align-items-center justify-content-center position-relative"
                style={{
                  background: `${fact.shade}12`,
                  border: `1px solid ${fact.shade}40`,
                  color: fact.shade,
                  boxShadow: `0 0 10px ${fact.shade}18`,
                  zIndex: 2,
                }}
              >
                <i className={`bi ${fact.icon}`}></i>
              </motion.div>
              <div className="flex-grow-1 min-w-0 position-relative" style={{ zIndex: 2 }}>
                <div className="row">
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + idx * 0.1,
                      ease: "easeOut",
                    }}
                    className="font-syne col-6 col-sm-12 col-lg-6 fw-bold text-white text-uppercase about-telemetry-label py-sm-2"
                  >
                    {fact.label}
                  </motion.span>
                  <div className="col-6 col-sm-12 order-sm-first col-lg-6 order-lg-last d-flex justify-content-center justify-content-sm-end align-items-center">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.34 + idx * 0.1,
                        ease: "easeOut",
                      }}
                      className="badge font-space-grotesk rounded-pill about-telemetry-badge"
                      style={{
                        color: fact.shade,
                        background: `${fact.shade}14`,
                        border: `1px solid ${fact.shade}35`,
                      }}
                    >
                      {fact.badge}
                    </motion.span>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.38 + idx * 0.1,
                    ease: "easeOut",
                  }}
                  className="font-outfit text-light text-opacity-85 about-telemetry-val"
                >
                  {fact.val}
                </motion.div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Action Trigger */}
      <div className="font-syncopate mt-1 mt-md-2 mt-5 mt-sm-2">
        <Link
          href="/contact"
          className="btn btn-neon-cyan rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center about-telemetry-btn mt-sm-3 mt-md-1"
        >
          <i className="bi bi-send-fill me-1"></i> Initialize Contact Channel &rarr;
        </Link>
      </div>
    </div>
  );
}
