/* materi.js: render bagian Jenis, Interaksi, GUI, Ringkasan dari data.js */
(function () {
    'use strict';
    var D = window.DATA, $ = function (s) { return document.querySelector(s); }, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
    function list(t, c, a) { var u = el(t, c); a.forEach(function (x) { u.appendChild(el(t === 'ul' ? 'li' : 'span', '', x)); }); return u; }

    /* ---- Jenis: rel dengan titik makin besar ---- */
    var J = D.jenis, rail = $('#rail'), jb = $('#jbody'), jbs = [];
    rail.appendChild(el('div', 'jline')).appendChild(el('i', 'jfill'));
    J.forEach(function (j, i) {
        var b = el('button', 'jn'), s = el('span'), d = el('i');
        b.type = 'button'; b.setAttribute('role', 'tab'); d.style.setProperty('--s', (14 + i * 5) + 'px');
        s.appendChild(d); b.appendChild(s); b.appendChild(el('b', '', j.nama));
        b.onclick = function () { jshow(i); }; rail.appendChild(b); jbs.push(b);
    });
    function jshow(i) {
        jbs.forEach(function (b, k) { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
        rail.style.setProperty('--p', (i / (J.length - 1) * 100) + '%');
        var j = J[i], l = el('div'), r = el('div'); jb.innerHTML = '';
        l.appendChild(el('h3', '', j.nama)); l.appendChild(el('p', '', j.ringkas));
        r.appendChild(el('div', 'jk', 'Ciri')); r.appendChild(list('ul', 'ci', j.ciri));
        r.appendChild(el('div', 'jk', j.lb)); r.appendChild(list('div', 'chips', j.contoh));
        jb.appendChild(l); jb.appendChild(r);
    }
    rail.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
        var i = Math.max(0, Math.min(J.length - 1, jbs.indexOf(document.activeElement) + k)); e.preventDefault(); jshow(i); jbs[i].focus();
    });
    jshow(0);

    /* ---- Banding Raspberry Pi dan Arduino ---- */
    var B = D.banding, cmp = $('#cmp'), th = el('thead'), tr = el('tr'), tb = el('tbody');
    $('#jsub').textContent = B.judul;
    ['', B.a, B.b].forEach(function (x) { var h = el('th', '', x); h.scope = 'col'; tr.appendChild(h); });
    th.appendChild(tr);
    B.baris.forEach(function (r) { var q = el('tr'), h = el('th', '', r[0]); h.scope = 'row'; q.appendChild(h);[1, 2].forEach(function (c) { var t = el('td', '', r[c]); t.dataset.l = c === 1 ? B.a : B.b; q.appendChild(t); }); tb.appendChild(q); });
    cmp.appendChild(th); cmp.appendChild(tb); $('#gadget').textContent = B.gadget;

    /* ---- Lapisan interaksi ---- */
    var L = D.lapisan.item, lbs = [], cap = $('#lay-cap'), kn = $('#lay-k'), busy = false;
    $('#lay-intro').textContent = D.lapisan.intro;
    L.forEach(function (x, i) {
        var b = el('button', '', x.nama); b.type = 'button'; b.onclick = function () { if (!busy) lshow(i); };
        $('#lay').appendChild(b); lbs.push(b);
    });
    function lshow(i) {
        lbs.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i); });
        cap.textContent = L[i].teks; kn.innerHTML = '';
        if (L[i].kernel) { kn.appendChild(el('div', 'jk', 'Bagian sistem operasi')); kn.appendChild(list('div', 'chips', L[i].kernel)); }
    }
    $('#lay-go').onclick = function () {
        var b = this, seq = [0, 1, 2, 3, 2, 1, 0], k = 0; if (busy) return; busy = true; b.disabled = true;
        (function n() { lshow(seq[k++]); if (k < seq.length) setTimeout(n, reduce ? 500 : 900); else { busy = false; b.disabled = false; } })();
    };
    lshow(0);

    /* ---- GUI: jendela yang bisa dipakai sungguhan ---- */
    var G = D.gui, gl = $('#glist'), gd = $('#gdesc'), win = $('#win'), gbs = [], drop = $('#gdrop');
    $('#gui-intro').textContent = G.intro;
    G.items.forEach(function (x) {
        var b = el('button', '', x.nama); b.type = 'button'; b.dataset.id = x.id; b.onclick = function () { act(x.id); }; gl.appendChild(b); gbs.push(b);
    });
    function act(id) {
        [].forEach.call(win.querySelectorAll('.hl'), function (n) { n.classList.remove('hl'); });
        [].forEach.call(win.querySelectorAll('[data-g="' + id + '"]'), function (n) { n.classList.add('hl'); });
        gbs.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === id); });
        gd.textContent = G.items.filter(function (x) { return x.id === id; })[0].teks;
    }
    ['click', 'focusin'].forEach(function (ev) {
        win.addEventListener(ev, function (e) { var n = e.target.closest('[data-g]'); if (n) act(n.dataset.g); });
    });
    $('#gfile').onclick = function () { drop.hidden = !drop.hidden; };
    drop.addEventListener('click', function () { drop.hidden = true; });
    document.addEventListener('click', function (e) { if (!e.target.closest('.gm-i')) drop.hidden = true; });
    act('ikon');

    /* ---- Ringkasan ---- */
    D.ringkas.forEach(function (r) { var d = el('div'); d.appendChild(el('dt', '', r[0])); d.appendChild(el('dd', '', r[1])); $('#rsm').appendChild(d); });

    /* ---- Penjelasan penting tiap jenis ---- */
    var JD = $('#jdet'), jt = el('h3', 'jsub', 'Yang perlu diingat dari tiap jenis'), jpk = el('div', 'jpick'), jf = el('article', 'jc jfocus'), jpb = [];
    jt.style.marginTop = '48px'; jf.hidden = true; JD.appendChild(jt); JD.appendChild(jpk); JD.appendChild(jf);
    function jfocus(i) {
        var x = D.jenisDetail[i], bk = el('button', 'gb ghost jback', '\u2190 Kembali ke daftar'); bk.type = 'button'; jf.innerHTML = '';
        jf.appendChild(bk); jf.appendChild(el('h4', '', x.nama)); jf.appendChild(el('p', 'in', x.inti)); jf.appendChild(list('ul', '', x.poin)); jf.appendChild(el('div', 'kk', 'Kata kunci: ' + x.kunci));
        bk.onclick = function () { jf.hidden = true; jpk.hidden = false; jpb[i].focus(); };
        jpk.hidden = true; jf.hidden = false; bk.focus();
    }
    D.jenisDetail.forEach(function (x, i) {
        var b = el('button', '', x.nama); b.type = 'button'; b.onclick = function () { jfocus(i); }; jpk.appendChild(b); jpb.push(b);
    });
    var jbt = el('h3', 'jsub', 'Sering tertukar'), jbg = el('div', 'jbeda'); jbt.style.marginTop = '40px'; JD.appendChild(jbt); JD.appendChild(jbg);
    D.jenisBeda.forEach(function (x) { var c = el('div'); c.appendChild(el('h5', '', x.judul)); c.appendChild(el('p', '', x.teks)); jbg.appendChild(c); });
})();