import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ExperienceDetailView from "@/components/experience/ExperienceDetailView";
import {
  EXPERIENCE_CASE_STUDIES,
  CaseStudySpec,
} from "@/data/experienceCaseStudies";

function resolveCaseStudy(slug: string): CaseStudySpec | undefined {
  if (EXPERIENCE_CASE_STUDIES[slug]) {
    return EXPERIENCE_CASE_STUDIES[slug];
  }
  if (
    slug === "automated-email-reporter" ||
    slug === "alpha-innovation" ||
    slug === "dispatchr"
  ) {
    return EXPERIENCE_CASE_STUDIES["dispatchr-automated-reporting"];
  }
  return undefined;
}

export function generateStaticParams() {
  return [
    { slug: "dispatchr-automated-reporting" },
    { slug: "automated-email-reporter" },
    { slug: "alpha-innovation" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = resolveCaseStudy(slug);

  if (!spec) {
    return {
      title: "Experience Case Study Not Found | Kiran Chand S",
    };
  }

  return {
    title: `${spec.title} | Production Engineering Case Study | Kiran Chand S`,
    description: spec.executiveSummary.narrative,
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = resolveCaseStudy(slug);

  if (!spec) {
    notFound();
  }

  return (
    <div className="projects-page-wrapper w-100 d-flex flex-column min-vh-100 position-relative pb-5 pt-5">
      <Navbar />

      {/* Cybernetic Grid Environment Background */}
      <div className="projects-bg-layer">
        <Image
          src="/projects-detail-bg.jpg"
          alt="Cybernetic Experience Background"
          fill
          priority
          className="object-fit-cover"
          sizes="100vw"
          style={{ filter: "brightness(0.7) contrast(1.15)" }}
        />
        <div className="projects-bg-overlay" />
      </div>

      {/* Main Content Viewport */}
      <main
        className="flex-grow-1 position-relative px-1 px-sm-3 px-md-4 py-3 py-sm-4 py-md-5 d-flex flex-column align-items-center"
        style={{
          zIndex: 2,
          paddingTop: "calc(max(0.75rem, env(safe-area-inset-top, 0.75rem)) + 70px)",
          paddingBottom: "calc(max(6rem, env(safe-area-inset-bottom, 2rem)) + 60px)",
        }}
      >
        <div className="container-fluid pt-2" style={{ maxWidth: "1080px" }}>
          <ExperienceDetailView spec={spec} />
        </div>
      </main>
    </div>
  );
}
