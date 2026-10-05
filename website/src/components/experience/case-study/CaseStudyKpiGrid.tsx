"use client";

import React from "react";
import { CaseStudySpec } from "@/data/experienceCaseStudies";

interface CaseStudyKpiGridProps {
  kpis: CaseStudySpec["kpis"];
}

export default function CaseStudyKpiGrid({ kpis }: CaseStudyKpiGridProps) {
  return (
    <section className="mb-4 mb-md-5">
      <div className="spec-kpi-grid">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="spec-kpi-card"
          >
            <div className="spec-kpi-watermark font-space-grotesk fw-bold">
              0{idx + 1}
            </div>

            <div className="spec-kpi-label font-space-grotesk text-uppercase text-cyan mb-1">
              {kpi.label}
            </div>

            <div className="spec-kpi-value font-space-grotesk fw-bold mb-1">
              {kpi.value}
            </div>

            <p className="spec-kpi-detail font-outfit text-white-50 mb-0">
              {kpi.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
