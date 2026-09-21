"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PERSONAL_INFO } from "../../data/portfolioData";

const QUOTE_TEXT =
  "“I believe in writing maintainable, well-architected code that delivers measurable business outcomes. Focusing on reliable systems, resilient cloud infrastructure, and clean separation of concerns.”";

export default function AboutSlidePhilosophy() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let intervalId: NodeJS.Timeout;

    // Small delay after slide entry animation starts
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index++;
        setDisplayedText(QUOTE_TEXT.slice(0, index));
        if (index >= QUOTE_TEXT.length) {
          clearInterval(intervalId);
          setIsTypingComplete(true);
        }
      }, 15);
    }, 280);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-100 d-flex flex-column align-items-center text-center mt-3 mt-md-0 px-3 px-md-4">
      {/* Telemetry Badge */}
      <div className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-1">
        <span className="pulse-cyan" aria-hidden="true" />
        <span className="text-light fw-medium font-syne tracking-wide about-telemetry-badge-text">
          {"// TELEMETRY: CORE_IDENTITY //"}
        </span>
      </div>

      {/* Slide Title */}
      <h1 className="font-syne fw-bold text-uppercase text-white cyber-title-glow about-slide-title mb-1">
        Engineering Philosophy
      </h1>

      <p className="font-space-grotesk fw-semibold text-uppercase about-slide-subtitle mb-2 mb-lg-0" style={{ color: "#00f2fe" }}>
        Full Stack Engineer &bull; Applied AI Architect
      </p>

      {/* Unique Glassmorphic Cyber Narrative Card */}
      <div className="about-philosophy-card text-start mx-auto position-relative py-lg-4">
        {/* Top Micro-HUD Telemetry Header */}
        <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-white border-opacity-10">
          <div className="d-inline-flex align-items-center gap-1.5 font-space-grotesk text-light text-opacity-60 about-philosophy-status">
            <span className="pulse-cyan me-2" aria-hidden="true" style={{ width: "6px", height: "6px" }} />
            <span style={{ letterSpacing: 3 }}>CORE_NARRATIVE // V2.4</span>
          </div>
          <span className="font-space-grotesk text-uppercase px-2 py-0.5 rounded-pill" style={{ fontSize: "0.52rem", background: "rgba(0, 242, 254, 0.08)", color: "#00f2fe", border: "1px solid rgba(0, 242, 254, 0.2)", letterSpacing: 2 }}>
            ENGINEER MINDSET
          </span>
        </div>

        {/* Bio Narrative with Cyber Accent Rail */}
        <div className="position-relative ps-2.5 mb-2 ps-2" style={{ borderLeft: "2px solid rgba(0, 242, 254, 0.4)" }}>
          <p className="font-outfit text-light text-opacity-90 mb-1.5 about-philosophy-bio">
            {PERSONAL_INFO.bio}
          </p>
          <p
            style={{ letterSpacing: 0.5, minHeight: "2.6em" }}
            className="font-outfit fw-light text-light text-opacity-75 mb-0 about-philosophy-quote fst-italic"
          >
            {displayedText}
            <motion.span
              animate={{ opacity: isTypingComplete ? [1, 0] : [1, 0.15, 1] }}
              transition={{
                repeat: Infinity,
                duration: isTypingComplete ? 0.9 : 0.4,
                ease: "easeInOut",
              }}
              className="d-inline-block ms-1"
              style={{
                color: "#00f2fe",
                fontWeight: 600,
                fontSize: "0.95em",
                lineHeight: 1,
                verticalAlign: "baseline",
                filter: "drop-shadow(0 0 4px #00f2fe)",
              }}
              aria-hidden="true"
            >
              |
            </motion.span>
          </p>
        </div>

        {/* Action Triggers */}
        <div className="font-syncopate d-flex flex-wrap gap-2 pt-2 border-top border-white border-opacity-10">
          <a
            href={PERSONAL_INFO.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-neon-cyan rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center about-philosophy-btn p-2 px-3"
          >
            <i className="bi bi-file-earmark-arrow-down-fill me-1"></i> Download Full Resume
          </a>
          <Link
            href="/contact"
            className="btn btn-cyber-glass rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center about-philosophy-btn p-2 px-3"
          >
            <i className="bi bi-chat-dots-fill me-1"></i> Let&apos;s Connect
          </Link>
        </div>
      </div>
    </div>
  );
}
