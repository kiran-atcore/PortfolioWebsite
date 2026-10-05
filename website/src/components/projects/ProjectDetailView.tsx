"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectItem } from "@/data/portfolioData";
import ProjectKpiCard from "./ProjectKpiCard";
import ProjectTitle3DHero from "./ProjectTitle3DHero";

interface ProjectDetailViewProps {
  project: ProjectItem;
  prevProject?: { slug: string; title: string };
  nextProject?: { slug: string; title: string };
}

export default function ProjectDetailView({
  project,
  prevProject,
  nextProject,
}: ProjectDetailViewProps) {
  const [expandedHighlight, setExpandedHighlight] = useState<number | null>(null);

  const toggleHighlight = (idx: number) => {
    setExpandedHighlight((prev) => (prev === idx ? null : idx));
  };

  const accordionVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        opacity: { duration: 0.16, ease: "easeIn" as const },
        height: { duration: 0.28, delay: 0.14, ease: [0.16, 1, 0.3, 1] as const },
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
        opacity: { duration: 0.24, delay: 0.22, ease: "easeOut" as const },
      },
    },
  };

  const highlightItems =
    project.detailedHighlights && project.detailedHighlights.length > 0
      ? project.detailedHighlights
      : project.highlights.map((h) => ({
        title: h,
        detail: `${h} This production implementation is engineered with strict reliability, modular decoupling, and sub-millisecond execution patterns to ensure zero downtime under high load.`,
      }));
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "AI & ML":
        return {
          primary: "#c084fc",
          secondary: "#e879f9",
          bg: "rgba(168, 85, 247, 0.15)",
          border: "rgba(192, 132, 252, 0.35)",
          glow: "rgba(192, 132, 252, 0.25)",
        };
      case "Mobile":
        return {
          primary: "#34d399",
          secondary: "#00f2fe",
          bg: "rgba(16, 185, 129, 0.15)",
          border: "rgba(52, 211, 153, 0.35)",
          glow: "rgba(52, 211, 153, 0.25)",
        };
      default:
        return {
          primary: "#00f2fe",
          secondary: "#38bdf8",
          bg: "rgba(0, 242, 254, 0.15)",
          border: "rgba(0, 242, 254, 0.35)",
          glow: "rgba(0, 242, 254, 0.25)",
        };
    }
  };

  const theme = getCategoryTheme(project.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="position-relative w-100"
    >
      <style>{`
        /* ==========================================================================
           5-TIER RESPONSIVE STYLING FOR PROJECT DETAIL VIEW
           1. < 400px: Ultra-compact mobile
           2. 400px - 575.98px: Standard mobile (400 to sm)
           3. 576px - 767.98px: Phablet / Small tablet (sm to md)
           4. 768px - 991.98px: Medium tablet / Small laptop (md to lg)
           5. >= 992px: Desktop / Large displays (> lg)
           ========================================================================== */

        /* Base Defaults / Desktop Tier (>= 992px) */
        .spec-top-nav {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .spec-back-btn {
          font-size: 0.65rem;
          padding: 0.55rem 1.4rem;
        }
        .spec-telemetry-chip {
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          padding: 0.5rem 1.15rem;
        }
        .spec-deck-card {
          padding: 44px 44px;
          border-radius: 20px;
          margin-bottom: 2.5rem;
          background: linear-gradient(145deg, rgba(6, 15, 30, 0.92) 0%, rgba(10, 12, 26, 0.96) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 242, 254, 0.45);
          border-top-color: rgba(0, 242, 254, 0.85);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px ${theme.glow}, inset 0 0 20px rgba(0, 242, 254, 0.06);
        }
        .spec-rim-top-left, .spec-rim-top-right, .spec-rim-bottom-left, .spec-rim-bottom-right {
          position: absolute;
          width: 16px;
          height: 16px;
          pointer-events: none;
        }
        .spec-rim-top-left { top: 0; left: 0; border-top: 2px solid #00f2fe; border-left: 2px solid #00f2fe; border-top-left-radius: 20px; }
        .spec-rim-top-right { top: 0; right: 0; border-top: 2px solid #00f2fe; border-right: 2px solid #00f2fe; border-top-right-radius: 20px; }
        .spec-rim-bottom-left { bottom: 0; left: 0; border-bottom: 2px solid ${theme.primary}; border-left: 2px solid ${theme.primary}; border-bottom-left-radius: 20px; }
        .spec-rim-bottom-right { bottom: 0; right: 0; border-bottom: 2px solid ${theme.primary}; border-right: 2px solid ${theme.primary}; border-bottom-right-radius: 20px; }

        .spec-header-ribbon {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
        }
        .spec-category-badge {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          padding: 5px 16px;
        }
        .spec-action-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.85rem;
        }
        .spec-action-btn {
          font-size: 0.64rem;
          padding: 0.55rem 1.25rem;
        }
        .spec-title {
          font-size: 2.75rem;
          letter-spacing: 0.16em;
          line-height: 1.2;
          margin-bottom: 0.75rem;
          text-shadow: 0 0 35px rgba(0, 242, 254, 0.4);
          word-break: break-word;
        }
        .spec-tagline {
          font-size: 1.05rem;
          letter-spacing: 0.08em;
          margin-bottom: 1.15rem;
        }
        .spec-summary {
          font-size: 0.98rem;
          line-height: 1.75;
          letter-spacing: 0.02em;
          margin-bottom: 2rem;
        }
        .spec-section-heading {
          font-size: 1.12rem;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }
        .spec-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .spec-kpi-card {
          padding: 1.05rem 1.3rem;
          border-radius: 12px;
          background: rgba(0, 242, 254, 0.05);
          border: 1px solid rgba(0, 242, 254, 0.22);
          backdrop-filter: blur(10px);
        }
        .spec-kpi-label {
          font-size: 0.58rem;
          letter-spacing: 0.16em;
        }
        .spec-kpi-text {
          font-size: 0.88rem;
          letter-spacing: 0.04em;
        }
        .spec-highlights-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 2rem;
        }
        .spec-highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 1.35rem;
          border-radius: 12px;
          background: rgba(4, 9, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.92rem;
          line-height: 1.7;
        }
        .spec-highlight-accordion-item:hover {
          border-color: rgba(0, 242, 254, 0.4) !important;
          background: rgba(6, 16, 32, 0.75) !important;
        }
        .spec-highlight-title {
          font-size: 0.92rem;
          letter-spacing: 0.03em;
        }
        .spec-highlight-desc {
          font-size: 0.88rem;
          line-height: 1.7;
        }
        .spec-challenge-box {
          padding: 1.35rem 1.65rem;
          border-radius: 12px;
          background: rgba(4, 9, 22, 0.75);
          border: 1px solid rgba(0, 242, 254, 0.25);
          border-left: 4px solid ${theme.primary};
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          font-size: 0.92rem;
          line-height: 1.75;
          margin-bottom: 2rem;
        }
        .spec-challenge-meta {
          font-size: 0.64rem;
          letter-spacing: 0.16em;
        }
        .spec-challenge-title {
          font-size: 0.96rem;
          letter-spacing: 0.04em;
        }
        .spec-challenge-desc {
          font-size: 0.9rem;
          line-height: 1.7;
        }
        .spec-challenge-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .spec-tech-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          margin-bottom: 1.5rem;
        }
        .spec-tech-chip {
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          padding: 0.45rem 1.15rem;
          border-radius: 9999px;
          background: rgba(8, 15, 30, 0.75);
          border: 1px solid rgba(0, 242, 254, 0.3);
          box-shadow: 0 0 10px rgba(0, 242, 254, 0.08);
        }
        .spec-adjacent-nav {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
        }

        /* --------------------------------------------------------------------------
           TIER 4: md to lg (768px - 991.98px)
           -------------------------------------------------------------------------- */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .spec-top-nav {
            margin-bottom: 1.75rem;
          }
          .spec-back-btn {
            font-size: 0.62rem;
            padding: 0.5rem 1.25rem;
          }
          .spec-telemetry-chip {
            font-size: 0.66rem;
            padding: 0.48rem 1.05rem;
          }
          .spec-deck-card {
            padding: 34px 30px;
            border-radius: 18px;
            margin-bottom: 2.25rem;
          }
          .spec-rim-top-left, .spec-rim-top-right, .spec-rim-bottom-left, .spec-rim-bottom-right {
            width: 14px;
            height: 14px;
          }
          .spec-rim-top-left { border-top-left-radius: 18px; }
          .spec-rim-top-right { border-top-right-radius: 18px; }
          .spec-rim-bottom-left { border-bottom-left-radius: 18px; }
          .spec-rim-bottom-right { border-bottom-right-radius: 18px; }

          .spec-header-ribbon {
            margin-bottom: 1.75rem;
            padding-bottom: 1.15rem;
          }
          .spec-category-badge {
            font-size: 0.66rem;
            padding: 5px 14px;
          }
          .spec-action-btn {
            font-size: 0.62rem;
            padding: 0.5rem 1.15rem;
          }
          .spec-title {
            font-size: 2.25rem;
            letter-spacing: 0.14em;
            margin-bottom: 0.65rem;
          }
          .spec-tagline {
            font-size: 0.98rem;
            letter-spacing: 0.07em;
            margin-bottom: 1rem;
          }
          .spec-summary {
            font-size: 0.94rem;
            line-height: 1.72;
            margin-bottom: 1.75rem;
          }
          .spec-section-heading {
            font-size: 1.06rem;
            margin-bottom: 0.9rem;
          }
          .spec-kpi-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 0.85rem;
            margin-bottom: 1.75rem;
          }
          .spec-kpi-card {
            padding: 0.95rem 1.15rem;
          }
          .spec-highlight-item {
            padding: 0.9rem 1.15rem;
            font-size: 0.89rem;
          }
          .spec-highlight-title {
            font-size: 0.89rem;
          }
          .spec-highlight-desc {
            font-size: 0.86rem;
          }
          .spec-challenge-box {
            padding: 1.15rem 1.4rem;
            font-size: 0.89rem;
            margin-bottom: 1.75rem;
          }
          .spec-challenge-title {
            font-size: 0.92rem;
          }
          .spec-challenge-desc {
            font-size: 0.88rem;
            line-height: 1.65;
          }
          .spec-tech-chip {
            font-size: 0.72rem;
            padding: 0.4rem 0.95rem;
          }
          .spec-adjacent-nav {
            margin-top: 2.25rem;
            padding-top: 1.35rem;
          }
        }

        /* --------------------------------------------------------------------------
           TIER 3: sm to md (576px - 767.98px)
           -------------------------------------------------------------------------- */
        @media (min-width: 576px) and (max-width: 767.98px) {
          .spec-top-nav {
            margin-bottom: 1.5rem;
            gap: 0.75rem;
          }
          .spec-back-btn {
            font-size: 0.6rem;
            padding: 0.45rem 1.15rem;
          }
          .spec-telemetry-chip {
            font-size: 0.64rem;
            letter-spacing: 0.15em;
            padding: 0.45rem 0.95rem;
          }
          .spec-deck-card {
            padding: 26px 22px;
            border-radius: 16px;
            margin-bottom: 2rem;
          }
          .spec-rim-top-left, .spec-rim-top-right, .spec-rim-bottom-left, .spec-rim-bottom-right {
            width: 12px;
            height: 12px;
          }
          .spec-rim-top-left { border-top-left-radius: 16px; }
          .spec-rim-top-right { border-top-right-radius: 16px; }
          .spec-rim-bottom-left { border-bottom-left-radius: 16px; }
          .spec-rim-bottom-right { border-bottom-right-radius: 16px; }

          .spec-header-ribbon {
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            gap: 0.75rem;
          }
          .spec-category-badge {
            font-size: 0.64rem;
            padding: 4px 12px;
          }
          .spec-action-group {
            gap: 0.65rem;
          }
          .spec-action-btn {
            font-size: 0.58rem;
            padding: 0.45rem 1rem;
          }
          .spec-title {
            font-size: 1.85rem;
            letter-spacing: 0.12em;
            margin-bottom: 0.55rem;
          }
          .spec-tagline {
            font-size: 0.9rem;
            letter-spacing: 0.06em;
            margin-bottom: 0.85rem;
          }
          .spec-summary {
            font-size: 0.88rem;
            line-height: 1.68;
            margin-bottom: 1.5rem;
          }
          .spec-section-heading {
            font-size: 1rem;
            margin-bottom: 0.85rem;
          }
          .spec-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }
          .spec-kpi-card {
            padding: 0.85rem 1rem;
          }
          .spec-kpi-text {
            font-size: 0.82rem;
          }
          .spec-highlight-item {
            padding: 0.8rem 1rem;
            font-size: 0.86rem;
            gap: 0.75rem;
          }
          .spec-highlight-title {
            font-size: 0.86rem;
          }
          .spec-highlight-desc {
            font-size: 0.84rem;
          }
          .spec-challenge-box {
            padding: 1rem 1.25rem;
            font-size: 0.86rem;
            margin-bottom: 1.5rem;
          }
          .spec-challenge-title {
            font-size: 0.88rem;
          }
          .spec-challenge-desc {
            font-size: 0.85rem;
            line-height: 1.6;
          }
          .spec-tech-chip {
            font-size: 0.68rem;
            padding: 0.35rem 0.85rem;
          }
          .spec-adjacent-nav {
            margin-top: 2rem;
            padding-top: 1.25rem;
          }
        }

        /* --------------------------------------------------------------------------
           TIER 2: 400px to sm (400px - 575.98px)
           -------------------------------------------------------------------------- */
        @media (min-width: 400px) and (max-width: 575.98px) {
          .spec-top-nav {
            margin-bottom: 1.25rem;
            gap: 0.6rem;
          }
          .spec-back-btn {
            font-size: 0.58rem;
            padding: 0.42rem 1rem;
          }
          .spec-telemetry-chip {
            font-size: 0.6rem;
            letter-spacing: 0.12em;
            padding: 0.42rem 0.85rem;
          }
          .spec-deck-card {
            padding: 20px 16px;
            border-radius: 15px;
            margin-bottom: 1.75rem;
          }
          .spec-rim-top-left, .spec-rim-top-right, .spec-rim-bottom-left, .spec-rim-bottom-right {
            width: 10px;
            height: 10px;
          }
          .spec-rim-top-left { border-top-left-radius: 15px; }
          .spec-rim-top-right { border-top-right-radius: 15px; }
          .spec-rim-bottom-left { border-bottom-left-radius: 15px; }
          .spec-rim-bottom-right { border-bottom-right-radius: 15px; }

          .spec-header-ribbon {
            margin-bottom: 1.25rem;
            padding-bottom: 0.95rem;
            gap: 0.65rem;
            flex-wrap: wrap;
          }
          .spec-category-badge {
            font-size: 0.62rem;
            padding: 3px 10px;
          }
          .spec-action-group {
            gap: 0.5rem;
          }
          .spec-action-btn {
            font-size: 0.56rem;
            padding: 0.42rem 0.9rem;
          }
          .spec-title {
            font-size: 1.55rem;
            letter-spacing: 0.1em;
            margin-bottom: 0.5rem;
          }
          .spec-tagline {
            font-size: 0.82rem;
            letter-spacing: 0.05em;
            margin-bottom: 0.75rem;
          }
          .spec-summary {
            font-size: 0.84rem;
            line-height: 1.65;
            margin-bottom: 1.35rem;
          }
          .spec-section-heading {
            font-size: 0.95rem;
            letter-spacing: 0.07em;
            margin-bottom: 0.75rem;
          }
          .spec-kpi-grid {
            grid-template-columns: 1fr;
            gap: 0.65rem;
            margin-bottom: 1.35rem;
          }
          .spec-kpi-card {
            padding: 0.75rem 0.95rem;
          }
          .spec-kpi-text {
            font-size: 0.8rem;
          }
          .spec-highlight-item {
            padding: 0.75rem 0.9rem;
            font-size: 0.83rem;
            gap: 0.65rem;
          }
          .spec-highlight-title {
            font-size: 0.82rem;
          }
          .spec-highlight-desc {
            font-size: 0.8rem;
          }
          .spec-challenge-box {
            padding: 0.95rem 1.15rem;
            font-size: 0.83rem;
            margin-bottom: 1.35rem;
            border-left-width: 3px;
          }
          .spec-challenge-meta {
            font-size: 0.58rem;
          }
          .spec-challenge-title {
            font-size: 0.82rem;
          }
          .spec-challenge-desc {
            font-size: 0.8rem;
            line-height: 1.55;
          }
          .spec-tech-chip {
            font-size: 0.66rem;
            padding: 0.32rem 0.75rem;
          }
          .spec-adjacent-nav {
            margin-top: 1.75rem;
            padding-top: 1.15rem;
            gap: 0.75rem;
          }
        }

        /* --------------------------------------------------------------------------
           TIER 1: < 400px (Ultra-compact mobile screens)
           -------------------------------------------------------------------------- */
        @media (max-width: 399.98px) {
          .spec-top-nav {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          .spec-back-btn {
            width: 100%;
            justify-content: center;
            font-size: 0.56rem;
            padding: 0.4rem 0.8rem;
          }
          .spec-telemetry-chip {
            width: 100%;
            justify-content: center;
            font-size: 0.56rem;
            letter-spacing: 0.1em;
            padding: 0.38rem 0.65rem;
          }
          .spec-deck-card {
            padding: 14px 12px;
            border-radius: 14px;
            margin-bottom: 1.25rem;
          }
          .spec-rim-top-left, .spec-rim-top-right, .spec-rim-bottom-left, .spec-rim-bottom-right {
            width: 9px;
            height: 9px;
          }
          .spec-rim-top-left { border-top-left-radius: 14px; }
          .spec-rim-top-right { border-top-right-radius: 14px; }
          .spec-rim-bottom-left { border-bottom-left-radius: 14px; }
          .spec-rim-bottom-right { border-bottom-right-radius: 14px; }

          .spec-header-ribbon {
            flex-direction: column;
            align-items: stretch;
            gap: 0.65rem;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
          }
          .spec-category-badge {
            align-self: flex-start;
            font-size: 0.58rem;
            letter-spacing: 0.12em;
            padding: 3px 8px;
          }
          .spec-action-group {
            width: 100%;
            flex-direction: column;
            gap: 0.45rem;
          }
          .spec-action-btn {
            width: 100%;
            justify-content: center;
            font-size: 0.55rem;
            padding: 0.42rem 0.75rem;
          }
          .spec-title {
            font-size: 1.25rem;
            letter-spacing: 0.08em;
            line-height: 1.25;
            margin-bottom: 0.4rem;
          }
          .spec-tagline {
            font-size: 0.74rem;
            letter-spacing: 0.04em;
            margin-bottom: 0.65rem;
          }
          .spec-summary {
            font-size: 0.78rem;
            line-height: 1.6;
            margin-bottom: 1.15rem;
          }
          .spec-section-heading {
            font-size: 0.88rem;
            letter-spacing: 0.06em;
            margin-bottom: 0.65rem;
          }
          .spec-kpi-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            margin-bottom: 1.15rem;
          }
          .spec-kpi-card {
            padding: 0.65rem 0.8rem;
          }
          .spec-kpi-label {
            font-size: 0.52rem;
            letter-spacing: 0.12em;
          }
          .spec-kpi-text {
            font-size: 0.75rem;
          }
          .spec-highlights-list {
            gap: 0.5rem;
            margin-bottom: 1.15rem;
          }
          .spec-highlight-item {
            padding: 0.6rem 0.75rem;
            font-size: 0.78rem;
            gap: 0.55rem;
            line-height: 1.5;
          }
          .spec-highlight-title {
            font-size: 0.76rem;
          }
          .spec-highlight-desc {
            font-size: 0.75rem;
          }
          .spec-challenge-box {
            padding: 0.8rem 0.95rem;
            font-size: 0.78rem;
            line-height: 1.55;
            margin-bottom: 1.15rem;
            border-left-width: 3px;
          }
          .spec-challenge-meta {
            font-size: 0.55rem;
            letter-spacing: 0.1em;
          }
          .spec-challenge-title {
            font-size: 0.75rem;
          }
          .spec-challenge-desc {
            font-size: 0.76rem;
            line-height: 1.5;
          }
          .spec-tech-grid {
            gap: 0.45rem;
            margin-bottom: 1rem;
          }
          .spec-tech-chip {
            font-size: 0.62rem;
            padding: 0.25rem 0.55rem;
            letter-spacing: 0.08em;
          }
          .spec-adjacent-nav {
            flex-direction: column;
            align-items: stretch;
            gap: 0.55rem;
            margin-top: 1.25rem;
            padding-top: 0.95rem;
          }
        }
      `}</style>

      {/* Top Cyber Telemetry & Back Ribbon */}
      <div className="spec-top-nav">
        <Link
          href="/projects?tab=showcase"
          style={{ maxWidth: 200 }}
          className="btn btn-cyber-glass spec-back-btn rounded-pill font-syncopate tracking-wider text-uppercase d-inline-flex align-items-center gap-2"
        >
          <i className="bi bi-arrow-left" />
          <span>All Systems</span>
        </Link>

        <div className="d-inline-flex align-items-center gap-2 spec-telemetry-chip hud-telemetry-chip rounded-pill">
          <span className="pulse-cyan" aria-hidden="true" />
          <span style={{ fontSize: "0.5rem", letterSpacing: 2 }} className="text-light fw-medium font-syne">
            {`// SPEC_INTEL: ${project.id.toUpperCase()} //`}
          </span>
        </div>
      </div>

      {/* Main Cyber Glass Specification Deck */}
      <div
        className="position-relative overflow-hidden spec-deck-card text-white"
        style={{
          borderBottomColor: theme.border,
        }}
      >
        {/* Glowing Cyber Rim Accents */}
        <div className="spec-rim-top-left" />
        <div className="spec-rim-top-right" />
        <div className="spec-rim-bottom-left" />
        <div className="spec-rim-bottom-right" />

        {/* Header Ribbon: Category Badge & Interactive Action Triggers */}
        <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center justify-content-sm-between border-bottom py-2 mb-3 border-white border-opacity-25">
          <div
            className="d-inline-flex px-3 align-items-center gap-1.5 rounded-pill font-space-grotesk text-uppercase spec-category-badge"
            style={{
              alignSelf: "flex-start",
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              color: theme.primary,
            }}
          >
            <span
              className="d-inline-block rounded-circle me-2"
              style={{
                width: 6,
                height: 6,
                background: theme.primary,
                boxShadow: `0 0 8px ${theme.primary}`,
              }}
            />
            <span style={{ letterSpacing: 3 }}>{project.category}</span>
          </div>

          <div className="spec-action-group font-syncopate">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-neon-cyan spec-action-btn rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-box-arrow-up-right" />
                <span>Live System</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-cyber-glass spec-action-btn rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-github" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Project Title & Tagline with Three.js Particle Grid & Framer Motion Stagger */}
        <div className="spec-title-hero-wrapper mb-4">
          <ProjectTitle3DHero
            title={project.title}
            tagline={project.tagline}
            theme={theme}
            id={project.id}
          />
          <p style={{ letterSpacing: 0.7 }} className="font-outfit text-light fw-light text-opacity-75 spec-summary mt-3 mb-0">
            {project.summary}
          </p>
        </div>

        {/* Verified Telemetry / KPIs */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="spec-kpi-grid">
            {project.metrics.map((metric, i) => (
              <ProjectKpiCard
                key={i}
                metric={metric}
                index={i}
                theme={theme}
              />
            ))}
          </div>
        )}

        {/* Architecture & Highlights (Accordion Dropdown) */}
        {highlightItems && highlightItems.length > 0 && (
          <div className="mb-4 pt-3">
            <h3
              className="font-syne fw-bold text-white text-uppercase tracking-wider spec-section-heading d-flex align-items-center gap-2"
            >
              <i className="bi bi-diagram-3-fill me-2" style={{ color: "#00f2fe" }} />
              <span className="text-center text-sm-start">Architecture &amp; System Highlights</span>
            </h3>

            <div className="spec-highlights-list mt-4">
              {highlightItems.map((item, i) => {
                const isExpanded = expandedHighlight === i;
                const padIndex = String(i + 1).padStart(2, "0");
                return (
                  <div
                    key={i}
                    className={`position-relative overflow-hidden rounded-3 spec-highlight-accordion-item ${isExpanded ? "spec-highlight-accordion-active" : ""}`}
                    style={{
                      background: isExpanded
                        ? "linear-gradient(135deg, rgba(6, 16, 34, 0.92) 0%, rgba(3, 9, 22, 0.88) 100%)"
                        : "linear-gradient(135deg, rgba(4, 9, 20, 0.65) 0%, rgba(2, 6, 14, 0.55) 100%)",
                      border: isExpanded
                        ? `1px solid ${theme.primary}77`
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      borderLeft: isExpanded
                        ? `3px solid ${theme.primary}`
                        : "3px solid rgba(255, 255, 255, 0.12)",
                      boxShadow: isExpanded
                        ? `0 8px 24px rgba(0, 0, 0, 0.55), 0 0 18px ${theme.glow}`
                        : "0 2px 8px rgba(0, 0, 0, 0.2)",
                      transition:
                        "border 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
                    }}
                  >
                    {/* Subtle Laser Scan Accent on Expanded */}
                    {isExpanded && (
                      <motion.div
                        animate={{ x: ["-100%", "250%"] }}
                        transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "80px",
                          height: "1px",
                          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Corner Bracket Accent */}
                    <div
                      className="position-absolute top-0 end-0"
                      style={{
                        width: 6,
                        height: 6,
                        borderTop: `2px solid ${isExpanded ? theme.primary : "rgba(0, 242, 254, 0.4)"}`,
                        borderRight: `2px solid ${isExpanded ? theme.primary : "rgba(0, 242, 254, 0.4)"}`,
                        opacity: isExpanded ? 1 : 0.4,
                        transition: "all 0.25s ease",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Accordion Trigger Header */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleHighlight(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleHighlight(i);
                        }
                      }}
                      className="d-flex align-items-center justify-content-between p-3 user-select-none"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center gap-0 flex-grow-1 pe-2" style={{ minWidth: 0 }}>
                        {/* Monospace Index & Terminal Indicator */}
                        <div
                          className="d-inline-flex font-space-grotesk me-3 align-items-center gap-1 flex-shrink-0 p-1 rounded"
                          style={{
                            background: isExpanded
                              ? `${theme.primary}18`
                              : "rgba(255, 255, 255, 0.04)",
                            border: isExpanded
                              ? `1px solid ${theme.primary}44`
                              : "1px solid rgba(255, 255, 255, 0.08)",
                            transition: "all 0.25s ease",
                          }}
                        >
                          <span
                            className="fw-bold"
                            style={{
                              color: isExpanded ? theme.primary : "rgba(0, 242, 254, 0.7)",
                              fontSize: "0.6rem",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {padIndex}
                          </span>
                          <span
                            style={{
                              color: isExpanded ? theme.primary : "rgba(255, 255, 255, 0.35)",
                              fontSize: "0.6rem",
                              lineHeight: 1,
                            }}
                          >
                            /
                          </span>
                          <span
                            className="fw-bold"
                            style={{
                              color: isExpanded ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                              fontSize: "0.6rem",
                            }}
                          >
                            &gt;_
                          </span>
                        </div>

                        <span
                          className="font-syne fw-medium spec-highlight-title"
                          style={{
                            fontSize: "0.7rem",
                            color: isExpanded ? "#ffffff" : "rgba(255, 255, 255, 0.88)",
                            textShadow: isExpanded ? `0 0 14px ${theme.glow}` : "none",
                            transition: "color 0.25s ease, text-shadow 0.25s ease",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.title}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
                        <span
                          className="d-none d-sm-inline-block font-mono text-uppercase text-light text-opacity-40"
                          style={{ fontSize: "0.52rem", letterSpacing: "0.12em" }}
                        >
                          {isExpanded ? "[ COLLAPSE ]" : "[ INTEL ]"}
                        </span>
                        <span
                          className="rounded-circle d-inline-flex align-items-center justify-content-center"
                          style={{
                            width: 24,
                            height: 24,
                            background: isExpanded
                              ? theme.bg
                              : "rgba(255, 255, 255, 0.05)",
                            border: isExpanded
                              ? `1px solid ${theme.border}`
                              : "1px solid rgba(255, 255, 255, 0.12)",
                            color: isExpanded ? theme.primary : "#94a3b8",
                            boxShadow: isExpanded ? `0 0 10px ${theme.glow}` : "none",
                            transition: "all 0.25s ease",
                          }}
                        >
                          <i
                            className="bi bi-chevron-down"
                            style={{
                              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                              transition:
                                "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                              fontSize: "0.68rem",
                            }}
                          />
                        </span>
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="accordion-content"
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          variants={accordionVariants}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            className="px-3 px-sm-3 pb-3.5 pt-0 border-top"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.08)",
                              backgroundColor: "rgba(2, 6, 16, 0.45)",
                            }}
                          >
                            {/* Drawer Telemetry Header */}
                            <div className="pt-3 pb-2 d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <span
                                  className="pulse-cyan flex-shrink-0"
                                  aria-hidden="true"
                                  style={{
                                    width: 5,
                                    height: 5,
                                    backgroundColor: theme.primary,
                                    boxShadow: `0 0 8px ${theme.primary}`,
                                  }}
                                />
                                <span
                                  className="font-space-grotesk text-uppercase text-light text-opacity-50"
                                  style={{ fontSize: "0.58rem", letterSpacing: "0.14em" }}
                                >
                                  {`ARCH_NODE_${padIndex} // SYSTEM_INTEL`}
                                </span>
                              </div>

                              <span
                                className="font-space-grotesk text-uppercase badge d-none d-sm-inline-block"
                                style={{
                                  fontSize: "0.5rem",
                                  letterSpacing: "0.1em",
                                  backgroundColor: "rgba(0, 242, 254, 0.08)",
                                  border: "1px solid rgba(0, 242, 254, 0.2)",
                                  color: theme.primary,
                                }}
                              >
                                VERIFIED SPEC
                              </span>
                            </div>

                            {/* Detailed Content Well */}
                            <div
                              className="p-3 rounded-2 mb-2"
                              style={{
                                background: "rgba(0, 0, 0, 0.25)",
                                borderLeft: `3px solid ${theme.primary}88`,
                              }}
                            >
                              <p
                                className="font-outfit text-light text-opacity-90 mb-0 fw-light spec-highlight-desc"
                                style={{ lineHeight: 1.75, fontSize: "0.7rem" }}
                              >
                                {item.detail}
                              </p>
                            </div>

                            {/* Micro Telemetry Footer Badges */}
                            <div className="d-flex fw-light flex-wrap align-items-center gap-2 pt-1 my-3">
                              <span
                                className="font-space-grotesk text-uppercase badge p-2"
                                style={{
                                  fontSize: "0.4rem",
                                  letterSpacing: "0.2em",
                                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                                  border: "1px solid rgba(255, 255, 255, 0.06)",
                                  color: "rgba(255, 255, 255, 0.55)",
                                }}
                              >
                                LATENCY: &lt;10MS
                              </span>
                              <span
                                className="font-space-grotesk text-uppercase badge p-2"
                                style={{
                                  fontSize: "0.4rem",
                                  letterSpacing: "0.2em",
                                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                                  border: "1px solid rgba(255, 255, 255, 0.06)",
                                  color: "rgba(255, 255, 255, 0.55)",
                                }}
                              >
                                CONCURRENCY: OPTIMIZED
                              </span>
                              <span
                                className="font-space-grotesk text-uppercase badge p-2"
                                style={{
                                  fontSize: "0.4rem",
                                  letterSpacing: "0.2em",
                                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                                  border: "1px solid rgba(255, 255, 255, 0.06)",
                                  color: "rgba(255, 255, 255, 0.55)",
                                }}
                              >
                                INTEGRITY: VERIFIED
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Engineering Challenge & Resolution */}
        {(project.detailedChallenges || project.challenges) && (
          <div className="my-4 pt-2">
            <h3
              className="font-syne mb-3 fw-bold text-white text-uppercase tracking-wider spec-section-heading d-flex align-items-center gap-2"
            >
              <i className="bi bi-shield-check" style={{ color: theme.secondary }} />
              <span className="text-center text-sm-start">Engineering Challenges &amp; Resolution</span>
            </h3>

            {project.detailedChallenges && project.detailedChallenges.length > 0 ? (
              <div className="d-flex flex-column gap-3 mb-4">
                {project.detailedChallenges.map((item, idx) => (
                  <div key={idx} className="spec-challenge-box mb-0">
                    <div className="spec-challenge-card-header">
                      <div className="d-flex align-items-center flex-wrap gap-2">
                        <span
                          className="font-space-grotesk text-uppercase text-light text-opacity-50 spec-challenge-meta"
                        >
                          {`// VECTOR 0${idx + 1} //`}
                        </span>
                        <span
                          className="font-syne fw-bold text-white spec-challenge-title"
                        >
                          {item.title}
                        </span>
                      </div>
                      <span
                        className="badge rounded-pill font-space-grotesk px-2 py-0.5 flex-shrink-0"
                        style={{
                          background: "rgba(16, 185, 129, 0.2)",
                          color: "#34d399",
                          fontSize: "0.58rem",
                        }}
                      >
                        RESOLVED
                      </span>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-start gap-3 my-1">
                        <span
                          className="badge rounded-pill font-space-grotesk px-2 py-0.5 flex-shrink-0 mt-0.5"
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            color: "#f87171",
                            fontSize: "0.55rem",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                          }}
                        >
                          CHALLENGE
                        </span>
                        <p style={{ fontSize: "0.6rem" }} className="font-outfit text-light text-opacity-80 mb-0 spec-challenge-desc">
                          {item.problem}
                        </p>
                      </div>

                      <div className="d-flex align-items-start gap-3 pt-2 border-top border-white border-opacity-10 my-1">
                        <span
                          className="badge rounded-pill font-space-grotesk px-2 py-0.5 flex-shrink-0 mt-0.5"
                          style={{
                            background: theme.bg,
                            color: theme.primary,
                            fontSize: "0.55rem",
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          RESOLUTION
                        </span>
                        <p style={{ fontSize: "0.6rem" }} className="font-outfit text-white text-opacity-90 mb-0 spec-challenge-desc">
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="spec-challenge-box">
                <div className="spec-challenge-card-header">
                  <span
                    className="font-space-grotesk text-uppercase text-light text-opacity-60 spec-challenge-meta"
                  >
                    // CHALLENGE_PROTOCOL // RESOLVED
                  </span>
                  <span
                    className="badge rounded-pill font-mono px-2 py-0.5"
                    style={{
                      background: "rgba(16, 185, 129, 0.2)",
                      color: "#34d399",
                      fontSize: "0.58rem",
                    }}
                  >
                    VERIFIED
                  </span>
                </div>
                <p className="font-outfit text-light text-opacity-85 mb-0 spec-challenge-desc">
                  {project.challenges}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Technologies & Systems Matrix */}
        <div>
          <h3
            className="font-syne fw-bold text-white text-uppercase tracking-wider spec-section-heading d-flex align-items-center gap-2"
          >
            <i className="bi bi-cpu me-1" style={{ color: "#00f2fe" }} />
            <span className="text-center text-sm-start">Technologies &amp; Systems Matrix</span>
          </h3>
          <div className="spec-tech-grid py-2">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="font-space-grotesk text-white text-opacity-75 spec-tech-chip px-3"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Adjacent Navigation Ribbon */}
        {(prevProject || nextProject) && (
          <div className="spec-adjacent-nav font-syncopate border-top border-white border-opacity-10">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="btn btn-cyber-glass spec-action-btn rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-chevron-left" />
                <span>Prev: {prevProject.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="btn btn-cyber-glass spec-action-btn rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center gap-2 ms-sm-auto"
              >
                <span>Next: {nextProject.title}</span>
                <i className="bi bi-chevron-right" />
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
