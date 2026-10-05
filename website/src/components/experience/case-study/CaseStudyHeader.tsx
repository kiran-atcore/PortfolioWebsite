"use client";

import React from "react";
import Link from "next/link";
import { CaseStudySpec } from "@/data/experienceCaseStudies";

interface CaseStudyHeaderProps {
  spec: CaseStudySpec;
}

export default function CaseStudyHeader({ spec }: CaseStudyHeaderProps) {
  return (
    <header className="mb-4 mb-md-5">
      {/* Top Nav Breadcrumb & Status */}
      <div className="spec-top-nav">
        <Link
          href="/experience"
          className="btn btn-cyber-glass rounded-pill d-inline-flex align-items-center gap-2 spec-back-btn"
        >
          <span>&larr;</span>
          <span className="font-syncopate tracking-wider text-uppercase">
            Experience Index
          </span>
        </Link>

        <div className="spec-telemetry-chip font-space-grotesk text-uppercase text-cyan d-inline-flex align-items-center gap-2">
          <span
            className="rounded-circle d-inline-block"
            style={{ width: 7, height: 7, backgroundColor: "#00f2fe", boxShadow: "0 0 8px #00f2fe" }}
          />
          <span>EXP // {spec.slug}</span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="spec-header-ribbon">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className="badge rounded-pill spec-category-badge font-space-grotesk">
              PRODUCTION CASE STUDY
            </span>
            <span className="font-space-grotesk text-cyan fw-semibold spec-company-text">
              {spec.company}
            </span>
          </div>

          <h1 className="font-syne fw-bold text-white spec-title mb-2">
            {spec.title}
          </h1>

          <p className="font-outfit text-white-50 spec-tagline mb-3">
            {spec.subtitle}
          </p>

          <div className="d-flex align-items-center gap-3 font-space-grotesk text-white-50 spec-meta-row flex-wrap">
            <span className="d-inline-flex align-items-center gap-1.5">
              <i className="bi bi-person-badge text-cyan" />
              {spec.role}
            </span>
            <span className="opacity-30">•</span>
            <span className="d-inline-flex align-items-center gap-1.5">
              <i className="bi bi-calendar3 text-cyan" />
              {spec.period}
            </span>
            <span className="opacity-30">•</span>
            <span className="d-inline-flex align-items-center gap-1.5">
              <i className="bi bi-geo-alt text-cyan" />
              {spec.location}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="spec-action-group">
          {spec.liveUrl && (
            <a
              href={spec.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-cyber-primary rounded-pill font-syncopate fw-semibold d-inline-flex align-items-center gap-2 spec-action-btn"
            >
              <span className="text-white">Live Platform</span>
              <i className="bi bi-box-arrow-up-right" />
            </a>
          )}
          {spec.githubUrl && (
            <a
              href={spec.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-cyber-glass rounded-pill font-syncopate d-inline-flex align-items-center gap-2 spec-action-btn"
            >
              <i className="bi bi-github" />
              <span>Source Code</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
