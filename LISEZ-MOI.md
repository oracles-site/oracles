# Site ORACLES — mise en ligne et administration

## Liste de vérification avant et pendant la mise en ligne
**Avant**
1. Créer le compte GitHub de l'association (adresse e-mail de l'association, double authentification activée).
2. Compléter : `mentions-legales.html` (siège, directeur de publication), `js/data.js` (e-mail réel, adresse exacte de la page LinkedIn, `depot`). Vérifier que l'adresse e-mail de contact existe réellement.
3. Décider des contenus à afficher : équipe, partenaires, chronologies, fiches méthodes (voir `actif:true`/`false`).

**Publication**
4. Mettre le site sur GitHub et activer GitHub Pages (partie 1).
5. Relier le domaine chez Ionos (partie 2), puis attendre la vérification DNS (de quelques minutes à 24 h) et cocher « Enforce HTTPS ».
6. Tester le site sur l'adresse définitive, sur ordinateur et téléphone.

**Après**
7. Créer le jeton de l'éditeur (partie 3) et publier un premier travail de test depuis l'espace contributeur.
8. Retirer les exemples devenus inutiles (bouton « Retirer »), puis annoncer le site sur LinkedIn et Instagram.

## 1. Publier le site sur GitHub Pages
1. Créez un dépôt **public** sur github.com (ex. `oracles-site`) : GitHub Pages gratuit exige un dépôt public.
2. Décompressez l'archive, puis déposez TOUT le contenu du dossier `oracles-site` (pas le dossier lui-même) à la racine du dépôt : « Add file » > « Upload files », en glissant les fichiers et dossiers (`css`, `js` avec `js/vendor`, `assets`, `textes`, `travaux`, les pages `.html`, `CNAME`, `robots.txt`, `sitemap.xml`). L'envoi par navigateur est limité à 100 fichiers à la fois : le site en compte environ 60. Les fichiers cachés (`.nojekyll`, `.gitkeep`) sont facultatifs.
   Important : lors d'une mise à jour de l'archive, remplacez tous les fichiers, pas seulement `index.html` : le menu et les pages dépendent de `js/` et `css/`.
3. Settings > Pages : Source = « Deploy from a branch », branche `main`, dossier `/ (root)`. Enregistrez.
4. Le site est alors disponible sur `votrepseudo.github.io/nom-du-depot`. Dans Pages, « Custom domain » = `observatoire-oracles.fr`, puis cochez « Enforce HTTPS » quand l'option devient disponible (le certificat peut demander jusqu'à une heure).

## 2. DNS chez Ionos (Domaines & SSL > votre domaine > DNS)
- Supprimez d'abord les anciens enregistrements A/AAAA qui pointent vers les pages de parking d'Ionos.
- Ajoutez 4 enregistrements A pour `@` : 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- Ajoutez 1 enregistrement CNAME pour `www` : `VOTRE-PSEUDO.github.io`
(Vérifiez ces adresses dans la documentation GitHub Pages au moment de la configuration.)

## 3. Espace contributeur (menu > Contributeur, adresse /admin.html)

Réservé aux personnes autorisées. Il permet de déposer tous les contenus du site, sans toucher au code, depuis quatre rubriques :
- **Travaux** : articles, fiches de lecture, entretiens (et revues sous forme libre) ;
- **Revues d'actualité** ; **Chronologies** ; **Méthodes** (fiches explicatives).
Le contenu est mis en forme automatiquement et publié sur le site en 1 à 2 minutes.

### Créer le jeton GitHub (une fois par personne autorisée)
1. GitHub > photo > Settings > Developer settings > Personal access tokens > **Fine-grained tokens** > Generate new token.
2. Repository access : « Only select repositories » > votre dépôt.
3. Permissions > Repository permissions > **Contents : Read and write**.
4. Choisissez une expiration (ex. 90 jours), générez, copiez le jeton (`github_pat_…`).
5. Ajoutez la personne comme collaborateur du dépôt (Settings > Collaborators). Un jeton par personne, jamais partagé.

