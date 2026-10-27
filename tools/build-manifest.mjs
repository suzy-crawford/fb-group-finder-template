// Publish step: fingerprint every source file and split them into copy parts for members.
// Writes copy-manifest.json, which the in-app Copy check compares against.
// Run with: node tools/build-manifest.mjs   (sync_template.sh runs it for you)
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// The same rule as src/lib/copyCheck.js: ignore all whitespace, so harmless reformatting still matches.
// Data entities are compared as data (Base44 reformats them when it saves), with keys in a fixed order.
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])])) : v);
const normalize = (text, path) => {
  if (path.endsWith(".jsonc")) {
    try {
      return JSON.stringify(sortKeys(JSON.parse(text)));
    } catch {
      /* fall back to text */
    }
  }
  return text.replace(/\s+/g, "");
};
export const fingerprint = (text, path = "") => createHash("sha256").update(normalize(text, path)).digest("hex").slice(0, 16);

function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith("__") || name === "node_modules") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => name.endsWith(e))) out.push(relative(root, full));
  }
  return out;
}

const files = [
  "tailwind.config.js",
  // base44/config.jsonc holds each app's own project name, so it's left out.
  ...walk(join(root, "base44"), [".jsonc", ".ts", ".js"]).filter((f) => !f.endsWith("config.jsonc")),
  ...walk(join(root, "src"), [".js", ".jsx", ".css"]),
].sort((a, b) => {
  // Order: setup files, the backend, shared libraries, components, then pages and the app shell.
  const rank = (f) => (f.startsWith("base44/") ? 1 : f.startsWith("src/lib/") || f.startsWith("src/brand/") || f.startsWith("src/api/") || f.startsWith("src/utils/") || f.startsWith("src/hooks/") ? 2 : f.startsWith("src/components/") ? 3 : f.startsWith("src/pages/") ? 4 : f.startsWith("src/") ? 5 : 0);
  return rank(a) - rank(b) || a.localeCompare(b);
});

