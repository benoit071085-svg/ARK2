# Changelog

Format : chaque entrée précise si le changement est **Commun** (touche les
2 pages via `shared/`), **Option A** ou **Option B** uniquement.

## v12 — 2026-07-23

**Audit complet de l'implémentation GA4** suite à un signalement : aucune requête `google-analytics.com/g/collect` visible, aucun utilisateur en Realtime.

**Revue de code effectuée (8 points demandés)** :
1. `gtag.js` correctement référencé (`<script async src="https://www.googletagmanager.com/gtag/js?id=G-FECB9TXHZ6">`)
2. `gtag('config', 'G-FECB9TXHZ6')` bien exécuté (appelé une fois, juste après `gtag('js', new Date())`)
3. Aucune erreur de syntaxe JS détectée sur les 3 blocs `<script>` de chaque page (vérifié via parseur Node)
4. Les appels `gtag('event', ...)` sont bien exécutés directement, sans fonction intermédiaire
5. `page_view` automatique : couvert par `gtag('config', ...)`, standard officiel
6. Événements personnalisés en `gtag('event', ...)` direct — confirmé, pas de wrapper `track()` résiduel
7. Le script applicatif (`app-script`) ne fait ses appels `gtag()` que dans des gestionnaires d'événements (clic, scroll, IntersectionObserver), jamais au chargement immédiat — laisse largement le temps à `gtag.js` de charger de façon asynchrone
8. Impossible à vérifier depuis cet environnement (pas d'accès réseau aux domaines Google depuis le sandbox d'exécution) — nécessite une vérification manuelle côté navigateur

**Bug réel identifié et corrigé** : `<meta charset="UTF-8">` n'était pas le tout premier élément de `<head>` (le snippet gtag.js le précédait). Ce n'est pas conforme à la spec HTML5 (le charset doit être déclaré en tout premier, dans les 1024 premiers octets). Corrigé : `<meta charset="UTF-8">` est maintenant le tout premier enfant de `<head>`, suivi immédiatement du snippet gtag.js.

**Cause la plus probable des zéro requêtes**, non vérifiable ni corrigeable depuis le code seul : un bloqueur de publicité/traqueurs (uBlock Origin, Brave Shields, protection anti-pistage de Firefox/Chrome...) actif lors du test, qui bloque silencieusement `googletagmanager.com` — c'est la cause n°1 en pratique de ce symptôme exact (code correct, zéro requête). Autre piste à vérifier côté compte Google : un mode de consentement (Consent Mode) actif sur la propriété GA4/Google Ads avec un état par défaut "refusé", qui empêcherait `gtag.js` d'envoyer la moindre requête tant qu'aucun consentement n'est accordé — aucune bannière de consentement n'est implémentée sur les pages, donc si Consent Mode est actif côté compte, cela expliquerait exactement ce symptôme.

Aucun texte, image, ordre de section ou logique de tracking modifié — vérifié par comparaison de contenu.

## v11 — 2026-07-23

**Commun** (shared/script.js, propagé aux 2 pages)

- Ajout du paramètre `variant` (`A-performance` / `B-recovery`) sur les 7 événements GA4 personnalisés : `cta_click`, `product_interest`, `form_view`, `form_start`, `earlybird_select`, `form_submit`, `scroll_depth`. Valeur lue depuis `document.body.dataset.variant`, aucune autre modification.

**Checklist de vérification demandée — tout confirmé** :
1. `gtag.js` (G-FECB9TXHZ6) chargé une seule fois par page, `gtag('config', ...)` appelé une seule fois
2. Aucune trace de GTM ni de `dataLayer`/`track()` personnalisé
3. Formulaires avec noms Netlify uniques (`early-access-performance` / `early-access-recovery`)
4. `new FormData(form)` inclut le champ caché `form-name` dans le payload AJAX envoyé à Netlify
5. `form_submit` déclenché uniquement dans le `.then()` après vérification `res.ok`
6. Email jamais référencé dans aucun appel `gtag()`
7. product_id exacts : A = `morning_formula` / `evening_formula` · B = `post_workout_recovery` / `overnight_recovery`

## v10 — 2026-07-23

**Commun** (shared/script.js, propagé aux 2 pages) + product_id corrigés dans option-b/index.html

