/* bengkel.js: game "Kurir Data" (halaman Praktik, id #bengkel).
   Kamu adalah kurir data di dalam komputer: ambil paket dari perangkat input, proses di CPU, antar ke output yang sewarna.
   Fitur khas: RAM = tas bawaan yang terbatas (mulai 2 slot, bisa ditambah), listrik padam menghapus isi RAM,
   SSD = tempat aman (menyimpan permanen, poin lebih kecil), combo untuk pengantaran beruntun. */
(function () {
    'use strict';
    var root = document.getElementById('bk'); if (!root) return;
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function lerp(a, b, k) { return a + (b - a) * k; }
    var KEY = 'sc-kurir', best = 0; try { best = +localStorage.getItem(KEY) || 0; } catch (e) { }

    var W = 520, H = 460, DUR = 90, SP = 210, STAR = [150, 300, 450], MAXRAM = 5;
    var TYPES = [{ n: 'Teks', c: '#14d4be' }, { n: 'Gambar', c: '#f5a35c' }, { n: 'Suara', c: '#f2c14e' }];
    var INS = [{ n: 'Keyboard', t: 0, x: 72, y: 115 }, { n: 'Scanner', t: 1, x: 72, y: 235 }, { n: 'Mikrofon', t: 2, x: 72, y: 355 }];
    var OUTS = [{ n: 'Monitor', t: 0, x: 448, y: 115 }, { n: 'Printer', t: 1, x: 448, y: 235 }, { n: 'Speaker', t: 2, x: 448, y: 355 }];
    var CPU = { x: 260, y: 200 }, SSD = { x: 260, y: 400 };
    var INK = '#0C0F0E', CREAM = '#F2EDE4', FB = '"Schibsted Grotesk",system-ui,sans-serif', FD = '"Big Shoulders Display",Impact,sans-serif';
    var C = { deep: '#274f82', board: '#33649f', line: '#7aa6d6' }, cf = 0;

    /* ---------- kerangka ---------- */
    var top = el('div', 'bk-top'), rec = el('p', 'bk-prog'), wrap = el('div', 'kd-wrap'), cv = el('canvas', 'kd-cv'), ov = el('div', 'kd-ov');
    cv.width = W * 2; cv.height = H * 2; cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', 'Papan komputer: perangkat input di kiri, CPU di tengah, perangkat output di kanan, SSD di bawah');
    var cx = cv.getContext('2d'); cx.scale(2, 2);
    top.appendChild(rec); wrap.appendChild(cv); wrap.appendChild(ov);
    root.appendChild(top); root.appendChild(wrap);
    root.appendChild(el('p', 'bk-sm', 'Ketuk atau seret di papan untuk bergerak. Di keyboard: panah atau WASD.'));
    function head() { rec.textContent = 'Rekor: ' + best + ' poin'; } head();
    function colors() {
        var s = getComputedStyle(document.documentElement);
        C.deep = s.getPropertyValue('--deep').trim() || C.deep; C.board = s.getPropertyValue('--deep-2').trim() || C.board; C.line = s.getPropertyValue('--deep-line').trim() || C.line;
    }

    /* ---------- keadaan ---------- */
    var G, keys = {};
    function reset() {
        G = {
            run: false, t: 0, score: 0, streak: 0, slots: 2, ram: [], px: 260, py: 290, tx: null, ty: null,
            ins: INS.map(function (d, i) { return { pk: null, next: .6 + i * 1.1 }; }), proc: 0, hint: 0, del: 0, bank: 0, lost: 0,
            cut: rnd(14, 18), off: 0, pu: null, rp: 18, fl: []
        };
    }
    function mult() { return 1 + Math.min(2, Math.floor(G.streak / 4)); }
    function fl(x, y, s, c) { G.fl.push({ x: x, y: y, t: 0, s: s, c: c || CREAM }); }
    function near(o, r) { return Math.hypot(G.px - o.x, G.py - o.y) < r; }

    /* ---------- pembaruan ---------- */
    function update(dt) {
        G.t += dt; G.hint = Math.max(0, G.hint - dt);
        var diff = G.t / DUR, dx = 0, dy = 0;
        if (keys.arrowleft || keys.a) dx--; if (keys.arrowright || keys.d) dx++; if (keys.arrowup || keys.w) dy--; if (keys.arrowdown || keys.s) dy++;
        if (dx || dy) { var l = Math.hypot(dx, dy); G.px += dx / l * SP * dt; G.py += dy / l * SP * dt; G.tx = null; }
        else if (G.tx != null) { var ax = G.tx - G.px, ay = G.ty - G.py, d = Math.hypot(ax, ay); if (d > 2) { var s = Math.min(d, SP * dt); G.px += ax / d * s; G.py += ay / d * s; } }
        G.px = Math.max(16, Math.min(W - 16, G.px)); G.py = Math.max(76, Math.min(H - 16, G.py));
        G.fl.forEach(function (f) { f.t += dt; }); G.fl = G.fl.filter(function (f) { return f.t < 1.1; });

        /* listrik padam */
        if (G.off > 0) { G.off -= dt; if (G.off <= 0) G.cut = G.t + rnd(14, 19); if (G.t >= DUR) endGame(); return; }
        if (G.t >= G.cut) { G.lost += G.ram.length; G.ram = []; G.streak = 0; G.off = 1.3; G.proc = 0; fl(G.px, G.py - 30, 'RAM kosong!', '#ffb020'); return; }

        /* paket muncul dan kedaluwarsa di perangkat input */
        var pat = lerp(10, 7, diff);
        G.ins.forEach(function (s, i) {
            var d = INS[i];
            if (!s.pk && G.t >= s.next) s.pk = { born: G.t };
            if (s.pk && G.t - s.pk.born > pat) { s.pk = null; G.lost++; G.streak = 0; s.next = G.t + rnd(lerp(1.6, .9, diff), lerp(3.4, 2, diff)); fl(d.x, d.y - 52, 'Terlambat', '#ffb020'); }
            if (s.pk && near(d, 52) && G.ram.length < G.slots) {
                G.ram.push({ t: d.t, done: false }); s.pk = null; s.next = G.t + rnd(lerp(1.6, .9, diff), lerp(3.4, 2, diff));
            } else if (s.pk && near(d, 52) && G.hint <= 0) { fl(G.px, G.py - 28, 'RAM penuh', '#ffb020'); G.hint = 1.2; }
        });

        /* CPU memproses satu paket mentah pada satu waktu */
        var raw = G.ram.filter(function (p) { return !p.done; })[0];
        if (raw && near(CPU, 62)) { G.proc += dt; if (G.proc >= .5) { raw.done = true; G.proc = 0; fl(CPU.x, CPU.y - 56, 'Diproses', '#14d4be'); } } else G.proc = 0;

        /* antar ke output */
        OUTS.forEach(function (o) {
            if (!near(o, 52)) return;
            var got = 0; G.ram = G.ram.filter(function (p) { if (p.done && p.t === o.t) { got++; return false; } return true; });
            if (got) {
                var pts = 0; for (var k = 0; k < got; k++) { G.streak++; pts += 10 * mult(); G.del++; }
                G.score += pts; fl(o.x, o.y - 46, '+' + pts, TYPES[o.t].c);
            } else if (G.ram.length && G.hint <= 0) {
                var mine = G.ram.filter(function (p) { return p.t === o.t; }).length;
                fl(o.x, o.y - 46, mine ? 'Proses dulu' : 'Bukan di sini', '#ffb020'); G.hint = 1.2;
            }
        });

        /* SSD: simpan permanen, poin lebih kecil tetapi aman dari padam */
        if (near(SSD, 60)) {
            var n = 0; G.ram = G.ram.filter(function (p) { if (p.done) { n++; return false; } return true; });
            if (n) { G.score += 4 * n; G.bank += n; fl(SSD.x, SSD.y - 40, 'Tersimpan +' + 4 * n, '#14d4be'); }
            else if (G.ram.length && G.hint <= 0) { fl(SSD.x, SSD.y - 40, 'Proses dulu', '#ffb020'); G.hint = 1.2; }
        }

        /* modul RAM tambahan */
        if (!G.pu && G.slots < MAXRAM && G.t >= G.rp) {
            do { G.pu = { x: rnd(140, 380), y: rnd(96, 330) }; } while (Math.hypot(G.pu.x - CPU.x, G.pu.y - CPU.y) < 80);
        }
        if (G.pu && near(G.pu, 26)) { G.slots++; G.pu = null; G.rp = G.t + rnd(16, 22); fl(G.px, G.py - 30, '+1 slot RAM', '#14d4be'); }
        if (G.t >= DUR) endGame();
    }

    /* ---------- gambar ---------- */
    function rr(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
    function txt(s, x, y, f, c, a) { cx.font = f; cx.fillStyle = c; cx.textAlign = a || 'center'; cx.textBaseline = 'middle'; cx.fillText(s, x, y); }
    var ICON = {
        Keyboard: function (x, y) { for (var r = 0; r < 2; r++) for (var c = 0; c < 5; c++) cx.fillRect(x - 22 + c * 9, y - 7 + r * 9, 7, 7); },
        Scanner: function (x, y) { cx.fillRect(x - 22, y - 1, 44, 12); cx.fillRect(x - 20, y - 8, 40, 4); },
        Mikrofon: function (x, y) { rr(x - 5, y - 13, 10, 17, 5); cx.fill(); cx.beginPath(); cx.arc(x, y - 2, 10, .1 * Math.PI, .9 * Math.PI); cx.stroke(); cx.fillRect(x - 1, y + 8, 2, 6); },
        Monitor: function (x, y) { cx.fillRect(x - 20, y - 13, 40, 24); cx.fillRect(x - 4, y + 11, 8, 4); cx.fillRect(x - 10, y + 15, 20, 2); },
        Printer: function (x, y) { cx.fillRect(x - 20, y - 2, 40, 14); cx.strokeRect(x - 12, y - 13, 24, 11); },
        Speaker: function (x, y) { rr(x - 14, y - 15, 28, 32, 5); cx.fill(); cx.fillStyle = CREAM; cx.beginPath(); cx.arc(x, y + 5, 8, 0, 7); cx.fill(); cx.beginPath(); cx.arc(x, y - 7, 4, 0, 7); cx.fill(); }
    };
    function dev(d) {
        rr(d.x - 44, d.y - 32, 88, 64, 12); cx.fillStyle = CREAM; cx.fill(); cx.lineWidth = 4; cx.strokeStyle = TYPES[d.t].c; cx.stroke();
        cx.fillStyle = INK; cx.strokeStyle = INK; cx.lineWidth = 2; ICON[d.n](d.x, d.y - 8);
        txt(d.n, d.x, d.y + 21, '800 14px ' + FB, INK);
    }
    function pk(x, y, p, a) {
        cx.globalAlpha = a == null ? 1 : a; var c = TYPES[p.t].c;
        rr(x - 9, y - 9, 18, 18, 4);
        if (p.done) { cx.fillStyle = c; cx.fill(); cx.lineWidth = 2; cx.strokeStyle = INK; cx.stroke(); }
        else { cx.fillStyle = 'rgba(12,15,14,.55)'; cx.fill(); cx.lineWidth = 2.5; cx.strokeStyle = c; cx.setLineDash([4, 3]); cx.stroke(); cx.setLineDash([]); }
        cx.globalAlpha = 1;
    }
    function render() {
        if (!(cf++ % 60)) colors();
        cx.clearRect(0, 0, W, H); cx.fillStyle = C.board; cx.fillRect(0, 0, W, H);
        /* jalur sirkuit */
        cx.lineJoin = 'round'; cx.lineCap = 'round'; cx.lineWidth = 5; cx.strokeStyle = C.line; cx.globalAlpha = .4;
        INS.forEach(function (d) { cx.beginPath(); cx.moveTo(d.x + 46, d.y); cx.lineTo(150, d.y); cx.lineTo(190, CPU.y); cx.lineTo(CPU.x - 52, CPU.y); cx.stroke(); });
        OUTS.forEach(function (d) { cx.beginPath(); cx.moveTo(d.x - 46, d.y); cx.lineTo(370, d.y); cx.lineTo(330, CPU.y); cx.lineTo(CPU.x + 52, CPU.y); cx.stroke(); });
        cx.beginPath(); cx.moveTo(CPU.x, CPU.y + 52); cx.lineTo(CPU.x, SSD.y - 24); cx.stroke(); cx.globalAlpha = 1;
        /* SSD */
        rr(SSD.x - 52, SSD.y - 24, 104, 48, 10); cx.fillStyle = CREAM; cx.fill(); cx.lineWidth = 3; cx.strokeStyle = INK; cx.stroke();
        cx.fillStyle = INK; cx.fillRect(SSD.x - 36, SSD.y - 10, 24, 20); cx.fillStyle = '#e0a82e'; cx.fillRect(SSD.x + 40, SSD.y - 24, 8, 48);
        txt('SSD', SSD.x + 12, SSD.y, '900 22px ' + FD, INK);
        /* CPU */
        cx.fillStyle = CREAM; for (var i = 0; i < 5; i++) { cx.fillRect(CPU.x - 52, CPU.y - 32 + i * 16, 7, 5); cx.fillRect(CPU.x + 45, CPU.y - 32 + i * 16, 7, 5); cx.fillRect(CPU.x - 32 + i * 16, CPU.y - 52, 5, 7); cx.fillRect(CPU.x - 32 + i * 16, CPU.y + 45, 5, 7); }
        rr(CPU.x - 45, CPU.y - 45, 90, 90, 14); cx.fillStyle = CREAM; cx.fill(); cx.lineWidth = 3; cx.strokeStyle = INK; cx.stroke();
        rr(CPU.x - 26, CPU.y - 26, 52, 52, 7); cx.fillStyle = INK; cx.fill(); txt('CPU', CPU.x, CPU.y + 1, '900 24px ' + FD, CREAM);
        if (G.proc > 0) { cx.beginPath(); cx.arc(CPU.x, CPU.y, 62, -Math.PI / 2, -Math.PI / 2 + G.proc / .5 * Math.PI * 2); cx.lineWidth = 6; cx.strokeStyle = '#14d4be'; cx.stroke(); }
        INS.forEach(dev); OUTS.forEach(dev);
        /* paket menunggu di input dan cincin kesabaran */
        var pat = lerp(10, 7, G.t / DUR);
        G.ins.forEach(function (s, i) {
            if (!s.pk) return; var d = INS[i], k = 1 - (G.t - s.pk.born) / pat;
            pk(d.x, d.y - 52, { t: d.t, done: false });
            cx.beginPath(); cx.arc(d.x, d.y - 52, 16, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); cx.lineWidth = 3; cx.strokeStyle = k < .3 ? '#ffb020' : CREAM; cx.stroke();
        });
        if (G.pu) { var b = Math.sin(G.t * 6) * 2; rr(G.pu.x - 17, G.pu.y - 9 + b, 34, 18, 3); cx.fillStyle = '#1f6b5a'; cx.fill(); cx.lineWidth = 2; cx.strokeStyle = CREAM; cx.stroke(); cx.fillStyle = '#e0a82e'; cx.fillRect(G.pu.x - 13, G.pu.y + 5 + b, 26, 3); txt('RAM+', G.pu.x, G.pu.y - 1 + b, '800 10px ' + FB, CREAM); }
        /* kurir dan paket bawaan */
        G.ram.forEach(function (p, i) { pk(G.px + (i - (G.ram.length - 1) / 2) * 22, G.py - 28, p); });
        cx.beginPath(); cx.arc(G.px, G.py, 14, 0, 7); cx.fillStyle = '#14d4be'; cx.fill(); cx.lineWidth = 3; cx.strokeStyle = INK; cx.stroke();
        cx.beginPath(); cx.arc(G.px, G.py, 4.5, 0, 7); cx.fillStyle = INK; cx.fill();
        G.fl.forEach(function (f) { cx.globalAlpha = 1 - f.t / 1.1; txt(f.s, f.x, f.y - f.t * 30, '800 16px ' + FB, f.c); cx.globalAlpha = 1; });
        /* HUD */
        txt('RAM', 14, 24, '900 20px ' + FD, CREAM, 'left');
        for (var j = 0; j < MAXRAM; j++) {
            var x = 56 + j * 26; rr(x, 13, 20, 20, 5);
            if (j < G.slots) { cx.lineWidth = 2; cx.strokeStyle = CREAM; cx.stroke(); if (G.ram[j]) pk(x + 10, 23, G.ram[j]); }
            else { cx.lineWidth = 1.5; cx.strokeStyle = 'rgba(242,237,228,.35)'; cx.setLineDash([3, 3]); cx.stroke(); cx.setLineDash([]); }
        }
        txt(Math.max(0, Math.ceil(DUR - G.t)) + ' dtk', W / 2 + 30, 24, '900 22px ' + FD, CREAM);
        txt('Skor ' + G.score, W - 14, 24, '900 22px ' + FD, CREAM, 'right');
        if (mult() > 1) txt('x' + mult(), W - 14, 50, '900 24px ' + FD, '#f2c14e', 'right');
        /* peringatan dan padam */
        var warn = G.run && G.off <= 0 && G.t >= G.cut - 2;
        if (warn) { cx.fillStyle = 'rgba(4,7,10,' + (Math.sin(G.t * 40) > 0 ? .3 : 0) + ')'; cx.fillRect(0, 0, W, H); txt('Listrik berkedip! Antar atau simpan sekarang', W / 2, 62, '800 16px ' + FB, '#ffb020'); }
        if (G.off > 0) { cx.fillStyle = 'rgba(4,7,10,.94)'; cx.fillRect(0, 0, W, H); txt('Listrik padam', W / 2, H / 2, '900 44px ' + FD, CREAM); }
    }

    /* ---------- input ---------- */
    function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
    var down = false;
    cv.addEventListener('pointerdown', function (e) { if (!G.run) return; down = true; var p = pos(e); G.tx = p[0]; G.ty = p[1]; try { cv.setPointerCapture(e.pointerId); } catch (x) { } });
    cv.addEventListener('pointermove', function (e) { if (!down || !G.run) return; var p = pos(e); G.tx = p[0]; G.ty = p[1]; });
    cv.addEventListener('pointerup', function () { down = false; });
    addEventListener('keydown', function (e) {
        var k = e.key.toLowerCase();
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].indexOf(k) < 0 || !G.run || !cv.offsetParent) return;
        keys[k] = 1; e.preventDefault();
    });
    addEventListener('keyup', function (e) { delete keys[e.key.toLowerCase()]; });

    /* ---------- layar mulai dan hasil ---------- */
    function steps() {
        var r = el('div', 'kd-steps');
        [['Ambil dari input', '#14d4be'], ['Proses di CPU', '#f5a35c'], ['Antar ke output sewarna', '#f2c14e']].forEach(function (s, i) {
            var x = el('span', '', (i + 1) + '. ' + s[0]); x.style.setProperty('--c', s[1]); r.appendChild(x);
        });
        return r;
    }
    function startPanel() {
        ov.innerHTML = ''; ov.hidden = false;
        ov.appendChild(el('h3', '', 'Kurir Data')); ov.appendChild(steps());
        ov.appendChild(el('p', '', 'RAM-mu hanya muat sedikit paket dan kosong saat listrik padam. SSD menyimpan permanen, tetapi poinnya lebih kecil.'));
        var b = el('button', 'btn', 'Mulai shift 90 detik'); b.type = 'button'; b.onclick = begin; ov.appendChild(b);
    }
    function begin() { reset(); G.run = true; keys = {}; ov.hidden = true; }
    function endGame() {
        G.run = false; G.off = 0; keys = {};
        var st = G.score >= STAR[2] ? 3 : G.score >= STAR[1] ? 2 : G.score >= STAR[0] ? 1 : 0, nb = G.score > best;
        if (nb) { best = G.score; try { localStorage.setItem(KEY, best); } catch (e) { } } head();
        ov.innerHTML = ''; ov.hidden = false;
        var s = el('div', 'bk-stamp', nb ? 'Rekor baru' : 'Shift selesai'); ov.appendChild(s);
        var dots = el('span', 'bk-st'); dots.setAttribute('role', 'img'); dots.setAttribute('aria-label', st + ' dari 3 bintang');
        for (var i = 0; i < 3; i++) dots.appendChild(el('i', i < st ? 'on' : '')); ov.appendChild(dots);
        var nums = el('div', 'kd-sum');
        [['Skor', G.score], ['Terantar', G.del], ['Tersimpan', G.bank], ['Hilang', G.lost]].forEach(function (x) { var d = el('div'); d.appendChild(el('b', '', String(x[1]))); d.appendChild(el('span', '', x[0])); nums.appendChild(d); });
        ov.appendChild(nums);
        ov.appendChild(el('p', '', 'Setiap data melewati input, proses, lalu output. Isi RAM hilang saat listrik padam, sedangkan data di SSD tetap ada.'));
        var b = el('button', 'btn', 'Main lagi'); b.type = 'button'; b.onclick = begin; ov.appendChild(b);
    }

    /* ---------- loop (berhenti sendiri bila halaman tersembunyi) ---------- */
    var last = 0;
    function loop(now) {
        requestAnimationFrame(loop);
        if (!cv.offsetParent) { last = now; return; }
        var dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
        if (G.run) update(dt); render();
    }
    reset(); startPanel(); requestAnimationFrame(loop);
})();