// Dependencies first: a file is only copied after every file it imports, so the app builds after each
// part and Base44 never "fixes" a missing import by rewriting a file (which breaks the Copy check).
const known = new Set(files);
const resolveImport = (from, spec) => {
  const base = spec.startsWith("@/") ? `src/${spec.slice(2)}` : spec.startsWith(".") ? join(dirname(from), spec) : null;
  if (!base) return null;
  return ["", ".js", ".jsx", ".ts", ".css", "/index.js", "/index.jsx"].map((ext) => base + ext).find((p) => known.has(p)) || null;
};
const ordered = [];
const placed = new Set();
const visit = (f, stack = new Set()) => {
  if (placed.has(f) || stack.has(f)) return;
  stack.add(f);
  if (/\.(jsx?|ts)$/.test(f)) {
    const text = readFileSync(join(root, f), "utf8");
    for (const [, spec] of text.matchAll(/(?:import|from)\s*\(?\s*["']([^"'?]+)["']/g)) {
      const dep = resolveImport(f, spec);
      if (dep) visit(dep, stack);
    }
  }
  stack.delete(f);
  placed.add(f);
  ordered.push(f);
};
// Part 1 is the working app shell: everything the sign-in and the home screen need.
// (Pages, brand stylesheets and live content load only when present, so the app runs after Part 1.)
const SHELL = [
  "src/main.jsx", "src/App.jsx", "src/index.css", "src/lib/brandStyles.js",
  "src/pages/Home.jsx",
  "src/components/AppLayout.jsx", "src/components/ProtectedRoute.jsx",
  "src/lib/AuthContext.jsx", "src/lib/PageNotFound.jsx", "src/components/UserNotRegisteredError.jsx",
  "src/components/ScrollToTop.jsx", "src/components/ui/toaster.jsx", "src/lib/query-client.js",
  "src/components/shared/Skeleton.jsx", "src/lib/theme.js",
];
["tailwind.config.js", ...files.filter((f) => f.startsWith("base44/entities/")), ...SHELL].forEach((f) => visit(f));
const shellCount = ordered.length;
// Then everything else, dependencies first, with the brand stylesheets last (the app loads them from the template until then).
files.filter((f) => !f.startsWith("src/brand/") || !f.endsWith(".css")).forEach((f) => visit(f));
files.forEach((f) => visit(f));
files.splice(0, files.length, ...ordered);

// Part 1 is the shell; the rest is split into 3 even parts (4 install messages in all).
const PARTS = 4;
const rest = files.slice(shellCount);
const restSize = rest.reduce((n, f) => n + readFileSync(join(root, f), "utf8").length, 0);
// The smallest part size that fits the rest into 3 parts, so no part (especially the last) runs long.
const sizes = rest.map((f) => readFileSync(join(root, f), "utf8").length);
const partsFor = (limit) => { let n = 1, s = 0; for (const x of sizes) { if (s && s + x > limit) { n += 1; s = 0; } s += x; } return n; };
let LIMIT = Math.ceil(restSize / (PARTS - 1));
while (partsFor(LIMIT) > PARTS - 1) LIMIT += 1000;
let part = 1;
let size = 0;
const entries = {};
files.forEach((f, i) => {
  const text = readFileSync(join(root, f), "utf8");
  if (i === shellCount || (i > shellCount && size + text.length > LIMIT && part < PARTS)) {
    part += 1;
    size = 0;
  }
  size += text.length;
  entries[f] = { part, hash: fingerprint(text, f) };
});

const { version } = JSON.parse(readFileSync(join(root, "version.json"), "utf8"));
writeFileSync(join(root, "copy-manifest.json"), JSON.stringify({ version, parts: part, files: entries }, null, 2) + "\n");
console.log(`copy-manifest.json written: ${files.length} files in ${part} parts`);

// COPY.md: the copy instructions Base44 follows, one part per member message.
const RAW = `https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/v${version}`;
const SETUP = ["package.json", "vite.config.js", "jsconfig.json", "postcss.config.js", "components.json"];
const lines = [
  `# Copy instructions for FB Group Finder ${version}`,
  "",
  "This repository is a finished, tested app. Your job is to copy it into this Base44 app exactly, one part at a time.",
  "",
  "## Rules (follow every one)",
  "",
  "- Copy, don't build. Do not plan, design, redesign, improve, simplify, rename, merge or split anything.",
  "- For every file in the part you're asked to do: open its link, and create the file at exactly that path with exactly that content, character for character.",
  "- Never write your own version of a file, never summarize a file, and never leave a file out. If a file is long, keep going until it's complete.",
  "- Don't create files that aren't listed, and don't change files from other parts.",
  "- Only do the part the user asks for, then stop and say which files you created.",
  "- A new Base44 app already has some of these files (for example src/lib/app-params.js and src/api/base44Client.js). Replace them with the repo's version anyway, even if yours looks almost the same. Only the repo's exact version passes the Copy check.",
  "- Don't fix build errors between parts. If the app shows an error before the last part, leave it: it means a file from a later part isn't there yet. Never edit, rename or add an export to any file to make an error go away.",
  "- The data entities are in base44/entities and the backend functions are in base44/functions. Create them exactly as written.",
  "- Images load from the internet by themselves. Don't create or download image files.",
  "- Spacing, line breaks and a missing final newline don't matter (the check ignores them), and Base44 reformatting entity files is fine. Don't spend time on those.",
  "- Don't compare or re-check files after writing them, and don't test the app between parts. The app's Copy check does all of that at the end, so extra checking only uses up credits.",
  "",
  `There are ${part} parts. After the last part, the user opens Settings, then Check my setup. Its Copy check compares every file with this list and names any file that isn't an exact copy.`,
  "",
];
for (let n = 1; n <= part; n++) {
  lines.push(`## Part ${n}`, "");
  if (n === 1) {
    lines.push("First make sure these setup files match (install every package listed in package.json):", "");
    SETUP.forEach((f) => lines.push(`- ${f}: ${RAW}/${f}`));
    lines.push("", "Then create these files:", "");
  }
  Object.entries(entries)
    .filter(([, e]) => e.part === n)
    .forEach(([f]) => lines.push(`- ${f}: ${RAW}/${f}`));
  lines.push("");
}
writeFileSync(join(root, "COPY.md"), lines.join("\n"));
console.log(`COPY.md written: ${part} parts`);
