import Image from "next/image";
import Navbar from "@/components/Navbar";
import ExperienceContainer from "@/components/experience/ExperienceContainer";

export const metadata = {
  title: "Experience | Kiran Chand S",
  description: "Work experience and career timeline of Kiran Chand S - Full Stack Software Engineer.",
};

export default function ExperiencePage() {
  return (
    <div
      className="w-100 position-relative overflow-hidden d-flex flex-column"
      style={{
        height: "100dvh",
        minHeight: "100dvh",
        maxHeight: "100dvh",
      }}
    >
      <Navbar />

      {/* Cybernetic Environment Background */}
      <div className="projects-bg-layer">
        <Image
          src="/experience-topo-minimal.jpg"
          alt="Cybernetic Experience Environment Background"
          fill
          priority
          className="object-fit-cover"
          sizes="100vw"
          style={{ filter: "brightness(0.5) contrast(1.15)" }}
        />
        <div className="projects-bg-overlay" style={{ opacity: 0.45 }} />
      </div>

      <main
        className="w-100 flex-grow-1 position-relative overflow-hidden d-flex flex-column"
        style={{ zIndex: 2 }}
      >
        <ExperienceContainer />
      </main>
    </div>
  );
}
