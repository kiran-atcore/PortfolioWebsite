import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { PERSONAL_INFO, EDUCATION } from "../../data/portfolioData";

export const metadata = {
  title: "About Me | Kiran Chand S",
  description: "Learn more about Kiran Chand S - background, education, and technical philosophy.",
};

export default function AboutPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            {/* Header */}
            <div className="text-center mb-5 pb-3">
              <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-2 rounded-pill small mb-3 font-mono">
                Background &amp; Profile
              </span>
              <h1 className="fw-bold text-white display-5 mb-3">About Me</h1>
              <p className="text-light text-opacity-75 fs-5">Software Engineer &bull; Full Stack Developer &bull; Applied AI</p>
            </div>

            {/* Main Content Grid */}
            <div className="row g-5 mb-5">
              <div className="col-lg-7">
                <div className="glass-panel glass-panel-spacious h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="fw-bold mb-4 text-white">Engineering Philosophy</h3>
                    <p className="text-light text-opacity-75 mb-4 lh-lg fs-6">{PERSONAL_INFO.bio}</p>
                    <p className="text-light text-opacity-75 mb-5 lh-lg fs-6">
                      I believe in writing maintainable, well-architected code that delivers measurable business outcomes.
                      Whether it&apos;s automating reporting workflows, slashing API latencies with modern inference frameworks like Groq,
                      or securing multi-strike user moderation systems via WebSockets, I focus on building reliable systems.
                    </p>
                  </div>
                  <div className="d-flex flex-wrap gap-3 pt-4 border-top border-white border-opacity-10">
                    <a href={PERSONAL_INFO.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-amber-glow rounded-pill px-4 py-2 font-mono small">
                      <i className="bi bi-download me-2"></i> Download Full Resume
                    </a>
                    <Link href="/contact" className="btn btn-glass rounded-pill px-4 py-2 font-mono small">
                      Get In Touch
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="glass-panel glass-panel-spacious h-100">
                  <h3 className="fw-bold mb-4 text-white">Quick Facts</h3>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-4">
                    <li className="d-flex align-items-start gap-3">
                      <i className="bi bi-geo-alt-fill text-danger fs-4 mt-1"></i>
                      <div>
                        <strong className="text-white fs-6">Location:</strong>
                        <div className="text-light text-opacity-75 mt-1">{PERSONAL_INFO.location} (Open to Remote / Relocation)</div>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-3">
                      <i className="bi bi-layers-fill text-warning fs-4 mt-1"></i>
                      <div>
                        <strong className="text-white fs-6">Core Stack:</strong>
                        <div className="text-light text-opacity-75 mt-1">Next.js, Python, Django REST, React Native, AWS</div>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-3">
                      <i className="bi bi-cpu-fill text-success fs-4 mt-1"></i>
                      <div>
                        <strong className="text-white fs-6">Specialization:</strong>
                        <div className="text-light text-opacity-75 mt-1">Full Stack Systems, WebSockets &amp; Applied AI</div>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-3">
                      <i className="bi bi-briefcase-fill text-info fs-4 mt-1"></i>
                      <div>
                        <strong className="text-white fs-6">Availability:</strong>
                        <div className="text-light text-opacity-75 mt-1">Open to Full-Time Software Engineering Roles</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="glass-panel glass-panel-spacious">
              <h3 className="fw-bold mb-4 text-white">Education &amp; Credentials</h3>
              {EDUCATION.map((edu, idx) => (
                <div key={idx} className="border-start border-3 border-warning ps-4 py-2">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2">
                    <h4 className="fw-bold text-white mb-0">{edu.degree}</h4>
                    <span className="badge bg-white bg-opacity-10 text-light border border-white border-opacity-10 px-3 py-2 rounded-pill font-mono small">
                      {edu.period}
                    </span>
                  </div>
                  <div className="text-warning font-mono fs-6 mb-3">
                    {edu.institution}, {edu.location}
                  </div>
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
