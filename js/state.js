/**
 * state.js - constants, icons, small helpers, the data model and saving.
 * Loaded first: every other file relies on the globals defined here.
 *
 * The whole app state lives in one object, `S`:
 *   S.name   - name shown in the greeting
 *   S.theme  - "light" | "dark" | null (null = follow the system)
 *   S.secs   - wheel spin duration in seconds
 *   S.goals  - [{ id, name, icon, color, open, tasks: [{ id, name }] }]
 *   S.done   - { "2026-10-19": { taskId: 1 } }  completed tasks, one record per week
 *   S.wheel  - [{ id, name }]  options on the wheel
 */

const $ = (s) => document.querySelector(s),
  KEY = "progressly-v1",
  HUES = [150, 215, 275, 22, 45, 330, 175, 95];
// Icon paths on a 24x24 grid, drawn as stroked lines by ic().
const IC = {
  leaf: "M12 22V11M12 11C12 6 8 4 4 4c0 4 2 7 8 7M12 14c0-4 3-6 8-6 0 4-2 7-8 7",
  plus: "M5 12h14M12 5v14",
  x: "M18 6 6 18M6 6l12 12",
  chev: "m6 9 6 6 6-6",
  edit: "M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z",
  trash: "M3 6h18M19 6l-1 14H6L5 6m4 0V4h6v2M10 11v5M14 11v5",
  gym: "M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11",
  cap: "M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 3 9 3 12 0v-5",
  book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  target:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z",
  spark: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z",
  bulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z",
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
};
// Returns an inline <svg> string for the named icon.
const ic = (n) =>
  `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
document
  .querySelectorAll("[data-ic]")
  .forEach((e) => (e.innerHTML = ic(e.dataset.ic)));
// Short random id for goals, tasks and wheel options.
const uid = () => Math.random().toString(36).slice(2, 10);
// Escapes text before it goes into innerHTML so typed input can't inject HTML.
const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
// Icons cycled through for new goals. Colour slots c1-c5 (see styles.css) cycle the same way.
const GI = ["target", "leaf", "book", "gym", "cap"];
// Starting state for a first visit: no goals and no wheel options.
function emptyState() {
  return { name: "John", theme: null, secs: 5, done: {}, goals: [], wheel: [] };
}
// Load saved state. Saved data is always kept; we only start empty when nothing
// usable is stored. Missing lists are filled in without touching existing ones.
let S;
try {
  S = JSON.parse(localStorage.getItem(KEY));
} catch (e) {}
if (!S || typeof S !== "object" || Array.isArray(S)) S = emptyState();
if (!Array.isArray(S.goals)) S.goals = [];
if (!Array.isArray(S.wheel)) S.wheel = [];
delete S.note; // old demo-notice flag, no longer used
delete S.spins; // old rotation-count setting, replaced by S.secs
S.done = S.done || {};
S.name = S.name || "there";
S.secs = S.secs > 0 ? S.secs : 5;
// Writes state to localStorage. Silently skipped if the browser blocks storage.
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
};
