// SheFreelances OS - brand stylesheets (brandStyles.js)
// The brand look lives in six stylesheets in src/brand. They are loaded here rather than from index.css, so
// a member's new app looks right from the very first install message: until all six files have been
// copied in, the app loads the same files from the public template (pinned to this app's version).
import { APP_VERSION, TEMPLATE_REPO } from "./version";

const FILES = ["tokens.css", "app.css", "brand2-1.css", "brand2-2.css", "brand2-3.css", "brand2-4.css"];

// Order matters (tokens first, the brand 2.0 restyle last), so each group is its own import.
const tokens = import.meta.glob("../brand/tokens.css", { eager: true });
const app = import.meta.glob("../brand/app.css", { eager: true });
const brand2 = import.meta.glob("../brand/brand2-*.css", { eager: true });

const present = new Set([...Object.keys(tokens), ...Object.keys(app), ...Object.keys(brand2)].map((p) => p.split("/").pop()));

export function loadBrandStyles() {
  if (FILES.every((f) => present.has(f))) return;
  const repo = TEMPLATE_REPO.replace("https://github.com/", "");
  const base = `https://cdn.jsdelivr.net/gh/${repo}@v${APP_VERSION}/src/brand/`;
  // Prepend in reverse, so the files end up first in <head> in their normal order, before the app's own styles.
  [...FILES].reverse().forEach((file) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = base + file;
    document.head.prepend(link);
  });
}
