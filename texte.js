/* ORACLES — page de lecture d'un travail (texte.html?id=...) */
(function () {
  const { esc, zoneNom, fmtDate } = window.ORACLES_UTIL;
  const T = window.TYPES;
  const id = new URLSearchParams(location.search).get("id");
  const root = document.getElementById("texte-root");
  const head = document.getElementById("texte-head");
  const w = (window.WORKS || []).find((x) => x.slug === id);
  if (!w) {
    head.innerHTML = "<h1>Travail introuvable</h1>";
    root.innerHTML = '<p>Ce travail n\'existe pas ou a été retiré. <a href="articles.html">Retour aux articles</a>.</p>';
    return;
  }
  document.title = w.titre + " — ORACLES";
  head.innerHTML = `<h1>${esc(w.titre)}</h1><p>${esc(T[w.type])} par ${esc(w.auteur)}, ${esc(fmtDate(w.date))}</p>`;
  const cite = `${w.auteur}, « ${w.titre} », ORACLES, ${fmtDate(w.date)}, ${location.origin}${location.pathname}?id=${w.slug}.`;
  const tags = `<span class="tag">${esc(zoneNom(w.zone))}</span>${w.theme ? `<span class="tag">${esc(w.theme)}</span>` : ""}`;
  root.innerHTML = `<div class="article-meta">${tags}</div>
    <p class="article-resume">${esc(w.resume)}</p>
    <div class="article" id="article-body"><p class="muted">Chargement du texte…</p></div>
    <aside class="cite"><b>Pour citer ce travail</b><p>${esc(cite)}</p>
      <button class="btn btn--encre" type="button" onclick="window.print()">Imprimer ou enregistrer en PDF</button>
      ${w.pdf ? `<a class="btn btn--encre" href="${esc(w.pdf)}">Télécharger le PDF</a>` : ""}
      <a class="btn btn--encre" href="articles.html">Retour aux articles</a></aside>`;
  const body = document.getElementById("article-body");
  const s = document.createElement("script");
  s.src = "textes/" + encodeURIComponent(w.slug) + ".js";
  s.onload = () => {
    const t = (window.ORACLES_TEXTES || {})[w.slug];
    body.innerHTML = t ? window.DOMPurify.sanitize(t.html) : "<p>Texte indisponible.</p>";
  };
  s.onerror = () => { body.innerHTML = "<p>Le texte de ce travail n'est pas encore disponible.</p>"; };
  document.head.appendChild(s);
})();
