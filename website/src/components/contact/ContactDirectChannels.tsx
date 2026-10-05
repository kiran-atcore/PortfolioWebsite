"use client";

import { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { PERSONAL_INFO } from "@/data/portfolioData";

export default function ContactDirectChannels() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch { /* Clipboard fallback */ }
  };

  const channels = [
    { key: "email", label: "// COMM: EMAIL", value: PERSONAL_INFO.email, href: `mailto:${PERSONAL_INFO.email}`, icon: "bi-envelope-at-fill", color: "#00f2fe", bg: "rgba(0, 242, 254, 0.12)", border: "rgba(0, 242, 254, 0.35)", actionIcon: "bi-box-arrow-up-right", actionTitle: "Open Mail" },
    { key: "phone", label: "// VOICE: CELL", value: PERSONAL_INFO.phone, href: `tel:${PERSONAL_INFO.phone}`, icon: "bi-telephone-inbound-fill", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.35)", actionIcon: "bi-telephone-outbound", actionTitle: "Call Direct" },
    { key: "location", label: "// STATION: BASE", value: PERSONAL_INFO.location, href: null, icon: "bi-geo-alt-fill", color: "#ff2a85", bg: "rgba(255, 42, 133, 0.12)", border: "rgba(255, 42, 133, 0.35)", badge: "IST (+5:30)" },
  ];

  return (
    <div className="contact-channels-deck w-100 mx-auto" style={{ maxWidth: "1020px" }}>
      {/* 3-Channel Telemetry Grid: 3 columns on >=md, compact horizontal strips on <md */}
      <div className="row contact-channel-row">
        {channels.map((ch, idx) => (
          <motion.div
            key={ch.key}
            className="col-12 col-md-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.22 + idx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div style={{ borderRadius: "16px" }} className="contact-channel-card contact-cyber-card h-100 d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-start position-relative">
              <span className="contact-rim contact-rim-tl" aria-hidden="true" />
              <span className="contact-rim contact-rim-br" aria-hidden="true" />

              {/* Icon & Details */}
              <div className="d-flex align-items-center min-w-0 flex-grow-1 w-md-100 contact-channel-details">
                <div className="contact-channel-icon flex-shrink-0" style={{ color: ch.color, background: ch.bg, borderColor: ch.border }}>
                  <i className={`bi ${ch.icon}`} />
                </div>
                <div className="min-w-0 flex-grow-1">
                  <div className="contact-channel-meta font-mono text-light text-opacity-50 text-uppercase text-nowrap">{ch.label}</div>
                  {ch.href ? (
                    <a href={ch.href} className="contact-channel-value text-white fw-semibold text-decoration-none d-block text-truncate">
                      {ch.value}
                    </a>
                  ) : (
                    <span className="contact-channel-value text-white fw-semibold d-block text-truncate">{ch.value}</span>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="d-flex align-items-center flex-shrink-0 ms-2 ms-md-0 border-top-md w-md-100 justify-content-end justify-content-md-between contact-channel-actions">
                {ch.href && (
                  <button
                    type="button"
                    onClick={(e) => handleCopy(ch.value, ch.key, e)}
                    className="btn btn-cyber-glass contact-copy-btn p-0 d-flex align-items-center justify-content-center"
                    title={`Copy ${ch.key}`}
                  >
                    <i className={`bi ${copiedKey === ch.key ? "bi-check2 text-cyan" : "bi-clipboard"}`} />
                  </button>
                )}
                {ch.href ? (
                  <a href={ch.href} className="btn btn-cyber-glass contact-copy-btn p-0 d-flex align-items-center justify-content-center text-decoration-none" title={ch.actionTitle}>
                    <i className={`bi ${ch.actionIcon} text-cyan`} />
                  </a>
                ) : (
                  <span className="badge font-mono rounded-pill border text-uppercase contact-channel-badge" style={{ borderColor: "rgba(255,255,255,0.15)", color: "#94a3b8" }}>
                    {ch.badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Network Nodes Quick-Access Ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
        className="contact-nodes-ribbon d-flex align-items-center justify-content-between flex-wrap gap-1 rounded-pill"
      >
        <span style={{ fontSize: "0.6rem" }} className="text-light font-space-grotesk text-opacity-50 small d-none d-sm-inline ms-2 contact-nodes-label">
          {"// NETWORK NODES:"}
        </span>
        <div className="d-flex gap-1 flex-grow-1 flex-sm-grow-0 justify-content-between font-syncopate w-100-mobile p-1">
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="btn btn-cyber-glass contact-social-btn rounded-pill tracking-wider text-uppercase flex-fill text-center">
            <i className="bi bi-linkedin text-info me-1" /> LinkedIn
          </a>
          <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="btn btn-cyber-glass contact-social-btn rounded-pill tracking-wider text-uppercase flex-fill text-center">
            <i className="bi bi-github text-white me-1" /> GitHub
          </a>
          <a href={PERSONAL_INFO.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-cyber-glass contact-social-btn rounded-pill tracking-wider text-uppercase flex-fill text-center">
            <i className="bi bi-file-earmark-person text-cyan me-1" /> CV
          </a>
        </div>
      </motion.div>

      {/* Navigation trigger to Message Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
        className="text-center contact-scroll-wrap"
      >
        <button
          type="button"
          onClick={() => {
            document.getElementById("contact-message-section")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="btn contact-scroll-btn rounded-pill font-syncopate text-uppercase d-inline-flex align-items-center gap-2"
          title="Scroll to Direct Message Form"
        >
          <i className="bi bi-chat-left-dots-fill text-cyan" />
          <span>Write Direct Message</span>
          <i className="bi bi-chevron-down text-cyan" />
        </button>
      </motion.div>
    </div>
  );
}
