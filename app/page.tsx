import { LandingNavbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { LandingAnimations } from "@/components/landing/LandingAnimations";

export default function LandingPage() {
  return (
    <div className="landing-theme min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
      <LandingAnimations />
    </div>
  );
}
