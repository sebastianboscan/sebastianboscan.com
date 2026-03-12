import { organizationEntries, type OrganizationEntry } from "@/components/home/content";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SectionLabel } from "@/components/home/SectionLabel";
import { TacticalCard } from "@/components/home/TacticalCard";

function OrganizationCard({ organization }: { readonly organization: OrganizationEntry }) {
  return (
    <TacticalCard
      className="p-6"
      accent={organization.statusLabel ? "yellow" : "blue"}
    >
      <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
        <h3 className="text-[#f0f0f0] font-bold">{organization.name}</h3>
        <span className="text-[11px] text-blue-500 font-mono uppercase tracking-widest border border-blue-500/30 px-2 py-0.5 whitespace-nowrap">
          {organization.role}
        </span>
      </div>
      {organization.statusLabel && (
        <div className="mb-4">
          <span className="text-[11px] text-yellow-400 font-mono uppercase tracking-widest border border-yellow-500/40 px-2 py-0.5 whitespace-nowrap inline-flex">
            {organization.statusLabel}
          </span>
        </div>
      )}
      <p className="text-gray-500 text-sm">{organization.desc}</p>
      {organization.link && (
        <a
          href={organization.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex mt-4 text-[10px] font-mono text-blue-500 border border-blue-500/30 px-2 py-0.5 hover:border-blue-400 hover:text-blue-300 transition-all whitespace-nowrap"
        >
          {organization.link.replace("https://", "")}
        </a>
      )}
    </TacticalCard>
  );
}

export function OrganizationsSection() {
  return (
    <section id="organizations" className="py-24 px-6 border-t border-[#1e1e1e] relative z-10 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel />
        <SectionHeading prefix="Organi" accent="zations" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizationEntries.map((organization) => (
            <OrganizationCard key={organization.name} organization={organization} />
          ))}
        </div>
      </div>
    </section>
  );
}
