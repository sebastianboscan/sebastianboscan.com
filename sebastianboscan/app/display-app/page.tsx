"use client";

import { useEffect, useMemo, useState } from "react";
import {
  aboutContent,
  contactLinks,
  experienceEntries,
  ktpExperience,
  projectEntries,
} from "@/components/home/content";

type View = "main" | "about" | "projects" | "experience" | "contact";

type MenuItem = { readonly key: Exclude<View, "main">; readonly label: string };

const MENU_ITEMS: readonly MenuItem[] = [
  { key: "about", label: "ABOUT" },
  { key: "projects", label: "PROJECTS" },
  { key: "experience", label: "EXPERIENCE" },
  { key: "contact", label: "CONTACT" },
] as const;

const FRAME_SIZE = 600;

export default function DisplayApp() {
  const [view, setView] = useState<View>("main");
  const [menuIndex, setMenuIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [experienceIndex, setExperienceIndex] = useState(0);

  const experienceItems = useMemo(
    () => [
      ...experienceEntries.map((entry) => ({
        title: entry.role,
        org: entry.company,
        date: entry.date,
        location: entry.location,
        desc: entry.desc,
      })),
      {
        title: ktpExperience.title,
        org: ktpExperience.company,
        date: ktpExperience.date,
        location: ktpExperience.location,
        desc: ktpExperience.roles[0]?.desc ?? "",
      },
    ],
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const navKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"];
      if (!navKeys.includes(e.key)) return;
      e.preventDefault();

      if (view === "main") {
        if (e.key === "ArrowUp") setMenuIndex((i) => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
        else if (e.key === "ArrowDown") setMenuIndex((i) => (i + 1) % MENU_ITEMS.length);
        else if (e.key === "Enter") setView(MENU_ITEMS[menuIndex].key);
        return;
      }

      if (e.key === "ArrowLeft") {
        setView("main");
        return;
      }

      if (view === "projects") {
        if (e.key === "ArrowUp") setProjectIndex((i) => (i - 1 + projectEntries.length) % projectEntries.length);
        else if (e.key === "ArrowDown" || e.key === "ArrowRight")
          setProjectIndex((i) => (i + 1) % projectEntries.length);
      } else if (view === "experience") {
        if (e.key === "ArrowUp") setExperienceIndex((i) => (i - 1 + experienceItems.length) % experienceItems.length);
        else if (e.key === "ArrowDown" || e.key === "ArrowRight")
          setExperienceIndex((i) => (i + 1) % experienceItems.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, menuIndex, experienceItems.length]);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center gap-4 p-4 font-mono text-white">
      <DisplayFrame>
        {view === "main" && <MainView selectedIndex={menuIndex} onSelect={(i) => setMenuIndex(i)} onEnter={(key) => setView(key)} />}
        {view === "about" && <AboutView />}
        {view === "projects" && (
          <ProjectsView index={projectIndex} total={projectEntries.length} project={projectEntries[projectIndex]} />
        )}
        {view === "experience" && (
          <ExperienceView
            index={experienceIndex}
            total={experienceItems.length}
            entry={experienceItems[experienceIndex]}
          />
        )}
        {view === "contact" && <ContactView />}
      </DisplayFrame>

      <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 max-w-[600px] text-center">
        Preview of the Meta Ray-Ban Display webapp. Use ↑ ↓ ← → and Enter to navigate.
      </p>
    </div>
  );
}

function DisplayFrame({ children }: { readonly children: React.ReactNode }) {
  return (
    <div
      className="relative bg-black border border-blue-500/30 shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-hidden"
      style={{ width: FRAME_SIZE, height: FRAME_SIZE, cursor: "crosshair" }}
    >
      <FrameCorners />
      <div className="absolute inset-0 flex flex-col">{children}</div>
    </div>
  );
}

function FrameCorners() {
  const cornerBase = "absolute w-10 h-10 border-blue-500/60 pointer-events-none";
  return (
    <>
      <div className={`${cornerBase} top-0 left-0 border-t-2 border-l-2`} />
      <div className={`${cornerBase} top-0 right-0 border-t-2 border-r-2`} />
      <div className={`${cornerBase} bottom-0 left-0 border-b-2 border-l-2`} />
      <div className={`${cornerBase} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

function PanelHeader({ label }: { readonly label: string }) {
  return (
    <div className="flex items-center gap-3 px-6 pt-6 pb-3">
      <div className="w-2 h-2 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
      <span className="text-[14px] tracking-[0.35em] text-blue-400 uppercase">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-blue-500/60 to-transparent" />
    </div>
  );
}

function PanelFooter({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="mt-auto px-6 py-4 border-t border-blue-500/20">
      <p className="text-[13px] tracking-[0.25em] uppercase text-gray-400">{children}</p>
    </div>
  );
}

function MainView({
  selectedIndex,
  onSelect,
  onEnter,
}: {
  readonly selectedIndex: number;
  readonly onSelect: (i: number) => void;
  readonly onEnter: (key: Exclude<View, "main">) => void;
}) {
  return (
    <>
      <PanelHeader label="HUD // ONLINE" />
      <div className="px-6 pt-2 pb-4">
        <h1 className="text-[28px] leading-tight tracking-wide text-white font-bold">SEBASTIAN BOSCAN</h1>
        <p className="text-[16px] text-gray-400 tracking-widest uppercase mt-1">CS // USC</p>
      </div>
      <ul className="flex-1 flex flex-col px-6 gap-2">
        {MENU_ITEMS.map((item, i) => {
          const active = i === selectedIndex;
          return (
            <li key={item.key}>
              <button
                type="button"
                onMouseEnter={() => onSelect(i)}
                onClick={() => onEnter(item.key)}
                className={`focusable w-full flex items-center gap-4 px-4 text-left border transition-colors ${
                  active
                    ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_18px_rgba(59,130,246,0.35)]"
                    : "border-blue-500/20 text-gray-400 hover:border-blue-500/50"
                }`}
                style={{ minHeight: 88 }}
              >
                <span
                  className={`text-[22px] w-6 inline-block ${active ? "text-blue-400" : "text-blue-500/40"}`}
                >
                  {active ? "▸" : ""}
                </span>
                <span className="text-[22px] tracking-[0.25em]">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <PanelFooter>[↑↓] NAV &nbsp; [⏎] SELECT</PanelFooter>
    </>
  );
}

function AboutView() {
  return (
    <>
      <PanelHeader label="ABOUT" />
      <div className="px-6 py-2 overflow-y-auto flex-1">
        <p className="text-[18px] leading-relaxed text-gray-100">{aboutContent.paragraphs[0]}</p>
        <div className="mt-5">
          <p className="text-[12px] tracking-[0.3em] text-blue-400 uppercase mb-2">Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {aboutContent.primarySkills.map((skill) => (
              <span
                key={skill}
                className="text-[14px] border border-blue-500/40 text-blue-200 px-3 py-1 tracking-wider"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <PanelFooter>[←] BACK</PanelFooter>
    </>
  );
}

function ProjectsView({
  index,
  total,
  project,
}: {
  readonly index: number;
  readonly total: number;
  readonly project: (typeof projectEntries)[number];
}) {
  return (
    <>
      <PanelHeader label={`PROJECT ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`} />
      <div className="px-6 py-3 flex-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h2 className="text-[24px] font-bold tracking-wide text-white">{project.name}</h2>
          {project.inProgress && (
            <span className="text-[11px] tracking-[0.25em] uppercase text-yellow-400 border border-yellow-500/40 px-2 py-0.5">
              In Progress
            </span>
          )}
        </div>
        <p className="text-[17px] leading-relaxed text-gray-200 flex-1 overflow-y-auto">{project.desc}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="text-[12px] border border-blue-500/30 text-blue-300 px-2 py-0.5 tracking-wider">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 ${i === index ? "w-6 bg-blue-400" : "w-2 bg-blue-500/30"} transition-all`}
            />
          ))}
        </div>
      </div>
      <PanelFooter>[↑↓] CYCLE &nbsp; [←] BACK</PanelFooter>
    </>
  );
}

