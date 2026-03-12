import { educationEntries } from "@/components/education/content";
import { EducationTimelineItem } from "@/components/education/EducationTimelineItem";
import { SectionLabel } from "@/components/home/SectionLabel";

export default function Education() {
  return (
    <section id="education" className="py-24 px-6 border-t border-[#1e1e1e] relative z-10 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <header className="mb-18 animate-fade-up">
          <SectionLabel />
          <h1 className="font-[var(--font-syne),sans-serif] leading-none tracking-tight text-7xl text-[#f0f0f0]">
            Edu<span className="text-blue-500">cation</span>
          </h1>
        </header>

        <div className="relative pl-0">
          <div
            className="absolute left-0 bottom-0 w-px"
            style={{
              top: "8px",
              background: "linear-gradient(to bottom, #3b82f6, #1e1e1e 80%, transparent)",
            }}
          />
          {educationEntries.map((entry) => (
            <EducationTimelineItem key={entry.institution} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
