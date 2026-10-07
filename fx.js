(function () {
    'use strict';
    var d = document, h = d.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
    function mk(t, c) { var e = d.createElement(t); e.className = c; e.setAttribute('aria-hidden', 'true'); d.body.appendChild(e); return e; }

    /* progres + paralaks judul hero */
    var pill = d.querySelector('.pill'), bar = mk('i', 'prog'), ht = d.querySelector('.hero__t'), tk = 0;
    function onS() {
        tk = 0; var m = h.scrollHeight - innerHeight;
        bar.style.transform = 'scaleX(' + (m > 0 ? scrollY / m : 0) + ')';
        if (!reduce && scrollY < innerHeight * 1.2) ht.style.translate = '0 ' + scrollY * .22 + 'px';
    }
    addEventListener('scroll', function () { if (!tk) { tk = 1; requestAnimationFrame(onS); } }, { passive: true }); onS();

    /* halaman: satu bagian tampil per tab */
    var I = {
        beranda: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
        belajar: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0 0 4h13M9 7h6"/>',
        jelajah: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
        praktik: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
        uji: '<path d="M4 12l5 5L20 6"/>'
    };
    var GN = { beranda: 'Beranda', belajar: 'Belajar', jelajah: 'Jelajah', praktik: 'Praktik', uji: 'Uji' };
    var SN = { sistem: 'Tiga unsur', jenis: 'Jenis komputer', ringkas: 'Ringkasan', dalam: 'Pendalaman', ilustrasi: 'Bongkar 3D', alur: 'Alur kerja', interaksi: 'Interaksi', gui: 'GUI', lab: 'Lab', kuis: 'Kuis' };
    var DS = { belajar: 'Tiga unsur, jenis komputer, pendalaman, dan ringkasan.', jelajah: 'Bongkar komponen 3D, alur kerja, interaksi.', praktik: 'Coba jendela GUI dan susun komponen di Lab.', uji: 'Soal acak untuk mengecek pemahamanmu.' };
    var main = d.querySelector('main'), pages = [], grp = {}, cur = '', first = true;
    var svg = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
    d.querySelectorAll('main > [data-p]').forEach(function (s) {
        var g = s.dataset.g, p = s.dataset.p; (grp[g] = grp[g] || []);
        if (grp[g].indexOf(p) < 0) grp[g].push(p);
    });
    /* urutan halaman mengikuti tab (Beranda, Belajar, Jelajah, ...), bukan urutan section di HTML */
    Object.keys(GN).forEach(function (g) { (grp[g] || []).forEach(function (p) { pages.push(p); }); });
    var gid = function (p) { for (var g in grp) if (grp[g].indexOf(p) > -1) return g; };
    var nav = pill.querySelector('nav'); nav.innerHTML = '';
    var links = Object.keys(GN).map(function (g) {
        var a = d.createElement('a'); a.href = '#' + grp[g][0]; a.innerHTML = svg(I[g]) + '<span>' + GN[g] + '</span>'; nav.appendChild(a); return a;
    });
    var sub = el('div', 'rsub'), nx = el('button', 'rnext'), mn = el('div', 'rmenu');
    sub.setAttribute('role', 'tablist'); nx.type = 'button'; main.prepend(sub); main.appendChild(nx);
    Object.keys(DS).forEach(function (g) {
        var b = el('button', 'rrow'); b.type = 'button'; b.innerHTML = '<strong>' + GN[g] + '</strong><span>' + DS[g] + '</span>' + svg('<path d="M4 12h16M14 6l6 6-6 6"/>');
        b.onclick = function () { go(grp[g][0]); }; mn.appendChild(b);
    });
    d.querySelector('.marq').after(mn); mn.dataset.p = 'beranda'; mn.dataset.g = 'beranda';
    function el(t, c) { var e = d.createElement(t); e.className = c; return e; }
    function go(p, pop) {
        if (pages.indexOf(p) < 0) return; var g = gid(p), i = pages.indexOf(p), n = pages[(i + 1) % pages.length]; cur = p;
        d.querySelectorAll('main > [data-p]').forEach(function (s) { s.classList.toggle('off', s.dataset.p !== p); });
        links.forEach(function (a, k) { a.classList.toggle('on', Object.keys(GN)[k] === g); });
        sub.innerHTML = ''; sub.hidden = grp[g].length < 2;
        grp[g].forEach(function (q) { var b = d.createElement('button'); b.type = 'button'; b.textContent = SN[q]; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', q === p); b.onclick = function () { go(q); }; sub.appendChild(b); });
        nx.hidden = g === 'beranda'; nx.innerHTML = '<span><small>' + (i === pages.length - 1 ? 'Selesai' : 'Berikutnya') + '</small><strong>' + (i === pages.length - 1 ? 'Kembali ke beranda' : SN[n]) + '</strong></span>' + svg('<path d="M4 12h16M14 6l6 6-6 6"/>');
        main.dataset.home = g === 'beranda' ? 1 : 0; main.dataset.g = g;
        if (!first && !pop) history.pushState(null, '', '#' + p); first = false;
        scrollTo(0, 0); requestAnimationFrame(function () { dispatchEvent(new Event('resize')); onS(); });
    }
    nx.onclick = function () { go(pages[(pages.indexOf(cur) + 1) % pages.length]); };
    d.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return; var id = a.getAttribute('href').slice(1);
        if (pages.indexOf(id) < 0) return; e.preventDefault(); e.stopPropagation(); go(id);
    }, true);
    addEventListener('popstate', function () { go(location.hash.slice(1) || 'beranda', true); });
    go(pages.indexOf(location.hash.slice(1)) > -1 ? location.hash.slice(1) : 'beranda', true);

    /* jenis komputer: sub-tab di dalam bagian supaya tidak memanjang */
    var jn = d.getElementById('jenis'), jd = d.getElementById('jdet');
    if (jn && jd) {
        var JG = [['Jenis', [jn.querySelector('.jrail-wrap'), d.getElementById('jbody')]],
        ['Yang perlu diingat', [jd.children[0], jd.children[1], jd.children[2]]],
        ['Sering tertukar', [jd.children[3], jd.children[4]]],
        ['Pi dan Arduino', [d.getElementById('jsub'), jn.querySelector('.cmp-wrap'), d.getElementById('gadget')]]], jt = el('div', 'jtabs'), jb = [];
        JG.forEach(function (g, i) {
            var b = d.createElement('button'); b.type = 'button'; b.textContent = g[0];
            b.onclick = function () {
                JG.forEach(function (x, k) { x[1].forEach(function (n) { n.classList.toggle('jx', k !== i); }); jb[k].setAttribute('aria-selected', k === i); });
                dispatchEvent(new Event('resize'));
            };
            jb.push(b); jt.appendChild(b);
        });
        jn.querySelector('h2').after(jt); jb[0].click();
    }

    /* judul: kata naik dari balik garis */
    var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: .3 });
    d.querySelectorAll('h2').forEach(function (el) {
        var t = el.textContent.trim().split(/\s+/); el.setAttribute('aria-label', t.join(' ')); el.textContent = '';
        t.forEach(function (w, i) {
            var s = d.createElement('span'); s.className = 'w'; s.setAttribute('aria-hidden', 'true');
            s.innerHTML = '<span style="--i:' + i + '"></span>'; s.firstChild.textContent = w;
            el.appendChild(s); el.appendChild(d.createTextNode(' '));
        });
        ro.observe(el);
    });

    if (!fine || reduce) return;

    /* tombol magnetik */
    d.querySelectorAll('.btn,.cta').forEach(function (b) {
        b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); b.style.translate = (e.clientX - r.left - r.width / 2) * .25 + 'px ' + (e.clientY - r.top - r.height / 2) * .35 + 'px'; });
        b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
})();