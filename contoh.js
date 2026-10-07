/* contoh.js: penjelasan rinci untuk tiap contoh Hardware dan Software yang dibuka dari kartu Tiga unsur.
   Format: nama: [kelompok, ringkasan, fungsi, cara kerja[], bagian[], fakta, memakai hardware (khusus software), label bagian] */
(function () {
    'use strict';
    var d = document, mo = d.querySelector('.xm'); if (!mo) return;
    var t = mo.querySelector('.xm-t'), cap = mo.querySelector('.xm-c'), card = mo.querySelector('.xm-card');
    var box = d.createElement('div'); box.className = 'xi'; card.appendChild(box);
    function el(n, c, x) { var e = d.createElement(n); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
    var SWNOTE = ' Software tidak punya bentuk fisik, jadi ditampilkan sebagai tampilan 2D.';

    var I = {
        Mouse: ['Hardware: perangkat input', 'Perangkat penunjuk: mengubah gerakan tangan dan klik menjadi data untuk komputer.',
            'Menggerakkan penunjuk (pointer) di layar dan memilih objek lewat klik. Inilah yang membuat GUI mudah dipakai.',
            ['Sensor optik di dasar mouse memotret permukaan meja ribuan kali per detik.', 'Pengendali membandingkan foto yang berurutan untuk menghitung arah dan jarak geser.', 'Data gerakan dan status tombol dikirim lewat kabel USB atau nirkabel.', 'Sistem operasi menggerakkan pointer sesuai data itu dan menjalankan perintah saat tombol ditekan.'],
            ['Sensor optik: mendeteksi gerakan.', 'Tombol kiri dan kanan: memakai saklar kecil (microswitch).', 'Roda gulir: menggulir halaman.', 'Papan sirkuit: mengolah sinyal menjadi data.', 'Kabel USB atau modul nirkabel: jalur ke komputer.'],
            'Angka DPI menyatakan kepekaan mouse: makin tinggi, makin jauh pointer bergerak untuk geseran yang sama. Mouse lama memakai bola karet, mouse modern memakai sensor optik.'],
        Keyboard: ['Hardware: perangkat input', 'Papan tombol: tiap tombol yang ditekan dikirim ke komputer sebagai data.',
            'Memasukkan teks, angka, dan perintah.',
            ['Tiap tombol terhubung ke jaringan kisi (matriks) di papan sirkuit.', 'Saat tombol ditekan, pengendali mendeteksi posisinya dan mengubahnya menjadi kode tombol.', 'Kode dikirim ke komputer lewat kabel atau nirkabel.', 'Sistem operasi menerjemahkan kode menjadi huruf sesuai tata letak (misalnya QWERTY), lalu aplikasi menampilkannya.'],
            ['Tombol dan saklar: tipe membran atau mekanis.', 'Papan sirkuit dan pengendali: memindai tombol.', 'Casing dan kabel atau pemancar nirkabel.'],
            'Keyboard mekanis memakai saklar terpisah untuk tiap tombol, sedangkan keyboard membran memakai lapisan karet tipis di bawah tombol.'],
        Monitor: ['Hardware: perangkat output', 'Menampilkan hasil pengolahan sebagai gambar dan teks.',
            'Menampilkan hasil pemrosesan kepada pengguna.',
            ['Kartu grafis (GPU) menyusun gambar menjadi bingkai (frame) berisi piksel.', 'Bingkai dikirim lewat kabel HDMI atau DisplayPort.', 'Panel mengatur terang dan warna tiap piksel (campuran merah, hijau, dan biru).', 'Bingkai diperbarui puluhan kali per detik sehingga gambar tampak bergerak.'],
            ['Panel layar (misalnya LCD berlampu latar LED): menghasilkan gambar.', 'Papan pengendali: menerjemahkan sinyal video.', 'Port video dan catu daya.'],
            'Resolusi 1920 x 1080 berarti 1.920 piksel mendatar dan 1.080 piksel menurun. Refresh rate 60 Hz berarti layar diperbarui 60 kali per detik.'],
        'Hard disk': ['Hardware: penyimpanan (storage)', 'Menyimpan data secara permanen pada piringan magnetik yang berputar.',
            'Menyimpan sistem operasi, aplikasi, dan berkasmu. Datanya tetap ada walau komputer dimatikan (non-volatile).',
            ['Motor memutar piringan, umumnya 5.400 atau 7.200 putaran per menit.', 'Lengan menggerakkan head ke jalur (track) yang dituju.', 'Head menulis data dengan memagnetkan permukaan piringan, dan membaca data dari pola magnet itu.', 'Data disusun dalam jalur dan sektor, diatur oleh pengendali dan sistem berkas.'],
            ['Piringan (platter): tempat data tersimpan.', 'Lengan dan head: membaca dan menulis.', 'Motor: memutar piringan.', 'Papan pengendali (PCB): mengatur lalu lintas data.', 'Rangka dan tutup: melindungi dari debu.'],
            'Head tidak menyentuh piringan, tetapi melayang di atas lapisan udara yang sangat tipis, jadi HDD yang sedang bekerja tidak boleh terguncang. Dibanding SSD, HDD lebih murah per GB tetapi lebih lambat dan punya bagian bergerak.'],
        Processor: ['Hardware: pemroses (process)', 'Otak komputer: menjalankan instruksi program dan mengolah data.',
            'Menjalankan instruksi dari software dan mengatur kerja komponen lain. Inilah tahap Proses dalam input-proses-output.',
            ['Mengambil instruksi dari memori (fetch).', 'Menerjemahkan instruksi (decode).', 'Menjalankannya (execute), misalnya menghitung di ALU.', 'Mengulang siklus ini miliaran kali per detik.'],
            ['Die: kepingan silikon berisi miliaran transistor.', 'Core: inti pemrosesan. CPU modern punya beberapa.', 'Cache: memori kecil yang sangat cepat di dalam CPU.', 'Heat spreader: pelat logam penyebar panas.', 'Substrat dan kontak: papan dasar dan sambungan ke soket motherboard.'],
            'Kecepatan CPU diukur dalam GHz. CPU menghasilkan panas, jadi selalu dipasangi pendingin dan pasta termal.'],
        RAM: ['Hardware: memori kerja', 'Memori kerja sementara: tempat program dan data yang sedang dipakai.',
            'Menampung program dan data yang sedang dipakai supaya processor dapat mengaksesnya dengan cepat.',
            ['Saat aplikasi dibuka, programnya disalin dari SSD/HDD ke RAM.', 'Processor membaca dan menulis data di RAM jauh lebih cepat daripada di penyimpanan.', 'Saat aplikasi ditutup, ruangnya dibebaskan untuk program lain.', 'Saat listrik padam, isi RAM hilang (volatile).'],
            ['Chip DRAM: sel-sel penyimpan data.', 'PCB modul: papan tempat chip dipasang.', 'Kontak emas: jalur ke slot di motherboard.', 'Takik (notch): penanda jenis RAM agar tidak salah pasang.'],
            'Makin besar kapasitas RAM, makin banyak program yang bisa berjalan bersamaan tanpa melambat. RAM DDR4 dan DDR5 tidak bisa dipasang di slot yang sama.'],
        Printer: ['Hardware: perangkat output', 'Mengubah dokumen digital menjadi cetakan di kertas.',
            'Menghasilkan keluaran berupa cetakan.',
            ['Aplikasi mengirim perintah cetak ke sistem operasi.', 'Driver printer menerjemahkan data ke bahasa yang dipahami printer.', 'Printer mengubahnya menjadi pola titik.', 'Mekanisme cetak memindahkan titik itu ke kertas.'],
            ['Inkjet: menyemprotkan tetesan tinta sangat kecil.', 'Laser: memakai toner (serbuk) yang direkatkan ke kertas dengan panas.', 'Dot matrix: jarum menumbuk pita tinta, bisa mencetak rangkap.', 'Rol dan motor: menarik kertas.'],
            'Tanpa driver yang sesuai, komputer tidak dapat mengenali printer. Ini contoh kerja sama hardware dan software.', null, 'Jenis dan bagian'],
        Scanner: ['Hardware: perangkat input', 'Mengubah dokumen atau gambar fisik menjadi berkas digital.',
            'Memasukkan informasi dari dokumen atau objek ke komputer.',
            ['Lampu menyinari dokumen.', 'Sensor menangkap cahaya yang dipantulkan dan mengubahnya menjadi sinyal listrik.', 'Pengendali mengubah sinyal menjadi piksel digital.', 'Komputer menyimpannya sebagai gambar atau PDF.'],
            ['Kaca pemindai (flatbed): tempat dokumen.', 'Lampu dan sensor: bergerak menyusuri dokumen.', 'Penutup: mencegah cahaya luar.', 'Kabel USB: jalur ke komputer.'],
            'Resolusi pemindaian dinyatakan dalam dpi. Dengan software OCR, gambar teks hasil scan bisa diubah menjadi teks yang dapat disunting.'],

        Windows: ['Software: sistem operasi', 'Sistem operasi buatan Microsoft yang banyak dipakai pada PC dan laptop.',
            'Mengatur hardware, menyediakan tampilan jendela dan ikon, dan menjadi tempat aplikasi berjalan.',
            ['Saat komputer menyala, sistem dimuat dari penyimpanan ke RAM.', 'Windows memuat driver dan layanan sistem.', 'Desktop tampil dan kamu membuka aplikasi.', 'Setiap aplikasi meminta Windows untuk memakai memori, berkas, dan perangkat.'],
            ['Kernel: mengelola proses dan memori.', 'Driver: berkomunikasi dengan perangkat.', 'Sistem berkas: mengatur berkas dan folder.', 'Antarmuka grafis: desktop, jendela, bilah tugas.'],
            'Windows adalah software proprietary (berlisensi) dan tersedia dalam banyak versi.', 'Seluruh hardware: processor, RAM, penyimpanan, keyboard, mouse, monitor.', 'Komponen'],
        macOS: ['Software: sistem operasi', 'Sistem operasi buatan Apple untuk komputer Mac.',
            'Mengatur hardware Mac dan menjalankan aplikasi dengan tampilan khasnya.',
            ['Sistem dimuat saat Mac dinyalakan.', 'Desktop tampil dengan bilah menu di atas dan Dock di bawah.', 'Pengguna membuka berkas lewat Finder atau aplikasi lewat Dock.', 'Permintaan aplikasi diteruskan sistem ke hardware.'],
            ['Finder: pengelola berkas.', 'Dock: peluncur aplikasi.', 'Bilah menu: perintah aplikasi yang aktif.', 'Kernel dan driver.'],
            'macOS dirancang untuk komputer buatan Apple dan berbasis Unix.', 'Seluruh hardware Mac.', 'Komponen'],
        Linux: ['Software: sistem operasi', 'Sistem operasi open source yang dipakai di server, superkomputer, dan banyak perangkat lain.',
            'Mengelola hardware dan menjalankan aplikasi, dengan kode sumber yang terbuka untuk dipelajari dan diubah.',
            ['Kernel Linux dimuat saat komputer menyala.', 'Kernel mengelola memori, proses, dan perangkat.', 'Lingkungan desktop (atau terminal) tampil untuk pengguna.', 'Aplikasi berjalan di atas kernel.'],
            ['Kernel Linux: inti sistem.', 'Distribusi: paket kernel, aplikasi, dan desktop, misalnya Ubuntu, Debian, Fedora.', 'Lingkungan desktop: tampilan yang bervariasi.', 'Terminal: antarmuka perintah teks (CLI).'],
            'Kernel Linux dibuat Linus Torvalds pada 1991 dan juga menjadi dasar Android. Mayoritas superkomputer di daftar TOP500 memakai Linux atau turunannya.', 'Seluruh hardware, dari server hingga papan kecil seperti Raspberry Pi.', 'Komponen'],
        Android: ['Software: sistem operasi', 'Sistem operasi untuk smartphone dan tablet, dioperasikan lewat sentuhan.',
            'Mengatur hardware ponsel dan menjalankan aplikasi dengan antarmuka sentuh.',
            ['Sistem dimuat dari penyimpanan ponsel saat dinyalakan.', 'Layar utama menampilkan ikon aplikasi.', 'Sentuhan pada layar dikirim sebagai input ke sistem.', 'Sistem menjalankan aplikasi dan mengatur sensor, kamera, dan jaringan.'],
            ['Kernel Linux.', 'Layanan sistem dan antarmuka sentuh.', 'Aplikasi bawaan dan toko aplikasi.'],
            'Android dikembangkan Google dan berbasis kernel Linux.', 'Layar sentuh, kamera, sensor, baterai, dan jaringan seluler.', 'Komponen'],
        'Pengolah dokumen': ['Software: aplikasi', 'Aplikasi untuk membuat, menyunting, dan menyimpan dokumen.',
            'Membuat dokumen: mengetik, memformat, dan menyimpannya.',
            ['Keyboard memberi input teks.', 'Aplikasi menyimpan isi dokumen di RAM selama kamu mengetik.', 'Aplikasi menggambar tampilan di layar.', 'Saat Save, aplikasi meminta sistem operasi menulis berkas ke SSD atau HDD.'],
            ['Area ketik.', 'Toolbar format: tebal, miring, rata teks.', 'Menu File: New, Open, Save, Print.', 'Pemeriksa ejaan.'],
            'Contoh: Microsoft Word, LibreOffice Writer, Google Docs. Dokumen yang belum disimpan hanya ada di RAM dan hilang bila listrik padam.', 'Keyboard (input), processor dan RAM (proses), monitor (output), SSD atau HDD (penyimpanan).', 'Bagian aplikasi'],
        Browser: ['Software: aplikasi', 'Aplikasi untuk meminta dan menampilkan halaman web.',
            'Membuka halaman web dan menjalankan aplikasi web.',
            ['Kamu mengetik alamat (URL) atau mengklik tautan.', 'Browser mengirim permintaan ke server lewat internet.', 'Server membalas dengan berkas halaman (HTML, CSS, JavaScript, gambar).', 'Browser menyusun dan menampilkan halaman itu.'],
            ['Bilah alamat.', 'Tab.', 'Mesin render: menyusun tampilan halaman.', 'Riwayat, unduhan, dan pengaturan.'],
            'Contoh: Chrome, Firefox, Edge, Safari. Alamat berawalan https mengenkripsi data yang dikirim.', 'Jaringan (Wi-Fi atau kabel), processor, RAM, dan monitor.', 'Bagian aplikasi'],
        'Pemutar media': ['Software: aplikasi', 'Aplikasi untuk memutar audio dan video.',
            'Memutar berkas suara dan video.',
            ['Berkas dibaca dari penyimpanan atau internet.', 'Berkas yang dikompresi didekode oleh codec.', 'Gambar dikirim ke layar dan suara ke speaker.', 'Bilah progres menunjukkan posisi putar.'],
            ['Tombol putar dan jeda.', 'Bilah progres.', 'Pengatur volume.', 'Codec: pengkode dan pendekode media.'],
            'Contoh: VLC, Windows Media Player. Format umum: MP3 untuk audio dan MP4 untuk video. Kompresi memperkecil ukuran berkas.', 'Speaker, monitor, GPU, dan penyimpanan.', 'Bagian aplikasi'],
        Game: ['Software: aplikasi', 'Aplikasi hiburan yang bereaksi terhadap masukan pemain.',
            'Menghibur: menerima kendali pemain lalu menampilkan hasilnya seketika.',
            ['Membaca input (tombol, mouse, sentuhan).', 'Memperbarui keadaan permainan: posisi, skor, tabrakan.', 'Menggambar ulang tampilan ke layar.', 'Mengulang puluhan kali per detik (frame per second).'],
            ['Logika permainan.', 'Grafis.', 'Suara.', 'Pembaca input.'],
            'Game berat memakai GPU dan banyak RAM. Ketiga langkah di atas sama dengan input, proses, output.', 'Keyboard, mouse atau layar sentuh, CPU, GPU, RAM, monitor, speaker.', 'Bagian game']
    };

    function render() {
        var n = t.textContent.trim(), x = I[n]; box.innerHTML = ''; if (!x) return;
        var sw = x[0].indexOf('Software') === 0; cap.textContent = x[1] + (sw ? SWNOTE : '');
        var q = el('details', 'dd'), dl = el('dl', 'xi-dl'); q.open = true;
        q.appendChild(el('summary', '', 'Penjelasan lengkap'));
        function row(l, v, ord) {
            if (!v) return; var a = el('dt', '', l), b = el('dd');
            if (Array.isArray(v)) { var u = el(ord ? 'ol' : 'ul'); v.forEach(function (s) { u.appendChild(el('li', '', s)); }); b.appendChild(u); } else b.textContent = v;
            dl.appendChild(a); dl.appendChild(b);
        }
        row('Fungsi', x[2]); row('Cara kerja', x[3], 1); row(x[7] || 'Bagian utama', x[4]); if (sw) row('Memakai hardware', x[6]); row('Tahukah kamu', x[5]);
        q.appendChild(dl); box.appendChild(el('span', 'xi-k', x[0])); box.appendChild(q);
    }
    new MutationObserver(render).observe(t, { childList: true, characterData: true, subtree: true });
})();