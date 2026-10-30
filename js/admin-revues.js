/* ORACLES — espace contributeur : onglet « Revues d'actualité »
   Une revue est saisie sous forme structurée (période, éditorial, faits marquants par zone,
   « à suivre »), puis convertie automatiquement en page de lecture et ajoutée aux travaux. */
(function () {
  const A = window.ORACLES_ADMIN, $ = (id) => document.getElementById(id);
  const { esc, fmtDate } = window.ORACLES_UTIL;
  const Z = window.ZONES;
  const msg = (t, k) => A.msg($("rv-msg"), t, k);
  const zn = (z) => (z === "monde" ? "International (transversal)" : (Z[z] || {}).nom || z);
  const blankItem = () => ({ zone: "monde", titre: "", texte: "", sources: "" });
  let items = [blankItem()];
  let editing = null;      // revue en cours de modification (entrée de travaux.js)
  let titreAuto = true;    // le titre suit la période tant qu'il n'a pas été modifié à la main

  /* ---------- Dates ---------- */
  const parse = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function isoWeek(d) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
    return Math.ceil(((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7);
  }
  function periodeLabel(debut, fin) {
    if (!debut) return "";
    if (!fin || fin === debut) return "le " + fmtDate(debut);
    const a = parse(debut), b = parse(fin);
    return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear() ? `du ${a.getDate()} au ${fmtDate(fin)}` : `du ${fmtDate(debut)} au ${fmtDate(fin)}`;
  }
  function defaultTitle() {
    const d = $("rv-debut").value;
    return d ? "Revue de l'actualité internationale, semaine " + isoWeek(parse(d)) : "";
  }

  /* ---------- Génération de la page ---------- */
  const md = (s) => window.marked.parse(s || "", { breaks: false });
  function revueHTML(r) {
    let h = "";
    const p = periodeLabel(r.debut, r.fin);
    if (p) h += `<p class="periode">Période couverte : ${esc(p)}.</p>`;
    if (r.intro && r.intro.trim()) h += md(r.intro);
    const order = ["monde", ...Object.keys(Z)];
    order.forEach((z) => {
      const its = r.items.filter((x) => x.zone === z && (x.titre.trim() || x.texte.trim()));
      if (!its.length) return;
      h += `<h2>${esc(zn(z))}</h2>`;
      its.forEach((x) => {
        if (x.titre.trim()) h += `<h3>${esc(x.titre.trim())}</h3>`;
        h += md(x.texte);
        if (x.sources.trim()) h += `<p class="sources">Sources : ${window.marked.parseInline(x.sources.trim())}</p>`;
      });
    });
    if (r.suivre && r.suivre.trim()) h += `<h2>À suivre</h2>` + md(r.suivre);
    return A.clean(h);
  }
    function readForm() {
    return { debut: $("rv-debut").value, fin: $("rv-fin").value, intro: $("rv-intro").value, items, suivre: $("rv-suivre").value };
  }
  function preview() {
    const r = readForm();
    const empty = !r.intro.trim() && !r.suivre.trim() && !items.some((x) => x.titre.trim() || x.texte.trim());
    $("rv-preview").innerHTML = empty ? '<p class="muted">L\'aperçu de la revue apparaîtra ici.</p>' : revueHTML(r);
  }

  /* ---------- Faits marquants ---------- */
  function renderItems() {
    const opts = (sel) => ['monde', ...Object.keys(Z)].map((k) => `<option value="${k}"${k === sel ? " selected" : ""}>${esc(zn(k))}</option>`).join("");
    $("rv-items").innerHTML = items.map((it, i) => `
      <div class="rowcard" data-i="${i}">
        <div class="row">
          <div><label for="it-z-${i}">Zone</label><select id="it-z-${i}" data-f="zone">${opts(it.zone)}</select></div>
          <div><label for="it-t-${i}">Titre</label><input type="text" id="it-t-${i}" data-f="titre" value="${esc(it.titre)}"></div>
        </div>
        <label for="it-x-${i}">Analyse (Markdown accepté)</label>
        <textarea id="it-x-${i}" data-f="texte" style="min-height:6rem;font-family:inherit">${esc(it.texte)}</textarea>
        <label for="it-s-${i}">Sources</label>
        <input type="text" id="it-s-${i}" data-f="sources" value="${esc(it.sources)}" placeholder="ex. Le Monde, 8 oct. ; communiqué du ministère">
        <div class="rowtools">
          <button type="button" class="mini" data-a="up"${i === 0 ? " disabled" : ""}>↑ Monter</button>
          <button type="button" class="mini" data-a="down"${i === items.length - 1 ? " disabled" : ""}>↓ Descendre</button>
          <button type="button" class="mini del" data-a="rm">Supprimer</button>
        </div>
      </div>`).join("");
    preview();
  }
  $("rv-items").addEventListener("input", (e) => { const row = e.target.closest(".rowcard"), f = e.target.dataset.f; if (row && f) { items[+row.dataset.i][f] = e.target.value; preview(); } });
  $("rv-items").addEventListener("change", (e) => { const row = e.target.closest(".rowcard"), f = e.target.dataset.f; if (row && f) { items[+row.dataset.i][f] = e.target.value; preview(); } });
  $("rv-items").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-a]"); if (!b) return;
    const i = +b.closest(".rowcard").dataset.i;
    if (b.dataset.a === "up" && i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
    if (b.dataset.a === "down" && i < items.length - 1) [items[i + 1], items[i]] = [items[i], items[i + 1]];
    if (b.dataset.a === "rm") { items.splice(i, 1); if (!items.length) items.push(blankItem()); }
    renderItems();
  });
  $("rv-add").addEventListener("click", () => { items.push(blankItem()); renderItems(); const l = $("rv-items").querySelector(".rowcard:last-child select"); if (l) l.focus(); });

  /* ---------- Période et titre ---------- */
  $("rv-debut").addEventListener("change", () => {
    const d = $("rv-debut").value; if (!d) return;
    if (!$("rv-fin").value || $("rv-fin").value < d) { const e = parse(d); e.setDate(e.getDate() + 6); $("rv-fin").value = iso(e); }
    if (titreAuto) $("rv-titre").value = defaultTitle();
    preview();
  });
  $("rv-fin").addEventListener("change", preview);
  $("rv-titre").addEventListener("input", () => { titreAuto = false; });
  ["rv-intro", "rv-suivre"].forEach((id) => $(id).addEventListener("input", preview));

  function reset() {
    editing = null; titreAuto = true; items = [blankItem()]; $("rv-actif").checked = true;
    const t = new Date(), mon = new Date(t.getFullYear(), t.getMonth(), t.getDate() - ((t.getDay() || 7) - 1)), sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    $("rv-debut").value = iso(mon); $("rv-fin").value = iso(sun); $("rv-date").value = A.today();
    $("rv-titre").value = defaultTitle(); $("rv-auteur").value = "Équipe ORACLES"; $("rv-intro").value = ""; $("rv-suivre").value = "";
    $("rv-head").textContent = "Nouvelle revue d'actualité"; $("rv-cancel").hidden = true; renderItems();
  }
  $("rv-cancel").addEventListener("click", () => { reset(); msg(""); });

  /* ---------- Publication ---------- */
  async function publish() {
    msg("");
    const r = readForm(), titre = $("rv-titre").value.trim(), auteur = $("rv-auteur").value.trim(), date = $("rv-date").value || A.today();
    const its = items.filter((x) => x.titre.trim() || x.texte.trim());
    if (!titre || !auteur) return msg("Le titre et l'auteur sont obligatoires.", "err");
    if (!r.debut || !r.fin) return msg("Indiquez la période couverte (début et fin).", "err");
    if (r.fin < r.debut) return msg("La fin de la période doit suivre son début.", "err");
    if (!its.length) return msg("Ajoutez au moins un fait marquant.", "err");
    if (its.some((x) => !x.titre.trim() || !x.texte.trim())) return msg("Chaque fait marquant doit avoir un titre et une analyse.", "err");
    if (!A.loggedIn()) return msg("Connectez-vous d'abord.", "err");
    $("rv-publish").disabled = true;
    try {
      msg("Lecture du dépôt…");
      const works = await A.loadWorks();
      const data = { ...r, items: its.map((x) => ({ ...x, titre: x.titre.trim(), texte: x.texte.trim(), sources: x.sources.trim() })) };
      const html = revueHTML(data);
      let slug = editing && editing.slug ? editing.slug : "";
      if (!slug) { const base = date + "-revue-semaine-" + isoWeek(parse(r.debut)); slug = base; let n = 2; while (works.some((w) => w.slug === slug)) slug = base + "-" + n++; }
      let resume = "Au sommaire : " + data.items.map((x) => x.titre).join(" ; ");
      if (resume.length > 280) resume = resume.slice(0, 280).replace(/\s\S*$/, "") + "…";
      msg("Publication de la page…");
      await A.putFile(`textes/${slug}.js`, A.enc(A.textFile(slug, html)), "Revue : " + titre);
      const entry = { slug, type: "revue", titre, auteur, date, zone: "monde", theme: "Actualité", resume, url: "", actif: $("rv-actif").checked, revue: data };
      const fresh = await A.loadWorks();
      const key = (w) => w.slug || w.titre + "|" + w.date;
      const i = editing ? fresh.findIndex((w) => key(w) === key(editing) || w.slug === slug) : fresh.findIndex((w) => w.slug === slug);
      if (i >= 0) fresh[i] = entry; else fresh.push(entry);
      await A.putFile("js/travaux.js", A.enc(A.serialize(fresh)), (editing ? "Mise à jour de la revue : " : "Nouvelle revue : ") + titre);
      msg("Publié. La revue apparaît dans « Articles » dans 1 à 2 minutes (actualisez avec Ctrl + Maj + R).", "ok");
      reset(); refresh(); A.changed();
    } catch (e) { msg("Échec : " + e.message, "err"); }
    $("rv-publish").disabled = false;
  }
  $("rv-publish").addEventListener("click", publish);

  /* ---------- Liste et modification ---------- */
  let current = [];
  const key = (w) => w.slug || w.titre + "|" + w.date;
  async function refresh() {
    const ul = $("rv-list");
    try {
      current = (await A.loadWorks()).filter((w) => w.type === "revue").sort((a, b) => b.date.localeCompare(a.date));
      ul.innerHTML = current.map((w) => `<li><div><b>${esc(w.titre)}</b><small>${esc(fmtDate(w.date))}${w.exemple ? " (exemple)" : ""}${w.actif === false ? " · MASQUÉE" : ""}</small></div><div><button data-k="${esc(key(w))}" data-a="toggle">${w.actif === false ? "Afficher" : "Masquer"}</button> <button data-k="${esc(key(w))}" data-a="edit">Modifier</button> <button class="del" data-k="${esc(key(w))}" data-a="del">Retirer</button></div></li>`).join("") || "<li>Aucune revue publiée.</li>";
    } catch (e) { ul.innerHTML = "<li>Liste indisponible : " + esc(e.message) + "</li>"; }
  }
  function load(w) {
    editing = w; titreAuto = false; $("rv-actif").checked = w.actif !== false;
    const r = w.revue;
    $("rv-titre").value = w.titre; $("rv-auteur").value = w.auteur; $("rv-date").value = w.date;
    $("rv-debut").value = r ? r.debut : w.date; $("rv-fin").value = r ? r.fin : w.date;
    $("rv-intro").value = r ? r.intro || "" : ""; $("rv-suivre").value = r ? r.suivre || "" : "";
    items = r && r.items && r.items.length ? r.items.map((x) => ({ ...x })) : [blankItem()];
    $("rv-head").textContent = "Mettre à jour : " + w.titre; $("rv-cancel").hidden = false; renderItems();
    msg(r ? "Modifiez la revue, puis republiez-la." : "Cette revue n'a pas été créée avec cet éditeur : son texte actuel sera remplacé par ce que vous saisissez ici.", r ? "" : "err");
    A.activateTab("revues"); $("rv-head").scrollIntoView({ behavior: "smooth" });
  }
  $("rv-list").addEventListener("click", async (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const w = current.find((x) => key(x) === b.dataset.k); if (!w) return;
    if (b.dataset.a === "toggle") {
      try {
        const fresh = await A.loadWorks(), x = fresh.find((y) => key(y) === key(w)); if (!x) return;
        x.actif = x.actif === false;
        await A.putFile("js/travaux.js", A.enc(A.serialize(fresh)), (x.actif ? "Affichage de la revue : " : "Masquage de la revue : ") + w.titre);
        msg("Revue " + (x.actif ? "affichée" : "masquée") + " (visible sur le site dans 1 à 2 minutes).", "ok"); refresh(); A.changed();
      } catch (err) { msg("Échec : " + err.message, "err"); }
      return;
    }
    if (b.dataset.a === "edit") return load(w);
    if (!confirm("Retirer « " + w.titre + " » du site ?")) return;
    try {
      const fresh = (await A.loadWorks()).filter((x) => key(x) !== key(w));
      await A.putFile("js/travaux.js", A.enc(A.serialize(fresh)), "Retrait de la revue : " + w.titre);
      if (w.slug) { const f = await A.api("GET", `textes/${w.slug}.js`); if (f) await A.api("DELETE", `textes/${w.slug}.js`, { message: "Suppression du texte : " + w.slug, sha: f.sha, branch: A.cfg.branch }); }
      msg("Revue retirée du site.", "ok"); refresh(); A.changed();
    } catch (err) { msg("Échec : " + err.message, "err"); }
  });
  document.addEventListener("oracles:edit-revue", (e) => load(e.detail));
  document.addEventListener("oracles:data-changed", () => { if (A.loggedIn()) refresh(); });
  document.addEventListener("oracles:login", refresh);
  document.addEventListener("oracles:logout", () => { reset(); $("rv-list").innerHTML = ""; });
  reset();
  if (A.loggedIn()) refresh();
})();
