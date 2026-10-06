(function () {
  var stage = document.getElementById('stage');
  var slides = [].slice.call(stage.querySelectorAll('.slide'));
  var pos = document.getElementById('pos');
  var cur = 0;

  function fit() {
    var s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = 'translate(' + (-960 * s) + 'px,' + (-540 * s) + 'px) scale(' + s + ')';
  }
  function go(n) {
    cur = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, i) { s.classList.toggle('on', i === cur); });
    pos.textContent = (cur + 1) + ' / ' + slides.length;
    try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {}
  }
  function fs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }

  addEventListener('resize', fit);
  fit();

  addEventListener('keydown', function (e) {
    if (/^(ArrowRight|ArrowDown|PageDown| |Enter)$/.test(e.key)) { e.preventDefault(); go(cur + 1); }
    else if (/^(ArrowLeft|ArrowUp|PageUp|Backspace)$/.test(e.key)) { e.preventDefault(); go(cur - 1); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
    else if (e.key === 'f' || e.key === 'F') fs();
  });
  document.getElementById('prev').onclick = function (e) { e.stopPropagation(); go(cur - 1); };
  document.getElementById('next').onclick = function (e) { e.stopPropagation(); go(cur + 1); };
  document.getElementById('fs').onclick = function (e) { e.stopPropagation(); fs(); };
  stage.addEventListener('click', function (e) { go(e.clientX > innerWidth / 2 ? cur + 1 : cur - 1); });

  var x0 = null;
  addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0;
    if (Math.abs(d) > 50) go(cur + (d < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  function fromHash() { go((parseInt(location.hash.slice(1), 10) || 1) - 1); }
  addEventListener('hashchange', function () { if ((parseInt(location.hash.slice(1), 10) || 1) - 1 !== cur) fromHash(); });
  fromHash();
})();
