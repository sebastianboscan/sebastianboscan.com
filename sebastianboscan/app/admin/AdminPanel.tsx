"use client";

import { useActionState, useState } from "react";
import type {
  ExperienceEntry,
  OrganizationEntry,
  ProjectEntry,
} from "@/components/home/content";
import { removeEntry, reorderEntry, saveEntry, type ActionResult } from "./actions";

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

const buttonClass =
  "border border-blue-500/40 text-blue-400 px-5 py-2 text-xs uppercase tracking-[0.2em] " +
  "font-mono hover:border-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-40 cursor-pointer";

const iconButtonClass =
  "border border-[#1e1e1e] text-gray-400 px-2 py-1 text-[11px] font-mono " +
  "hover:border-blue-500/50 hover:text-blue-300 transition-all disabled:opacity-30 cursor-pointer";

function Field({
  label,
  name,
  required,
  placeholder,
  defaultValue,
}: {
  readonly label: string;
  readonly name: string;
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly defaultValue?: string;
}) {
  return (
    <label className="block mb-4">
      <span className={labelClass}>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  defaultValue,
}: {
  readonly label: string;
  readonly name: string;
  readonly placeholder?: string;
  readonly defaultValue?: string;
}) {
  return (
    <label className="block mb-4">
      <span className={labelClass}>{label} *</span>
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputClass}
      />
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

type EditTarget = { readonly index: number } | null;

/** One row in the list, with reorder and delete controls. */
function EntryRow({
  kind,
  index,
  total,
  title,
  subtitle,
  onEdit,
}: {
  readonly kind: Tab;
  readonly index: number;
  readonly total: number;
  readonly title: string;
  readonly subtitle: string;
  readonly onEdit: () => void;
}) {
  const [removeState, removeAction, removing] = useActionState<ActionResult | null, FormData>(
    removeEntry,
    null,
  );
  const [moveState, moveAction, moving] = useActionState<ActionResult | null, FormData>(
    reorderEntry,
    null,
  );
  const [confirming, setConfirming] = useState(false);
  const state = removeState ?? moveState;

  return (
    <li className="border border-[#1e1e1e] px-4 py-3 mb-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-[#f0f0f0] truncate">{title}</p>
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <form action={moveAction}>
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="index" value={index} />
            <input type="hidden" name="direction" value={-1} />
            <button
              type="submit"
              disabled={index === 0 || moving}
              className={iconButtonClass}
              aria-label="Move up"
            >
              ↑
            </button>
          </form>

          <form action={moveAction}>
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="index" value={index} />
            <input type="hidden" name="direction" value={1} />
            <button
              type="submit"
              disabled={index === total - 1 || moving}
              className={iconButtonClass}
              aria-label="Move down"
            >
              ↓
            </button>
          </form>

          <button type="button" onClick={onEdit} className={iconButtonClass}>
            Edit
          </button>

          {confirming ? (
            <form action={removeAction} className="flex items-center gap-1">
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="index" value={index} />
              <button
                type="submit"
                disabled={removing}
                className="border border-red-500/40 text-red-400 px-2 py-1 text-[11px] font-mono hover:bg-red-500/10 transition-all cursor-pointer"
              >
                {removing ? "…" : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className={iconButtonClass}
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="border border-[#1e1e1e] text-gray-400 px-2 py-1 text-[11px] font-mono hover:border-red-500/50 hover:text-red-400 transition-all cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <Status state={state} />
    </li>
  );
}

function FormFields({
  kind,
  experience,
  project,
  organization,
}: {
  readonly kind: Tab;
  readonly experience?: ExperienceEntry;
  readonly project?: ProjectEntry;
  readonly organization?: OrganizationEntry;
}) {
  if (kind === "experience") {
    return (
      <>
        <Field
          label="Role"
          name="role"
          required
          placeholder="Applications Engineer - Robotics & VR"
          defaultValue={experience?.role}
        />
        <Field
          label="Company"
          name="company"
          required
          placeholder="Center for Industry Solutions (C4iS)"
          defaultValue={experience?.company}
        />
        <Field
          label="Date"
          name="date"
          required
          placeholder="July 2025 - Present"
          defaultValue={experience?.date}
        />
        <Field
          label="Location"
          name="location"
          required
          placeholder="Columbia, SC"
          defaultValue={experience?.location}
        />
        <TextArea
          label="Description"
          name="desc"
          placeholder="What you actually built there."
          defaultValue={experience?.desc}
        />
      </>
    );
  }

  if (kind === "project") {
    return (
      <>
        <Field label="Name" name="name" required placeholder="ARPEGGIO" defaultValue={project?.name} />
        <Field
          label="Tech (comma separated)"
          name="tech"
          required
          placeholder="Next.js, TypeScript, Stripe"
          defaultValue={project?.tech.join(", ")}
        />
        <Field
          label="Link"
          name="link"
          placeholder="https://github.com/… (optional)"
          defaultValue={project?.link ?? ""}
        />
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            name="inProgress"
            defaultChecked={project?.inProgress}
            className="accent-blue-500"
          />
          <span className="text-xs uppercase tracking-widest text-gray-400">In progress</span>
        </label>
        <TextArea
          label="Description"
          name="desc"
          placeholder="What the project does."
          defaultValue={project?.desc}
        />
      </>
    );
  }

  return (
    <>
      <Field
        label="Name"
        name="name"
        required
        placeholder="Kappa Theta Pi"
        defaultValue={organization?.name}
      />
      <Field
        label="Role"
        name="role"
        required
        placeholder="Project Manager"
        defaultValue={organization?.role}
      />
      <Field
        label="Link"
        name="link"
        placeholder="https://ktpusc.com (optional)"
        defaultValue={organization?.link ?? ""}
      />
      <Field
        label="Status label"
        name="statusLabel"
        placeholder="Active (optional)"
        defaultValue={organization?.statusLabel ?? ""}
      />
      <TextArea
        label="Description"
        name="desc"
        placeholder="What the organization does."
        defaultValue={organization?.desc}
      />
    </>
  );
}

export function AdminPanel({
  experience,
  projects,
  organizations,
}: {
  readonly experience: ExperienceEntry[];
  readonly projects: ProjectEntry[];
  readonly organizations: OrganizationEntry[];
}) {
  const [tab, setTab] = useState<Tab>("experience");
  const [editing, setEditing] = useState<EditTarget>(null);
  const [saveState, saveAction, saving] = useActionState<ActionResult | null, FormData>(
    saveEntry,
    null,
  );

  const rows =
    tab === "experience"
      ? experience.map((e) => ({ title: e.role, subtitle: `${e.company} · ${e.date}` }))
      : tab === "project"
        ? projects.map((p) => ({ title: p.name, subtitle: p.tech.join(", ") }))
        : organizations.map((o) => ({ title: o.name, subtitle: o.role }));

  const editIndex = editing?.index;
  const editingExperience =
    tab === "experience" && editIndex !== undefined ? experience[editIndex] : undefined;
  const editingProject =
    tab === "project" && editIndex !== undefined ? projects[editIndex] : undefined;
  const editingOrganization =
    tab === "organization" && editIndex !== undefined ? organizations[editIndex] : undefined;

  const switchTab = (next: Tab) => {
    setTab(next);
    setEditing(null);
  };

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
            Edits{" "}
            <code className="text-blue-400">components/home/content.ts</code> directly. Changes
            land in your working tree — review the diff and commit them like any other edit. This
            route only exists in <code className="text-blue-400">npm run dev</code>.
          </p>
        </header>

        <div className="flex gap-2 mb-8 border-b border-[#1e1e1e]">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => switchTab(key)}
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

        <section className="mb-10">
          <h2 className={labelClass}>Current ({rows.length})</h2>
          {rows.length === 0 ? (
            <p className="text-sm text-gray-500">Nothing here yet.</p>
          ) : (
            <ul>
              {rows.map((row, i) => (
                <EntryRow
                  key={`${tab}-${i}-${row.title}`}
                  kind={tab}
                  index={i}
                  total={rows.length}
                  title={row.title}
                  subtitle={row.subtitle}
                  onEdit={() => setEditing({ index: i })}
                />
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className={labelClass}>
            {editIndex !== undefined ? `Editing #${editIndex + 1}` : "Add new"}
          </h2>

          {/* Remounts on tab/target change so defaultValue picks up the new entry. */}
          <form action={saveAction} key={`${tab}-${editIndex ?? "new"}`}>
            <input type="hidden" name="kind" value={tab} />
            <input type="hidden" name="index" value={editIndex ?? ""} />

            <FormFields
              kind={tab}
              experience={editingExperience}
              project={editingProject}
              organization={editingOrganization}
            />

            <div className="flex items-center gap-2">
              <button type="submit" disabled={saving} className={buttonClass}>
                {saving ? "Writing…" : editIndex !== undefined ? "Save changes" : "Add entry"}
              </button>
              {editIndex !== undefined && (
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className={iconButtonClass}
                >
                  Cancel
                </button>
              )}
            </div>

            <Status state={saveState} />
          </form>
        </section>
      </div>
    </div>
  );
}
