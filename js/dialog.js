/**
 * dialog.js - one reusable <dialog> for naming things and confirming deletes.
 */

const dlg = $("#dlg"),
  di = $("#di");
let rs;
// Opens the dialog. Resolves with trimmed text (if `value` is given), true (confirm) or null (cancel).
function ask({ title, msg = "", value, ok = "Save", danger, ph = "" }) {
  return new Promise((r) => {
    rs = r;
    $("#dt").textContent = title;
    $("#dm").textContent = msg;
    $("#dm").hidden = !msg;
    di.hidden = value === undefined;
    di.value = value || "";
    di.placeholder = ph;
    $("#de").textContent = "";
    const b = $("#dok");
    b.textContent = ok;
    b.className = "btn" + (danger ? " dng" : "");
    dlg.returnValue = "";
    dlg.showModal();
    (di.hidden ? b : di).focus();
    if (!di.hidden) di.select();
  });
}
dlg.addEventListener("close", () =>
  rs(dlg.returnValue === "ok" ? (di.hidden ? true : di.value.trim()) : null),
);
$("#df").addEventListener("submit", (e) => {
  if (!di.hidden && !di.value.trim()) {
    e.preventDefault();
    $("#de").textContent = "Please enter a name.";
    di.focus();
  }
});
$("#dc").onclick = () => dlg.close();
