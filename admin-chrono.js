/* ORACLES — espace contributeur : onglet « Chronologies »
   Créer, mettre à jour et supprimer des chronologies de crise (fichier js/chronologies.js). */
(function () {
  const A = window.ORACLES_ADMIN, $ = (id) => document.getElementById(id);
  const { esc, fmtDate, chronoHTML } = window.ORACLES_UTIL;
  const msg = (t, k) => A.msg($("ch-msg"), t, k);
  const blankEvent = () => ({ date: "", phase: "", titre: "", texte: "", pic: false });
  let events = [blankEvent()];
  let editing = null; // chronologie en cours de modification

  /* ---------- Lecture / écriture du fichier ---------- */
  async function load() {
    const f = await A.api("GET", "js/chronologies.js");
    if (!f) return [];
    const m = A.dec(f.content).match(/window\.CHRONOLOGIES\s*=\s*([\s\S]*?);\s*$/);
    if (!m) throw new Error("Format de js/chronologies.js non reconnu.");
    return JSON.parse(m[1]);
  }
  const serialize = (list) => "/* Fichier géré par l'espace contributeur (onglet Chronologies).\n   Il peut aussi être modifié à la main : respectez le format JSON. */\nwindow.CHRONOLOGIES = " + JSON.stringify(list, null, 2) + ";\n";

  /* ---------- Formulaire ---------- */
  function readMeta() {
    return {
      titre: $("ch-titre").value.trim(), resume: $("ch-resume").value.trim(),
      acteurs: $("ch-acteurs").value.split(",").map((s) => s.trim()).filter(Boolean), auteur: $("ch-auteur").value.trim()
    };
  }
  function renderRows() {
    $("ch-events").innerHTML = events.map((e, i) => `
      <div class="rowcard" data-i="${i}">
        <div class="row">
          <div><label for="ev-d-${i}">Date</label><input type="text" id="ev-d-${i}" data-f="date" value="${esc(e.date)}" placeholder="ex. 22 oct. 1962"></div>
          <div><label for="ev-p-${i}">Phase</label><input type="text" id="ev-p-${i}" data-f="phase" list="ch-phases" value="${esc(e.phase)}" placeholder="ex. Escalade"></div>
        </div>
        <label for="ev-t-${i}">Titre de l'événement</label><input type="text" id="ev-t-${i}" data-f="titre" value="${esc(e.titre)}">
        <label for="ev-x-${i}">Description</label><textarea id="ev-x-${i}" data-f="texte" style="min-height:5rem;font-family:inherit">${esc(e.texte)}</textarea>
        <label class="check"><input type="checkbox" data-f="pic"${e.pic ? " checked" : ""}> Point culminant de la crise</label>
        <div class="rowtools">
          <button type="button" class="mini" data-a="up"${i === 0 ? " disabled" : ""}>↑ Monter</button>
          <button type="button" class="mini" data-a="down"${i === events.length - 1 ? " disabled" : ""}>↓ Descendre</button>
          <button type="button" class="mini del" data-a="rm">Supprimer</button>
        </div>
      </div>`).join("");
    $("ch-phases").innerHTML = [...new Set(events.map((e) => e.phase).filter(Boolean))].map((p) => `<option value="${esc(p)}">`).join("");
    preview();
  }
  function preview() {
    const m = readMeta();
    const evs = events.filter((e) => e.date || e.titre);
    $("ch-preview").innerHTML = m.titre || evs.length ? chronoHTML({ ...m, evenements: evs, maj: A.today() }) : '<p class="muted">L\'aperçu de la chronologie apparaîtra ici.</p>';
  }
  ["ch-titre", "ch-resume", "ch-acteurs", "ch-auteur"].forEach((id) => $(id).addEventListener("input", preview));
  $("ch-events").addEventListener("input", (e) => {
    const row = e.target.closest(".rowcard"), f = e.target.dataset.f;
    if (!row || !f) return;
    events[+row.dataset.i][f] = f === "pic" ? e.target.checked : e.target.value;
    preview();
  });
  $("ch-events").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-a]"); if (!b) return;
    const i = +b.closest(".rowcard").dataset.i;
    if (b.dataset.a === "up" && i > 0) [events[i - 1], events[i]] = [events[i], events[i - 1]];
    if (b.dataset.a === "down" && i < events.length - 1) [events[i + 1], events[i]] = [events[i], events[i + 1]];
    if (b.dataset.a === "rm") { events.splice(i, 1); if (!events.length) events.push(blankEvent()); }
    renderRows();
  });
  $("ch-add").addEventListener("click", () => { events.push(blankEvent()); renderRows(); const last = $("ch-events").querySelector(".rowcard:last-child input"); if (last) last.focus(); });
  $("ch-bulk-toggle").addEventListener("click", () => { $("ch-bulk").hidden = !$("ch-bulk").hidden; });
  $("ch-bulk-add").addEventListener("click", () => {
    const lines = $("ch-bulk-text").value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const added = lines.map((l) => { const [date = "", phase = "", titre = "", ...rest] = l.split("|").map((x) => x.trim()); return { date, phase, titre, texte: rest.join(" | "), pic: false }; }).filter((e) => e.date && e.titre);
    if (!added.length) return msg("Aucune ligne valide : le format est « date | phase | titre | description ».", "err");
    if (events.length === 1 && !events[0].date && !events[0].titre) events = [];
    events.push(...added); $("ch-bulk-text").value = ""; $("ch-bulk").hidden = true; renderRows();
    msg(added.length + " événement(s) ajouté(s). Vérifiez l'ordre avant de publier.", "ok");
  });

  function reset() {
    editing = null; events = [blankEvent()];
    ["ch-titre", "ch-resume", "ch-acteurs", "ch-auteur"].forEach((id) => ($(id).value = ""));
    $("ch-actif").checked = true; $("ch-head").textContent = "Nouvelle chronologie"; $("ch-cancel").hidden = true; $("ch-bulk").hidden = true; renderRows();
  }
  $("ch-cancel").addEventListener("click", () => { reset(); msg(""); });

  /* ---------- Publication ---------- */
  async function publish() {
    msg("");
    const m = readMeta();
    const evs = events.filter((e) => e.date.trim() || e.titre.trim() || e.texte.trim());
    if (!m.titre) return msg("Le titre est obligatoire.", "err");
    if (!evs.length) return msg("Ajoutez au moins un événement.", "err");
    const bad = evs.findIndex((e) => !e.date.trim() || !e.titre.trim());
    if (bad >= 0) return msg("L'événement n° " + (bad + 1) + " doit avoir une date et un titre.", "err");
    if (!A.loggedIn()) return msg("Connectez-vous d'abord.", "err");
    $("ch-publish").disabled = true;
    try {
      msg("Lecture du dépôt…");
      const list = await load();
      let id = editing ? editing.id : A.slugify(m.titre) || "chronologie";
      if (!editing) { const base = id; let n = 2; while (list.some((x) => x.id === id)) id = base + "-" + n++; }
      const entry = { id, ...m, maj: A.today(), actif: $("ch-actif").checked, evenements: evs.map((e) => ({ date: e.date.trim(), phase: e.phase.trim(), titre: e.titre.trim(), texte: e.texte.trim(), pic: !!e.pic })) };
      const i = list.findIndex((x) => x.id === id);
      if (i >= 0) list[i] = entry; else list.push(entry);
      await A.putFile("js/chronologies.js", A.enc(serialize(list)), (editing ? "Mise à jour de la chronologie : " : "Nouvelle chronologie : ") + m.titre);
      msg("Publié. La chronologie est visible sur le site dans 1 à 2 minutes (actualisez avec Ctrl + Maj + R).", "ok");
      reset(); refresh();
    } catch (e) { msg("Échec : " + e.message, "err"); }
    $("ch-publish").disabled = false;
  }
  $("ch-publish").addEventListener("click", publish);

  /* ---------- Liste des chronologies publiées ---------- */
  let current = [];
  async function refresh() {
    const ul = $("ch-list");
    try {
      current = await load();
      ul.innerHTML = current.map((c) => `<li><div><b>${esc(c.titre)}</b><small>${c.evenements.length} événement(s)${c.maj ? ", mise à jour le " + esc(fmtDate(c.maj)) : ""}${c.exemple ? " (exemple)" : ""}${c.actif === false ? " · MASQUÉE" : ""}</small></div><div><button data-id="${esc(c.id)}" data-a="toggle">${c.actif === false ? "Afficher" : "Masquer"}</button> <button data-id="${esc(c.id)}" data-a="edit">Modifier</button> <button class="del" data-id="${esc(c.id)}" data-a="del">Supprimer</button></div></li>`).join("") || "<li>Aucune chronologie publiée.</li>";
    } catch (e) { ul.innerHTML = "<li>Liste indisponible : " + esc(e.message) + "</li>"; }
  }
  $("ch-list").addEventListener("click", async (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const c = current.find((x) => x.id === b.dataset.id); if (!c) return;
    if (b.dataset.a === "toggle") {
      try {
        const list = await load(), x = list.find((y) => y.id === c.id); if (!x) return;
        x.actif = x.actif === false;
        await A.putFile("js/chronologies.js", A.enc(serialize(list)), (x.actif ? "Affichage" : "Masquage") + " de la chronologie : " + c.titre);
        msg("Chronologie " + (x.actif ? "affichée" : "masquée") + " (visible sur le site dans 1 à 2 minutes).", "ok"); refresh();
      } catch (err) { msg("Échec : " + err.message, "err"); }
      return;
    }
    if (b.dataset.a === "edit") {
      editing = c; $("ch-actif").checked = c.actif !== false;
      $("ch-titre").value = c.titre; $("ch-resume").value = c.resume || ""; $("ch-acteurs").value = (c.acteurs || []).join(", "); $("ch-auteur").value = c.auteur || "";
      events = c.evenements.map((x) => ({ date: x.date, phase: x.phase || "", titre: x.titre, texte: x.texte || "", pic: !!(x.pic || x.phase === "pic") }));
      $("ch-head").textContent = "Mettre à jour : " + c.titre; $("ch-cancel").hidden = false; renderRows();
      msg("Ajoutez ou modifiez des événements, puis cliquez sur « Publier la chronologie » : la date de mise à jour s'affichera sur le site.", "");
      $("ch-head").scrollIntoView({ behavior: "smooth" });
    } else if (confirm("Supprimer la chronologie « " + c.titre + " » du site ?")) {
      try {
        const list = (await load()).filter((x) => x.id !== c.id);
        await A.putFile("js/chronologies.js", A.enc(serialize(list)), "Suppression de la chronologie : " + c.titre);
        msg("Chronologie supprimée.", "ok"); refresh();
      } catch (err) { msg("Échec : " + err.message, "err"); }
    }
  });

  document.addEventListener("oracles:login", refresh);
  document.addEventListener("oracles:logout", () => { reset(); $("ch-list").innerHTML = ""; });
  renderRows();
  if (A.loggedIn()) refresh();
})();
