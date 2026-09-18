"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Principles3DDeck from "./Principles3DDeck";

interface HomePrinciplesProps {
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

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const deckVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", scale: 0.96 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.96,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export default function HomePrinciples({ isExiting = false }: HomePrinciplesProps) {
  return (
    <div
      id="hero-principles"
      className="w-100 pt-1 pt-sm-2 principles-offset-wrapper d-flex flex-column justify-content-start h-100"
      style={{ marginTop: -45 }}
    >
      <div className="row justify-content-center m-0">
        <div className="col-12 col-md-11 col-lg-11 col-xl-10 p-0">
          {/* Header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isExiting ? "exit" : "visible"}
            className="text-center mb-0 pb-1 border-bottom"
            style={{ borderColor: "rgba(0, 242, 254, 0.15)" }}
          >
            <motion.div
              variants={badgeVariants}
              className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-1 mb-md-2"
            >
              <span className="pulse-cyan"></span>
              <span
                className="text-light fw-medium font-syne tracking-wide py-1 telemetry-badge-text"
                style={{ letterSpacing: "0.2em" }}
              >
                {"// CORE DIRECTIVES // ARCHITECTURAL TENETS"}
              </span>
            </motion.div>
            <motion.h2
              variants={titleVariants}
              className="font-syne principles-section-title text-uppercase text-white cyber-title-glow mb-1"
            >
              Architectural Principles
            </motion.h2>
            <motion.p
              variants={subtitleVariants}
              className="font-space-grotesk text-light text-opacity-75 small mx-auto mb-1"
              style={{ maxWidth: "600px", fontSize: "0.75rem", letterSpacing: "0.025em" }}
            >
              Technical standards guiding every system I architect, from fault-tolerant backends to sub-second reactive interfaces.
            </motion.p>
          </motion.div>

          {/* 3D Holographic Quantum Monolith & Isometric Stack Deck */}
          <motion.div
            variants={deckVariants}
            initial="hidden"
            animate={isExiting ? "exit" : "visible"}
            className="w-100 mt-2 mt-md-3 position-relative"
          >
            <Principles3DDeck isExiting={isExiting} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

