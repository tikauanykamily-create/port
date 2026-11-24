/* =========================================================
   MÁSCARA LÍQUIDA DO RETRATO (hero)
   A foto alternativa (.ph-alt) aparece dentro de bolhas que se fundem
   (filtro "goo" em SVG): uma corrente de bolhas segue o cursor com física
   de mola e outras flutuam sozinhas sobre a foto. As duas camadas têm um
   leve parallax.
   Inspirado no efeito do portfólio pedrogarciadev.com.br.
   ========================================================= */
(() => {
  'use strict';
  const stage = document.querySelector('.hero-photo');
  const base = document.querySelector('.ph-main');
  const reveal = document.querySelector('.ph-alt');
  const maskEl = document.getElementById('kk-blob-mask');
  const blobRoot = document.getElementById('kk-mask-blobs');
  const heroSection = document.querySelector('.hero');
  if (!stage || !base || !reveal || !maskEl || !blobRoot) return;
  // área do efeito = hero inteiro (como no original): o cursor e as bolhas livres
  // circulam pela seção toda e só aparecem quando passam por cima da foto
  const area = heroSection || stage;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { reveal.style.display = 'none'; return; }

  const NS = 'http://www.w3.org/2000/svg';
  // AJUSTES: menos bolhas / bolhas menores = aparece menos a foto alternativa
  const AUTO_BLOBS_DESKTOP = 12, AUTO_BLOBS_MOBILE = 5;   // bolhas que flutuam sozinhas
  const AUTO_SCALE = 0.75;                                 // tamanho das bolhas livres
  const CURSOR_SCALE = 1.12;                               // tamanho da bolha que segue o mouse
  const BLOB_MIN = 72, BLOB_MAX = 192, PARALLAX = 3, ORGANIC = 0.16;
  const mqDesktop = matchMedia('(min-width: 1024px)');
  const mqTablet = matchMedia('(min-width: 768px)');
  const coarse = matchMedia('(pointer: coarse)').matches;
  const clamp = (a, b, v) => Math.min(b, Math.max(a, v));

  // Safari/iOS e telas de toque usam máscara por gradientes (mais estável no WebKit);
  // Chrome/Edge/Firefox no desktop usam a máscara SVG com o filtro goo.
  const ua = navigator.userAgent;
  const webkit = /iP(ad|hone|od)/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
    || (/Safari/i.test(ua) && !/(Chrome|CriOS|Chromium|Edg|OPR|Android)/i.test(ua));
  const supports = v => window.CSS && (CSS.supports('mask-image', v) || CSS.supports('-webkit-mask-image', v));
  const gradOK = supports('radial-gradient(circle at 50% 50%, #000 40%, transparent 41%)');
  const svgOK = supports("url('#kk-blob-mask')");
  const mode = (coarse || webkit) && gradOK ? 'gradient' : svgOK ? 'svg' : gradOK ? 'gradient' : 'clip';

  const setMask = v => { reveal.style.maskImage = v; reveal.style.webkitMaskImage = v; };
  reveal.style.maskRepeat = 'no-repeat'; reveal.style.webkitMaskRepeat = 'no-repeat';
  if (mode === 'svg') {
    reveal.style.mask = "url('#kk-blob-mask') no-repeat 0 0 / 100% 100%";
    reveal.style.webkitMask = "url('#kk-blob-mask') no-repeat 0 0 / 100% 100%";
  } else if (mode === 'clip') {
    reveal.style.clipPath = 'circle(0px at 50% 50%)';
  }

  // mola 2D (posição segue o alvo com inércia)
  const spring = (k, d) => {
    let x = 0, y = 0, vx = 0, vy = 0;
    return {
      reset(px, py) { x = px; y = py; vx = vy = 0; },
      step(tx, ty, dt) {
        vx += ((tx - x) * k - vx * d) * dt; vy += ((ty - y) * k - vy * d) * dt;
        x += vx * dt; y += vy * dt; return { x, y };
      },
    };
  };
  const head = spring(250, 30), body1 = spring(220, 34), body2 = spring(190, 38), ratio = spring(300, 40);

  let blobSize = 140, wobbleR = blobSize * 0.35, parallax = PARALLAX;
  let ratioTx = 0, ratioTy = 0, mouseTx = 0, mouseTy = 0, inside = false, activePointer = null;
  const rSat = () => blobSize * 0.6, rHead = () => blobSize * 0.8, rB1 = () => blobSize * 0.6, rB2 = () => blobSize * 0.45;

  const useSvg = mode === 'svg';
  const cursorG = useSvg ? document.createElementNS(NS, 'g') : null;
  const autoG = useSvg ? document.createElementNS(NS, 'g') : null;
  if (cursorG) blobRoot.appendChild(cursorG);
  if (autoG) blobRoot.appendChild(autoG);
  const circle = (parent, r) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', r); c.setAttribute('fill', 'white'); parent.appendChild(c); return c; };
  const set = (c, x, y) => { if (c) { c.setAttribute('cx', x); c.setAttribute('cy', y); } };

  const cSat = cursorG && circle(cursorG, rSat() * CURSOR_SCALE);
  const cHead = cursorG && circle(cursorG, rHead() * CURSOR_SCALE);
  const cB1 = cursorG && circle(cursorG, rB1() * CURSOR_SCALE);
  const cB2 = cursorG && circle(cursorG, rB2() * CURSOR_SCALE);
  const cTemple = cursorG && circle(cursorG, rB2() * 0.72 * CURSOR_SCALE);
  const cJaw = cursorG && circle(cursorG, rB2() * 0.58 * CURSOR_SCALE);

  const autos = [];
  const autoCount = mqDesktop.matches ? AUTO_BLOBS_DESKTOP : AUTO_BLOBS_MOBILE;
  for (let i = 0; i < autoCount; i++) {
    autos.push({
      phaseX: Math.random() * Math.PI * 2, phaseY: Math.random() * Math.PI * 2,
      speedX: 0.0005 + Math.random() * 0.0005, speedY: 0.0003 + Math.random() * 0.0005,
      sat: autoG && circle(autoG, rSat() * AUTO_SCALE),
      mainL: autoG && circle(autoG, rHead() * AUTO_SCALE),
      mainS: autoG && circle(autoG, rB2() * AUTO_SCALE),
    });
  }

  function layout() {
    const s = area.getBoundingClientRect(), r = reveal.getBoundingClientRect();
    const factor = mqDesktop.matches ? 1 : mqTablet.matches ? 0.9 : (s.width < 420 ? 0.78 * 0.92 : 0.78);
    parallax = PARALLAX * (mqDesktop.matches ? 1 : mqTablet.matches ? 0.88 : 0.72);
    blobSize = clamp(BLOB_MIN, BLOB_MAX, Math.min(r.width, r.height) * 0.22) * factor;
    wobbleR = blobSize * 0.35;
    const R = (c, v) => c && c.setAttribute('r', v);
    R(cSat, rSat() * CURSOR_SCALE); R(cHead, rHead() * CURSOR_SCALE); R(cB1, rB1() * CURSOR_SCALE);
    R(cB2, rB2() * CURSOR_SCALE); R(cTemple, rB2() * 0.72 * CURSOR_SCALE); R(cJaw, rB2() * 0.58 * CURSOR_SCALE);
    autos.forEach(b => { R(b.sat, rSat() * AUTO_SCALE); R(b.mainL, rHead() * AUTO_SCALE); R(b.mainS, rB2() * AUTO_SCALE); });
    mouseTx = s.width / 2; mouseTy = s.height / 2;
    head.reset(mouseTx, mouseTy); body1.reset(mouseTx, mouseTy); body2.reset(mouseTx, mouseTy); ratio.reset(0, 0);
    maskEl.setAttribute('width', Math.max(1, Math.ceil(r.width)));
    maskEl.setAttribute('height', Math.max(1, Math.ceil(r.height)));
    lastGrad = '';
  }

  function target(cx, cy) {
    const s = area.getBoundingClientRect();
    inside = cx >= s.left && cx <= s.right && cy >= s.top && cy <= s.bottom;
    if (!inside) { ratioTx = ratioTy = 0; mouseTx = s.width / 2; mouseTy = s.height / 2; return; }
    mouseTx = cx - s.left; mouseTy = cy - s.top;
    ratioTx = (mouseTx / s.width) * 2 - 1; ratioTy = (mouseTy / s.height) * 2 - 1;
  }

  let raf = 0, prev = performance.now(), lastGrad = '', skip = 0, inView = true;
  function tick(t) {
    const dt = Math.min(0.045, Math.max(1 / 240, (t - prev) / 1000)); prev = t;
    if (!inView || document.hidden) { raf = 0; return; }
    const s = area.getBoundingClientRect(), r = reveal.getBoundingClientRect();
    const ox = r.left - s.left, oy = r.top - s.top, cw = s.width, ch = s.height;

    // sem cursor (toque/tablet): a bolha passeia sozinha
    if (!inside && !mqDesktop.matches) {
      const d = t * 0.00045;
      ratioTx = Math.sin(d) * 0.18; ratioTy = Math.cos(d * 1.22) * 0.14;
      mouseTx = cw * (0.5 + Math.sin(d * 1.35) * 0.12); mouseTy = ch * (0.5 + Math.cos(d * 1.08) * 0.1);
    }

    const rs = ratio.step(ratioTx, ratioTy, dt);
    base.style.transform = `translate3d(${(rs.x * parallax).toFixed(2)}px,${(rs.y * parallax).toFixed(2)}px,0)`;
    reveal.style.transform = `translate3d(${(rs.x * parallax * 2).toFixed(2)}px,${(rs.y * parallax * 2).toFixed(2)}px,0)`;

    const h = head.step(mouseTx, mouseTy, dt), b1 = body1.step(mouseTx, mouseTy, dt), b2 = body2.step(mouseTx, mouseTy, dt);
    const w = t * 0.002;
    const L = (x, y) => [x - ox, y - oy];
    const p0 = L(h.x + Math.sin(w) * wobbleR, h.y + Math.cos(w) * wobbleR);
    const p1 = L(h.x, h.y), p2 = L(b1.x, b1.y), p3 = L(b2.x, b2.y);
    const show = inside || !mqDesktop.matches;
    const oScale = mqDesktop.matches ? 1 : mqTablet.matches ? 0.9 : 0.78;
    const offX = blobSize * ORGANIC * oScale, offY = blobSize * ORGANIC * 0.85 * oScale;

    if (cursorG) {
      cursorG.setAttribute('opacity', show ? '1' : '0');
      if (show) {
        set(cSat, ...p0); set(cHead, ...p1); set(cB1, ...p2); set(cB2, ...p3);
        set(cTemple, p1[0] + offX, p1[1] - offY); set(cJaw, p3[0] - offX * 0.6, p3[1] + offY * 0.9);
      }
    }

    const layers = [];
    const push = (rad, x, y) => layers.push(`radial-gradient(circle ${Math.max(8, rad).toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, #000 98%, transparent 100%)`);
    if (mode === 'gradient' && show) {
      push(rSat() * CURSOR_SCALE, ...p0); push(rHead() * CURSOR_SCALE, ...p1); push(rB1() * CURSOR_SCALE, ...p2);
      push(rB2() * CURSOR_SCALE, ...p3); push(rB2() * 0.72 * CURSOR_SCALE, p1[0] + offX, p1[1] - offY);
      push(rB2() * 0.58 * CURSOR_SCALE, p3[0] - offX * 0.6, p3[1] + offY * 0.9);
    }
    const satR = blobSize * (mqDesktop.matches ? 0.35 : mqTablet.matches ? 0.3 : 0.24);
    autos.forEach(b => {
      const mx = ((Math.sin(t * b.speedX + b.phaseX) + 1) / 2) * cw;
      const my = ((Math.cos(t * b.speedY + b.phaseY) + 1) / 2) * ch;
      const ps = L(mx + Math.sin(t * 0.002 + b.phaseX) * satR, my + Math.cos(t * 0.002 + b.phaseY) * satR);
      const pm = L(mx, my);
      if (useSvg) { set(b.sat, ...ps); set(b.mainL, ...pm); set(b.mainS, ...pm); }
      else if (mode === 'gradient' && layers.length < 18) push(rHead() * 0.45, ...pm);
    });

    if (mode === 'gradient') {
      const v = layers.length ? layers.join(',') : 'radial-gradient(circle 0px at 0 0, #000, transparent)';
      if (v !== lastGrad && (!coarse || ++skip % 2 === 0)) { lastGrad = v; setMask(v); }
    } else if (mode === 'clip') {
      reveal.style.clipPath = show ? `circle(${Math.max(36, blobSize * 0.9).toFixed(1)}px at ${p1[0].toFixed(1)}px ${p1[1].toFixed(1)}px)` : 'circle(0px at 50% 50%)';
    }
    raf = requestAnimationFrame(tick);
  }
  const start = () => { if (!raf && inView && !document.hidden) { prev = performance.now(); raf = requestAnimationFrame(tick); } };

  addEventListener('mousemove', e => target(e.clientX, e.clientY), { passive: true });
  area.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') return; activePointer = e.pointerId; target(e.clientX, e.clientY); }, { passive: true });
  area.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || (activePointer !== null && e.pointerId !== activePointer)) return; target(e.clientX, e.clientY); }, { passive: true });
  const up = e => { if (e.pointerType === 'mouse') return; activePointer = null; inside = false; ratioTx = ratioTy = 0; };
  area.addEventListener('pointerup', up, { passive: true });
  area.addEventListener('pointercancel', up, { passive: true });

  let lt;
  const relayout = () => { clearTimeout(lt); lt = setTimeout(layout, 120); };
  addEventListener('resize', relayout);
  if (window.ResizeObserver) new ResizeObserver(relayout).observe(stage);
  if (reveal.complete) layout(); else reveal.addEventListener('load', layout, { once: true });
  layout();

  if (heroSection && window.IntersectionObserver) {
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? start() : (cancelAnimationFrame(raf), raf = 0); }, { rootMargin: '60px 0px' }).observe(heroSection);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  start();
})();
