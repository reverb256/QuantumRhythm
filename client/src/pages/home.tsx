import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ProjectsSection from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";
import GamingSection from "@/components/gaming-section";
import PhilosophySection from "@/components/philosophy-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { useBreathingAnimation } from "@/hooks/use-breathing-animation";

export default function Home() {
  const { getBreathingClass } = useBreathingAnimation();

  return (
    <div className={`min-h-screen bg-[var(--space-black)] text-white ${getBreathingClass('container')}`}>
      <main>
        <div className={getBreathingClass('hero')}>
          <HeroSection />
        </div>
        <AboutSection />
        <div className={getBreathingClass('projects')}>
          <ProjectsSection />
        </div>
        <SkillsSection />
        <PhilosophySection />
        <GamingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
