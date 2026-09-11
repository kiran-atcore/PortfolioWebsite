export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            MyPortfolio
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#skills">
                  Skills
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#projects">
                  Projects
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-5 bg-white border-bottom">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-secondary mb-2">Welcome to my portfolio</span>
              <h1 className="display-4 fw-bold mb-3">Hi, I&apos;m a Full Stack Developer</h1>
              <p className="lead text-muted mb-4">
                I build responsive, reliable, and user-centric web applications using modern technologies like Next.js, React, and Bootstrap.
              </p>
              <div className="d-flex gap-3">
                <a href="#projects" className="btn btn-primary">
                  View Projects
                </a>
                <a href="#contact" className="btn btn-outline-secondary">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-5 bg-light border-bottom">
        <div className="container py-4">
          <div className="row">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3">About Me</h2>
              <p className="text-muted">
                I am a passionate software engineer with a focus on delivering high-quality web applications.
                With a strong foundation in both frontend and backend development, I enjoy transforming ideas into functional products.
              </p>
              <p className="text-muted">
                When I&apos;m not coding, I enjoy exploring new tech tools, contributing to open source, and learning about system architecture.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="card border p-3">
                <h5 className="card-title fw-bold mb-3">Quick Facts</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <strong>Experience:</strong> 3+ Years Building Web Apps
                  </li>
                  <li className="mb-2">
                    <strong>Focus:</strong> Frontend, Backend, API Design
                  </li>
                  <li className="mb-2">
                    <strong>Location:</strong> Remote / Open to Relocation
                  </li>
                  <li>
                    <strong>Availability:</strong> Available for freelance & full-time roles
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-5 bg-white border-bottom">
        <div className="container py-4">
          <h2 className="fw-bold mb-4 text-center">Skills &amp; Technologies</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    <i className="bi bi-window-sidebar me-2 text-primary"></i>
                    Frontend
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-light text-dark border">React</span>
                    <span className="badge bg-light text-dark border">Next.js</span>
                    <span className="badge bg-light text-dark border">TypeScript</span>
                    <span className="badge bg-light text-dark border">JavaScript</span>
                    <span className="badge bg-light text-dark border">Bootstrap</span>
                    <span className="badge bg-light text-dark border">HTML5 &amp; CSS3</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    <i className="bi bi-server me-2 text-success"></i>
                    Backend
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-light text-dark border">Node.js</span>
                    <span className="badge bg-light text-dark border">Express</span>
                    <span className="badge bg-light text-dark border">PostgreSQL</span>
                    <span className="badge bg-light text-dark border">MongoDB</span>
                    <span className="badge bg-light text-dark border">REST APIs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    <i className="bi bi-gear me-2 text-warning"></i>
                    Tools &amp; Others
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-light text-dark border">Git &amp; GitHub</span>
                    <span className="badge bg-light text-dark border">Docker</span>
                    <span className="badge bg-light text-dark border">Framer Motion</span>
                    <span className="badge bg-light text-dark border">Postman</span>
                    <span className="badge bg-light text-dark border">VS Code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-5 bg-light border-bottom">
        <div className="container py-4">
          <h2 className="fw-bold mb-4 text-center">Featured Projects</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">Project One</h5>
                  <p className="card-text text-muted flex-grow-1">
                    A modern web application featuring user authentication, dashboard analytics, and real-time updates.
                  </p>
                  <div className="mb-3">
                    <span className="badge bg-secondary me-1">Next.js</span>
                    <span className="badge bg-secondary me-1">Bootstrap</span>
                    <span className="badge bg-secondary">PostgreSQL</span>
                  </div>
                  <div className="d-flex gap-2">
                    <a href="#" className="btn btn-sm btn-outline-primary">
                      Live Demo
                    </a>
                    <a href="#" className="btn btn-sm btn-outline-secondary">
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">Project Two</h5>
                  <p className="card-text text-muted flex-grow-1">
                    An e-commerce storefront with shopping cart functionality, responsive design, and product catalog filters.
                  </p>
                  <div className="mb-3">
                    <span className="badge bg-secondary me-1">React</span>
                    <span className="badge bg-secondary me-1">TypeScript</span>
                    <span className="badge bg-secondary">Stripe</span>
                  </div>
                  <div className="d-flex gap-2">
                    <a href="#" className="btn btn-sm btn-outline-primary">
                      Live Demo
                    </a>
                    <a href="#" className="btn btn-sm btn-outline-secondary">
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">Project Three</h5>
                  <p className="card-text text-muted flex-grow-1">
                    Task management and collaboration tool designed for teams to track sprint progress and milestones.
                  </p>
                  <div className="mb-3">
                    <span className="badge bg-secondary me-1">Node.js</span>
                    <span className="badge bg-secondary me-1">Bootstrap</span>
                    <span className="badge bg-secondary">MongoDB</span>
                  </div>
                  <div className="d-flex gap-2">
                    <a href="#" className="btn btn-sm btn-outline-primary">
                      Live Demo
                    </a>
                    <a href="#" className="btn btn-sm btn-outline-secondary">
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-white border-bottom">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3 text-center">Contact Me</h2>
              <p className="text-muted text-center mb-4">
                Have a question, opportunity, or project idea? Feel free to reach out.
              </p>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows={4}
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-light mt-auto">
        <div className="container text-center text-muted">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} MyPortfolio. Built with Next.js, Bootstrap &amp; Framer Motion.
          </p>
        </div>
      </footer>
    </div>
  );
}
