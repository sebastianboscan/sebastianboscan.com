import { TacticalCard } from "@/components/home/TacticalCard";
import type { EducationEntry } from "@/components/education/content";

type EducationTimelineItemProps = {
  readonly entry: EducationEntry;
};

export function EducationTimelineItem({ entry }: EducationTimelineItemProps) {
  const isPrimary = entry.accent === "primary";

  return (
    <div className="relative pl-10 pb-14 last:pb-0 group">
      <div
        className={`absolute left-[-5px] top-2 w-[9px] h-[9px] rounded-full ${
          isPrimary
            ? "bg-blue-700 shadow-[0_0_12px_#1d4ed8]"
            : "bg-blue-500 shadow-[0_0_12px_#3b82f6]"
        }`}
      />

      <TacticalCard
        className={`relative rounded-sm p-7 duration-200 overflow-hidden hover:translate-x-1 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:transition-transform before:duration-300 before:origin-left before:scale-x-0 hover:before:scale-x-100 ${
          isPrimary ? "before:bg-blue-700" : "before:bg-blue-500"
        }`}
      >
        <div className="flex justify-between items-start gap-4 flex-wrap mb-1">
          <h3 className="text-xl font-bold text-[#f0f0f0] tracking-tight">{entry.institution}</h3>
          <span className="text-[11px] text-[#666] uppercase tracking-widest pt-1 whitespace-nowrap font-mono">
            {entry.date}
          </span>
        </div>

        <p className="text-[13px] font-medium mb-1 text-blue-400">{entry.degree}</p>
        <p className="text-[12px] text-[#666] font-mono mb-5">{entry.sub}</p>

        {entry.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {entry.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-[10px] py-1 border border-[#1e1e1e] rounded-sm text-[#666] bg-[#0a0a0a] hover:border-blue-500 hover:text-blue-400 hover:bg-[rgba(59,130,246,0.08)] transition-all duration-200 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {entry.courses && entry.courses.length > 0 && (
          <div className="pt-5 border-t border-[#1e1e1e]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-mono mb-2">
              Relevant Coursework
            </p>
            <p className="text-[12px] text-[#666] font-mono leading-relaxed">{entry.courses.join(" · ")}</p>
          </div>
        )}
      </TacticalCard>
    </div>
  );
}
