import Image from "next/image";
import { aboutContent } from "@/components/home/content";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SectionLabel } from "@/components/home/SectionLabel";

const skillChipClassName =
  "text-[11px] font-mono px-3 py-1 border border-[#1e1e1e] text-[#666] bg-[#0a0a0a] hover:border-blue-500/50 hover:text-blue-400 transition-all cursor-default";

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 border-t border-[#1e1e1e] relative z-10 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel />
        <SectionHeading prefix="About" accent=" Me" />

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="relative w-48 md:w-56 flex-shrink-0 border border-blue-500/30 overflow-hidden">
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
                <summary className="list-none inline-flex items-center gap-2 text-[10px] text-blue-300 font-mono uppercase tracking-widest border border-blue-500/50 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-200 transition-all cursor-pointer select-none shadow-[0_0_12px_rgba(59,130,246,0.25)]">
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
