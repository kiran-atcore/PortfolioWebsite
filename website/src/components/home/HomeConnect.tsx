"use client";

import { useState } from "react";
import Link from "next/link";
import { PERSONAL_INFO } from "../../data/portfolioData";

export default function HomeConnect() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero-connect" className="py-5 position-relative w-100 border-top" style={{ borderColor: "rgba(0, 242, 254, 0.15)", backgroundColor: "var(--bg-main)" }}>
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 hud-telemetry-chip rounded-pill mb-3">
            <span className="pulse-cyan"></span>
            <span className="font-michroma tracking-wide" style={{ fontSize: "0.65rem", color: "#94a3b8" }}>
              // DIRECT UPLINK // COMMS
            </span>
          </div>
          <h2 className="font-orbitron display-6 text-uppercase text-white tracking-scifi cyber-title-glow mt-1 mb-2">
            Let&apos;s Build Something Resilient
          </h2>
          <p className="font-oxanium text-light text-opacity-75 small mx-auto mt-2" style={{ maxWidth: "600px", fontSize: "0.95rem", letterSpacing: "0.03em" }}>
            Available for high-throughput software engineering roles, distributed backends, and applied AI initiatives.
          </p>
        </div>

        {/* Connect Grid */}
        <div className="row g-4 justify-content-center mb-5">
          {/* Email Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="cyber-card p-4 h-100 text-center rounded-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
              <div>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 p-2 mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(0, 242, 254, 0.08)",
                    border: "1px solid rgba(0, 242, 254, 0.3)",
                    color: "#00f2fe",
                    boxShadow: "0 0 15px rgba(0, 242, 254, 0.2)",
                  }}
                >
                  <i className="bi bi-envelope-at fs-4"></i>
                </div>
                <h3 className="font-orbitron h6 text-white text-uppercase tracking-wide mb-1">Direct Email</h3>
                <p className="small text-light text-opacity-75 font-mono text-truncate mb-3" title={PERSONAL_INFO.email}>
                  {PERSONAL_INFO.email}
                </p>
              </div>
              <div className="d-flex gap-2 justify-content-center">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="btn btn-sm btn-neon-cyan rounded-pill px-3 font-zendots text-uppercase tracking-wider"
                  style={{ fontSize: "0.6rem" }}
                >
                  Mail
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="btn btn-sm btn-cyber-glass rounded-pill px-3 font-zendots text-uppercase tracking-wider"
                  style={{ fontSize: "0.6rem" }}
                  title="Copy email"
                >
                  {copied ? <span className="text-success">&check; Copied</span> : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="cyber-card p-4 h-100 text-center rounded-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
              <div>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 p-2 mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(255, 42, 133, 0.08)",
                    border: "1px solid rgba(255, 42, 133, 0.3)",
                    color: "#ff2a85",
                    boxShadow: "0 0 15px rgba(255, 42, 133, 0.2)",
                  }}
                >
                  <i className="bi bi-geo-alt-fill fs-4"></i>
                </div>
                <h3 className="font-orbitron h6 text-white text-uppercase tracking-wide mb-1">Location</h3>
                <p className="small text-light text-opacity-75 font-mono mb-2">{PERSONAL_INFO.location}</p>
              </div>
              <div>
                <span
                  className="badge rounded-pill font-mono px-3 py-2"
                  style={{
                    background: "rgba(3, 7, 18, 0.7)",
                    border: "1px solid rgba(255, 42, 133, 0.3)",
                    color: "#ff2a85",
                    fontSize: "0.68rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  // REMOTE &bull; RELOCATE
                </span>
              </div>
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="cyber-card p-4 h-100 text-center rounded-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
              <div>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 p-2 mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(56, 189, 248, 0.08)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    color: "#38bdf8",
                    boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)",
                  }}
                >
                  <i className="bi bi-linkedin fs-4"></i>
                </div>
                <h3 className="font-orbitron h6 text-white text-uppercase tracking-wide mb-1">LinkedIn</h3>
                <p className="small text-light text-opacity-75 font-mono mb-3">kiranchand-s</p>
              </div>
              <div>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-cyber-glass rounded-pill px-3 font-zendots text-uppercase tracking-wider w-100"
                  style={{ fontSize: "0.6rem" }}
                >
                  Connect &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* GitHub Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="cyber-card p-4 h-100 text-center rounded-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
              <div>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 p-2 mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#f8fafc",
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <i className="bi bi-github fs-4"></i>
                </div>
                <h3 className="font-orbitron h6 text-white text-uppercase tracking-wide mb-1">GitHub</h3>
                <p className="small text-light text-opacity-75 font-mono mb-3">kiran-atcore</p>
              </div>
              <div>
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-cyber-glass rounded-pill px-3 font-zendots text-uppercase tracking-wider w-100"
                  style={{ fontSize: "0.6rem" }}
                >
                  Repositories &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="text-center">
          <Link
            href="/contact"
            className="btn btn-neon-cyan px-5 py-3 rounded-pill font-zendots text-uppercase tracking-wider shadow"
            style={{ fontSize: "0.68rem" }}
          >
            <i className="bi bi-chat-dots-fill me-2"></i> Open Transmission Terminal &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
