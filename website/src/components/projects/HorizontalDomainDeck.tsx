"use client";

import { useRef } from "react";

interface HorizontalDomainDeckProps {
  activeDomainIndex: number;
  onDomainChange: (index: number) => void;
  onSelectCategory?: (category: string) => void;
}

const DOMAINS = [
  {
    name: "Full Stack",
    badge: "50+ Endpoints",
    color: "#00f2fe",
    icon: "bi-layers",
    techs: ["Next.js", "Django REST", "PostgreSQL"],
    desc: "Automated enterprise ingestion & dynamic cron report engine.",
  },
  {
    name: "AI & ML",
    badge: "Sub-sec AI",
    color: "#c084fc",
    icon: "bi-robot",
    techs: ["OpenCV", "XceptionNet", "Groq AI"],
    desc: "Deepfake authenticators & conversational AI interview simulator.",
  },
  {
    name: "Mobile",
    badge: "Live Sockets",
    color: "#34d399",
    icon: "bi-phone",
    techs: ["React Native", "Expo", "WebSockets"],
    desc: "Interactive radar worker locator with bidirectional chat.",
  },
];

export default function HorizontalDomainDeck({
  activeDomainIndex,
  onDomainChange,
  onSelectCategory,
}: HorizontalDomainDeckProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Smooth jitter-free parallax via direct transform on ref
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = -y * 9.5;
    const ry = x * 9.5;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (deckRef.current) {
        deckRef.current.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (deckRef.current) {
        deckRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      }
    });
  };

  return (
    <div
      ref={deckRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-100 my-3 my-md-4 position-relative"
      style={{
        maxWidth: 720,
        zIndex: 2,
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="d-flex flex-row gap-1 gap-sm-2 w-100 align-items-stretch"
        style={{ height: 160 }}
      >
        {DOMAINS.map((dom, idx) => {
          const isExpanded = activeDomainIndex === idx;

          return (
            <div
              key={dom.name}
              onClick={() => onDomainChange(idx)}
              className="projects-bento-card domain-deck-card p-sm-3 d-flex flex-column justify-content-between overflow-hidden position-relative"
              style={{
                flex: isExpanded ? "3.2 1 0%" : "1 1 0%",
                minWidth: 0,
                cursor: isExpanded ? "default" : "pointer",
                borderColor: isExpanded ? dom.color : "rgba(255, 255, 255, 0.08)",
                boxShadow: isExpanded ? `0 0 20px ${dom.color}25` : "none",
                background: isExpanded ? "rgba(4, 9, 22, 0.92)" : "rgba(4, 9, 22, 0.65)",
                transition: "flex 0.42s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease",
                transform: "none",
              }}
            >
              {/* Collapsed View: Sideways Title + Glowing Indicator */}
              {!isExpanded ? (
                <div
                  key="collapsed"
                  className="w-100 h-100 d-flex flex-column align-items-center justify-content-between py-3 py-sm-1 domain-card-collapsed"
                >
                  <span
                    className="rounded-circle"
                    style={{ width: 6, height: 6, background: dom.color, boxShadow: `0 0 8px ${dom.color}` }}
                  />
                  <div
                    className={`font-syne text-uppercase fw-bold text-nowrap my-auto user-select-none ${dom.name === "Full Stack" ? 'dom-name' : ''}`}
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      fontSize: "clamp(0.68rem, 2.2vw, 0.82rem)",
                      letterSpacing: "0.14em",
                      color: "rgba(248, 250, 252, 0.85)",
                    }}
                  >
                    {dom.name}
                  </div>
                  <i className={`bi ${dom.icon}`} style={{ color: dom.color, fontSize: "0.85rem" }} />
                </div>
              ) : (
                /* Expanded View: Full Domain Card Content (delayed 0.28s to let card flex-expand first) */
                <div
                  key="expanded"
                  className="w-100 h-100 d-flex flex-column justify-content-center text-start p-3 domain-card-expanded"
                >
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex mb-1 align-items-center gap-1.5">
                        <i className={`bi ${dom.icon} fs-6`} style={{ color: dom.color }} />
                        <h4 className="font-syne ms-3 fw-bold text-white mb-0" style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.15rem)" }}>
                          {dom.name}
                        </h4>
                      </div>
                    </div>
                    <p className="domain-desc font-outfit text-white-50 small mb-2 mb-sm-4 lh-sm text-truncate-2" style={{ fontSize: "0.78rem" }}>
                      {dom.desc}
                    </p>
                  </div>

                  <div>
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {dom.techs.map((tech) => (
                        <span key={tech} className="badge bg-black bg-opacity-40 text-light text-opacity-75 border border-white border-opacity-10 font-mono" style={{ fontSize: "0.62rem" }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
