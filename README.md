# Perform40 / Recover40 — Landing pages A/B

Deux landing pages MVP pour tester deux positionnements :

- **Option A — Perform40** : `option-a/index.html` — positionnement "performance quotidienne"
- **Option B — Recover40** : `option-b/index.html` — positionnement "récupération"

La racine (`index.html`) est une page de sélection simple (2 boutons) qui
redirige vers `/option-a/` ou `/option-b/` — pratique pour un déploiement
Netlify connecté au repo GitHub (déploiement continu à chaque push).

Chaque landing page (A et B) est autonome (CSS + JS + images en base64
inlinés, seule dépendance externe : Google Fonts) — aucun chemin relatif,
donc rien à casser en les déplaçant dans leurs sous-dossiers respectifs.

## Structure

```
├── index.html            ← page de sélection (2 boutons vers A / B)
├── option-a/
│   └── index.html          ← Option A, fichier final complet
├── option-b/
│   └── index.html          ← Option B, fichier final complet
├── shared/
│   ├── styles.css           ← CSS commun aux 2 pages (source de vérité)
│   └── script.js            ← JS commun aux 2 pages (source de vérité)
├── scripts/
│   └── sync.py                ← propage shared/ vers option-a/ et option-b/
└── CHANGELOG.md                 ← historique des versions
```

## Règle importante

`shared/styles.css` et `shared/script.js` ne doivent **jamais** contenir
d'image en base64. Les images (photos de fond, visuels) sont toujours
spécifiques à chaque option et vivent uniquement dans les fichiers finaux
(`index.html` / `option-b/index.html`), injectées en `style` inline sur les
éléments `.hero-bg` et `.concept-bg`, ou en balise `<img>`.

## Workflow

**Modification commune** (CTA, responsive, animation, formulaire, menu...)
1. Éditer `shared/styles.css` et/ou `shared/script.js`
2. Lancer `python3 scripts/sync.py`
3. Vérifier les 2 pages, puis committer

**Modification spécifique** (texte, image, graphique sur une seule option)
1. Éditer directement `option-a/index.html` OU `option-b/index.html`
2. Committer — l'autre fichier n'est pas touché

## Historique

Voir [CHANGELOG.md](./CHANGELOG.md).
