/* ORACLES — espace d'administration
   Fonctionne sans serveur : les fichiers du site sont modifiés directement dans le
   dépôt GitHub via l'API officielle, avec un jeton personnel saisi par l'utilisateur. */
(function () {
  const $ = (id) => document.getElementById(id);
  const { esc, zoneNom, fmtDate } = window.ORACLES_UTIL;
  const KEY = "oracles-admin";
  const clean = (html) => window.DOMPurify.sanitize(html, { FORBID_TAGS: ["img", "style", "form", "iframe", "script"], FORBID_ATTR: ["style"] });

  /* ---------- Connexion (vérifiée par GitHub) ---------- */
  let cfg = { user: "", repo: "", branch: "main", token: "" };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || "{}"); } catch (e) {}
  function guessRepo() {
    if (window.SITE.depot) return window.SITE.depot;
    const h = location.hostname;
    if (h.endsWith(".github.io")) {
      const o = h.split(".")[0], seg = location.pathname.split("/")[1] || "";
      return o + "/" + (seg && !/\.html$/.test(seg) ? seg : o + ".github.io");
    }
    return "";
  }
  $("c-user").value = saved.user || ""; $("c-repo").value = saved.repo || guessRepo(); $("c-branch").value = saved.branch || "main";
  $("c-remember").checked = !!localStorage.getItem(KEY);

  function msg(el, text, kind) { el.className = "adm-msg " + (kind || ""); el.textContent = text; el.hidden = !text; }
  function readCfg() {} // la configuration est fixée à la connexion
  function persist() {
    try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); ($("c-remember").checked ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(cfg)); } catch (e) {}
  }
  function showApp(on) {
    $("adm-login").hidden = on; $("adm-app").hidden = !on;
    if (on) { $("adm-user").textContent = "Connecté en tant que " + cfg.user + " · dépôt " + cfg.repo; refreshList(); }
    document.dispatchEvent(new Event(on ? "oracles:login" : "oracles:logout"));
  }
  async function verify(c) {
    const h = { Authorization: "Bearer " + c.token, Accept: "application/vnd.github+json" };
    const ru = await fetch("https://api.github.com/user", { headers: h });
    if (ru.status === 401) throw new Error("jeton invalide ou expiré.");
    if (!ru.ok) throw new Error("GitHub est inaccessible (" + ru.status + ").");
    const u = await ru.json();
    if (c.user && u.login.toLowerCase() !== c.user.toLowerCase()) throw new Error("cet identifiant ne correspond pas à ce jeton.");
    if (!c.repo) throw new Error("dépôt non précisé (ouvrez « Options avancées »).");
    const rr = await fetch("https://api.github.com/repos/" + c.repo, { headers: h });
    if (!rr.ok) throw new Error("dépôt introuvable ou non accessible avec ce jeton.");
    const r = await rr.json();
    if (r.permissions && !r.permissions.push) throw new Error("ce compte n'a pas le droit de publier sur ce dépôt.");
    return u.login;
  }
  $("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const c = { user: $("c-user").value.trim().replace(/^@/, ""), token: $("c-token").value.trim(), repo: $("c-repo").value.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, ""), branch: $("c-branch").value.trim() || "main" };
    $("c-login").disabled = true; msg($("c-msg"), "Vérification auprès de GitHub…");
    try { c.user = await verify(c); cfg = c; persist(); $("c-token").value = ""; msg($("c-msg"), ""); showApp(true); }
    catch (err) { msg($("c-msg"), "Connexion refusée : " + err.message, "err"); }
    $("c-login").disabled = false;
  });
  $("c-logout").addEventListener("click", () => {
    try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
    cfg = { user: "", repo: cfg.repo, branch: cfg.branch, token: "" };
    resetForm(); showApp(false); msg($("c-msg"), "Vous êtes déconnecté.", "ok");
  });

  /* ---------- API GitHub ---------- */
  const b64 = (bytes) => { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); };
  const enc = (str) => b64(new TextEncoder().encode(str));
  const dec = (c) => new TextDecoder().decode(Uint8Array.from(atob(c.replace(/\s/g, "")), (ch) => ch.charCodeAt(0)));
  async function api(method, path, body) {
    const url = `https://api.github.com/repos/${cfg.repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}` + (method === "GET" ? `?ref=${encodeURIComponent(cfg.branch)}` : "");
    const r = await fetch(url, { method, headers: { Authorization: "Bearer " + cfg.token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 404 && method === "GET") return null;
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      const hint = r.status === 401 ? " (jeton invalide ou expiré)" : r.status === 403 || r.status === 404 ? " (droits insuffisants : le jeton doit autoriser « Contents : lecture et écriture » sur ce dépôt)" : "";
      throw new Error(`GitHub ${r.status} : ${j.message || ""}${hint}`);
    }
    return r.json();
  }
  async function putFile(path, contentB64, message) {
    const cur = await api("GET", path);
    return api("PUT", path, { message, content: contentB64, branch: cfg.branch, ...(cur ? { sha: cur.sha } : {}) });
  }
  async function loadWorks() {
    const f = await api("GET", "js/travaux.js");
    if (!f) throw new Error("Fichier js/travaux.js introuvable dans le dépôt.");
    const m = dec(f.content).match(/window\.WORKS\s*=\s*([\s\S]*?);\s*$/);
    if (!m) throw new Error("Format de js/travaux.js non reconnu.");
    return JSON.parse(m[1]);
  }
  const serialize = (works) => "/* Fichier géré par l'espace d'administration (admin.html).\n   Il peut aussi être modifié à la main : respectez le format JSON. */\nwindow.WORKS = " + JSON.stringify(works, null, 2) + ";\n";
  const textFile = (slug, html) => `window.ORACLES_TEXTES = window.ORACLES_TEXTES || {};\nwindow.ORACLES_TEXTES[${JSON.stringify(slug)}] = ${JSON.stringify({ html })};\n`;

  /* ---------- Formulaire ---------- */
  $("f-type").innerHTML = Object.entries(window.TYPES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join("");
  $("f-zone").innerHTML = '<option value="monde">Monde (transversal)</option>' + Object.entries(window.ZONES).map(([k, z]) => `<option value="${k}">${esc(z.nom)}</option>`).join("");
  const today = () => new Date().toISOString().slice(0, 10);
  $("f-date").value = today();
  let editing = null; // travail en cours de modification

  const slugify = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "");
  /* Outils partagés avec les onglets « Revues » et « Chronologies » */
  const TABS = ["travaux", "revues", "chronologies", "methodes"];
  function activateTab(name) {
    if (!TABS.includes(name)) name = "travaux";
    TABS.forEach((t) => { $("tab-" + t).hidden = t !== name; document.querySelector('[data-tab="' + t + '"]').setAttribute("aria-selected", t === name); });
    if (history.replaceState) history.replaceState(null, "", "#" + name);
  }
  window.ORACLES_ADMIN = { get cfg() { return cfg; }, loggedIn: () => !!cfg.token, api, putFile, loadWorks, serialize, textFile, enc, dec, clean, slugify, msg, today, activateTab, changed: () => document.dispatchEvent(new Event("oracles:data-changed")) };
  document.querySelector(".adm-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) activateTab(b.dataset.tab); });
  document.addEventListener("oracles:data-changed", () => refreshList());

  let html = ""; // texte converti et nettoyé

  function toHTML(src) { return clean(window.marked.parse(src, { breaks: false })); }
  function extractTitle(h) {
    const d = document.createElement("div"); d.innerHTML = h;
    const t = d.querySelector("h1");
    if (!t) return { title: "", html: h };
    const title = t.textContent.trim(); t.remove();
    return { title, html: d.innerHTML };
  }
  function update() {
    const src = $("f-text").value;
    html = src.trim() ? toHTML(src) : "";
    const ex = extractTitle(html);
    if (ex.title) { if (!$("f-titre").value.trim()) $("f-titre").value = ex.title; html = ex.html; }
    $("preview").innerHTML = html || '<p class="muted">L\'aperçu du texte apparaîtra ici.</p>';
    $("preview").classList.add("article");
  }
  $("f-text").addEventListener("input", update);

  $("f-file").addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      if (/\.docx$/i.test(f.name)) {
        const res = await window.mammoth.convertToHtml({ arrayBuffer: await f.arrayBuffer() });
        $("f-text").value = clean(res.value);
        msg($("f-msg"), "Document Word converti. Les images ne sont pas reprises : relisez l'aperçu." + (res.messages.length ? "\n" + res.messages.slice(0, 3).map((m) => m.message).join("\n") : ""), "ok");
      } else {
        $("f-text").value = await f.text();
        msg($("f-msg"), "Fichier importé.", "ok");
      }
      update();
    } catch (err) { msg($("f-msg"), "Import impossible : " + err.message, "err"); }
  });

  const plain = (h) => { const d = document.createElement("div"); d.innerHTML = h; return [...d.querySelectorAll("p")].map((p) => p.textContent.trim()).filter(Boolean).join(" ").replace(/\s+/g, " "); };
  function collect() {
    const titre = $("f-titre").value.trim(), auteur = $("f-auteur").value.trim();
    if (!titre || !auteur) throw new Error("Le titre et l'auteur sont obligatoires.");
    if (!html && !$("f-url").value.trim() && !$("f-pdf").files[0] && !(editing && (editing.slug || editing.url))) throw new Error("Ajoutez un texte, un PDF ou un lien externe.");
    let resume = $("f-resume").value.trim();
    if (!resume && html) { const p = plain(html); resume = p.length > 280 ? p.slice(0, 280).replace(/\s\S*$/, "") + "…" : p; }
    const w = { slug: editing ? editing.slug || "" : "", type: $("f-type").value, titre, auteur, date: $("f-date").value || today(), zone: $("f-zone").value, theme: $("f-theme").value.trim(), resume, url: $("f-url").value.trim(), actif: $("f-actif").checked };
    return w;
  }
  const keyOf = (w) => w.slug || w.titre + "|" + w.date;

  async function publish() {
    const out = $("f-msg"); msg(out, "");
    let w;
    try { w = collect(); readCfg(); if (!cfg.repo || !cfg.token) throw new Error("Renseignez d'abord la connexion GitHub (dépôt et jeton), ou utilisez le mode manuel."); } catch (e) { return msg(out, e.message, "err"); }
    $("f-publish").disabled = true;
    try {
      msg(out, "Lecture du dépôt…");
      const works = await loadWorks();
      const pdf = $("f-pdf").files[0];
      if (html || pdf) {
        if (!w.slug) { const base = w.date + "-" + (slugify(w.titre) || "travail"); let s = base, n = 2; while (works.some((x) => x.slug === s)) s = base + "-" + n++; w.slug = s; }
      }
      if (html) { msg(out, "Publication du texte…"); await putFile(`textes/${w.slug}.js`, enc(textFile(w.slug, html)), `Texte : ${w.titre}`); }
      if (pdf) { msg(out, "Envoi du PDF…"); await putFile(`travaux/${w.slug}.pdf`, b64(new Uint8Array(await pdf.arrayBuffer())), `PDF : ${w.titre}`); w.pdf = `travaux/${w.slug}.pdf`; }
      else if (editing && editing.pdf) w.pdf = editing.pdf;
      if (!html && editing && editing.slug) w.slug = editing.slug;
      if (!html && !editing?.slug) w.slug = "";
      if (!html && pdf && !w.url) w.url = w.pdf;
      msg(out, "Mise à jour de la liste des travaux…");
      const fresh = await loadWorks();
      const i = editing ? fresh.findIndex((x) => keyOf(x) === keyOf(editing)) : -1;
      if (i >= 0) fresh[i] = w; else fresh.push(w);
      await putFile("js/travaux.js", enc(serialize(fresh)), `${editing ? "Modification" : "Ajout"} : ${w.titre}`);
      msg(out, "Publié. Le site se met à jour sur GitHub Pages dans 1 à 2 minutes (actualisez avec Ctrl + Maj + R).", "ok");
      resetForm(); refreshList();
    } catch (e) { msg(out, "Échec : " + e.message, "err"); }
    $("f-publish").disabled = false;
  }
  $("f-publish").addEventListener("click", publish);

  /* Mode manuel : fichiers à déposer soi-même */
  $("f-manual").addEventListener("click", () => {
    const out = $("manual"); out.innerHTML = "";
    try {
      const w = collect();
      if (html) w.slug = w.date + "-" + (slugify(w.titre) || "travail");
      const entry = JSON.stringify(w, null, 2);
      out.innerHTML = `<h3>1. Ajouter dans js/travaux.js</h3><p class="hint">Collez ce bloc dans la liste, entre deux crochets, avec une virgule après le bloc précédent.</p><textarea readonly style="min-height:11rem">${esc(entry)}</textarea>` +
        (html ? `<h3>2. Déposer le texte</h3><p class="hint">Téléchargez ce fichier et déposez-le dans le dossier <b>textes</b> du dépôt.</p><button class="btn" id="dl" type="button">Télécharger ${esc(w.slug)}.js</button>` : "");
      if (html) $("dl").addEventListener("click", () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([textFile(w.slug, html)], { type: "text/javascript" })); a.download = w.slug + ".js"; a.click(); });
    } catch (e) { msg($("f-msg"), e.message, "err"); }
  });

  function resetForm() {
    editing = null;
    ["f-titre", "f-auteur", "f-theme", "f-resume", "f-url", "f-text"].forEach((i) => ($(i).value = ""));
    $("f-file").value = ""; $("f-pdf").value = ""; $("f-date").value = today(); $("manual").innerHTML = "";
    $("f-actif").checked = true; $("f-head").textContent = "Nouveau travail"; $("f-cancel").hidden = true; update();
  }
  $("f-cancel").addEventListener("click", resetForm);

  /* ---------- Liste des travaux publiés ---------- */
  let current = [];
  async function refreshList() {
    const ul = $("list");
    readCfg();
    try {
      current = cfg.repo && cfg.token ? await loadWorks() : window.WORKS;
      ul.innerHTML = [...current].sort((a, b) => b.date.localeCompare(a.date)).map((w) => `<li><div><b>${esc(w.titre)}</b><small>${esc(window.TYPES[w.type])}, ${esc(zoneNom(w.zone))}, ${esc(fmtDate(w.date))}${w.exemple ? " (exemple)" : ""}${w.actif === false ? " · MASQUÉ" : ""}</small></div><div><button data-k="${esc(keyOf(w))}" data-a="toggle">${w.actif === false ? "Afficher" : "Masquer"}</button> <button data-k="${esc(keyOf(w))}" data-a="edit">Modifier</button> <button class="del" data-k="${esc(keyOf(w))}" data-a="del">Retirer</button></div></li>`).join("") || "<li>Aucun travail.</li>";
    } catch (e) { ul.innerHTML = `<li>Liste indisponible : ${esc(e.message)}</li>`; }
  }
  $("list").addEventListener("click", async (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const w = current.find((x) => keyOf(x) === b.dataset.k); if (!w) return;
    if (b.dataset.a === "toggle") {
      readCfg();
      try {
        if (!cfg.token) throw new Error("Connexion GitHub requise.");
        const fresh = await loadWorks(), x = fresh.find((y) => keyOf(y) === keyOf(w)); if (!x) return;
        x.actif = x.actif === false;
        await putFile("js/travaux.js", enc(serialize(fresh)), (x.actif ? "Affichage : " : "Masquage : ") + w.titre);
        msg($("f-msg"), "Travail " + (x.actif ? "affiché" : "masqué") + " (visible sur le site dans 1 à 2 minutes).", "ok");
        document.dispatchEvent(new Event("oracles:data-changed"));
      } catch (err) { msg($("f-msg"), "Échec : " + err.message, "err"); }
      return;
    }
    if (b.dataset.a === "edit" && w.revue) { activateTab("revues"); document.dispatchEvent(new CustomEvent("oracles:edit-revue", { detail: w })); return; }
    if (b.dataset.a === "edit") {
      editing = w; $("f-actif").checked = w.actif !== false; $("f-type").value = w.type; $("f-titre").value = w.titre; $("f-auteur").value = w.auteur; $("f-date").value = w.date; $("f-zone").value = w.zone;
      $("f-theme").value = w.theme || ""; $("f-resume").value = w.resume || ""; $("f-url").value = w.url || ""; $("f-text").value = ""; update();
      $("f-head").textContent = "Modifier : " + w.titre; $("f-cancel").hidden = false;
      msg($("f-msg"), "Laissez le champ « Texte » vide pour conserver le texte actuel.", "");
      $("f-head").scrollIntoView({ behavior: "smooth" });
    } else if (confirm(`Retirer « ${w.titre} » du site ?`)) {
      readCfg();
      try {
        if (!cfg.token) throw new Error("Connexion GitHub requise.");
        const fresh = await loadWorks();
        await putFile("js/travaux.js", enc(serialize(fresh.filter((x) => keyOf(x) !== keyOf(w)))), `Retrait : ${w.titre}`);
        for (const p of [w.slug && `textes/${w.slug}.js`, w.pdf]) { if (!p) continue; const f = await api("GET", p); if (f) await api("DELETE", p, { message: `Suppression : ${p}`, sha: f.sha, branch: cfg.branch }); }
        msg($("f-msg"), "Travail retiré du site.", "ok"); refreshList();
      } catch (err) { msg($("f-msg"), "Échec : " + err.message, "err"); }
    }
  });

  { const h = location.hash.slice(1); if (TABS.includes(h)) activateTab(h); }
  update();
  (async function autoLogin() {
    if (!saved.token) return;
    try { saved.user = await verify(saved); cfg = saved; showApp(true); }
    catch (e) { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); } catch (_) {} msg($("c-msg"), "Session expirée : reconnectez-vous.", "err"); }
  })();
})();
