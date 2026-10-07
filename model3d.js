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
/* ================================================================
   BAGIAN 2 — MODEL KOMPONEN
   Tiap model dibangun menghadap +Z. Teks `subs` adalah materi yang
   tampil di tab "Model Detail". Bentuk dibuat untuk memperlihatkan
   susunan nyata; ukuran antar-komponen tidak skala persis.
   ================================================================ */
(function (w) {
    'use strict';
    var SC = w.SC3D, M = SC.mat, B = SC.box, C = SC.cyl, G = SC.grp, T = SC.tag, PI = Math.PI;
    var GOLD = 0xd9b45a;

    /* ---------------- CPU ---------------- */
    SC.def('cpu', {
        nama: 'CPU (Processor)', kategori: 'Pemrosesan', warna: '#4A7CF7', size: 1.7, asm: 'cpu', open: 'Buka tutup logam',
        intro: 'Keping kecil yang menjalankan instruksi program. Geser “Buka” untuk mengangkat tutup logamnya, lalu balik modelnya untuk melihat kontak di sisi bawah.',
        fakta: 'Die CPU berupa kepingan silikon seluas kuku jari, tetapi memuat miliaran transistor. Denah pada model ini hanya ilustrasi, bukan tata letak chip tertentu.',
        subs: [
            { id: 'ihs', nama: 'Heat spreader (IHS)', teks: 'Tutup logam yang melindungi die dan menyebarkan panasnya ke heatsink. Di bawahnya ada bahan penghantar panas, yaitu solder atau pasta termal.' },
            { id: 'die', nama: 'Die', teks: 'Kepingan silikon tempat transistor berada: core, cache, dan pengendali memori. Instruksi program benar-benar dijalankan di sini.' },
            { id: 'substrate', nama: 'Substrat', teks: 'Papan sirkuit kecil yang menyalurkan sinyal dan daya antara die dan kontak di sisi bawah. Kapasitor kecil di tepinya menstabilkan tegangan.' },
            { id: 'pads', nama: 'Kontak (sisi bawah)', teks: 'Pada CPU berjenis LGA (misalnya Intel dan AMD AM5), kontaknya berupa pad datar dan pin-nya ada di soket motherboard. Pada PGA (misalnya AMD AM4), pin berada di CPU.' }
        ],
        build: function () {
            var root = new THREE.Group(), i;
            var sub = G(B(1.5, 1.5, .06, M(0x1d4a3b, { r: .6, m: .1 })));
            for (i = 0; i < 6; i++) {
                sub.add(B(.07, .04, .03, M(0xb89a5a, { m: .6 }), -.6 + i * .24, .66, .045));
                sub.add(B(.07, .04, .03, M(0xb89a5a, { m: .6 }), -.6 + i * .24, -.66, .045));
            }
            var pads = SC.tex(256, 256, function (g) {
                g.fillStyle = '#1b3d33'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#d9b45a';
                for (var x = 0; x < 30; x++) for (var y = 0; y < 30; y++) if (!(x > 11 && x < 18 && y > 11 && y < 18)) g.fillRect(8 + x * 8, 8 + y * 8, 5, 5);
            });
            var padPlane = SC.plane(1.46, 1.46, M(0xffffff, { map: pads, r: .5, m: .3 }), 0, 0, -.031, true);
            sub.add(padPlane);
            T(sub, 'substrate');
            padPlane.userData.sub = 'pads';
            var die = T(G(B(.5, .5, .04, M(0xffffff, { map: SC.dieTex(), m: .3, r: .4 }), 0, 0, .05)), 'die');
            var ihs = G(B(1.05, 1.05, .1, M(0xcfd3df, { m: .9, r: .3 }), 0, 0, .12),
                SC.plane(.8, .4, M(0xffffff, { map: SC.label('CPU', 'ilustrasi', '#cfd3df', '#2b3042'), m: .8, r: .35 }), 0, 0, .171));
            T(ihs, 'ihs');
            root.add(sub, die, ihs);
            return { root: root, spin: [], open: function (v) { ihs.position.z = v * 1.5; } };
        }
    });

    /* ---------------- RAM ---------------- */
    SC.def('ram', {
        nama: 'RAM (modul DIMM)', kategori: 'Memori', warna: '#9B8FE0', size: 2.0, asm: 'ram', open: 'Angkat heat spreader',
        intro: 'Memori kerja komputer. Modul ini ditancapkan tegak pada slot motherboard. Geser “Buka” untuk mengangkat pelat pendinginnya.',
        fakta: 'Posisi takik berbeda untuk tiap generasi RAM, sehingga DDR4 tidak bisa dipasang ke slot DDR5. Keduanya sama-sama bermodul 288 pin pada DIMM desktop. RAM bersifat volatil: isinya hilang saat listrik padam.',
        subs: [
            { id: 'chips', nama: 'Chip DRAM', teks: 'Tempat data disimpan sementara. Tiap bit disimpan sebagai muatan listrik dalam sel kecil yang harus disegarkan (refresh) terus-menerus, itulah sebabnya disebut Dynamic RAM.' },
            { id: 'spreader', nama: 'Heat spreader', teks: 'Pelat logam penyebar panas. Tidak semua modul memilikinya; pada modul biasa, chip dibiarkan terbuka.' },
            { id: 'notch', nama: 'Takik (notch)', teks: 'Lekukan pada deretan kontak sebagai kunci. Posisinya mencegah modul dipasang terbalik atau ke slot generasi yang salah.' },
            { id: 'contacts', nama: 'Kontak emas', teks: 'Deretan kontak yang masuk ke slot DIMM. Dilapisi emas karena tahan karat sehingga hantaran sinyalnya tetap baik.' },
            { id: 'pcb', nama: 'PCB modul', teks: 'Papan berlapis-lapis yang menghubungkan chip DRAM ke kontak. Jalur sinyalnya dibuat sama panjang agar data tiba serempak.' }
        ],
        build: function () {
            var root = new THREE.Group(), i;
            var pcb = SC.shape([[-.95, -.25], [.3, -.25], [.3, -.19], [.4, -.19], [.4, -.25], [.95, -.25], [.95, .25], [-.95, .25]], .05, M(0x143a52, { r: .6, m: .1 }));
            T(G(pcb), 'pcb');
            var contacts = G(B(1.25, .06, .056, M(GOLD, { m: .9, r: .3 }), -.325, -.22, 0), B(.55, .06, .056, M(GOLD, { m: .9, r: .3 }), .675, -.22, 0));
            T(contacts, 'contacts');
            var notch = G(B(.1, .02, .052, M(0xe8eaf0, { r: .8 }), .35, -.185, 0));
            T(notch, 'notch');
            var chips = new THREE.Group();
            for (i = 0; i < 8; i++) {
                chips.add(B(.17, .2, .03, M(0x101218, { r: .4 }), -.8 + i * .26, .03, .04));
                chips.add(B(.17, .2, .03, M(0x101218, { r: .4 }), -.8 + i * .26, .03, -.04));
            }
            T(chips, 'chips');
            var front = G(B(1.9, .36, .03, M(0x9aa3b8, { m: .85, r: .3 }), 0, .03, .075), SC.plane(.9, .22, M(0xffffff, { map: SC.label('DRAM', 'modul DIMM', '#9aa3b8', '#20243a'), m: .7, r: .4 }), 0, .03, .091));
            var back = G(B(1.9, .36, .03, M(0x9aa3b8, { m: .85, r: .3 }), 0, .03, -.075));
            T(front, 'spreader'); T(back, 'spreader');
            root.add(pcb, contacts, notch, chips, front, back);
            return { root: root, spin: [], open: function (v) { front.position.z = v * .9; back.position.z = -v * .9; } };
        }
    });

    /* ---------------- GPU ---------------- */
    SC.def('gpu', {
        nama: 'GPU (Kartu Grafis)', kategori: 'Pemrosesan', warna: '#7EB8B0', size: 3.0, asm: 'gpu', open: 'Lepas penutup & heatsink',
        intro: 'Kartu pemroses grafis dengan memori sendiri (VRAM). Geser “Buka”: pertama penutup dan kipas terangkat, lalu heatsink, memperlihatkan die dan chip memori.',
        fakta: 'Dipasang di slot PCIe x16 dan umumnya butuh konektor daya tambahan dari PSU. Port video (HDMI atau DisplayPort) ada di braket samping.',
        subs: [
            { id: 'shroud', nama: 'Penutup & kipas', teks: 'Penutup plastik yang mengarahkan aliran udara dari kipas menembus sirip heatsink.' },
            { id: 'heatsink', nama: 'Heatsink & pipa panas', teks: 'Blok sirip logam dengan pipa panas (heat pipe) tembaga yang memindahkan panas dari die ke seluruh sirip.' },
            { id: 'die', nama: 'GPU die', teks: 'Prosesor grafis berisi ribuan inti kecil yang bekerja paralel, cocok untuk menghitung warna banyak piksel sekaligus.' },
            { id: 'vram', nama: 'VRAM', teks: 'Chip memori khusus (GDDR) yang diletakkan dekat die agar data grafis dan tekstur dapat diambil dengan cepat.' },
            { id: 'pcie', nama: 'Konektor PCIe', teks: 'Deretan kontak emas yang masuk ke slot PCIe x16 pada motherboard untuk jalur data dan sebagian daya.' },
            { id: 'ports', nama: 'Port video', teks: 'Keluaran ke monitor, misalnya HDMI dan DisplayPort. Pada braket logam yang dikunci ke casing.' },
            { id: 'power', nama: 'Konektor daya', teks: 'Colokan tambahan dari PSU. Kartu bertenaga besar butuh daya lebih banyak daripada yang disediakan slot PCIe.' }
        ],
        build: function () {
            var root = new THREE.Group(), spin = [], i, die = SC.dieTex();
            var pcb = G(B(2.8, 1.0, .05, M(0xffffff, { map: SC.pcb(5, '#0f1c24', '#7EB8B0'), r: .7, m: .1 })),
                B(2.8, .98, .02, M(0x2a3040, { m: .7, r: .4 }), 0, 0, -.05));
            T(pcb, 'pcb');
            var fingers = T(G(B(1.1, .08, .056, M(GOLD, { m: .9, r: .3 }), -.6, -.52, 0)), 'pcie');
            var bracket = G(B(.03, 1.1, .6, M(0x9aa0b4, { m: .9, r: .3 }), -1.43, 0, .1));
            [.3, .05, -.2].forEach(function (y) { bracket.add(B(.045, .09, .17, M(0x08090c), -1.43, y, .15)); });
            T(bracket, 'ports');
            var dieM = T(G(B(.5, .5, .04, M(0xffffff, { map: die, m: .3 }), .15, 0, .06)), 'die');
            var vram = new THREE.Group();
            [[-.35, .3], [-.35, 0], [-.35, -.3], [.65, .3], [.65, 0], [.65, -.3]].forEach(function (p) { vram.add(B(.2, .2, .03, M(0x14161c, { r: .4 }), p[0], p[1], .05)); });
            T(vram, 'vram');
            var power = T(G(B(.5, .12, .14, M(0x111317), .9, .53, .08)), 'power');
            var hs = G(B(2.5, .85, .12, M(0xb87333, { m: .85, r: .35 }), 0, 0, .1));
            for (i = 0; i < 24; i++) hs.add(B(.02, .85, .2, M(0xaab0c4, { m: .8, r: .35 }), -1.15 + i * .1, 0, .26));
            [.2, 0, -.2].forEach(function (y) { hs.add(C(.035, .035, 2.4, M(0xb87333, { m: .9, r: .3 }), 0, y, .17).rotateZ(PI / 2)); });
            T(hs, 'heatsink');
            var sh = G(B(2.7, 1.0, .06, M(0x1a2230, { m: .4, r: .5 }), 0, 0, .4), B(2.7, .03, .062, M(0x7EB8B0, { ei: .6, em: 0x7EB8B0 }), 0, .5, .4));
            [-.6, .6].forEach(function (x) { var f = SC.fan(.42, 0x7EB8B0, spin); f.position.set(x, 0, .45); sh.add(f); });
            T(sh, 'shroud');
            root.add(pcb, fingers, bracket, dieM, vram, power, hs, sh);
            return {
                root: root, spin: spin, open: function (v) {
                    sh.position.z = SC.clamp(v * 2, 0, 1) * 1.1; hs.position.z = SC.clamp(v * 2 - 1, 0, 1) * 1.1;
                }
            };
        }
    });

    /* ---------------- SSD M.2 ---------------- */
    SC.def('ssd', {
        nama: 'SSD (M.2)', kategori: 'Penyimpanan', warna: '#3DAF7E', size: 2.5, asm: 'ssd', open: 'Angkat stiker',
        intro: 'Penyimpanan tanpa bagian bergerak. Format M.2 2280 berarti lebar 22 mm dan panjang 80 mm.',
        fakta: 'M.2 hanyalah bentuk fisik. SSD M.2 bisa memakai antarmuka NVMe (PCIe) atau SATA, jadi pastikan slot motherboard mendukung jenis yang dibeli.',
        subs: [
            { id: 'nand', nama: 'Chip NAND flash', teks: 'Menyimpan data sebagai muatan pada sel memori flash. Data tetap ada walau listrik padam (non-volatile).' },
            { id: 'ctrl', nama: 'Controller', teks: 'Prosesor kecil pengatur baca-tulis. Ia membagi keausan sel secara merata (wear leveling) dan memperbaiki kesalahan data.' },
            { id: 'conn', nama: 'Konektor M.2', teks: 'Kontak emas di salah satu ujung, dengan takik sebagai kunci. Ujung satunya dikunci dengan satu sekrup.' },
            { id: 'sticker', nama: 'Stiker label', teks: 'Lapisan label yang menutupi chip. Pada sebagian SSD, ia berupa lapisan tipis penyebar panas.' }
        ],
        build: function () {
            var root = new THREE.Group();
            var pcb = SC.shape([[-1.2, -.33], [1.2, -.33], [1.2, .33], [-1.2, .33], [-1.2, .14], [-1.12, .14], [-1.12, .06], [-1.2, .06]], .05, M(0x141c2b, { r: .6, m: .15 }));
            T(G(pcb), 'pcb');
            var conn = T(G(B(.35, .56, .056, M(GOLD, { m: .9, r: .3 }), -1.02, -.03, 0)), 'conn');
            var ctrl = T(G(B(.34, .34, .04, M(0x222633, { m: .6, r: .4 }), -.5, 0, .045)), 'ctrl');
            var nand = T(G(B(.6, .46, .04, M(0x171a22, { r: .4 }), .1, 0, .045), B(.6, .46, .04, M(0x171a22, { r: .4 }), .8, 0, .045)), 'nand');
            var st = T(G(B(1.5, .5, .012, M(0x3DAF7E, { m: .5, r: .45 }), .45, 0, .075), SC.plane(1.2, .3, M(0xffffff, { map: SC.label('SSD', 'M.2 2280', '#3DAF7E', '#07140e') }), .45, 0, .082)), 'sticker');
            root.add(pcb, conn, ctrl, nand, st);
            return { root: root, spin: [], open: function (v) { st.position.z = v * 1.1; } };
        }
    });

    /* ---------------- HDD 3,5" ---------------- */
    SC.def('hdd', {
        nama: 'HDD (Hard Disk)', kategori: 'Penyimpanan', warna: '#6C7BA8', size: 2.2, asm: null, open: 'Buka tutup',
        intro: 'Penyimpanan magnetik dengan piringan berputar. Geser “Buka” untuk melihat piringan dan lengan head yang bergerak.',
        fakta: 'Head tidak menyentuh piringan: ia melayang di atas lapisan udara setebal beberapa nanometer. Karena itu HDD tidak boleh dibuka sembarangan dan sebaiknya tidak terguncang saat bekerja.',
        subs: [
            { id: 'platter', nama: 'Piringan (platter)', teks: 'Cakram berlapis bahan magnetik tempat data ditulis. Berputar pada kecepatan tetap, umumnya 5.400 atau 7.200 RPM.' },
            { id: 'head', nama: 'Lengan & head', teks: 'Lengan aktuator menggerakkan head baca-tulis ke jalur yang diminta. Waktu gerak dan menunggu piringan berputar inilah yang membuat HDD lebih lambat dari SSD.' },
            { id: 'cover', nama: 'Tutup & rangka', teks: 'Wadah logam tertutup rapat yang menjaga debu keluar. Hanya perakit di ruang bersih yang boleh membukanya.' },
            { id: 'pcb', nama: 'PCB kontroler', teks: 'Papan di sisi bawah yang mengatur motor, gerak head, dan komunikasi data dengan komputer. Balik modelnya untuk melihat.' }
        ],
        build: function () {
            var root = new THREE.Group(), i;
            var floor = G(B(1.9, 1.3, .06, M(0x5a6075, { m: .8, r: .4 }), 0, 0, -.15));
            [[0, .65, 1.9, .06], [0, -.65, 1.9, .06], [.95, 0, .06, 1.3], [-.95, 0, .06, 1.3]].forEach(function (p) { floor.add(B(p[2], p[3], .3, M(0x5a6075, { m: .8, r: .4 }), p[0], p[1], 0)); });
            var rings = SC.tex(256, 256, function (g) {
                var gr = g.createRadialGradient(128, 128, 20, 128, 128, 126);
                gr.addColorStop(0, '#6d7388'); gr.addColorStop(.5, '#aab0c4'); gr.addColorStop(1, '#7c8298');
                g.fillStyle = gr; g.beginPath(); g.arc(128, 128, 126, 0, 6.2832); g.fill();
                g.strokeStyle = 'rgba(255,255,255,.15)'; for (var r = 30; r < 126; r += 9) { g.beginPath(); g.arc(128, 128, r, 0, 6.2832); g.stroke(); }
            });
            var spinG = new THREE.Group(); spinG.position.set(-.4, 0, 0);
            [-.06, .03].forEach(function (z) { spinG.add(C(.56, .56, .02, M(0xffffff, { map: rings, m: .85, r: .25 }), 0, 0, z)); });
            spinG.add(C(.12, .12, .2, M(0x2a2f3f, { m: .7 }), 0, 0, 0));
            T(spinG, 'platter');
            var arm = new THREE.Group(); arm.position.set(.65, -.45, 0.02); arm.rotation.z = 2.65;
            arm.add(B(.95, .07, .02, M(0x9aa3b8, { m: .85, r: .3 }), .475, 0, 0), B(.06, .09, .03, M(0x20242f), .95, 0, 0), C(.1, .1, .12, M(0x2a2f3f, { m: .7 }), 0, 0, 0), B(.35, .22, .06, M(0xb87333, { m: .8 }), -.25, 0, 0));
            T(arm, 'head');
            var magnet = G(B(.5, .4, .05, M(0x9aa3b8, { m: .9, r: .3 }), .72, -.42, .12)); T(magnet, 'head');
            var cover = G(B(1.9, 1.3, .03, M(0x8d93a8, { m: .85, r: .35 }), 0, 0, .2), SC.plane(1.3, .65, M(0xffffff, { map: SC.label('HDD 3,5″', 'penyimpanan magnetik', '#8d93a8', '#1e2230'), m: .5, r: .5 }), .2, 0, .216));
            T(cover, 'cover'); T(floor, 'cover');
            var pcb = G(B(1.2, .9, .03, M(0x1d4a3b, { r: .6 }), .25, 0, -.21)); for (i = 0; i < 5; i++) pcb.add(B(.2, .15, .03, M(0x14161c, { r: .4 }), -.15 + i * .22, .15 - (i % 2) * .35, -.235));
            T(pcb, 'pcb');
            root.add(floor, spinG, arm, magnet, cover, pcb);
            return {
                root: root, spin: [],
                tick: function (t) { spinG.rotation.z -= .18; arm.rotation.z = 2.65 + Math.sin(t * 1.3) * .14 * (1 + Math.sin(t * .37)); },
                open: function (v) { cover.position.z = v * 1.8; }
            };
        }
    });

    /* ---------------- Pendingin CPU ---------------- */
    SC.def('cooler', {
        nama: 'Heatsink & Kipas', kategori: 'Pendingin', warna: '#8A90A8', size: 1.6, asm: 'cooler', open: 'Renggangkan sirip',
        intro: 'Pendingin CPU tipe tower. Geser “Buka” untuk merenggangkan siripnya; makin banyak sirip, makin luas permukaan pelepas panas.',
        fakta: 'Pasta termal yang tipis di antara CPU dan pelat dasar mengisi celah mikroskopis agar panas berpindah lebih baik daripada lewat udara.',
        subs: [
            { id: 'base', nama: 'Pelat dasar', teks: 'Bagian yang menempel pada CPU. Dibuat dari tembaga atau aluminium karena menghantar panas dengan baik.' },
            { id: 'pipes', nama: 'Pipa panas (heat pipe)', teks: 'Pipa tembaga berisi sedikit cairan. Cairan menguap di sisi panas, mengembun di sisi dingin, dan memindahkan panas dengan cepat.' },
            { id: 'fins', nama: 'Sirip aluminium', teks: 'Tumpukan pelat tipis yang memperluas permukaan sehingga panas mudah dilepas ke udara.' },
            { id: 'fan', nama: 'Kipas', teks: 'Meniupkan udara menembus sirip untuk membawa panas pergi. Putaran kipas bisa diatur sesuai suhu.' }
        ],
        build: function () {
            var root = new THREE.Group(), spin = [], i, N = 12, S = .035;
            var base = T(G(B(1.15, 1.15, .06, M(0xb87333, { m: .85, r: .35 }), 0, 0, -.2)), 'base');
            var fins = new THREE.Group(), pipes = new THREE.Group();
            for (i = 0; i < N; i++) fins.add(B(1.15, 1.15, .012, M(0xaab0c4, { m: .8, r: .35 }), 0, 0, -.15 + i * S));
            T(fins, 'fins');
            [[-.3, -.3], [.3, -.3], [-.3, .3], [.3, .3]].forEach(function (p) { pipes.add(C(.05, .05, .5, M(0xb87333, { m: .9, r: .3 }), p[0], p[1], .02)); });
            T(pipes, 'pipes');
            var fan = G(B(1.15, 1.15, .05, M(0x20242f), 0, 0, .0)); var f = SC.fan(.5, 0xBFC6DB, spin); f.position.z = .03; fan.add(f); T(fan, 'fan');
            fan.position.z = .3;
            root.add(base, fins, pipes, fan);
            return {
                root: root, spin: spin, open: function (v) {
                    var k = 1 + v * 4;
                    fins.children.forEach(function (m, j) { m.position.z = -.15 + j * S * k; });
                    pipes.scale.z = k; pipes.position.z = (-.23 + .25 * k) - .02 * k;
                    fan.position.z = .3 + (k - 1) * (N - 1) * S;
                }
            };
        }
    });

    /* ---------------- PSU ---------------- */
    SC.def('psu', {
        nama: 'Power Supply (PSU)', kategori: 'Daya', warna: '#D4A847', size: 1.9, asm: 'psu', open: 'Angkat penutup',
        intro: 'Mengubah listrik AC dari stopkontak menjadi arus DC bertegangan rendah. Geser “Buka” untuk melihat isinya.',
        fakta: 'Keluaran DC utama berupa +12 V, +5 V, dan +3,3 V. Jangan membuka PSU sendiri: kapasitor besar di dalamnya bisa menyimpan muatan berbahaya walau kabel sudah dicabut.',
        subs: [
            { id: 'cover', nama: 'Penutup & rangka', teks: 'Rangka logam yang melindungi isi dan mengalirkan panas. Label PSU biasanya memuat daya keluaran dan sertifikasi efisiensi seperti 80 PLUS.' },
            { id: 'fan', nama: 'Kipas', teks: 'Mengalirkan udara melewati heatsink di dalam PSU agar komponen daya tidak terlalu panas.' },
            { id: 'cap', nama: 'Kapasitor utama', teks: 'Menyimpan muatan dan meratakan tegangan setelah penyearahan, sehingga arus DC lebih stabil.' },
            { id: 'trafo', nama: 'Trafo & induktor', teks: 'Trafo menurunkan tegangan sekaligus memisahkan sisi listrik rumah dari sisi komponen. Induktor ikut menghaluskan arus.' },
            { id: 'heat', nama: 'Heatsink', teks: 'Blok sirip aluminium untuk komponen penyearah dan saklar daya yang paling panas.' },
            { id: 'cable', nama: 'Kabel keluaran', teks: 'Menyalurkan tegangan DC ke motherboard (konektor 24 pin), CPU, GPU, dan drive.' }
        ],
        build: function () {
            var root = new THREE.Group(), spin = [];
            var frame = G(B(1.7, .95, .04, M(0x2a2f3f, { m: .6 }), 0, 0, -.52));
            [[0, .475, 1.7, .03], [0, -.475, 1.7, .03], [.85, 0, .03, .95], [-.85, 0, .03, .95]].forEach(function (p) { frame.add(B(p[2], p[3], 1.04, M(0x2a2f3f, { m: .6 }), p[0], p[1], 0)); });
            T(frame, 'cover');
            var pcb = G(B(1.6, .85, .03, M(0x1d4a3b, { r: .6 }), 0, 0, -.45));
            var cap = new THREE.Group();[-.15, .12].forEach(function (y) { cap.add(C(.17, .17, .42, M(0x1c3a8a, { m: .3, r: .4 }), .35, y, -.22)); });
            T(cap, 'cap');
            var tr = G(B(.4, .3, .3, M(0xb87333, { m: .7, r: .4 }), -.45, -.2, -.3), new THREE.Mesh(new THREE.TorusGeometry(.14, .05, 10, 24), M(0xd4a847, { m: .5 })).translateX(-.45).translateY(.22).translateZ(-.38));
            T(tr, 'trafo');
            var heat = new THREE.Group(); for (var i = 0; i < 8; i++) { heat.add(B(.012, .5, .3, M(0xaab0c4, { m: .8 }), -.1 + i * .05, .25, -.3)); }
            T(heat, 'heat');
            var cables = new THREE.Group();[0xd4614a, 0xd4a847, 0x1a1a1a, 0x3daf7e, 0x4a7cf7, 0x1a1a1a].forEach(function (c, k) { cables.add(C(.035, .035, .5, M(c), .98, -.25 + k * .1, -.3).rotateZ(PI / 2)); });
            T(cables, 'cable');
            var lid = G(B(1.7, .95, .03, M(0x2f3548, { m: .6 }), 0, 0, .52), SC.plane(.9, .3, M(0xffffff, { map: SC.label('PSU', 'AC ke DC', '#2f3548', '#D4A847') }), .45, -.3, .536));
            var fan = SC.fan(.34, 0x8A90A8, spin); fan.position.set(-.35, .05, .54); T(fan, 'fan'); lid.add(fan); T(lid, 'cover');
            root.add(frame, pcb, cap, tr, heat, cables, lid);
            return { root: root, spin: spin, open: function (v) { lid.position.z = v * 1.5; } };
        }
    });

    /* ---------------- Motherboard (micro-ATX, 244 × 244 mm) ---------------- */
    SC.def('motherboard', {
        nama: 'Motherboard', kategori: 'Penghubung', warna: '#6C7BA8', size: 3.5, asm: 'motherboard',
        intro: 'Papan sirkuit induk yang menyatukan semua komponen. Model ini berukuran micro-ATX (244 × 244 mm). Klik tiap bagian untuk melihat perannya.',
        fakta: 'Komponen tidak saling tersambung langsung, melainkan lewat jalur tembaga bernama bus. Papan modern berlapis-lapis, dengan jalur ditumpuk di dalam satu papan.',
        subs: [
            { id: 'socket', nama: 'Soket CPU', teks: 'Tempat CPU dipasang dan dihubungkan ke seluruh papan. Jenis soket harus cocok dengan CPU, misalnya LGA1700 atau AM5.' },
            { id: 'dimm', nama: 'Slot RAM (DIMM)', teks: 'Dua slot untuk modul RAM. Pengait di ujung slot mengunci modul setelah ditekan masuk.' },
            { id: 'pcie', nama: 'Slot PCIe x16', teks: 'Slot panjang untuk GPU. Tersambung ke CPU lewat jalur PCIe berkecepatan tinggi.' },
            { id: 'm2', nama: 'Slot M.2', teks: 'Tempat SSD M.2 dipasang rebah pada papan dan dikunci dengan satu sekrup.' },
            { id: 'vrm', nama: 'VRM', teks: 'Pengubah tegangan yang menurunkan 12 V dari PSU menjadi tegangan rendah dan stabil untuk CPU. Heatsink di atasnya melepas panas.' },
            { id: 'chipset', nama: 'Chipset', teks: 'Pengatur jalur data untuk perangkat tambahan seperti port USB, SATA, dan sebagian slot, sehingga CPU tidak perlu mengurus semuanya.' },
            { id: 'io', nama: 'Panel I/O belakang', teks: 'Deretan port di bagian belakang casing, misalnya USB, jaringan, dan audio.' },
            { id: 'atx', nama: 'Konektor daya 24 pin', teks: 'Colokan utama dari PSU yang memasok daya ke papan.' },
            { id: 'battery', nama: 'Baterai CMOS', teks: 'Baterai kancing (umumnya CR2032) yang menjaga jam sistem dan pengaturan BIOS tetap tersimpan saat komputer mati.' }
        ],
        build: function () {
            var root = new THREE.Group(), i, dark = M(0x0a0d14, { r: .6 });
            var pcb = G(B(3.4, 3.4, .1, M(0xffffff, { map: SC.pcb(11, '#111b2e', '#7EB8B0'), em: 0x16304a, ei: .2, m: .1, r: .7 }))); T(pcb, 'pcb');
            var socket = T(G(B(.8, .8, .07, M(0x2a2f3c, { m: .6, r: .4 }), 0, .55, .085), B(.62, .62, .04, M(0x0d1018, { r: .6 }), 0, .55, .12)), 'socket');
            var dimm = new THREE.Group();[1.22, 1.5].forEach(function (x) { dimm.add(B(.1, 1.62, .08, dark, x, .55, .09), B(.1, .1, .12, M(0x3b4468, { m: .5 }), x, 1.4, .1)); }); T(dimm, 'dimm');
            var pcie = T(G(B(1.3, .12, .09, dark, .2, -.88, .09), B(.1, .12, .1, M(0x3b4468, { m: .5 }), .9, -.88, .1)), 'pcie');
            var m2 = T(G(B(.16, .32, .08, dark, -.35, 1.4, .09), C(.07, .07, .09, M(GOLD, { m: .8 }), -1.55, 1.4, .1)), 'm2');
            var vrm = new THREE.Group(); for (i = 0; i < 6; i++) vrm.add(B(.25, .1, .16, M(0x59607e, { m: .8, r: .35 }), -.9, .15 + i * .18, .13)); T(vrm, 'vrm');
            var chipset = T(G(B(.55, .55, .1, M(0x3b4468, { m: .7, r: .35 }), .9, -.25, .1)), 'chipset');
            var io = T(G(B(.3, 1.4, .3, M(0x2b3150, { m: .6 }), -1.55, .4, .2), B(.31, .25, .22, M(0x0a0d14), -1.55, .7, .2), B(.31, .25, .22, M(0x0a0d14), -1.55, .1, .2)), 'io');
            var atx = T(G(B(.16, .55, .14, M(0xe8eaf0, { r: .8 }), 1.6, -.5, .12)), 'atx');
            var bat = T(G(C(.17, .17, .05, M(0xb8bdd0, { m: .9, r: .3 }), -.3, -.4, .09)), 'battery');
            root.add(pcb, socket, dimm, pcie, m2, vrm, chipset, io, atx, bat);
            return { root: root, spin: [] };
        }
    });
})(window);
/* ================================================================
   BAGIAN 3 — UI DAN RENDER
   SC3D.mount() menyiapkan satu renderer dengan dua mode:
   "Rakit PC" (komponen disusun di motherboard, bisa dibongkar) dan
   "Model detail" (satu komponen, dengan bagian-bagian yang bisa diklik).
   ================================================================ */
