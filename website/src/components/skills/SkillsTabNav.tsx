"use client";

import { motion } from "framer-motion";

interface SkillsTabNavProps {
  activeTab: "skills" | "certifications";
  onSelectTab: (tab: "skills" | "certifications") => void;
  skillsCount: number;
  certificationsCount: number;
}

export default function SkillsTabNav({
  activeTab,
  onSelectTab,
  skillsCount,
  certificationsCount,
}: SkillsTabNavProps) {
  const tabs = [
    {
      id: "skills" as const,
      label: "Skills Matrix",
      icon: "bi-cpu-fill",
      badge: `${skillsCount} Domains`,
    },
    {
      id: "certifications" as const,
      label: "Certifications",
      icon: "bi-patch-check-fill",
      badge: `${certificationsCount} Verified`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="d-flex justify-content-center flex-wrap gap-2 gap-sm-3 my-4 position-relative"
      style={{ zIndex: 2 }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`projects-filter-btn d-inline-flex align-items-center gap-2 ${isActive ? "active" : ""
              }`}
            style={{
              padding: "0.5rem 1.25rem",
              fontSize: "0.82rem",
            }}
          >
            <i className={`bi ${tab.icon} ${isActive ? "text-dark" : "text-cyan"}`} />
            <span className="font-syncopate fw-semibold tracking-wider text-uppercase" style={{ fontSize: "0.72rem" }}>
              {tab.label}
            </span>
            <span
              className="badge font-mono rounded-pill"
              style={{
                fontSize: "0.68rem",
                padding: "0.2rem 0.55rem",
                background: isActive ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 242, 254, 0.12)",
                color: isActive ? "#02040a" : "#00f2fe",
                border: isActive ? "none" : "1px solid rgba(0, 242, 254, 0.25)",
              }}
            >
              {tab.badge}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
