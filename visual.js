/**
 * visual.js — SYSTEM CORE
 * Bagian "Ilustrasi" (model 3D Three.js + GSAP) dan "Alur" (anime.js).
 * Konten teks diambil dari ANATOMY_DATA dan FLOW_STEPS di data.js.
 */
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function $(s, c) { return (c || document).querySelector(s); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    /* ================================================================
       A. ILUSTRASI — Bedah Isi Komputer (Three.js)
       ================================================================ */
    function initAnatomy() {
        var stage = $('#anat-stage'), canvas = $('#anat-canvas'), listEl = $('#anat-list'), panel = $('#anat-panel');
        if (!stage || !canvas || !listEl || !panel || typeof ANATOMY_DATA === 'undefined') return;

        var byId = {}, chips = {}, scene3d = null, selected = null;

        /* ---- daftar komponen (tombol) ---- */
        ANATOMY_DATA.forEach(function (d) {
            byId[d.id] = d;
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'anat-chip'; b.setAttribute('aria-pressed', 'false');
            b.style.setProperty('--c', d.warna);
            b.innerHTML = '<i aria-hidden="true"></i>';
            b.appendChild(document.createTextNode(d.nama.replace(/ \(.*\)/, '')));
            b.addEventListener('click', function () { select(selected === d.id ? null : d.id); });
            listEl.appendChild(b); chips[d.id] = b;
        });

        /* ---- panel informasi ---- */
        function fillPanel(d) {
            panel.style.setProperty('--c', d.warna);
            $('#anat-badge').textContent = d.kategori;
            $('#anat-name').textContent = d.nama;
            $('#anat-fungsi').textContent = d.fungsi;
            $('#anat-fakta').textContent = d.fakta;
            var conn = $('#anat-conn'); conn.innerHTML = '';
            d.terhubung.forEach(function (t) { var s = document.createElement('span'); s.textContent = t; conn.appendChild(s); });
        }

        function select(id) {
            selected = id;
            Object.keys(chips).forEach(function (k) { chips[k].setAttribute('aria-pressed', String(k === id)); });
            if (id) {
                fillPanel(byId[id]); panel.classList.add('has-item');
                if (typeof anime !== 'undefined' && !reduce) {
                    anime.remove('#anat-panel .anat-panel__body');
                    anime({ targets: '#anat-panel .anat-panel__body', opacity: [0, 1], translateY: [10, 0], duration: 450, easing: 'easeOutQuad' });
                }
            } else {
                panel.classList.remove('has-item');
            }
            if (scene3d) scene3d.setSelected(id);
        }

        /* ---- WebGL + Three.js ---- */
        function webglOk() {
            try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
            catch (e) { return false; }
        }
        function fail() { stage.classList.add('no-3d'); }
        if (!webglOk()) { fail(); return; }

        var started = false;
        function start() {
            if (started) return; started = true;
            var run = function () {
                if (typeof THREE === 'undefined') { fail(); return; }
                try {
                    scene3d = (window.SC3D && SC3D.mount) ? SC3D.mount({
                        stage: stage, canvas: canvas, tip: $('#anat-tip'), slider: $('#anat-explode'), toggle: $('#anat-toggle'),
                        select: select,
                        names: Object.keys(byId).reduce(function (a, k) { a[k] = byId[k].nama; return a; }, {}),
                        colors: Object.keys(byId).reduce(function (a, k) { a[k] = byId[k].warna; return a; }, {})
                    }) : buildScene(); if (selected) scene3d.setSelected(selected);
                }
                catch (e) { console.warn('Model 3D gagal dimuat:', e); fail(); }
            };
            if (typeof injectThreeJS === 'function') injectThreeJS(run); else run();
        }
        // Muat Three.js hanya ketika bagian ini mendekati layar
        if ('IntersectionObserver' in window) {
            var lo = new IntersectionObserver(function (en) {
                if (en[0].isIntersecting) { lo.disconnect(); start(); }
            }, { rootMargin: '600px 0px' });
            lo.observe(stage);
        } else { start(); }

        function buildScene() {
            var host = stage;
            var W = host.clientWidth, H = host.clientHeight;
            var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setSize(W, H, false);
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 80);

            scene.add(new THREE.AmbientLight(0xffffff, 1.0));
            var key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 5, 7); scene.add(key);
            var rim = new THREE.PointLight(0x4A7CF7, 90, 0); rim.position.set(-6, 3, -3); scene.add(rim);
            var fill = new THREE.PointLight(0x7EB8B0, 45, 0); fill.position.set(5, -4, 5); scene.add(fill);

            var pc = new THREE.Group(); scene.add(pc);
            pc.position.y = 0.25;

            /* ---------- helper bahan & bentuk ---------- */
            function mat(color, o) {
                o = o || {};
                var m = new THREE.MeshStandardMaterial({
                    color: color, roughness: o.r != null ? o.r : 0.55, metalness: o.m != null ? o.m : 0.3,
                    emissive: o.em != null ? o.em : color, emissiveIntensity: o.ei != null ? o.ei : 0.06,
                    map: o.map || null, transparent: true
                });
                m.userData.ei = m.emissiveIntensity;
                return m;
            }
            function box(w, h, d, m, x, y, z) {
                var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
                mesh.position.set(x || 0, y || 0, z || 0); return mesh;
            }
            function pcbTexture() {
                var c = document.createElement('canvas'); c.width = c.height = 512;
                var g = c.getContext('2d');
                g.fillStyle = '#111b2e'; g.fillRect(0, 0, 512, 512);
                var s = 11; function r() { s = (s * 16807) % 2147483647; return s / 2147483647; }
                g.lineWidth = 2;
                for (var i = 0; i < 70; i++) {
                    var x = Math.floor(r() * 32) * 16, y = Math.floor(r() * 32) * 16, horiz = r() > 0.5;
                    g.strokeStyle = 'rgba(126,184,176,' + (0.25 + r() * 0.3) + ')';
                    g.beginPath(); g.moveTo(x, y);
                    var n = 2 + Math.floor(r() * 5);
                    for (var k = 0; k < n; k++) {
                        var step = 16 * (1 + Math.floor(r() * 5)) * (r() > 0.5 ? 1 : -1);
                        if (horiz) x += step; else y += step;
                        g.lineTo(x, y); horiz = !horiz;
                    }
                    g.stroke(); g.fillStyle = 'rgba(126,184,176,0.7)';
                    g.beginPath(); g.arc(x, y, 3.5, 0, 6.2832); g.fill();
                }
                var t = new THREE.CanvasTexture(c);
                if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
                return t;
            }
            var fans = [];
            function fan(radius, color) {
                var g = new THREE.Group();
                g.add(new THREE.Mesh(new THREE.TorusGeometry(radius, radius * 0.09, 8, 40), mat(0x2a2f44, { m: 0.5 })));
                var rotor = new THREE.Group();
                var hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.27, radius * 0.27, 0.05, 20), mat(color, { ei: 0.5 }));
                hub.rotation.x = Math.PI / 2; rotor.add(hub);
                for (var i = 0; i < 7; i++) {
                    var a = i / 7 * Math.PI * 2;
                    var b = box(radius * 0.8, radius * 0.26, 0.012, mat(color, { ei: 0.2, r: 0.4 }), Math.cos(a) * radius * 0.52, Math.sin(a) * radius * 0.52, 0);
                    b.rotation.z = a + 0.35; rotor.add(b);
                }
                g.add(rotor); fans.push(rotor); return g;
            }

            /* ---------- bagian-bagian komputer ---------- */
            var parts = {};
            function part(id, base, ex, g) {
                g.position.copy(base);
                pc.add(g);
                var mats = [];
                g.traverse(function (o) {
                    if (o.isMesh) { o.userData.partId = id; if (mats.indexOf(o.material) < 0) mats.push(o.material); }
                });
                parts[id] = { group: g, base: base, ex: ex, mats: mats, sel: 0, dim: 0 };
            }
            function V(x, y, z) { return new THREE.Vector3(x, y, z); }

            // Motherboard
            var mb = new THREE.Group();
            mb.add(box(3.4, 3.4, 0.1, mat(0xffffff, { map: pcbTexture(), em: 0x16304a, ei: 0.25, m: 0.1, r: 0.7 })));
            mb.add(box(2.4, 0.12, 0.1, mat(0x0a0d14, { em: 0x000000, ei: 0 }), 0, -0.88, 0.07));    // slot PCIe
            mb.add(box(0.1, 1.6, 0.08, mat(0x0a0d14, { em: 0x000000, ei: 0 }), 1.31, 0.55, 0.06));  // slot RAM
            mb.add(box(0.1, 1.6, 0.08, mat(0x0a0d14, { em: 0x000000, ei: 0 }), 1.59, 0.55, 0.06));
            mb.add(box(0.55, 0.55, 0.12, mat(0x3b4468, { m: 0.7, r: 0.35 }), 1.0, -0.2, 0.1));      // chipset
            mb.add(box(0.9, 0.45, 0.14, mat(0x2b3150, { m: 0.6 }), -1.25, 0.2, 0.1));               // blok I/O
            part('motherboard', V(0, 0, 0), V(0, 0, 0), mb);

            // CPU
            var cpu = new THREE.Group();
            cpu.add(box(0.82, 0.82, 0.08, mat(0x1c2a52, { em: 0x4A7CF7, ei: 0.12 })));
            cpu.add(box(0.62, 0.62, 0.06, mat(0xaabdf0, { m: 0.85, r: 0.3, em: 0x4A7CF7, ei: 0.18 }), 0, 0, 0.07));
            part('cpu', V(0, 0.55, 0.09), V(0, 0.55, 0.95), cpu);

            // Heatsink + kipas
            var cool = new THREE.Group();
            cool.add(box(1.15, 1.15, 0.22, mat(0x59607e, { m: 0.8, r: 0.35 })));
            for (var i = 0; i < 5; i++) cool.add(box(1.17, 0.02, 0.24, mat(0x7a82a3, { m: 0.8, r: 0.3 }), 0, -0.45 + i * 0.225, 0));
            var f1 = fan(0.42, 0xBFC6DB); f1.position.z = 0.13; cool.add(f1);
            part('cooler', V(0, 0.55, 0.33), V(0, 0.55, 2.0), cool);

            // RAM (2 keping)
            var ram = new THREE.Group();
            [-0.14, 0.14].forEach(function (dx) {
                ram.add(box(0.1, 1.55, 0.34, mat(0x2d2760, { m: 0.4 }), dx, 0, 0));
                ram.add(box(0.1, 0.07, 0.35, mat(0x9B8FE0, { ei: 0.7 }), dx, 0.7, 0));
                for (var k = 0; k < 4; k++) ram.add(box(0.11, 0.2, 0.2, mat(0x15122e, { em: 0x000000, ei: 0 }), dx, -0.55 + k * 0.32, 0));
            });
            part('ram', V(1.45, 0.55, 0.2), V(1.7, 0.55, 1.5), ram);

            // GPU
            var gpu = new THREE.Group();
            gpu.add(box(2.6, 0.58, 0.3, mat(0x16323a, { m: 0.5, em: 0x7EB8B0, ei: 0.1 })));
            gpu.add(box(2.6, 0.04, 0.31, mat(0x7EB8B0, { ei: 0.9 }), 0, 0.3, 0));
            gpu.add(box(0.05, 0.66, 0.42, mat(0x9aa0b4, { m: 0.9, r: 0.3 }), -1.32, 0, 0));
            [-0.6, 0.55].forEach(function (x) { var f = fan(0.21, 0x7EB8B0); f.position.set(x, 0, 0.17); gpu.add(f); });
            part('gpu', V(0, -0.85, 0.3), V(0, -1.05, 1.8), gpu);

            // SSD (M.2)
            var ssd = new THREE.Group();
            ssd.add(box(1.0, 0.28, 0.05, mat(0x0f2a20, { em: 0x3DAF7E, ei: 0.15 })));
            ssd.add(box(0.32, 0.2, 0.03, mat(0x1a1a1a, { em: 0x000000, ei: 0, m: 0.6 }), -0.2, 0, 0.04));
            ssd.add(box(0.32, 0.2, 0.03, mat(0x1a1a1a, { em: 0x000000, ei: 0, m: 0.6 }), 0.2, 0, 0.04));
            ssd.add(box(1.0, 0.03, 0.055, mat(0x3DAF7E, { ei: 0.9 }), 0, 0.125, 0));
            part('ssd', V(-1.1, 1.2, 0.08), V(-1.4, 1.25, 0.8), ssd);

            // PSU
            var psu = new THREE.Group();
            psu.add(box(1.9, 0.75, 1.0, mat(0x2a2f3f, { m: 0.5 })));
            psu.add(box(1.91, 0.05, 1.01, mat(0xD4A847, { ei: 0.7 }), 0, 0.2, 0));
            var pf = fan(0.28, 0x8A90A8); pf.position.z = 0.51; psu.add(pf);
            part('psu', V(0, -2.0, -0.05), V(0, -2.45, -1.7), psu);

            // Casing (kerangka kawat)
            var caseGroup = new THREE.Group();
            var caseGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.9, 5.0, 2.1));
            var caseMat = new THREE.LineBasicMaterial({ color: 0x8A90A8, transparent: true, opacity: 0.55 });
            caseGroup.add(new THREE.LineSegments(caseGeo, caseMat));
            caseGroup.position.set(0, -0.2, 0.1);
            pc.add(caseGroup);

            var ids = Object.keys(parts);
            var pickables = [];
            ids.forEach(function (id) { parts[id].group.traverse(function (o) { if (o.isMesh) pickables.push(o); }); });

            /* ---------- state & interaksi ---------- */
            var state = { e: 0, sel: null, hov: null, rotY: -0.55, rotX: 0.22, vY: 0, vX: 0, drag: false, idle: 1, lastMove: 0 };
            var tip = $('#anat-tip'), slider = $('#anat-explode'), toggle = $('#anat-toggle');
            var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
            var ptr = { x: 0, y: 0, cx: 0, cy: 0, inside: false, dirty: false, sx: 0, sy: 0, moved: 0 };

            function syncUI() {
                if (slider) slider.value = Math.round(state.e * 100);
                if (toggle) { var open = state.e > 0.5; toggle.textContent = open ? 'Rakit' : 'Bongkar'; toggle.setAttribute('aria-pressed', String(open)); }
            }
            function explodeTo(v, dur) {
                if (typeof gsap !== 'undefined' && !reduce) {
                    gsap.killTweensOf(state);
                    gsap.to(state, { e: v, duration: dur || 1.3, ease: 'power3.inOut', onUpdate: syncUI });
                } else { state.e = v; syncUI(); }
            }
            if (slider) slider.addEventListener('input', function () {
                if (typeof gsap !== 'undefined') gsap.killTweensOf(state);
                state.e = clamp(slider.value / 100, 0, 1); syncUI();
            });
            if (toggle) toggle.addEventListener('click', function () { explodeTo(state.e > 0.5 ? 0 : 1); });

            // Bongkar otomatis saat bagian ini pertama kali terlihat
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({ trigger: '#ilustrasi', start: 'top 55%', once: true, onEnter: function () { explodeTo(0.7, 2); } });
            } else { explodeTo(0.7); }

            function setPointer(e) {
                var r = canvas.getBoundingClientRect();
                ptr.cx = e.clientX - r.left; ptr.cy = e.clientY - r.top;
                ptr.x = (ptr.cx / r.width) * 2 - 1; ptr.y = -(ptr.cy / r.height) * 2 + 1;
            }
            canvas.addEventListener('pointerdown', function (e) {
                state.drag = true; ptr.sx = e.clientX; ptr.sy = e.clientY; ptr.moved = 0; ptr.lx = e.clientX; ptr.ly = e.clientY;
                state.vX = state.vY = 0; canvas.classList.add('is-drag');
                try { canvas.setPointerCapture(e.pointerId); } catch (er) { }
            });
            canvas.addEventListener('pointermove', function (e) {
                setPointer(e); ptr.inside = true; ptr.dirty = true; state.lastMove = performance.now();
                if (!state.drag) return;
                var dx = e.clientX - ptr.lx, dy = e.clientY - ptr.ly; ptr.lx = e.clientX; ptr.ly = e.clientY;
                ptr.moved += Math.abs(dx) + Math.abs(dy);
                state.rotY += dx * 0.008; state.rotX = clamp(state.rotX + dy * 0.006, -0.9, 0.9);
                state.vY = dx * 0.008; state.vX = dy * 0.006;
            });
            function endDrag(e) {
                if (!state.drag) return; state.drag = false; canvas.classList.remove('is-drag');
                if (e && e.type === 'pointerup' && ptr.moved < 6) { setPointer(e); pick(true); }
            }
            canvas.addEventListener('pointerup', endDrag);
            canvas.addEventListener('pointercancel', endDrag);
            canvas.addEventListener('pointerleave', function () { ptr.inside = false; state.hov = null; tip.classList.remove('on'); canvas.classList.remove('is-hover'); });

            function pick(click) {
                ray.setFromCamera(ndc.set(ptr.x, ptr.y), camera);
                var hit = ray.intersectObjects(pickables, false)[0];
                var id = hit ? hit.object.userData.partId : null;
                if (click) { select(id && id !== selected ? id : null); return; }
                state.hov = id;
                canvas.classList.toggle('is-hover', !!id);
                if (id) {
                    tip.textContent = byId[id].nama; tip.style.transform = 'translate(' + (ptr.cx + 14) + 'px,' + (ptr.cy - 30) + 'px)'; tip.classList.add('on');
                } else tip.classList.remove('on');
            }

            /* ---------- ukuran ---------- */
            function resize() {
                W = host.clientWidth; H = host.clientHeight; if (!W || !H) return;
                renderer.setSize(W, H, false);
                camera.aspect = W / H;
                camera.position.z = 10.5 * clamp(1.15 / camera.aspect, 1, 1.75);
                camera.updateProjectionMatrix();
            }
            resize();
            if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);

            var visible = true;
            new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.02 }).observe(host);

            /* ---------- loop render ---------- */
            var clock = new THREE.Clock();
            function frame() {
                requestAnimationFrame(frame);
                if (!visible || document.hidden) return;
                var t = clock.getElapsedTime(), e = state.e;

                // inersia putar + ayunan lembut saat diam
                if (!state.drag) {
                    state.rotY += state.vY; state.rotX = clamp(state.rotX + state.vX, -0.9, 0.9);
                    state.vY *= 0.93; state.vX *= 0.93;
                }
                var calm = (performance.now() - state.lastMove) > 2500 && !state.drag;
                state.idle += ((calm && !reduce ? 1 : 0) - state.idle) * 0.04;
                pc.rotation.y = state.rotY + Math.sin(t * 0.4) * 0.16 * state.idle;
                pc.rotation.x = state.rotX;

                if (ptr.dirty && !state.drag) { ptr.dirty = false; pick(false); }

                ids.forEach(function (id) {
                    var p = parts[id];
                    p.group.position.lerpVectors(p.base, p.ex, e);
                    var isSel = state.sel === id, isHov = state.hov === id;
                    var selT = isSel ? 1 : (isHov ? 0.45 : 0);
                    var dimT = (state.sel && state.sel !== 'casing' && !isSel) ? 1 : 0;
                    p.sel += (selT - p.sel) * 0.14; p.dim += (dimT - p.dim) * 0.14;
                    for (var i = 0; i < p.mats.length; i++) {
                        var m = p.mats[i];
                        m.emissiveIntensity = m.userData.ei + p.sel * 0.55;
                        m.opacity = 1 - p.dim * 0.74;
                    }
                });
                // casing: makin samar dan makin lebar saat dibongkar
                var cs = 1 + e * 0.35; caseGroup.scale.set(1 + e * 0.1, 1 + e * 0.05, cs);
                caseGroup.position.z = 0.1 + e * 0.1;
                caseMat.opacity += (((state.sel === 'casing') ? 1 : 0.6 - e * 0.35) - caseMat.opacity) * 0.12;

                if (!reduce) {
                    var spin = 0.05 + ((state.sel === 'gpu' || state.sel === 'cooler' || state.sel === 'psu') ? 0.12 : 0);
                    for (var f = 0; f < fans.length; f++) fans[f].rotation.z -= spin;
                }
                renderer.render(scene, camera);
            }
            frame();

            return { setSelected: function (id) { state.sel = id; } };
        }

    }

    /* ================================================================
       B. ALUR — Perjalanan Satu Karakter (anime.js)
       ================================================================ */
    function initFlow() {
        var svgEl = $('#flow-svg');
        if (!svgEl || typeof FLOW_STEPS === 'undefined') return;
        var hasAnime = typeof anime !== 'undefined';
        var NS = 'http://www.w3.org/2000/svg';
        var steps = FLOW_STEPS, last = steps.length - 1;
        var X0 = 80, GAP = 160, Y = 78;
        function nx(i) { return X0 + i * GAP; }

        var input = $('#flow-char'), note = $('#flow-note'), bitsEl = $('#flow-bits');
        var ch = '5', cur = 0, playing = false, timer = null, nodes = [], pk = { x: nx(0) };

        /* ---- representasi karakter ---- */
        function bin8(n) { var s = n.toString(2); while (s.length < 8) s = '0' + s; return s; }
        function show(c) { return c === ' ' ? '\u2423' : c; }
        function fmt(str) {
            var n = ch.charCodeAt(0), b = bin8(n);
            return str.split('{c}').join(show(ch)).split('{n}').join(String(n))
                .split('{hex}').join(n.toString(16).toUpperCase()).split('{bin}').join(b.slice(0, 4) + ' ' + b.slice(4));
        }
        function buildBits() {
            bitsEl.innerHTML = '';
            for (var i = 0; i < 8; i++) {
                var w = Math.pow(2, 7 - i), cell = document.createElement('div');
                cell.className = 'flow-bit'; cell.innerHTML = '<b>0</b><small>' + w + '</small>'; bitsEl.appendChild(cell);
            }
        }
        function renderChar(animate) {
            var n = ch.charCodeAt(0), b = bin8(n), on = [];
            $('#flow-big').textContent = show(ch);
            $('#flow-dec').textContent = String(n);
            $('#flow-hex').textContent = '0x' + n.toString(16).toUpperCase();
            Array.prototype.forEach.call(bitsEl.children, function (cell, i) {
                var one = b.charAt(i) === '1';
                cell.classList.toggle('on', one); cell.firstChild.textContent = b.charAt(i);
                if (one) on.push(Math.pow(2, 7 - i));
            });
            $('#flow-sum').textContent = on.join(' + ') + ' = ' + n;
            if (animate && hasAnime && !reduce) {
                anime.remove('#flow-bits .flow-bit b');
                anime({ targets: '#flow-bits .flow-bit b', rotateX: [90, 0], opacity: [0, 1], delay: anime.stagger(45), duration: 520, easing: 'easeOutBack' });
                anime.remove('#flow-big');
                anime({ targets: '#flow-big', scale: [0.6, 1], duration: 450, easing: 'easeOutElastic(1, .7)' });
            }
            setPacketLabel(); renderCaption(false);
        }
        function setChar(c, fromInput) {
            var code = c.charCodeAt(0);
            if (!c || code < 32 || code > 126) {
                note.textContent = 'Karakter itu di luar ASCII dasar (kode 32 sampai 126). Komputer modern memakai Unicode (UTF-8), dan satu karakter bisa membutuhkan lebih dari satu byte. Coba huruf, angka, atau simbol biasa.';
                input.value = ch; return;
            }
            ch = c; input.value = c;
            note.textContent = 'ASCII mendefinisikan 128 kode (0 sampai 127). Untuk karakter ASCII, nilainya sama dengan di Unicode/UTF-8.';
            renderChar(true);
        }

        /* ---- diagram alur (SVG) ---- */
        function el(tag, attrs, parent) {
            var e = document.createElementNS(NS, tag);
            for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
            if (parent) parent.appendChild(e); return e;
        }
        var defs = el('defs', {}, svgEl);
        var flt = el('filter', { id: 'flow-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
        el('feGaussianBlur', { stdDeviation: '4', result: 'b' }, flt);
        var mg = el('feMerge', {}, flt); el('feMergeNode', { 'in': 'b' }, mg); el('feMergeNode', { 'in': 'SourceGraphic' }, mg);

        el('line', { x1: nx(0), y1: Y, x2: nx(last), y2: Y, stroke: '#252A3A', 'stroke-width': 3, 'stroke-dasharray': '6 6', 'stroke-linecap': 'round' }, svgEl);
        var prog = el('line', { x1: nx(0), y1: Y, x2: nx(0), y2: Y, stroke: '#4A7CF7', 'stroke-width': 3, 'stroke-linecap': 'round' }, svgEl);

        steps.forEach(function (s, i) {
            var g = el('g', { 'class': 'flow-node', tabindex: 0, role: 'button', 'aria-label': 'Langkah ' + (i + 1) + ': ' + s.label }, svgEl);
            var ring = el('circle', { 'class': 'ring', cx: nx(i), cy: Y, r: 30, stroke: s.warna }, g);
            var t1 = el('text', { 'class': 'nn', x: nx(i), y: Y + 5 }, g); t1.textContent = String(i + 1);
            var t2 = el('text', { 'class': 'nl', x: nx(i), y: Y + 58 }, g); t2.textContent = s.label;
            g.addEventListener('click', function () { stop(); goTo(i); });
            g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); goTo(i); } });
            nodes.push({ g: g, ring: ring });
        });

        var packet = el('g', { transform: 'translate(' + pk.x + ' ' + Y + ')' }, svgEl);
        el('circle', { r: 9, fill: '#E8EAF0', filter: 'url(#flow-glow)' }, packet);
        el('circle', { r: 4, fill: '#4A7CF7' }, packet);
        var packetText = el('text', { y: -44, 'text-anchor': 'middle', fill: '#E8EAF0', 'font-size': 14, 'font-family': 'DM Mono, monospace', 'font-weight': 600, 'paint-order': 'stroke', stroke: '#0D0F14', 'stroke-width': 4 }, packet);

        function setPacketLabel() {
            var n = ch.charCodeAt(0);
            packetText.textContent = cur === 2 ? String(n) : cur === 3 ? bin8(n) : show(ch);
        }
        function placePacket() { packet.setAttribute('transform', 'translate(' + pk.x + ' ' + Y + ')'); }

        function renderCaption(animate) {
            var s = steps[cur];
            var stepEl = $('#flow-cap-step');
            stepEl.textContent = 'Langkah ' + (cur + 1) + ' dari ' + steps.length + ' \u00b7 ' + s.label;
            stepEl.style.color = s.warna;
            $('#flow-cap-title').textContent = s.judul;
            $('#flow-cap-desc').textContent = fmt(s.teks);
            $('#flow-cap-data').textContent = fmt(s.data);
            if (animate && hasAnime && !reduce) {
                anime.remove('#flow-caption .flow-cap-anim');
                anime({ targets: '#flow-caption .flow-cap-anim', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(70), duration: 420, easing: 'easeOutQuad' });
            }
        }
        function markNodes() {
            nodes.forEach(function (n, i) {
                n.g.classList.toggle('is-active', i === cur);
                n.g.classList.toggle('is-done', i < cur);
                if (i === cur) n.g.setAttribute('aria-current', 'step'); else n.g.removeAttribute('aria-current');
            });
        }

        function goTo(i, done) {
            cur = clamp(i, 0, last);
            var dist = Math.abs(nx(cur) - pk.x), dur = (reduce || !hasAnime) ? 0 : Math.max(450, dist * 3.6);
            markNodes(); setPacketLabel(); renderCaption(true);
            if (!hasAnime || dur === 0) {
                pk.x = nx(cur); placePacket(); prog.setAttribute('x2', nx(cur));
                if (done) done(); return;
            }
            anime.remove(pk); anime.remove(prog);
            anime({ targets: pk, x: nx(cur), duration: dur, easing: 'easeInOutCubic', update: placePacket });
            anime({
                targets: prog, x2: nx(cur), duration: dur, easing: 'easeInOutCubic',
                complete: function () {
                    anime.remove(nodes[cur].ring);
                    anime({ targets: nodes[cur].ring, r: [30, 38, 30], duration: 650, easing: 'easeOutQuad' });
                    if (done) done();
                }
            });
        }

        /* ---- kontrol ---- */
        var playBtn = $('#flow-play');
        function setPlayLabel() { playBtn.textContent = playing ? 'Jeda' : (cur >= last ? 'Putar ulang' : 'Putar alur'); playBtn.setAttribute('aria-pressed', String(playing)); }
        function stop() { playing = false; clearTimeout(timer); setPlayLabel(); }
        function advance() {
            if (!playing) return;
            if (cur >= last) { stop(); return; }
            timer = setTimeout(function () {
                if (!playing) return;
                goTo(cur + 1, advance);
            }, reduce ? 2600 : 1700);
        }
        function play() {
            if (playing) { stop(); return; }
            playing = true;
            if (cur >= last) goTo(0, advance); else advance();
            setPlayLabel();
        }
        playBtn.addEventListener('click', play);
        $('#flow-next').addEventListener('click', function () { stop(); goTo(cur >= last ? 0 : cur + 1); setPlayLabel(); });
        $('#flow-reset').addEventListener('click', function () { stop(); goTo(0); setPlayLabel(); });

        input.addEventListener('focus', function () { input.select(); });
        input.addEventListener('input', function () { var v = input.value; if (v) setChar(Array.from(v).pop(), true); });
        Array.prototype.forEach.call(document.querySelectorAll('.flow-chip'), function (b) {
            b.addEventListener('click', function () { setChar(b.getAttribute('data-ch')); });
        });

        /* ---- mulai ---- */
        buildBits(); renderChar(false); markNodes(); placePacket(); setPlayLabel();
        note.textContent = 'ASCII mendefinisikan 128 kode (0 sampai 127). Untuk karakter ASCII, nilainya sama dengan di Unicode/UTF-8.';

        // Putar otomatis satu kali ketika diagram terlihat
        if ('IntersectionObserver' in window && !reduce) {
            var io = new IntersectionObserver(function (en) {
                if (en[0].isIntersecting) { io.disconnect(); setTimeout(function () { if (!playing && cur === 0) play(); }, 600); }
            }, { threshold: 0.6 });
            io.observe(svgEl);
        }
    }

    function init() { initAnatomy(); initFlow(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();