"use client";

import React from "react";
import { CaseStudySpec } from "@/data/experienceCaseStudies";

interface CaseStudyBenchmarksProps {
  benchmarks: CaseStudySpec["benchmarks"];
  scenarios: CaseStudySpec["scenarios"];
}

export default function CaseStudyBenchmarks({ benchmarks, scenarios }: CaseStudyBenchmarksProps) {
  return (
    <div className="d-flex flex-column gap-4 gap-md-5 mb-4 mb-md-5">
      {/* Benchmark Analysis Table */}
      <section>
        <h2 className="spec-section-heading font-syne text-white text-uppercase d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-speedometer2 text-cyan" />
          <span>Operational Benchmark Telemetry</span>
        </h2>

        <div className="spec-table-container">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead className="font-space-grotesk text-cyan">
              <tr>
                <th>Workflow Stage</th>
                <th>Manual Approach</th>
                <th>Automated Reporter</th>
                <th className="text-end">Impact Factor</th>
              </tr>
            </thead>
            <tbody className="font-outfit text-white-50">
              {benchmarks.map((row, idx) => {
                const isTotal = row.stage.includes("Total");
                return (
                  <tr
                    key={idx}
                    className={isTotal ? "border-top border-cyan border-opacity-30 bg-cyan bg-opacity-5 fw-bold" : ""}
                  >
                    <td className={isTotal ? "text-white font-space-grotesk" : "text-white"}>
                      {row.stage}
                    </td>
                    <td className="text-white-50">{row.manual}</td>
                    <td className="text-cyan">{row.automated}</td>
                    <td className="text-end font-space-grotesk text-emerald fw-semibold">
                      {row.impact}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verified Production Scenarios */}
      <section>
        <h2 className="spec-section-heading font-syne text-white text-uppercase d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-shield-check text-cyan" />
          <span>Verified Production Deployments</span>
        </h2>

        <div className="row g-3">
          {scenarios.map((sc, idx) => (
            <div key={idx} className="col-12 col-lg-4">
              <div className="spec-subcard d-flex flex-column justify-content-between">
                <div>
                  <div className="font-space-grotesk text-cyan small mb-1">
                    SCENARIO 0{idx + 1}
                  </div>
                  <h3 className="font-syne text-white fw-bold mb-2" style={{ fontSize: "0.95rem" }}>
                    {sc.title}
                  </h3>
                  <div className="small font-outfit text-white-50 mb-2">
                    <span className="text-white fw-semibold">Source: </span>
                    {sc.source}
                  </div>
                  <p className="small font-outfit text-white-50 mb-2">
                    <span className="text-white fw-semibold">Output: </span>
                    {sc.output}
                  </p>
                  <p className="small font-outfit text-white-50 mb-3 fst-italic">
                    &ldquo;{sc.directive}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-top border-white border-opacity-10 font-space-grotesk text-cyan small" style={{ fontSize: "0.72rem" }}>
                  <i className="bi bi-clock me-1.5" />
                  {sc.delivery}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
