import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactContainer from "@/components/contact/ContactContainer";

export const metadata = {
  title: "Contact | Kiran Chand S",
  description: "Get in touch with Kiran Chand S for software engineering opportunities, applied AI projects, and collaborations.",
};

export default function ContactPage() {
  return (
    <div className="d-flex flex-column min-vh-100 position-relative w-100 overflow-x-hidden">
      <Navbar />

      {/* Cybernetic Projects & Contact Background Layer */}
      <div className="projects-bg-layer">
        <Image
          src="/contact-bg-minimal.jpg"
          alt="Cybernetic Contact Environment Background"
          fill
          priority
          className="object-fit-cover"
          sizes="100vw"
          style={{ filter: "brightness(0.7) contrast(1.2)" }}
        />
        <div className="projects-bg-overlay" style={{ opacity: 0.5 }} />
      </div>

      {/* Main Content Area */}
      <main
        className="flex-grow-1 position-relative d-flex flex-column justify-content-center"
        style={{ zIndex: 2 }}
      >
        <ContactContainer />
      </main>
    </div>
  );
}

