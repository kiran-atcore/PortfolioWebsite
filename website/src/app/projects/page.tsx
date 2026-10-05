"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PROJECTS } from "@/data/portfolioData";
import ProjectHeroHeader from "@/components/projects/ProjectHeroHeader";
import ProjectFilterTabs from "@/components/projects/ProjectFilterTabs";
import ProjectBentoCard from "@/components/projects/ProjectBentoCard";
import CyberTreeCanvas3D from "@/components/projects/CyberTreeCanvas3D";

const CATEGORIES = ["All", "Full Stack", "AI & ML", "Mobile"];

const tabVariants = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: "blur(6px)",
    transition: { duration: 0.22, ease: "easeInOut" as const },
  },
};

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const categoryParam = searchParams.get("category");

  const [activeTab, setActiveTab] = useState<"overview" | "showcase">(
    tabParam === "showcase" ? "showcase" : "overview"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : "All"
  );

  useEffect(() => {
    if (tabParam === "showcase") {
      setActiveTab("showcase");
    } else if (tabParam === "overview") {
      setActiveTab("overview");
    }
  }, [tabParam]);

  useEffect(() => {
    if (categoryParam && CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: PROJECTS.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = PROJECTS.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, []);

  const filteredProjects = useMemo(() => {
    return selectedCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const getBentoColumnClass = (index: number, total: number) => {
    if (selectedCategory !== "All") {
      return total === 1 ? "col-12 col-md-10 col-lg-8 mx-auto" : "col-12 col-lg-6";
    }
    if (index === 0) return "col-12 col-lg-7";
    if (index === 1) return "col-12 col-lg-5";
    if (index === 2) return "col-12 col-lg-5";
    return "col-12 col-lg-7";
  };

  const handleCategoryFromOverview = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTab("showcase");
  };

  return (
    <div className="projects-page-wrapper w-100 d-flex flex-column vh-100">
      <Navbar />

      {/* AI Generated Minimalistic Cyber Background matching experience page */}
      <div className="projects-bg-layer">
        <Image
          src="/projects-bg-minimal.jpg"
          alt="Cybernetic Projects Environment Background"
          fill
          priority
          className="object-fit-cover"
          sizes="100vw"
          style={{ filter: "brightness(0.85) contrast(1.1)" }}
        />
        <div className="projects-bg-overlay" />
      </div>

      {/* Main Content Area */}
      <main
        className="flex-grow-1 position-relative px-1 pt-4 px-sm-3 px-md-4 py-4 py-md-5 d-flex flex-column"
        style={{
          zIndex: 2,
          paddingTop: "calc(max(1rem, env(safe-area-inset-top, 1rem)) + 65px)",
        }}
      >
        <div className="container-fluid flex-grow-1 d-flex flex-column" style={{ maxWidth: "1240px" }}>
          {/* Animated Tab Viewport */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div
                key="tab-overview"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="my-auto py-2 pt-0 py-md-4 d-flex flex-column align-items-center justify-content-center"
              >
                <ProjectHeroHeader
                  totalCount={PROJECTS.length}
                  onExplore={() => setActiveTab("showcase")}
                  onSelectCategory={handleCategoryFromOverview}
                />
              </motion.div>
            ) : (
              <motion.div
                key="tab-showcase"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-100 my-auto"
              >
                {/* Back to Overview Header Ribbon */}
                <div className="d-flex align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom border-white border-opacity-10">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="btn btn-cyber-glass rounded-pill px-3 py-2 font-syncopate text-uppercase fw-light d-inline-flex align-items-center gap-2 back"
                    style={{ fontSize: "0.38rem", letterSpacing: "0.06em" }}
                  >
                    <i className="bi bi-arrow-left" />
                    <span>Back to Overview</span>
                  </button>

                  <div style={{ fontSize: "0.4rem" }} className="py-2 hud-telemetry-chip rounded-pill font-mono text-light text-opacity-75 showcase">
                    <span className="pulse-cyan" />
                    <span>SHOWCASE: {filteredProjects.length} ACTIVE</span>
                  </div>
                </div>

                {/* Filter Pills */}
                <ProjectFilterTabs
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  categoryCounts={categoryCounts}
                />

                <div
                  style={{
                    height: 340,
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                  }}
                  className="tree-box w-100 overflow-hidden"
                >
                  <CyberTreeCanvas3D projects={filteredProjects} />
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsPageContent />
    </Suspense>
  );
}


