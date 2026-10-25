/**
 * goals.js - everything the user can do with goals and tasks (add, rename,
 * delete, check, collapse), plus sidebar navigation and the avatar/name button.
 */

// One delegated click handler for every button with a data-a (action) attribute.
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-a]");
  if (!b) return;
  const a = b.dataset.a,
    g = S.goals.find((x) => x.id === b.dataset.g),
    t = g && g.tasks.find((x) => x.id === b.dataset.t);
  if (a === "nh") return (scrollTo({ top: 0 }), setNav(0));
  if (a === "ng") return ($("#goals").scrollIntoView(), setNav(1));
  if (a === "spin") return spin();
  if (a === "wd") {
    S.wheel = S.wheel.filter((o) => o.id !== b.dataset.w);
    save();
    return resetWheel();
  }
  if (a === "doit") return doIt();
  if (a === "tg") g.open = !g.open;
  else if (a === "ag") {
    const v = await ask({
      title: "New goal",
      value: "",
      ph: "e.g. Fitness",
      ok: "Add goal",
    });
    if (!v) return;
    const n = S.goals.length;
    S.goals.push({
      id: uid(),
      name: v,
      icon: GI[n % 5],
      color: (n % 5) + 1,
      open: true,
      tasks: [],
    });
  } else if (a === "eg") {
    const v = await ask({ title: "Rename goal", value: g.name });
    if (!v) return;
    g.name = v;
  } else if (a === "dg") {
    if (
      !(await ask({
        title: "Delete this goal?",
        msg: `“${g.name}” and its ${g.tasks.length} task${g.tasks.length === 1 ? "" : "s"} will be removed.`,
        ok: "Delete",
        danger: 1,
      }))
    )
      return;
    S.goals = S.goals.filter((x) => x !== g);
  } else if (a === "et") {
    const v = await ask({ title: "Rename task", value: t.name });
    if (!v) return;
    t.name = v;
  } else if (a === "dt") g.tasks = g.tasks.filter((x) => x !== t);
  save();
  render();
  if (a === "tg") {
    const f = document.querySelector(`[data-a="tg"][data-g="${g.id}"]`);
    f && f.focus();
  }
});
// A checkbox was toggled: record it for the current week only.
document.addEventListener("change", (e) => {
  const c = e.target;
  if (c.type !== "checkbox") return;
  const k = wkKey(),
    m = (S.done[k] = S.done[k] || {});
  c.checked ? (m[c.dataset.t] = 1) : delete m[c.dataset.t];
  save();
  render();
  const f = document.querySelector(`input[data-t="${c.dataset.t}"]`);
  f && f.focus();
});
// The "Add a task" form inside a goal card.
document.addEventListener("submit", (e) => {
  const f = e.target;
  if (!f.classList.contains("addt") || !f.dataset.g) return;
  e.preventDefault();
  const i = f.querySelector("input"),
    v = i.value.trim(),
    g = S.goals.find((x) => x.id === f.dataset.g);
  if (!v) {
    i.classList.add("bad");
    i.focus();
    return;
  }
  g.tasks.push({ id: uid(), name: v });
  save();
  render();
  $("#a" + g.id).focus();
});
document.addEventListener("input", (e) => e.target.classList.remove("bad"));
// Marks the clicked sidebar item as the current page.
function setNav(i) {
  document
    .querySelectorAll(".nv")
    .forEach((n, j) =>
      j === i
        ? n.setAttribute("aria-current", "page")
        : n.removeAttribute("aria-current"),
    );
}
$("#av").onclick = async () => {
  const v = await ask({
    title: "Your name",
    value: S.name === "there" ? "" : S.name,
  });
  if (!v) return;
  S.name = v;
  save();
  render();
};