### Se connecter
Menu > Contributeur : identifiant GitHub + jeton (qui fait office de mot de passe), puis « Se connecter ». GitHub vérifie le compte et ses droits ; sans cela, les formulaires restent masqués.
Pour éviter de saisir le dépôt, renseignez `depot: "votrepseudo/oracles-site"` dans `js/data.js` (sinon « Options avancées »).

### Déposer un travail (onglet Travaux)
Format, zone, titre, auteur, date, thème, résumé ; texte collé ou importé (Word .docx, Markdown, texte, HTML). Un titre de niveau 1 remplit le titre ; le résumé est généré s'il est vide ; un PDF ou un lien externe peut être joint. L'aperçu s'affiche à droite. « Publier sur le site ».
Les travaux se modifient ou se retirent depuis la liste « Travaux publiés ». Les images d'un document Word ne sont pas reprises (joignez le PDF pour les figures).

### Revues d'actualité
1. Indiquez le début de la période : la fin (+6 jours) et le titre « semaine N » se remplissent seuls.
2. Rédigez l'éditorial (facultatif), puis ajoutez les faits marquants : zone, titre, analyse (Markdown accepté), sources. Réordonnez avec « Monter » et « Descendre ».
3. Ajoutez « À suivre la semaine prochaine », vérifiez l'aperçu, puis « Publier la revue ».
La revue est classée dans « Articles ». Pour la corriger : « Revues publiées » > Modifier > republier (même adresse, pas de doublon).

### Chronologies
1. Titre, résumé, acteurs, auteur·rice, puis les événements (date, phase, titre, description, case « Point culminant »). « Coller une liste d'événements » accepte des lignes `date | phase | titre | description`.
2. Réordonnez, vérifiez l'aperçu, « Publier la chronologie ».
3. Mise à jour d'une crise en cours : « Chronologies publiées » > Modifier > ajoutez les nouveaux événements > republier. Le site affiche « Dernière mise à jour : date ».

### Méthodes (fiches explicatives)
Chaque fiche comprend : nom, niveau de difficulté (1 à 3), « En bref » (une phrase), puis des sections en Markdown : le principe, la mise en œuvre (étapes), les données mobilisées, les forces, les limites, un exemple d'usage, les références. Les sections vides ne s'affichent pas.
Créez, modifiez ou supprimez une fiche depuis l'onglet Méthodes ; les boutons ↑ ↓ de la liste règlent l'ordre d'affichage sur le site. Les fiches fournies sont des textes généraux à relire et à adapter par l'association (vérifiez notamment les références).

### Travaux et revues : exemples masqués, afficher ou masquer
Les travaux et revues d'exemple fournis sont **masqués** (`"actif": false` dans `js/travaux.js`) : ils n'apparaissent ni dans « Articles », ni sur l'accueil, ni sur la carte. Tant qu'aucun travail n'est publié, ces pages affichent « Les premières publications seront mises en ligne prochainement ».
Dans l'onglet Travaux (liste « Travaux publiés ») et l'onglet Revues, chaque élément indique « MASQUÉ » ou « MASQUÉE » et propose **Afficher** / **Masquer**. Le formulaire contient la case « Visible sur le site » (cochée par défaut). Quand vous n'avez plus besoin des exemples, utilisez « Retirer » pour les supprimer.

### Afficher ou masquer une chronologie ou une fiche méthode
Les exemples fournis (chronologie de Cuba, huit fiches méthodes) sont **masqués** : leur contenu est conservé mais n'apparaît pas sur le site (les pages affichent « Aucune chronologie… » ou « Les fiches méthodes seront publiées prochainement »).
Dans les onglets Chronologies et Méthodes, la liste indique « MASQUÉE » et propose un bouton **Afficher** / **Masquer**. Le formulaire contient aussi la case « Visible sur le site » : les nouvelles fiches et chronologies sont visibles par défaut.
À la main : dans `js/chronologies.js` ou `js/methodes.js`, `"actif": false` masque l'élément, `"actif": true` l'affiche.

