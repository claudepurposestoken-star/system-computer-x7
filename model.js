/* models.js: viewer 3D untuk semua komponen (data dari SC3D.defs di 2model.js) */
(function () {
    'use strict';
    var SC = window.SC3D, $ = function (s) { return document.querySelector(s); };
    if (!window.THREE || !SC || !SC.order.length) return;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

    function desc(n, t) { var p = $('#pdesc'); p.innerHTML = ''; p.appendChild(el('b', '', n)); p.appendChild(el('span', '', t)); }
    var cv = $('#xray'), R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 2));
    var S = new THREE.Scene(), C = new THREE.PerspectiveCamera(35, 1, .1, 60), pv = new THREE.Group(), vis = true;
    S.add(pv, new THREE.AmbientLight(0xffffff, 1.05));
    var l1 = new THREE.DirectionalLight(0xffffff, 1.5); l1.position.set(3, 5, 4); S.add(l1);
    var l2 = new THREE.DirectionalLight(0x9fe9de, 1.2); l2.position.set(-4, 2, -3); S.add(l2);
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(cv);

    var cache = {}, cur = null, sel = null, ry = .6, rx = .25, ex = +$('#exp').value, exT = ex, drag = null, auto = !reduce, moved = false, pb = [], tb = [];

    function size() {
        var w = cv.clientWidth, h = cv.clientHeight; R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix(); fit();
    }
    function fit() { if (cur) C.position.set(0, 0, cur.def.size * 2.4 / Math.min(1, C.aspect)); }

    function build(id) {
        if (cache[id]) return cache[id];
        var def = SC.defs[id], m = def.build(SC), g = new THREE.Group();
        m.root.traverse(function (o) {
            if (o.isMesh && !Array.isArray(o.material)) { o.material = o.material.clone(); o.material.userData.ei = o.material.emissiveIntensity; o.material.userData.em = o.material.emissive.getHex(); }
        });
        g.add(m.root); m.root.position.sub(new THREE.Box3().setFromObject(m.root).getCenter(new THREE.Vector3()));
        return (cache[id] = { def: def, m: m, g: g });
    }
    function paint() {
        cur.g.traverse(function (o) {
            if (!o.isMesh) return; var m = o.material, on = sel && o.userData.sub === sel, dim = sel && !on;
            m.emissive.setHex(on ? 0x14d4be : m.userData.em); m.emissiveIntensity = on ? .45 : m.userData.ei;
            if (m.transparent !== !!dim) { m.transparent = !!dim; m.depthWrite = !dim; m.needsUpdate = true; }
            m.opacity = dim ? .3 : 1;
        });
    }
    function pick(id) {
        sel = sel === id ? null : id; paint();
        pb.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === sel); });
        var s = cur.def.subs.filter(function (x) { return x.id === sel; })[0];
        desc(s ? s.nama : cur.def.nama, s ? s.teks : cur.def.intro);
    }
    function show(id) {
        if (cur) { pv.remove(cur.g); cur.g.traverse(function (o) { if (o.isMesh) { o.material.transparent = false; o.material.opacity = 1; } }); }
        cur = build(id); sel = null; pv.add(cur.g); fit();
        tb.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.id === id); });
        var d = cur.def, lab = $('.stage label'); $('#exp').setAttribute('aria-label', d.open || 'Jarak bongkar'); lab.style.display = cur.m.open ? '' : 'none';
        var box = $('#parts'); box.innerHTML = ''; pb = [];
        d.subs.forEach(function (s) {
            var b = el('button', '', s.nama); b.dataset.id = s.id; b.setAttribute('aria-pressed', 'false');
            b.onclick = function () { pick(s.id); }; box.appendChild(b); pb.push(b);
        });
        desc(d.nama, d.intro); $('#pfact').textContent = d.fakta || ''; paint();
    }
    SC.order.forEach(function (id) {
        var b = el('button', '', SC.defs[id].nama); b.dataset.id = id; b.setAttribute('role', 'tab');
        b.onclick = function () { show(id); }; $('#mtabs').appendChild(b); tb.push(b);
    });
    $('#mtabs').addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
        var i = Math.max(0, Math.min(tb.length - 1, tb.indexOf(document.activeElement) + k)); e.preventDefault(); tb[i].focus(); tb[i].click();
    });
    $('#exp').addEventListener('input', function (e) { exT = +e.target.value; });

    /* putar dengan seret; klik tanpa geser memilih bagian */
    cv.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY }; moved = false; cv.classList.add('drag'); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', function (e) {
        if (!drag) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
        ry += dx * .01; rx = Math.max(-1.3, Math.min(1.3, rx + dy * .01)); drag = { x: e.clientX, y: e.clientY };
    });
    cv.addEventListener('pointerup', function (e) {
        cv.classList.remove('drag'); var was = drag; drag = null; if (!was || moved) return;
        var r = cv.getBoundingClientRect(), rc = new THREE.Raycaster();
        rc.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), C);
        var hit = rc.intersectObject(cur.g, true).filter(function (h) { return h.object.userData.sub; })[0];
        if (hit) pick(hit.object.userData.sub);
    });

    var tl = el('div', 'xtool'), ba = el('button', '', 'Putar otomatis'), br = el('button', '', 'Atur ulang');
    ba.type = br.type = 'button'; ba.setAttribute('aria-pressed', auto);
    ba.onclick = function () { auto = !auto; ba.setAttribute('aria-pressed', auto); };
    br.onclick = function () { ry = .6; rx = .25; exT = .6; $('#exp').value = .6; };
    tl.appendChild(ba); tl.appendChild(br); $('.stage').appendChild(tl);
    addEventListener('resize', size);
    show(SC.order[0]); size();
    (function loop(t) {
        requestAnimationFrame(loop); if (!vis) return;
        if (!drag && auto) ry += .003;
        ex += (exT - ex) * (reduce ? 1 : .1);
        if (cur.m.open) cur.m.open(ex);
        if (!reduce) { (cur.m.spin || []).forEach(function (r) { r.rotation.z -= .08; }); if (cur.m.tick) cur.m.tick(t / 1000); }
        pv.rotation.y = ry; pv.rotation.x = rx; R.render(S, C);
    })(0);
})();