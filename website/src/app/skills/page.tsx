import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillsContainer from "@/components/skills/SkillsContainer";

export const metadata = {
  title: "Skills & Certifications | Kiran Chand S",
  description:
    "Technical competencies, programming languages, frameworks, cloud architecture, and verified accreditations.",
};

export default function SkillsPage() {
  return (
    <div className="d-flex flex-column min-vh-100 position-relative w-100 overflow-x-hidden">
      <Navbar />

      {/* Cybernetic Environment Background */}
      <div className="projects-bg-layer">
        <Image
          src="/skills-bg-minimal.jpg"
          alt="Cybernetic Skills Environment Background"
          fill
          priority
          className="object-fit-cover"
          sizes="100vw"
          style={{ filter: "brightness(0.85) contrast(1.1)" }}
        />
        <div className="projects-bg-overlay" style={{ opacity: 0.4 }} />
      </div>

      {/* Main Content Area */}
      <main
        className="flex-grow-1 position-relative d-flex flex-column p-0"
        style={{
          zIndex: 2,
        }}
      >
        <SkillsContainer />
      </main>
    </div>
  );
}
