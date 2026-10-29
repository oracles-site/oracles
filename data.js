/* =====================================================================
   ORACLES — CONTENU DU SITE
   Ce fichier est le seul à modifier pour ajouter des travaux, des
   chronologies, des fiches de méthode ou des contributeurs.
   Les entrées marquées  exemple:true  sont des modèles : remplacez-les
   ou supprimez-les avant publication (un badge « Exemple » s'affiche).
   ===================================================================== */

window.SITE = {
  nom: "ORACLES",
  nomLong: "Observatoire Associatif de Recherche Académique pour les Études Stratégiques",
  slogan: "Promouvoir, sensibiliser et contribuer à la recherche en études stratégiques",
  rna: "W751285944",
  depot: "",                                   // dépôt GitHub du site, ex. "votrepseudo/oracles-site" (pré-remplit la connexion contributeur)
  email: "contact@observatoire-oracles.fr",   // à remplacer par l'adresse réelle
  reseaux: {
    linkedin:  "https://www.linkedin.com/search/results/companies/?keywords=ORACLES%20-%20observatoire%20associatif%20de%20recherche%20acad%C3%A9mique%20pour%20les%20%C3%A9tudes%20strat%C3%A9giques",   // PROVISOIRE : lien de recherche. Remplacer par l'adresse exacte de la page, ex. "https://www.linkedin.com/company/nom-de-la-page/"
    instagram: "https://www.instagram.com/asso_oracles/",
    x: null                                    // compte en cours de création : mettre l'URL ici quand il existe
  }
};

/* Zones de la carte (les identifiants doivent rester identiques) */
window.ZONES = {
  "amerique-nord":  { nom: "Amérique du Nord",              intro: "États-Unis, Canada, Groenland." },
  "amerique-latine":{ nom: "Amérique latine et Caraïbes",   intro: "Du Mexique à la Terre de Feu, Caraïbes incluses." },
  "europe":         { nom: "Europe",                        intro: "Union européenne, Royaume-Uni, Balkans, Europe orientale, Ukraine et Belarus." },
  "eurasie":        { nom: "Russie et espace eurasiatique", intro: "Russie, Caucase et Asie centrale." },
  "mena":           { nom: "Moyen-Orient et Afrique du Nord", intro: "Du Maghreb au Golfe, Turquie et Iran inclus." },
  "afrique-sub":    { nom: "Afrique subsaharienne",         intro: "Sahel, Afrique de l'Ouest, centrale, de l'Est et australe." },
  "asie-sud":       { nom: "Asie du Sud",                   intro: "Afghanistan, Pakistan, Inde, Bangladesh, Népal, Sri Lanka." },
  "asie-pacifique": { nom: "Asie de l'Est, Asie du Sud-Est et Pacifique", intro: "Chine, péninsule coréenne, Japon, Asie du Sud-Est, Océanie." }
};

window.TYPES = {
  "article":       "Article",
  "revue":         "Revue d'actualité",
  "fiche-lecture": "Fiche de lecture",
  "entretien":     "Entretien"
};

/* Les travaux (articles, revues, fiches de lecture, entretiens) sont dans js/travaux.js,
   fichier géré par l'espace d'administration (admin.html). */

/* Les chronologies de crise sont dans js/chronologies.js, fichier géré par l'espace contributeur. */

/* Les fiches de méthodes sont dans js/methodes.js, fichier géré par l'espace contributeur (onglet Méthodes). */

/* Équipe (page « Notre équipe »)
   Texte type à personnaliser : remplacez « Prénom Nom » et la description de chaque membre.
   Champs facultatifs :
     photo    : chemin de la photo déposée dans assets/equipe/, ex. "assets/equipe/prenom-nom.jpg"
     linkedin : adresse complète du profil, ex. "https://www.linkedin.com/in/prenom-nom/"
   Laissez "" pour ne rien afficher (les initiales remplacent la photo).
   actif    : true pour afficher la fiche sur le site, false pour la masquer (cas des fiches types ci-dessous).
              Quand une fiche est complétée et validée par la personne, remplacez actif:false par actif:true.
   Tant qu'aucune fiche n'est active, la page affiche « L'équipe sera présentée prochainement ».
   Pour ajouter un membre, copiez une ligne ; pour en retirer un, supprimez sa ligne. */
