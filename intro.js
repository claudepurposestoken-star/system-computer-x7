(function () {
    'use strict';
    var d = document, i = d.getElementById('intro'), h = d.documentElement;
    if (!i) return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    scrollTo(0, 0);
    var t = i.querySelector('.intro__t'), b = i.querySelector('.intro__go'), win = i.querySelector('.intro__tw'),
        reduce = matchMedia('(prefers-reduced-motion: reduce)').matches,
        coarse = matchMedia('(pointer:coarse)').matches, on = false, out = false;

    /* judul kecil di atas jendela; saat transisi turun dan tumbuh ke ukuran hero */
    function place() {
        if (out) return;
        var H = win.clientHeight;
        t.style.setProperty('--ty', (H * .17 - (t.offsetTop + t.offsetHeight / 2)) + 'px');
    }
    place(); addEventListener('resize', place);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(place);

    if (!reduce) {
        /* bit biner melayang naik */
        var bt = i.querySelector('.i-bits'), f = d.createDocumentFragment();
        for (var n = 0; n < 16; n++) {
            var s = d.createElement('i');
            s.textContent = Math.random() > .5 ? '1' : '0';
            s.style.cssText = 'left:' + Math.random() * 96 + '%;top:' + (35 + Math.random() * 45) + '%;font-size:' + (16 + Math.random() * 14) + 'px;animation-duration:' + (9 + Math.random() * 8) + 's;animation-delay:-' + Math.random() * 14 + 's';
            f.appendChild(s);
        }
        bt.appendChild(f);

        /* paralaks kedalaman: mouse di desktop, ayunan pelan di ponsel */
        var ls = [].slice.call(i.querySelectorAll('.i-ly')), tx = 0, ty = 0, mx = 0, my = 0;
        on = true;
        addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse') return;
            tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2;
        }, { passive: true });
        (function loop(ms) {
            if (!on) return;
            if (coarse) { tx = Math.sin(ms / 2600) * .7; ty = Math.cos(ms / 3400) * .3; }
            mx += (tx - mx) * .06; my += (ty - my) * .06;
            ls.forEach(function (l) {
                var q = +l.dataset.d;
                l.style.transform = 'translate3d(' + (-mx * q).toFixed(2) + 'px,' + (-my * q * .5).toFixed(2) + 'px,0) scale(1.08)';
            });
            requestAnimationFrame(loop);
        })(0);
    }

    b.focus({ preventScroll: true });
    var cv = d.getElementById('chip'), ph, fly;
    b.addEventListener('click', function () {
        if (out) return; out = true;
        i.classList.add('out'); h.classList.add('intro-go'); scrollTo(0, 0);
        /* chip dipindah ke lapisan paling depan, langsung naik dari bawah */
        if (cv) {
            ph = d.createComment(''); cv.parentNode.insertBefore(ph, cv);
            fly = d.createElement('div'); fly.className = 'intro__fly'; d.body.appendChild(fly); fly.appendChild(cv);
        }
        if (window.heroIn) window.heroIn();
        /* judul dan chip asli kembali ke hero saat ukurannya sudah sama */
        setTimeout(function () {
            h.classList.remove('intro-wait');
            if (cv && ph) { ph.parentNode.insertBefore(cv, ph); ph.remove(); fly.remove(); }
        }, reduce ? 50 : 1440);
        setTimeout(function () { on = false; h.classList.remove('intro-lock', 'intro-go'); i.remove(); }, reduce ? 120 : 1520);
    });
})();