import { projectEntries, type ProjectEntry } from "@/components/home/content";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SectionLabel } from "@/components/home/SectionLabel";
import { TacticalCard } from "@/components/home/TacticalCard";

function ProjectCard({ project }: { readonly project: ProjectEntry }) {
  return (
    <TacticalCard
      className={`border border-[#1e1e1e] bg-[#111] p-6 transition-all flex flex-col gap-4 ${
        project.inProgress ? "opacity-50 grayscale cursor-not-allowed" : "hover:border-blue-500/30"
      }`}
      accent="none"
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <h3 className="text-[#f0f0f0] font-bold">{project.name}</h3>
        {project.inProgress && (
          <span className="text-[10px] font-mono text-yellow-500/70 border border-yellow-500/30 px-2 py-0.5 whitespace-nowrap">
            In Progress
          </span>
        )}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-blue-500 border border-blue-500/30 px-2 py-0.5 hover:border-blue-400 hover:text-blue-300 transition-all whitespace-nowrap"
          >
            {project.link.replace("https://", "")}
          </a>
        )}
      </div>
      <p className="text-gray-500 text-sm flex-1">{project.desc}</p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((technology) => (
          <span key={technology} className="text-[10px] font-mono px-2 py-0.5 border border-[#1e1e1e] text-[#666] bg-[#0a0a0a]">
            {technology}
          </span>
        ))}
      </div>
    </TacticalCard>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6 border-t border-[#1e1e1e] relative z-10 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel />
        <SectionHeading prefix="Pro" accent="jects" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projectEntries.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
