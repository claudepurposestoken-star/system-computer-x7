/* data.js: isi materi (Sistem Komputer, hlm. 65-69; disesuaikan dengan materi terbaru) */
window.DATA = {
    unsur: [
        {
            nama: 'Hardware', ringkas: 'Komponen fisik komputer yang dapat dilihat, disentuh, atau dipindahkan.', contoh: ['Mouse', 'Keyboard', 'Monitor', 'Hard disk', 'Processor', 'RAM', 'Printer', 'Scanner'],
            detail: [
                { judul: 'Bagian fisik komputer', teks: 'Komponen fisik pada komputer yang dapat disentuh, dilihat, atau dipindahkan. Dengan kata lain, hardware adalah bagian komputer yang memiliki bentuk fisik.' },
                { judul: 'Contoh', teks: 'Mouse, keyboard, monitor, hard disk, processor, RAM, printer, dan scanner. Klik tiap contoh pada kartu untuk melihat model, cara kerja, dan bagian-bagiannya.' },
                { judul: 'Fungsi yang berbeda-beda', teks: 'Mouse dipakai untuk memberikan input. Processor melakukan pemrosesan. RAM menjadi tempat penyimpanan data sementara ketika komputer bekerja. Printer menghasilkan keluaran berupa cetakan. Scanner memasukkan informasi dari dokumen atau objek ke komputer.' },
                { judul: 'Butuh software', teks: 'Hardware saja tidak cukup agar komputer dapat dipakai sebagaimana mestinya. Ia membutuhkan software yang memberi instruksi dan fungsi.' },
                { judul: 'Empat kelompok hardware', teks: 'Menurut fungsinya: input (mouse, keyboard, scanner), proses (processor), output (monitor, printer), dan penyimpanan (hard disk, SSD). RAM adalah memori kerja yang bekerja bersama processor.' },
                { judul: 'Komponen bekerja sama', teks: 'Saat kamu mengklik mouse: mouse (input) mengirim data, processor memprosesnya dengan bantuan RAM, hasilnya tampil di monitor (output), dan berkas yang disimpan masuk ke hard disk atau SSD. Tidak ada komponen yang bekerja sendirian.' },
                { judul: 'Cara hardware tersambung', teks: 'Komponen di dalam casing dipasang pada motherboard. Perangkat luar tersambung lewat port seperti USB atau HDMI, atau lewat Bluetooth, dan butuh driver agar dikenali sistem operasi.' },
                { judul: 'Merawat hardware', teks: 'Jangan mengguncang hard disk yang sedang bekerja, jaga ventilasi agar processor tidak terlalu panas, dan jangan membuka power supply sembarangan karena kapasitor di dalamnya dapat menyimpan muatan berbahaya.' }
            ]
        },
        {
            nama: 'Software', ringkas: 'Perangkat yang tidak terlihat secara fisik dan menjembatani pengguna dengan hardware.', contoh: ['Windows', 'macOS', 'Linux', 'Android', 'Pengolah dokumen', 'Browser', 'Pemutar media', 'Game'],
            detail: [
                { judul: 'Tanpa bentuk fisik', teks: 'Perangkat yang tidak terlihat secara fisik, tetapi dapat dioperasikan pengguna melalui antarmuka yang disediakan. Software menjembatani pengguna dengan perangkat keras.' },
                { judul: 'Kode program', teks: 'Software berupa kode-kode program yang dibuat dengan bahasa pemrograman. Kode itu adalah kumpulan perintah untuk menjalankan tugas tertentu sesuai keinginan pengguna atau untuk mengendalikan kerja perangkat keras.' },
                { judul: 'Sistem operasi', teks: 'Microsoft Windows, macOS, Linux, dan Android.' },
                { judul: 'Aplikasi', teks: 'Perangkat lunak yang dipakai pengguna untuk melakukan fungsi tertentu, misalnya pengolah dokumen, browser, pemutar media, dan game.' },
                { judul: 'Hardware dan software', teks: 'Hardware adalah komponen fisik, software adalah program atau instruksi. Software memberi instruksi dan fungsi yang membuat perangkat keras bisa dipakai untuk berbagai pekerjaan.' },
                { judul: 'Sistem operasi dan aplikasi: apa bedanya?', teks: 'Sistem operasi mengelola hardware dan menjadi landasan bagi program lain. Aplikasi berjalan di atas sistem operasi untuk tugas tertentu. Tanpa sistem operasi, aplikasi tidak punya jalan untuk memakai hardware. Klik contoh pada kartu untuk melihat cara kerja masing-masing.' },
                { judul: 'Dari kode sampai berjalan', teks: 'Programmer menulis kode dengan bahasa pemrograman. Kode itu diterjemahkan menjadi instruksi yang dapat dijalankan processor. Saat aplikasi dibuka, instruksinya dimuat dari penyimpanan ke RAM, lalu dikerjakan processor.' },
                { judul: 'Perjalanan satu klik Save', teks: 'Kamu menekan Save di pengolah dokumen. Aplikasi meminta sistem operasi menyimpan berkas, sistem operasi memakai driver dan sistem berkas, lalu data ditulis ke SSD atau hard disk. Satu klik melewati beberapa lapisan software sebelum sampai ke hardware.' },
                { judul: 'Software perlu diperbarui', teks: 'Pembaruan (update) memperbaiki kesalahan (bug), menambah fitur, dan menutup celah keamanan. Software yang lama tidak diperbarui lebih mudah diserang.' }
            ]
        },
        {
            nama: 'Pengguna', ringkas: 'Pihak yang menggunakan atau mengoperasikan komputer untuk menyelesaikan suatu pekerjaan. Sering juga disebut brainware.', contoh: ['Memberi perintah', 'Memakai aplikasi', 'Memberi input'],
            detail: [
                { judul: 'Pelaku yang mengoperasikan komputer', teks: 'Pengguna (user) adalah pihak yang menggunakan atau mengoperasikan komputer. Pengguna memberikan perintah atau melakukan tindakan lewat perangkat dan software yang tersedia.' },
                { judul: 'Contoh: membuat dokumen', teks: 'Pengguna memakai aplikasi, memberikan input, komputer memproses, lalu menghasilkan output.' },
                { judul: 'Bagian penting sistem', teks: 'Komputer dipakai untuk membantu manusia melakukan berbagai pekerjaan, jadi pengguna adalah bagian penting dari sistem komputer.' },
                { judul: 'Jenis pengguna', teks: 'Pengguna akhir (end user) memakai aplikasi untuk keperluannya. Programmer membuat software. Administrator mengelola sistem dan jaringan. Satu orang bisa berperan lebih dari satu.' },
                { judul: 'Pengguna yang bijak', teks: 'Pengguna bertanggung jawab menyimpan data, menjaga kata sandi, dan memakai software secara sah. Komputer secanggih apa pun tetap bergantung pada keputusan penggunanya.' },
                { judul: 'Brainware', teks: 'Dalam istilah sistem komputer, pengguna disebut brainware: unsur manusia yang berpikir, mengambil keputusan, dan mengoperasikan komputer. Hardware dan software tidak berguna tanpa brainware yang memakainya.' }
            ]
        }
    ],
    lab: [
        { t: 'Mouse', z: 0 }, { t: 'Windows', z: 1 }, { t: 'Penulis dokumen', z: 2 }, { t: 'RAM', z: 0 },
        { t: 'Browser', z: 1 }, { t: 'Operator komputer', z: 2 }, { t: 'Hard disk', z: 0 }, { t: 'Linux', z: 1 },
        { t: 'Pengguna akhir (end user)', z: 2 }, { t: 'Printer', z: 0 }, { t: 'Pengolah dokumen', z: 1 }, { t: 'Processor', z: 0 }
    ],
    /* bank soal Lab: tiap ronde mengambil acak 4 dari tiap kelompok (z: 0 Hardware, 1 Software, 2 Pengguna) */
    labBank: [
        { t: 'Mouse', z: 0 }, { t: 'Keyboard', z: 0 }, { t: 'Monitor', z: 0 }, { t: 'RAM', z: 0 }, { t: 'Hard disk', z: 0 }, { t: 'Processor', z: 0 },
        { t: 'Printer', z: 0 }, { t: 'Scanner', z: 0 }, { t: 'Flashdisk', z: 0 }, { t: 'Speaker', z: 0 }, { t: 'Webcam', z: 0 }, { t: 'Motherboard', z: 0 },
        { t: 'SSD', z: 0 }, { t: 'Proyektor', z: 0 }, { t: 'Headset', z: 0 }, { t: 'Kartu grafis', z: 0 },
        { t: 'Windows', z: 1 }, { t: 'Linux', z: 1 }, { t: 'macOS', z: 1 }, { t: 'Android', z: 1 }, { t: 'Browser', z: 1 }, { t: 'Pengolah dokumen', z: 1 },
        { t: 'Pemutar media', z: 1 }, { t: 'Game', z: 1 }, { t: 'Antivirus', z: 1 }, { t: 'Aplikasi presentasi', z: 1 }, { t: 'Lembar kerja', z: 1 }, { t: 'Editor foto', z: 1 },
        { t: 'Penulis dokumen', z: 2 }, { t: 'Operator komputer', z: 2 }, { t: 'Pengguna akhir (end user)', z: 2 },
        { t: 'Programmer', z: 2 }, { t: 'Administrator jaringan', z: 2 },
        { t: 'Desainer grafis', z: 2 }, { t: 'Siswa', z: 2 }, { t: 'Guru', z: 2 }, { t: 'Editor video', z: 2 }, { t: 'Kasir', z: 2 }, { t: 'Analis data', z: 2 }, { t: 'Akuntan', z: 2 }, { t: 'Gamer', z: 2 }
    ],
    alur: [
        { judul: 'Input', desc: 'Data masuk dari perangkat masukan, berupa gambar, teks, suara, video, klik, sentuhan, atau data lain. Contoh: menekan tombol keyboard.' },
        { judul: 'Proses', desc: 'Data diproses oleh Central Processing Unit (CPU). Contoh: ketikan diproses oleh komputer. Data yang perlu disimpan permanen dikirim ke penyimpanan (SSD/HDD); lihat Pendalaman: IPOS.' },
        { judul: 'Output', desc: 'Hasil pemrosesan diberikan kepada pengguna lewat perangkat keluaran. Contoh: tulisan ditampilkan di monitor.' }
    ],
    jenis: [
        { nama: 'Microcomputer', ringkas: 'Komputer berukuran paling kecil dibanding jenis lain, memakai microprocessor sebagai CPU.', ciri: ['Ukuran paling kecil dibanding jenis komputer lain', 'Memakai microprocessor sebagai CPU', 'Harga relatif lebih murah', 'Banyak dipakai dalam kehidupan sehari-hari', 'Ultrabook adalah laptop tipis dan ringan; buku memakainya sebagai contoh microcomputer, sedangkan laptop dibahas sebagai bentuk PC', 'Catatan: secara teknis Arduino adalah papan mikrokontroler untuk proyek elektronik, bukan komputer serba guna seperti PC atau Raspberry Pi', 'Catatan: secara teknis PC dan laptop juga memakai microprocessor. Pembagian di buku adalah klasifikasi untuk pembelajaran'], lb: 'Contoh', contoh: ['Ultrabook', 'Konsol permainan', 'Telepon pintar', 'Tablet', 'Raspberry Pi', 'Arduino'] },
        { nama: 'PC', ringkas: 'Personal Computer: komputer yang dibuat untuk penggunaan personal.', ciri: ['Lebih besar daripada komputer mikro', 'Kemampuan penyimpanan dan pengolahan data lebih besar daripada komputer mikro', 'Desktop PC: diletakkan di meja, perangkatnya terpisah', 'Laptop: dapat dijinjing dan dibawa-bawa'], lb: 'Bentuk', contoh: ['Desktop PC', 'Laptop'] },
        { nama: 'Mini PC', ringkas: 'Komputer peralihan dari komputer personal ke komputer mini yang dipakai di industri.', ciri: ['Bentuk lebih kecil daripada PC pada umumnya', 'Tetap dapat dipakai untuk kebutuhan komputasi', 'Catatan: di dunia teknologi, mini PC umumnya berarti PC berukuran kecil. Definisi peralihan adalah klasifikasi buku'], lb: 'Dipakai untuk', contoh: ['Kebutuhan profesional personal', 'Industri kecil'] },
        { nama: 'Minicomputer', ringkas: 'Lebih besar dari PC, dengan kapasitas memori dan pemrosesan yang lebih besar.', ciri: ['Menunjang kebutuhan pengolahan informasi perusahaan skala menengah', 'Makin jarang dipakai; menurut buku karena perusahaan bisa menyewa komputer lewat cloud yang lebih praktis dalam pemeliharaan', 'Pendalaman: secara historis, peran minicomputer juga bergeser oleh PC, microprocessor, workstation, jaringan, dan server'], lb: 'Dipakai di', contoh: ['Perusahaan skala menengah'] },
        { nama: 'Mainframe', ringkas: 'Komputer berukuran besar yang biasanya dipakai perusahaan besar sebagai server.', ciri: ['Ukuran lebih besar dibanding komputer mini', 'Dipakai perusahaan-perusahaan besar', 'Sering berfungsi sebagai server (peladen)'], lb: 'Contoh', contoh: ['IBM z Systems'] },
        { nama: 'Supercomputer', ringkas: 'Komputer dengan kapasitas pengolahan data dan kinerja yang sangat kuat.', ciri: ['Kapasitas pengolahan dan kinerja paling kuat; ukuran fisiknya besar tetapi yang menentukan adalah kemampuan komputasinya', 'Menurut buku mampu melakukan triliunan instruksi per detik. Superkomputer modern sudah mencapai skala exascale (sekitar 10¹⁸ operasi per detik)', 'FLOPS (Floating Point Operations Per Second) mengukur operasi bilangan pecahan per detik, bukan jumlah instruksi'], lb: 'Dipakai oleh', contoh: ['Perusahaan atau organisasi besar', 'NASA (pesawat dan roket)'] }
    ],
    jenisDetail: [
        { nama: 'Microcomputer', inti: 'Komputer paling kecil, memakai microprocessor sebagai CPU.', poin: ['Relatif murah dan banyak dipakai sehari-hari', 'Contoh: ultrabook, konsol permainan, telepon pintar, tablet', 'Ada yang berbentuk papan tunggal (SBC), misalnya Raspberry Pi', 'Ultrabook adalah laptop tipis dan ringan; buku memakainya sebagai contoh microcomputer, sedangkan laptop dibahas sebagai bentuk PC', 'Catatan: secara teknis Arduino adalah papan mikrokontroler untuk proyek elektronik, bukan komputer serba guna seperti PC atau Raspberry Pi'], kunci: 'Kecil, murah, microprocessor' },
        { nama: 'PC', inti: 'Komputer untuk penggunaan personal, lebih besar daripada komputer mikro.', poin: ['Penyimpanan dan pengolahan datanya lebih besar daripada komputer mikro', 'Desktop PC: diletakkan di meja, monitor, keyboard, mouse, dan unit komputer terpisah', 'Laptop: menyatukan komponen dalam satu perangkat yang bisa dijinjing'], kunci: 'Personal: desktop atau laptop' },
        { nama: 'Mini PC', inti: 'Komputer peralihan dari komputer personal ke komputer mini yang dipakai di industri.', poin: ['Bentuknya lebih kecil daripada PC pada umumnya, tetap bisa dipakai untuk komputasi', 'Dipakai personal untuk kebutuhan profesional atau di industri kecil', 'Catatan: di dunia teknologi, mini PC umumnya berarti PC berukuran kecil. Definisi peralihan adalah klasifikasi buku'], kunci: 'Peralihan PC ke komputer mini' },
        { nama: 'Minicomputer', inti: 'Lebih besar daripada PC, dengan memori dan kemampuan pemrosesan lebih besar.', poin: ['Menunjang pengolahan informasi perusahaan skala menengah', 'Menurut buku, makin jarang dipakai karena perusahaan dapat menyewa komputer lewat cloud yang lebih praktis dalam pemeliharaan', 'Pendalaman: secara historis, peran minicomputer juga bergeser oleh PC, microprocessor, workstation, jaringan, dan server'], kunci: 'Skala menengah, makin jarang dipakai' },
        { nama: 'Mainframe', inti: 'Komputer besar yang dipakai perusahaan-perusahaan besar.', poin: ['Biasanya berfungsi sebagai server (peladen)', 'Contoh: IBM z Systems', 'Pendalaman: dirancang untuk operasi terus-menerus dan transaksi dalam jumlah besar, sehingga dipakai di sektor yang menuntut keandalan tinggi seperti perbankan'], kunci: 'Perusahaan besar, server' },
        { nama: 'Supercomputer', inti: 'Kapasitas pengolahan data dan kinerja paling kuat di antara semua jenis.', poin: ['Menurut buku mampu melakukan triliunan instruksi per detik. Superkomputer modern sudah mencapai skala exascale (sekitar 10¹⁸ operasi per detik)', 'FLOPS (Floating Point Operations Per Second) mengukur operasi bilangan pecahan per detik, bukan jumlah instruksi', 'Pendalaman: pada TOP500 edisi Juni 2026, peringkat 1 adalah LineShine (2,198 EFLOPS pada benchmark HPL) dan peringkat 2 El Capitan (1,809 EFLOPS). Daftar diperbarui tiap Juni dan November', 'Dipakai organisasi besar, misalnya NASA untuk pesawat dan roket'], kunci: 'Kinerja tertinggi, FLOPS' }
    ],
    jenisBeda: [
        { judul: 'Mini PC atau Minicomputer?', teks: 'Mini PC adalah peralihan dari PC ke komputer mini industri dan bentuknya kecil. Minicomputer justru lebih besar daripada PC, dipakai perusahaan skala menengah. Namanya mirip, ukuran dan fungsinya berbeda.' },
        { judul: 'Raspberry Pi atau Arduino?', teks: 'Raspberry Pi adalah komputer SBC yang dapat menjalankan program. Arduino adalah platform elektronik untuk proyek interaktif; papannya memakai mikrokontroler sebagai pusat kendali, jadi secara teknis bukan komputer serba guna seperti PC atau Raspberry Pi. Keduanya berukuran kecil, tetapi jangan disamakan.' },
        { judul: 'Mainframe atau Supercomputer?', teks: 'Mainframe dipakai perusahaan besar, biasanya sebagai server, dan kuat menangani banyak transaksi secara andal dan terus-menerus. Supercomputer dirancang untuk komputasi ilmiah yang sangat berat, kinerjanya diukur dalam FLOPS, misalnya dipakai NASA. Lebih besar atau lebih kuat saja tidak cukup untuk membedakan keduanya.' }
    ],
    banding: {
        judul: 'Raspberry Pi dan Arduino',
        a: 'Raspberry Pi', b: 'Arduino',
        baris: [
            ['Jenis', 'Single Board Computer (SBC) berukuran sekitar kartu kredit', 'Platform elektronik open-source berbasis hardware dan software yang mudah digunakan'],
            ['Intinya', 'Komputer dalam bentuk satu papan', 'Platform elektronik untuk proyek interaktif; papannya memakai mikrokontroler sebagai pusat kendali'],
            ['Bisa dipakai untuk', 'Program perkantoran, permainan komputer, pemutar media, memutar video beresolusi tinggi', 'Membaca input, memprosesnya, lalu menghasilkan output, misalnya sensor untuk menyalakan LED atau mengaktifkan motor'],
            ['Bidang', 'Bisa dipakai seperti komputer desktop dengan monitor, keyboard, dan mouse', 'IoT, perangkat yang dapat dikenakan (wearable), pencetakan 3D, embedded system']
        ],
        gadget: 'Gadget adalah perangkat elektronik kecil dengan fungsi khusus. Beberapa gadget termasuk komputer karena punya hardware, sistem operasi, dan software, misalnya smartphone dan tablet. Smartphone awalnya berkaitan dengan komunikasi, sekarang dapat menjalankan berbagai fungsi komputasi.'
    },
    lapisan: {
        intro: 'Sistem komputasi terdiri atas hardware dan software yang saling berinteraksi. Agar bisa dipakai dan dikendalikan, dibutuhkan antarmuka (interface) yang menghubungkan perangkat masukan, perangkat keluaran, sistem operasi, aplikasi, dan pengguna.',
        item: [
            { nama: 'Pengguna', teks: 'Memberi perintah lewat software. Pengguna tidak mengendalikan seluruh hardware secara langsung.' },
            { nama: 'Aplikasi', teks: 'Perangkat lunak yang dipakai pengguna untuk fungsi tertentu. Pengguna berinteraksi dengannya.' },
            { nama: 'Sistem operasi dan kernel', teks: 'Bagian penting yang mengatur hubungan antara software dan hardware. Di bagian inti terdapat Kernel OS.', kernel: ['Sistem berkas (file system)', 'Driver', 'Layanan sistem', 'Pengelolaan memori'] },
            { nama: 'Hardware', teks: 'Komponen fisik yang akhirnya mengerjakan perintah, lalu hasilnya naik kembali ke layar pengguna.' }
        ]
    },
    gui: {
        intro: 'GUI (Graphical User Interface) adalah antarmuka yang memakai menu dan elemen grafis, jadi pengguna tidak harus selalu memberi perintah berupa teks. Coba klik elemen di jendela atau pilih namanya. Pembandingnya adalah CLI (Command Line Interface), antarmuka berbasis perintah teks; cobalah di Pendalaman, bagian GUI dan CLI.',
        items: [
            { id: 'ikon', nama: 'Ikon', teks: 'Simbol atau gambar grafis yang mewakili fungsi atau objek tertentu, misalnya ikon aplikasi di smartphone. Pilih ikon untuk membuka aplikasi atau menjalankan fungsinya.' },
            { id: 'menu', nama: 'Menu', teks: 'Kumpulan pilihan atau perintah yang bisa dipakai pengguna, misalnya File lalu New, Open, Save. Menu membantu pengguna menemukan perintah.' },
            { id: 'dialog', nama: 'Dialog', teks: 'Elemen yang menampilkan informasi atau meminta pengguna memberi pilihan atau input, misalnya kotak yang meminta konfirmasi.' },
            { id: 'button', nama: 'Button', teks: 'Tombol yang dipilih untuk menjalankan perintah, misalnya Save, Cancel, atau OK.' },
            { id: 'textbox', nama: 'Text box', teks: 'Elemen untuk memasukkan teks. Pengguna mengetik informasi ke dalam kotak ini, misalnya nama.' },
            { id: 'radio', nama: 'Radio button', teks: 'Dipakai saat pengguna harus memilih satu pilihan. Dalam satu kelompok, pengguna memilih salah satu opsi.' },
            { id: 'checkbox', nama: 'Checkbox', teks: 'Dipakai saat pengguna boleh memilih lebih dari satu pilihan. Beberapa kotak bisa dicentang sekaligus.' }
        ]
    },
    ringkas: [
        ['Sistem komputer', 'Hardware + Software + Pengguna'],
        ['Cara kerja komputer', 'Input, proses, output'],
        ['Hardware', 'Komponen komputer yang dapat dilihat, disentuh, atau dipindahkan'],
        ['Software', 'Kode atau program berisi perintah untuk menjalankan tugas tertentu atau mengendalikan hardware'],
        ['Pengguna', 'Pihak yang menggunakan atau mengoperasikan komputer'],
        ['Jenis komputer', 'Microcomputer, PC, Mini PC, Minicomputer, Mainframe, Supercomputer'],
        ['Microcomputer', 'Komputer berukuran kecil yang memakai microprocessor sebagai CPU'],
        ['Raspberry Pi', 'Contoh SBC (Single Board Computer)'],
        ['Arduino', 'Platform elektronik open-source untuk proyek interaktif; secara teknis papan mikrokontroler, bukan PC'],
        ['PC', 'Komputer untuk penggunaan personal, berbentuk desktop atau laptop'],
        ['Mini PC', 'Peralihan dari PC ke komputer mini menurut klasifikasi buku'],
        ['Minicomputer', 'Lebih besar dengan memori dan pemrosesan lebih besar, antara lain untuk perusahaan skala menengah'],
        ['Mainframe', 'Komputer besar yang biasanya dipakai perusahaan besar, salah satunya sebagai server'],
        ['Supercomputer', 'Kapasitas pengolahan dan kinerja sangat tinggi'],
        ['FLOPS', 'Floating Point Operations Per Second: operasi bilangan pecahan per detik, bukan instruksi per detik'],
        ['Interaksi manusia dan komputer', 'Hubungan pengguna dengan sistem komputer lewat antarmuka'],
        ['GUI', 'Graphical User Interface: antarmuka dengan menu atau elemen grafis'],
        ['Elemen GUI', 'Ikon, menu, dialog, button, text box, radio button, checkbox'],
        ['Radio button dan checkbox', 'Radio button: satu pilihan. Checkbox: banyak pilihan'],
        ['IPOS', 'Input, Process, Output, Storage (pendalaman)'],
        ['Brainware', 'Istilah lain untuk pengguna sebagai unsur sistem komputer'],
        ['RAM dan SSD/HDD', 'RAM volatile (data hilang saat listrik padam). SSD/HDD non-volatile'],
        ['Kernel', 'Inti sistem operasi yang bekerja dekat dengan hardware'],
        ['CLI', 'Command Line Interface: antarmuka berbasis perintah teks'],
        ['Bit dan byte', 'Bit bernilai 0 atau 1. 1 byte = 8 bit']
    ],
    kuisBank: [
        /* hardware, software, pengguna */
        { q: 'Bagian fisik komputer yang dapat dilihat, disentuh, dan dipindahkan disebut…', o: ['Software', 'Hardware', 'Pengguna'], a: 1, e: 'Hardware adalah komponen fisik komputer.' },
        { q: 'Perangkat yang tidak terlihat secara fisik dan menjembatani pengguna dengan hardware adalah…', o: ['Hardware', 'Software', 'Scanner'], a: 1, e: 'Software berupa kode program berisi perintah untuk komputer.' },
        { q: 'Tiga unsur sistem komputer adalah…', o: ['Hardware, software, pengguna', 'Input, proses, output', 'CPU, RAM, hard disk', 'Mouse, keyboard, monitor'], a: 0, e: 'Sistem komputer bekerja karena hardware, software, dan pengguna.' },
        { q: 'Mouse termasuk unsur…', o: ['Software', 'Hardware', 'Pengguna'], a: 1, e: 'Mouse adalah komponen fisik yang dipakai untuk memberi input.' },
        { q: 'Yang termasuk software adalah…', o: ['Browser', 'Printer', 'Scanner', 'Processor'], a: 0, e: 'Browser adalah aplikasi, jadi termasuk software.' },
        { q: 'Yang termasuk hardware adalah…', o: ['Windows', 'Linux', 'Hard disk', 'Pengolah dokumen'], a: 2, e: 'Hard disk adalah komponen fisik penyimpan data.' },
        { q: 'Windows, macOS, Linux, dan Android adalah contoh…', o: ['Sistem operasi', 'Perangkat keluaran', 'Hardware', 'Pengguna'], a: 0, e: 'Keempatnya adalah sistem operasi.' },
        { q: 'Pengolah dokumen, browser, pemutar media, dan game termasuk…', o: ['Sistem operasi', 'Aplikasi', 'Hardware'], a: 1, e: 'Aplikasi adalah perangkat lunak yang dipakai pengguna untuk fungsi tertentu.' },
        { q: 'Software dibuat dengan menulis kode memakai…', o: ['Bahasa pemrograman', 'Kabel data', 'Papan sirkuit', 'Printer'], a: 0, e: 'Software berupa kode-kode program yang dibuat dengan bahasa pemrograman.' },
        { q: 'Pihak yang menggunakan atau mengoperasikan komputer disebut…', o: ['Pengguna', 'Hardware', 'Software', 'Kernel'], a: 0, e: 'Pengguna (user) memberi perintah lewat perangkat dan software.' },
        { q: 'Fungsi RAM saat komputer bekerja adalah…', o: ['Menyimpan data sementara', 'Mencetak dokumen', 'Memindai gambar', 'Menampilkan gambar'], a: 0, e: 'RAM menjadi tempat penyimpanan data sementara ketika komputer bekerja.' },
        { q: 'Perangkat yang menghasilkan keluaran berupa cetakan adalah…', o: ['Scanner', 'Printer', 'Mouse', 'RAM'], a: 1, e: 'Printer menghasilkan keluaran cetakan.' },
        { q: 'Scanner berfungsi untuk…', o: ['Memasukkan informasi dari dokumen atau objek ke komputer', 'Mencetak dokumen', 'Menyimpan data sementara', 'Mengatur sistem operasi'], a: 0, e: 'Scanner memasukkan informasi dari dokumen atau objek ke komputer.' },
        { q: 'Komponen yang melakukan pemrosesan data adalah…', o: ['Processor', 'Printer', 'Speaker', 'Flashdisk'], a: 0, e: 'Processor (CPU) memproses data.' },
        { q: 'Mengapa hardware saja tidak cukup untuk memakai komputer?', o: ['Karena butuh software yang memberi instruksi dan fungsi', 'Karena hardware tidak bisa disentuh', 'Karena hardware tidak punya bentuk', 'Karena harus selalu ada printer'], a: 0, e: 'Software memberi instruksi dan fungsi agar hardware bisa dipakai.' },
        { q: 'Komputer dipakai untuk membantu manusia, sehingga bagian penting sistem yang berperan sebagai pelaku adalah…', o: ['Pengguna', 'Monitor', 'Kabel', 'Kernel'], a: 0, e: 'Pengguna adalah bagian penting dari sistem komputer.' },
        /* alur input, proses, output */
        { q: 'Urutan cara kerja komputer adalah…', o: ['Input, proses, output', 'Output, input, proses', 'Proses, output, input'], a: 0, e: 'Data masuk lewat input, diproses CPU, lalu keluar sebagai output.' },
        { q: 'Menekan tombol keyboard termasuk tahap…', o: ['Input', 'Proses', 'Output'], a: 0, e: 'Data masuk dari perangkat masukan seperti keyboard.' },
        { q: 'Tulisan yang tampil di monitor termasuk tahap…', o: ['Input', 'Proses', 'Output'], a: 2, e: 'Hasil pemrosesan diberikan lewat perangkat keluaran.' },
        { q: 'Data diproses oleh…', o: ['Central Processing Unit (CPU)', 'Monitor', 'Mouse', 'Speaker'], a: 0, e: 'CPU memproses data pada tahap proses.' },
        { q: 'Contoh perangkat keluaran adalah…', o: ['Monitor', 'Keyboard', 'Mouse', 'Scanner'], a: 0, e: 'Monitor menampilkan hasil pemrosesan.' },
        { q: 'Contoh perangkat masukan adalah…', o: ['Speaker', 'Keyboard', 'Monitor', 'Proyektor'], a: 1, e: 'Keyboard memasukkan data ke komputer.' },
        /* jenis komputer */
        { q: 'Komputer berukuran paling kecil yang memakai microprocessor sebagai CPU adalah…', o: ['Microcomputer', 'Mainframe', 'Minicomputer', 'Supercomputer'], a: 0, e: 'Microcomputer adalah jenis paling kecil dan memakai microprocessor.' },
        { q: 'Yang termasuk microcomputer adalah…', o: ['Tablet', 'Mainframe', 'Supercomputer', 'Minicomputer'], a: 0, e: 'Contoh microcomputer: ultrabook, konsol permainan, telepon pintar, tablet. Ultrabook adalah laptop tipis dan ringan.' },
        { q: 'Kepanjangan PC adalah…', o: ['Personal Computer', 'Portable Chip', 'Primary Core', 'Program Center'], a: 0, e: 'PC adalah komputer yang dibuat untuk penggunaan personal.' },
        { q: 'Desktop PC dan laptop termasuk jenis…', o: ['PC', 'Mainframe', 'Supercomputer', 'Minicomputer'], a: 0, e: 'Keduanya bentuk dari komputer personal.' },
        { q: 'Komputer personal yang dapat dijinjing dan dibawa-bawa adalah…', o: ['Laptop', 'Desktop PC', 'Mainframe'], a: 0, e: 'Laptop menyatukan komponen dalam satu perangkat yang bisa dibawa.' },
        { q: 'Komputer peralihan dari PC ke komputer mini yang dipakai di industri adalah…', o: ['Mini PC', 'Mainframe', 'Supercomputer'], a: 0, e: 'Mini PC berbentuk lebih kecil dari PC pada umumnya.' },
        { q: 'Komputer yang lebih besar daripada PC dan menunjang perusahaan skala menengah adalah…', o: ['Minicomputer', 'Microcomputer', 'Mini PC', 'Supercomputer'], a: 0, e: 'Minicomputer punya memori dan pemrosesan lebih besar daripada PC.' },
        { q: 'Menurut buku, mengapa minicomputer makin jarang dipakai?', o: ['Perusahaan bisa menyewa komputer lewat cloud yang lebih praktis dalam pemeliharaan', 'Karena ukurannya terlalu kecil', 'Karena tidak punya CPU', 'Karena hanya bisa dipakai NASA'], a: 0, e: 'Menurut buku, cloud lebih praktis dalam pemeliharaan. Secara historis, PC, workstation, dan server juga berperan.' },
        { q: 'Komputer besar yang biasanya dipakai perusahaan besar sebagai server adalah…', o: ['Mini PC', 'Mainframe', 'Microcomputer'], a: 1, e: 'Mainframe dipakai perusahaan besar, salah satunya sebagai server.' },
        { q: 'Contoh mainframe adalah…', o: ['IBM z Systems', 'Arduino', 'Tablet', 'Laptop'], a: 0, e: 'IBM z Systems adalah contoh mainframe.' },
        { q: 'Kemampuan supercomputer dinyatakan dalam satuan…', o: ['FLOPS', 'Pixel', 'Watt'], a: 0, e: 'FLOPS adalah Floating Point Operations Per Second.' },
        { q: 'Kepanjangan FLOPS adalah…', o: ['Floating Point Operations Per Second', 'Fast Logic Operation System', 'File Loading Process Speed', 'Fixed Line Output Power Signal'], a: 0, e: 'FLOPS mengukur jumlah operasi bilangan pecahan per detik.' },
        { q: 'Menurut buku, komputer yang mampu melakukan triliunan instruksi per detik adalah…', o: ['Supercomputer', 'Mini PC', 'Laptop', 'Microcomputer'], a: 0, e: 'Supercomputer punya kinerja paling kuat. Secara teknis kemampuannya diukur dalam FLOPS (operasi floating-point per detik), dan superkomputer modern sudah mencapai skala exascale.' },
        { q: 'Organisasi yang memakai supercomputer untuk pesawat dan roket adalah…', o: ['NASA', 'Warung internet', 'Toko kelontong'], a: 0, e: 'Contoh pemakaian supercomputer: NASA.' },
        { q: 'Jenis komputer dengan kapasitas pengolahan data dan kinerja paling kuat adalah…', o: ['Supercomputer', 'Microcomputer', 'PC', 'Mini PC'], a: 0, e: 'Supercomputer punya kinerja paling kuat di antara jenis yang dibahas.' },
        /* Raspberry Pi, Arduino, gadget */
        { q: 'Single Board Computer berukuran sekitar kartu kredit yang dikembangkan Raspberry Pi Foundation adalah…', o: ['Raspberry Pi', 'Arduino', 'Mainframe'], a: 0, e: 'Raspberry Pi adalah komputer SBC, sedangkan Arduino adalah platform elektronik.' },
        { q: 'Platform elektronik open-source untuk proyek interaktif adalah…', o: ['Arduino', 'Mainframe', 'Laptop', 'Windows'], a: 0, e: 'Arduino berbasis hardware dan software yang mudah digunakan.' },
        { q: 'Arduino sangat berkaitan dengan…', o: ['Mikrokontroler', 'Mainframe', 'Printer', 'Cloud'], a: 0, e: 'Papan Arduino memakai mikrokontroler sebagai pusat kendali, jadi secara teknis bukan PC atau Raspberry Pi.' },
        { q: 'Kepanjangan SBC pada Raspberry Pi adalah…', o: ['Single Board Computer', 'Super Big Computer', 'System Basic Code', 'Simple Backup Chip'], a: 0, e: 'Raspberry Pi adalah komputer dalam bentuk satu papan.' },
        { q: 'Bidang yang memakai Arduino antara lain…', o: ['IoT dan embedded system', 'Hanya penyimpanan awan', 'Hanya mencetak dokumen', 'Hanya jaringan kabel'], a: 0, e: 'Arduino dipakai pada IoT, wearable, pencetakan 3D, dan embedded system.' },
        { q: 'Gadget disebut komputer jika memiliki…', o: ['Hardware, sistem operasi, dan software', 'Hanya layar', 'Hanya baterai', 'Hanya kamera'], a: 0, e: 'Smartphone dan tablet termasuk komputer karena punya ketiganya.' },
        { q: 'Gadget adalah…', o: ['Perangkat elektronik kecil dengan fungsi khusus', 'Perusahaan pembuat komputer', 'Bahasa pemrograman', 'Jenis kabel'], a: 0, e: 'Contoh gadget: smartphone dan tablet.' },
        /* interaksi manusia dan komputer */
        { q: 'Pengguna memberi perintah ke komputer lewat…', o: ['Software', 'Hardware secara langsung seluruhnya', 'Kabel listrik', 'Cloud saja'], a: 0, e: 'Pengguna tidak mengendalikan seluruh hardware secara langsung.' },
        { q: 'Urutan lapisan interaksi dari pengguna sampai hardware adalah…', o: ['Pengguna, aplikasi, sistem operasi, hardware', 'Hardware, aplikasi, pengguna, sistem operasi', 'Aplikasi, pengguna, hardware, sistem operasi', 'Sistem operasi, pengguna, hardware, aplikasi'], a: 0, e: 'Perintah turun dari pengguna ke hardware, hasilnya naik kembali ke layar.' },
        { q: 'Di bagian inti sistem operasi, yang menghubungkan software dan hardware, terdapat…', o: ['Kernel OS', 'Ikon', 'Menu'], a: 0, e: 'Kernel OS berada di inti sistem operasi.' },
        { q: 'Yang termasuk bagian sistem operasi adalah…', o: ['Driver', 'Printer', 'Mouse', 'Scanner'], a: 0, e: 'Bagian sistem operasi: sistem berkas (file system), driver, layanan sistem, pengelolaan memori.' },
        { q: 'Antarmuka (interface) menghubungkan…', o: ['Perangkat masukan, keluaran, sistem operasi, aplikasi, dan pengguna', 'Hanya RAM dan CPU', 'Hanya kabel dan colokan', 'Hanya printer dan scanner'], a: 0, e: 'Interface membuat sistem bisa dipakai dan dikendalikan.' },
        /* GUI */
        { q: 'Kepanjangan GUI adalah…', o: ['Graphical User Interface', 'General Unit Input', 'Global User Index', 'Graphic Utility Instruction'], a: 0, e: 'GUI memakai menu dan elemen grafis.' },
        { q: 'Antarmuka yang membuat pengguna tidak harus selalu mengetik perintah teks adalah…', o: ['GUI', 'FLOPS', 'SBC', 'RAM'], a: 0, e: 'GUI memakai elemen grafis seperti ikon dan menu.' },
        { q: 'Simbol grafis yang mewakili fungsi atau objek, misalnya aplikasi di smartphone, disebut…', o: ['Ikon', 'Dialog', 'Checkbox', 'Text box'], a: 0, e: 'Ikon mewakili fungsi atau objek tertentu.' },
        { q: 'Kumpulan pilihan perintah seperti File lalu New, Open, Save disebut…', o: ['Menu', 'Ikon', 'Text box', 'Radio button'], a: 0, e: 'Menu membantu pengguna menemukan perintah.' },
        { q: 'Kotak yang meminta konfirmasi atau pilihan dari pengguna disebut…', o: ['Dialog', 'Ikon', 'Menu', 'Kernel'], a: 0, e: 'Dialog menampilkan informasi atau meminta input.' },
        { q: 'Save, Cancel, dan OK adalah contoh…', o: ['Button', 'Text box', 'Checkbox', 'Radio button'], a: 0, e: 'Button dipilih untuk menjalankan perintah.' },
        { q: 'Elemen GUI untuk mengetikkan nama adalah…', o: ['Text box', 'Radio button', 'Checkbox', 'Ikon'], a: 0, e: 'Text box dipakai untuk memasukkan teks.' },
        { q: 'Elemen GUI untuk memilih tepat satu pilihan adalah…', o: ['Radio button', 'Checkbox', 'Text box'], a: 0, e: 'Dalam satu kelompok radio button, hanya satu opsi yang dipilih.' },
        { q: 'Elemen GUI untuk memilih lebih dari satu pilihan adalah…', o: ['Radio button', 'Checkbox', 'Text box'], a: 1, e: 'Radio button hanya satu pilihan, checkbox boleh banyak.' },
        { q: 'Formulir meminta memilih beberapa hobi sekaligus. Elemen yang tepat adalah…', o: ['Checkbox', 'Radio button', 'Dialog'], a: 0, e: 'Beberapa kotak bisa dicentang sekaligus.' },
        { q: 'Formulir meminta memilih satu jenis kelamin. Elemen yang tepat adalah…', o: ['Radio button', 'Checkbox', 'Ikon'], a: 0, e: 'Pilihan tunggal memakai radio button.' },
        /* pendalaman */
        { q: 'IPOS adalah singkatan dari…', o: ['Input, Process, Output, Storage', 'Input, Program, Output, System', 'Internet, Process, Operasi, Storage', 'Instruksi, Proses, Output, Software'], a: 0, e: 'Storage adalah tahap menyimpan data agar bisa dipakai lagi.' },
        { q: 'Data yang tersimpan di RAM akan…', o: ['Hilang saat daya listrik padam', 'Tetap ada selamanya', 'Pindah otomatis ke printer', 'Berubah menjadi software'], a: 0, e: 'RAM bersifat volatile.' },
        { q: 'Perangkat penyimpanan jangka panjang (non-volatile) adalah…', o: ['SSD', 'RAM', 'Monitor', 'Speaker'], a: 0, e: 'SSD dan HDD menyimpan data walau komputer dimatikan.' },
        { q: 'Istilah lain untuk pengguna sebagai unsur sistem komputer adalah…', o: ['Brainware', 'Firmware', 'Freeware', 'Malware'], a: 0, e: 'Brainware merujuk pada manusia yang mengoperasikan komputer.' },
        { q: 'Software yang membuat sistem operasi bisa berkomunikasi dengan printer adalah…', o: ['Driver', 'Pengolah dokumen', 'Game', 'Lembar kerja'], a: 0, e: 'Driver menjembatani sistem operasi dan perangkat.' },
        { q: 'Bagian inti sistem operasi yang bekerja dekat dengan hardware adalah…', o: ['Kernel', 'Ikon', 'Checkbox', 'Menu'], a: 0, e: 'Kernel mengelola sumber daya seperti memori, proses, dan perangkat.' },
        { q: 'File Explorer termasuk…', o: ['Aplikasi untuk mengakses berkas', 'Bagian kernel', 'Hardware', 'Firmware'], a: 0, e: 'Sistem berkas mengatur berkas; File Explorer hanya aplikasi untuk mengaksesnya.' },
        { q: 'FLOPS mengukur…', o: ['Operasi floating-point per detik', 'Jumlah instruksi CPU per detik', 'Ukuran fisik komputer', 'Kapasitas penyimpanan'], a: 0, e: 'FLOPS bukan instruksi per detik.' },
        { q: '1 byte sama dengan…', o: ['8 bit', '2 bit', '10 bit', '1.024 bit'], a: 0, e: 'Satu byte terdiri atas 8 bit.' },
        { q: 'Antarmuka yang memakai perintah teks disebut…', o: ['CLI', 'GUI', 'SBC', 'IPOS'], a: 0, e: 'CLI: Command Line Interface.' },
        { q: 'Freeware dan open source…', o: ['Tidak selalu sama', 'Selalu sama', 'Keduanya hardware', 'Keduanya jenis mainframe'], a: 0, e: 'Freeware gratis dipakai, tetapi kode sumbernya belum tentu terbuka.' },
        { q: 'Urutan siklus instruksi CPU yang benar adalah…', o: ['Fetch, decode, execute', 'Execute, fetch, decode', 'Decode, execute, fetch', 'Input, proses, output'], a: 0, e: 'CPU mengambil, menerjemahkan, lalu menjalankan instruksi.' },
        /* GUI dan CLI */
        { q: 'Perintah yang diketik di CLI dibaca oleh program bernama…', o: ['Shell', 'Browser', 'Driver', 'Printer'], a: 0, e: 'Shell membaca perintah teks, menjalankannya, lalu menampilkan hasilnya. Contoh: Command Prompt, PowerShell, Terminal.' },
        { q: 'Perintah mkdir tugas di CLI berfungsi untuk…', o: ['Membuat folder bernama tugas', 'Menghapus folder tugas', 'Membuka browser', 'Mencetak dokumen'], a: 0, e: 'mkdir adalah singkatan dari make directory.' },
        { q: 'Salah satu kelebihan CLI dibanding GUI adalah…', o: ['Pekerjaan berulang bisa diotomatisasi dengan skrip', 'Tidak perlu mengetik apa pun', 'Selalu lebih mudah bagi pemula', 'Tidak butuh sistem operasi'], a: 0, e: 'CLI ringan dan mudah diotomatisasi, tetapi perintahnya harus dihafal.' },
        { q: 'Pengguna yang belum hafal perintah biasanya lebih mudah memakai…', o: ['GUI', 'CLI', 'Firmware', 'Kernel'], a: 0, e: 'GUI visual: pengguna tinggal memilih ikon atau menu.' },
        /* contoh hardware dan software */
        { q: 'Sensor optik pada mouse bekerja dengan cara…', o: ['Memotret permukaan meja berulang kali untuk menghitung gerakan', 'Mengukur panas tangan', 'Merekam suara klik', 'Mencetak gerakan di kertas'], a: 0, e: 'Pengendali membandingkan foto berurutan untuk mengetahui arah dan jarak geser.' },
        { q: 'Pada hard disk, data ditulis dan dibaca oleh…', o: ['Head yang melayang di atas piringan magnetik', 'Lampu LED', 'Kipas pendingin', 'Kartu grafis'], a: 0, e: 'Head memagnetkan dan membaca pola magnet pada piringan yang berputar.' },
        { q: 'Mengapa hard disk yang sedang bekerja tidak boleh terguncang?', o: ['Head melayang sangat dekat di atas piringan yang berputar', 'Guncangan menghapus Windows', 'Baterainya akan bocor', 'Kipasnya akan lepas'], a: 0, e: 'Jarak head ke piringan sangat tipis, sehingga guncangan bisa merusak permukaan atau head.' },
        { q: 'Komputer tidak mengenali printer yang baru dipasang. Salah satu penyebabnya…', o: ['Driver printer belum terpasang', 'Monitor mati', 'RAM terlalu besar', 'Browser terlalu lama'], a: 0, e: 'Driver menerjemahkan data dari sistem operasi ke bahasa yang dipahami printer.' },
        { q: 'Scanner mengubah dokumen fisik menjadi berkas digital dengan…', o: ['Menangkap cahaya pantulan memakai sensor', 'Memagnetkan kertas', 'Memotong kertas', 'Mencetak ulang dokumen'], a: 0, e: 'Sensor mengubah cahaya pantulan menjadi sinyal listrik lalu menjadi piksel.' },
        { q: 'Software OCR dipakai untuk…', o: ['Mengubah gambar teks hasil scan menjadi teks yang bisa disunting', 'Memutar video', 'Mendinginkan CPU', 'Mencetak warna'], a: 0, e: 'OCR mengenali huruf pada gambar sehingga teksnya bisa disalin dan disunting.' },
        { q: 'Saat membuka alamat web, browser…', o: ['Mengirim permintaan ke server, menerima halaman, lalu menampilkannya', 'Mencetak alamat itu', 'Mematikan internet', 'Menyalin web ke hard disk saja'], a: 0, e: 'Server membalas dengan berkas halaman (HTML, CSS, JavaScript) yang disusun browser.' },
        { q: 'Kernel Linux juga menjadi dasar sistem operasi…', o: ['Android', 'macOS', 'Windows', 'Pengolah dokumen'], a: 0, e: 'Android berbasis kernel Linux. macOS berbasis Unix, bukan Linux.' },
        { q: 'Langkah yang diulang game puluhan kali per detik adalah…', o: ['Baca input, perbarui keadaan, gambar tampilan', 'Instal, hapus, instal', 'Cetak, pindai, simpan', 'Matikan, nyalakan, matikan'], a: 0, e: 'Ketiganya sama dengan input, proses, output.' },
        { q: 'Saat menekan Save di pengolah dokumen, berkas akhirnya ditulis ke…', o: ['SSD atau hard disk', 'RAM saja', 'Monitor', 'Speaker'], a: 0, e: 'RAM hanya menampung sementara. Penyimpanan permanen ada di SSD atau hard disk.' },
        { q: 'Mengapa software perlu diperbarui (update)?', o: ['Memperbaiki bug dan menutup celah keamanan', 'Menambah komponen fisik', 'Menghemat listrik otomatis', 'Mengubahnya menjadi hardware'], a: 0, e: 'Pembaruan memperbaiki kesalahan, menambah fitur, dan menutup celah keamanan.' },
        { q: 'Resolusi monitor 1920 x 1080 menyatakan…', o: ['Jumlah piksel mendatar dan menurun', 'Panjang kabel', 'Kapasitas RAM', 'Jumlah suara'], a: 0, e: 'Layar memiliki 1.920 piksel mendatar dan 1.080 piksel menurun.' }
    ]
};