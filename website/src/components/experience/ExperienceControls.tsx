"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  subscribeExperienceTab,
  publishExperienceTab,
  ExperienceTabType,
} from "@/lib/slideEvents";

interface ExperienceControlsProps {
  currentTab?: ExperienceTabType;
  onTabChange?: (tab: ExperienceTabType) => void;
  className?: string;
}

const TABS: { id: ExperienceTabType; label: string; shortLabel: string; icon: string }[] = [
  { id: "production", label: "Production Roles", shortLabel: "Roles", icon: "bi-briefcase-fill" },
  { id: "academic", label: "Academic Milestone", shortLabel: "Academic", icon: "bi-mortarboard-fill" },
];

export default function ExperienceControls({
  currentTab: propTab,
  onTabChange,
  className = "",
}: ExperienceControlsProps) {
  const [activeTab, setActiveTab] = useState<ExperienceTabType>("production");

  useEffect(() => {
    const unsub = subscribeExperienceTab((tab) => {
      setActiveTab(tab);
    });
    return unsub;
  }, []);

  const currentActive = propTab ?? activeTab;

  const handleSelect = (tabId: ExperienceTabType) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      publishExperienceTab(tabId);
    }
  };

  return (
    <div
      className={`position-relative d-inline-flex align-items-center p-1 rounded-pill gap-2 shadow-sm user-select-none ${className}`}
      style={{
        height: "auto",
        background: "rgba(4, 9, 20, 0.88)",
        border: "1px solid rgba(0, 242, 254, 0.35)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6), 0 0 14px rgba(0, 242, 254, 0.16)",
        zIndex: 1045,
      }}
      role="tablist"
      aria-label="Experience Categories"
    >
      {TABS.map((tab) => {
        const isActive = currentActive === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(tab.id)}
            className="btn border-0 rounded-pill position-relative d-inline-flex align-items-center gap-1 px-2 px-sm-3 py-1 font-syncopate text-uppercase fw-light"
            style={{
              fontSize: "0.4rem",
              letterSpacing: "0.1em",
              color: isActive ? "#00f2fe" : "rgba(255, 255, 255, 0.65)",
              transition: "color 0.25s ease",
              cursor: "pointer",
              isolation: "isolate",
            }}
          >
            {isActive && (
              <motion.span
                layoutId="activeExpTabPill"
                className="position-absolute top-0 start-0 w-100 h-100 rounded-pill"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 242, 254, 0.24) 0%, rgba(79, 172, 254, 0.14) 100%)",
                  border: "1px solid rgba(0, 242, 254, 0.65)",
                  boxShadow: "0 0 12px rgba(0, 242, 254, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
                  zIndex: 0,
                }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <i
              className={`bi ${tab.icon} position-relative`}
              style={{
                color: isActive ? "#00f2fe" : "rgba(255, 255, 255, 0.5)",
                fontSize: "0.68rem",
                filter: isActive ? "drop-shadow(0 0 4px rgba(0, 242, 254, 0.6))" : "none",
                zIndex: 1,
              }}
            />
            <span className="d-none d-md-inline position-relative" style={{ textShadow: isActive ? "0 0 8px rgba(0, 242, 254, 0.6)" : "none", zIndex: 1 }}>
              {tab.label}
            </span>
            <span className="d-inline d-md-none position-relative" style={{ textShadow: isActive ? "0 0 8px rgba(0, 242, 254, 0.6)" : "none", zIndex: 1 }}>
              {tab.shortLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
