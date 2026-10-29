/* ORACLES — script commun (en-tête, pied de page, listes de travaux, etc.) */
(function () {
  const S = window.SITE, Z = window.ZONES, T = window.TYPES;
  // Les travaux marqués « actif: false » ne sont pas affichés sur le site (ils restent gérables dans l'espace contributeur).
  window.WORKS = (window.WORKS || []).filter((w) => w.actif !== false);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const zoneNom = (z) => (z === "monde" ? "Monde" : (Z[z] || {}).nom || z);
  const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  window.ORACLES_UTIL = { esc, zoneNom, fmtDate };

  /* ---------- Navigation ---------- */
  const NAV = [
    ["articles", "Articles", "articles.html"],
    ["chronologies", "Chronologie des crises", "chronologies.html"],
    ["methodes", "Méthodes", "methodes.html"],
    ["carte", "État de la littérature", "carte.html"],
    ["reseaux", "Nos réseaux", "reseaux.html"],
    ["equipe", "Notre équipe", "equipe.html"],
    ["partenaires", "Nos partenaires", "partenaires.html"],
    ["contributeur", "Contributeur", "admin.html"]
  ];
  const page = document.body.dataset.page || "";

  const header = document.getElementById("site-header");
  if (header) {
    header.outerHTML = `
    <a class="skip" href="#contenu">Aller au contenu</a>
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="index.html" aria-label="ORACLES, retour à l'accueil">
          <img src="assets/logo-oeil.png" alt="" width="84" height="40">
          <span class="brand-text"><strong>ORACLES</strong><span>Observatoire associatif de recherche académique pour les études stratégiques</span></span>
        </a>
        <div class="menu">
          <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu <svg class="chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.500l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.700"/></svg></button>
          <nav class="nav" id="nav" aria-label="Navigation principale" hidden>
            ${NAV.map(([id, label, href]) => `<a href="${href}"${id === "contributeur" ? ' class="nav-contrib"' : ""}${id === page ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
          </nav>
        </div>
      </div>
    </header>`;
    const btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
    const setOpen = (open) => { nav.hidden = !open; btn.setAttribute("aria-expanded", open); };
    btn.addEventListener("click", () => setOpen(nav.hidden));
    document.addEventListener("click", (e) => { if (!e.target.closest(".menu")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !nav.hidden) { setOpen(false); btn.focus(); } });
  }

  /* ---------- Pied de page ---------- */
  const ICON = {
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.700V21h-4z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.3 5.8a1.1 1.1 0 1 1 0 2.200 1.1 1.1 0 0 1 0-2.200z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 3h3.100l-6.800 7.700L22 21h-6.200l-4.900-6.300L5.300 21H2.200l7.200-8.300L1.800 3h6.400l4.400 5.800zm-1.100 16.200h1.700L7.200 4.700H5.400z"/></svg>'
  };
  const reseau = (id, label) => {
    const url = S.reseaux[id];
    return url
      ? `<li><a href="${esc(url)}" rel="noopener" target="_blank">${ICON[id]}${label}</a></li>`
      : `<li><span style="display:inline-flex;align-items:center;gap:.6rem;opacity:.85">${ICON[id]}${label} <span class="soon">bientôt</span></span></li>`;
  };
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.outerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="foot-brand">
          <strong>ORACLES</strong>
          <p>${esc(S.nomLong)}.</p>
          <p>${esc(S.slogan)}.</p>
        </div>
        <div>
          <h2>Explorer</h2>
          <ul>${NAV.map(([, label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}<li><a href="a-propos.html">À propos</a></li></ul>
        </div>
        <div class="social">
          <h2>Nous suivre</h2>
          <ul>${reseau("linkedin", "LinkedIn")}${reseau("instagram", "Instagram")}${reseau("x", "X")}</ul>
          <p style="margin-top:1rem"><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></p>
        </div>
      </div>
      <div class="legal"><div class="wrap">
        <span>Association déclarée, identifiant RNA : ${esc(S.rna)}</span>
        <span><a href="mentions-legales.html">Mentions légales</a> &nbsp; © ${new Date().getFullYear()} ORACLES</span>
      </div></div>
    </footer>`;
  }

  /* ---------- Liste de travaux ---------- */
  function workHTML(w) {
    return `<li class="work">
      <div class="work-meta"><b>${esc(T[w.type])}</b>${esc(fmtDate(w.date))}</div>
      <div>
        <h3><a href="${esc(w.url || (w.slug ? "texte.html?id=" + encodeURIComponent(w.slug) : "#"))}">${esc(w.titre)}</a></h3>
        <p class="who">${esc(w.auteur)}</p>
        <p class="sum">${esc(w.resume)}</p>
        <span class="tag">${esc(zoneNom(w.zone))}</span>${w.theme ? `<span class="tag">${esc(w.theme)}</span>` : ""}${w.exemple ? '<span class="tag tag--ex">Exemple</span>' : ""}
      </div></li>`;
  }
  window.ORACLES_UTIL.workHTML = workHTML;
  const sorted = () => [...window.WORKS].sort((a, b) => b.date.localeCompare(a.date));

  /* Dernières publications (accueil) */
  const latest = document.getElementById("latest");
  if (latest) latest.innerHTML = sorted().slice(0, 4).map(workHTML).join("") || '<li class="empty">Les premières publications seront mises en ligne prochainement.</li>';

  /* Page de liste filtrable : <ul id="works" data-types="article,fiche-lecture"> */
  const list = document.getElementById("works");
  if (list) {
    const types = (list.dataset.types || "").split(",").filter(Boolean);
    const base = sorted().filter((w) => !types.length || types.includes(w.type));
    if (!base.length) { const f = document.querySelector(".filters"); if (f) f.hidden = true; }
    const q = document.getElementById("q"), zsel = document.getElementById("zone"), tsel = document.getElementById("type");
    if (tsel) tsel.innerHTML = '<option value="">Tous les formats</option>' + types.map((t) => `<option value="${t}">${esc(T[t])}</option>`).join("");
    if (zsel) {
      zsel.innerHTML = '<option value="">Toutes les zones</option><option value="monde">Monde</option>' +
        Object.entries(Z).map(([id, z]) => `<option value="${id}">${esc(z.nom)}</option>`).join("");
    }
    const draw = () => {
      const t = (q && q.value || "").toLowerCase().trim();
      const z = zsel ? zsel.value : "";
      const ty = tsel ? tsel.value : "";
      const res = base.filter((w) => (!ty || w.type === ty) && (!z || w.zone === z) && (!t || (w.titre + " " + w.auteur + " " + w.resume + " " + (w.theme || "")).toLowerCase().includes(t)));
      list.innerHTML = res.length ? res.map(workHTML).join("") : '<li class="empty">' + (base.length ? "Aucun travail ne correspond à cette recherche." : "Les premières publications seront mises en ligne prochainement.") + "</li>";
    };
    [q, zsel, tsel].forEach((el) => el && el.addEventListener("input", draw));
    draw();
  }

  /* ---------- Chronologies ---------- */
  const chronoHTML = (c) => `
    <h2>${esc(c.titre)}</h2>
    <div class="chrono-meta">
      ${c.resume ? `<p>${esc(c.resume)}</p>` : ""}
      <p>${c.acteurs && c.acteurs.length ? `<b>Acteurs :</b> ${c.acteurs.map(esc).join(", ")}. ` : ""}${c.auteur ? `<b>Auteur·rice :</b> ${esc(c.auteur)}. ` : ""}${c.maj ? `<b>Dernière mise à jour :</b> ${esc(fmtDate(c.maj))}.` : ""}${c.exemple ? ' <span class="tag tag--ex">Exemple</span>' : ""}</p>
    </div>
    <ol class="timeline">${(c.evenements || []).map((e) => {
      const pic = e.pic || e.phase === "pic";
      const label = e.phase && e.phase !== "pic" ? e.phase + (pic ? " · point culminant" : "") : pic ? "Point culminant" : "";
      return `<li class="tl" data-phase="${pic ? "pic" : ""}"><time>${esc(e.date)}</time><div><h3>${esc(e.titre)}</h3>${e.texte ? `<p>${esc(e.texte)}</p>` : ""}${label ? `<span class="phase">${esc(label)}</span>` : ""}</div></li>`;
    }).join("")}</ol>`;
  window.ORACLES_UTIL.chronoHTML = chronoHTML;
  const chronoBox = document.getElementById("chrono");
  if (chronoBox) {
    const picker = document.getElementById("chrono-list");
    const list = (window.CHRONOLOGIES || []).filter((c) => c.actif !== false);
    const draw = (id) => {
      const c = list.find((x) => x.id === id);
      picker.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === id));
      chronoBox.innerHTML = chronoHTML(c);
    };
    if (!list.length) chronoBox.innerHTML = '<p class="empty">Aucune chronologie n\'est publiée pour le moment.</p>';
    else {
      picker.innerHTML = list.map((c) => `<button class="chip" data-id="${esc(c.id)}" aria-pressed="false">${esc(c.titre)}</button>`).join("");
      picker.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) draw(b.dataset.id); });
      draw(list[0].id);
    }
  }

  /* ---------- Méthodes : fiches explicatives ---------- */
  const NIVEAUX = { 1: "accessible dès la licence", 2: "demande un peu d'expérience", 3: "demande un accompagnement méthodologique" };
  const dots = (n) => `<span class="level" aria-label="Niveau ${n} sur 3">${"●".repeat(n)}<span style="opacity:.25">${"●".repeat(3 - n)}</span></span>`;
  const mdh = (s) => window.DOMPurify.sanitize(window.marked.parse(s || ""), { FORBID_TAGS: ["img", "style", "form", "iframe", "script"], FORBID_ATTR: ["style"] });
  const methodeHTML = (m) => {
    const sec = (t, k) => (m[k] && m[k].trim() ? `<h2>${t}</h2>${mdh(m[k])}` : "");
    return `${m.resume ? `<p class="article-resume">${esc(m.resume)}</p>` : ""}
      <p class="level-line">Niveau de difficulté : ${dots(m.niveau || 1)} <span class="muted">(${NIVEAUX[m.niveau || 1]})</span></p>
      ${sec("Le principe", "principe")}${sec("Mise en œuvre", "etapes")}${sec("Données mobilisées", "donnees")}${sec("Forces", "forces")}${sec("Limites", "limites")}${sec("Exemple d'usage", "exemple")}${sec("Pour aller plus loin", "lectures")}`;
  };
  window.ORACLES_UTIL.methodeHTML = methodeHTML;
  window.ORACLES_UTIL.dots = dots;
  const fiches = document.getElementById("fiches");
  if (fiches) {
    const all = (window.METHODES || []).filter((x) => x.actif !== false);
    const q = document.getElementById("q"), lvl = document.getElementById("lvl");
    const draw = () => {
      const t = (q.value || "").toLowerCase().trim(), n = lvl.value;
      const res = all.filter((m) => (!n || String(m.niveau) === n) && (!t || (m.nom + " " + (m.resume || "") + " " + (m.principe || "")).toLowerCase().includes(t)));
      fiches.innerHTML = res.length ? res.map((m) => `<li class="fiche"><h3><a href="methode.html?id=${encodeURIComponent(m.id)}">${esc(m.nom)}</a></h3><p>${esc(m.resume || "")}</p><p class="fiche-foot">${dots(m.niveau || 1)} <a href="methode.html?id=${encodeURIComponent(m.id)}">Lire la fiche<span class="sr-only"> : ${esc(m.nom)}</span></a></p></li>`).join("") : '<li class="empty">Aucune fiche ne correspond à cette recherche.</li>';
    };
    if (!all.length) {
      document.querySelector(".filters").hidden = true;
      fiches.innerHTML = '<li class="empty">Les fiches méthodes seront publiées prochainement.</li>';
    } else {
      [q, lvl].forEach((el) => el.addEventListener("input", draw));
      draw();
    }
  }

  /* ---------- Contributeurs ---------- */
  const people = document.getElementById("people");
  if (people) {
    const safeURL = (u) => (/^https:\/\//i.test(u || "") ? u : "");
    people.innerHTML = window.CONTRIBUTEURS.filter((p) => p.actif !== false).map((p, i) => {
      const ini = p.nom.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
      const photo = p.photo ? `<img src="${esc(p.photo)}" alt="Photo de ${esc(p.nom)}" loading="lazy" data-ini="${esc(ini)}">` : esc(ini);
      const lk = safeURL(p.linkedin);
      return `<li class="person"><div class="avatar"${p.photo ? "" : ' aria-hidden="true"'}>${photo}</div><h3>${esc(p.nom)}</h3><p class="role">${esc(p.role)}</p><p>${esc(p.domaine)}</p>${lk ? `<a class="profil" href="${esc(lk)}" target="_blank" rel="noopener noreferrer">${ICON.linkedin}Profil LinkedIn<span class="sr-only"> de ${esc(p.nom)}</span></a>` : ""}${p.exemple ? '<span class="tag tag--ex">Exemple</span>' : ""}</li>`;
    }).join("") || '<li class="empty">L\'équipe sera présentée prochainement.</li>';
    // si une photo est introuvable, on revient aux initiales
    people.querySelectorAll(".avatar img").forEach((img) => img.addEventListener("error", () => { const box = img.parentNode, ini = img.dataset.ini; box.textContent = ini; box.setAttribute("aria-hidden", "true"); }));
  }

  /* ---------- Nos partenaires ---------- */
  const partners = document.getElementById("partners");
  if (partners) {
    const safeURL = (u) => (/^https:\/\//i.test(u || "") ? u : "");
    partners.innerHTML = (window.PARTENAIRES || []).filter((p) => p.actif !== false).map((p) => {
      const lk = safeURL(p.lien);
      const logo = p.logo ? `<img src="${esc(p.logo)}" alt="Logo de ${esc(p.nom)}" loading="lazy" data-nom="${esc(p.nom)}">` : `<span>${esc(p.nom)}</span>`;
      const box = `<div class="partner-logo">${logo}</div>`;
      return `<li class="partner">${lk ? `<a class="partner-link" href="${esc(lk)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.nom)} (nouvel onglet)">${box}</a>` : box}<h3>${esc(p.nom)}</h3>${p.type ? `<p class="role">${esc(p.type)}</p>` : ""}<p>${esc(p.description || "")}</p>${lk ? `<a class="profil" href="${esc(lk)}" target="_blank" rel="noopener noreferrer">Visiter le site<span class="sr-only"> de ${esc(p.nom)}</span></a>` : ""}${p.exemple ? '<span class="tag tag--ex">Exemple</span>' : ""}</li>`;
    }).join("") || '<li class="empty">Nos partenariats seront présentés prochainement.</li>';
    partners.querySelectorAll(".partner-logo img").forEach((img) => img.addEventListener("error", () => { const box = img.parentNode, n = img.dataset.nom; box.textContent = ""; const s = document.createElement("span"); s.textContent = n; box.appendChild(s); }));
  }

  /* ---------- Nos réseaux ---------- */
  const rs = document.getElementById("reseaux");
  if (rs) {
    const DEF = [
      ["linkedin", "LinkedIn", "Actualités de l'association, appels à contributions et nouvelles publications."],
      ["instagram", "Instagram", "Coulisses, rappels des parutions et vie de l'association."],
      ["x", "X", "Veille et partage de nos travaux. Le compte est en cours de création."]
    ];
    rs.innerHTML = DEF.map(([id, nom, txt]) => {
      const url = S.reseaux[id];
      return `<li class="formats-row"><div class="rs-name">${ICON[id]}<h3>${nom}</h3></div><div><p>${txt}</p>${url
        ? `<a class="btn btn--encre" href="${esc(url)}" target="_blank" rel="noopener">Ouvrir ${nom}</a>`
        : '<span class="tag">Bientôt disponible</span>'}</div></li>`;
    }).join("");
  }
})();
