"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import Connect3DCarousel from "./Connect3DCarousel";
import { PERSONAL_INFO } from "../../data/portfolioData";
import { publishSlideSelect } from "@/lib/slideEvents";

interface HomeConnectProps {
  isExiting?: boolean;
}

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: "blur(8px)",
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: -16, scale: 0.9, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 12,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 6,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const carouselVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", scale: 0.96 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.96,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.18 },
  },
  exit: {
    opacity: 0,
    y: 8,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const footerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.24 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function HomeConnect({ isExiting = false }: HomeConnectProps) {
  return (
    <div
      id="hero-connect"
      className="w-100 pt-0 connect-offset-wrapper d-flex flex-column h-100"
    >
      <div className="row justify-content-center m-0 w-100 flex-grow-1 h-100">
        <div className="col-12 col-md-11 col-lg-11 col-xl-10 p-0 d-flex flex-column justify-content-between h-100">
          {/* Top Content Block: Header, Carousel, CTA */}
          <div className="d-flex flex-column align-items-center w-100 flex-shrink-0">
            {/* Top Header with Cyber Badges and Title */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
              className="text-center mb-1 pb-1 border-bottom w-100"
              style={{ borderColor: "rgba(0, 242, 254, 0.15)" }}
            >
              <motion.div
                variants={badgeVariants}
                className="d-inline-flex align-items-center gap-2 px-2 px-sm-3 py-0 hud-telemetry-chip rounded-pill mb-1"
              >
                <span className="pulse-cyan"></span>
                <span
                  className="text-light fw-medium font-syne tracking-wide py-1 telemetry-badge-text"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {"// GET IN TOUCH // COLLABORATE"}
                </span>
              </motion.div>
              <motion.h2
                variants={titleVariants}
                className="font-syne connect-section-title text-uppercase text-white cyber-title-glow mb-0"
              >
                Let&apos;s Build Something Resilient
              </motion.h2>
              <motion.p
                variants={subtitleVariants}
                className="font-space-grotesk text-light text-opacity-70 small mx-auto mb-0 connect-section-desc"
                style={{ maxWidth: "560px", letterSpacing: "0.02em" }}
              >
                Available for distributed systems, backend architectures, and applied AI initiatives.
              </motion.p>
            </motion.div>

            {/* Option 2: 3D Quantum Pylon & Isometric Fan Deck */}
            <motion.div
              variants={carouselVariants}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
              className="w-100 mt-4 mt-md-1 position-relative"
            >
              <Connect3DCarousel isExiting={isExiting} />
            </motion.div>

            {/* Action CTA Strip */}
            <motion.div
              variants={ctaVariants}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
              className="text-center font-syncopate mt-4 mt-md-4 mt-lg-3"
            >
              <Link
                href="/contact"
                className="btn btn-neon-cyan px-4 py-2 rounded-pill tracking-wider text-uppercase"
                style={{ fontSize: "0.5rem" }}
              >
                <i className="bi bi-send me-2"></i> Get In Touch &rarr;
              </Link>
            </motion.div>
          </div>

          {/* Integrated Slide 7 Footer (Visible above dock on >md, close to bottom navbar on <sm) */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            animate={isExiting ? "exit" : "visible"}
            className="w-100 mt-auto pt-1 pb-3 pb-sm-0 pt-sm-2 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-1 connect-slide-footer"
            style={{ borderColor: "rgba(0, 242, 254, 0.12)" }}
          >
            <div className="text-light text-opacity-65 font-bruno text-center text-sm-start" style={{ fontSize: "0.58rem" }}>
              <span className="text-white fw-semibold me-3 me-sm-1">{PERSONAL_INFO.name}</span>
              <span className="ms-3 ms-sm-2 opacity-75 font-syne">&copy; {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className="d-flex align-items-center gap-3 font-outfit fw-light" style={{ fontSize: "0.6rem", letterSpacing: 2 }}>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-light text-opacity-70 text-decoration-none hover-cyan">
                GitHub
              </a>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-light text-opacity-70 text-decoration-none hover-cyan">
                LinkedIn
              </a>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="text-light text-opacity-70 text-decoration-none hover-cyan">
                Email
              </a>
              <button
                type="button"
                onClick={() => publishSlideSelect(0)}
                className="bg-transparent border-0 p-0 text-warning text-decoration-none cursor-pointer"
                style={{ fontSize: "0.58rem" }}
                title="Return to Slide 1"
              >
                Top &uarr;
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
