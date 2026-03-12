import Education from "@/components/Education";
import Header from "@/components/Header";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { HeroSection } from "@/components/home/HeroSection";
import { OrganizationsSection } from "@/components/home/OrganizationsSection";
import { PageBackground } from "@/components/home/PageBackground";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SiteFooter } from "@/components/home/SiteFooter";

export default function App() {
  return (
    <div className="bg-black text-white font-sans animate-fade-in" style={{ cursor: "crosshair" }}>
      <PageBackground />
      <Header />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <Education />
      <OrganizationsSection />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
