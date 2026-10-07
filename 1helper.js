/* ================================================================
   BAGIAN 1 — HELPER
   Bahan, bentuk dasar, tekstur kanvas, dan registri model.
   ================================================================ */
(function (w) {
    'use strict';
    var SC = w.SC3D = w.SC3D || {};
    SC.defs = {};
    SC.order = [];

    SC.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    SC.rng = function (s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; };

    /* Bahan standar. Transparansi hanya dinyalakan viewer saat bagian diredupkan. */
    SC.mat = function (color, o) {
        o = o || {};
        var m = new THREE.MeshStandardMaterial({
            color: color,
            roughness: o.r != null ? o.r : 0.55,
            metalness: o.m != null ? o.m : 0.25,
            emissive: o.em != null ? o.em : 0x000000,
            emissiveIntensity: o.ei || 0,
            map: o.map || null
        });
        m.userData.ei = m.emissiveIntensity;
        m.userData.em = m.emissive.getHex();
        return m;
    };

    SC.box = function (w_, h, d, m, x, y, z) {
        var o = new THREE.Mesh(new THREE.BoxGeometry(w_, h, d), m);
        o.position.set(x || 0, y || 0, z || 0);
        return o;
    };
    /* Silinder dengan sumbu sepanjang Z (axis 'y' = sumbu Y bawaan). */
    SC.cyl = function (rt, rb, h, m, x, y, z, axis) {
        var o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 32), m);
        if (axis !== 'y') o.rotation.x = Math.PI / 2;
        o.position.set(x || 0, y || 0, z || 0);
        return o;
    };
    SC.plane = function (w_, h, m, x, y, z, back) {
        var o = new THREE.Mesh(new THREE.PlaneGeometry(w_, h), m);
        o.position.set(x || 0, y || 0, z || 0);
        if (back) o.rotation.y = Math.PI;
        return o;
    };
    SC.grp = function () {
        var g = new THREE.Group();
        for (var i = 0; i < arguments.length; i++) g.add(arguments[i]);
        return g;
    };
    /* Papan dari poligon 2D (untuk takik/notch) */
    SC.shape = function (pts, depth, m) {
        var s = new THREE.Shape();
        pts.forEach(function (p, i) { if (i) s.lineTo(p[0], p[1]); else s.moveTo(p[0], p[1]); });
        s.closePath();
        var g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false });
        g.translate(0, 0, -depth / 2);
        return new THREE.Mesh(g, m);
    };
    /* Beri id bagian pada semua mesh di dalam g (yang belum punya id) */
    SC.tag = function (g, id) {
        g.traverse(function (o) { if (o.isMesh && !o.userData.sub) o.userData.sub = id; });
        return g;
    };

    /* ---------- tekstur kanvas ---------- */
    SC.tex = function (wd, ht, draw) {
        var c = document.createElement('canvas'); c.width = wd; c.height = ht;
        draw(c.getContext('2d'), wd, ht);
        var t = new THREE.CanvasTexture(c);
        if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        return t;
    };
    /* Jalur tembaga PCB: garis siku acak */
    SC.pcb = function (seed, base, trace) {
        return SC.tex(512, 512, function (g) {
            var r = SC.rng(seed);
            g.fillStyle = base; g.fillRect(0, 0, 512, 512);
            g.lineWidth = 2;
            for (var i = 0; i < 80; i++) {
                var x = Math.floor(r() * 32) * 16, y = Math.floor(r() * 32) * 16, h = r() > .5;
                g.strokeStyle = trace; g.globalAlpha = .25 + r() * .3;
                g.beginPath(); g.moveTo(x, y);
                for (var k = 0, n = 2 + Math.floor(r() * 5); k < n; k++) {
                    var st = 16 * (1 + Math.floor(r() * 5)) * (r() > .5 ? 1 : -1);
                    if (h) x += st; else y += st;
                    g.lineTo(x, y); h = !h;
                }
                g.stroke();
                g.globalAlpha = .7; g.beginPath(); g.arc(x, y, 3.5, 0, 6.2832); g.fill();
            }
        });
    };
    /* Stiker/label bertulisan */
    SC.label = function (line1, line2, bg, fg) {
        return SC.tex(256, 128, function (g, W, H) {
            g.fillStyle = bg; g.fillRect(0, 0, W, H);
            g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
            g.font = '600 38px DM Mono, monospace'; g.fillText(line1, W / 2, line2 ? 46 : 64);
            if (line2) { g.font = '400 22px DM Mono, monospace'; g.fillText(line2, W / 2, 92); }
        });
    };
    /* Denah die: ilustrasi (bukan tata letak chip tertentu) */
    SC.dieTex = function () {
        return SC.tex(256, 256, function (g) {
            g.fillStyle = '#16203a'; g.fillRect(0, 0, 256, 256);
            function blk(x, y, wd, ht, c, t) {
                g.fillStyle = c; g.fillRect(x, y, wd, ht);
                g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '16px DM Mono, monospace';
                g.textAlign = 'center'; g.fillText(t, x + wd / 2, y + ht / 2 + 5);
            }
            blk(14, 14, 108, 78, '#2c4a99', 'Core'); blk(134, 14, 108, 78, '#2c4a99', 'Core');
            blk(14, 100, 228, 38, '#3b6a8a', 'Cache');
            blk(14, 146, 108, 96, '#2c4a99', 'Core'); blk(134, 146, 108, 96, '#2c4a99', 'Core');
            g.strokeStyle = 'rgba(126,184,176,.5)'; g.lineWidth = 2; g.strokeRect(4, 4, 248, 248);
        });
    };

    /* Kipas: kembalikan grup; rotor didaftarkan ke daftar `spin` */
    SC.fan = function (r, color, spin) {
        var g = new THREE.Group(), rotor = new THREE.Group(), i, a;
        g.add(new THREE.Mesh(new THREE.TorusGeometry(r, r * .09, 8, 40), SC.mat(0x2a2f44, { m: .5 })));
        rotor.add(SC.cyl(r * .27, r * .27, .05, SC.mat(color, { m: .4 })));
        for (i = 0; i < 7; i++) {
            a = i / 7 * Math.PI * 2;
            var b = SC.box(r * .8, r * .26, .012, SC.mat(color, { r: .4 }), Math.cos(a) * r * .52, Math.sin(a) * r * .52, 0);
            b.rotation.z = a + .35; rotor.add(b);
        }
        g.add(rotor); spin.push(rotor);
        return g;
    };

    /* Daftarkan model: id, nama, kategori, warna, size, asm (id bagian rakitan),
       intro, fakta, subs [{id,nama,teks}], build(SC) -> {root, open?, tick?, spin} */
    SC.def = function (id, d) { d.id = id; SC.defs[id] = d; SC.order.push(id); };
})(window);