### Précautions
Le jeton reste dans le navigateur ; sur un poste partagé, ne cochez pas « Rester connecté » et cliquez « Se déconnecter ». La connexion est vérifiée par GitHub, pas par un mot de passe stocké dans le site (qui serait lisible par tous).

## 4. Modifier le site : quel fichier pour quel contenu

| Je veux modifier… | Fichier | Où dans le fichier |
|---|---|---|
| Présentation des membres de l'équipe | `js/data.js` | liste `CONTRIBUTEURS` (nom, role, domaine) |
| Nom et description d'une zone de la carte | `js/data.js` | liste `ZONES` (nom, intro) |
| Pays appartenant à une zone | `js/zones-pays.js` | listes `ZONES_PAYS` (une ligne par pays) |
| Partenaires (nom, type, description, logo, lien) | `js/data.js` | liste `PARTENAIRES` |
| Position des marqueurs numérotés | `js/zones-pays.js` | `ZONES_MARQUEURS` |
| Chronologies de crise | espace contributeur (onglet Chronologies) | pas besoin de toucher au code (`js/chronologies.js`) |
| Fiches de méthodes | espace contributeur (onglet Méthodes) | pas besoin de toucher au code (`js/methodes.js`) |
| E-mail de contact, liens des réseaux, dépôt | `js/data.js` | bloc `SITE` en haut |
| Textes de l'accueil, mission, « Ce que nous proposons » | `index.html` | texte entre les balises |
| Textes de « À propos » | `a-propos.html` | idem |
| Mentions légales (siège, directeur de publication) | `mentions-legales.html` | idem |
| Libellés du menu, texte du pied de page | `js/main.js` | `NAV` et la section « Pied de page » |
| Couleurs, tailles, polices | `css/style.css` | variables `:root` en haut du fichier |
| Visuel de la page d'accueil (œil-globe et fond planisphère) | `assets/hero-oeil.svg`, `assets/hero-fond.svg` | images vectorielles : demandez une nouvelle version plutôt que de les modifier à la main |
| Logo | `assets/` | remplacer `logo-oracles.png` et `logo-oeil.png` (même nom) |
| Articles, revues d'actualité, fiches de lecture, entretiens | espace contributeur (onglets Travaux et Revues) | pas besoin de toucher au code |

### Procédure sur GitHub (sans rien installer)
1. Ouvrez votre dépôt sur github.com et cliquez sur le fichier à modifier.
2. Cliquez sur l'icône crayon (« Edit this file »). Utilisez Ctrl + F pour trouver le passage.
3. Modifiez le texte, puis « Commit changes » (confirmez avec « Commit changes » une 2e fois).
4. Le site se met à jour en 1 à 2 minutes (actualisez avec Ctrl + Maj + R).
5. En cas d'erreur : ouvrez le fichier, bouton « History », choisissez la version précédente, puis restaurez-la.

### Règles de syntaxe (à respecter dans les fichiers .js)
- Gardez les guillemets `"` ou `'` autour des textes, les virgules entre les éléments et les accolades `{ }`.
- Pour une apostrophe dans un texte entouré de `'`, écrivez `\'` (ou utilisez des guillemets doubles).
- Un oubli de virgule peut vider la page : relisez avant de valider ; sinon, annulez via « History ».
- Dans les fichiers .html, modifiez uniquement le texte, pas les balises `< >`.

### Exemples
- **Ajouter un membre** : dans `CONTRIBUTEURS`, copiez une ligne `{ nom:"…", role:"…", domaine:"…" },`, collez-la et modifiez-la. Les fiches actuelles sont des textes types : remplacez « Prénom Nom » et le contenu entre [crochets] de chaque membre.
- **Déplacer un pays** (ex. la Turquie de « Moyen-Orient » vers « Europe ») : dans `zones-pays.js`, coupez la ligne `"Turkey", // Turquie` de la liste `"mena"` et collez-la dans la liste `"europe"`.
- **Créer une zone** : ajoutez-la dans `ZONES` (data.js), puis dans `zones-pays.js` une liste de pays et un marqueur portant le même identifiant.
- **Renommer une zone** : changez `nom` et `intro` dans `ZONES`, sans modifier l'identifiant (ex. `"mena"`), qui relie les travaux à la zone.

