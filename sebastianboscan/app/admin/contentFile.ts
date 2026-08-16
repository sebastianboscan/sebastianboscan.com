import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Server-side helpers for editing components/home/content.ts.
 *
 * This is a local authoring tool: it edits a source file on disk, so it only
 * works under `npm run dev`. On a deployed build the filesystem is read-only
 * and the site is already compiled, so every entry point here refuses to run
 * outside development.
 */

export const CONTENT_PATH = path.join(process.cwd(), "components", "home", "content.ts");

export type EntryKind = "experience" | "project" | "organization";

/** The const array each kind maps to, in content.ts. */
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

export type EntryInput = ExperienceInput | ProjectInput | OrganizationInput;

/** Renders one object literal, indented to match the existing entries. */
function renderEntry(kind: EntryKind, data: EntryInput): string {
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

type ArrayBounds = { readonly bodyStart: number; readonly bodyEnd: number };

/**
 * Character offsets of an array's body, between `[` and its matching `]`.
 *
 * Scans character by character tracking string state, so brackets and braces
 * inside a description ("a [bracket] here") never move the depth counter.
 */
function findArrayBounds(source: string, arrayName: string): ArrayBounds {
  const declaration = new RegExp(`export const ${arrayName}\\b[^=]*=\\s*\\[`);
  const match = declaration.exec(source);
  if (!match) throw new Error(`Could not find "${arrayName}" in content.ts`);

  const bodyStart = match.index + match[0].length;

  let depth = 1;
  let inString = false;
  let quoteChar = "";
  let escaped = false;

  for (let i = bodyStart; i < source.length; i++) {
    const char = source[i];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (inString) {
      if (char === quoteChar) inString = false;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quoteChar = char;
      continue;
    }

    if (char === "[") depth++;
    else if (char === "]") {
      depth--;
      if (depth === 0) return { bodyStart, bodyEnd: i };
    }
  }

  throw new Error(`Could not find the end of "${arrayName}" in content.ts`);
}

/**
 * Splits an array body into its top-level `{ … }` entries, returning each
 * one's offsets. Depth tracking means a nested object or array inside an
 * entry stays part of that entry rather than being treated as a sibling.
 */
function splitEntries(body: string): { start: number; end: number }[] {
  const entries: { start: number; end: number }[] = [];

  let depth = 0;
  let start = -1;
  let inString = false;
  let quoteChar = "";
  let escaped = false;

  for (let i = 0; i < body.length; i++) {
    const char = body[i];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (inString) {
      if (char === quoteChar) inString = false;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quoteChar = char;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        entries.push({ start, end: i + 1 });
        start = -1;
      }
    }
  }

  return entries;
}

/** Reads the raw source text of every entry in an array. */
export async function readEntries(kind: EntryKind): Promise<string[]> {
  assertDevOnly();

  const source = await readFile(CONTENT_PATH, "utf8");
  const { bodyStart, bodyEnd } = findArrayBounds(source, ARRAY_NAME[kind]);
  const body = source.slice(bodyStart, bodyEnd);

  return splitEntries(body).map((span) => body.slice(span.start, span.end));
}

/** Number of entries currently in an array. */
export async function countEntries(kind: EntryKind): Promise<number> {
  return (await readEntries(kind)).length;
}

/**
 * Rewrites an array body from a list of rendered entries.
 *
 * Entries are rendered with plain "\n", so match whatever line ending the
 * file already uses — otherwise editing one array silently reformats those
 * lines and pollutes the diff on CRLF checkouts.
 */
async function writeBody(kind: EntryKind, renderedEntries: string[]) {
  const source = await readFile(CONTENT_PATH, "utf8");
  const { bodyStart, bodyEnd } = findArrayBounds(source, ARRAY_NAME[kind]);

  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  const body = renderedEntries.length ? `${eol}${renderedEntries.join(eol)}${eol}` : eol;
  const next = source.slice(0, bodyStart) + body.replace(/\r?\n/g, eol) + source.slice(bodyEnd);

  await writeFile(CONTENT_PATH, next, "utf8");
}

/** Re-indents a parsed entry so rewritten arrays keep consistent formatting. */
function normalize(entryText: string) {
  return entryText
    .split("\n")
    .map((line) => line.trim())
    .map((line, i, all) => {
      if (i === 0) return `  ${line}`;
      if (i === all.length - 1) return `  ${line}`;
      return `    ${line}`;
    })
    .join("\n")
    .replace(/\}$/, "},");
}

function existingAsRendered(entries: string[]) {
  return entries.map(normalize);
}

export async function appendEntry(kind: EntryKind, data: EntryInput) {
  assertDevOnly();

  const existing = existingAsRendered(await readEntries(kind));
  await writeBody(kind, [...existing, renderEntry(kind, data)]);
}

export async function updateEntry(kind: EntryKind, index: number, data: EntryInput) {
  assertDevOnly();

  const existing = existingAsRendered(await readEntries(kind));
  if (index < 0 || index >= existing.length) {
    throw new Error(`No entry at position ${index + 1}.`);
  }

  existing[index] = renderEntry(kind, data);
  await writeBody(kind, existing);
}

export async function deleteEntry(kind: EntryKind, index: number) {
  assertDevOnly();

  const existing = existingAsRendered(await readEntries(kind));
  if (index < 0 || index >= existing.length) {
    throw new Error(`No entry at position ${index + 1}.`);
  }

  existing.splice(index, 1);
  await writeBody(kind, existing);
}

/** Moves an entry up or down, for reordering how sections display. */
export async function moveEntry(kind: EntryKind, index: number, direction: -1 | 1) {
  assertDevOnly();

  const existing = existingAsRendered(await readEntries(kind));
  const target = index + direction;
  if (index < 0 || index >= existing.length) {
    throw new Error(`No entry at position ${index + 1}.`);
  }
  if (target < 0 || target >= existing.length) {
    throw new Error("Already at the end of the list.");
  }

  [existing[index], existing[target]] = [existing[target], existing[index]];
  await writeBody(kind, existing);
}
