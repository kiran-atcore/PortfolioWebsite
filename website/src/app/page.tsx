import Navbar from "../components/Navbar";
import HomeHero from "../components/home/HomeHero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <HomeHero />
      </main>
      <Footer />
    </div>
  );
}
