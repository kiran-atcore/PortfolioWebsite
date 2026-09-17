import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "../../../data/portfolioData";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <Link href="/projects" className="btn btn-glass btn-sm rounded-pill mb-4 font-mono">
              &larr; Back to All Projects
            </Link>

            <div className="glass-panel p-4 p-md-5 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-1 rounded-pill small font-mono">
                  {project.category}
                </span>
                <div className="d-flex gap-2">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-glass btn-sm rounded-pill font-mono">
                      <i className="bi bi-github me-1"></i> Repository
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-amber-glow btn-sm rounded-pill font-mono">
                      <i className="bi bi-box-arrow-up-right me-1"></i> Live Demo
                    </a>
                  )}
                </div>
              </div>

              <h1 className="fw-bold text-white display-6 mb-2">{project.title}</h1>
              <p className="lead text-warning fw-medium mb-4 font-mono">{project.tagline}</p>
              <p className="text-light text-opacity-80 fs-5 mb-4 lh-base">{project.summary}</p>

              <div className="row g-2 mb-4">
                {project.metrics.map((metric, i) => (
                  <div key={i} className="col-sm-6">
                    <div className="p-3 bg-success bg-opacity-15 border border-success border-opacity-25 rounded-3 text-success fw-semibold font-mono small">
                      <i className="bi bi-check-circle-fill me-2"></i> {metric}
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="fw-bold text-white mb-3">Architecture &amp; Key Highlights</h4>
              <ul className="text-light text-opacity-75 mb-4 ps-3">
                {project.highlights.map((item, i) => (
                  <li key={i} className="mb-2">{item}</li>
                ))}
              </ul>

              <h4 className="fw-bold text-white mb-2">Technical Challenges &amp; Solutions</h4>
              <div className="p-3 bg-black bg-opacity-30 border border-white border-opacity-10 rounded-3 text-light text-opacity-75 mb-4">
                {project.challenges}
              </div>

              <h5 className="fw-bold text-white mb-3">Technologies Leveraged</h5>
              <div className="d-flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="badge bg-black bg-opacity-40 text-light text-opacity-80 border border-white border-opacity-10 px-3 py-2 fs-6 font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
