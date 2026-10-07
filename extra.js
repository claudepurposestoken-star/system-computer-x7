/* extra.js: contoh klik (hardware 3D, software 2D), model 3D jenis komputer, Raspberry Pi, Arduino.
   Memakai helper SC3D dari 1helper.js dan model cpu/ram dari 2model.js. */
(function () {
    'use strict';
    var d = document, D = window.DATA, SC = window.SC3D, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function $(s, r) { return (r || d).querySelector(s); }
    function el(t, c, x) { var e = d.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
    var coarse = matchMedia('(pointer:coarse)').matches;
    var has3d = !!(window.THREE && SC);
    var X = {}; /* registri model tambahan */

    /* ================= MODEL 3D ================= */
    if (has3d) (function () {
        var M = SC.mat, B = SC.box, C = SC.cyl, G = SC.grp, PI = Math.PI, GOLD = 0xd9b45a, i, j;
        function hex(n) { return '#' + ('000000' + n.toString(16)).slice(-6); }
        function basic(t) { return new THREE.MeshBasicMaterial({ map: t }); }
        function flat(w, h, m, x, y, z) { var p = SC.plane(w, h, m, x, y, z); p.rotation.x = -PI / 2; return p; }

        /* tekstur */
        function scrTex() {
            return SC.tex(512, 300, function (g, W, H) {
                var gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#1d3a8a'); gr.addColorStop(1, '#14d4be');
                g.fillStyle = gr; g.fillRect(0, 0, W, H);
                g.fillStyle = '#f2ede4'; g.fillRect(60, 40, 240, 150); g.fillStyle = '#0c0f0e'; g.fillRect(60, 40, 240, 22);
                g.fillStyle = '#cfd8d4'; for (var k = 0; k < 5; k++) g.fillRect(76, 78 + k * 20, 150 + (k % 3) * 20, 8);
                g.fillStyle = 'rgba(12,15,14,.85)'; g.fillRect(0, H - 26, W, 26); g.fillStyle = '#14d4be'; g.fillRect(8, H - 20, 14, 14);
            });
        }
        function appTex() {
            return SC.tex(256, 512, function (g) {
                var gr = g.createLinearGradient(0, 0, 256, 512); gr.addColorStop(0, '#5b3fd6'); gr.addColorStop(1, '#14d4be');
                g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
                var cs = ['#f5d6b4', '#ffffff', '#0c0f0e', '#f2ede4'];
                for (var a = 0; a < 4; a++) for (var b = 0; b < 5; b++) { g.fillStyle = cs[(a + b) % 4]; g.fillRect(24 + a * 56, 50 + b * 74, 42, 42); }
            });
        }
        function keyTex() {
            return SC.tex(256, 100, function (g, W, H) {
                g.fillStyle = '#12151a'; g.fillRect(0, 0, W, H); g.fillStyle = '#3a404a';
                for (var r = 0; r < 4; r++) for (var c = 0; c < 14; c++) g.fillRect(6 + c * 17.5, 6 + r * 23, 14, 18);
            });
        }
        function cabTex(seed, base, n) {
            return SC.tex(256, 512, function (g, W, H) {
                var r = SC.rng(seed), hh = (H - 28) / n;
                g.fillStyle = base; g.fillRect(0, 0, W, H);
                for (var k = 0; k < n; k++) {
                    var y = 14 + k * hh;
                    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(14, y, W - 28, hh - 6);
                    g.strokeStyle = 'rgba(255,255,255,.12)'; g.strokeRect(14, y, W - 28, hh - 6);
                    for (var q = 0; q < 6; q++) { g.fillStyle = r() > .5 ? '#14d4be' : (r() > .5 ? '#f5b04a' : '#3a4a46'); g.fillRect(24 + q * 10, y + 6, 5, 5); }
                    g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(120, y + 8, W - 150, 3);
                }
            });
        }
        function panelTex() {
            return SC.tex(512, 160, function (g, W, H) {
                g.fillStyle = '#1b1d22'; g.fillRect(0, 0, W, H);
                for (var r = 0; r < 2; r++) for (var c = 0; c < 16; c++) { g.fillStyle = (c + r) % 3 ? '#e8e2d2' : '#d94a3a'; g.beginPath(); g.arc(24 + c * 30, 28 + r * 36, 8, 0, 6.2832); g.fill(); }
                g.fillStyle = '#b9b3a2'; for (c = 0; c < 16; c++) g.fillRect(18 + c * 30, 108, 12, 30);
            });
        }

        /* bagian bersama */
        function screenObj(w, h, tex) { return new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic(tex)); }
        function keyboard() {
            var k = G(), km = M(0xe8eaf0, { r: .5, m: .05 }), rows = [14, 14, 13, 12];
            k.add(B(3.2, .12, 1.2, M(0x2b3040, { r: .6, m: .3 }), 0, 0, 0));
            rows.forEach(function (n, r) { var w = 2.9 / n; for (var c = 0; c < n; c++) k.add(B(w * .86, .07, .17, km, -1.45 + w * (c + .5), .095, -.42 + r * .21)); });
            k.add(B(1.3, .07, .17, km, 0, .095, .42)); k.add(B(.5, .07, .17, km, -1.0, .095, .42)); k.add(B(.5, .07, .17, km, 1.0, .095, .42));
            k.add(B(.3, .07, .17, M(0x14d4be, { r: .5 }), 1.3, .095, -.21));
            return k;
        }
        function monitor() {
            var r = G();
            r.add(B(2.4, 1.4, .08, M(0x15181f, { r: .4, m: .4 }), 0, .35, 0));
            var s = screenObj(2.26, 1.26, scrTex()); s.position.set(0, .35, .042); r.add(s);
            r.add(C(.06, .06, .35, M(0x2a2f38, { m: .6 }), 0, -.525, -.05, 'y'));
            r.add(B(1, .05, .6, M(0x2a2f38, { m: .6 }), 0, -.725, .05));
            return r;
        }
        function laptop() {
            var g = G(), lid = G(), body = M(0x2a2f38, { m: .6 });
            g.add(B(1.9, .07, 1.3, body, 0, 0, 0));
            g.add(flat(1.6, .56, M(0xffffff, { map: keyTex(), r: .6, m: .1 }), 0, .037, -.12));
            g.add(B(.5, .01, .3, M(0x3a404a), 0, .04, .4));
            lid.add(B(1.9, 1.2, .05, body, 0, .6, 0));
            var s = screenObj(1.76, 1.06, scrTex()); s.position.set(0, .6, .027); lid.add(s);
            lid.position.set(0, .035, -.65); lid.rotation.x = -.28; g.add(lid);
            return g;
        }
        function tower(spin) {
            var g = G();
            g.add(B(1.1, 2.2, 2.0, M(0x14171d, { m: .5, r: .5 })));
            g.add(SC.fan(.4, 0x14d4be, spin)); g.children[1].position.set(0, .5, 1.012);
            var f2 = SC.fan(.4, 0x14d4be, spin); f2.position.set(0, -.4, 1.012); g.add(f2);
            g.add(C(.07, .07, .04, M(0x14d4be, { em: 0x14d4be, ei: .8 }), 0, .98, 1.01));
            for (var v = 0; v < 6; v++) g.add(B(.7, .02, .05, M(0x05070a), 0, 1.11, -.6 + v * .2));
            return g;
        }
        function reel(r, spin) {
            var g = G(), m = M(0xaab2b6, { m: .8, r: .4 });
            g.add(C(r, r, .04, m, 0, 0, 0));
            for (var a = 0; a < 3; a++) { var b = B(r * 1.7, .045, .05, M(0x15181d), 0, 0, 0); b.rotation.z = a * PI / 3; g.add(b); }
            spin.push(g); return g;
        }
        function cab(w, h, dp, base, seed, n, leds) {
            var g = G(), m = M(base, { r: .5, m: .4 });
            g.add(B(w, h, dp, m));
            g.add(SC.plane(w * .96, h * .96, new THREE.MeshStandardMaterial({ map: cabTex(seed, hex(base), n), roughness: .5, metalness: .3 }), 0, 0, dp / 2 + .004));
            for (var l = 0; l < 4; l++) { var lm = M(0x14d4be, { em: 0x14d4be, ei: 1 }); leds.push(lm); g.add(B(.05, .05, .02, lm, -w * .3 + l * .1, h * .44, dp / 2 + .015)); }
            return g;
        }
        function ledTick(leds) { return function (t) { leds.forEach(function (m, k) { m.emissiveIntensity = Math.sin(t * 4 + k * 2.1) > 0 ? 1 : .08; }); }; }

        /* ---- hardware (contoh klik) ---- */
        X.cpu = function () { var m = SC.defs.cpu.build(SC); if (m.open) m.open(.45); return m; };
        X.ram = function () { var m = SC.defs.ram.build(SC); if (m.open) m.open(.35); return m; };
        X.monitor = function () { var r = monitor(); r.rotation.y = 0; return { root: r, rx: .12 }; };
        X.keyboard = function () { return { root: G(keyboard()), rx: .85 }; };

        X.hdd = function () { var m = SC.defs.hdd.build(SC); if (m.open) m.open(.4); return m; };
        X.mouse = function () {
            var r = G(), body = M(0xdfe3ea, { r: .45, m: .15 }), dk = M(0x1a1d24, { r: .5 });
            var h = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, PI * 2, 0, PI / 2), body); h.scale.set(.55, .35, .9); r.add(h);
            var bs = new THREE.Mesh(new THREE.CircleGeometry(1, 32), dk); bs.scale.set(.55, .9, 1); bs.rotation.x = PI / 2; r.add(bs);
            for (var k = 0; k < 8; k++) { var z = -.85 + k * .1; r.add(B(.012, .012, .11, dk, 0, .35 * Math.sqrt(1 - Math.pow(z / .9, 2)) + .003, z)); }
            var wh = C(.06, .06, .14, M(0x14d4be, { r: .4 }), 0, .305, -.5, 'y'); wh.rotation.z = PI / 2; r.add(wh);
            r.add(C(.025, .025, 1.2, dk, 0, .04, -1.5));
            return { root: r, rx: .5 };
        };
        X.printer = function () {
            var r = G(), body = M(0xe9e6df, { r: .6, m: .1 }), dk = M(0x1a1d24, { r: .5 }), paper = M(0xffffff, { r: .8, m: 0 });
            r.add(B(2.4, .7, 1.5, body));
            r.add(B(1.9, .02, .7, dk, 0, .36, .15));
            var tr = B(1.6, .02, 1.0, paper, 0, .62, -.6); tr.rotation.x = -.5; r.add(tr);
            r.add(B(1.9, .14, .02, dk, 0, .08, .76));
            r.add(B(1.8, .04, .7, M(0xd8d4cb), 0, -.15, 1.1));
            r.add(B(1.5, .012, .6, paper, 0, -.12, 1.15));
            r.add(C(.05, .05, .03, M(0x14d4be, { em: 0x14d4be, ei: 1 }), .9, .3, .74));
            return { root: r, rx: .5 };
        };
        X.scanner = function () {
            var r = G(), body = M(0xdcd9d2, { r: .6, m: .1 }), bar = B(1.9, .025, .08, M(0x14d4be, { em: 0x14d4be, ei: 1 }), 0, .1, 0);
            r.add(B(2.2, .18, 1.6, body));
            r.add(flat(1.9, 1.3, M(0x16263d, { m: .6, r: .1 }), 0, .092, 0));
            r.add(flat(.9, 1.1, M(0xffffff, { map: SC.tex(128, 160, function (g) { g.fillStyle = '#fff'; g.fillRect(0, 0, 128, 160); g.fillStyle = '#9aa3a8'; for (var q = 0; q < 10; q++) g.fillRect(12, 14 + q * 14, 70 + (q % 3) * 14, 5); }), r: .8, m: 0 }), -.2, .095, 0));
            r.add(bar);
            var lid = G(B(2.2, .08, 1.6, M(0xeceae3, { r: .6 }), 0, .04, .8), B(2.0, .01, 1.4, M(0xffffff), 0, -.002, .8));
            lid.position.set(0, .09, -.8); lid.rotation.x = -.9; r.add(lid);
            return { root: r, rx: .5, tick: function (t) { bar.position.z = Math.sin(t * 1.5) * .55; } };
        };

        /* ---- jenis komputer ---- */
        X.micro = function () {
            var r = G(), t = G(), p = G();
            t.add(B(1.8, 1.25, .07, M(0x111418, { m: .5 }))); var s1 = screenObj(1.7, 1.15, scrTex()); s1.position.z = .037; t.add(s1);
            t.position.set(-.8, 0, -.1); t.rotation.y = .3;
            p.add(B(.7, 1.4, .08, M(0x111418, { m: .5 }))); var s2 = screenObj(.64, 1.32, appTex()); s2.position.z = .042; p.add(s2);
            p.position.set(.9, -.1, .3); p.rotation.y = -.25;
            r.add(t, p); return { root: r };
        };
        X.pc = function () {
            var r = G(), spin = [], t = tower(spin), m = monitor(), k = keyboard(), l = laptop();
            t.position.set(-2.0, .35, 0); m.position.set(.5, 0, 0); k.scale.set(.5, .5, .5); k.position.set(.5, -.69, 1.1);
            l.scale.set(.8, .8, .8); l.position.set(3.1, -.7, .2); l.rotation.y = -.5;
            r.add(t, m, k, l); return { root: r, spin: spin, rx: .2 };
        };
        X.minipc = function () {
            var r = G(), body = M(0x23272f, { m: .5, r: .45 });
            r.add(B(1.6, .45, 1.6, body));
            r.add(flat(1.5, 1.5, M(0xffffff, { map: SC.tex(128, 128, function (g) { g.fillStyle = '#1b1e25'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#0a0b0e'; for (var a = 0; a < 8; a++) for (var b = 0; b < 8; b++) { g.beginPath(); g.arc(8 + a * 16, 8 + b * 16, 4, 0, 6.2832); g.fill(); } }), r: .5 }), 0, .227, 0));
            for (i = 0; i < 2; i++) r.add(B(.14, .06, .02, M(0x05070a), -.55 + i * .22, -.05, .805));
            r.add(C(.07, .07, .03, M(0x14d4be, { em: 0x14d4be, ei: .9 }), .55, 0, .81));
            for (i = 0; i < 6; i++) r.add(B(.01, .28, .05, M(0x05070a), .801, 0, -.5 + i * .2));
            [[-.65, -.65], [.65, -.65], [-.65, .65], [.65, .65]].forEach(function (p) { r.add(C(.08, .08, .05, M(0x0a0b0e), p[0], -.25, p[1], 'y')); });
            return { root: r, rx: .5 };
        };
        X.minicomp = function () {
            var r = G(), spin = [], leds = [], beige = M(0xc9c3b4, { r: .6, m: .2 });
            var a = G(B(1.5, 2.0, 1.0, beige), SC.plane(1.3, .41, M(0xffffff, { map: panelTex(), r: .5 }), 0, .55, .504), B(1.3, .9, .02, M(0x8a8577), 0, -.5, .51));
            for (i = 0; i < 8; i++) { var lm = M(0xff4040, { em: 0xff3030, ei: 1 }); leds.push(lm); a.add(B(.06, .06, .02, lm, -.5 + i * .14, .88, .51)); }
            a.position.x = -.85;
            var b = G(B(1.5, 2.0, 1.0, beige), B(1.1, .85, .02, M(0x0f1114), 0, .35, .51), B(1.3, .7, .02, M(0x8a8577), 0, -.65, .51));
            [-.27, .27].forEach(function (x) { var rl = reel(.25, spin); rl.position.set(x, .35, .53); b.add(rl); });
            b.position.x = .85; r.add(a, b);
            return { root: r, spin: spin, tick: ledTick(leds), rx: .2 };
        };
        X.mainframe = function () {
            var r = G(), spin = [], leds = [];
            for (i = 0; i < 3; i++) { var c = cab(1.1, 2.6, 1.3, 0x1b2a49, 11 + i, 12, leds); c.position.x = -1.2 + i * 1.2; r.add(c); }
            var t = G(B(1.1, 2.6, 1.3, M(0x1b2a49, { r: .5, m: .4 })), B(.9, .8, .02, M(0x0f1114), 0, .5, .66)); t.position.x = 2.4;
            [-.2, .2].forEach(function (x) { var rl = reel(.2, spin); rl.position.set(x, .5, .68); t.add(rl); });
            for (i = 0; i < 4; i++) { var lm = M(0x14d4be, { em: 0x14d4be, ei: 1 }); leds.push(lm); t.add(B(.05, .05, .02, lm, -.33 + i * .1, 1.15, .665)); }
            r.add(t, B(5.0, .05, 2.2, M(0x20262a), .6, -1.325, 0));
            return { root: r, spin: spin, tick: ledTick(leds), rx: .22 };
        };
        X.super = function () {
            var r = G(), leds = [], pm = [M(0x3a8dff, { m: .4 }), M(0xff5a4a, { m: .4 })];
            for (j = 0; j < 2; j++) {
                var z = j ? -1.4 : 1.4;
                for (i = 0; i < 4; i++) { var c = cab(1.0, 2.4, 1.1, 0x151a1c, 30 + i + j * 5, 14, leds); c.position.set(-1.65 + i * 1.1, 0, z); if (j) c.rotation.y = PI; r.add(c); }
                var p = C(.05, .05, 4.6, pm[j], 0, 1.4, z, 'y'); p.rotation.z = PI / 2; r.add(p);
            }
            r.add(B(5.6, .05, 4.2, M(0x20262a), 0, -1.225, 0));
            return { root: r, tick: ledTick(leds), rx: .45 };
        };

        /* ---- Raspberry Pi & Arduino (papan datar; rx besar agar terlihat dari atas) ---- */
        function board(w, h, tex) { return B(w, h, .06, M(0xffffff, { map: tex, r: .55, m: .1 }), 0, 0, 0); }
        function holes(g, pts) { pts.forEach(function (p) { g.add(SC.plane(.14, .14, M(0x0a0b0e), p[0], p[1], .031)); }); }
        X.pi = function () {
            var r = G(), g = G(), si = M(0xc4c9d1, { m: .85, r: .3 }), blk = M(0x0d0f13, { r: .5 });
            g.add(board(3.4, 2.2, SC.pcb(7, '#1f7a3f', '#7be0a0')));
            g.add(B(.55, .55, .07, si, -.2, .1, .095));
            g.add(B(.5, .35, .05, blk, .5, .1, .085));
            g.add(B(.5, .35, .03, si, -.95, .25, .075));
            g.add(B(2.0, .14, .16, blk, 0, .95, .11));
            for (i = 0; i < 20; i++) for (j = 0; j < 2; j++) g.add(B(.035, .035, .1, M(GOLD, { m: .8 }), -.95 + i * .1, .92 + j * .06, .2));
            g.add(B(.85, .7, .55, si, 1.25, -.65, .33)); g.add(B(.8, .55, .55, M(0x2f6df0, { m: .6 }), 1.3, .15, .33)); g.add(B(.8, .55, .55, si, 1.3, .8, .33));
            g.add(B(.35, .25, .15, si, -1.2, -.98, .13));
            g.add(B(.3, .2, .12, si, -.7, -.98, .12)); g.add(B(.3, .2, .12, si, -.3, -.98, .12));
            g.add(C(.1, .1, .2, blk, .15, -.98, .13));
            g.add(B(.3, .65, .05, si, -1.62, 0, .055));
            holes(g, [[-1.55, 1.0], [1.55, -1.0], [-1.55, -1.0], [1.55, 1.0]]);
            g.rotation.x = -PI / 2; r.add(g); return { root: r, rx: .85 };
        };
        X.arduino = function () {
            var r = G(), g = G(), si = M(0xc4c9d1, { m: .85, r: .3 }), blk = M(0x0d0f13, { r: .5 });
            g.add(board(3.4, 2.65, SC.pcb(21, '#0a7f87', '#8fe6ea')));
            g.add(B(.7, .65, .5, si, -1.45, .75, .28));
            g.add(B(.65, .6, .45, blk, -1.45, -.6, .26));
            g.add(B(1.5, .4, .15, blk, .7, -.4, .1));
            g.add(SC.plane(.8, .3, M(0xffffff, { map: SC.label('ATmega', '328P', '#16181d', '#cfd3df'), r: .5 }), .7, -.4, .176));
            g.add(B(2.8, .12, .2, blk, .3, 1.2, .13));
            g.add(B(1.2, .12, .2, blk, -.5, -1.2, .13)); g.add(B(1.2, .12, .2, blk, 1.0, -1.2, .13));
            g.add(B(.28, .28, .12, M(0xcfd3df, { m: .6 }), -.8, .95, .09)); g.add(C(.09, .09, .08, M(0xd94a3a), -.8, .95, .17));
            g.add(B(.45, .2, .1, si, -.2, -.05, .08));
            g.add(C(.16, .16, .3, M(0x9aa3a8, { m: .7 }), -.95, -.15, .18));
            g.add(B(.08, .05, .03, M(0x14d4be, { em: 0x14d4be, ei: 1 }), .3, .1, .075)); g.add(B(.08, .05, .03, M(0xf5b04a, { em: 0xf5b04a, ei: 1 }), .45, .1, .075));
            holes(g, [[-1.6, 1.15], [1.6, 1.0], [-1.6, -1.15], [1.45, -1.15]]);
            g.rotation.x = -PI / 2; r.add(g); return { root: r, rx: .85 };
        };
    })();

    /* ================= VIEWER ================= */
    var all = [];
    function V(host) {
        var cv = el('canvas'); host.appendChild(cv);
        var R = null;
        function init() { R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !coarse, powerPreference: 'low-power' }); R.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 2)); size(); }
        cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); });
        var S = new THREE.Scene(), C = new THREE.PerspectiveCamera(35, 1, .1, 100), pv = new THREE.Group();
        S.add(pv, new THREE.AmbientLight(0xffffff, 1.05));
        var l1 = new THREE.DirectionalLight(0xffffff, 1.5); l1.position.set(3, 5, 4); S.add(l1);
        var l2 = new THREE.DirectionalLight(0x9fe9de, 1.2); l2.position.set(-4, 2, -3); S.add(l2);
        var vis = false, cur = null, cache = {}, ry = .6, rx = .25, drag = null;
        new IntersectionObserver(function (e) { vis = e[0].isIntersecting; if (vis && !R) init(); }, { rootMargin: '150px' }).observe(host);
        function fit() { if (cur) { C.position.set(0, 0, cur.rad * 3.1 / Math.min(1, C.aspect)); C.lookAt(0, 0, 0); } }
        function size() { var w = host.clientWidth, h = host.clientHeight; if (!R || !w || !h) return; R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix(); fit(); }
        if (window.ResizeObserver) new ResizeObserver(size).observe(host); else addEventListener('resize', size);
        cv.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY }; cv.classList.add('drag'); cv.setPointerCapture(e.pointerId); });
        cv.addEventListener('pointermove', function (e) { if (!drag) return; ry += (e.clientX - drag.x) * .01; rx = Math.max(-1.3, Math.min(1.3, rx + (e.clientY - drag.y) * .01)); drag = { x: e.clientX, y: e.clientY }; });
        ['pointerup', 'pointercancel'].forEach(function (n) { cv.addEventListener(n, function () { drag = null; cv.classList.remove('drag'); }); });
        var v = {
            size: size,
            open: function (x) { if (cur && cur.m.open) cur.m.open(x); },
            has: function () { return !!(cur && cur.m.open); },
            set: function (key) {
                if (!X[key]) return;
                if (cur) pv.remove(cur.g);
                var c = cache[key];
                if (!c) {
                    var m = X[key](), g = new THREE.Group(); g.add(m.root);
                    var bb = new THREE.Box3().setFromObject(m.root); m.root.position.sub(bb.getCenter(new THREE.Vector3()));
                    c = cache[key] = { m: m, g: g, rad: bb.getSize(new THREE.Vector3()).length() / 2 };
                }
                cur = c; pv.add(c.g); rx = c.m.rx != null ? c.m.rx : .25; size(); fit();
            },
            step: function (t) {
                if (!vis || !cur || !R) return;
                if (!drag && !reduce) ry += .004;
                if (!reduce) { (cur.m.spin || []).forEach(function (q) { q.rotation.z -= .08; }); if (cur.m.tick) cur.m.tick(t); }
                pv.rotation.y = ry; pv.rotation.x = rx; R.render(S, C);
            }
        };
        all.push(v); return v;
    }
    if (has3d) (function loop(t) { requestAnimationFrame(loop); all.forEach(function (v) { v.step(t / 1000); }); })(0);

    function vhost(extraCls) { var h = el('div', 'vh' + (extraCls ? ' ' + extraCls : '')); h.appendChild(el('span', 'vhint', 'Seret untuk memutar')); return h; }

    /* ================= JENIS KOMPUTER ================= */
    if (has3d && D && $('#jbody')) {
        var JK = ['micro', 'pc', 'minipc', 'minicomp', 'mainframe', 'super'];
        var JC = [
            'Model: tablet dan smartphone.',
            'Model: desktop (casing, monitor, keyboard) dan laptop.',
            'Model: kotak kecil dengan port di depan.',
            'Model: lemari dengan panel lampu dan unit pita.',
            'Model: deretan lemari besar dan unit pita.',
            'Model: rak komputasi dengan pipa pendingin. Ilustrasi, tidak diskala.'
        ];
        var jw = el('div', 'jv'), jh = vhost(), jc = el('p', 'vcap'), jvw = V(jh), jb = $('#jbody');
        jw.appendChild(jh); jw.appendChild(jc);
        function place() {
            var bs = [].slice.call($('#rail').querySelectorAll('.jn')), k = 0, l = jb.firstElementChild;
            bs.forEach(function (b, n) { if (b.getAttribute('aria-selected') === 'true') k = n; });
            if (l && jw.parentNode !== l) l.appendChild(jw);
            var wrap = $('.jrail-wrap'), sb = bs[k];
            if (wrap && sb && wrap.scrollWidth > wrap.clientWidth) wrap.scrollTo({ left: sb.offsetLeft - wrap.clientWidth / 2 + sb.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
            jvw.set(JK[k]); jc.textContent = JC[k];
        }
        new MutationObserver(place).observe($('#rail'), { attributes: true, attributeFilter: ['aria-selected'], subtree: true });
        new MutationObserver(place).observe(jb, { childList: true });
        place();

        /* Raspberry Pi dan Arduino */
        var pa = el('div', 'pa'), B2 = D.banding;
        [['pi', B2.a, 'Single-board computer: ada SoC, chip memori, port USB dan Ethernet, serta header GPIO 40 pin.'],
        ['arduino', B2.b, 'Papan pengendali: ada mikrokontroler, konektor USB dan daya, serta header untuk sensor dan modul.']].forEach(function (x) {
            var w = el('div'), h = vhost(), vv = V(h); w.appendChild(h); w.appendChild(el('p', 'vcap', x[1] + ': ' + x[2])); pa.appendChild(w); vv.set(x[0]);
        });
        $('.cmp-wrap').before(pa);

        /* tampil hanya di sub-tab "Pi dan Arduino" (tab ke-4, dibuat fx.js) */
        var jtb = [].slice.call(document.querySelectorAll('.jtabs button'));
        function syncPa() { var t = jtb[3]; pa.classList.toggle('jx', !t || t.getAttribute('aria-selected') !== 'true'); }
        jtb.forEach(function (b) { b.addEventListener('click', syncPa); });
        syncPa();
    }

    /* ================= MOCK 2D SOFTWARE ================= */
    var WIN = '<div class="m-win"><span class="m-ic" style="top:16px">Folder</span><span class="m-ic" style="top:86px">Sampah</span><div class="m-w1"><b>Dokumen</b><i style="width:80%"></i><i style="width:60%"></i><i style="width:70%"></i></div><div class="m-task"><u></u><s></s><s></s><s></s><em>12.30</em></div></div>';
    var MAC = '<div class="m-win m-mac"><div class="m-mb"><b>Finder</b><span>File</span><span>Edit</span><em>12.30</em></div><div class="m-w1" style="top:44px;left:60px;bottom:76px"><b>Dokumen</b><i style="width:80%"></i><i style="width:60%"></i><i style="width:70%"></i></div><div class="m-dock"><u></u><u></u><u></u><u></u></div></div>';
    var LNX = '<div class="m-win m-lnx"><div class="m-mb"><span>Aktivitas</span><em>12.30</em></div><div class="m-side"><u></u><u></u><u></u><u></u></div><div class="m-w1" style="left:84px;top:44px;bottom:20px"><b>Terminal</b><i style="width:50%"></i><i style="width:70%"></i><i style="width:40%"></i></div></div>';
    var AND = '<div class="m-and"><div class="m-sb"><span>12.30</span><span>5G</span></div><div class="m-grid">' + new Array(13).join('<u></u>') + '</div><div class="m-nv"><s></s><s></s><s></s></div></div>';
    var DOC = '<div class="m-br"><div class="m-tb"><span class="on">Dokumen1</span></div><div class="m-ad"><span>B</span><span>I</span><span>U</span><b>Rata kiri</b></div><div class="m-pg"><h5></h5><i style="width:95%"></i><i style="width:90%"></i><i style="width:96%"></i><i style="width:60%"></i></div></div>';
    var VID = '<div class="m-win m-vid"><div class="m-play"></div><div class="m-bar"><i></i></div></div>';
    var SW = {
        Windows: { cap: 'Sistem operasi: mengatur hardware, menyediakan jendela dan ikon, serta menjalankan aplikasi.', html: WIN },
        macOS: { cap: 'Sistem operasi: tampilannya punya bilah menu di atas dan dock di bawah.', html: MAC },
        Linux: { cap: 'Sistem operasi: ada banyak varian tampilan, salah satunya dengan panel di atas dan dock di samping.', html: LNX },
        Android: { cap: 'Sistem operasi untuk smartphone dan tablet, dioperasikan lewat sentuhan pada ikon.', html: AND },
        'Pengolah dokumen': { cap: 'Aplikasi untuk membuat dan mengatur dokumen.', html: DOC },
        Browser: { cap: 'Aplikasi untuk membuka halaman web.', html: '<div class="m-br"><div class="m-tb"><span class="on">Beranda</span><span>Tab baru</span></div><div class="m-ad"><span>&larr;</span><span>&rarr;</span><b>https://contoh.id</b></div><div class="m-pg"><h5></h5><div></div><i style="width:90%"></i><i style="width:70%"></i></div></div>' },
        Game: { cap: 'Aplikasi hiburan. Coba mainkan: klik layar atau tekan spasi untuk melompat.', game: true },
        'Pemutar media': { cap: 'Aplikasi untuk memutar video dan audio.', html: VID }
    };
    var HW = {
        Mouse: ['mouse', 'Perangkat input: gerakan dan klik pengguna dikirim ke komputer sebagai data.'],
        'Hard disk': ['hdd', 'Penyimpanan data. Geser slider di bawah model untuk membuka tutupnya.'],
        Processor: ['cpu', 'Pemroses utama komputer. Geser slider untuk mengangkat tutup logamnya.'],
        RAM: ['ram', 'Tempat penyimpanan data sementara ketika komputer bekerja.'],
        Printer: ['printer', 'Menghasilkan keluaran dalam bentuk cetakan.'],
        Scanner: ['scanner', 'Memasukkan informasi dari dokumen atau objek ke komputer.'],
        Monitor: ['monitor', 'Perangkat output: menampilkan hasil pengolahan.'],
        Keyboard: ['keyboard', 'Perangkat input: tiap tombol yang ditekan dikirim ke komputer sebagai data.']
    };

    /* ================= MODAL ================= */
    var mo = el('div', 'xm'), st3 = vhost('xm-st3'), st2 = el('div', 'xm-st2'), mt, mc, mv = null, gstop = null, last = null;
    mo.hidden = true; mo.setAttribute('role', 'dialog'); mo.setAttribute('aria-modal', 'true'); mo.setAttribute('data-lenis-prevent', '');
    mo.innerHTML = '<div class="xm-bg"></div><div class="xm-card"><button class="xm-x" type="button" aria-label="Tutup">&times;</button><h3 class="xm-t"></h3><p class="xm-c"></p></div>';
    var card = $('.xm-card', mo); mt = $('.xm-t', mo); mc = $('.xm-c', mo);
    card.insertBefore(st3, mc); card.insertBefore(st2, mc);
    var sl = el('label', 'xm-sl'), sr = d.createElement('input'), INIT = { cpu: .45, ram: .35, hdd: .4 };
    sr.type = 'range'; sr.min = 0; sr.max = 1; sr.step = '.01'; sr.setAttribute('aria-label', 'Jarak bongkar');
    sl.appendChild(d.createTextNode('Rapat ')); sl.appendChild(sr); sl.appendChild(d.createTextNode(' Terbongkar')); sl.hidden = true; card.insertBefore(sl, mc);
    sr.addEventListener('input', function () { if (mv) mv.open(+sr.value); });
    d.body.appendChild(mo);
    function close() { mo.hidden = true; d.documentElement.classList.remove('xm-open'); if (gstop) { gstop(); gstop = null; } st2.innerHTML = ''; if (last) last.focus(); }
    $('.xm-bg', mo).onclick = close; $('.xm-x', mo).onclick = close;
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mo.hidden) close(); });

    function game(host) {
        var c = el('canvas', 'm-gm'); c.width = 480; c.height = 270; host.appendChild(c);
        var g = c.getContext('2d'), y = 0, vy = 0, ob = [{ x: 520 }], sc = 0, run = true, alive = true;
        function jump() { if (!run) { ob = [{ x: 520 }]; sc = 0; run = true; } else if (y === 0) vy = 11; }
        c.onclick = jump;
        function key(e) { if (e.code === 'Space' && !mo.hidden) { e.preventDefault(); jump(); } } d.addEventListener('keydown', key);
        (function f() {
            if (!alive) return; requestAnimationFrame(f);
            if (run) {
                y += vy; vy -= .6; if (y <= 0) { y = 0; vy = 0; }
                ob.forEach(function (o) { o.x -= 4 + sc / 400; });
                if (ob[0].x < -30) ob.shift(); if (ob[ob.length - 1].x < 260) ob.push({ x: 480 + Math.random() * 180 });
                ob.forEach(function (o) { if (o.x < 88 && o.x + 20 > 60 && y < 24) run = false; }); sc++;
            }
            g.fillStyle = '#10201c'; g.fillRect(0, 0, 480, 270); g.fillStyle = '#1d3a8a'; g.fillRect(0, 0, 480, 120);
            g.fillStyle = '#2b312e'; g.fillRect(0, 210, 480, 60);
            g.fillStyle = '#14d4be'; g.fillRect(60, 182 - y, 28, 28);
            g.fillStyle = '#f5d6b4'; ob.forEach(function (o) { g.fillRect(o.x, 190, 20, 20); });
            g.fillStyle = '#f2ede4'; g.font = '700 16px sans-serif'; g.fillText('Skor ' + Math.floor(sc / 6), 14, 26);
            if (!run) { g.font = '700 22px sans-serif'; g.fillText('Game over, klik untuk main lagi', 80, 130); }
        })();
        return function () { alive = false; d.removeEventListener('keydown', key); };
    }

    function open(name, trigger) {
        last = trigger; mt.textContent = name;
        if (HW[name] && has3d) {
            st2.hidden = true; st3.hidden = false; mo.hidden = false; mc.textContent = HW[name][1];
            if (!mv) mv = V(st3); mv.set(HW[name][0]);
            sl.hidden = !mv.has(); sr.value = INIT[HW[name][0]] != null ? INIT[HW[name][0]] : .4; if (!sl.hidden) mv.open(+sr.value);
        } else if (SW[name]) {
            sl.hidden = true; st3.hidden = true; st2.hidden = false; mo.hidden = false; st2.innerHTML = ''; mc.textContent = SW[name].cap + ' Software tidak punya bentuk fisik, jadi ditampilkan sebagai tampilan 2D.';
            if (SW[name].game) gstop = game(st2); else st2.innerHTML = SW[name].html;
        } else return;
        d.documentElement.classList.add('xm-open'); $('.xm-x', mo).focus();
    }

    /* jadikan contoh Hardware (p0) dan Software (p1) bisa diklik, di kartu putar maupun di panel penjelasan */
    [['p0', HW], ['p1', SW]].forEach(function (pair) {
        [].forEach.call(d.querySelectorAll('.dp.' + pair[0] + ' li, .pn.' + pair[0] + ' li'), function (li) {
            var n = li.textContent.trim(); if (!pair[1][n]) return;
            li.classList.add('xc'); li.tabIndex = 0; li.setAttribute('role', 'button');
            li.addEventListener('click', function (e) { e.stopPropagation(); open(n, li); });
            li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); open(n, li); } });
            ['pointerdown', 'pointerup'].forEach(function (ev) { li.addEventListener(ev, function (e) { e.stopPropagation(); }); });
        });
    });

    /* dropdown: isi baru muncul setelah dipencet */
    function dd(t, kids, c) { var x = el('details', 'dd' + (c ? ' ' + c : '')); x.appendChild(el('summary', '', t)); kids.forEach(function (k) { x.appendChild(k); }); return x; }
    [].forEach.call(d.querySelectorAll('.drow'), function (r) {
        var h = r.querySelector('h4'), p = r.querySelector('p'); if (h && p) r.replaceWith(dd(h.textContent, [p], 'drow'));
    });
    [].forEach.call(d.querySelectorAll('.jbeda > div'), function (c) {
        var h = c.querySelector('h5'), p = c.querySelector('p'); if (h && p) c.replaceWith(dd(h.textContent, [p]));
    });
    var rs = $('.rsm'); if (rs) { var rx = dd('Tampilkan ringkasan', []); rs.before(rx); rx.appendChild(rs); }
})();