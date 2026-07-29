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
// Sur un visuel, deux choses : le mélange `difference` est neutralisé — les
// visuels sont les seules surfaces claires de la page, le rouge y virerait au
// cyan — et le curseur prend un « + », le clic agrandissant l'image au lieu
// d'ouvrir une page.
document.querySelectorAll('figure').forEach(el => {
  el.addEventListener('pointerenter', () => cur.classList.add('sur-visuel', 'big', 'zoom'));
  el.addEventListener('pointerleave', () => cur.classList.remove('sur-visuel', 'big', 'zoom'));
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

// ── Visionneuse ───────────────────────────────────────────────
// Mêmes gestes que le carrousel de l'accueil : clic pour agrandir, flèches
// pour naviguer, Échap pour fermer. Le balisage est construit ici plutôt
// que recopié dans les trois pages.
(() => {
  const visuels = [...document.querySelectorAll('figure img')];
  if (!visuels.length) return;

  const loupe = document.createElement('div');
  loupe.className = 'loupe';
  loupe.setAttribute('role', 'dialog');
  loupe.setAttribute('aria-modal', 'true');
  loupe.innerHTML =
    '<div class="loupe-barre"><span><b></b> <span></span></span>' +
    '<button type="button"></button></div>' +
    '<img alt="">' +
    '<div class="loupe-nav"><button type="button">&#8592;</button>' +
    '<button type="button">&#8594;</button></div>';
  document.body.append(loupe);

  const img = loupe.querySelector('img');
  const titre = loupe.querySelector('.loupe-barre b');
  const num = loupe.querySelector('.loupe-barre span span');
  const [btnFermer, btnPrec, btnSuiv] = loupe.querySelectorAll('button');

  // i18n.js a déjà tourné quand ce script s'exécute : la visionneuse n'est
  // donc pas traduite par lui. On applique la langue nous-mêmes, et on
  // rejoue au clic sur le bouton — notre écouteur passe après le sien,
  // donc `lang` est déjà à jour.
  const mots = {
    fr: {fermer: 'Fermer', prec: 'Précédent', suiv: 'Suivant', titre: 'Aperçu'},
    en: {fermer: 'Close', prec: 'Previous', suiv: 'Next', titre: 'Preview'}
  };
  function langue() {
    const m = mots[document.documentElement.lang === 'en' ? 'en' : 'fr'];
    btnFermer.textContent = m.fermer;
    btnPrec.setAttribute('aria-label', m.prec);
    btnSuiv.setAttribute('aria-label', m.suiv);
    loupe.setAttribute('aria-label', m.titre);
  }
  langue();
  document.getElementById('langue')?.addEventListener('click', langue);

  let courant = 0, avantOuverture = null;
  // `inert` neutralise tout l'arrière-plan : au clavier, on ne peut plus
  // tabuler derrière la visionneuse.
  const fond = () => [...document.body.children].filter(el => el !== loupe);

  function ouvre(i) {
    courant = (i + visuels.length) % visuels.length;
    const v = visuels[courant];
    img.src = v.currentSrc || v.src;
    img.alt = v.alt;
    const legende = v.closest('figure').querySelector('figcaption');
    titre.textContent = legende ? legende.textContent.trim() : v.alt;
    num.textContent = String(courant + 1).padStart(2, '0') + ' / ' +
      String(visuels.length).padStart(2, '0');
    if (!loupe.hasAttribute('open')) {
      avantOuverture = document.activeElement;
      fond().forEach(el => el.inert = true);
    }
    loupe.setAttribute('open', '');
    btnFermer.focus();
  }
  function ferme() {
    loupe.removeAttribute('open');
    fond().forEach(el => el.inert = false);
    cur.classList.remove('sur-visuel', 'big', 'zoom');
    if (avantOuverture) avantOuverture.focus();
  }

  visuels.forEach((v, i) => v.addEventListener('click', () => ouvre(i)));
  btnFermer.addEventListener('click', ferme);
  btnPrec.addEventListener('click', () => ouvre(courant - 1));
  btnSuiv.addEventListener('click', () => ouvre(courant + 1));
  loupe.addEventListener('click', e => { if (e.target === loupe) ferme(); });
  addEventListener('keydown', e => {
    if (!loupe.hasAttribute('open')) return;
    if (e.key === 'Escape') ferme();
    if (e.key === 'ArrowLeft') ouvre(courant - 1);
    if (e.key === 'ArrowRight') ouvre(courant + 1);
  });
})();
