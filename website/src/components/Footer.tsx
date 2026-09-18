import { PERSONAL_INFO } from "../data/portfolioData";

export default function Footer() {
  return (
    <footer id="site-footer" className="py-4 border-top border-white border-opacity-10 mt-auto bg-transparent">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="text-light text-opacity-75 small">
          <span className="text-white fw-bold">{PERSONAL_INFO.name}</span>
          <span className="ms-2">&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="d-flex gap-3 small font-mono">
          <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-light text-opacity-75 text-decoration-none">
            GitHub
          </a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-light text-opacity-75 text-decoration-none">
            LinkedIn
          </a>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="text-light text-opacity-75 text-decoration-none">
            Email
          </a>
          <a href="#" className="text-warning text-decoration-none">
            Back to Top &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
