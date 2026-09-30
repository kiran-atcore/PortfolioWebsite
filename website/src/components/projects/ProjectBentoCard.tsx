"use client";

import Link from "next/link";
import { ProjectItem } from "@/data/portfolioData";

interface ProjectBentoCardProps {
  project: ProjectItem;
  isHeroBento?: boolean;
}

export default function ProjectBentoCard({ project }: ProjectBentoCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "AI & ML":
        return { primary: "#c084fc", secondary: "#e879f9", bg: "rgba(168, 85, 247, 0.15)" };
      case "Mobile":
        return { primary: "#34d399", secondary: "#00f2fe", bg: "rgba(16, 185, 129, 0.15)" };
      default:
        return { primary: "#00f2fe", secondary: "#c084fc", bg: "rgba(0, 242, 254, 0.15)" };
    }
  };

  const colors = getCategoryColor(project.category);

  return (
    <div
      className="position-relative pb-2 overflow-hidden d-flex flex-column text-white p-3"
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "270px",
        borderRadius: "14px",
        background: "linear-gradient(145deg, rgba(8, 20, 36, 0.88) 0%, rgba(13, 14, 32, 0.92) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0, 242, 254, 0.55)",
        borderTopColor: "rgba(0, 242, 254, 0.85)",
        borderBottomColor: "rgba(192, 132, 252, 0.7)",
        boxShadow: "0 0 24px rgba(0, 242, 254, 0.35), 0 0 35px rgba(192, 132, 252, 0.2), inset 0 0 16px rgba(0, 242, 254, 0.08)",
        padding: "10px 12px",
      }}
    >
      {/* Glowing Cyber Rim Accents */}
      <div className="position-absolute top-0 start-0" style={{ width: 10, height: 10, borderTop: "2px solid #00f2fe", borderLeft: "2px solid #00f2fe", borderTopLeftRadius: "14px" }} />
      <div className="position-absolute top-0 end-0" style={{ width: 10, height: 10, borderTop: "2px solid #00f2fe", borderRight: "2px solid #00f2fe", borderTopRightRadius: "14px" }} />
      <div className="position-absolute bottom-0 start-0" style={{ width: 10, height: 10, borderBottom: "2px solid #c084fc", borderLeft: "2px solid #c084fc", borderBottomLeftRadius: "14px" }} />
      <div className="position-absolute bottom-0 end-0" style={{ width: 10, height: 10, borderBottom: "2px solid #c084fc", borderRight: "2px solid #c084fc", borderBottomRightRadius: "14px" }} />

      {/* HUD Header Bar: Status & Category */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div
          className="d-inline-flex align-items-center gap-1 px-2 py-0.5 rounded-pill font-space-grotesk text-uppercase"
          style={{
            fontSize: "0.56rem",
            letterSpacing: "0.2em",
            background: colors.bg,
            border: `1px solid ${colors.primary}55`,
            color: colors.primary,
          }}
        >
          <span
            className="d-inline-block rounded-circle me-1"
            style={{
              width: 5,
              height: 5,
              background: colors.primary,
              boxShadow: `0 0 6px ${colors.primary}`,
            }}
          />
          <span>{project.category}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-light text-opacity-60 text-hover-cyan"
              style={{ fontSize: "0.8rem", transition: "color 0.2s" }}
              aria-label="GitHub Repository"
            >
              <i className="bi bi-github" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-info"
              style={{ fontSize: "0.8rem", filter: "drop-shadow(0 0 4px #00f2fe)" }}
              aria-label="Live Demo"
            >
              <i className="bi bi-box-arrow-up-right" />
            </a>
          )}
        </div>
      </div>

      {/* Project Title & Tagline */}
      <div className="mb-2">
        <h3
          className="font-syne fw-bold text-white mb-0.5 text-truncate"
          style={{ fontSize: "0.9rem", letterSpacing: "0.04em" }}
          title={project.title}
        >
          {project.title}
        </h3>
        <p
          className="font-outfit text-white-50 mb-0 text-truncate"
          style={{ fontSize: "0.68rem", letterSpacing: "0.05em" }}
        >
          <span style={{ color: colors.secondary }}>//</span> {project.tagline}
        </p>
      </div>

      {/* Mission Telemetry Callout */}
      {project.metrics && project.metrics.length > 0 && (
        <div
          className="p-1 px-2 rounded mb-2 d-flex align-items-center justify-content-between"
          style={{
            background: "rgba(0, 242, 254, 0.06)",
            border: "1px solid rgba(0, 242, 254, 0.2)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="d-flex align-items-center gap-1.5 text-truncate">
            <i className="bi bi-cpu-fill me-2" style={{ color: colors.primary, fontSize: "0.75rem" }} />
            <span
              className="font-space-grotesk text-truncate text-white"
              style={{ fontSize: "0.55rem", letterSpacing: "0.05em" }}
            >
              {project.metrics[0]}
            </span>
          </div>
          <span
            className="font-space-grotesk text-uppercase text-light text-opacity-40 ps-1"
            style={{ fontSize: "0.5rem", letterSpacing: "0.12em" }}
          >
            KPI
          </span>
        </div>
      )}

      {/* Concise Summary */}
      <p
        className="font-outfit text-light text-opacity-70 mb-2 flex-grow-1"
        style={{
          fontSize: "0.65rem",
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {project.summary}
      </p>

      {/* Tech Stack Micro-Chips */}
      <div className="d-flex flex-wrap gap-1 mb-2">
        {project.techStack.slice(0, 3).map((tech, idx) => (
          <span
            key={idx}
            className="font-space-grotesk text-white-50 px-1.5 py-0.5 rounded"
            style={{
              fontSize: "0.56rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              letterSpacing: "0.15em",
            }}
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 3 && (
          <span
            className="font-mono text-light text-opacity-40 px-1 py-0.5"
            style={{ fontSize: "0.54rem" }}
          >
            +{project.techStack.length - 3}
          </span>
        )}
      </div>

      {/* Bottom Action Ribbon */}
      <div className="mt-auto d-flex justify-content-end align-items-center pt-1 border-top border-white border-opacity-10">

        <Link
          href={`/projects/${project.slug}`}
          className="btn p-2 font-syncopate fw-light text-decoration-none d-inline-flex align-items-center gap-1"
          style={{
            color: "#00f2fe",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            textShadow: "0 0 10px rgba(0, 242, 254, 0.6)",
          }}
        >
          <span>Intel & Specs</span>
          <i className="bi bi-arrow-right-short" style={{ fontSize: "0.95rem" }} />
        </Link>
      </div>
    </div>
  );
}
