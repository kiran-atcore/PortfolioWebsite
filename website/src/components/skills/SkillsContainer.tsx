"use client";

import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
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
        const targetY = cardsSectionRef.current.getBoundingClientRect().top + window.scrollY;
        
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
      {/* Top Header & Tab Switcher Section (100vh) */}
      <section
        className="w-100 d-flex flex-column justify-content-center align-items-center position-relative px-3 px-md-4"
        style={{
          height: "100vh",
          minHeight: "100vh",
          paddingTop: "calc(max(1rem, env(safe-area-inset-top, 1rem)) + 65px)",
          paddingBottom: "2rem",
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

      {/* Dynamic Tab Viewport Section (100vh with overflow hidden) */}
      <section
        ref={cardsSectionRef}
        id="skills-cards-viewport"
        className="w-100 position-relative d-flex flex-column justify-content-start px-3 px-md-4"
        style={{
          height: "100vh",
          minHeight: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
          paddingTop: "calc(max(1rem, env(safe-area-inset-top, 1rem)) + 65px)",
          paddingBottom: "2rem",
        }}
      >
        <h2
          className="font-syne fw-bold text-uppercase text-white cyber-title-glow text-center mb-1 flex-shrink-0 skills-section-viewport-title"
          style={{ letterSpacing: "0.06em" }}
        >
          {activeTab === "skills" ? "Skills & Competencies" : "Verified Certifications"}
        </h2>

        <p
          className="font-outfit text-center text-light text-opacity-50 mb-3 mb-md-4 skills-section-viewport-subtitle"
          style={{ letterSpacing: "0.02em" }}
        >
          {activeTab === "skills"
            ? "Languages, frameworks, databases, cloud architecture, and AI tooling"
            : "Official credentials in Cloud Architecture, Generative AI, and Engineering"}
        </p>

        <div
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
        </div>
      </section>
    </div>
  );
}
