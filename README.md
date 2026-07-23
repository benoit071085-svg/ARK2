# Perform40 / Recover40 — Landing pages A/B

Deux landing pages MVP pour tester deux positionnements :

- **Option A — Perform40** : `index.html` (racine) — positionnement "performance quotidienne"
- **Option B — Recover40** : `option-b/index.html` — positionnement "récupération"

Chaque fichier est autonome (CSS + JS + images en base64 inlinés) et prêt à
être déposé tel quel sur **Netlify Drop**.

## Structure

```
├── index.html          ← Option A, fichier final complet (Netlify Drop)
├── option-b/
│   └── index.html      ← Option B, fichier final complet (Netlify Drop)
├── shared/
│   ├── styles.css       ← CSS commun aux 2 pages (source de vérité)
│   └── script.js        ← JS commun aux 2 pages (source de vérité)
├── scripts/
│   └── sync.py           ← propage shared/ vers index.html et option-b/index.html
└── CHANGELOG.md            ← historique des versions
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
1. Éditer directement `index.html` OU `option-b/index.html`
2. Committer — l'autre fichier n'est pas touché

## Historique

Voir [CHANGELOG.md](./CHANGELOG.md).
