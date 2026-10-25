/**
 * theme.js - light/dark mode toggle. The choice is saved; on a first visit the
 * system preference is used.
 */

// Applies "light" or "dark" through the data-theme attribute (styles.css reads it).
const setTheme = (t) => {
  document.documentElement.dataset.theme = t;
  $("#theme").setAttribute("aria-checked", t === "dark");
};
setTheme(
  S.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
);
$("#theme").onclick = () => {
  S.theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(S.theme);
  save();
};
