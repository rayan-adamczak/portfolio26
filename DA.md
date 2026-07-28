# MATÉRIEL — Direction artistique
Portfolio Rayan Adamczak — Product Designer

---

## 1. Concept

**« Le design comme matériau brut. »**

Pas de portfolio-vitrine lisse. Un site qui ressemble à un **outil** : dense, technique, assumé.
La DA vient de l'affiche punk / du print risographié / du terminal — un seul rouge, du noir, de la
trame 1-bit, et une typo qui gueule.

Trois principes non négociables :

1. **Mono-accent.** Un seul rouge. Jamais de deuxième couleur d'accent. La contrainte fait la signature.
2. **Tout est indexé.** Numéros (`001`, `002`), labels mono en majuscules, métadonnées visibles.
   Le site se lit comme une fiche technique, pas comme une plaquette.
3. **L'image est traitée, jamais brute.** Toute photo/screenshot passe par un filtre de tramage
   (dither 1-bit rouge sur noir). Ça unifie des projets visuellement hétérogènes — ton vrai problème
   aujourd'hui : Electra, Neocity et brand appart n'ont rien en commun graphiquement.

---

## 2. Couleurs

| Token | Hex | Usage |
|---|---|---|
| `--noir` | `#0A0A0A` | Fond global |
| `--encre` | `#141414` | Surfaces, cartes, séparateurs |
| `--rouge` | `#FF1F27` | Accent unique : titres, liens, états actifs, fills d'inversion |
| `--rouge-sourd` | `#8F0F14` | Trames, ombres colorées, états désactivés |
| `--craie` | `#F2F0EC` | Texte courant (jamais du blanc pur — trop dur sur noir) |
| `--gris` | `#7A7A7A` | Métadonnées, labels, texte secondaire |

**Règles.**
- Ratio cible ≈ 70 % noir / 22 % craie / 8 % rouge. Le rouge doit rester rare pour rester violent.
- Une seule section entièrement rouge dans toute la page (le « bloc contact » de la Frame 6). C'est le
  point d'orgue — s'il y en a deux, il n'y en a plus.
- Contraste : `--rouge` sur `--noir` = 4.8:1 → OK pour du texte ≥ 18px et du gros titre, **pas** pour du
  corps de texte. Le body est toujours en `--craie`.

---

## 3. Typographie

**PP Neue Machina Ultrabold** — display. Uppercase, tracking `-0.03em`, line-height `0.9`.
**Space Grotesk** — corps de texte, UI, navigation.
**Space Mono** — labels, métadonnées, numéros d'index, tags.

> ⚠️ PP Neue Machina est une licence payante (Pangram Pangram, ~50 € desktop + webfont). À prévoir.
> Alternative gratuite si besoin : Space Grotesk Bold en uppercase très serré, ou Archivo Expanded Black.

### Échelle (base 16, clamp fluide)

| Rôle | Taille | Font |
|---|---|---|
| `display-xl` | `clamp(56px, 11vw, 180px)` | Machina Ultrabold |
| `display-l` | `clamp(40px, 6vw, 96px)` | Machina Ultrabold |
| `title` | `clamp(24px, 3vw, 40px)` | Machina Ultrabold |
| `body-l` | `20px / 1.5` | Space Grotesk |
| `body` | `16px / 1.6` | Space Grotesk |
| `label` | `12px / 1.2`, `+0.12em`, uppercase | Space Mono |

**Règle de mise en page héritée de tes frames :** titre display en rouge, sous-titre en Space Grotesk
regular juste dessous, aligné à gauche sur la même marge optique. Ce duo se répète partout — c'est la
signature de composition.

---

## 4. Grille & espacement

- **12 colonnes**, gouttière `24px`, marges latérales `clamp(20px, 5vw, 80px)`.
- Base d'espacement **8px** (`8 / 16 / 24 / 40 / 64 / 96 / 160`).
- **Filets 1px** `--encre` entre chaque bloc. Le site est cloisonné, comme une grille de journal.
- Contenu éditorial des case studies : max `72ch`, jamais pleine largeur.

---

## 5. Éléments signature

