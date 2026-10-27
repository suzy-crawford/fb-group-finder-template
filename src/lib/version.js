// FB Group Finder - app version and updates (version.js)
// APP_VERSION is the version of the code in this app. version.json in the public member template
// holds the newest version and what changed. When the template is newer, Home shows an update
// banner with a prompt the member pastes into Base44.
// Keep APP_VERSION and version.json in sync when publishing an update.

export const APP_VERSION = "1.0.1";

export const TEMPLATE_REPO = "https://github.com/suzy-crawford/fb-group-finder-template";
const VERSION_URL = "https://raw.githubusercontent.com/suzy-crawford/fb-group-finder-template/main/version.json";

export function isNewer(a, b) {
  const pa = String(a || "0").split(".").map(Number);
  const pb = String(b || "0").split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return true;
    if ((pa[i] || 0) < (pb[i] || 0)) return false;
  }
  return false;
}

export async function fetchLatest() {
  const res = await fetch(`${VERSION_URL}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Couldn't check for updates (${res.status})`);
  return res.json();
}

export function updatePrompt(latest) {
  return `Update my app to the newest version from this GitHub repo: ${TEMPLATE_REPO}

Do exactly this:
1. Replace every file in my app with the version from the repo (everything in src/ and base44/, plus the other project files).
2. Add any new files from the repo, and delete any of my code files that are no longer in the repo.
3. Keep all my data. Don't delete or reset any records (my saved businesses and searches).
4. Don't redesign, rename or "improve" anything. The repo is the source of truth.
5. When you're done, open src/lib/version.js and tell me the APP_VERSION. It should say ${latest?.version || "the newest version"}.`;
}
