import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Server-side helpers for appending entries to components/home/content.ts.
 *
 * This is a local authoring tool: it edits a source file on disk, so it only
 * works under `npm run dev`. On a deployed build the filesystem is read-only
 * and the site is already compiled, so every entry point here refuses to run
 * outside development.
 */

export const CONTENT_PATH = path.join(process.cwd(), "components", "home", "content.ts");

export type EntryKind = "experience" | "project" | "organization";

/** The const array each kind appends to, in content.ts. */
const ARRAY_NAME: Record<EntryKind, string> = {
  experience: "experienceEntries",
  project: "projectEntries",
  organization: "organizationEntries",
};

export function assertDevOnly() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("The admin panel is only available in development.");
  }
}

/**
 * Escapes a value for embedding in a double-quoted TS string literal.
 * Order matters: backslashes first, or we'd re-escape our own escapes.
 */
function quote(value: string) {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, "\\n");
  return `"${escaped}"`;
}

function quoteList(values: readonly string[]) {
  if (values.length === 0) return "[]";
  return `[${values.map(quote).join(", ")}]`;
}

export type ExperienceInput = {
  role: string;
  company: string;
  date: string;
  location: string;
  desc: string;
};

export type ProjectInput = {
  name: string;
  tech: string[];
  link: string | null;
  inProgress: boolean;
  desc: string;
};

export type OrganizationInput = {
  name: string;
  role: string;
  desc: string;
  link?: string;
  statusLabel?: string;
};

/** Renders one object literal, indented to match the existing entries. */
function renderEntry(kind: EntryKind, data: unknown): string {
  if (kind === "experience") {
    const e = data as ExperienceInput;
    return [
      "  {",
      `    role: ${quote(e.role)},`,
      `    company: ${quote(e.company)},`,
      `    date: ${quote(e.date)},`,
      `    location: ${quote(e.location)},`,
      `    desc: ${quote(e.desc)},`,
      "  },",
    ].join("\n");
  }

  if (kind === "project") {
    const p = data as ProjectInput;
    return [
      "  {",
      `    name: ${quote(p.name)},`,
      `    tech: ${quoteList(p.tech)},`,
      `    link: ${p.link ? quote(p.link) : "null"},`,
      `    inProgress: ${p.inProgress},`,
      `    desc: ${quote(p.desc)},`,
      "  },",
    ].join("\n");
  }

  const o = data as OrganizationInput;
  const lines = [
    "  {",
    `    name: ${quote(o.name)},`,
    `    role: ${quote(o.role)},`,
    `    desc: ${quote(o.desc)},`,
  ];
  // Both are optional in OrganizationEntry — only emit when actually provided.
  if (o.link) lines.push(`    link: ${quote(o.link)},`);
  if (o.statusLabel) lines.push(`    statusLabel: ${quote(o.statusLabel)},`);
  lines.push("  },");
  return lines.join("\n");
}

/**
 * Appends an entry to the end of its const array.
 *
 * Finds the array's opening line, then walks forward to the matching
 * `] as const;` that closes it. Scanning for the terminator rather than
 * regex-matching the whole array keeps this from mangling nested braces
 * or arrays inside an entry (e.g. a project's `tech: [...]`).
 */
export async function appendEntry(kind: EntryKind, data: unknown) {
  assertDevOnly();

  const arrayName = ARRAY_NAME[kind];
  const source = await readFile(CONTENT_PATH, "utf8");
  const lines = source.split("\n");

  const startIndex = lines.findIndex((line) => line.startsWith(`export const ${arrayName}`));
  if (startIndex === -1) {
    throw new Error(`Could not find "${arrayName}" in content.ts`);
  }

  const endIndex = lines.findIndex(
    (line, i) => i > startIndex && line.trimEnd() === "] as const;",
  );
  if (endIndex === -1) {
    throw new Error(`Could not find the end of "${arrayName}" in content.ts`);
  }

  const next = [
    ...lines.slice(0, endIndex),
    renderEntry(kind, data),
    ...lines.slice(endIndex),
  ];

  await writeFile(CONTENT_PATH, next.join("\n"), "utf8");
}
