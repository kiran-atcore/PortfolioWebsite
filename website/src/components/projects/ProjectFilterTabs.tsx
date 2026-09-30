"use client";

import { motion } from "framer-motion";

interface ProjectFilterTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export default function ProjectFilterTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: ProjectFilterTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="d-flex justify-content-center flex-wrap gap-1 gap-md-3 gap-lg-4 gap-sm-2 mt-3 mb-3 mb-md-4 px-0 position-relative"
      style={{ zIndex: 2 }}
    >
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        const count = categoryCounts[cat] ?? 0;

        return (
          <button
            key={cat}
            type="button"
            style={{ fontSize: "0.37rem" }}
            onClick={() => onSelectCategory(cat)}
            className={`projects-filter-btn d-inline-flex fw-semibold align-items-center gap-1 ${isActive ? "active" : ""
              }`}
          >
            <span className="font-syncopate">{cat}</span>
            <span
              className="badge font-outfit rounded-pill"
              style={{
                fontSize: "0.4rem",
                padding: "0.15rem 0.4rem",
                background: isActive ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.08)",
                color: isActive ? "#02040a" : "#00f2fe",
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
