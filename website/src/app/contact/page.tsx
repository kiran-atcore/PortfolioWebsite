import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { PERSONAL_INFO } from "../../data/portfolioData";

export const metadata = {
  title: "Contact | Kiran Chand S",
  description: "Get in touch with Kiran Chand S for software engineering opportunities and projects.",
};

export default function ContactPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-5 flex-grow-1">
        {/* Header */}
        <div className="text-center mb-5 pb-3">
          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-2 rounded-pill small mb-3 font-mono">
            Let&apos;s Connect
          </span>
          <h1 className="fw-bold text-white display-5 mb-3">Contact &amp; Inquiries</h1>
          <p className="text-light text-opacity-75 fs-5">Available for full-time software engineering roles, collaborations, and discussions</p>
        </div>

        {/* Content Row */}
        <div className="row g-5 justify-content-center">
          <div className="col-lg-5">
            <div className="glass-panel glass-panel-spacious h-100 d-flex flex-column justify-content-between">
              <div>
                <h3 className="fw-bold text-white mb-4">Direct Channels</h3>

                <div className="d-flex align-items-center gap-4 mb-4">
                  <div className="bg-warning bg-opacity-15 text-warning p-3 rounded-circle fs-4">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <div className="small text-light text-opacity-50 font-mono mb-1">Email Address</div>
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="text-white fw-semibold text-decoration-none fs-6">
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-4 mb-4">
                  <div className="bg-success bg-opacity-15 text-success p-3 rounded-circle fs-4">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <div className="small text-light text-opacity-50 font-mono mb-1">Phone Number</div>
                    <a href={`tel:${PERSONAL_INFO.phone}`} className="text-white fw-semibold text-decoration-none fs-6">
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-4 mb-4">
                  <div className="bg-danger bg-opacity-15 text-danger p-3 rounded-circle fs-4">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <div className="small text-light text-opacity-50 font-mono mb-1">Location</div>
                    <span className="text-white fw-semibold fs-6">{PERSONAL_INFO.location}, India</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-top border-white border-opacity-10 d-flex gap-3 font-mono">
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="btn btn-glass rounded-pill px-4 py-2 small">
                  <i className="bi bi-linkedin me-2 text-info"></i> LinkedIn
                </a>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="btn btn-glass rounded-pill px-4 py-2 small">
                  <i className="bi bi-github me-2"></i> GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="glass-panel glass-panel-spacious">
              <h3 className="fw-bold text-white mb-4">Send a Direct Message</h3>
              <form>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small font-mono text-light text-opacity-75 mb-2">Your Name</label>
                    <input type="text" className="form-control bg-black bg-opacity-30 border border-white border-opacity-10 text-white rounded-3 py-3 px-3" placeholder="Recruiter / Collaborator" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small font-mono text-light text-opacity-75 mb-2">Your Email</label>
                    <input type="email" className="form-control bg-black bg-opacity-30 border border-white border-opacity-10 text-white rounded-3 py-3 px-3" placeholder="name@company.com" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label small font-mono text-light text-opacity-75 mb-2">Subject</label>
                  <input type="text" className="form-control bg-black bg-opacity-30 border border-white border-opacity-10 text-white rounded-3 py-3 px-3" placeholder="Full-Time Software Role / Discussion" />
                </div>
                <div className="mb-4">
                  <label className="form-label small font-mono text-light text-opacity-75 mb-2">Message</label>
                  <textarea className="form-control bg-black bg-opacity-30 border border-white border-opacity-10 text-white rounded-3 py-3 px-3" rows={5} placeholder="Tell me about the role, project, or timeline..." required></textarea>
                </div>
                <button type="submit" className="btn btn-amber-glow rounded-pill py-3 px-5 w-100 font-mono">
                  <i className="bi bi-send-fill me-2"></i> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
