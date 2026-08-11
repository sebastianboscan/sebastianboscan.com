"use client";

import { useActionState, useState } from "react";
import { addExperience, addOrganization, addProject, type ActionResult } from "./actions";

type Tab = "experience" | "project" | "organization";

const TABS: readonly { key: Tab; label: string }[] = [
  { key: "experience", label: "Experience" },
  { key: "project", label: "Project" },
  { key: "organization", label: "Organization" },
];

const inputClass =
  "w-full bg-black border border-[#1e1e1e] px-3 py-2 text-sm text-[#f0f0f0] " +
  "focus:border-blue-500/60 focus:outline-none transition-colors placeholder:text-gray-600";

const labelClass = "block text-[11px] uppercase tracking-[0.2em] text-blue-500 font-mono mb-2";

function Field({
  label,
  name,
  required,
  placeholder,
}: {
  readonly label: string;
  readonly name: string;
  readonly required?: boolean;
  readonly placeholder?: string;
}) {
  return (
    <label className="block mb-4">
      <span className={labelClass}>
        {label}
        {required ? " *" : ""}
      </span>
      <input name={name} placeholder={placeholder} className={inputClass} />
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
}: {
  readonly label: string;
  readonly name: string;
  readonly placeholder?: string;
}) {
  return (
    <label className="block mb-4">
      <span className={labelClass}>{label} *</span>
      <textarea name={name} rows={4} placeholder={placeholder} className={inputClass} />
    </label>
  );
}

function Status({ state }: { readonly state: ActionResult | null }) {
  if (!state) return null;
  return (
    <p
      className={`text-sm mt-4 border px-3 py-2 ${
        state.ok
          ? "text-green-400 border-green-500/30 bg-green-500/5"
          : "text-red-400 border-red-500/30 bg-red-500/5"
      }`}
    >
      {state.ok ? state.message : state.error}
    </p>
  );
}

function SubmitButton({ pending }: { readonly pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 border border-blue-500/40 text-blue-400 px-5 py-2 text-xs uppercase tracking-[0.2em] font-mono hover:border-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-40 cursor-pointer"
    >
      {pending ? "Writing…" : "Append to content.ts"}
    </button>
  );
}

function ExperienceForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    addExperience,
    null,
  );
  return (
    <form action={action}>
      <Field label="Role" name="role" required placeholder="Applications Engineer - Robotics & VR" />
      <Field label="Company" name="company" required placeholder="Center for Industry Solutions (C4iS)" />
      <Field label="Date" name="date" required placeholder="July 2025 - Present" />
      <Field label="Location" name="location" required placeholder="Columbia, SC" />
      <TextArea label="Description" name="desc" placeholder="What you actually built there." />
      <SubmitButton pending={pending} />
      <Status state={state} />
    </form>
  );
}

function ProjectForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addProject, null);
  return (
    <form action={action}>
      <Field label="Name" name="name" required placeholder="ARPEGGIO" />
      <Field label="Tech (comma separated)" name="tech" required placeholder="Next.js, TypeScript, Stripe" />
      <Field label="Link" name="link" placeholder="https://github.com/… (optional)" />
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input type="checkbox" name="inProgress" className="accent-blue-500" />
        <span className="text-xs uppercase tracking-widest text-gray-400">In progress</span>
      </label>
      <TextArea label="Description" name="desc" placeholder="What the project does." />
      <SubmitButton pending={pending} />
      <Status state={state} />
    </form>
  );
}

function OrganizationForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    addOrganization,
    null,
  );
  return (
    <form action={action}>
      <Field label="Name" name="name" required placeholder="Kappa Theta Pi" />
      <Field label="Role" name="role" required placeholder="Project Manager" />
      <Field label="Link" name="link" placeholder="https://ktpusc.com (optional)" />
      <Field label="Status label" name="statusLabel" placeholder="Active (optional)" />
      <TextArea label="Description" name="desc" placeholder="What the organization does." />
      <SubmitButton pending={pending} />
      <Status state={state} />
    </form>
  );
}

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("experience");

  return (
    <div className="min-h-screen bg-black text-white" style={{ cursor: "crosshair" }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-blue-500 font-mono mb-4 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-blue-500">
            Local Authoring
          </p>
          <h1 className="font-[var(--font-syne),sans-serif] text-5xl text-[#f0f0f0] tracking-tight">
            Admin
          </h1>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            Appends entries to{" "}
            <code className="text-blue-400">components/home/content.ts</code>. Changes land in
            your working tree — review the diff and commit them like any other edit. This route
            only exists in <code className="text-blue-400">npm run dev</code>.
          </p>
        </header>

        <div className="flex gap-2 mb-8 border-b border-[#1e1e1e]">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-mono transition-colors cursor-pointer border-b-2 -mb-px ${
                tab === key
                  ? "text-blue-400 border-blue-500"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "experience" && <ExperienceForm />}
        {tab === "project" && <ProjectForm />}
        {tab === "organization" && <OrganizationForm />}
      </div>
    </div>
  );
}