function ExperienceView({
  index,
  total,
  entry,
}: {
  readonly index: number;
  readonly total: number;
  readonly entry: { title: string; org: string; date: string; location: string; desc: string };
}) {
  return (
    <>
      <PanelHeader label={`EXPERIENCE ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`} />
      <div className="px-6 py-3 flex-1 flex flex-col">
        <h2 className="text-[22px] font-bold text-white leading-tight">{entry.title}</h2>
        <p className="text-[16px] text-blue-400 mt-1">{entry.org}</p>
        <p className="text-[12px] tracking-[0.25em] text-gray-500 uppercase mt-0.5">
          {entry.date} · {entry.location}
        </p>
        <p className="text-[17px] leading-relaxed text-gray-200 mt-3 flex-1 overflow-y-auto">{entry.desc}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 ${i === index ? "w-6 bg-blue-400" : "w-2 bg-blue-500/30"} transition-all`}
            />
          ))}
        </div>
      </div>
      <PanelFooter>[↑↓] CYCLE &nbsp; [←] BACK</PanelFooter>
    </>
  );
}

function ContactView() {
  return (
    <>
      <PanelHeader label="CONTACT" />
      <div className="px-6 py-4 flex-1 flex flex-col gap-3">
        {contactLinks.map((link) => {
          const value = link.label === "Email" ? link.href.replace("mailto:", "") : link.href.replace("https://", "");
          return (
            <div
              key={link.label}
              className="border border-blue-500/30 px-4 py-4 bg-blue-500/5"
              style={{ minHeight: 88 }}
            >
              <p className="text-[12px] tracking-[0.3em] text-blue-400 uppercase">{link.label}</p>
              <p className="text-[20px] text-white mt-1 break-all">{value}</p>
            </div>
          );
        })}
      </div>
      <PanelFooter>[←] BACK</PanelFooter>
    </>
  );
}
