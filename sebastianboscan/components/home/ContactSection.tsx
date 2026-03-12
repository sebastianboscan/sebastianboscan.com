import { contactLinks } from "@/components/home/content";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SectionLabel } from "@/components/home/SectionLabel";
import { TacticalCard } from "@/components/home/TacticalCard";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 border-t border-[#1e1e1e] relative z-10 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel />
        <SectionHeading prefix="Con" accent="tact" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <TacticalCard className="p-6 hover:border-blue-500/50 hover:bg-blue-500/5" accent="none">
                <p className="text-[10px] text-[#666] font-mono uppercase tracking-widest mb-2">{link.label}</p>
                <p className="text-[#f0f0f0]">
                  {link.label === "LinkedIn" ? "linkedin.com/in/sebastianboscan" : "sebastian@sc.edu"}
                </p>
              </TacticalCard>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
