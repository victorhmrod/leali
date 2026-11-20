/* LEALI — camada de interação: cursor, brilhos, inclinação 3D, partículas, entradas animadas.
   Carrega depois de main.js. Respeita prefers-reduced-motion e dispositivos de toque. */
(function () {
  "use strict";
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const safe = (fn) => { try { fn(); } catch (e) { /* efeito opcional: nunca derruba o site */ } };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const page = document.body.dataset.page || "home";
  const PAL = ["#CF947C", "#B99D83", "#B4A3BD", "#F5EFE7", "#8E4C6A"];
  const pick = (a) => a[(Math.random() * a.length) | 0];

  /* Preço do lançamento vem do catálogo */
  safe(() => $$("[data-price]").forEach((el) => {
    const p = window.LEALI && window.LEALI.byId[el.dataset.price];
    if (p) el.textContent = window.LEALI.money(p.preco);
  }));

  if (reduce) return;
  html.classList.add("fx");

  /* ---------- Estrela de quatro pontas ---------- */
  function star(g, x, y, r, rot) {
    g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
    g.moveTo(0, -r); g.quadraticCurveTo(0, 0, r, 0); g.quadraticCurveTo(0, 0, 0, r);
    g.quadraticCurveTo(0, 0, -r, 0); g.quadraticCurveTo(0, 0, 0, -r); g.closePath(); g.fill(); g.restore();
  }

  /* ---------- Progresso de rolagem + cabeçalho ---------- */
  safe(() => {
    const bar = document.createElement("div"); bar.className = "fx-progress"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar);
    const onScroll = () => {
      const max = html.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
      const hd = $(".site-header"); if (hd) hd.classList.toggle("is-scrolled", scrollY > 8);
    };
    addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();
  });

  /* ---------- Cortina de abertura (home, uma vez por sessão) ---------- */
  let d0 = 0;
  safe(() => {
    if (page !== "home") return;
    let seen = false;
    try { seen = sessionStorage.getItem("leali-intro") === "1"; sessionStorage.setItem("leali-intro", "1"); } catch (e) { /* sem storage */ }
    if (seen) return;
    d0 = 1.0;
    const c = document.createElement("div"); c.className = "fx-curtain"; c.setAttribute("aria-hidden", "true");
    c.innerHTML = '<div class="fx-curtain-logo"><img src="assets/logo-sm.png" alt=""></div>';
    document.body.appendChild(c); document.body.classList.add("no-scroll");
    c.addEventListener("animationend", (e) => { if (e.animationName === "fx-lift") { c.remove(); document.body.classList.remove("no-scroll"); } });
    setTimeout(() => { c.remove(); document.body.classList.remove("no-scroll"); }, 2600);
  });
  html.style.setProperty("--fx-d0", d0 + "s");

  /* ---------- Títulos palavra por palavra + entrada dos textos ---------- */
  safe(() => {
    const split = (root, ctr) => Array.from(root.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "fx-w";
          const s = document.createElement("span"); s.textContent = t; s.style.setProperty("--i", ctr.n++);
          w.appendChild(s); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) split(n, ctr);
    });
    $$(".hero .display, .page-hero .display").forEach((h) => { h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim()); split(h, { n: 0 }); });
    $$(".hero-panel .eyebrow, .hero-panel p, .hero-cta, .page-hero .crumbs, .page-hero .lead").forEach((el, i) => { el.style.setProperty("--i", i); el.classList.add("fx-up"); });
  });

  /* ---------- Camada global de brilhos (rastro do mouse e explosões) ---------- */
  const cv = document.createElement("canvas"); cv.className = "fx-canvas"; cv.setAttribute("aria-hidden", "true"); document.body.appendChild(cv);
  const cg = cv.getContext("2d");
  let W = 0, H = 0;
  const fit = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; cg.setTransform(d, 0, 0, d, 0, 0); };
  fit(); addEventListener("resize", fit);
  const ps = []; let running = false;
  function tick() {
    cg.clearRect(0, 0, W, H);
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i]; p.life++;
      if (p.life >= p.max) { ps.splice(i, 1); continue; }
      const t = p.life / p.max;
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.985;
      cg.globalAlpha = (1 - t) * (t < 0.12 ? t / 0.12 : 1) * 0.95;
      cg.fillStyle = p.c;
      star(cg, p.x, p.y, p.r * (1 - t * 0.55), p.rot + p.vr * p.life);
    }
    cg.globalAlpha = 1;
    if (ps.length) requestAnimationFrame(tick); else { running = false; cg.clearRect(0, 0, W, H); }
  }
  function spawn(x, y, o) {
    ps.push({ x, y, vx: o.vx, vy: o.vy, g: o.g, r: o.r, c: o.c || pick(PAL), life: 0, max: o.max, rot: rand(0, 3), vr: rand(-0.06, 0.06) });
    if (ps.length > 160) ps.shift();
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function burst(x, y, n, power) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(-0.25, 0.25), s = rand(1.4, power);
      spawn(x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 0.05, r: rand(3.5, 9), max: rand(34, 58) });
    }
  }

  /* ---------- Cliques: explosão de brilhos, pulo da sacola ---------- */
  const ADD_SEL = "[data-add], #pd-add";
  const bump = () => setTimeout(() => $$(".cart-count").forEach((b) => { b.classList.remove("fx-bump"); void b.offsetWidth; b.classList.add("fx-bump"); }), 80);

  /* ---------- Som: "plim" sintetizado ao adicionar na sacola ---------- */
  let soundOn = true, actx = null;
  try { soundOn = localStorage.getItem("leali-sound") !== "0"; } catch (e) { /* sem storage */ }
  function chime() {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t = actx.currentTime;
      [[1318.5, 0], [1760, 0.09], [2217.5, 0.18], [2637, 0.28]].forEach(([f, d], i) => {
        const o = actx.createOscillator(), gn = actx.createGain();
        o.type = i % 2 ? "triangle" : "sine"; o.frequency.value = f;
        gn.gain.setValueAtTime(0.0001, t + d); gn.gain.linearRampToValueAtTime(0.06, t + d + 0.012); gn.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.95);
        o.connect(gn); gn.connect(actx.destination); o.start(t + d); o.stop(t + d + 1);
      });
    } catch (e) { /* áudio indisponível */ }
  }
  safe(() => {
    const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
    const ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
    const b = document.createElement("button"); b.type = "button"; b.className = "fx-sound";
    const paint = () => { b.innerHTML = soundOn ? ICON_ON : ICON_OFF; b.setAttribute("aria-pressed", String(soundOn)); b.setAttribute("aria-label", soundOn ? "Som ligado. Desligar som" : "Som desligado. Ligar som"); b.title = soundOn ? "Som ligado" : "Som desligado"; };
    paint(); document.body.appendChild(b);
    b.addEventListener("click", () => { soundOn = !soundOn; try { localStorage.setItem("leali-sound", soundOn ? "1" : "0"); } catch (e) { /* sem storage */ } paint(); if (soundOn) chime(); });
  });
  /* adicionar pelo teclado (sem pointerdown) */
  document.addEventListener("click", (e) => {
    if (e.detail === 0 && e.target instanceof Element && e.target.closest(ADD_SEL)) { chime(); bump(); }
  });

  /* ---------- Pétalas caindo (reagem ao mouse e à rolagem) ---------- */
  const mouse = { x: -999, y: -999 };
  safe(() => {
    const pc = document.createElement("canvas"); pc.className = "fx-petals"; pc.setAttribute("aria-hidden", "true"); document.body.appendChild(pc);
    const g = pc.getContext("2d"); let pw = 0, ph = 0, raf = 0, sv = 0, lastY = scrollY;
    const fitP = () => { const d = Math.min(devicePixelRatio || 1, 2); pw = innerWidth; ph = innerHeight; pc.width = pw * d; pc.height = ph * d; g.setTransform(d, 0, 0, d, 0, 0); };
    fitP(); addEventListener("resize", fitP);
    const COL = ["#E4D3F2", "#D3BFE6", "#F0D3CA", "#CF947C", "#EBD9DF", "#B4A3BD"];
    const mk = (init) => ({ x: rand(0, pw), y: init ? rand(-ph, ph) : rand(-90, -20), r: rand(6, 12.5), vy: rand(0.45, 1.05), sw: rand(0.008, 0.026), ph: rand(0, 6.28), rot: rand(0, 6.28), vr: rand(-0.02, 0.02), tilt: rand(0, 6.28), c: pick(COL), a: rand(0.38, 0.7), vx: 0 });
    const petals = Array.from({ length: innerWidth < 720 ? 9 : 17 }, () => mk(true));
    addEventListener("scroll", () => { sv = clamp(sv + (scrollY - lastY) * 0.03, -6, 6); lastY = scrollY; }, { passive: true });
    function loop() {
      raf = 0; if (document.hidden) return;
      g.clearRect(0, 0, pw, ph); sv *= 0.93;
      for (const p of petals) {
        p.ph += p.sw; p.tilt += 0.018; p.rot += p.vr;
        p.x += Math.sin(p.ph) * 0.55 + p.vx; p.vx *= 0.965; p.y += p.vy - sv * 0.6;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.hypot(dx, dy) || 1;
        if (dist < 120) { const f = 1 - dist / 120; p.vx += (dx / dist) * f * 0.9; p.y += (dy / dist) * f * 2.4; p.rot += f * 0.05; }
        if (p.y > ph + 24) Object.assign(p, mk(false), { x: rand(0, pw) });
        if (p.y < -140) p.y = ph + 20;
        if (p.x < -24) p.x = pw + 24; else if (p.x > pw + 24) p.x = -24;
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.scale(1, Math.cos(p.tilt) * 0.85 + 0.15);
        g.globalAlpha = p.a; g.fillStyle = p.c; g.beginPath();
        g.moveTo(0, -p.r); g.bezierCurveTo(p.r * 0.95, -p.r * 0.55, p.r * 0.8, p.r * 0.75, 0, p.r); g.bezierCurveTo(-p.r * 0.8, p.r * 0.75, -p.r * 0.95, -p.r * 0.55, 0, -p.r);
        g.fill(); g.restore();
      }
      raf = requestAnimationFrame(loop);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    document.addEventListener("visibilitychange", kick); kick();
  });

  document.addEventListener("pointerdown", (e) => {
    safe(() => {
      const add = e.target instanceof Element && e.target.closest(ADD_SEL);
      burst(e.clientX, e.clientY, add ? 22 : 10, add ? 5.2 : 3.6);
      if (add) { chime(); bump(); }
    });
  });

  /* ---------- Campo de partículas dentro de um painel ---------- */
  function field(host, opt) {
    const c = document.createElement("canvas"); c.className = "fx-field"; c.setAttribute("aria-hidden", "true"); host.prepend(c);
    const g = c.getContext("2d"); let w = 0, h = 0, pts = [], vis = true, raf = 0; const m = { x: -999, y: -999 };
    const mk = () => ({ x: rand(0, w), y: rand(0, h), r: rand(2, 5.5), s: rand(0.12, 0.38), ph: rand(0, 6.28), tw: rand(0.015, 0.04), vx: rand(-0.12, 0.12), c: pick(opt.colors) });
    function size() {
      const r = host.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height; c.width = w * d; c.height = h * d; g.setTransform(d, 0, 0, d, 0, 0);
      const n = clamp(Math.round((w * h) / opt.density), 12, 90);
      while (pts.length < n) pts.push(mk()); pts.length = n;
    }
    function loop() {
      raf = 0; if (!vis || document.hidden) return;
      g.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.y -= p.s; p.ph += p.tw; p.x += p.vx + Math.sin(p.ph) * 0.12;
        const dx = p.x - m.x, dy = p.y - m.y, dist = Math.hypot(dx, dy) || 1; let boost = 0;
        if (dist < 140) { boost = 1 - dist / 140; p.x += (dx / dist) * boost * 3.2; p.y += (dy / dist) * boost * 3.2; }
        if (p.y < -12) { p.y = h + 12; p.x = rand(0, w); }
        if (p.x < -12) p.x = w + 12; if (p.x > w + 12) p.x = -12;
        g.globalAlpha = clamp(0.28 + 0.5 * Math.abs(Math.sin(p.ph * 1.6)) + boost * 0.4, 0, 1);
        g.fillStyle = p.c; star(g, p.x, p.y, p.r * (1 + boost * 1.1), p.ph);
      }
      g.globalAlpha = 1; raf = requestAnimationFrame(loop);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    new ResizeObserver(size).observe(host); size();
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis) kick(); }).observe(host);
    document.addEventListener("visibilitychange", kick);
    host.addEventListener("pointermove", (e) => { const r = host.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; });
    host.addEventListener("pointerleave", () => { m.x = m.y = -999; });
    kick();
  }
  safe(() => { const h = $(".hero-panel"); if (h) field(h, { colors: ["#CF947C", "#B99D83", "#B4A3BD", "#F5EFE7"], density: 11000 }); });
  safe(() => { const s = $(".showcase"); if (s) field(s, { colors: ["#FFFFFF", "#CF947C", "#B99D83", "#8E78A8"], density: 9500 }); });

  /* ---------- Spot de luz + parallax em painéis ---------- */
  safe(() => $$(".hero-panel, .hero-art, .showcase").forEach((el) => el.setAttribute("data-spot", "")));

  if (!fine) return; /* abaixo: só para mouse */
  html.classList.add("fx-fine");

  /* ---------- Movimento do mouse: tudo num só ouvinte ---------- */
  const TILT = ".card, .universe, .pillar, .sign-card, .logo-card, [data-tilt]";
  let curTilt = null, lastE = null, tRaf = 0, curSpot = null, curMag = null, trailD = 0, lx = null, ly = null;

  function releaseTilt(el) { el.classList.remove("is-tracking"); ["--rx", "--ry", "--px", "--py"].forEach((k) => el.style.removeProperty(k)); }
  function applyTilt() {
    tRaf = 0; if (!curTilt || !lastE) return;
    const r = curTilt.getBoundingClientRect(), px = (lastE.clientX - r.left) / r.width, py = (lastE.clientY - r.top) / r.height;
    const max = +curTilt.dataset.tilt || (curTilt.matches(".card, .universe, .pillar") ? 4.5 : 9);
    curTilt.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
    curTilt.style.setProperty("--rx", ((0.5 - py) * 2 * max).toFixed(2) + "deg");
    curTilt.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
    curTilt.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    curTilt.style.setProperty("--px", ((px - 0.5) * 2).toFixed(2));
    curTilt.style.setProperty("--py", ((py - 0.5) * 2).toFixed(2));
  }

  document.addEventListener("pointermove", (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const t = e.target instanceof Element ? e.target : null;
    lastE = e; mouse.x = e.clientX; mouse.y = e.clientY;

    /* rastro de brilhos */
    if (lx !== null) trailD += Math.hypot(e.clientX - lx, e.clientY - ly);
    lx = e.clientX; ly = e.clientY;
    if (trailD > 26 && !(t && t.closest("input, textarea, select"))) {
      trailD = 0;
      spawn(e.clientX + rand(-4, 4), e.clientY + rand(-4, 4), { vx: rand(-0.4, 0.4), vy: rand(-0.6, 0.1), g: 0.025, r: rand(3.5, 7.5), max: rand(30, 46) });
    }

    /* spot de luz e parallax */
    const sp = t && t.closest("[data-spot]");
    if (sp !== curSpot) { if (curSpot) { curSpot.classList.remove("is-lit"); curSpot.style.setProperty("--sx", 0); curSpot.style.setProperty("--sy", 0); } curSpot = sp; if (sp) sp.classList.add("is-lit"); }
    if (sp) {
      const r = sp.getBoundingClientRect();
      sp.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px"); sp.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
      sp.style.setProperty("--sx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(2)); sp.style.setProperty("--sy", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(2));
    }

    /* inclinação 3D */
    const el = t && t.closest(TILT);
    if (el !== curTilt) {
      if (curTilt) releaseTilt(curTilt);
      curTilt = el && !(el.classList.contains("reveal") && !el.classList.contains("is-in")) ? el : null;
      if (curTilt) curTilt.classList.add("fx-tilt", "is-tracking");
    }
    if (curTilt && !tRaf) tRaf = requestAnimationFrame(applyTilt);

    /* botões magnéticos */
    const mg = t && t.closest(".btn:not(.btn--block), .icon-btn");
    if (mg !== curMag) { if (curMag) curMag.style.translate = ""; curMag = mg; }
    if (mg) {
      const r = mg.getBoundingClientRect();
      mg.style.translate = `${(((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(1)}px ${(((e.clientY - r.top) / r.height - 0.5) * 9).toFixed(1)}px`;
    }
  }, { passive: true });

  html.addEventListener("mouseleave", () => {
    if (curTilt) { releaseTilt(curTilt); curTilt = null; }
    if (curSpot) { curSpot.classList.remove("is-lit"); curSpot.style.setProperty("--sx", 0); curSpot.style.setProperty("--sy", 0); curSpot = null; }
    if (curMag) { curMag.style.translate = ""; curMag = null; }
  });
})();
