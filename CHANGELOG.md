# Changelog

Format : chaque entrée précise si le changement est **Commun** (touche les
2 pages via `shared/`), **Option A** ou **Option B** uniquement.

## v5 — 2026-07-23

**Commun** (shared/styles.css, propagé aux 2 pages) + restructuration HTML identique dans les 2 fichiers

Toutes les règles sont isolées dans un bloc `@media(min-width:901px)` dédié — aucune règle ≤900px n'est modifiée, l'expérience mobile reste strictement identique.

- **Accès prioritaire** : restructuration réelle en 2 colonnes desktop (≈45/55). Le bloc "intitulé + titre + intro" est déplacé à l'intérieur de la colonne gauche (au-dessus des 3 bénéfices), pour que le haut de la colonne gauche et le haut du questionnaire soient parfaitement alignés. Sur mobile, l'ordre de lecture reste identique (intro → bénéfices → questionnaire), aucun changement d'espacement en dehors du desktop.
- **Diagnostic, Comparaison, Science** : blocs d'intro centrés dans la page (720px), texte toujours aligné à gauche. Bloc de conclusion (physiologie + CTA) également centré et resserré.
- **Gamme, Bénéfices** : intitulé + titre (+ texte d'intro pour Gamme) centrés et légèrement élargis, sans wrapper HTML supplémentaire (sélection CSS ciblée).
- Cartes, statistiques et grilles conservent toute la largeur du conteneur (1080px), comme demandé.

Vérifié par comparaison de contenu avant/après : tous les textes, toutes les images et l'ordre des sections sont strictement identiques — seule la position du bloc titre "Accès prioritaire" a changé (déplacé dans la colonne gauche, contenu inchangé). Le tableau comparatif n'a pas été touché.

## v4 — 2026-07-23

**Commun** (via `shared/styles.css` + `shared/script.js`, propagé aux deux pages par `scripts/sync.py`)
- **CTA → questionnaire** : tous les CTA menant à `#acces` font désormais défiler directement jusqu'au `form-box` (au lieu du haut de section), avec une marge de défilement (`scroll-margin-top`) pour ne jamais être masqués par la navigation sticky. Respecte `prefers-reduced-motion` (défilement instantané si activé).
- **Navigation sticky** : ajout d'un `scroll-margin-top` générique sur toutes les sections (`section[id]`), pour tout lien d'ancrage futur.
- **Titres de section** (Le diagnostic, Le concept, La comparaison, La gamme, Bénéfices, Science & crédibilité, Accès prioritaire) : taille augmentée (10px → 12px), poids renforcé (700 → 800), espace avant le titre principal augmenté (.75rem → 1.1rem). Texte inchangé.
- **Alignement Accès prioritaire** : colonnes explicitement alignées en haut (`align-items:flex-start`), suppression de toute marge supérieure parasite.
- **Harmonisation des largeurs** : le bloc d'intro de la section Comparaison (`.compare-head`) aligné sur la largeur des autres intros de section (660px), pour une lecture plus cohérente.

Aucun texte, image, tableau comparatif, ordre de section ou couleur principale modifié — vérifié par comparaison de contenu avant/après (uniquement le CSS et le JS partagés ont changé).

## v3 — 2026-07-23

**Commun**
- Réorganisation pour déploiement Netlify connecté au repo GitHub :
  - Option A déplacée de `index.html` vers `option-a/index.html`
  - Nouvelle page racine `index.html` : sélecteur simple avec 2 boutons
    (Option A / Option B)
  - `scripts/sync.py` mis à jour pour cibler `option-a/index.html`
- Aucun texte, design, contenu ou animation modifié dans A ou B — vérifié
  par comparaison de contenu avant/après déplacement
- Vérification : les 2 pages sont 100% autonomes (CSS/JS/images inlinés,
  seule dépendance externe = Google Fonts en URL absolue) — aucun chemin
  relatif à corriger

## v2 — 2026-07-23

**Commun**
- Mise en place de l'architecture partagée : extraction du CSS et du JS
  (100% identiques entre A et B) dans `shared/styles.css` et
  `shared/script.js`
- Ajout du script `scripts/sync.py` pour propager les changements communs
- Aucun changement visuel ou fonctionnel : les 2 pages rendent exactement
  comme avant (vérifié par comparaison de contenu)

**Option B**
- Ajout d'Option B (`option-b/index.html`) au repo, absente jusqu'ici

## v1 — 2026-07-23 (état initial du repo)

**Option A**
- Landing page MVP : correction textes Science & Crédibilité conformes au
  Word (mécanismes scientifiques, ingrédients, intro, formulaire)
