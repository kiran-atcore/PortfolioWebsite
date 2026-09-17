"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { PROJECTS } from "../../data/portfolioData";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", "Full Stack", "AI & ML", "Mobile"];

  const filteredProjects = selectedCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-5 flex-grow-1">
        <div className="text-center mb-5 pb-3">
          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-2 rounded-pill small mb-3 font-mono">
            Portfolio Showcase
          </span>
          <h1 className="fw-bold text-white display-5 mb-3">Featured Projects</h1>
          <p className="text-light text-opacity-75 fs-5">Production web applications, applied AI models, and real-time platforms</p>

          <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn rounded-pill px-4 py-2 font-mono small ${
                  selectedCategory === cat
                    ? "btn-amber-glow shadow-sm"
                    : "btn-glass text-light text-opacity-75"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="row g-5">
          {filteredProjects.map((project) => (
            <div key={project.id} className="col-lg-6">
              <div className="glass-panel glass-panel-spacious d-flex flex-column h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge bg-white bg-opacity-10 text-light border border-white border-opacity-10 px-3 py-2 rounded-pill font-mono small">
                    {project.category}
                  </span>
                  <div className="d-flex gap-3">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-light text-opacity-50 fs-5" title="View Source">
                        <i className="bi bi-github"></i>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-warning fs-5" title="Live Preview">
                        <i className="bi bi-box-arrow-up-right"></i>
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="fw-bold text-white mb-2">{project.title}</h3>
                <div className="text-warning font-mono small mb-4">{project.tagline}</div>
                <p className="text-light text-opacity-75 lh-lg mb-4 flex-grow-1">{project.summary}</p>

                <div className="mb-4">
                  <div className="d-flex flex-wrap gap-2">
                    {project.metrics.map((m, i) => (
                      <span key={i} className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 rounded-pill px-3 py-2 small font-mono">
                        <i className="bi bi-graph-up me-2"></i>{m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4 pt-3 border-top border-white border-opacity-10">
                  <div className="d-flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="badge bg-black bg-opacity-30 text-light text-opacity-75 border border-white border-opacity-10 px-3 py-2 small font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center">
                  <Link href={`/projects/${project.slug}`} className="btn btn-amber-glow rounded-pill px-4 py-2 font-mono small">
                    Deep Dive Case Study <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-glass rounded-pill px-4 py-2 font-mono small">
                      Live App
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
