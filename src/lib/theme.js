// Day / Night / Auto (APP-UI: respect the OS setting, offer a toggle). Auto follows the device setting.
const KEY = "sf-theme";

export function getThemeChoice() {
  try {
    return localStorage.getItem(KEY) || "auto";
  } catch {
    return "auto";
  }
}

export function applyTheme(choice) {
  const root = document.documentElement;
  if (choice === "light" || choice === "dark") root.setAttribute("data-theme", choice);
  else root.removeAttribute("data-theme");
}

export function setThemeChoice(choice) {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    /* storage unavailable */
  }
  applyTheme(choice);
}
