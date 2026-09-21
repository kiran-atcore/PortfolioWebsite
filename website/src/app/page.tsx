import Navbar from "../components/Navbar";
import HomeHero from "../components/home/HomeHero";

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <HomeHero />
      </main>
    </div>
  );
}
