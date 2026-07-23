#!/usr/bin/env python3
"""
Synchronise shared/styles.css et shared/script.js vers index.html (Option A)
et option-b/index.html (Option B).

Usage : python3 scripts/sync.py

Ce script :
  1. Lit shared/styles.css et shared/script.js (source unique commune)
  2. Remplace le contenu des balises <style> et <script> dans les deux
     fichiers finaux, SANS toucher au reste (textes, images, structure)
  3. Préserve les styles inline propres à chaque option (ex: les images
     de fond hero-bg / concept-bg, injectées via style="background-image:...")

Les images restent spécifiques à chaque fichier (elles ne sont jamais
dans shared/) : ne pas les ajouter à shared/styles.css.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHARED_CSS = ROOT / "shared" / "styles.css"
SHARED_JS = ROOT / "shared" / "script.js"
TARGETS = [ROOT / "index.html", ROOT / "option-b" / "index.html"]


def sync_file(path: Path, shared_css: str, shared_js: str) -> bool:
    original = path.read_text(encoding="utf-8")

    if "background-image:url(data:image" in shared_css:
        print(
            f"ERREUR : shared/styles.css contient une image en base64. "
            f"Les images doivent rester dans les fichiers d'option, pas dans shared/.",
            file=sys.stderr,
        )
        sys.exit(1)

    updated = re.sub(
        r"<style>.*?</style>",
        lambda m: "<style>\n" + shared_css + "\n</style>",
        original,
        count=1,
        flags=re.S,
    )
    updated = re.sub(
        r"<script>(?!\s*src=).*?</script>",
        lambda m: "<script>\n" + shared_js + "\n</script>",
        updated,
        count=1,
        flags=re.S,
    )

    if updated == original:
        print(f"  {path.relative_to(ROOT)} : déjà à jour")
        return False

    path.write_text(updated, encoding="utf-8")
    print(f"  {path.relative_to(ROOT)} : synchronisé")
    return True


def main():
    shared_css = SHARED_CSS.read_text(encoding="utf-8").strip()
    shared_js = SHARED_JS.read_text(encoding="utf-8").strip()

    print("Synchronisation du CSS/JS partagé vers les 2 landing pages...")
    changed = [sync_file(t, shared_css, shared_js) for t in TARGETS]

    if any(changed):
        print("\nFait. Pense à valider visuellement les 2 pages avant de committer.")
    else:
        print("\nRien à synchroniser, tout était déjà à jour.")


if __name__ == "__main__":
    main()
