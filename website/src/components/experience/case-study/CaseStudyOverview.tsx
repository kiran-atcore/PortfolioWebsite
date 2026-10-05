"use client";

import React from "react";
import { CaseStudySpec } from "@/data/experienceCaseStudies";

interface CaseStudyOverviewProps {
  spec: CaseStudySpec;
}

export default function CaseStudyOverview({ spec }: CaseStudyOverviewProps) {
  const { executiveSummary, problems, pillars } = spec;

  return (
    <div className="d-flex flex-column gap-4 gap-md-5 mb-4 mb-md-5">
      {/* Executive Summary Card */}
      <section className="spec-challenge-box position-relative">
        <div className="spec-challenge-card-header mb-3">
          <div className="spec-challenge-meta font-space-grotesk text-cyan text-uppercase">
            // EXECUTIVE BRIEFING
          </div>
          <span className="spec-badge-deployment font-space-grotesk">
            {executiveSummary.deploymentModel}
          </span>
        </div>

        <p className="spec-summary font-outfit mb-3">
          {executiveSummary.narrative}
        </p>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="spec-subcard">
              <span className="font-space-grotesk text-cyan d-block small mb-1.5 fw-semibold">
                CORE VALUE PROPOSITION
              </span>
              <p className="font-outfit text-white mb-0 small lh-base">
                {executiveSummary.coreValue}
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="spec-subcard">
              <span className="font-space-grotesk text-cyan d-block small mb-1.5 fw-semibold">
                ENGINEERING STACK
              </span>
              <div className="d-flex flex-wrap gap-1.5 mt-1">
                {executiveSummary.primaryStack.map((tech, i) => (
                  <span key={i} className="spec-tech-pill font-space-grotesk">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & BI Limitations */}
      <section>
        <h2 className="spec-section-heading font-syne text-white text-uppercase d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle text-amber" />
          <span>The Problem &amp; Opportunity</span>
        </h2>

        <div className="row g-3 g-md-4">
          <div className="col-12 col-lg-6">
            <div className="spec-subcard">
              <h3 className="font-syne text-white small fw-bold text-uppercase mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-x-circle text-danger" />
                <span>The Friction of Manual Reporting</span>
              </h3>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                {problems.friction.map((item, i) => (
                  <li key={i} className="font-outfit text-white-50 small d-flex align-items-start gap-2">
                    <span className="text-cyan mt-0.5">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="spec-subcard">
              <h3 className="font-syne text-white small fw-bold text-uppercase mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-shield-slash text-warning" />
                <span>Limitations of Traditional BI</span>
              </h3>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                {problems.biLimitations.map((item, i) => (
                  <li key={i} className="font-outfit text-white-50 small d-flex align-items-start gap-2">
                    <span className="text-cyan mt-0.5">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Architectural Pillars */}
      <section>
        <h2 className="spec-section-heading font-syne text-white text-uppercase d-flex align-items-center gap-2">
          <i className="bi bi-cpu text-cyan" />
          <span>System Architecture Pillars</span>
        </h2>

        <div className="row g-2.5 g-md-3">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-lg-4">
              <div className="spec-subcard position-relative">
                <span className="font-space-grotesk text-cyan opacity-40 fw-bold small d-block mb-1">
                  PILLAR {pillar.num}
                </span>
                <h4 className="font-syne text-white small fw-bold mb-1.5">
                  {pillar.title}
                </h4>
                <p className="font-outfit text-white-50 small mb-0 lh-base" style={{ fontSize: "0.82rem" }}>
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
