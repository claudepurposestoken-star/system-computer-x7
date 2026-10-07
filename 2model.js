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