"use client";

import { memo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { SkillCategory, CertificationItem } from "@/data/portfolioData";

interface DepthCardItemProps {
  item: SkillCategory | CertificationItem;
  type: "skills" | "certifications";
  index: number;
  progress: MotionValue<number>;
}

function DepthCardItemComponent({ item, type, index, progress }: DepthCardItemProps) {
  // relative distance: positive means card is in the distance (not yet reached)
  const distance = useTransform(progress, (p) => index - p);

  // Seed random spawn position based on index
  const seedX = Math.sin(index * 13.5) * 600;
  const seedY = Math.cos(index * 13.5) * 350;

  const z = useTransform(distance, (d) => {
    if (d >= 0) return -d * 400; // in distance
    return -d * 200; // flying past viewer
  });

  const x = useTransform(distance, (d) => {
    if (d >= 0) return (d / 3) * seedX;
    return (d / 2) * -seedX;
  });

  const y = useTransform(distance, (d) => {
    if (d >= 0) return (d / 3) * seedY;
    return (d / 2) * -seedY;
  });

  const scale = useTransform(distance, (d) => {
    if (d >= 0) return Math.max(0, 1 - d * 0.25);
    return 1 + Math.abs(d) * 0.4;
  });

  const opacity = useTransform(distance, (d) => {
    if (d >= 0) return Math.max(0, 1 - d * 0.4);
    return Math.max(0, 1 - Math.abs(d) * 1.5);
  });

  const blurAmount = useTransform(distance, (d) => {
    return d >= 0 ? Math.min(10, d * 3) : Math.min(15, Math.abs(d) * 8);
  });
  const filter = useTransform(blurAmount, (b) => (b > 0.4 ? `blur(${b}px)` : "none"));

  const pointerEvents = useTransform(distance, (d) => (Math.abs(d) < 0.35 ? "auto" : "none"));
  const display = useTransform(distance, (d) => (Math.abs(d) > 3.5 ? "none" : "flex"));
  const zIndex = useTransform(distance, (d) => Math.round(100 - Math.abs(d) * 10));

  const isCurrent = useTransform(distance, (d) => Math.abs(d) < 0.35);
  const bg = useTransform(isCurrent, (curr) => curr ? "rgba(5, 12, 28, 0.9)" : "rgba(4, 9, 20, 0.75)");
  const border = useTransform(isCurrent, (curr) => curr ? "1px solid rgba(0, 242, 254, 0.55)" : "1px solid rgba(0, 242, 254, 0.2)");
  const boxShadow = useTransform(isCurrent, (curr) => curr
    ? "0 14px 36px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 242, 254, 0.22), inset 0 1px 2px rgba(0, 242, 254, 0.35)"
    : "0 8px 24px rgba(0, 0, 0, 0.6)"
  );

  const isSkill = type === "skills";
  const skill = isSkill ? (item as SkillCategory) : null;
  const cert = !isSkill ? (item as CertificationItem) : null;

  return (
    <motion.div
      className="position-absolute w-100 justify-content-center px-3"
      style={{
        x, y, z, scale, opacity, filter, zIndex, pointerEvents, display,
        willChange: "transform, opacity, filter",
      }}
    >
      <motion.div
        className="w-100 p-3 p-sm-3 rounded-4 d-flex flex-column overflow-hidden"
        style={{
          maxWidth: "560px",
          maxHeight: "260px",
          background: bg,
          border,
          boxShadow,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2 min-w-0">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-3"
              style={{
                width: "clamp(28px, 8vw, 36px)",
                height: "clamp(28px, 8vw, 36px)",
                background: "rgba(0, 242, 254, 0.1)",
                border: "1px solid rgba(0, 242, 254, 0.3)",
                color: "#00f2fe",
              }}
            >
              <i className={`bi ${isSkill ? skill?.icon : "bi-patch-check-fill"} fs-6`} />
            </div>
            <div className="min-w-0">
              <span className="font-space-grotesk text-cyan d-block text-break" style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.62rem)", letterSpacing: "0.2em" }}>
                // {isSkill ? `DOMAIN 0${index + 1}` : cert?.issuer.toUpperCase()}
              </span>
              <h3
                className="font-syne text-white fw-bold mb-0 mt-1 text-break tracking-wide"
                style={{
                  fontSize: "clamp(0.65rem, 3vw, 1rem)",
                  wordBreak: "normal",
                  overflowWrap: "anywhere"
                }}
              >
                {isSkill ? skill?.title : cert?.title}
              </h3>
            </div>
          </div>
          <span
            className="badge font-space-grotesk rounded-pill px-2 py-1 flex-shrink-0 ms-1 ms-sm-2"
            style={{
              letterSpacing: "0.05rem",
              fontSize: "clamp(0.45rem, 1.2vw, 0.6rem)",
              background: "rgba(0, 242, 254, 0.08)",
              color: "#00f2fe",
              border: "1px solid rgba(0, 242, 254, 0.25)",
            }}
          >
            {isSkill ? `${skill?.skills.length} TECHS` : `ACCREDITED`}
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-100 mb-2 flex-shrink-0"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, rgba(0, 242, 254, 0.5) 0%, rgba(255, 255, 255, 0.08) 60%, transparent 100%)",
          }}
        />

        {/* Content Body */}
        {isSkill && skill ? (
          <div className="d-flex flex-wrap gap-2 align-content-start overflow-y-auto custom-scrollbar pe-1" style={{ maxHeight: "140px" }}>
            {skill.skills.map((s, sIdx) => (
              <span
                key={sIdx}
                className="font-space-grotesk text-light rounded-2 px-1 px-sm-2 py-1 d-inline-flex align-items-center"
                style={{
                  fontSize: "clamp(0.5rem, 1.5vw, 0.7rem)",
                  background: "rgba(9, 18, 38, 0.8)",
                  border: "1px solid rgba(0, 242, 254, 0.18)",
                  color: "#e2e8f0",
                  letterSpacing: "0.1rem",
                }}
              >
                <span className="pulse-cyan me-2" style={{ width: 4, height: 4 }} aria-hidden="true" />
                {s}
              </span>
            ))}
          </div>
        ) : (
          <div className="d-flex flex-column justify-content-center py-1 py-sm-2 overflow-y-auto">
            <p className="font-outfit text-light fw-light text-opacity-75 small mb-2" style={{ fontSize: "clamp(0.65rem, 2.5vw, 0.78rem)", lineHeight: "1.3" }}>
              Verified professional credential issued by {cert?.issuer}.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="pulse-cyan" style={{ width: 5, height: 5 }} aria-hidden="true" />
              <span className="font-space-grotesk text-cyan" style={{ fontSize: "clamp(0.45rem, 1.5vw, 0.62rem)", letterSpacing: "0.2em" }}>
                OFFICIAL VERIFICATION #0{index + 1}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default memo(DepthCardItemComponent);
