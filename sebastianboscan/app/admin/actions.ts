"use server";

import { revalidatePath } from "next/cache";
import {
  appendEntry,
  assertDevOnly,
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

async function run(kind: EntryKind, data: unknown, label: string): Promise<ActionResult> {
  try {
    assertDevOnly();
    await appendEntry(kind, data);
    // The homepage and /display-app both read content.ts.
    revalidatePath("/");
    revalidatePath("/display-app");
    return { ok: true, message: `Added ${label} to content.ts. Review the diff, then commit.` };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

export async function addExperience(_prev: ActionResult | null, form: FormData) {
  const entry: ExperienceInput = {
    role: text(form, "role"),
    company: text(form, "company"),
    date: text(form, "date"),
    location: text(form, "location"),
    desc: text(form, "desc"),
  };

  const gaps = missing(entry);
  if (gaps.length) return { ok: false as const, error: `Missing: ${gaps.join(", ")}` };

  return run("experience", entry, entry.role);
}

export async function addProject(_prev: ActionResult | null, form: FormData) {
  const name = text(form, "name");
  const desc = text(form, "desc");
  const tech = list(form, "tech");

  const gaps = missing({ name, desc });
  if (gaps.length) return { ok: false as const, error: `Missing: ${gaps.join(", ")}` };
  if (tech.length === 0) return { ok: false as const, error: "Add at least one tech tag." };

  const entry: ProjectInput = {
    name,
    tech,
    link: text(form, "link") || null,
    inProgress: form.get("inProgress") === "on",
    desc,
  };

  return run("project", entry, name);
}

export async function addOrganization(_prev: ActionResult | null, form: FormData) {
  const name = text(form, "name");
  const role = text(form, "role");
  const desc = text(form, "desc");

  const gaps = missing({ name, role, desc });
  if (gaps.length) return { ok: false as const, error: `Missing: ${gaps.join(", ")}` };

  const entry: OrganizationInput = { name, role, desc };
  const link = text(form, "link");
  const statusLabel = text(form, "statusLabel");
  if (link) entry.link = link;
  if (statusLabel) entry.statusLabel = statusLabel;

  return run("organization", entry, name);
}
