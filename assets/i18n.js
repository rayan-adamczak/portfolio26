/* ══════════════════════════════════════════════════════════════
   Localisation, partagée par l'accueil et les études de cas.
   Le français vit dans le HTML, l'anglais dans les attributs data-en.
   Sans JavaScript, la page reste lisible en français.

   Une page peut déclarer window.ARIA = {fr:{…}, en:{…}} où chaque clé
   est un sélecteur : les libellés d'accessibilité suivent alors la
   langue eux aussi.
   ══════════════════════════════════════════════════════════════ */
(function () {
  const bouton = document.getElementById('langue');
  if (!bouton) return;

  function applique(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.dataset.fr) el.dataset.fr = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.fr;
    });

    const aria = (window.ARIA || {})[lang];
    if (aria) {
      Object.entries(aria).forEach(([sel, texte]) => {
        const el = document.querySelector(sel);
        if (el) el.setAttribute('aria-label', texte);
      });
    }

    bouton.textContent = lang === 'en' ? 'FR' : 'EN';
    bouton.setAttribute('aria-label',
      lang === 'en' ? 'Passer en français' : 'Switch to English');

    try { localStorage.setItem('folio-lang', lang); } catch (e) {}
  }

  // Choix explicite > langues du navigateur. Tout ce qui n'est pas
  // francophone bascule en anglais.
  let lang;
  try { lang = localStorage.getItem('folio-lang'); } catch (e) {}
  if (lang !== 'fr' && lang !== 'en') {
    const dispo = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];
    lang = dispo.some(l => l.toLowerCase().startsWith('fr')) ? 'fr' : 'en';
  }

  applique(lang);
  bouton.addEventListener('click', () =>
    applique(document.documentElement.lang === 'en' ? 'fr' : 'en'));
})();
