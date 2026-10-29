/* ORACLES — carte du monde par zones (accueil : vignette ; page Carte : interactive) */
(function () {
  const M = window.ORACLES_MAP, Z = window.ZONES, T = window.TYPES, W = window.WORKS;
  const { esc, workHTML } = window.ORACLES_UTIL;
  const NS = "http://www.w3.org/2000/svg";
  const zoneIds = Object.keys(Z);
  const ZP = {}; Object.entries(window.ZONES_PAYS || {}).forEach(([z, l]) => l.forEach((n) => (ZP[n] = z)));
  const zoneOf = (c) => ZP[c.n] || c.z;
  const count = (z) => W.filter((w) => w.zone === z && w.type !== "revue").length;

  function buildSVG(interactive) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${M.w} ${M.h}`);
    svg.setAttribute("role", interactive ? "group" : "img");
    svg.setAttribute("aria-label", "Carte du monde découpée en huit zones d'études stratégiques");
    zoneIds.forEach((id, i) => {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "zone");
      g.dataset.zone = id;
      g.style.setProperty("--i", i);
      if (interactive) {
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-pressed", "false");
        g.setAttribute("aria-label", `${Z[id].nom}, ${count(id)} travaux`);
      }
      M.countries.filter((c) => zoneOf(c) === id).forEach((c) => {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", c.d);
        g.appendChild(p);
      });
      svg.appendChild(g);
      const [x, y] = (window.ZONES_MARQUEURS || {})[id] || M.anchors[id] || [500, 250];
      const mk = document.createElementNS(NS, "g");
      mk.setAttribute("class", "marker");
      mk.innerHTML = `<circle cx="${x}" cy="${y}" r="16"/><text x="${x}" y="${y}">${count(id)}</text>`;
      svg.appendChild(mk);
    });
    return svg;
  }

  /* Carte interactive */
  const box = document.getElementById("map-box");
  if (!box) return;
  const svg = buildSVG(true);
  box.appendChild(svg);
  const tip = document.createElement("div");
  tip.className = "map-tip";
  box.appendChild(tip);

  const btns = document.getElementById("zone-buttons");
  btns.innerHTML = zoneIds.map((id) => `<button class="chip" data-zone="${id}" aria-pressed="false">${esc(Z[id].nom)}</button>`).join("");

  const panel = document.getElementById("panel");
  let current = null, typeFilter = "";

  function render() {
    if (!current) {
      panel.innerHTML = `<h2>Choisissez une zone</h2><p class="intro">Cliquez sur une zone de la carte (ou sur un bouton) pour afficher les fiches de lecture, entretiens et articles qui s'y rapportent.</p>`;
      return;
    }
    const all = W.filter((w) => w.zone === current && w.type !== "revue").sort((a, b) => b.date.localeCompare(a.date));
    const res = all.filter((w) => !typeFilter || w.type === typeFilter);
    const chips = [["", "Tous"], ["fiche-lecture", "Fiches de lecture"], ["entretien", "Entretiens"], ["article", "Articles"]];
    panel.innerHTML = `
      <h2>${esc(Z[current].nom)}</h2>
      <p class="intro">${esc(Z[current].intro)} ${all.length} travail${all.length > 1 ? "x" : ""}.</p>
      <div class="filters">${chips.map(([v, l]) => `<button class="chip" data-type="${v}" aria-pressed="${v === typeFilter}">${l}</button>`).join("")}</div>
      <ul class="works">${res.length ? res.map(workHTML).join("") : '<li class="empty">' + (typeFilter ? "Aucun travail de ce type pour cette zone pour l'instant." : "Aucun travail n'est encore publié pour cette zone.") + "</li>"}</ul>`;
  }

  function select(id) {
    current = id;
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    svg.querySelectorAll(".zone").forEach((g) => g.setAttribute("aria-pressed", g.dataset.zone === id));
    btns.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.zone === id));
    render();
  }

  svg.addEventListener("click", (e) => { const g = e.target.closest(".zone"); if (g) select(g.dataset.zone); });
  svg.addEventListener("keydown", (e) => {
    const g = e.target.closest(".zone");
    if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(g.dataset.zone); }
  });
  btns.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) select(b.dataset.zone); });
  panel.addEventListener("click", (e) => { const b = e.target.closest("button[data-type]"); if (b) { typeFilter = b.dataset.type; render(); } });

  svg.addEventListener("pointermove", (e) => {
    const g = e.target.closest(".zone");
    if (!g) { tip.classList.remove("on"); return; }
    const r = box.getBoundingClientRect();
    tip.textContent = `${Z[g.dataset.zone].nom} (${count(g.dataset.zone)})`;
    tip.style.left = e.clientX - r.left + "px";
    tip.style.top = e.clientY - r.top + "px";
    tip.classList.add("on");
  });
  svg.addEventListener("pointerleave", () => tip.classList.remove("on"));

  const start = location.hash.slice(1);
  if (Z[start]) select(start); else render();
})();
