import Navbar from "../../components/Navbar";
import AboutSlider from "../../components/about/AboutSlider";

export const metadata = {
  title: "About Me | Kiran Chand S",
  description: "Learn more about Kiran Chand S - background, systems architecture, and technical philosophy.",
};

export default function AboutPage() {
  return (
    <div className="vh-100 w-100 position-relative overflow-hidden d-flex flex-column">
      <Navbar />
      <main
        className="w-100 flex-grow-1 position-relative d-flex flex-column align-items-start justify-content-start overflow-hidden"
        style={{
          paddingTop: "calc(max(0.75rem, env(safe-area-inset-top, 0.75rem)) + 54px)",
        }}
      >
        <AboutSlider />
      </main>
    </div>
  );
}

