"use client";

import React from "react";
import Link from "next/link";
import { EXPERIENCES, ExperienceItem } from "@/data/portfolioData";

interface ExperienceCardProductionProps {
  item?: ExperienceItem;
  currentIndex?: number;
  totalCards?: number;
}

export default function ExperienceCardProduction({
  item,
  currentIndex,
  totalCards,
}: ExperienceCardProductionProps) {
  const exp = item ?? EXPERIENCES[0];
  const activeIndex =
    currentIndex !== undefined
      ? currentIndex
      : Math.max(
        0,
        EXPERIENCES.findIndex(
          (e) => e.company === exp.company && e.role === exp.role
        )
      );
  const total = totalCards ?? EXPERIENCES.length;

  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-between py-1 my-auto">
      {/* Top Role & Period Header */}
      <h2 className="font-syne fw-bold text-white mb-2 exp-card-title text-truncate">
        {exp.role}
      </h2>
      <div className="d-flex justify-content-between align-items-center gap-2 pb-1 pb-sm-1.5 border-bottom border-white border-opacity-10 flex-shrink-0">
        <div className="text-truncate">
          <div
            className="font-space-grotesk fw-medium d-flex align-items-center flex-wrap gap-1.5 exp-card-company"
            style={{ color: "#00f2fe" }}
          >
            <span>
              <i className="bi bi-building me-1" />
              {exp.company}
            </span>
            <span className="text-white-50 ms-2">&bull; {exp.location}</span>
          </div>
        </div>
        <div className="hud-telemetry-chip rounded-pill font-mono text-light flex-shrink-0 exp-card-period">
          <i className="bi bi-calendar3 me-1" style={{ color: "#00f2fe" }} />
          {exp.period}
        </div>
      </div>

      {/* Key System Tag */}
      <div className="d-flex align-items-start flex-column justify-content-between my-1 flex-shrink-0">
        <span
          className="badge font-syne text-uppercase rounded-pill fw-bold exp-card-badge mb-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 242, 254, 0.25) 0%, rgba(79, 172, 254, 0.15) 100%)",
            color: "#00f2fe",
            border: "1px solid rgba(0, 242, 254, 0.4)",
            letterSpacing: "0.08em",
          }}
        >
          KEY SYSTEM
        </span>
        <span className="font-space-grotesk fw-semibold text-white exp-card-project-title text-truncate">
          {exp.project}
        </span>
      </div>

      {/* Architectural Contributions */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center overflow-hidden">
        <div className="font-syne fw-semibold text-white text-uppercase tracking-wide exp-card-section-label mb-2 mt-1">
          Architectural Contributions &amp; Business Impact:
        </div>
        <ul className="list-unstyled d-flex flex-column gap-1 mb-0 gap-sm-1 py-2 ps-0">
          {exp.description.map((desc, dIdx) => (
            <li
              key={dIdx}
              className="font-outfit text-light text-opacity-90 d-flex align-items-start gap-1.5 exp-card-bullet"
            >
              <i
                className="bi bi-chevron-right text-cyan mt-0.5 flex-shrink-0"
                style={{
                  color: "#00f2fe",
                  fontSize: "0.65rem",
                  filter: "drop-shadow(0 0 3px #00f2fe)",
                }}
              />
              <span className="text-break">{desc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Trigger Buttons & Slide Count */}
      <div className="font-syncopate d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2 border-top border-white border-opacity-10 flex-shrink-0">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {exp.liveUrl && (
            <a
              href={exp.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-neon-cyan rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center exp-card-btn"
            >
              <i className="bi bi-box-arrow-up-right me-1" /> Live
            </a>
          )}
          {exp.githubUrl && (
            <a
              href={exp.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-cyber-glass rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center exp-card-btn"
            >
              <i className="bi bi-github me-1" /> Code
            </a>
          )}
          <Link
            href={`/experience/${exp.slug || "dispatchr-automated-reporting"}`}
            className="btn btn-cyber-glass rounded-pill tracking-wider text-uppercase d-inline-flex align-items-center exp-card-btn"
            style={{ borderColor: "rgba(0, 242, 254, 0.4)" }}
          >
            Case Study &rarr;
          </Link>
        </div>

        {/* Slide Count */}
        <div
          className="font-outfit d-inline-flex align-items-center gap-1 ms-auto text-white-50 user-select-none"
          style={{
            fontSize: "0.5rem",
          }}
        >
          <span style={{ color: "#00f2fe", fontWeight: 600 }}>
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="opacity-40">/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}