(function (w) {
    'use strict';
    var SC = w.SC3D, clamp = SC.clamp, PI = Math.PI;
    var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function $(s, c) { return (c || document).querySelector(s); }
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
    function V(x, y, z) { return new THREE.Vector3(x, y, z); }
    function cloneMat(m) {
        var c = m.clone();
        c.userData.ei = c.emissiveIntensity; c.userData.em = c.emissive.getHex();
        return c;
    }

    /* ---------- tata letak rakitan: posisi rapat (p) dan posisi bongkar (ex) ---------- */
    function asmTable() {
        var q3 = new THREE.Quaternion().setFromAxisAngle(V(1, 1, 1).normalize(), 2 * PI / 3);   // DIMM berdiri
        var qx = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), PI / 2);                   // kartu grafis berdiri
        var qz = new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), PI);                       // konektor M.2 ke kanan
        return [
            { id: 'motherboard', model: 'motherboard', s: 1, items: [{ p: V(0, 0, 0), ex: V(0, 0, 0) }] },
            { id: 'cpu', model: 'cpu', s: .42, items: [{ p: V(0, .55, .15), ex: V(0, .55, 1.0) }] },
            { id: 'cooler', model: 'cooler', s: 1, items: [{ p: V(0, .55, .5), ex: V(0, .55, 2.1) }] },
            { id: 'ram', model: 'ram', s: .85, q: q3, items: [{ p: V(1.22, .55, .34), ex: V(1.9, .55, 1.0) }, { p: V(1.5, .55, .34), ex: V(2.2, .55, 1.0) }] },
            { id: 'gpu', model: 'gpu', s: .85, q: qx, items: [{ p: V(.71, -.88, .56), ex: V(.71, -1.2, 1.5) }] },
            { id: 'ssd', model: 'ssd', s: .46, q: qz, items: [{ p: V(-1.0, 1.4, .16), ex: V(-1.0, 1.55, .9) }] },
            { id: 'psu', model: 'psu', s: 1, items: [{ p: V(0, -2.15, 0), ex: V(0, -2.6, -1.3) }] }
        ];
    }

    function buildAsm() {
        var root = new THREE.Group(), units = {}, spin = [], pick = [];
        asmTable().forEach(function (a) {
            var u = units[a.id] = units[a.id] || { id: a.id, items: [], mats: [], sel: 0, dim: 0 };
            a.items.forEach(function (it) {
                var m = SC.defs[a.model].build(SC), wrap = new THREE.Group();
                m.root.scale.setScalar(a.s); if (a.q) m.root.quaternion.copy(a.q);
                wrap.add(m.root); wrap.position.copy(it.p); root.add(wrap);
                u.items.push({ g: wrap, base: it.p, ex: it.ex });
                m.root.traverse(function (o) {
                    if (!o.isMesh) return;
                    o.userData.part = a.id; o.material = cloneMat(o.material);
                    u.mats.push(o.material); pick.push(o);
                });
                spin = spin.concat(m.spin || []);
            });
        });
        /* casing: kerangka kawat + empat tiang yang bisa diklik */
        var cg = new THREE.Group(), cu = units.casing = { id: 'casing', items: [], mats: [], sel: 0, dim: 0 };
        var lineMat = new THREE.LineBasicMaterial({ color: 0x8A90A8, transparent: true, opacity: .55 });
        cg.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.9, 5.0, 2.1)), lineMat));
        [[-1.95, -1.05], [1.95, -1.05], [-1.95, 1.05], [1.95, 1.05]].forEach(function (p) {
            var post = SC.box(.07, 5.0, .07, SC.mat(0x8A90A8, { m: .6 }), p[0], 0, p[1]);
            post.userData.part = 'casing'; cu.mats.push(post.material); pick.push(post); cg.add(post);
        });
        cg.position.set(0, -.2, .1); root.add(cg);
        return { root: root, units: units, spin: spin, pick: pick, casing: cg, lineMat: lineMat };
    }

    function buildDet(id) {
        var def = SC.defs[id], m = def.build(SC), units = {}, pick = [];
        m.root.traverse(function (x) {
            if (!x.isMesh) return;
            x.material = cloneMat(x.material);
            var sid = x.userData.sub;
            if (sid) { units[sid] = units[sid] || { id: sid, mats: [], sel: 0, dim: 0 }; units[sid].mats.push(x.material); }
            pick.push(x);
        });
        return { def: def, m: m, units: units, pick: pick, root: m.root };
    }

    /* ================================================================ */
    SC.mount = function (o) {
        var stage = o.stage, canvas = o.canvas, tip = o.tip, slider = o.slider, toggle = o.toggle;
        var layout = stage.closest('.anat-layout'), side = layout.querySelector('.anat-side');
        var controls = $('.anat-controls', stage), hint = $('.anat-hint', stage), sliderWrap = $('.anat-slider', stage);
        var sliderLabel = $('span', sliderWrap);
        var W = stage.clientWidth, H = stage.clientHeight;

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(w.devicePixelRatio || 1, 2));
        renderer.setSize(W, H, false);
        var scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, W / H, .1, 80);
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        var key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 5, 7); scene.add(key);
        var rim = new THREE.PointLight(0x4A7CF7, 90, 0); rim.position.set(-6, 3, -3); scene.add(rim);
        var fill = new THREE.PointLight(0x7EB8B0, 45, 0); fill.position.set(5, -4, 5); scene.add(fill);

        var asm = buildAsm(); asm.root.position.y = .25; scene.add(asm.root);
        var detRoot = new THREE.Group(); detRoot.visible = false; scene.add(detRoot);
        var detCache = {}, det = null;

        var hex = {};
        SC.order.forEach(function (id) { hex[id] = new THREE.Color(SC.defs[id].warna).getHex(); });
        var asmHex = {}; Object.keys(o.colors || {}).forEach(function (k) { asmHex[k] = new THREE.Color(o.colors[k]).getHex(); });

        var st = {
            mode: 'asm', e: 0, eT: 0, open: 0, openT: 0, flip: 0, flipT: 0, sel: null, dsel: null, hov: null,
            rotY: -.55, rotX: .22, vY: 0, vX: 0, drag: false, idle: 1, lastMove: 0, camT: 10.5, touched: false,
            views: { asm: [-.55, .22], det: [-.4, .18] }
        };
        var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
        var ptr = { x: 0, y: 0, cx: 0, cy: 0, dirty: false, moved: 0, lx: 0, ly: 0 };

        /* ---------- UI: tab ---------- */
        var tabs = el('div', 'det-tabs', '<button type="button" role="tab" id="tab-asm" aria-selected="true">Rakit PC</button>' +
            '<button type="button" role="tab" id="tab-det" aria-selected="false" tabindex="-1">Model detail</button>');
        tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Mode tampilan 3D');
        layout.parentNode.insertBefore(tabs, layout);
        var tabAsm = $('#tab-asm', tabs), tabDet = $('#tab-det', tabs);
        tabAsm.addEventListener('click', function () { setMode('asm'); });
        tabDet.addEventListener('click', function () { setMode('det'); });
        tabs.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var m = st.mode === 'asm' ? 'det' : 'asm'; setMode(m); (m === 'asm' ? tabAsm : tabDet).focus(); }
        });

        /* ---------- UI: panel mode detail ---------- */
        var dside = el('div', 'det-side',
            '<div class="det-chips" id="det-models" role="group" aria-label="Pilih komponen"></div>' +
            '<div class="det-panel" id="det-panel" aria-live="polite">' +
            '<span class="anat-badge" id="det-badge"></span><h3 class="anat-name" id="det-name"></h3>' +
            '<p class="anat-text" id="det-intro"></p>' +
            '<div class="anat-row"><p class="anat-label">Bagian-bagian (klik untuk menyorot)</p><div class="det-chips" id="det-subs"></div></div>' +
            '<div class="anat-row anat-fact"><p class="anat-label" id="det-info-t"></p><p class="anat-text" id="det-info-p"></p></div>' +
            '<div class="anat-row" id="det-goto-row"><button type="button" class="btn-secondary" id="det-goto">Lihat posisinya di rakitan PC</button></div></div>');
        dside.hidden = true; side.appendChild(dside);
        var flipBtn = el('button', 'btn-secondary', 'Balik'); flipBtn.type = 'button'; flipBtn.id = 'det-flip';
        flipBtn.setAttribute('aria-pressed', 'false'); flipBtn.style.display = 'none'; controls.insertBefore(flipBtn, controls.firstChild);
        flipBtn.addEventListener('click', function () {
            st.flipT = st.flipT ? 0 : PI; flipBtn.setAttribute('aria-pressed', String(!!st.flipT));
        });
        $('#det-goto', dside).addEventListener('click', function () { var a = det && det.def.asm; setMode('asm'); if (a && o.select) o.select(a); });

        var modelChips = {}, subChips = {};
        SC.order.forEach(function (id) {
            var d = SC.defs[id], b = el('button', 'anat-chip', '<i aria-hidden="true"></i>'); b.type = 'button';
            b.setAttribute('aria-pressed', 'false'); b.style.setProperty('--c', d.warna);
            b.appendChild(document.createTextNode(d.nama.replace(/ \(.*\)/, '')));
            b.addEventListener('click', function () { showModel(id); });
            $('#det-models', dside).appendChild(b); modelChips[id] = b;
        });

        function setInfo(title, text) { $('#det-info-t', dside).textContent = title; $('#det-info-p', dside).textContent = text; }
        function selectSub(id) {
            st.dsel = id;
            Object.keys(subChips).forEach(function (k) { subChips[k].setAttribute('aria-pressed', String(k === id)); });
            if (!det) return;
            if (id) {
                var s = det.def.subs.filter(function (x) { return x.id === id; })[0];
                if (s) { setInfo(s.nama, s.teks); return; }
            }
            setInfo('Tahukah kamu?', det.def.fakta);
        }
        function syncCamera() {
            var asp = camera.aspect || 1;
            st.camT = st.mode === 'asm' ? 10.5 * clamp(1.15 / asp, 1, 1.75)
                : (det ? det.def.size * 2.4 / Math.min(1, asp) : 6);
        }
        function syncUI() {
            var v = st.mode === 'asm' ? st.e : st.open;
            slider.value = Math.round(v * 100);
            toggle.textContent = st.mode === 'asm' ? (v > .5 ? 'Rakit' : 'Bongkar') : (v > .5 ? 'Tutup' : 'Buka');
            toggle.setAttribute('aria-pressed', String(v > .5));
        }
        function syncControls() {
            var isDet = st.mode === 'det', can = !isDet || !!(det && det.def.open);
            flipBtn.style.display = isDet ? '' : 'none';
            toggle.style.display = can ? '' : 'none'; sliderWrap.style.display = can ? '' : 'none';
            sliderLabel.textContent = isDet ? 'Buka' : 'Jarak';
            slider.setAttribute('aria-label', isDet && det ? det.def.open : 'Jarak antar-komponen');
            hint.textContent = isDet ? 'Seret untuk memutar · klik bagian model' : 'Seret untuk memutar · klik komponen';
            syncUI();
        }

        function showModel(id) {
            det = detCache[id] = detCache[id] || buildDet(id);
            while (detRoot.children.length) detRoot.remove(detRoot.children[0]);
            detRoot.add(det.root);
            var d = det.def;
            st.open = st.openT = 0; st.flip = st.flipT = 0; st.dsel = null; st.hov = null;
            flipBtn.setAttribute('aria-pressed', 'false');
            if (det.m.open) det.m.open(0);
            Object.keys(modelChips).forEach(function (k) { modelChips[k].setAttribute('aria-pressed', String(k === id)); });
            var p = $('#det-panel', dside); p.style.setProperty('--c', d.warna);
            $('#det-badge', dside).textContent = d.kategori; $('#det-name', dside).textContent = d.nama;
            $('#det-intro', dside).textContent = d.intro;
            var box = $('#det-subs', dside); box.innerHTML = ''; subChips = {};
            d.subs.forEach(function (s) {
                var b = el('button', 'anat-chip'); b.type = 'button'; b.textContent = s.nama; b.setAttribute('aria-pressed', 'false');
                b.style.setProperty('--c', d.warna);
                b.addEventListener('click', function () { selectSub(st.dsel === s.id ? null : s.id); });
                box.appendChild(b); subChips[s.id] = b;
            });
            $('#det-goto-row', dside).style.display = d.asm ? '' : 'none';
            selectSub(null); syncCamera(); syncControls();
        }

        function setMode(m) {
            if (m === st.mode) return;
            st.views[st.mode] = [st.rotY, st.rotX];
            st.mode = m; st.rotY = st.views[m][0]; st.rotX = st.views[m][1]; st.vX = st.vY = 0; st.hov = null;
            tip.classList.remove('on');
            tabAsm.setAttribute('aria-selected', String(m === 'asm')); tabAsm.tabIndex = m === 'asm' ? 0 : -1;
            tabDet.setAttribute('aria-selected', String(m === 'det')); tabDet.tabIndex = m === 'det' ? 0 : -1;
            layout.classList.toggle('det-mode', m === 'det'); dside.hidden = m !== 'det';
            asm.root.visible = m === 'asm'; detRoot.visible = m === 'det';
            if (m === 'det' && !det) showModel(o.startModel || 'cpu'); else { syncCamera(); syncControls(); }
        }

        /* ---------- slider & tombol ---------- */
        slider.addEventListener('input', function () {
            var v = clamp(slider.value / 100, 0, 1); st.touched = true;
            if (st.mode === 'asm') st.e = st.eT = v; else st.open = st.openT = v;
            syncUI();
        });
        toggle.addEventListener('click', function () {
            st.touched = true;
            if (st.mode === 'asm') st.eT = st.e > .5 ? 0 : 1; else st.openT = st.open > .5 ? 0 : 1;
        });

        /* ---------- pointer ---------- */
        function setPointer(e) {
            var r = canvas.getBoundingClientRect();
            ptr.cx = e.clientX - r.left; ptr.cy = e.clientY - r.top;
            ptr.x = ptr.cx / r.width * 2 - 1; ptr.y = -(ptr.cy / r.height) * 2 + 1;
        }
        canvas.addEventListener('pointerdown', function (e) {
            st.drag = true; ptr.moved = 0; ptr.lx = e.clientX; ptr.ly = e.clientY; st.vX = st.vY = 0;
            canvas.classList.add('is-drag'); try { canvas.setPointerCapture(e.pointerId); } catch (er) { }
        });
        canvas.addEventListener('pointermove', function (e) {
            setPointer(e); ptr.dirty = true; st.lastMove = performance.now();
            if (!st.drag) return;
            var dx = e.clientX - ptr.lx, dy = e.clientY - ptr.ly; ptr.lx = e.clientX; ptr.ly = e.clientY;
            ptr.moved += Math.abs(dx) + Math.abs(dy);
            st.rotY += dx * .008; st.rotX = clamp(st.rotX + dy * .006, -.9, .9); st.vY = dx * .008; st.vX = dy * .006;
        });
        function endDrag(e) {
            if (!st.drag) return; st.drag = false; canvas.classList.remove('is-drag');
            if (e && e.type === 'pointerup' && ptr.moved < 6) { setPointer(e); pick(true); }
        }
        canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);
        canvas.addEventListener('pointerleave', function () { st.hov = null; tip.classList.remove('on'); canvas.classList.remove('is-hover'); });
        canvas.addEventListener('dblclick', function () { var v = st.mode === 'asm' ? [-.55, .22] : [-.4, .18]; st.rotY = v[0]; st.rotX = v[1]; st.vX = st.vY = 0; });

        function pick(click) {
            var isAsm = st.mode === 'asm', list = isAsm ? asm.pick : (det ? det.pick : []), key = isAsm ? 'part' : 'sub';
            ray.setFromCamera(ndc.set(ptr.x, ptr.y), camera);
            var hit = ray.intersectObjects(list, false)[0], id = hit ? hit.object.userData[key] : null;
            if (click) {
                if (isAsm) { if (o.select) o.select(id && id !== st.sel ? id : null); }
                else selectSub(id && id !== st.dsel ? id : null);
                return;
            }
            st.hov = id; canvas.classList.toggle('is-hover', !!id);
            if (id) {
                var name = isAsm ? (o.names && o.names[id]) : (det.def.subs.filter(function (s) { return s.id === id; })[0] || {}).nama;
                tip.textContent = name || id; tip.style.transform = 'translate(' + (ptr.cx + 14) + 'px,' + (ptr.cy - 30) + 'px)'; tip.classList.add('on');
            } else tip.classList.remove('on');
        }

        /* ---------- ukuran ---------- */
        function resize() {
            W = stage.clientWidth; H = stage.clientHeight; if (!W || !H) return;
            renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); syncCamera();
        }
        camera.position.z = 10.5; resize();
        if ('ResizeObserver' in w) new ResizeObserver(resize).observe(stage); else w.addEventListener('resize', resize);

        var visible = true;
        new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: .02 }).observe(stage);
        /* bongkar otomatis sekali saat bagian ini pertama kali terlihat, kecuali pengguna sudah menyentuh kontrol */
        var once = new IntersectionObserver(function (en) {
            if (en[0].isIntersecting) { once.disconnect(); if (!st.touched) st.eT = .7; }
        }, { threshold: .35 });
        once.observe(stage);

        /* ---------- loop render ---------- */
        function light(u, selT, dimT, hl, k) {
            u.sel += (selT - u.sel) * k; u.dim += (dimT - u.dim) * k;
            var on = u.sel > .02, tr = u.dim > .02;
            for (var i = 0; i < u.mats.length; i++) {
                var m = u.mats[i];
                if (on) { m.emissive.setHex(hl); m.emissiveIntensity = m.userData.ei + u.sel * .5; }
                else { m.emissive.setHex(m.userData.em); m.emissiveIntensity = m.userData.ei; }
                if (m.transparent !== tr) { m.transparent = tr; m.depthWrite = !tr; m.needsUpdate = true; }
                m.opacity = 1 - u.dim * .78;
            }
        }
        function spinAll(list, fast) { if (reduce) return; for (var i = 0; i < list.length; i++) list[i].rotation.z -= fast ? .17 : .05; }

        var clock = new THREE.Clock();
        function frame() {
            requestAnimationFrame(frame);
            if (!visible || document.hidden) return;
            var t = clock.getElapsedTime(), k = reduce ? 1 : .12, i, id;
            if (!st.drag) { st.rotY += st.vY; st.rotX = clamp(st.rotX + st.vX, -.9, .9); st.vY *= .93; st.vX *= .93; }
            var calm = performance.now() - st.lastMove > 2500 && !st.drag;
            st.idle += ((calm && !reduce ? 1 : 0) - st.idle) * .04;
            var sway = Math.sin(t * .4) * .16 * st.idle;
            var pe = st.e, po = st.open;
            st.e += (st.eT - st.e) * (reduce ? 1 : .08); st.open += (st.openT - st.open) * (reduce ? 1 : .09);
            st.flip += (st.flipT - st.flip) * (reduce ? 1 : .12);
            if (Math.abs(st.e - pe) > .0005 || Math.abs(st.open - po) > .0005) syncUI();
            camera.position.z += (st.camT - camera.position.z) * (reduce ? 1 : .08);
            if (ptr.dirty && !st.drag) { ptr.dirty = false; pick(false); }

            if (st.mode === 'asm') {
                asm.root.rotation.y = st.rotY + sway; asm.root.rotation.x = st.rotX;
                var e = st.e;
                for (id in asm.units) {
                    var u = asm.units[id], isSel = st.sel === id, isHov = st.hov === id;
                    for (i = 0; i < u.items.length; i++) u.items[i].g.position.lerpVectors(u.items[i].base, u.items[i].ex, e);
                    light(u, isSel ? 1 : (isHov ? .45 : 0), (st.sel && st.sel !== 'casing' && !isSel) ? 1 : 0, asmHex[id] || 0x4A7CF7, k);
                }
                asm.casing.scale.set(1 + e * .1, 1 + e * .05, 1 + e * .35); asm.casing.position.z = .1 + e * .1;
                asm.lineMat.opacity += ((st.sel === 'casing' ? 1 : .6 - e * .35) - asm.lineMat.opacity) * .12;
                spinAll(asm.spin, st.sel === 'gpu' || st.sel === 'cooler' || st.sel === 'psu');
            } else if (det) {
                detRoot.rotation.y = st.rotY + st.flip + sway; detRoot.rotation.x = st.rotX;
                if (det.m.open) det.m.open(st.open);
                if (det.m.tick && !reduce) det.m.tick(t);
                for (id in det.units) {
                    var du = det.units[id];
                    light(du, st.dsel === id ? 1 : (st.hov === id ? .45 : 0), (st.dsel && st.dsel !== id) ? 1 : 0, hex[det.def.id], k);
                }
                spinAll(det.m.spin || [], false);
            }
            renderer.render(scene, camera);
        }
        frame();

        return { setSelected: function (id) { st.sel = id; }, showModel: function (id) { setMode('det'); showModel(id); } };
    };
})(window);