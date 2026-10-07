(function () {
    'use strict';
    var D = window.DATA, $ = function (s) { return document.querySelector(s); };
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, hasG = !!window.gsap;
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

    /* ---- Lenis ---- */
    var lenis = null;
    if (window.Lenis && !reduce) {
        lenis = new Lenis({ lerp: .09 });
        if (hasG) { gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
        else (function f(t) { lenis.raf(t); requestAnimationFrame(f); })(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) { var t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); lenis ? lenis.scrollTo(t, { offset: -64 }) : t.scrollIntoView(); });
    });

    /* ---- Pita komponen: berjalan pelan, melaju mengikuti kecepatan scroll ---- */
    var mq = $('#mq'), mx = 0, mw = 0, mv = true, ml = scrollY, mvel = 0, mh = '';
    for (var r = 0; r < 4; r++) D.lab.forEach(function (it) { mh += '<span>' + it.t + '</span>'; });
    mq.innerHTML = mh + mh;
    new IntersectionObserver(function (e) { mv = e[0].isIntersecting; }).observe(mq);
    addEventListener('resize', function () { mw = 0; });
    (function mm() {
        requestAnimationFrame(mm);
        var dy = scrollY - ml; ml = scrollY; mvel += (dy - mvel) * .1;
        if (!mv || reduce) return;
        if (!mw) mw = mq.scrollWidth / 2;
        mx -= .6 + mvel * .35;
        if (mx <= -mw) mx += mw; if (mx > 0) mx -= mw;
        mq.style.transform = 'translateX(' + mx + 'px)';
    })();

    /* ---- Cincin tiga unsur: seret/panah keyboard memutar, klik membuka penjelasan ---- */
    var ring = $('#ring'), rin = $('#ring-in'), pns = [], rcur = 0, tgt = 0, rv = true, ra = -1, RZ = 0, STEP = 64, RN = D.unsur.length, rd = null, moved = false;
    var ART = [
        '<div class="art a0" aria-hidden="true"><i class="l1"></i><i class="l2"></i><i class="l3"></i></div>',
        '<div class="art a1" aria-hidden="true"><div class="win"><u></u><i></i><i></i><i></i><i></i><b></b></div></div>',
        '<div class="art a2" aria-hidden="true"><span class="o1"><i></i></span><span class="o2"><i></i></span><b></b></div>'
    ];
    function go(n) { tgt = Math.max(0, Math.min(RN - 1, n)); }
    function chips(u) { var ul = el('ul'); u.contoh.forEach(function (x) { ul.appendChild(el('li', '', x)); }); return ul; }
    function scrollToEl(t, off) { var y = t.getBoundingClientRect().top + scrollY + (off || 0); if (lenis) { lenis.resize(); lenis.scrollTo(y); } else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); }

    /* penjelasan khusus per komponen (isi dari data.js; field opsional u.detail = [{judul, teks}]) */
    var det = $('#detail'), db = $('#dbody'), dpn = [], gbs = [], cur = -1;
    function show(i) { dpn.forEach(function (d, k) { d.hidden = k !== i; }); }
    function labels() { gbs.forEach(function (g, k) { g.textContent = (cur === k && !det.hidden) ? 'Tutup penjelasan' : 'Buka penjelasan'; }); }
    function closeD() { det.hidden = true; cur = -1; labels(); scrollToEl($('#sistem'), -12); }
    function open(i) { if (!det.hidden && cur === i) { closeD(); return; } cur = i; det.hidden = false; show(i); labels(); scrollToEl(det, -12); }
    $('#dback').onclick = closeD;
    D.unsur.forEach(function (u, i) {
        var d = el('div', 'dp p' + i), t = el('div', 'dt');

        t.appendChild(el('h3', '', u.nama)); t.appendChild(el('p', '', u.ringkas)); t.appendChild(chips(u));
        (u.detail || []).forEach(function (x) { var r = el('div', 'drow'); r.appendChild(el('h4', '', x.judul)); r.appendChild(el('p', '', x.teks)); t.appendChild(r); });
        d.appendChild(t); d.insertAdjacentHTML('beforeend', ART[i] || ''); d.hidden = true; db.appendChild(d); dpn.push(d);

        var p = el('article', 'pn p' + i), tx = el('div', 'pt'), g = el('button', 'pgo', 'Buka penjelasan'), hold = 0;
        tx.appendChild(el('h3', '', u.nama)); tx.appendChild(el('p', '', u.ringkas)); tx.appendChild(chips(u));
        p.appendChild(tx); p.insertAdjacentHTML('beforeend', ART[i] || ''); p.appendChild(g);
        gbs.push(g); g.onclick = function (e) { e.stopPropagation(); open(i); };
        p.addEventListener('click', function () { if (moved) return; if (Math.round(rcur) === i) open(i); else go(i); });
        /* tahan (layar sentuh) = efek yang sama dengan hover */
        p.addEventListener('pointerdown', function () { hold = setTimeout(function () { p.classList.add('hot'); }, 180); });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { p.addEventListener(ev, function () { clearTimeout(hold); p.classList.remove('hot'); }); });
        rin.appendChild(p); pns.push(p);
    });
    function rsize() {
        var W = Math.min(ring.clientWidth * .94, 1240); RZ = W * .9;
        pns.forEach(function (p, i) { p.style.width = W + 'px'; p.style.marginLeft = (-W / 2) + 'px'; p.style.transform = 'rotateY(' + (i * STEP) + 'deg) translateZ(' + RZ + 'px)'; });
    }
    addEventListener('resize', rsize); rsize();
    ring.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
        e.preventDefault(); go(Math.max(0, Math.min(RN - 1, ra + k)));
    });
    /* seret mendatar memutar cincin; gerak vertikal tetap menggulir halaman (touch-action: pan-y) */
    ring.addEventListener('pointerdown', function (e) { rd = { x: e.clientX, t: tgt }; moved = false; });
    addEventListener('pointermove', function (e) {
        if (!rd) return; var dx = e.clientX - rd.x;
        if (Math.abs(dx) > 8) { moved = true; ring.classList.add('drag'); }
        if (moved) tgt = Math.max(-.3, Math.min(RN - .7, rd.t - dx / (ring.clientWidth * .28)));
    });
    function rup() { if (!rd) return; rd = null; ring.classList.remove('drag'); go(Math.round(tgt)); setTimeout(function () { moved = false; }, 60); }
    addEventListener('pointerup', rup); addEventListener('pointercancel', rup);
    /* scroll mendatar (touchpad laptop / Shift + wheel) memutar cincin; scroll vertikal tetap menggulir halaman */
    var rwt = 0;
    ring.addEventListener('wheel', function (e) {
        var hz = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (!hz && !e.shiftKey) return;
        e.preventDefault(); e.stopPropagation();
        tgt = Math.max(-.3, Math.min(RN - .7, tgt + (hz ? e.deltaX : e.deltaY) * .004));
        clearTimeout(rwt); rwt = setTimeout(function () { go(Math.round(tgt)); }, 160);
    }, { passive: false });
    new IntersectionObserver(function (e) { rv = e[0].isIntersecting; }).observe(ring);
    (function rl() {
        requestAnimationFrame(rl);
        if (!rv && Math.abs(tgt - rcur) < .002) return;
        rcur += (tgt - rcur) * (reduce ? 1 : .14);
        rin.style.transform = 'translateZ(' + (-RZ) + 'px) rotateY(' + (-rcur * STEP) + 'deg)';
        pns.forEach(function (q, i) { q.style.opacity = Math.max(.15, 1 - Math.abs(i - rcur) * .6); });
        var a = Math.max(0, Math.min(RN - 1, Math.round(rcur)));
        if (a !== ra) {
            ra = a;
            pns.forEach(function (q, i) { q.classList.toggle('on', i === a); });
        }
    })();

    /* ---- Kuis ---- */
    var qz = $('#quiz'), qi = 0, sc = 0, QN = 8, qset = [], qseen = [];
    /* tiap ronde mengambil QN soal acak dari bank, mengutamakan yang belum keluar; urutan pilihan juga diacak */
    var TP = [[0, 'Tiga unsur', 'sistem'], [16, 'Alur kerja', 'alur'], [22, 'Jenis komputer', 'jenis'], [37, 'Raspberry Pi dan Arduino', 'jenis'], [44, 'Interaksi', 'interaksi'], [49, 'GUI', 'gui'], [60, 'Pendalaman', 'dalam'], [76, 'Contoh hardware dan software', 'sistem']];
    function topic(i) { var t = TP[0]; TP.forEach(function (x) { if (i >= x[0]) t = x; }); return t; }
    function qround() {
        var all = D.kuisBank.map(function (x, i) { return { x: x, i: i }; }), pool = all.filter(function (p) { return qseen.indexOf(p.i) < 0; });
        if (pool.length < QN) { qseen = []; pool = all; }
        qset = shuf(pool).slice(0, QN).map(function (p) {
            qseen.push(p.i);
            return { tp: topic(p.i), q: p.x.q, e: p.x.e, o: shuf(p.x.o.map(function (t, k) { return { t: t, ok: k === p.x.a }; })) };
        });
        qi = 0; sc = 0;
    }
    function quiz() {
        qz.innerHTML = '';
        if (qi >= qset.length) {
            var by = {}, k, r, rate = sc / qset.length;
            qset.forEach(function (x) { var g = by[x.tp[1]] = by[x.tp[1]] || { n: 0, ok: 0, pg: x.tp[2], w: [] }; g.n++; if (x.res) g.ok++; else g.w.push(x); });
            qz.appendChild(el('p', 'qn', 'Skor akhir')); qz.appendChild(el('big', '', sc + '/' + qset.length));
            qz.appendChild(el('p', 'qlv', rate >= .85 ? 'Pemahamanmu sudah kuat. Coba ronde baru untuk soal lain.' : rate >= .6 ? 'Pemahamanmu cukup. Ada beberapa topik yang perlu diulang.' : 'Masih banyak yang perlu diulang. Baca lagi topik di bawah, lalu coba ronde baru.'));
            var ls = el('div', 'qrs'), weak = [];
            for (k in by) {
                r = el('div', 'qr'); r.appendChild(el('span', '', k)); r.appendChild(el('b', '', by[k].ok + '/' + by[k].n));
                var bar = el('i'), fl = el('u'); fl.style.width = Math.round(by[k].ok / by[k].n * 100) + '%'; bar.appendChild(fl); r.appendChild(bar); ls.appendChild(r);
                if (by[k].ok < by[k].n) weak.push(k);
            }
            qz.appendChild(ls);
            if (weak.length) {
                qz.appendChild(el('h4', 'qh', 'Yang perlu ditingkatkan'));
                weak.forEach(function (k) {
                    var bx = el('div', 'qw'), a = el('a', 'qa', 'Pelajari lagi: ' + k); a.href = '#' + by[k].pg; bx.appendChild(a);
                    var ul = el('ul'); by[k].w.forEach(function (x) { var li = el('li'); li.appendChild(el('b', '', x.q)); li.appendChild(el('span', '', ' ' + x.e)); ul.appendChild(li); });
                    bx.appendChild(ul); qz.appendChild(bx);
                });
            } else qz.appendChild(el('p', 'qlv', 'Semua topik yang keluar di ronde ini sudah benar.'));
            var r2 = el('button', 'btn', 'Soal baru (diacak)'); r2.type = 'button'; r2.onclick = function () { qround(); quiz(); }; qz.appendChild(r2); return;
        }
        var it = qset[qi], fb = el('p', 'fb'), nx = el('button', 'btn', qi === qset.length - 1 ? 'Lihat skor' : 'Soal berikutnya');
        nx.type = 'button'; nx.hidden = true; nx.onclick = function () { qi++; quiz(); };
        var pg = el('div', 'qpg'); pg.appendChild(el('i')); pg.firstChild.style.width = (qi / qset.length * 100) + '%'; qz.appendChild(pg); qz.appendChild(el('p', 'qn', 'Soal ' + (qi + 1) + ' dari ' + qset.length)); qz.appendChild(el('h3', '', it.q));
        var os = it.o.map(function (op) {
            var o = el('button', 'opt', op.t); o.type = 'button';
            o.onclick = function () {
                os.forEach(function (x, j) { x.disabled = true; if (it.o[j].ok) x.classList.add('ok'); });
                it.res = op.ok; if (op.ok) sc++; else o.classList.add('bad');
                fb.textContent = (op.ok ? 'Benar. ' : 'Belum tepat. ') + it.e; nx.hidden = false;
            };
            qz.appendChild(o); return o;
        });
        qz.appendChild(fb); qz.appendChild(nx);
    }
    qround(); quiz();

    /* ---- Alur: ketik sesuatu, lihat datanya lewat input, proses, output ---- */
    var A = D.alur, ain = $('#a-in'), sts = [].slice.call(document.querySelectorAll('.ast')), ars = [].slice.call(document.querySelectorAll('.aar')),
        abox = [$('#a-keys'), $('#a-code'), $('#a-out')], built = [null, null, null], asel = 0, atm = []; var ct = 'Halo';
    function atext() { return ain.value.replace(/[^\x20-\x7E]/g, '').slice(0, 8) || 'A'; }
    function bits(n) { return ('00000000' + n.toString(2)).slice(-8); }
    function fillA(j, t) {
        var b = abox[j], k; b.innerHTML = ''; if (t === null) return;
        t.split('').forEach(function (ch, n) {
            var sh = ch === ' ' ? 'spasi' : ch, e;
            if (j === 0) e = el('kbd', '', sh);
            else if (j === 1) {
                e = el('div', 'arow'); e.appendChild(el('b', '', sh)); e.appendChild(el('span', '', '= ' + ch.charCodeAt(0))); e.appendChild(el('code', '', bits(ch.charCodeAt(0))));
            } else e = el('span', '', ch === ' ' ? '\u00a0' : ch);
            e.style.setProperty('--d', n); b.appendChild(e);
        });
        if (j === 2) b.appendChild(el('i', 'cur'));
    }
    function apick(i) {
        var t = ct; asel = i;
        sts.forEach(function (s, j) { s.classList.toggle('on', j === i); s.classList.toggle('done', j <= i); s.setAttribute('aria-pressed', j === i); });
        ars.forEach(function (a, k) { a.classList.toggle('go', k < i); });
        abox.forEach(function (b, j) { var want = j <= i ? t : null; if (built[j] !== want) { built[j] = want; fillA(j, want); } });
        $('#adesc').textContent = A[i].desc + (i === 1 ? ' Di komputer, setiap karakter disimpan sebagai kode angka (ASCII) dalam bentuk biner. Huruf "' + t.charAt(0) + '" berkode ' + t.charCodeAt(0) + ', ditulis ' + bits(t.charCodeAt(0)) + '.' : '');
    }
    function arun() {
        atm.forEach(clearTimeout); atm = []; ct = atext(); built = [null, null, null]; apick(0);
        [1, 2].forEach(function (i) { atm.push(setTimeout(function () { apick(i); }, i * (reduce ? 600 : 1800))); });
    }
    sts.forEach(function (s, i) {
        s.onclick = function () { atm.forEach(clearTimeout); apick(i); };
        s.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.click(); } };
    });
    $('#a-form').onsubmit = function (e) { e.preventDefault(); arun(); };
    ain.addEventListener('input', function () { var v = atext(); if (ain.value !== v && ain.value) ain.value = v; });
    ct = atext(); apick(0);

    /* ---- Lab klasifikasi: tiap ronde mengacak komponen dari bank ---- */
    var cl = $('#cloud'), lfb = $('#lab-fb'), lsc = $('#lab-sc'), zs = $('#zones'), zl = [], tiles = [], lsel = null, ld = 0, dg = null, wasDrag = false,
        ZN = ['Hardware', 'Software', 'Pengguna'], PER = 4, coarse = matchMedia('(pointer:coarse)').matches;
    function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function lmark() { tiles.forEach(function (t) { t.setAttribute('aria-pressed', t === lsel); }); zs.classList.toggle('pick', !!lsel); lsc.textContent = ld + ' dari ' + tiles.length + ' benar'; }
    function back(b) { b.classList.remove('drag'); b.style.transform = ''; }
    function drop(b, z) {
        if (+b.dataset.z === z) {
            b.classList.add('ok'); b.disabled = true; b.style.cssText = ''; zl[z].appendChild(b); ld++; lsel = null;
            lfb.textContent = 'Benar. ' + b.textContent + ' termasuk ' + ZN[z] + '.' + (ld === tiles.length ? ' Semua tepat. Tekan Acak ulang untuk ronde baru.' : '');
        } else { back(b); lfb.textContent = 'Belum tepat. ' + b.textContent + ' bukan ' + ZN[z] + '. Coba lagi.'; }
        lmark();
    }
    ZN.forEach(function (n, z) {
        var d = el('div', 'zone z' + z), l = el('div', 'zl'), b = el('button', 'zb', 'Taruh di ' + n); b.type = 'button';
        d.dataset.z = z; d.appendChild(el('h3', '', n)); d.appendChild(l); d.appendChild(b); zs.appendChild(d); zl.push(l);
        b.onclick = function () { if (lsel) drop(lsel, z); else lfb.textContent = 'Pilih satu komponen dulu.'; };
        d.addEventListener('click', function (e) { if (lsel && !e.target.closest('.zb')) drop(lsel, z); });
    });
    function tile(it) {
        var b = el('button', 'tile', it.t); b.type = 'button'; b.dataset.z = it.z;
        b.addEventListener('click', function () { if (wasDrag) return; lsel = lsel === b ? null : b; lmark(); });
        if (!coarse) {
            b.addEventListener('pointerdown', function (e) { dg = { b: b, x: e.clientX, y: e.clientY, m: false }; b.setPointerCapture(e.pointerId); });
            b.addEventListener('pointermove', function (e) {
                if (!dg || dg.b !== b) return; var dx = e.clientX - dg.x, dy = e.clientY - dg.y;
                if (!dg.m && Math.hypot(dx, dy) < 6) return;
                dg.m = true; b.classList.add('drag'); b.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
            });
            b.addEventListener('pointerup', function (e) {
                var s = dg; dg = null; if (!s || !s.m) return; wasDrag = true; setTimeout(function () { wasDrag = false; }, 60);
                var z = document.elementsFromPoint(e.clientX, e.clientY).filter(function (n) { return n.classList && n.classList.contains('zone'); })[0];
                if (z) drop(b, +z.dataset.z); else back(b);
            });
        }
        return b;
    }
    function lround() {
        var pick = [];
        [0, 1, 2].forEach(function (z) { pick = pick.concat(shuf(D.labBank.filter(function (x) { return x.z === z; })).slice(0, PER)); });
        cl.innerHTML = ''; zl.forEach(function (l) { l.innerHTML = ''; }); ld = 0; lsel = null; dg = null;
        tiles = shuf(pick).map(function (it) { var b = tile(it); cl.appendChild(b); return b; });
        lfb.textContent = 'Ronde baru: kelompokkan ' + tiles.length + ' komponen.'; lmark();
    }
    $('#lab-new').onclick = lround; lround();

    /* ---- 3D: chip ---- */
    if (!window.THREE) return;
    function mat(c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .45, metalness: .35 }, o || {})); }
    function bx(w, h, d, m, x, y, z, par) { var b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); par.add(b); return b; }
    function chip() {
        var g = new THREE.Group(), P = {}, k, p, gold = mat(0xd9b36a, { metalness: .8, roughness: .3 });
        var glow = mat(0x14d4be, { emissive: 0x14d4be, emissiveIntensity: 1.3 }); glow.userData.glow = 1;
        ['ihs', 'die', 'substrate', 'pads'].forEach(function (n) { P[n] = new THREE.Group(); g.add(P[n]); });
        bx(3, .14, 3, mat(0x14543a), 0, 0, 0, P.substrate);
        for (k = 0; k < 12; k++) {
            p = -1.3 + k * .236;
            bx(.12, .03, .22, gold, p, .085, 1.4, P.pads); bx(.12, .03, .22, gold, p, .085, -1.4, P.pads);
            bx(.22, .03, .12, gold, 1.4, .085, p, P.pads); bx(.22, .03, .12, gold, -1.4, .085, p, P.pads);
        }
        bx(1.4, .1, 1.4, mat(0x8fa3ad, { metalness: .7, roughness: .3 }), 0, .12, 0, P.die); bx(.7, .02, .7, glow, 0, .18, 0, P.die);
        bx(1.9, .12, 1.9, mat(0xdfe5e6, { metalness: .7, roughness: .28 }), 0, .28, 0, P.ihs); bx(.5, .01, .5, glow, 0, .345, 0, P.ihs);
        return { g: g, P: P };
    }
    function stage(cv, z) {
        var R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); R.setPixelRatio(Math.min(devicePixelRatio, 2));
        var S = new THREE.Scene(), C = new THREE.PerspectiveCamera(35, 1, .1, 50); C.position.set(0, 2.4, z); C.lookAt(0, 0, 0);
        S.add(new THREE.AmbientLight(0xffffff, .85));
        var a = new THREE.DirectionalLight(0xffffff, 1.5); a.position.set(3, 5, 4); S.add(a);
        var b = new THREE.DirectionalLight(0x9fe9de, .7); b.position.set(-4, 2, -3); S.add(b);
        var o = { R: R, S: S, C: C, vis: true, fit: null, size: function () { var w = cv.clientWidth, h = cv.clientHeight; R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix(); if (o.fit) o.fit(w, h); } };
        new IntersectionObserver(function (e) { o.vis = e[0].isIntersecting; }).observe(cv);
        addEventListener('resize', o.size); return o;
    }

    var H = stage($('#chip'), 8.5), hc = chip(), tx = 0, ty = 0;
    H.S.add(hc.g); hc.g.rotation.x = .5;
    H.fit = function (w) {
        /* ponsel: chip lebih kecil dan turun ke bawah judul supaya tidak menutupi tulisan */
        var ph = w <= 600;
        hc.g.scale.setScalar(w > 900 ? 1.25 : ph ? .8 : .95); hc.g.position.y = w > 900 ? .2 : ph ? -.45 : .5;
    };
    H.size();
    if (matchMedia('(pointer:fine)').matches && innerWidth >= 700) addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
    /* chip tersembunyi selama splash; naik saat tombol Masuk diklik */
    var hold = !!document.getElementById('intro');
    function heroIn() {
        hc.g.visible = true;
        if (!hasG || reduce) return;
        if (!hold) gsap.from('.hero__t span', { yPercent: 40, opacity: 0, duration: 1.3, stagger: .12, ease: 'expo.out' });
        gsap.from('#chip', { yPercent: 75, duration: 2.1, ease: 'expo.out' });
        gsap.from(hc.P.ihs.position, { y: 4.5, duration: 1.7, ease: 'expo.out', delay: .1 });
        gsap.from(hc.P.die.position, { y: 3, duration: 1.6, ease: 'expo.out', delay: .25 });
        gsap.from(hc.P.pads.position, { y: -2.5, duration: 1.5, ease: 'expo.out', delay: .4 });
        gsap.from(hc.g.rotation, { y: -1.4, duration: 2.2, ease: 'expo.out' });
    }
    if (hold) { hc.g.visible = false; window.heroIn = heroIn; } else heroIn();

    (function loop(t) {
        requestAnimationFrame(loop);
        if (H.vis) {
            if (!reduce) { hc.g.rotation.y = t * .0004 + scrollY * .003 + tx * .8; hc.g.rotation.x = .5 + ty * .3; }
            var hp = reduce ? 0 : Math.min(1, scrollY / (innerHeight * .9));
            if (hp > 0 || hc.s) { hc.s = hp > 0; hc.P.ihs.position.y = hp * 2.2; hc.P.die.position.y = hp * 1.1; hc.P.pads.position.y = -hp * .5; }
            H.R.render(H.S, H.C);
        }
    })(0);
})();