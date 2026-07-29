/* Commun aux trois pages de case study : localisation, curseur, révélation. */

// ── Curseur ───────────────────────────────────────────────────
const cur = document.getElementById('cur');
addEventListener('pointermove', e => {
  cur.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
});
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('pointerenter', () => cur.classList.add('big'));
  el.addEventListener('pointerleave', () => cur.classList.remove('big'));
});
// Les visuels sont les seules surfaces claires de la page : c'est là, et
// seulement là, que le mélange `difference` virerait le rouge au cyan.
document.querySelectorAll('figure').forEach(el => {
  el.addEventListener('pointerenter', () => cur.classList.add('sur-visuel'));
  el.addEventListener('pointerleave', () => cur.classList.remove('sur-visuel'));
});

// ── Sommaire : section courante ───────────────────────────────
// On retient le bloc le plus haut encore visible : plusieurs sections
// peuvent se croiser à l'écran, et prendre la dernière entrée observée
// ferait clignoter l'état actif.
const liens = [...document.querySelectorAll('.sommaire a')];
const blocs = liens
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
if (blocs.length) {
  const marque = () => {
    const seuil = innerHeight * .35;
    let actif = 0;
    blocs.forEach((b, i) => { if (b.getBoundingClientRect().top <= seuil) actif = i; });
    liens.forEach((a, i) =>
      i === actif ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
  };
  // Un getBoundingClientRect par bloc à chaque événement scroll force un
  // recalcul de layout synchrone. On se cale sur la frame d'affichage.
  let planifie = false;
  addEventListener('scroll', () => {
    if (planifie) return;
    planifie = true;
    requestAnimationFrame(() => { planifie = false; marque(); });
  }, {passive: true});
  marque();
}

// ── Révélation ────────────────────────────────────────────────
// On observe les conteneurs, jamais leurs enfants : un enfant en
// clip-path:inset(0 0 100%) a une aire d'intersection nulle et ne
// déclencherait jamais l'observateur.
document.documentElement.classList.add('js-reveal');
// Arrivée par retour ou avance dans l'historique : la page est déjà
// connue, on l'affiche telle quelle. Sinon la transition entre documents
// photographierait une page vide et le retour donnerait un écran blanc.
const nav = performance.getEntriesByType('navigation')[0];
if (nav && nav.type === 'back_forward') {
  document.querySelectorAll('.bloc,.entete').forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold: 0, rootMargin: '0px 0px -10% 0px'});
  document.querySelectorAll('.bloc,.entete').forEach(el => io.observe(el));
}
setTimeout(() =>
  document.querySelectorAll('.bloc:not(.in),.entete:not(.in)')
    .forEach(el => el.classList.add('in')), 1500);
