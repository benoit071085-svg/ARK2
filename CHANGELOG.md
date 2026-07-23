# Changelog

Format : chaque entrée précise si le changement est **Commun** (touche les
2 pages via `shared/`), **Option A** ou **Option B** uniquement.

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
