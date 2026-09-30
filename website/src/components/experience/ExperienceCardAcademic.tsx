"use client";

import React from "react";
import { EDUCATION, EducationItem } from "@/data/portfolioData";

const CORE_SUBJECTS = [
  "Data Structures & Algorithms",
  "DBMS",
  "Computer Networks",
  "Operating Systems",
  "Distributed Systems",
  "Applied Machine Learning",
  "Compiler Design",
  "OOP & Architecture",
];

interface ExperienceCardAcademicProps {
  item?: EducationItem;
}

export default function ExperienceCardAcademic({ item }: ExperienceCardAcademicProps) {
  const edu = item ?? EDUCATION[0];

  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-between py-1">
      {/* Degree & Period Header */}
      <div className="text-truncate">
        <h2 className="font-syne fw-bold text-white mb-0 text-wrap exp-card-title">
          {edu.degree}<br />
          {edu.branch}
        </h2>
        <div
          className="font-space-grotesk fw-medium d-flex align-items-center flex-wrap gap-1.5 exp-card-company"
          style={{ color: "#00f2fe" }}
        >
          <span>
            <i className="bi bi-mortarboard me-1" />
            {edu.institution}
          </span>

        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center gap-2 mt-2 pb-1 pb-sm-1.5 border-bottom border-white border-opacity-10 flex-shrink-0">
        <span className="text-white-50 exp-card-company font-space-grotesk">&bull; {edu.location}</span>

        <div className="hud-telemetry-chip rounded-pill font-mono text-light flex-shrink-0 exp-card-period">
          <i className="bi bi-calendar3 me-1" style={{ color: "#00f2fe" }} />
          {edu.period}
        </div>
      </div>

      {/* Academic Badge */}
      <div className="d-flex align-items-start flex-column gap-1 my-1 flex-shrink-0 py-2 py-sm-0">
        <span
          className="badge font-syne text-uppercase rounded-pill fw-bold exp-card-badge mb-1"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 242, 254, 0.25) 0%, rgba(79, 172, 254, 0.15) 100%)",
            color: "#00f2fe",
            border: "1px solid rgba(0, 242, 254, 0.4)",
            letterSpacing: "0.08em",
          }}
        >
          ACADEMIC DEGREE // CSE
        </span>
        <span className="font-space-grotesk fw-semibold text-white exp-card-project-title text-truncate">
          Engineering Foundations &amp; Computing Theory
        </span>
      </div>

      {/* Description */}
      <p className="font-outfit text-light text-opacity-90 exp-card-bullet mb-1 flex-shrink-0">
        {edu.description}
      </p>

      {/* Coursework & Core Subjects */}
      <div className="flex-grow-1 d-flex flex-column justify-content-end overflow-hidden pt-1 border-top border-white border-opacity-10">
        <div className="font-syne fw-semibold text-white text-uppercase tracking-wide exp-card-section-label">
          Curricular Focus &amp; Core Topics:
        </div>
        <div className="d-flex flex-wrap gap-1 gap-sm-1.5 pt-0.5">
          {CORE_SUBJECTS.map((subject, sIdx) => (
            <span
              key={sIdx}
              className="badge font-mono rounded-pill exp-subject-chip d-inline-flex align-items-center"
              style={{
                background: "rgba(8, 15, 30, 0.65)",
                border: "1px solid rgba(0, 242, 254, 0.22)",
                color: "rgba(255, 255, 255, 0.9)",
                letterSpacing: "0.02em",
              }}
            >
              <i
                className="bi bi-check2-circle text-cyan me-1"
                style={{ color: "#00f2fe" }}
              />
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
