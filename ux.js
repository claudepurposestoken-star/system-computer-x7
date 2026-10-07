/* ux.js: dock navigasi bawah bersembunyi saat menggulir turun, muncul saat menggulir naik atau saat kursor di tepi bawah */
(function () {
    'use strict';
    var nav = document.querySelector('.pill nav'); if (!nav) return;
    var last = scrollY, hid = false;
    function set(h) { if (h !== hid) { hid = h; nav.classList.toggle('nav-hide', h); } }
    addEventListener('scroll', function () {
        var y = scrollY, dy = y - last; if (Math.abs(dy) < 10) return; last = y;
        set(dy > 0 && y > 120);
    }, { passive: true });
    addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && innerHeight - e.clientY < 80) set(false); }, { passive: true });
    nav.addEventListener('focusin', function () { set(false); });
    addEventListener('hashchange', function () { set(false); });
})();