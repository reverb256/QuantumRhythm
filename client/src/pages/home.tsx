import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ProjectsSection from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";
import GamingSection from "@/components/gaming-section";
import PhilosophySection from "@/components/philosophy-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white">
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <PhilosophySection />
        <GamingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
