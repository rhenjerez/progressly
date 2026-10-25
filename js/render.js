/**
 * render.js - draws the header, weekly progress card and goal cards from state.
 * All UI is rebuilt from `S` by render(); change S, save(), then call render().
 */

// Progress bar markup, with ARIA attributes for screen readers.
const bar = (p, l) =>
  `<div class="bar" role="progressbar" aria-label="${l}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p)}"><i style="width:${p}%"></i></div>`;
// Redraws greeting, weekly totals, ring and every goal card from state.
function render() {
  const dn = S.done[wkKey()] || {};
  let tot = 0,
    cnt = 0;
  const gh = S.goals
    .map((g) => {
      const d = g.tasks.filter((t) => dn[t.id]).length,
        p = g.tasks.length ? (d / g.tasks.length) * 100 : 0,
        n = esc(g.name);
      tot += g.tasks.length;
      cnt += d;
      return (
        `<section class="goal c${g.color}"><div class="gh"><span class="gi">${ic(g.icon)}</span><div class="gm"><h3>${n}</h3><p>${d} of ${g.tasks.length} completed</p>${bar(p, n + " progress")}</div><div class="ga"><button class="ib" data-a="eg" data-g="${g.id}" aria-label="Rename ${n}">${ic("edit")}</button><button class="ib" data-a="dg" data-g="${g.id}" aria-label="Delete ${n}">${ic("trash")}</button><button class="ib chev" data-a="tg" data-g="${g.id}" aria-expanded="${g.open}" aria-controls="b${g.id}" aria-label="Show or hide tasks for ${n}">${ic("chev")}</button></div></div>` +
        (g.open
          ? `<div class="gb" id="b${g.id}">${g.tasks.map((t) => `<div class="t" data-t="${t.id}"><label><input type="checkbox" data-t="${t.id}" ${dn[t.id] ? "checked" : ""}><span>${esc(t.name)}</span></label><span class="ta"><button class="ib" data-a="et" data-g="${g.id}" data-t="${t.id}" aria-label="Rename task ${esc(t.name)}">${ic("edit")}</button><button class="ib" data-a="dt" data-g="${g.id}" data-t="${t.id}" aria-label="Delete task ${esc(t.name)}">${ic("trash")}</button></span></div>`).join("") || '<p class="s">No tasks yet. Add your first one below.</p>'}<form class="addt" data-g="${g.id}"><input class="in" id="a${g.id}" placeholder="Add a task…" maxlength="80" aria-label="Add a task to ${n}"><button class="ib" aria-label="Add task">${ic("plus")}</button></form></div>`
          : "") +
        "</section>"
      );
    })
    .join("");
  const pct = tot ? Math.round((cnt / tot) * 100) : 0,
    C = 276.46,
    h = new Date().getHours();
  $("#hi").textContent =
    `${h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"}, ${S.name}!`;
  $("#av").textContent = S.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  $("#pc").textContent = `${cnt} of ${tot} completed`;
  $("#pb").innerHTML = bar(pct, "Weekly progress");
  $("#ring").innerHTML =
    `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="rt" cx="50" cy="50" r="44"/><circle class="rf" cx="50" cy="50" r="44" style="stroke-dasharray:${(C * pct) / 100} ${C}"/></svg><b>${pct}%</b>`;
  $("#gl").innerHTML = S.goals.length
    ? gh
    : '<div class="card empty"><strong>No goals yet</strong><p>Create a goal like “Fitness” or “Reading”, then add the weekly tasks that move it forward.</p><button class="btn" data-a="ag">Add your first goal</button></div>';
}
