"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_CATEGORIES, CERTIFICATIONS } from "@/data/portfolioData";
import SkillsHeroHeader from "./SkillsHeroHeader";
import SkillsTabNav from "./SkillsTabNav";
import Skills3DDepthView from "./Skills3DDepthView";

export default function SkillsContainer() {
  const [activeTab, setActiveTab] = useState<"skills" | "certifications">("skills");
  const cardsSectionRef = useRef<HTMLDivElement>(null);

  const handleSelectTab = (tab: "skills" | "certifications") => {
    setActiveTab(tab);

    // We delay the scroll slightly (250ms) for two critical reasons:
    // 1. On mobile devices, triggering a smooth scroll while the user's finger 
    //    is still lifting off the screen (touch events) can instantly cancel the scroll.
    // 2. Next.js route transitions can trigger a scroll-to-top which conflicts
    //    with this scroll if executed too quickly.
    setTimeout(() => {
      if (cardsSectionRef.current) {
        const targetY = cardsSectionRef.current.offsetTop;

        // Prevent scrolling if already at or very near the target to avoid jumpy restarts
        if (Math.abs(window.scrollY - targetY) < 15) return;

        window.scrollTo({
          top: targetY,
          behavior: "smooth"
        });
      }
    }, 250);
  };

  return (
    <div className="w-100 flex-grow-1 d-flex flex-column" style={{ zIndex: 2 }}>
      {/* Top Header & Tab Switcher Section (100dvh) */}
      <section
        className="w-100 d-flex flex-column justify-content-center align-items-center position-relative px-3 px-md-4"
        style={{
          height: "100dvh",
          minHeight: "100dvh",
          paddingTop: "calc(max(1rem, env(safe-area-inset-top, 1rem)) + 65px)",
          paddingBottom: "1.5rem",
        }}
      >
        <div className="w-100 mx-auto" style={{ maxWidth: "1280px" }}>
          <SkillsHeroHeader />
          <SkillsTabNav
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            skillsCount={SKILL_CATEGORIES.length}
            certificationsCount={CERTIFICATIONS.length}
          />
        </div>
      </section>

      {/* Dynamic Tab Viewport Section (100dvh with overflow hidden) */}
      <section
        ref={cardsSectionRef}
        id="skills-cards-viewport"
        className="w-100 position-relative d-flex flex-column justify-content-center justify-content-md-start px-3 px-md-4"
        style={{
          height: "100dvh",
          minHeight: "100dvh",
          maxHeight: "100dvh",
          overflow: "hidden",
          paddingTop: "calc(max(1rem, env(safe-area-inset-top, 1rem)) + 65px)",
          paddingBottom: "calc(max(0.5rem, env(safe-area-inset-bottom, 0.5rem)))",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-syne fw-bold text-uppercase text-white cyber-title-glow text-center mb-1 flex-shrink-0 skills-section-viewport-title"
          style={{ letterSpacing: "0.06em" }}
        >
          {activeTab === "skills" ? "Skills & Competencies" : "Verified Certifications"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-outfit text-center text-light text-opacity-50 mb-3 mb-md-4 skills-section-viewport-subtitle"
          style={{ letterSpacing: "0.02em" }}
        >
          {activeTab === "skills"
            ? "Languages, frameworks, databases, cloud architecture, and AI tooling"
            : "Official credentials in Cloud Architecture, Generative AI, and Engineering"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="w-100 mx-auto overflow-hidden skill-canvas position-relative"
          style={{
            maxWidth: "900px",
            maskImage: "radial-gradient(ellipse 96% 94% at 50% 50%, black 70%, rgba(0, 0, 0, 0.5) 88%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 96% 94% at 50% 50%, black 70%, rgba(0, 0, 0, 0.5) 88%, transparent 100%)",
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "skills" ? (
              <Skills3DDepthView key="skills" items={SKILL_CATEGORIES} type="skills" />
            ) : (
              <Skills3DDepthView key="certifications" items={CERTIFICATIONS} type="certifications" />
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
