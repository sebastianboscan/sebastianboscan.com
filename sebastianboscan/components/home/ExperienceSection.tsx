import {
  experienceEntries,
  ktpExperience,
  type ExperienceEntry,
  type TimelineExperience,
} from "@/components/home/content";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SectionLabel } from "@/components/home/SectionLabel";
import { TacticalCard } from "@/components/home/TacticalCard";

function ExperienceCard({ entry }: { readonly entry: ExperienceEntry }) {
  return (
    <TacticalCard className="p-6">
      <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
        <h3 className="text-[#f0f0f0] font-bold">{entry.role}</h3>
        <span className="text-[11px] text-[#666] font-mono uppercase tracking-widest">{entry.date}</span>
      </div>
      <p className="text-blue-400 text-sm mb-1">{entry.company}</p>
      <p className="text-[#666] font-mono text-[11px] mb-3">{entry.location}</p>
      <p className="text-gray-500 text-sm">{entry.desc}</p>
    </TacticalCard>
  );
}

function TimelineExperienceCard({ entry }: { readonly entry: TimelineExperience }) {
  return (
    <TacticalCard className="p-6">
      <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
        <h3 className="text-[#f0f0f0] font-bold">{entry.title}</h3>
        <span className="text-[11px] text-[#666] font-mono uppercase tracking-widest">{entry.date}</span>
      </div>
      <p className="text-blue-400 text-sm mb-1">{entry.company}</p>
      <p className="text-[#666] font-mono text-[11px] mb-5">{entry.location}</p>

      <div className="relative">
        <div
          className="absolute left-0 w-px"
          style={{ top: "8px", bottom: "8px", background: "linear-gradient(to bottom, #3b82f6, #1e1e1e)" }}
        />

        {entry.roles.map((roleEntry, index) => (
          <div
            key={`${roleEntry.role}-${roleEntry.date}`}
            className={index === entry.roles.length - 1 ? "relative pl-6" : "relative pl-6 pb-6"}
          >
            <div
              className={`absolute left-[-5px] top-[6px] w-[9px] h-[9px] rounded-full ${
                roleEntry.current
                  ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  : "bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
              }`}
            />
            <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
              <p className={roleEntry.current ? "text-blue-400 text-sm font-medium" : "text-blue-400/60 text-sm font-medium"}>
                {roleEntry.role}
              </p>
              <span className="text-[11px] text-[#666] font-mono uppercase tracking-widest">{roleEntry.date}</span>
            </div>
            <p className="text-gray-500 text-sm">{roleEntry.desc}</p>
          </div>
        ))}
      </div>
    </TacticalCard>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-6 border-t border-[#1e1e1e] relative z-10 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel />
        <SectionHeading prefix="Experi" accent="ence" />

        <div className="space-y-4">
          {experienceEntries.map((entry) => (
            <ExperienceCard key={entry.role} entry={entry} />
          ))}
          <TimelineExperienceCard entry={ktpExperience} />
        </div>
      </div>
    </section>
  );
}
