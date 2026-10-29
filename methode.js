/* ORACLES — page d'une fiche méthode (methode.html?id=...) */
(function () {
  const { esc, fmtDate, methodeHTML } = window.ORACLES_UTIL;
  const id = new URLSearchParams(location.search).get("id");
  const list = (window.METHODES || []).filter((x) => x.actif !== false);
  const i = list.findIndex((x) => x.id === id);
  const head = document.getElementById("m-head"), root = document.getElementById("m-root");
  if (i < 0) {
    head.innerHTML = "<h1>Fiche introuvable</h1>";
    root.innerHTML = '<p>Cette fiche n\'existe pas ou a été retirée. <a href="methodes.html">Retour aux méthodes</a>.</p>';
    return;
  }
  const m = list[i];
  document.title = m.nom + " — Fiche méthode — ORACLES";
  head.innerHTML = `<h1>${esc(m.nom)}</h1><p>Fiche méthode${m.maj ? ", mise à jour le " + esc(fmtDate(m.maj)) : ""}</p>`;
  const prev = list[i - 1], next = list[i + 1];
  root.innerHTML = methodeHTML(m) + `
    <nav class="fiche-nav" aria-label="Autres fiches">
      ${prev ? `<a href="methode.html?id=${encodeURIComponent(prev.id)}">← ${esc(prev.nom)}</a>` : "<span></span>"}
      <a href="methodes.html">Toutes les méthodes</a>
      ${next ? `<a href="methode.html?id=${encodeURIComponent(next.id)}">${esc(next.nom)} →</a>` : "<span></span>"}
    </nav>`;
})();
