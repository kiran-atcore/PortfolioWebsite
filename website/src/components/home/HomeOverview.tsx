"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { PERSONAL_INFO } from "../../data/portfolioData";

interface HomeOverviewProps {
  overviewSlide?: number; // 0 = Slide 3 (Profile Description), 1 = Slide 4 (Core Toolkit & Resume)
  isExiting?: boolean;
}

const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.92, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

const chipsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
};

const chipItemVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      delay: 0.32,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const SKILL_PILLS = [
  { name: "Next.js & React", category: "Frontend", icon: "bi-layers" },
  { name: "TypeScript", category: "Language", icon: "bi-code-square" },
  { name: "Python & Django REST", category: "Backend", icon: "bi-terminal" },
  { name: "Applied AI (Groq & Bedrock)", category: "AI & ML", icon: "bi-cpu" },
  { name: "WebSockets & Async", category: "Real-time", icon: "bi-broadcast" },
  { name: "AWS (EC2, S3, RDS)", category: "Cloud", icon: "bi-cloud" },
  { name: "PostgreSQL & Redis", category: "Data", icon: "bi-database" },
  { name: "Docker & CI/CD", category: "DevOps", icon: "bi-box-seam" },
];

export default function HomeOverview({
  overviewSlide = 0,
  isExiting = false,
}: HomeOverviewProps) {
  const isSlide4 = overviewSlide === 1;

  return (
    <div id="hero-overview" className="w-100 py-1 py-md-2 overview-offset-wrapper">
      <div className="row justify-content-center m-0 pt-lg-4">
        <div className="col-11 col-md-10 col-lg-9 col-xl-8 p-0">
          {/* Section Tag & Title (Animated Cyber Intro for Slide 3) */}
          <motion.div
            variants={headerContainerVariants}
            initial="hidden"
            animate={isExiting ? "hidden" : "visible"}
            className="text-center mb-2 mb-md-3"
          >
            <motion.div
              variants={badgeVariants}
              className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-2"
            >
              <span className="pulse-cyan"></span>
              <span className="text-light fw-medium font-syne tracking-wide py-1" style={{ fontSize: "0.65rem", letterSpacing: "0.22em" }}>
                {"// PROFILE // CORE TOOLKIT"}
              </span>
            </motion.div>

            <motion.h2
              variants={titleVariants}
              className="font-syne overview-section-title text-center text-uppercase text-white cyber-title-glow mb-2 mb-md-3"
              style={{ letterSpacing: 4, paddingLeft: 4 }}
            >
              Engineering Profile
            </motion.h2>

            {/* Technical HUD Telemetry Chips (Staggered Cyber Intro with Slide 4 Glow) */}
            <motion.div
              variants={chipsContainerVariants}
              className="d-flex flex-wrap justify-content-center gap-2 "
            >
              <motion.span
                variants={chipItemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className={`font-space-grotesk hud-telemetry-chip ${isSlide4 ? "hud-chip-glowing" : ""}`}
              >
                <i className="bi bi-cpu" style={{ color: "#00f2fe" }}></i> Groq &bull; LLaMA-3
              </motion.span>
              <motion.span
                variants={chipItemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className={`font-space-grotesk hud-telemetry-chip ${isSlide4 ? "hud-chip-glowing" : ""}`}
              >
                <i className="bi bi-lightning-charge" style={{ color: "#38f9d7" }}></i> &lt;280ms Latency
              </motion.span>
              <motion.span
                variants={chipItemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className={`font-space-grotesk hud-telemetry-chip ${isSlide4 ? "hud-chip-glowing" : ""}`}
              >
                <i className="bi bi-terminal" style={{ color: "#ff2a85" }}></i> Python &bull; Next.js
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Description / Toolkit Cyber Card Container (Appears after title & telemetry finish) */}
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate={isExiting ? "exit" : "visible"}
            className={`cyber-card p-3 p-md-4 ${overviewSlide !== 0 && "pb-md-2"} rounded-4 position-relative overflow-hidden`}
          >
            <AnimatePresence mode="wait">
              {overviewSlide === 0 ? (
                /* Slide 3: Engineering Bio Description Only */
                <motion.div
                  key="slide-3-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.25 } }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="py-2"
                >
                  <p style={{ letterSpacing: 3 }} className="font-outfit fw-light text-center text-light text-opacity-75 mb-0 lh-base home-overview-desc">
                    Specializing in <span className="fw-semibold" style={{ color: "#00f2fe" }}>Python, Django REST, Next.js</span>, and applied machine learning.
                    Proven track record in automating enterprise reporting pipelines by <span className="fw-semibold" style={{ color: "#38f9d7" }}>75%</span>,
                    engineering sub-second AI conversational engines, and deploying fault-tolerant WebSocket backends.
                    Driven by transforming complex architectural challenges into <span className="fw-semibold text-white">resilient, high-impact systems</span> that deliver measurable business value.
                  </p>
                </motion.div>
              ) : (
                /* Slide 4: Skill Pills Grid & Quick Resume Link (Responsive sm, md, lg) */
                <motion.div
                  key="slide-4-toolkit"
                  initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(4px)", transition: { duration: 0.3 } }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div>
                    <div className="font-syne text-light text-opacity-60 text-uppercase mb-2 tracking-wider" style={{ fontSize: "0.8rem", letterSpacing: 2 }}>
                      {"// Core Technical Toolkit"}
                    </div>
                    <div className="d-flex flex-wrap gap-1 gap-sm-2">
                      {SKILL_PILLS.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.025, duration: 0.25 }}
                          className="badge skill-pill-badge skill-pill-compact d-inline-flex align-items-center gap-1 rounded-pill font-space-grotesk fw-light"
                          style={{ letterSpacing: 1 }}
                        >
                          <i className={`bi ${skill.icon} skill-pill-icon`} style={{ color: "#00f2fe" }}></i>
                          <span className="text-light skill-pill-name">{skill.name}</span>
                          <span className="badge-tag-category badge-tag-category-compact font-space-grotesk">{skill.category}</span>
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end align-items-center mt-3 pt-2 border-top" style={{ borderColor: "rgba(0, 242, 254, 0.12)" }}>
                    <a
                      href={PERSONAL_INFO.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-cyber-glass rounded-pill px-3 py-2 font-syncopate text-uppercase tracking-wider"
                      style={{ fontSize: "0.58rem" }}
                    >
                      <i className="bi bi-file-earmark-arrow-down me-1" style={{ color: "#00f2fe" }}></i> Download Curriculum Vitae &rarr;
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
