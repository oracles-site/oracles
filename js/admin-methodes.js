/* ORACLES — espace contributeur : onglet « Méthodes »
   Créer, mettre à jour, réordonner et supprimer des fiches explicatives de méthodes (js/methodes.js). */
(function () {
  const A = window.ORACLES_ADMIN, $ = (id) => document.getElementById(id);
  const { esc, fmtDate, methodeHTML } = window.ORACLES_UTIL;
  const msg = (t, k) => A.msg($("mt-msg"), t, k);
  const TEXTS = ["principe", "etapes", "donnees", "forces", "limites", "exemple", "lectures"];
  let editing = null;

  async function load() {
    const f = await A.api("GET", "js/methodes.js");
    if (!f) return [];
    const m = A.dec(f.content).match(/window\.METHODES\s*=\s*([\s\S]*?);\s*$/);
    if (!m) throw new Error("Format de js/methodes.js non reconnu.");
    return JSON.parse(m[1]);
  }
  const serialize = (list) => "/* Fichier géré par l'espace contributeur (onglet Méthodes).\n   Il peut aussi être modifié à la main : respectez le format JSON.\n   Les champs de texte acceptent le Markdown (listes avec -, gras avec **, italique avec *). */\nwindow.METHODES = " + JSON.stringify(list, null, 2) + ";\n";

  function readForm() {
    const m = { nom: $("mt-nom").value.trim(), niveau: +$("mt-niveau").value, resume: $("mt-resume").value.trim(), auteur: $("mt-auteur").value.trim() };
    TEXTS.forEach((k) => (m[k] = $("mt-" + k).value.trim()));
    return m;
  }
  function preview() {
    const m = readForm();
    const empty = !m.nom && !m.resume && !TEXTS.some((k) => m[k]);
    $("mt-preview").innerHTML = empty ? '<p class="muted">L\'aperçu de la fiche apparaîtra ici.</p>' : (m.nom ? `<h1 style="font-size:1.8rem">${esc(m.nom)}</h1>` : "") + methodeHTML(m);
  }
  ["mt-nom", "mt-niveau", "mt-resume", "mt-auteur", ...TEXTS.map((k) => "mt-" + k)].forEach((id) => { $(id).addEventListener("input", preview); $(id).addEventListener("change", preview); });

  function reset() {
    editing = null;
    ["mt-nom", "mt-resume", "mt-auteur", ...TEXTS.map((k) => "mt-" + k)].forEach((id) => ($(id).value = ""));
    $("mt-actif").checked = true; $("mt-niveau").value = "1"; $("mt-head").textContent = "Nouvelle fiche méthode"; $("mt-cancel").hidden = true; preview();
  }
  $("mt-cancel").addEventListener("click", () => { reset(); msg(""); });

  async function publish() {
    msg("");
    const m = readForm();
    if (!m.nom) return msg("Le nom de la méthode est obligatoire.", "err");
    if (!m.resume) return msg("Ajoutez la phrase « En bref ».", "err");
    if (!m.principe) return msg("Le champ « Le principe » est obligatoire : il constitue le cœur de la fiche.", "err");
    if (!A.loggedIn()) return msg("Connectez-vous d'abord.", "err");
    $("mt-publish").disabled = true;
    try {
      msg("Lecture du dépôt…");
      const list = await load();
      let id = editing ? editing.id : A.slugify(m.nom) || "methode";
      if (!editing) { const base = id; let n = 2; while (list.some((x) => x.id === id)) id = base + "-" + n++; }
      const entry = { id, ...m, maj: A.today(), actif: $("mt-actif").checked };
      const i = list.findIndex((x) => x.id === id);
      if (i >= 0) list[i] = entry; else list.push(entry);
      await A.putFile("js/methodes.js", A.enc(serialize(list)), (editing ? "Mise à jour de la fiche méthode : " : "Nouvelle fiche méthode : ") + m.nom);
      msg("Publié. La fiche est visible sur le site dans 1 à 2 minutes (actualisez avec Ctrl + Maj + R).", "ok");
      reset(); refresh();
    } catch (e) { msg("Échec : " + e.message, "err"); }
    $("mt-publish").disabled = false;
  }
  $("mt-publish").addEventListener("click", publish);

  let current = [];
  async function refresh() {
    const ul = $("mt-list");
    try {
      current = await load();
      ul.innerHTML = current.map((m, i) => `<li><div><b>${esc(m.nom)}</b><small>Niveau ${m.niveau}${m.maj ? ", mise à jour le " + esc(fmtDate(m.maj)) : ""}${m.actif === false ? " · MASQUÉE" : ""}</small></div><div><button data-id="${esc(m.id)}" data-a="toggle">${m.actif === false ? "Afficher" : "Masquer"}</button> <button data-id="${esc(m.id)}" data-a="up"${i === 0 ? " disabled" : ""} aria-label="Monter">↑</button> <button data-id="${esc(m.id)}" data-a="down"${i === current.length - 1 ? " disabled" : ""} aria-label="Descendre">↓</button> <button data-id="${esc(m.id)}" data-a="edit">Modifier</button> <button class="del" data-id="${esc(m.id)}" data-a="del">Supprimer</button></div></li>`).join("") || "<li>Aucune fiche publiée.</li>";
    } catch (e) { ul.innerHTML = "<li>Liste indisponible : " + esc(e.message) + "</li>"; }
  }
  $("mt-list").addEventListener("click", async (e) => {
    const b = e.target.closest("button"); if (!b || b.disabled) return;
    const m = current.find((x) => x.id === b.dataset.id); if (!m) return;
    const a = b.dataset.a;
    try {
      if (a === "toggle") {
        const list = await load(), x = list.find((y) => y.id === m.id); if (!x) return;
        x.actif = x.actif === false;
        await A.putFile("js/methodes.js", A.enc(serialize(list)), (x.actif ? "Affichage" : "Masquage") + " de la fiche méthode : " + m.nom);
        msg("Fiche " + (x.actif ? "affichée" : "masquée") + " (visible sur le site dans 1 à 2 minutes).", "ok"); refresh();
      } else if (a === "edit") {
        editing = m; $("mt-actif").checked = m.actif !== false;
        $("mt-nom").value = m.nom; $("mt-niveau").value = String(m.niveau || 1); $("mt-resume").value = m.resume || ""; $("mt-auteur").value = m.auteur || "";
        TEXTS.forEach((k) => ($("mt-" + k).value = m[k] || ""));
        $("mt-head").textContent = "Mettre à jour : " + m.nom; $("mt-cancel").hidden = false; preview();
        msg("Modifiez la fiche, puis cliquez sur « Publier la fiche ». La date de mise à jour s'affichera sur le site.", "");
        $("mt-head").scrollIntoView({ behavior: "smooth" });
      } else if (a === "up" || a === "down") {
        const list = await load(), i = list.findIndex((x) => x.id === m.id), j = a === "up" ? i - 1 : i + 1;
        if (i < 0 || j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
        await A.putFile("js/methodes.js", A.enc(serialize(list)), "Ordre des fiches méthodes");
        msg("Ordre modifié.", "ok"); refresh();
      } else if (a === "del" && confirm("Supprimer la fiche « " + m.nom + " » du site ?")) {
        const list = (await load()).filter((x) => x.id !== m.id);
        await A.putFile("js/methodes.js", A.enc(serialize(list)), "Suppression de la fiche méthode : " + m.nom);
        msg("Fiche supprimée.", "ok"); refresh();
      }
    } catch (err) { msg("Échec : " + err.message, "err"); }
  });

  document.addEventListener("oracles:login", refresh);
  document.addEventListener("oracles:logout", () => { reset(); $("mt-list").innerHTML = ""; });
  reset();
  if (A.loggedIn()) refresh();
})();