window.CONTRIBUTEURS = [
  { nom:"Prénom Nom", role:"Présidence", actif:false, photo:"", linkedin:"", domaine:"Représente l'association, coordonne ses activités et veille à la cohérence de sa ligne scientifique. Étudiant·e ou chercheur·se en études stratégiques, [préciser le parcours et le domaine de recherche]." },
  { nom:"Prénom Nom", role:"Vice-présidence", actif:false, photo:"", linkedin:"", domaine:"Seconde la présidence et pilote les projets de formation à la recherche. [Préciser le parcours et le domaine de recherche.]" },
  { nom:"Prénom Nom", role:"Secrétariat", actif:false, photo:"", linkedin:"", domaine:"Assure le suivi administratif de l'association et coordonne la relecture et la publication des textes. [Préciser le parcours.]" },
  { nom:"Prénom Nom", role:"Trésorerie", actif:false, photo:"", linkedin:"", domaine:"Gère le budget de l'association et le suivi des adhésions. [Préciser le parcours.]" },
  { nom:"Prénom Nom", role:"Communication", actif:false, photo:"", linkedin:"", domaine:"Anime les réseaux sociaux de l'association et assure la diffusion de ses publications. [Préciser le parcours.]" },
  { nom:"Prénom Nom", role:"Chercheur·se associé·e", actif:false, photo:"", linkedin:"", domaine:"Apporte son expertise scientifique, relit des travaux et accompagne les étudiants dans leurs recherches. [Préciser l'institution et les thèmes de recherche.]" },
  { nom:"Prénom Nom", role:"Étudiant·e contributeur·rice", actif:false, photo:"", linkedin:"", domaine:"Rédige des articles, des fiches de lecture et des entretiens pour l'observatoire. [Préciser la formation et la zone ou le thème suivi.]" }
];

/* Partenaires (page « Nos partenaires »)
   Texte type à personnaliser : remplacez le nom, le type et la description de chaque partenaire.
   Champs facultatifs :
     logo : chemin du logo déposé dans assets/partenaires/, ex. "assets/partenaires/nom-partenaire.png"
     lien : adresse complète du site, ex. "https://www.exemple.fr" (doit commencer par https://)
   Laissez "" pour ne rien afficher (le nom remplace alors le logo).
   actif : true pour afficher la fiche sur le site, false pour la masquer (c'est le cas des fiches types ci-dessous).
           Quand un partenariat est confirmé, complétez sa ligne puis remplacez actif:false par actif:true.
   Tant qu'aucune fiche n'est active, la page affiche « Nos partenariats seront présentés prochainement ».
   Pour ajouter un partenaire, copiez une ligne ; pour en retirer un, supprimez sa ligne.
   Veillez à obtenir l'accord de chaque partenaire avant d'afficher son nom et son logo. */
window.PARTENAIRES = [
  { nom:"Nom du laboratoire partenaire", actif:false, type:"Laboratoire de recherche", logo:"", lien:"", description:"[Présenter le laboratoire et la nature de la collaboration : relecture, accueil d'événements, encadrement de travaux.]" },
  { nom:"Nom de l'établissement partenaire", actif:false, type:"Enseignement supérieur", logo:"", lien:"", description:"[Présenter l'établissement, la formation concernée et la nature de la collaboration.]" },
  { nom:"Nom de l'association partenaire", actif:false, type:"Association", logo:"", lien:"", description:"[Présenter l'association et les actions menées en commun.]" },
  { nom:"Nom du média ou de la revue partenaire", actif:false, type:"Média et édition", logo:"", lien:"", description:"[Présenter le média ou la revue et la nature du partenariat : diffusion, publication croisée.]" }
];
