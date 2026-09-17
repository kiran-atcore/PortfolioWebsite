import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { EXPERIENCES, EDUCATION } from "../../data/portfolioData";

export const metadata = {
  title: "Experience | Kiran Chand S",
  description: "Work experience and career timeline of Kiran Chand S - Full Stack Software Engineer.",
};

export default function ExperiencePage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            {/* Header */}
            <div className="text-center mb-5 pb-3">
              <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-2 rounded-pill small mb-3 font-mono">
                Career History
              </span>
              <h1 className="fw-bold text-white display-5 mb-3">Work Experience</h1>
              <p className="text-light text-opacity-75 fs-5">Engineering real-world systems in fast-paced production environments</p>
            </div>

            {/* Industry Experience */}
            <div className="mb-5 pb-4">
              <h3 className="fw-bold mb-4 text-white">Production Roles</h3>
              {EXPERIENCES.map((exp, idx) => (
                <div key={idx} className="glass-panel glass-panel-spacious mb-5">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom border-white border-opacity-10 pb-4 mb-4">
                    <div>
                      <h2 className="fw-bold text-white mb-2">{exp.role}</h2>
                      <div className="text-warning font-mono fs-5">
                        <i className="bi bi-building me-2"></i>{exp.company}
                        <span className="text-white-50 ms-3 fs-6">&bull; {exp.location}</span>
                      </div>
                    </div>
                    <span className="badge bg-white bg-opacity-10 text-light border border-white border-opacity-10 px-4 py-2 rounded-pill font-mono small">
                      <i className="bi bi-calendar3 me-2"></i>{exp.period}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="badge bg-warning text-dark me-2 px-3 py-2 font-mono small fw-semibold">Key Production System</span>
                    <span className="fw-semibold text-light text-opacity-90 fs-6">{exp.project}</span>
                  </div>

                  <h5 className="fw-bold text-white mb-3 fs-6">Architectural Contributions &amp; Business Impact:</h5>
                  <ul className="text-light text-opacity-75 mb-5 ps-3 d-flex flex-column gap-3">
                    {exp.description.map((desc, dIdx) => (
                      <li key={dIdx} className="lh-lg fs-6">{desc}</li>
                    ))}
                  </ul>

                  <div className="d-flex flex-wrap gap-3 pt-4 border-top border-white border-opacity-10">
                    {exp.liveUrl && (
                      <a href={exp.liveUrl} target="_blank" rel="noreferrer" className="btn btn-amber-glow rounded-pill px-4 py-2 font-mono small">
                        <i className="bi bi-box-arrow-up-right me-2"></i> Launch DispatchR Live
                      </a>
                    )}
                    {exp.githubUrl && (
                      <a href={exp.githubUrl} target="_blank" rel="noreferrer" className="btn btn-glass rounded-pill px-4 py-2 font-mono small">
                        <i className="bi bi-github me-2"></i> View Repository
                      </a>
                    )}
                    <Link href="/projects/dispatchr-automated-reporting" className="btn btn-outline-warning rounded-pill px-4 py-2 font-mono small">
                      In-Depth Case Study &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Background */}
            <div>
              <h3 className="fw-bold mb-4 text-white">Academic Milestone</h3>
              {EDUCATION.map((edu, idx) => (
                <div key={idx} className="glass-panel glass-panel-spacious">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                    <h4 className="fw-bold text-white mb-0">{edu.degree}</h4>
                    <span className="badge bg-white bg-opacity-10 text-light border border-white border-opacity-10 px-3 py-2 rounded-pill font-mono small">{edu.period}</span>
                  </div>
                  <div className="text-warning small font-mono fs-6 mb-3">{edu.institution}, {edu.location}</div>
                  <p className="text-light text-opacity-75 lh-lg mb-0">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