1. **Tramage 1-bit.** Toutes les images en duotone rouge/noir + trame de points. Au hover : la trame se
   résout en image nette. Techniquement : CSS `filter` + overlay SVG, ou canvas si tu veux du vrai
   Floyd-Steinberg.
2. **Inversion au hover.** Bloc noir → bloc rouge plein, texte passe en noir (exactement ta Frame 6).
   C'est ton interaction principale, utilisée partout : liens, cartes projet, bouton contact.
3. **Index numéroté.** Chaque projet porte son numéro `(001)` en Space Mono à gauche.
4. **Marquee.** Bandeau défilant rouge `PRODUCT DESIGNER — AVAILABLE FOR FREELANCE — NEVERS, FR —`
   en séparateur de sections. Une seule occurrence par page.
5. **Sticky status.** Pastille `● AVAILABLE` fixe en haut à droite, rouge pulsé. Récupère l'info clé de
   ton Notion et la rend permanente.
6. **Bruit.** Overlay grain animé à 4 % d'opacité sur tout le site. Détail minuscule, effet énorme.

---

## 6. Structure du site

```
/                 Hero + index projets + expertises + bloc contact rouge
/work/[slug]      Case study : problème → recherche → design → impact
/about            Parcours (Neocity 3 ans → Electra 2 ans → brand appart), méthode, outils
```

**Home**
1. Hero — `PRODUCT DESIGNER` display rouge / `rayan adamczak` dessous / portrait tramé
2. Manifeste — 3 lignes max, gros corps de texte
3. Index projets — **liste, pas grille de cartes**. Une ligne par projet, hover = preview tramée qui suit
   le curseur. Plus dense, plus premium, et ça marche même avec 3 projets (ton cas).
4. Expertises — user research / design system / UX-UI, en 3 colonnes filetées
5. Parcours — timeline mono, une ligne par boîte
6. Contact — le bloc rouge plein

**Case study (template unique, appliqué à tes 3 projets)**
`Contexte → Rôle & durée → Problème → Recherche → Décisions de design → Impact chiffré → Next`

C'est le gros manque du Notion actuel : tes projets sont listés avec des tags, sans narration ni résultat.
Un recruteur lit **l'impact**. Chaque case study doit finir sur un chiffre.

---

## 7. Motion

- **Lenis** pour le scroll lissé (obligatoire pour que la DA respire).
- Apparition des titres par `clip-path` montant, jamais de fade seul.
- Split par ligne sur les display, décalage `40ms`.
- Curseur custom : petit carré rouge, grossit et passe en `mix-blend-mode: difference` sur les liens.
- Transition de page : rideau rouge plein écran, `400ms`, `cubic-bezier(0.7, 0, 0.2, 1)`.
- Tout respecte `prefers-reduced-motion`.

---

## 8. Stack recommandée

**Next.js 15 (App Router) + Tailwind v4 + Motion + Lenis + MDX**, déployé sur Vercel.

- MDX pour les case studies : tu écris en markdown, pas dans le code.
- Tailwind v4 : les tokens de la section 2 vont direct dans `@theme`.
- Alternative si tu veux plus léger et 100 % statique : **Astro**. Perf imbattable, mais motion un peu
  plus manuel.

---

## 9. Ce que ça corrige par rapport au Notion actuel

| Aujourd'hui | Après |
|---|---|
| Template Notion générique, zéro identité | DA reconnaissable au premier écran |
| Projets = tags sans récit | Case studies structurés avec impact chiffré |
| Emojis comme seul visuel | Système d'images tramées cohérent |
| Bio dispersée | Un manifeste de 3 lignes + un parcours lisible |
| Pas de domaine propre | `rayanadamczak.com` |

---

## 10. Ce qu'il me faut de ta part

1. Les fichiers **PP Neue Machina** (ou go sur l'alternative gratuite).
2. Un **portrait** haute résolution (celui de tes frames est parfait, il me faut la source).
3. Pour chaque projet : contexte, ton rôle exact, durée, **1 à 3 chiffres d'impact**, et les visuels.
4. Confirmation de ce qui est sous NDA chez Electra / brand appart.
