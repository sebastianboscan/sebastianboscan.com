import Image from "next/image";
import { aboutContent } from "@/components/home/content";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SectionLabel } from "@/components/home/SectionLabel";

const skillChipClassName =
  "text-[11px] font-mono px-3 py-1 border border-[#1e1e1e] text-[#666] bg-[#0a0a0a] hover:border-white/50 hover:text-white transition-all cursor-default";

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 border-t border-[#1e1e1e] relative z-10 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel />
        <SectionHeading title="About Me" />

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="relative w-48 md:w-56 flex-shrink-0 border border-white/30 overflow-hidden">
            <Image
              src="/images/headshot.jpg"
              alt="Sebastian Boscan"
              width={224}
              height={224}
              className="w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="text-gray-300 leading-relaxed mb-4">{aboutContent.paragraphs[0]}</p>
            <p className="text-gray-500 leading-relaxed text-sm mb-6">{aboutContent.paragraphs[1]}</p>
            <div className="flex flex-wrap items-start gap-2">
              {aboutContent.primarySkills.map((skill) => (
                <span key={skill} className={skillChipClassName}>
                  {skill}
                </span>
              ))}

              <details className="group basis-full">
                <summary className="list-none inline-flex items-center gap-2 text-[10px] text-gray-200 font-mono uppercase tracking-widest border border-white/50 px-3 py-1 bg-white/10 hover:bg-white/20 hover:border-white hover:text-white transition-all cursor-pointer select-none shadow-[0_0_12px_rgba(255,255,255,0.25)]">
                  <span className="group-open:hidden">More Skills</span>
                  <span className="hidden group-open:inline">Less Skills</span>
                  <span className="transition-transform duration-300 group-open:rotate-180">▾</span>
                </summary>

                <div className="mt-3 flex flex-wrap gap-2 border border-[#1e1e1e] bg-[#0a0a0a] p-3">
                  {aboutContent.additionalSkills.map((skill) => (
                    <span key={skill} className={skillChipClassName}>
                      {skill}
                    </span>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
