import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ProjectsSection from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";
import GamingSection from "@/components/gaming-section";
import PhilosophySection from "@/components/philosophy-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { EnhancedConsole } from '../components/enhanced-console';
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white ambient-glow">
      <main>
        <div className="section-glow">
          <div id="hero">
            <HeroSection />
          </div>
        </div>
        <div id="about">
          <AboutSection />
        </div>
        <div className="section-glow">
          <div id="projects">
            <ProjectsSection />
          </div>
        </div>
        <div id="skills">
          <SkillsSection />
        </div>
        <div id="philosophy">
          <PhilosophySection />
        </div>
        <div id="gaming">
          <GamingSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
      </main>
      <EnhancedConsole />
      <Footer />
    </div>
  );
}