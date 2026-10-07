import Image from "next/image";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/portfolioData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectDetailView from "@/components/projects/ProjectDetailView";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | Kiran Chand S",
    };
  }

  return {
    title: `${project.title} | Systems Spec & Telemetry`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = PROJECTS[projectIndex];
  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : undefined;
  const nextProject =
    projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : undefined;

  return (
    <div className="projects-page-wrapper w-100 d-flex flex-column min-vh-100 position-relative pb-5 pt-5">
      <Navbar />

      {/* Cybernetic Projects Environment Background */}
      <div className="projects-bg-layer">
        <Image
          src="/projects-detail-bg.jpg"
          alt="Cybernetic Projects Environment Background"
          fill
          priority
          className="object-fit-cover"
          sizes="100vw"
          style={{ filter: "brightness(0.7) contrast(1.15)" }}
        />
        <div className="projects-bg-overlay" />
      </div>

      {/* Main Content Area */}
      <main
        className="project-details flex-grow-1 position-relative px-2 px-sm-3 px-md-4 py-3 py-sm-4 py-md-5 d-flex flex-column align-items-center"
        style={{
          zIndex: 2,
          paddingTop: "calc(max(0.75rem, env(safe-area-inset-top, 0.75rem)) + 70px)",
        }}
      >
        <div className="container-fluid project-detail pt-2" style={{ maxWidth: "1080px" }}>
          <ProjectDetailView
            project={project}
            prevProject={
              prevProject
                ? { slug: prevProject.slug, title: prevProject.title }
                : undefined
            }
            nextProject={
              nextProject
                ? { slug: nextProject.slug, title: nextProject.title }
                : undefined
            }
          />
        </div>
      </main>
    </div>
  );
}

