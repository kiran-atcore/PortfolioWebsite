"use client";

import React from "react";
import { motion } from "framer-motion";
import { CaseStudySpec } from "@/data/experienceCaseStudies";
import CaseStudyHeader from "./case-study/CaseStudyHeader";
import CaseStudyKpiGrid from "./case-study/CaseStudyKpiGrid";
import CaseStudyOverview from "./case-study/CaseStudyOverview";
import CaseStudyDeepDives from "./case-study/CaseStudyDeepDives";
import CaseStudyBenchmarks from "./case-study/CaseStudyBenchmarks";
import CaseStudyArchitecture from "./case-study/CaseStudyArchitecture";
import "./experience-detail.css";

interface ExperienceDetailViewProps {
  spec: CaseStudySpec;
}

export default function ExperienceDetailView({ spec }: ExperienceDetailViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="position-relative w-100"
    >
      <div className="spec-deck-card position-relative">
        {/* Futuristic Corner Rims */}
        <div className="spec-rim-top-left" />
        <div className="spec-rim-top-right" />
        <div className="spec-rim-bottom-left" />
        <div className="spec-rim-bottom-right" />

        {/* 1. Header with Title, Company & Links */}
        <CaseStudyHeader spec={spec} />

        {/* 2. Top-level Performance & Impact KPIs */}
        <CaseStudyKpiGrid kpis={spec.kpis} />

        {/* 3. Executive Briefing, Problem Space & Pillars */}
        <CaseStudyOverview spec={spec} />

        {/* 4. Deep Technical Architecture Deep Dives */}
        <CaseStudyDeepDives deepDives={spec.deepDives} />

        {/* 5. Benchmarks & Production Use Cases */}
        <CaseStudyBenchmarks
          benchmarks={spec.benchmarks}
          scenarios={spec.scenarios}
        />

        {/* 6. DevOps Infrastructure, Schema & Takeaways */}
        <CaseStudyArchitecture
          topology={spec.topology}
          schemaModels={spec.schemaModels}
          lessons={spec.lessons}
          roadmap={spec.roadmap}
        />
      </div>
    </motion.div>
  );
}