- **Vérification "Rejoindre l'accès prioritaire"** : confirmé qu'il n'y avait pas de double comptage — le bouton de soumission (`<button type="submit" class="cta-submit">`) n'a jamais été câblé au listener `cta_click` (celui-ci ne cible que les `<a href="#acces">`). Code rendu explicite et blindé : garde-fou `tagName !== 'A'`, commentaires clarifiant que le bouton de soumission ne déclenche jamais que `form_submit`, uniquement après succès Netlify.
- **product_id Option B corrigés** : `post_sport_recovery` → `post_workout_recovery`, `night_recovery` → `overnight_recovery`. Option A déjà conforme (`morning_formula` / `evening_formula`), inchangée.
- **Vérification finale** : 6/6 CTA de chaque page déclenchent `cta_click` (nav, hero, problem, concept, benefits, science) ; aucun événement en double ; les 2 pages partagent le même `shared/script.js` — tracking strictement identique entre A et B.

Aucun texte, image ou ordre de section modifié — vérifié par comparaison de contenu.

## v9 — 2026-07-23

**Commun** (shared/script.js réécrit + tête gtag.js identique dans les 2 fichiers)

Simplification complète de l'analytics : suppression de Google Tag Manager et de toute la couche `dataLayer`/`track()` personnalisée, remplacée par des appels `gtag('event', ...)` directs.

- **GTM supprimé** : plus aucune référence GTM-NPKVG7JS, plus de `window.dataLayer` personnalisé, plus de fonction `track()`, plus de bloc `<noscript>` GTM.
- **GA4 installé directement** : snippet officiel `gtag.js` (`G-FECB9TXHZ6`) dans `<head>`, `gtag('config', ...)` appelé une fois.
- **cta_click** : `{ cta_location }` uniquement (jamais le texte du bouton) — 6/6 CTA des 2 pages trackés (nav, hero, problem, concept, benefits, science). Aucun CTA footer n'existe actuellement sur les pages, donc cette valeur n'est pas utilisée pour l'instant — signalé ci-dessous.
- **product_interest** : `{ product_id }` sur les 2 boutons Gamme de chaque page.
- **form_view / form_start** : une fois chacun par visite, mêmes déclencheurs qu'avant (IntersectionObserver 50%, première interaction).
- **form_submit** : uniquement `{ age, sport_frequency, professional_status }` — email jamais envoyé à GA4, ni aucun autre champ.
- **earlybird_select** : une fois, uniquement décoché → coché, sans paramètre.
- **scroll_depth** : `{ percent: 50 }`, une fois par visite.
- **Netlify Forms** : inchangé (déjà en place depuis v8) — email, âge, fréquence sportive, statut professionnel, consentement marketing et intérêt Early Bird continuent d'être enregistrés dans Netlify Forms.

Aucun texte, image ni ordre de section modifié — vérifié par comparaison de contenu. Les deux pages partagent exactement le même `shared/script.js` : niveau de tracking strictement identique entre Option A et Option B.

## v8 — 2026-07-23

**Commun** (shared/script.js + shared/styles.css) + éléments spécifiques identiques en structure dans les 2 fichiers (variante, nom de formulaire, product_id)

Implémentation du tracking Google Tag Manager (`GTM-NPKVG7JS`), du stockage de formulaire Netlify Forms et des paramètres de test A/B.

- **GTM** : snippet officiel installé dans `<head>` et `<noscript>` après `<body>`. Aucun `gtag.js` direct — GA4 (`G-FECB9TXHZ6`) sera configuré à l'intérieur de GTM.
- **Variante** : `data-variant="A-performance"` / `"B-recovery"` sur `<body>`, automatiquement incluse dans chaque événement via `track()`.
- **dataLayer** : nouvelle fonction `track(eventName, eventData)` qui pousse systématiquement dans `window.dataLayer` (plus jamais uniquement en variable locale/console). Remplace l'ancien système de tracking local (toast de notification + variable `_log`), désormais supprimé avec son CSS mort.
- **Événements** : `cta_click` (via `data-cta-location` sur chaque CTA : nav/hero/problem/concept/benefits/science), `product_interest` (via `data-product-id` sur les boutons Gamme), `form_view` (IntersectionObserver, 50%, une fois), `form_start` (première interaction, une fois), `earlybird_select` (décoché→coché uniquement, une fois), `form_submit` (après succès Netlify uniquement, email jamais inclus), `scroll_depth` à 50% (une fois).
- **Formulaire → Netlify Forms** : `data-netlify="true"`, honeypot `bot-field`, noms de formulaire distincts (`early-access-performance` / `early-access-recovery`), soumission réelle via `fetch` en `application/x-www-form-urlencoded`, bouton désactivé pendant l'envoi, message de succès affiché uniquement après réponse HTTP réussie, message d'erreur si échec.
- **UTM** : `utm_source/medium/campaign/content` lus dans l'URL, stockés en `sessionStorage`, réinjectés dans des champs cachés à chaque page vue (valeur conservée si absente de l'URL).
- **Champs renommés** : `sport`→`sport_frequency`, `statut`→`professional_status`, `contact`→`contact_optin`, `earlybird`→`earlybird_optin` (labels, id, options inchangés).

