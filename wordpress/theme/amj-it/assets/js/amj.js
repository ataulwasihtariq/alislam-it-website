/* alislam.it – script minimo: menu mobile. Nessuna dipendenza. */
(function () {
  var b = document.querySelector('.amj-burger'), n = document.querySelector('.amj-nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
