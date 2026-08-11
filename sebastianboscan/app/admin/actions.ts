"use server";

import { revalidatePath } from "next/cache";
import {
  appendEntry,
  assertDevOnly,
  deleteEntry,
  moveEntry,
  updateEntry,
  type EntryInput,
  type EntryKind,
  type ExperienceInput,
  type OrganizationInput,
  type ProjectInput,
} from "./contentFile";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

/** Splits the comma-separated tech field into a clean list. */
function list(form: FormData, key: string) {
  return text(form, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function missing(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

/** Both surfaces read content.ts, so refresh each after any write. */
function refresh() {
  revalidatePath("/");
  revalidatePath("/display-app");
  revalidatePath("/admin");
}

async function run(work: () => Promise<void>, message: string): Promise<ActionResult> {
  try {
    assertDevOnly();
    await work();
    refresh();
    return { ok: true, message };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

/** Builds a validated entry from form data, or returns the validation error. */
function parseEntry(
  kind: EntryKind,
  form: FormData,
): { ok: true; entry: EntryInput; label: string } | { ok: false; error: string } {
  if (kind === "experience") {
    const entry: ExperienceInput = {
      role: text(form, "role"),
      company: text(form, "company"),
      date: text(form, "date"),
      location: text(form, "location"),
      desc: text(form, "desc"),
    };
    const gaps = missing(entry);
    if (gaps.length) return { ok: false, error: `Missing: ${gaps.join(", ")}` };
    return { ok: true, entry, label: entry.role };
  }

  if (kind === "project") {
    const name = text(form, "name");
    const desc = text(form, "desc");
    const tech = list(form, "tech");

    const gaps = missing({ name, desc });
    if (gaps.length) return { ok: false, error: `Missing: ${gaps.join(", ")}` };
    if (tech.length === 0) return { ok: false, error: "Add at least one tech tag." };

    const entry: ProjectInput = {
      name,
      tech,
      link: text(form, "link") || null,
      inProgress: form.get("inProgress") === "on",
      desc,
    };
    return { ok: true, entry, label: name };
  }

  const name = text(form, "name");
  const role = text(form, "role");
  const desc = text(form, "desc");

  const gaps = missing({ name, role, desc });
  if (gaps.length) return { ok: false, error: `Missing: ${gaps.join(", ")}` };

  const entry: OrganizationInput = { name, role, desc };
  const link = text(form, "link");
  const statusLabel = text(form, "statusLabel");
  if (link) entry.link = link;
  if (statusLabel) entry.statusLabel = statusLabel;

  return { ok: true, entry, label: name };
}

function kindOf(form: FormData): EntryKind {
  const kind = text(form, "kind");
  if (kind === "experience" || kind === "project" || kind === "organization") return kind;
  throw new Error(`Unknown entry kind: ${kind}`);
}

export async function saveEntry(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  let kind: EntryKind;
  try {
    kind = kindOf(form);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Bad request." };
  }

  const parsed = parseEntry(kind, form);
  if (!parsed.ok) return parsed;

  // An empty index means this is a new entry rather than an edit.
  const rawIndex = text(form, "index");
  const isEdit = rawIndex !== "";
  const index = Number(rawIndex);

  if (isEdit && !Number.isInteger(index)) {
    return { ok: false, error: "Invalid entry position." };
  }

  return run(
    () => (isEdit ? updateEntry(kind, index, parsed.entry) : appendEntry(kind, parsed.entry)),
    isEdit ? `Updated ${parsed.label}.` : `Added ${parsed.label}.`,
  );
}

export async function removeEntry(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  let kind: EntryKind;
  try {
    kind = kindOf(form);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Bad request." };
  }

  const index = Number(text(form, "index"));
  if (!Number.isInteger(index)) return { ok: false, error: "Invalid entry position." };

  return run(() => deleteEntry(kind, index), "Deleted entry.");
}

export async function reorderEntry(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  let kind: EntryKind;
  try {
    kind = kindOf(form);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Bad request." };
  }

  const index = Number(text(form, "index"));
  const direction = Number(text(form, "direction"));
  if (!Number.isInteger(index)) return { ok: false, error: "Invalid entry position." };
  if (direction !== -1 && direction !== 1) return { ok: false, error: "Invalid direction." };

  return run(() => moveEntry(kind, index, direction), "Reordered.");
}