**Bug découvert et corrigé pendant cette version** : un second bloc `<script>` legacy (dupliqué, jamais nettoyé depuis la v1) tournait en parallèle du script partagé, provoquant un risque réel de double-listeners. Il a été supprimé ; `scripts/sync.py` cible désormais le script applicatif via un `id="app-script"` explicite plutôt que par position, pour empêcher que ce type de bug ne se reproduise silencieusement.

Toutes les animations, tabs et accordéons sont strictement conservés (comportement UI inchangé, seuls les appels de tracking ad-hoc qui leur étaient attachés ont été retirés). Aucun texte, image ou ordre de section modifié — vérifié par comparaison de contenu.

## v7 — 2026-07-23

**Commun** (shared/styles.css, propagé aux 2 pages) + suppression identique du titre Comparaison dans les 2 fichiers

- **Bénéfices (mobile uniquement)** : suppression du fond blanc derrière les 3 bénéfices (fond de section conservé, séparateurs/icônes/textes conservés). Desktop non touché.
- **Diagnostic** : « Vous continuez à vous entraîner. » utilise désormais exactement la même typographie (police, taille, poids, couleur, interligne) que le paragraphe suivant — classe `.lead` retirée.
- **Comparaison — alignement** : retour à un alignement à gauche (annule le centrage de v6), même point de départ que les autres intitulés.
- **Comparaison — titre supprimé** : le titre « Nutrition sportive traditionnelle vs Nutrition sportive 40+ » est retiré (seul texte supprimé dans cette version, demandé explicitement). L'espace intitulé → tableau est fortement réduit. Le tableau lui-même est inchangé.
- **Intitulés de section** : nettement plus visibles, desktop **et** mobile cette fois (13px mobile / 16px desktop, contre 12px/14px en v6).

Vérifié par comparaison de contenu : seuls les deux mots du titre Comparaison ont été retirés (volontairement) — aucun autre texte, aucune image, aucun changement d'ordre des sections. Le tableau comparatif n'a pas été modifié.

## v6 — 2026-07-23

**Commun** (shared/styles.css, propagé aux 2 pages) + restructuration HTML identique dans les 2 fichiers

Reconstruit par-dessus v4 (v5 a été annulée à la demande). Toutes les règles sont isolées dans des blocs `@media(min-width:901px)` / `@media(min-width:1200px)` — aucune règle ≤900px modifiée.

- **Intitulés de section** : nettement plus visibles sur desktop (14px, espace avant le titre augmenté). Mobile inchangé.
- **Diagnostic** : le bloc d'intro (titre + texte) utilise toute la largeur du conteneur, même point de départ à gauche que les 3 chiffres. Pas de centrage.
- **Comparaison** : seule section centrée (intitulé + titre `text-align:center`, bloc centré au-dessus du graphique). Graphique inchangé.
- **Gamme** : intro alignée à gauche sur toute la largeur des 2 cartes. Le titre passe sur une seule ligne à partir de 1200px (via une classe sur le `<br>` existant, texte non modifié), reste sur 2 lignes en dessous.
- **Science & crédibilité** : intro alignée à gauche, largeur alignée sur la grille de cartes (résout le passage à 3 lignes).
- **Accès prioritaire** : structure 2 colonnes ≈45/55, bloc titre déplacé dans la colonne gauche pour un alignement parfait avec le formulaire. Ordre mobile inchangé.

Vérifié par comparaison de contenu : textes, images et ordre des sections strictement identiques à v4.

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
