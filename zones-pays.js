/* =====================================================================
   ORACLES — DÉCOUPAGE DE LA CARTE EN ZONES
   Pour déplacer un pays d'une zone à une autre : coupez sa ligne et collez-la
   dans la liste de la nouvelle zone (gardez le nom anglais entre guillemets et la virgule).
   Pour déplacer ou régler un marqueur numéroté : modifiez ses coordonnées dans
   ZONES_MARQUEURS (x de 0 à 1000 de gauche à droite, y de 0 à 500 de haut en bas).
   Pour créer une zone : (1) ajoutez-la dans ZONES de data.js, (2) ajoutez ici une liste
   de pays et un marqueur du même identifiant.
   ===================================================================== */
window.ZONES_PAYS = {
  /* Amérique du Nord */
  "amerique-nord": [
    "Canada",                            // Canada
    "United States of America",          // États-Unis
    "Greenland",                         // Groenland
  ],

  /* Amérique latine et Caraïbes */
  "amerique-latine": [
    "Argentina",                         // Argentine
    "Bahamas",                           // Bahamas
    "Belize",                            // Belize
    "Bolivia",                           // Bolivie
    "Brazil",                            // Brésil
    "Chile",                             // Chili
    "Colombia",                          // Colombie
    "Costa Rica",                        // Costa Rica
    "Cuba",                              // Cuba
    "Ecuador",                           // Équateur
    "Guatemala",                         // Guatemala
    "Guyana",                            // Guyana
    "Guyane",                            // Guyane
    "Haiti",                             // Haïti
    "Honduras",                          // Honduras
    "Falkland Is.",                      // Îles Malouines
    "Jamaica",                           // Jamaïque
    "Mexico",                            // Mexique
    "Nicaragua",                         // Nicaragua
    "Panama",                            // Panama
    "Paraguay",                          // Paraguay
    "Peru",                              // Pérou
    "Puerto Rico",                       // Porto Rico
    "Dominican Rep.",                    // République dominicaine
    "El Salvador",                       // Salvador
    "Suriname",                          // Surinam
    "Trinidad and Tobago",               // Trinité-et-Tobago
    "Uruguay",                           // Uruguay
    "Venezuela",                         // Venezuela
  ],

  /* Europe */
  "europe": [
    "Albania",                           // Albanie
    "Germany",                           // Allemagne
    "Austria",                           // Autriche
    "Belgium",                           // Belgique
    "Belarus",                           // Biélorussie
    "Bosnia and Herz.",                  // Bosnie-Herzégovine
    "Bulgaria",                          // Bulgarie
    "Cyprus",                            // Chypre
    "N. Cyprus",                         // Chypre du Nord
    "Croatia",                           // Croatie
    "Denmark",                           // Danemark
    "Spain",                             // Espagne
    "Estonia",                           // Estonie
    "Finland",                           // Finlande
    "France",                            // France
    "Greece",                            // Grèce
    "Hungary",                           // Hongrie
    "Ireland",                           // Irlande
    "Iceland",                           // Islande
    "Italy",                             // Italie
    "Kosovo",                            // Kosovo
    "Latvia",                            // Lettonie
    "Lithuania",                         // Lituanie
    "Luxembourg",                        // Luxembourg
    "Macedonia",                         // Macédoine du Nord
    "Moldova",                           // Moldavie
    "Montenegro",                        // Monténégro
    "Norway",                            // Norvège
    "Netherlands",                       // Pays-Bas
    "Poland",                            // Pologne
    "Portugal",                          // Portugal
    "Romania",                           // Roumanie
    "United Kingdom",                    // Royaume-Uni
    "Serbia",                            // Serbie
    "Slovakia",                          // Slovaquie
    "Slovenia",                          // Slovénie
    "Sweden",                            // Suède
    "Switzerland",                       // Suisse
    "Czechia",                           // Tchéquie
    "Ukraine",                           // Ukraine
  ],

  /* Russie et espace eurasiatique */
  "eurasie": [
    "Armenia",                           // Arménie
    "Azerbaijan",                        // Azerbaïdjan
    "Georgia",                           // Géorgie
    "Kazakhstan",                        // Kazakhstan
    "Kyrgyzstan",                        // Kirghizistan
    "Uzbekistan",                        // Ouzbékistan
    "Russia",                            // Russie
    "Tajikistan",                        // Tadjikistan
    "Turkmenistan",                      // Turkménistan
  ],

  /* Moyen-Orient et Afrique du Nord */
  "mena": [
    "Algeria",                           // Algérie
    "Saudi Arabia",                      // Arabie Saoudite
    "Egypt",                             // Égypte
    "United Arab Emirates",              // Émirats arabes unis
    "Iraq",                              // Irak
    "Iran",                              // Iran
    "Israel",                            // Israël
    "Jordan",                            // Jordanie
    "Kuwait",                            // Koweït
    "Lebanon",                           // Liban
    "Libya",                             // Libye
    "Morocco",                           // Maroc
    "Oman",                              // Oman
    "Palestine",                         // Palestine
    "Qatar",                             // Qatar
    "W. Sahara",                         // Sahara occidental
    "Syria",                             // Syrie
    "Tunisia",                           // Tunisie
    "Turkey",                            // Turquie
    "Yemen",                             // Yémen
  ],

  /* Afrique subsaharienne */
  "afrique-sub": [
    "South Africa",                      // Afrique du Sud
    "Angola",                            // Angola
    "Benin",                             // Bénin
    "Botswana",                          // Botswana
    "Burkina Faso",                      // Burkina Faso
    "Burundi",                           // Burundi
    "Cameroon",                          // Cameroun
    "Congo",                             // Congo
    "Dem. Rep. Congo",                   // Congo (Rép. dém.)
    "Côte d'Ivoire",                     // Côte d'Ivoire
    "Djibouti",                          // Djibouti
    "Eritrea",                           // Érythrée
    "eSwatini",                          // Eswatini
    "Ethiopia",                          // Éthiopie
    "Gabon",                             // Gabon
    "Gambia",                            // Gambie
    "Ghana",                             // Ghana
    "Guinea",                            // Guinée
    "Eq. Guinea",                        // Guinée équatoriale
    "Guinea-Bissau",                     // Guinée-Bissau
    "Kenya",                             // Kenya
    "Lesotho",                           // Lesotho
    "Liberia",                           // Liberia
    "Madagascar",                        // Madagascar
    "Malawi",                            // Malawi
    "Mali",                              // Mali
    "Mauritania",                        // Mauritanie
    "Mozambique",                        // Mozambique
    "Namibia",                           // Namibie
    "Niger",                             // Niger
    "Nigeria",                           // Nigéria
    "Uganda",                            // Ouganda
    "Central African Rep.",              // République centrafricaine
    "Rwanda",                            // Rwanda
    "Senegal",                           // Sénégal
    "Sierra Leone",                      // Sierra Leone
    "Somalia",                           // Somalie
    "Somaliland",                        // Somaliland
    "Sudan",                             // Soudan
    "S. Sudan",                          // Soudan du Sud
    "Tanzania",                          // Tanzanie
    "Chad",                              // Tchad
    "Togo",                              // Togo
    "Zambia",                            // Zambie
    "Zimbabwe",                          // Zimbabwe
  ],

  /* Asie du Sud */
  "asie-sud": [
    "Afghanistan",                       // Afghanistan
    "Bangladesh",                        // Bangladesh
    "Bhutan",                            // Bhoutan
    "India",                             // Inde
    "Nepal",                             // Népal
    "Pakistan",                          // Pakistan
    "Sri Lanka",                         // Sri Lanka
  ],

  /* Asie de l'Est, Asie du Sud-Est et Pacifique */
  "asie-pacifique": [
    "Australia",                         // Australie
    "Myanmar",                           // Birmanie
    "Brunei",                            // Brunei
    "Cambodia",                          // Cambodge
    "China",                             // Chine
    "North Korea",                       // Corée du Nord
    "South Korea",                       // Corée du Sud
    "Fiji",                              // Fidji
    "Solomon Is.",                       // Îles Salomon
    "Indonesia",                         // Indonésie
    "Japan",                             // Japon
    "Laos",                              // Laos
    "Malaysia",                          // Malaisie
    "Mongolia",                          // Mongolie
    "New Caledonia",                     // Nouvelle-Calédonie
    "New Zealand",                       // Nouvelle-Zélande
    "Papua New Guinea",                  // Papouasie-Nouvelle-Guinée
    "Philippines",                       // Philippines
    "Taiwan",                            // Taïwan
    "Thailand",                          // Thaïlande
    "Timor-Leste",                       // Timor oriental
    "Vanuatu",                           // Vanuatu
    "Vietnam",                           // Viêt Nam
  ]

};

/* Position des marqueurs numérotés (coordonnées de la carte, 1000 x 500) */
window.ZONES_MARQUEURS = {
  "amerique-nord": [251,139],
  "amerique-latine": [334,319],
  "europe": [529,126],
  "eurasie": [657,102],
  "mena": [607,197],
  "afrique-sub": [561,293],
  "asie-sud": [714,216],
  "asie-pacifique": [798,190]
};
