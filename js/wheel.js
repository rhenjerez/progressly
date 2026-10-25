/**
 * wheel.js - Spin the Wheel: option list, duration input, drawing and spinning.
 */

// busy: a spin is running | rot: total wheel rotation so far | pick: name of the current winner.
let busy = false,
  rot = 0,
  pick = null;
const W = $("#wheel");
const res = (h, c = "") => {
  $("#res").className = "res " + c;
  $("#res").innerHTML = h;
};
// Default message in the result box.
const idle = () =>
  res(
    `<span class="ck">${ic("target")}</span><div><strong>Your chosen task will appear here</strong><span class="s">Spin the wheel to see what you should do next.</span></div>`,
  );
// Draws one coloured slice per option as SVG, labelled so it doesn't rely on colour alone.
function drawWheel() {
  const n = S.wheel.length,
    r = 96,
    sg = 360 / n,
    P = (a, d = r) => [
      (d * Math.sin((a * Math.PI) / 180)).toFixed(2),
      (-d * Math.cos((a * Math.PI) / 180)).toFixed(2),
    ],
    fs = n > 8 ? 8 : 11;
  let h = "";
  if (!n) h = '<circle r="96" style="fill:var(--track)"/>';
  else
    S.wheel.forEach((o, i) => {
      const a0 = i * sg,
        [x0, y0] = P(a0),
        [x1, y1] = P(a0 + sg),
        f = `fill:hsl(${HUES[i % 8]} var(--sat) var(--lit))`,
        l = esc(o.name.length > 14 ? o.name.slice(0, 13) + "…" : o.name);
      h +=
        n === 1
          ? `<circle class="sl" r="${r}" style="${f}"/><text class="wt" text-anchor="middle" y="4" style="font-size:12px">${l}</text>`
          : `<path class="sl" d="M0 0L${x0} ${y0}A${r} ${r} 0 ${sg > 180 ? 1 : 0} 1 ${x1} ${y1}Z" style="${f}"/><text class="wt" transform="rotate(${a0 + sg / 2 - 90})" x="${r - 9}" y="${fs / 3}" text-anchor="end" style="font-size:${fs}px">${l}</text>`;
    });
  W.innerHTML =
    h + '<circle r="9" style="fill:var(--card);stroke:var(--line)"/>';
}
// Updates the option list, duration input, button label and hint text.
function renderWheel() {
  const n = S.wheel.length;
  $("#opts").innerHTML = n
    ? S.wheel
        .map(
          (o, i) =>
            `<li><span class="d" style="background:hsl(${HUES[i % 8]} 75% 50%)"></span><span class="nm">${esc(o.name)}</span><button class="ib" data-a="wd" data-w="${o.id}" aria-label="Remove ${esc(o.name)}">${ic("x")}</button></li>`,
        )
        .join("")
    : '<li class="s">No options yet. Add a task above to get started.</li>';
  if (document.activeElement !== $("#dur")) $("#dur").value = S.secs;
  $("#spin").innerHTML =
    `${ic("target")}Spin for ${S.secs} second${S.secs === 1 ? "" : "s"}`;
  $("#spin").disabled = !n;
  $("#hint").textContent = !n
    ? "Add at least one task to spin the wheel."
    : n === 1
      ? "Only one task is on the wheel, so it will be the pick."
      : "";
}
// Back to the idle state. Called whenever the options change.
function resetWheel() {
  pick = null;
  rot = 0;
  W.style.transition = "none";
  W.style.transform = "rotate(0deg)";
  idle();
  drawWheel();
  renderWheel();
}
// Picks the winner at random FIRST, then animates the wheel so it lands on that slice.
// The duration only changes the animation, never the odds.
function spin() {
  if (busy || !S.wheel.length) return;
  busy = true;
  $("#ctl").disabled = true;
  const n = S.wheel.length,
    i = Math.floor(Math.random() * n),
    sg = 360 / n,
    off = -((i + 0.5) * sg + (Math.random() - 0.5) * sg * 0.6);
  const delta = (((off - rot) % 360) + 360) % 360,
    dur = matchMedia("(prefers-reduced-motion:reduce)").matches
      ? 600
      : S.secs * 1000,
    turns = Math.max(2, Math.round(S.secs * 1.5));
  rot += turns * 360 + delta;
  res("<div><strong>Spinning…</strong></div>");
  W.style.transition = `transform ${dur}ms cubic-bezier(.17,.67,.12,1)`;
  W.style.transform = `rotate(${rot}deg)`;
  setTimeout(() => {
    pick = S.wheel[i].name;
    res(
      `<span class="ck">${ic("target")}</span><div><span class="s">Your pick</span><strong>${esc(pick)}</strong><button class="btn sm" data-a="doit">Let’s do it</button></div>`,
      "win",
    );
    busy = false;
    $("#ctl").disabled = false;
  }, dur + 80);
}
// "Let's do it": scroll to and highlight the matching task in the goals list.
function doIt() {
  const p = pick.toLowerCase();
  let hit;
  S.goals.forEach((g) =>
    g.tasks.forEach((t) => {
      const q = t.name.toLowerCase();
      if (!hit && (q.includes(p) || p.includes(q))) hit = [g, t];
    }),
  );
  if (!hit) {
    const b = $("#res .btn");
    b &&
      b.replaceWith(
        Object.assign(document.createElement("span"), {
          className: "s",
          textContent: "Not on your checklist, but go for it!",
        }),
      );
    return;
  }
  hit[0].open = true;
  save();
  render();
  const el = document.querySelector(`.t[data-t="${hit[1].id}"]`);
  el.scrollIntoView({ block: "center" });
  el.classList.add("hl");
  setTimeout(() => el.classList.remove("hl"), 2200);
}
$("#wf").onsubmit = (e) => {
  e.preventDefault();
  const i = $("#wi"),
    v = i.value.trim(),
    er = $("#we");
  if (!v) {
    er.textContent = "Enter a task name first.";
    return;
  }
  if (S.wheel.length >= 12) {
    er.textContent = "The wheel holds up to 12 tasks.";
    return;
  }
  if (S.wheel.some((o) => o.name.toLowerCase() === v.toLowerCase())) {
    er.textContent = "That task is already on the wheel.";
    return;
  }
  er.textContent = "";
  S.wheel.push({ id: uid(), name: v });
  i.value = "";
  save();
  resetWheel();
  i.focus();
};
$("#dur").addEventListener("input", (e) => {
  const v = parseFloat(e.target.value),
    er = $("#dure");
  if (!(v >= 1 && v <= 60)) {
    er.textContent = "Enter a duration between 1 and 60 seconds.";
    $("#spin").disabled = true;
    return;
  }
  er.textContent = "";
  S.secs = Math.round(v * 10) / 10;
  save();
  renderWheel();
});
$("#dur").addEventListener("change", () => {
  $("#dur").value = S.secs;
  $("#dure").textContent = "";
  renderWheel();
});
