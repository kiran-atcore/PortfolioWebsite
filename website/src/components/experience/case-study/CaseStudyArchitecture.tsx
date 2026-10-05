"use client";

import React from "react";
import { CaseStudySpec } from "@/data/experienceCaseStudies";

interface CaseStudyArchitectureProps {
  topology: CaseStudySpec["topology"];
  schemaModels: CaseStudySpec["schemaModels"];
  lessons: CaseStudySpec["lessons"];
  roadmap: CaseStudySpec["roadmap"];
}

export default function CaseStudyArchitecture({
  topology,
  schemaModels,
  lessons,
  roadmap,
}: CaseStudyArchitectureProps) {
  return (
    <div className="d-flex flex-column gap-4 gap-md-5 mb-4">
      {/* Cloud Infrastructure Topology & Data Schema */}
      <section>
        <h2 className="spec-section-heading font-syne text-white text-uppercase d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-cloud-check text-cyan" />
          <span>Cloud Topology &amp; Schema Models</span>
        </h2>

        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <div className="spec-subcard">
              <span className="font-space-grotesk text-cyan small d-block mb-3 text-uppercase fw-semibold">
                // HYBRID CLOUD INFRASTRUCTURE
              </span>
              <div className="d-flex flex-column gap-2.5">
                {topology.map((t, idx) => (
                  <div
                    key={idx}
                    className="spec-subcard-item"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-1">
                      <span className="font-space-grotesk text-white small fw-bold">
                        {t.layer}
                      </span>
                      <span className="badge font-space-grotesk bg-cyan bg-opacity-10 text-cyan border border-cyan border-opacity-25" style={{ fontSize: "0.68rem" }}>
                        {t.service}
                      </span>
                    </div>
                    <p className="font-outfit text-white-50 small mb-0 lh-sm" style={{ fontSize: "0.82rem" }}>
                      {t.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="spec-subcard">
              <span className="font-space-grotesk text-cyan small d-block mb-3 text-uppercase fw-semibold">
                // RELATIONAL DATA SCHEMAS
              </span>
              <div className="d-flex flex-column gap-3">
                {schemaModels.map((m, idx) => (
                  <div
                    key={idx}
                    className="spec-subcard-item"
                  >
                    <div className="font-space-grotesk text-white small fw-bold mb-2">
                      model: <span className="text-cyan">{m.model}</span>
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                      {m.fields.map((f, fi) => (
                        <span
                          key={fi}
                          className="spec-code-tag font-space-grotesk"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Takeaways & Future Roadmap */}
      <section>
        <div className="row g-3 g-md-4">
          <div className="col-12 col-md-6">
            <div className="spec-subcard">
              <h3 className="font-syne text-white small fw-bold text-uppercase mb-2.5 d-flex align-items-center gap-2">
                <i className="bi bi-lightbulb text-warning" />
                <span>Technical Lessons Learned</span>
              </h3>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                {lessons.map((l, i) => (
                  <li key={i} className="font-outfit text-white-50 small d-flex align-items-start gap-2">
                    <span className="text-cyan mt-0.5">&gt;</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="spec-subcard">
              <h3 className="font-syne text-white small fw-bold text-uppercase mb-2.5 d-flex align-items-center gap-2">
                <i className="bi bi-compass text-cyan" />
                <span>Extensible Roadmap</span>
              </h3>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                {roadmap.map((r, i) => (
                  <li key={i} className="font-outfit text-white-50 small d-flex align-items-start gap-2">
                    <span className="text-cyan mt-0.5">&gt;</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