### Afficher ou masquer les fiches de l'équipe
Chaque fiche contient `actif:false` (masquée). Quand la fiche est complétée et validée par la personne, remplacez `actif:false` par `actif:true` dans sa ligne (`js/data.js`, liste `CONTRIBUTEURS`) : elle apparaît sur le site en 1 à 2 minutes. Tant qu'aucune fiche n'est active, la page affiche « L'équipe sera présentée prochainement » (le bloc « Rejoindre ORACLES » reste visible).

### Réseaux sociaux
Dans `js/data.js`, bloc `SITE` > `reseaux` : Instagram pointe vers `https://www.instagram.com/asso_oracles/`. L'adresse LinkedIn est PROVISOIRE (lien de recherche) : remplacez-la par l'adresse exacte de la page, de la forme `https://www.linkedin.com/company/nom-de-la-page/` (copiez-la depuis la barre d'adresse en ouvrant la page). Quand le compte X existe, remplacez `x: null` par son adresse : le libellé « bientôt » disparaît.

### Ajouter une photo et un lien LinkedIn à un membre
1. **Préparer la photo** : carrée (visage centré), environ 400 x 400 pixels, format JPG, moins de 200 Ko. Nommez-la sans espace ni accent : `prenom-nom.jpg`. N'utilisez que des photos dont vous avez l'accord de la personne.
2. **Déposer la photo** : sur GitHub, ouvrez le dossier `assets/equipe`, cliquez « Add file » > « Upload files », glissez la photo, puis « Commit changes ».
3. **Relier la fiche** : ouvrez `js/data.js`, cherchez le nom du membre (Ctrl + F) et complétez ses deux champs :
   `photo:"assets/equipe/prenom-nom.jpg", linkedin:"https://www.linkedin.com/in/prenom-nom/"`
   (copiez l'adresse du profil depuis la barre d'adresse de votre navigateur ; elle doit commencer par `https://`).
4. Validez avec « Commit changes ». Sans photo ou avec un nom de fichier erroné, le site affiche les initiales ; sans lien, aucun lien n'apparaît.

### Ajouter un partenaire, son logo et son lien
1. Obtenez l'accord du partenaire pour afficher son nom et son logo.
2. Logo : de préférence PNG sur fond transparent, largeur d'environ 400 px, moins de 100 Ko, nom sans espace ni accent (`nom-partenaire.png`). Déposez-le dans `assets/partenaires` (« Add file » > « Upload files »).
3. Dans `js/data.js`, liste `PARTENAIRES`, complétez la ligne du partenaire :
   `logo:"assets/partenaires/nom-partenaire.png", lien:"https://www.site-du-partenaire.fr"`
   (le lien doit commencer par `https://`). Sans logo, le nom du partenaire s'affiche à la place ; sans lien, aucun lien n'apparaît.
4. **Afficher la fiche** : chaque fiche contient `actif:false` (masquée). Une fois le partenariat confirmé et la ligne complétée, remplacez `actif:false` par `actif:true` : la fiche apparaît sur le site en 1 à 2 minutes. Pour la masquer de nouveau, remettez `actif:false`.
   Tant qu'aucune fiche n'est active, la page affiche « Nos partenariats seront présentés prochainement » ; l'onglet reste dans le menu.
5. Pour ajouter un partenaire, copiez une ligne complète (de `{ nom:` jusqu'à `},`) ; pour en retirer un, supprimez sa ligne.

### Prévisualiser avant de publier
Pour les grosses modifications, testez en local (dossier décompressé + Live Server de VS Code) ou déposez le dossier sur Netlify Drop. Les petites modifications de texte peuvent être faites directement sur GitHub.

Les entrées avec `exemple:true` affichent « Exemple » : supprimez-les (ou retirez-les via l'espace éditeur) avant publication.
À compléter : e-mail réel, URL LinkedIn/Instagram/X, siège et directeur de publication.
