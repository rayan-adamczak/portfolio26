# Portfolio — Rayan Adamczak

Product Designer. Brest, FR.

Site statique, sans dépendance ni build. Direction artistique « Matériel » :
rouge et noir, trame 1-bit, PP Neue Machina + Space Grotesk.

## Structure

- `index.html` — accueil
- `case-*.html` — études de cas
- `assets/case.css`, `assets/case.js` — feuille et script communs aux études de cas
- `assets/carrousel/` — visuels du carrousel
- `assets/cases/` — visuels des études de cas
- `assets/masks.css` — les deux SVG tramés inlinés en data: URI, pour que
  les masques fonctionnent aussi en `file://`
- `DA.md` — la direction artistique écrite

## Localisation

FR par défaut pour les navigateurs francophones, EN pour tous les autres.
Le français est dans le HTML, l'anglais dans des attributs `data-en`.
Le choix manuel est mémorisé en `localStorage`.
