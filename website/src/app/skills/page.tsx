import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { SKILL_CATEGORIES, CERTIFICATIONS } from "../../data/portfolioData";

export const metadata = {
  title: "Skills & Certifications | Kiran Chand S",
  description: "Technical competencies, programming languages, frameworks, and verified certifications.",
};

export default function SkillsPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-5 flex-grow-1">
        {/* Technical Stack Header */}
        <div className="text-center mb-5 pb-3">
          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-2 rounded-pill small mb-3 font-mono">
            Technical Stack
          </span>
          <h1 className="fw-bold text-white display-5 mb-3">Skills &amp; Competencies</h1>
          <p className="text-light text-opacity-75 fs-5">Languages, frameworks, databases, cloud architecture, and AI tooling</p>
        </div>

        {/* Skills Categories Grid */}
        <div className="row g-4 g-lg-5 justify-content-center mb-5 pb-5">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="glass-panel glass-panel-spacious h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="rounded-circle bg-warning bg-opacity-15 text-warning p-3 d-flex align-items-center justify-content-center" style={{ width: "52px", height: "52px" }}>
                    <i className={`bi ${cat.icon} fs-4`}></i>
                  </div>
                  <h4 className="fw-bold text-white mb-0">{cat.title}</h4>
                </div>
                <div className="d-flex flex-wrap gap-2 pt-3 border-top border-white border-opacity-10 flex-grow-1 align-content-start">
                  {cat.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="badge bg-black bg-opacity-40 text-light text-opacity-90 border border-white border-opacity-10 px-3 py-2 fw-normal font-mono small">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Industry Accreditations Header */}
        <div className="text-center mb-5 pt-4 pb-2">
          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-2 rounded-pill small mb-3 font-mono">
            Industry Accreditations
          </span>
          <h2 className="fw-bold text-white display-6 mb-3">Verified Certifications</h2>
          <p className="text-light text-opacity-75 fs-5">Credentials in Cloud, Generative AI, and Software Engineering</p>
        </div>

        {/* Certifications Grid */}
        <div className="row g-4 justify-content-center">
          {CERTIFICATIONS.map((cert, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="glass-panel p-4 d-flex flex-row align-items-center gap-4 h-100">
                <div className={`rounded-circle bg-${cert.badgeColor} bg-opacity-15 text-${cert.badgeColor} p-3 d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: "54px", height: "54px" }}>
                  <i className="bi bi-patch-check-fill fs-3"></i>
                </div>
                <div>
                  <h5 className="fw-bold text-white mb-1 lh-sm fs-6">{cert.title}</h5>
                  <small className="text-light text-opacity-50 font-mono">{cert.issuer}</small>
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
