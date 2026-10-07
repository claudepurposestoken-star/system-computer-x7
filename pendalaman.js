/* pendalaman.js: tab Pendalaman. Label: buku = isi buku; dalam = sumber lain; catatan = meluruskan salah kaprah */
(function () {
    'use strict';
    var root = document.getElementById('dal'); if (!root) return;
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
    var TG = { buku: 'Materi buku', dalam: 'Pendalaman', catatan: 'Catatan', inti: 'Inti untuk diingat' };

    /* pilihan bertombol + keterangan; dipakai ulang oleh beberapa widget */
    function pick(h, items, first) {
        var row = el('div', 'pd-pk'), t = el('b'), p = el('p'), bs = [];
        function go(i) { bs.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i); }); t.textContent = items[i][1]; p.textContent = items[i][2]; }
        items.forEach(function (x, i) { var b = el('button', '', x[0]); b.type = 'button'; b.onclick = function () { go(i); }; row.appendChild(b); bs.push(b); });
        var box = el('div', 'pd-out'); box.setAttribute('aria-live', 'polite'); box.appendChild(t); box.appendChild(p);
        h.appendChild(row); h.appendChild(box); go(first || 0);
        return { go: go, n: items.length };
    }
    var W = {};
    W.ipos = function (h) {
        pick(h, [['Input', 'Data masuk', 'Keyboard, mouse, mikrofon, kamera, layar sentuh, scanner.'],
        ['Process', 'Data diolah', 'CPU (dan GPU) menjalankan instruksi. RAM menjadi memori kerjanya.'],
        ['Output', 'Hasil ditampilkan', 'Monitor, speaker, printer, proyektor.'],
        ['Storage', 'Data disimpan', 'SSD, HDD, flashdisk, kartu memori. Data tetap ada saat komputer dimatikan.']]);
    };
    W.hw = function (h) {
        pick(h, [['Input', 'Memasukkan data atau perintah', 'Keyboard, mouse, scanner, mikrofon, kamera, layar sentuh.'],
        ['Process', 'Mengolah data dan instruksi', 'CPU dan GPU.'],
        ['Output', 'Menyajikan hasil kepada pengguna', 'Monitor, speaker, printer, proyektor.'],
        ['Storage', 'Menyimpan data', 'HDD, SSD, flashdisk, kartu memori.']]);
    };
    W.mem = function (h) {
        var on = true, b = el('button', 'pd-btn'), g = el('div', 'pd-2'), r = el('div', 'pd-box'), s = el('div', 'pd-box'), m = el('p', 'pd-note');
        b.type = 'button'; m.setAttribute('aria-live', 'polite');
        s.innerHTML = '<b>SSD / HDD</b><small>non-volatile</small><i>Berkas yang sudah disimpan</i>';
        function draw() {
            r.className = 'pd-box' + (on ? '' : ' pd-gone');
            r.innerHTML = '<b>RAM</b><small>volatile</small><i>' + (on ? 'Dokumen yang sedang dibuka' : 'Kosong') + '</i>';
            b.textContent = on ? 'Matikan listrik' : 'Nyalakan lagi';
            m.textContent = on ? 'Komputer menyala: RAM berisi data yang sedang dipakai.' : 'Listrik mati: isi RAM hilang. Hanya yang sudah disimpan di SSD/HDD yang tetap ada.';
        }
        b.onclick = function () { on = !on; draw(); };
        g.appendChild(r); g.appendChild(s); h.appendChild(g); h.appendChild(b); h.appendChild(m); draw();
    };
    W.bt = function (h) {
        var R = [['Microcomputer', 'Kategori ukuran paling kecil, memakai microprocessor sebagai CPU.', 'Hampir semua komputer modern berbasis microprocessor, termasuk PC dan laptop. Istilah ini kategori pengajaran, bukan batas teknis.'],
        ['Ultrabook', 'Contoh microcomputer.', 'Ultrabook adalah laptop yang tipis dan ringan.'],
        ['Mini PC', 'Peralihan dari PC ke komputer mini industri.', 'Umumnya berarti PC berukuran kecil (small form factor).'],
        ['Arduino', 'Dibahas bersama contoh microcomputer; platform elektronik open-source.', 'Papan berbasis mikrokontroler, bukan komputer serba guna. Raspberry Pi adalah SBC yang menjalankan Linux lengkap.'],
        ['Minicomputer', 'Makin jarang dipakai karena cloud lebih praktis dipelihara.', 'Penurunannya juga didorong PC, microprocessor, workstation, server, dan jaringan. Cloud hanya salah satu faktor.'],
        ['Supercomputer', 'Ukuran paling besar; triliunan instruksi per detik.', 'Ciri utamanya kinerja komputasi sangat tinggi, diukur dalam FLOPS (operasi floating-point per detik), bukan ukuran fisik.']];
        var tg = el('div', 'pd-pk'), ul = el('dl', 'pd-dl'), bs = [], mode = 1;
        [['Menurut buku', 1], ['Secara teknis', 2]].forEach(function (x) {
            var b = el('button', '', x[0]); b.type = 'button'; b.onclick = function () { mode = x[1]; draw(); }; tg.appendChild(b); bs.push(b);
        });
        function draw() {
            bs.forEach(function (b, k) { b.setAttribute('aria-pressed', k + 1 === mode); }); ul.innerHTML = '';
            R.forEach(function (x) { var d = el('div'); d.appendChild(el('dt', '', x[0])); d.appendChild(el('dd', '', x[mode])); ul.appendChild(d); });
        }
        h.appendChild(tg); h.appendChild(ul); draw();
    };
    W.vs = function (h) {
        var g = el('div', 'pd-2');
        [['Mainframe', ['Fokus: transaksi besar, keandalan, keamanan, banyak pengguna', 'Contoh pemakaian: perbankan, asuransi, pemerintahan', 'Contoh: IBM z Systems']],
        ['Supercomputer', ['Fokus: simulasi dan komputasi ilmiah yang sangat berat', 'Kinerja diukur dalam FLOPS', 'Contoh pemakai: NASA. TOP500 Juni 2026 peringkat 1: LineShine, 2,198 EFLOPS (HPL)']]].forEach(function (c) {
            var d = el('div', 'pd-box'); d.appendChild(el('b', '', c[0])); c[1].forEach(function (t) { d.appendChild(el('i', '', t)); }); g.appendChild(d);
        });
        h.appendChild(g); h.appendChild(el('p', 'pd-note', 'Skala satuan FLOPS:'));
        pick(h, [['TFLOPS', '10\u00B9\u00B2 operasi per detik', '1 teraflops = 1 triliun operasi floating-point per detik.'],
        ['PFLOPS', '10\u00B9\u2075 operasi per detik', '1 petaflops = 1.000 teraflops.'],
        ['EFLOPS', '10\u00B9\u2078 operasi per detik', '1 exaflops = 1.000 petaflops. Sistem exascale mencapai orde ini pada benchmark HPL.']], 2);
    };
    W.bit = function (h) {
        var v = [0, 1, 0, 0, 1, 0, 0, 0], row = el('div', 'pd-bits'), o = el('p', 'pd-out'), bs = [];
        o.setAttribute('aria-live', 'polite');
        v.forEach(function (_, i) {
            var c = el('div'), b = el('button'), s = el('small', '', String(128 >> i)); b.type = 'button'; b.setAttribute('aria-label', 'Bit bernilai ' + (128 >> i));
            b.onclick = function () { v[i] ^= 1; draw(); }; c.appendChild(b); c.appendChild(s); row.appendChild(c); bs.push(b);
        });
        function draw() {
            var n = 0; v.forEach(function (x, i) { n += x << (7 - i); n = n; bs[i].textContent = x; bs[i].setAttribute('aria-pressed', x == 1); });
            o.textContent = 'Biner ' + v.join('') + ' = desimal ' + n + (n > 31 && n < 127 ? ' = karakter "' + String.fromCharCode(n) + '" (ASCII)' : ' (bukan karakter yang tercetak)');
        }
        h.appendChild(row); h.appendChild(o); draw();
    };
    W.cpu = function (h) {
        h.appendChild(el('p', 'pd-note', 'Bagian CPU'));
        pick(h, [['ALU', 'Arithmetic Logic Unit', 'Melakukan operasi aritmetika dan logika: tambah, kurang, bandingkan.'],
        ['Control Unit', 'Unit kendali', 'Mengatur dan mengoordinasikan pelaksanaan instruksi.'],
        ['Register', 'Penyimpanan sangat cepat', 'Berada di dalam CPU, menampung data yang sedang dipakai.'],
        ['Core', 'Inti pemrosesan', 'CPU modern punya beberapa core sehingga bisa mengerjakan beberapa pekerjaan sekaligus.']]);
        h.appendChild(el('p', 'pd-note', 'Siklus instruksi'));
        var c = pick(h, [['Fetch', 'Mengambil', 'CPU mengambil instruksi dari memori.'], ['Decode', 'Menerjemahkan', 'Instruksi diterjemahkan agar CPU tahu apa yang harus dilakukan.'], ['Execute', 'Menjalankan', 'CPU menjalankan instruksi, lalu siklus berulang ke instruksi berikutnya.']]);
        var b = el('button', 'pd-btn', 'Langkah berikutnya'), i = 0; b.type = 'button'; b.onclick = function () { i = (i + 1) % c.n; c.go(i); }; h.appendChild(b);
    };
    W.ui = function (h) {
        var tg = el('div', 'pd-pk'), pn = el('div', 'pd-out'), bs = [];
        function gui() {
            pn.innerHTML = ''; var r = el('div', 'pd-gui');['Ikon', 'Menu', 'Button', 'Text box'].forEach(function (x) { r.appendChild(el('span', '', x)); });
            pn.appendChild(r); pn.appendChild(el('p', '', 'Pengguna memilih elemen visual dengan klik atau sentuhan. Mudah dipelajari pemula.'));
        }
        function mk() { return { k: Object.create(null) }; }
        function cli() {
            pn.innerHTML = '';
            var cwd = [mk()], path = ['~'], log = el('pre', 'pd-term', 'Ketik help lalu tekan Enter.'), f = el('form', 'pd-cmd'), pr = el('span'), inp = el('input'), tp = el('div', 'pd-pk pd-tip');
            inp.type = 'text'; inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('aria-label', 'Ketik perintah');
            function prompt() { pr.textContent = path.join('/') + ' $'; }
            function exec(s) {
                var a = s.trim().split(/\s+/), c = a[0], g = a[1], k = cwd[cwd.length - 1].k;
                if (!c) return '';
                if (c === 'help') return 'Perintah: help, pwd, ls (atau dir), mkdir <nama>, cd <nama>, cd .., clear';
                if (c === 'pwd') return path.join('/');
                if (c === 'ls' || c === 'dir') return Object.keys(k).join('  ') || '(folder kosong)';
                if (c === 'mkdir') {
                    if (!g) return 'mkdir: tulis nama folder, contoh: mkdir tugas';
                    if (!/^\w[\w.-]*$/.test(g)) return 'mkdir: pakai huruf, angka, titik, - atau _';
                    if (k[g]) return 'mkdir: folder sudah ada';
                    k[g] = mk(); return '';
                }
                if (c === 'cd') {
                    if (g === '..') { if (cwd.length > 1) { cwd.pop(); path.pop(); } return ''; }
                    if (g && k[g]) { cwd.push(k[g]); path.push(g); return ''; }
                    return 'cd: folder tidak ditemukan';
                }
                if (c === 'clear') { log.textContent = ''; return null; }
                return c + ': perintah tidak dikenal. Ketik help.';
            }
            function run(s) {
                var p0 = pr.textContent, r = exec(s); prompt();
                if (r === null) return;
                log.textContent += '\n' + p0 + ' ' + s + (r ? '\n' + r : ''); log.scrollTop = log.scrollHeight;
            }
            f.onsubmit = function (e) { e.preventDefault(); run(inp.value); inp.value = ''; };
            ['mkdir tugas', 'cd tugas', 'pwd', 'ls', 'cd ..'].forEach(function (x) { var b = el('button', '', x); b.type = 'button'; b.onclick = function () { run(x); }; tp.appendChild(b); });
            prompt(); f.appendChild(pr); f.appendChild(inp);
            pn.appendChild(log); pn.appendChild(f); pn.appendChild(el('p', 'pd-note', 'Coba urutan ini')); pn.appendChild(tp);
            pn.appendChild(el('p', '', 'Ini simulasi sederhana. CLI asli bekerja dengan prinsip yang sama: ketik perintah, tekan Enter, baca hasilnya.'));
        }
        [['GUI', gui], ['CLI', cli]].forEach(function (x, i) {
            var b = el('button', '', x[0]); b.type = 'button'; b.onclick = function () { bs.forEach(function (q, k) { q.setAttribute('aria-pressed', k === i); }); x[1](); }; tg.appendChild(b); bs.push(b);
        });
        h.appendChild(tg); h.appendChild(pn); bs[1].click();
    };

    var T = [
        {
            id: 'ipos', n: 'IPOS', t: 'Input, Process, Output, Storage', w: 'ipos', b: [
                ['buku', 'Komputer menerima data (input), mengolahnya dengan CPU (proses), lalu menyajikan hasil sebagai informasi (output) berupa teks, gambar, suara, atau video. Contoh: keyboard, CPU, monitor.'],
                ['dalam', 'Pada sistem komputer modern ada unsur keempat, yaitu Storage: tempat menyimpan data agar bisa dipakai lagi. Model empat tahap ini disebut IPOS.'],
                ['catatan', 'Storage tidak sama dengan RAM. RAM hanya memori kerja sementara.'],
                ['inti', 'IPOS = Input - Process - Output - Storage']]
        },
        {
            id: 'hw', n: 'Hardware', t: 'Klasifikasi hardware', w: 'hw', b: [
                ['buku', 'Hardware adalah komponen fisik komputer yang dapat disentuh, dilihat, atau dipindahkan. Contoh: mouse, hard disk, processor, RAM, printer, scanner.'],
                ['dalam', 'Menurut fungsinya, hardware dikelompokkan menjadi perangkat input, proses, output, dan penyimpanan. Pilih kelompoknya di bawah.'],
                ['inti', 'Input = masuk. Process = mengolah. Output = keluar. Storage = menyimpan.']]
        },
        {
            id: 'mem', n: 'RAM dan Storage', t: 'RAM, ROM, dan penyimpanan', w: 'mem', b: [
                ['buku', 'Buku menyebut RAM sebagai tempat penyimpanan data sementara ketika komputer bekerja.'],
                ['dalam', ['RAM bersifat volatile: datanya hilang saat daya listrik padam.', 'SSD dan HDD bersifat non-volatile: data tetap ada walau komputer dimatikan.', 'ROM (Read-Only Memory) secara historis hanya untuk dibaca. Kini ada memori non-volatile yang bisa ditulis ulang, misalnya flash.']],
                ['catatan', 'RAM bukan penyimpanan permanen. Karena itu dokumen harus disimpan (Save) sebelum komputer dimatikan. Lihat model RAM, SSD, dan HDD di tab Jelajah.'],
                ['inti', 'RAM = volatile. SSD/HDD/flash = non-volatile.']]
        },
        {
            id: 'sw', n: 'Software dan OS', t: 'Jenis software dan fungsi sistem operasi', b: [
                ['buku', 'Software berupa kode program yang dibuat dengan bahasa pemrograman, berisi instruksi untuk menjalankan tugas atau mengendalikan hardware. Contohnya sistem operasi (Windows, macOS, Linux, Android) dan aplikasi.'],
                ['dalam', ['Sistem operasi: mengelola sumber daya komputer dan melayani aplikasi.', 'Aplikasi: dipakai pengguna untuk tugas tertentu, misalnya browser dan game.', 'Utilitas: membantu perawatan sistem, misalnya pencadangan dan pengelola arsip.', 'Driver: membuat sistem operasi bisa berkomunikasi dengan perangkat, misalnya printer.', 'Firmware: software tertanam di perangkat untuk fungsi dasarnya, misalnya pada router atau SSD.']],
                ['dalam', 'Fungsi sistem operasi: mengelola perangkat keras, memori, proses, dan berkas, serta menyediakan antarmuka bagi pengguna dan aplikasi.'],
                ['catatan', 'Kernel adalah inti sistem operasi yang bekerja dekat dengan hardware. Sistem berkas (file system) mengatur cara berkas disusun dan disimpan, sedangkan File Explorer hanyalah aplikasi untuk mengaksesnya. Jadi File Explorer bukan bagian kernel.'],
                ['inti', 'Kernel = inti OS. File system = pengatur berkas. File Explorer = aplikasi.']]
        },
        {
            id: 'kl', n: 'Buku vs teknis', t: 'Klasifikasi komputer: buku dan dunia teknis', w: 'bt', b: [
                ['buku', 'Buku membagi komputer menjadi enam jenis menurut ukuran dan kemampuan: microcomputer, PC, mini PC, minicomputer, mainframe, supercomputer. Ini klasifikasi untuk pembelajaran.'],
                ['catatan', 'Beberapa istilah punya makna teknis yang lebih luas. Ganti tombol di bawah untuk membandingkan pandangan buku dan penggunaan di dunia teknologi. Keduanya boleh dipelajari, asal diberi label yang benar.']]
        },
        {
            id: 'sk', n: 'FLOPS dan TOP500', t: 'Mainframe, supercomputer, dan FLOPS', w: 'vs', b: [
                ['buku', 'Mainframe dipakai perusahaan besar, sering sebagai server (contoh IBM z Systems). Supercomputer berkapasitas dan berkinerja paling kuat, dipakai antara lain oleh NASA.'],
                ['catatan', 'FLOPS adalah Floating-Point Operations Per Second, yaitu operasi bilangan pecahan per detik. FLOPS bukan jumlah instruksi per detik.'],
                ['dalam', 'Pada daftar TOP500 edisi Juni 2026 (edisi ke-67), peringkat 1 adalah LineShine (Shenzhen, Tiongkok) dengan 2,198 EFLOPS dan peringkat 2 El Capitan (AS) dengan 1,809 EFLOPS. Angka itu hasil benchmark HPL (LINPACK), dan daftar diperbarui tiap Juni dan November.'],
                ['inti', 'Mainframe = transaksi andal. Supercomputer = komputasi ilmiah, diukur FLOPS.']]
        },
        {
            id: 'bit', n: 'Bit dan byte', t: 'Bit dan byte', w: 'bit', b: [
                ['dalam', ['Bit (binary digit) hanya bernilai 0 atau 1.', '1 byte = 8 bit. Satu byte bisa menyimpan satu karakter, misalnya huruf.', 'Satuan SI: 1 KB = 1.000 byte. Satuan biner: 1 KiB = 1.024 byte. Jangan mencampur KB dengan KiB.']],
                ['dalam', 'Coba ubah bit di bawah. Inilah cara huruf yang kamu ketik di halaman Alur disimpan sebagai angka.'],
                ['inti', '1 byte = 8 bit. Komputer menyimpan semua data sebagai 0 dan 1.']]
        },
        {
            id: 'cpu', n: 'CPU', t: 'CPU, siklus instruksi, dan Von Neumann', w: 'cpu', b: [
                ['buku', 'Data diproses oleh Central Processing Unit (CPU) pada tahap proses.'],
                ['dalam', 'Pada arsitektur Von Neumann, program dan data disimpan di memori dan diambil CPU untuk dijalankan. Itulah yang dimaksud "proses" dalam input-proses-output.'],
                ['inti', 'CPU: fetch, decode, execute, lalu ulangi.']]
        },
        {
            id: 'ui', n: 'GUI vs CLI', t: 'GUI dan CLI', w: 'ui', b: [
                ['buku', 'GUI (Graphical User Interface) memakai menu dan elemen grafis seperti ikon, button, text box, radio button, dan checkbox, sehingga pengguna tidak harus selalu mengetik perintah.'],
                ['dalam', 'CLI (Command Line Interface) adalah antarmuka berbasis teks: pengguna mengetik perintah, menekan Enter, lalu komputer menjawab dengan teks. Perintah dibaca oleh program bernama shell, misalnya Command Prompt atau PowerShell di Windows, serta Terminal di macOS dan Linux.'],
                ['dalam', ['Perintah umum: mkdir (membuat folder), cd (pindah folder), ls atau dir (menampilkan isi folder), pwd (menampilkan lokasi saat ini).', 'Kelebihan CLI: ringan, cepat bagi yang sudah hafal, dan pekerjaan berulang bisa diotomatisasi dengan skrip. Karena itu CLI banyak dipakai programmer dan administrator server.', 'Kekurangan CLI: perintah harus dihafal, dan salah ketik menghasilkan pesan galat (error), jadi kurang ramah bagi pemula.', 'Kelebihan GUI: visual dan mudah dipelajari. Kekurangannya: butuh sumber daya lebih besar dan tugas berulang lebih lambat dikerjakan lewat klik.']],
                ['catatan', 'GUI dan CLI sama-sama cara meminta sistem operasi mengerjakan sesuatu. Banyak orang memakai keduanya sesuai kebutuhan.'],
                ['inti', 'GUI = ikon dan menu. CLI = perintah teks yang dibaca shell.']]
        },
        {
            id: 'lc', n: 'Lisensi dan cloud', t: 'Lisensi, cloud, dan server', b: [
                ['dd', [['Open source', 'Kode sumber tersedia dengan lisensi yang membolehkan pengguna mempelajari, mengubah, dan membagikannya sesuai ketentuan. Contoh: Linux.'],
                ['Proprietary', 'Dikendalikan pemiliknya dengan ketentuan lisensi tertentu; kode sumbernya umumnya tidak terbuka. Contoh: Windows.'],
                ['Freeware', 'Gratis dipakai, tetapi tidak otomatis open source. Freeware tidak sama dengan open source.'],
                ['Cloud computing', 'Memakai sumber daya komputasi (server, penyimpanan, database, aplikasi) lewat jaringan atau internet, tanpa harus memiliki infrastrukturnya sendiri.'],
                ['Server', 'Sistem komputer yang melayani komputer atau program lain (client): berkas, halaman web, database. Server bukan sekadar komputer besar.']]]]
        },
        {
            id: 'ref', n: 'Sumber', t: 'Sumber dan tanggal pembaruan', b: [
                ['buku', 'Mushthofa, dkk. (2021). Informatika untuk SMA Kelas X. Jakarta: Pusat Kurikulum dan Perbukuan, Kemendikbudristek. Bab Sistem Komputer, hlm. 65-69.'],
                ['ref', [['TOP500: daftar Juni 2026', 'https://top500.org/lists/top500/2026/06/'], ['Raspberry Pi Documentation: komputer Raspberry Pi', 'https://www.raspberrypi.com/documentation/computers/raspberry-pi.html'], ['IBM: apa itu mainframe', 'https://www.ibm.com/think/topics/mainframe'], ['NIST: definisi ROM', 'https://csrc.nist.gov/glossary/term/rom'], ['Microsoft Learn: sistem berkas', 'https://learn.microsoft.com/id-id/windows/win32/fileio/file-systems'], ['Arduino', 'https://www.arduino.cc/']]],
                ['catatan', 'Materi bertanda Pendalaman dan Catatan diperbarui 4 Oktober 2026. Data yang berubah, seperti TOP500, selalu ditulis dengan bulan dan tahunnya.']]
        }
    ];

    var tabs = el('div', 'pd-tabs'), body = el('div'), tb = [];
    tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Topik pendalaman');
    root.appendChild(tabs); root.appendChild(body);
    function block(b) {
        var d = el('div', 'pd-bl ' + b[0]);
        if (b[0] === 'dd') {
            d = el('div');
            b[1].forEach(function (x) { var q = el('details', 'dd'), s = el('summary', '', x[0]); q.appendChild(s); q.appendChild(el('p', '', x[1])); d.appendChild(q); });
            return d;
        }
        if (b[0] === 'ref') {
            var u = el('ul'); b[1].forEach(function (x) { var l = el('li'), a = el('a', '', x[0]); a.href = x[1]; a.target = '_blank'; a.rel = 'noopener'; l.appendChild(a); u.appendChild(l); }); d.className = 'pd-bl dalam';
            d.appendChild(el('span', 'pd-tag', 'Sumber pendalaman')); d.appendChild(u); return d;
        }
        d.appendChild(el('span', 'pd-tag', TG[b[0]]));
        if (Array.isArray(b[1])) { var ul = el('ul'); b[1].forEach(function (x) { ul.appendChild(el('li', '', x)); }); d.appendChild(ul); }
        else d.appendChild(el('p', '', b[1]));
        return d;
    }
    function show(i) {
        var t = T[i], c = el('article', 'pd-card'), done = !t.w;
        tb.forEach(function (b, k) { b.setAttribute('aria-selected', k === i); });
        body.innerHTML = ''; c.appendChild(el('h3', '', t.t));
        function wid() { var h = el('div', 'pd-w'); W[t.w](h); c.appendChild(h); done = true; }
        t.b.forEach(function (b) { if (b[0] === 'inti' && !done) wid(); c.appendChild(block(b)); });
        if (!done) wid();
        body.appendChild(c);
    }
    T.forEach(function (t, i) { var b = el('button', '', t.n); b.type = 'button'; b.setAttribute('role', 'tab'); b.onclick = function () { show(i); }; tabs.appendChild(b); tb.push(b); });
    show(0);
})();