/* Commun aux trois pages de case study : localisation, curseur, révélation. */

// ── Localisation ──────────────────────────────────────────────
const btnLangue = document.getElementById('langue');
function applique(lang){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(el => {
    if (!el.dataset.fr) el.dataset.fr = el.innerHTML;
    el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.fr;
  });
  btnLangue.textContent = lang === 'en' ? 'FR' : 'EN';
  btnLangue.setAttribute('aria-label', lang === 'en' ? 'Passer en français' : 'Switch to English');
  try { localStorage.setItem('folio-lang', lang); } catch(e) {}
}
let lang;
try { lang = localStorage.getItem('folio-lang'); } catch(e) {}
if (lang !== 'fr' && lang !== 'en') {
  const dispo = navigator.languages && navigator.languages.length
    ? navigator.languages : [navigator.language || 'en'];
  lang = dispo.some(l => l.toLowerCase().startsWith('fr')) ? 'fr' : 'en';
}
applique(lang);
btnLangue.addEventListener('click', () =>
  applique(document.documentElement.lang === 'en' ? 'fr' : 'en'));

// ── Curseur ───────────────────────────────────────────────────
const cur = document.getElementById('cur');
addEventListener('pointermove', e => {
  cur.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
});
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('pointerenter', () => cur.classList.add('big'));
  el.addEventListener('pointerleave', () => cur.classList.remove('big'));
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
      i === actif ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  };
  addEventListener('scroll', marque, {passive: true});
  marque();
}

// ── Révélation ────────────────────────────────────────────────
// On observe les conteneurs, jamais leurs enfants : un enfant en
// clip-path:inset(0 0 100%) a une aire d'intersection nulle et ne
// déclencherait jamais l'observateur.
document.documentElement.classList.add('js-reveal');
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold: 0, rootMargin: '0px 0px -10% 0px'});
document.querySelectorAll('.bloc,.entete').forEach(el => io.observe(el));
setTimeout(() =>
  document.querySelectorAll('.bloc:not(.in),.entete:not(.in)')
    .forEach(el => el.classList.add('in')), 1500);
