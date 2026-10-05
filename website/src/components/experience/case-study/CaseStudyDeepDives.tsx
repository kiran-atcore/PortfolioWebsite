"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaseStudySpec } from "@/data/experienceCaseStudies";

interface CaseStudyDeepDivesProps {
  deepDives: CaseStudySpec["deepDives"];
}

export default function CaseStudyDeepDives({ deepDives }: CaseStudyDeepDivesProps) {
  const [activeTab, setActiveTab] = useState<string>(deepDives[0].id);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const selected = deepDives.find((d) => d.id === activeTab) || deepDives[0];

  const checkScroll = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    // Keeps indicator activated until user reaches the scroll end
    const hasMore = el.scrollWidth - el.clientWidth - el.scrollLeft > 4;
    setCanScrollRight(hasMore);
  }, []);

  useEffect(() => {
    checkScroll();

    // Check after font & layout calculation
    const timer = setTimeout(checkScroll, 120);

    const el = tabsRef.current;
    if (!el) return () => clearTimeout(timer);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => checkScroll());
      ro.observe(el);
    }

    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [deepDives, checkScroll]);

  const handleScrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 120, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  const handleTabClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(id);
    e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="mb-4 mb-md-5">
      <h2 className="spec-section-heading font-syne text-white text-uppercase d-flex align-items-center gap-2 mb-3">
        <i className="bi bi-gear-wide-connected text-cyan" />
        <span>Core Technical Deep Dives</span>
      </h2>

      {/* Deep Dive Selector Tabs with Scroll Cue */}
      <div className="spec-deepdive-tabs-wrapper position-relative mb-4">
        <div
          ref={tabsRef}
          onScroll={checkScroll}
          className="spec-deepdive-tabs-container d-flex gap-2 p-1"
        >
          {deepDives.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={(e) => handleTabClick(item.id, e)}
              className={`btn rounded-pill font-syncopate text-uppercase spec-deepdive-tab ${activeTab === item.id
                ? "active"
                : ""
                }`}
            >
              {item.tag}
            </button>
          ))}
        </div>

        {/* Chevron Indicator: active until scroll reaches the end */}
        <button
          type="button"
          onClick={handleScrollRight}
          className={`spec-deepdive-scroll-indicator ${canScrollRight ? "active" : ""}`}
          aria-label="Scroll right to view more deep dives"
          title="Scroll to view more"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      {/* Active Deep Dive Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="spec-subcard position-relative"
        >
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2 pb-3 border-bottom border-white border-opacity-10">
            <h3 className="font-syne text-white fw-bold mb-0" style={{ fontSize: "1.05rem" }}>
              {selected.title}
            </h3>
            <span className="badge rounded-pill bg-cyan bg-opacity-10 text-cyan border border-cyan border-opacity-25 font-space-grotesk">
              ENGINE // {selected.tag}
            </span>
          </div>

          <p className="font-outfit text-white-50 small mb-3">
            {selected.summary}
          </p>

          <div className="d-flex flex-column gap-2">
            {selected.points.map((pt, i) => {
              const [head, ...rest] = pt.split(":");
              return (
                <div
                  key={i}
                  className="spec-subcard-item d-flex align-items-start gap-2.5"
                >
                  <span className="text-cyan font-space-grotesk mt-0.5" style={{ fontSize: "0.75rem" }}>
                    &gt;
                  </span>
                  <div className="font-outfit text-white-50 small lh-base" style={{ fontSize: "0.85rem" }}>
                    <strong className="text-white font-space-grotesk me-1">
                      {head}:
                    </strong>
                    <span>{rest.join(":")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
