/* =========================================================
   TECLADO 3D DE SKILLS
   Recriação em Three.js puro do teclado do projeto open-source
   "3d-portfolio" de Naresh Khatri (MIT):
   https://github.com/Naresh-Khatri/3d-portfolio
   Modelos (keycaps.glb, bongo-frames.glb) e sons vêm desse projeto
   — ver assets/keyboard/LICENSE-naresh-khatri.txt.
   As teclas são lidas de PORTFOLIO.keyboard (js/data.js).
   ========================================================= */
(() => {
  'use strict';
  const root = document.getElementById('teclado');
  const SKILLS = (window.PORTFOLIO && window.PORTFOLIO.keyboard) || [];
  if (!root || !SKILLS.length) return;

  const stage = root.querySelector('.kb-stage');
  const canvas = root.querySelector('.kb-canvas');
  const labelEl = root.querySelector('.kb-label');
  const nameEl = root.querySelector('.kb-name');
  const descEl = root.querySelector('.kb-desc');
  const soundBtn = root.querySelector('.kb-sound');

  const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/';
  const DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';
  const COLS = 6;
  // Geometria de keycaps.glb, em unidades de largura de tecla (do projeto original).
  const KIT = { pitch: 1.04468, keyY: 1.21117, keyHeight: 0.7629, logoY: 0.13985, keyTop: 0.13102987408638, cutX: 3.189, cutZ: 2.053, halfW: 3.67448, halfD: 2.57744 };
  const PHYSICAL_ROWS = [[...'1234567890'].map(k => 'Digit' + k), ...['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map(r => [...r].map(k => 'Key' + k))];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touchFirst = matchMedia('(hover: none)').matches;
  const DEFAULT = { name: 'Explore minhas skills', desc: touchFirst ? 'Toque em uma tecla' : 'Passe o mouse, toque ou aperte uma tecla' };
  nameEl.textContent = DEFAULT.name; descEl.textContent = DEFAULT.desc;
  const hintEl = root.querySelector('.kb-hint');
  if (touchFirst && hintEl) hintEl.textContent = 'dica: toque em uma tecla';

  // --- som (liga/desliga lembrado no navegador) ---
  let soundOn = true;
  try { soundOn = localStorage.getItem('kb-sound') !== 'off'; } catch (e) { /* storage indisponível */ }
  const syncSoundBtn = () => {
    soundBtn.setAttribute('aria-pressed', soundOn);
    soundBtn.lastChild.textContent = soundOn ? 'Som ligado' : 'Som desligado';
  };
  syncSoundBtn();
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn; syncSoundBtn();
    try { localStorage.setItem('kb-sound', soundOn ? 'on' : 'off'); } catch (e) { /* ignore */ }
  });

  // --- inicia só quando a seção se aproxima ---
  let started = false;
  const near = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !started) { started = true; near.disconnect(); start().catch(fail); }
  }, { rootMargin: '800px 0px' });
  near.observe(root);

  function fail(err) { console.warn('Teclado 3D indisponível:', err); root.classList.add('is-failed'); }
  function loadScript(src) {
    return new Promise((res, rej) => {
      if (window.KEYBOARD_ASSETS) return res();
      const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Falha ao carregar ' + src));
      document.head.appendChild(s);
    });
  }
  const isTyping = t => t instanceof Element && !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const luminance = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; };
  // tween com GSAP quando disponível; sem ele, aplica o valor final direto
  // busyUntil: enquanto houver tween rodando, a cena é redesenhada; parada, não gasta GPU
  let busyUntil = 0;
  const to = (obj, vars) => {
    busyUntil = Math.max(busyUntil, performance.now() + ((vars.delay || 0) + (vars.duration ?? 0.5)) * 1000 + 60);
    if (window.gsap) return gsap.to(obj, vars);
    Object.keys(vars).forEach(k => { if (k in obj) obj[k] = vars[k]; });
    vars.onComplete && vars.onComplete();
  };
  const later = (s, fn) => (window.gsap ? gsap.delayedCall(s, fn) : setTimeout(fn, s * 1000));

  async function start() {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('WebGL indisponível');
    const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
      import('three'),
      import('three/addons/loaders/GLTFLoader.js'),
      import('three/addons/environments/RoomEnvironment.js'),
      loadScript('js/keyboard-assets.js'),
    ]);
    const A = window.KEYBOARD_ASSETS;

    /* ---------- renderer / cena / câmera ---------- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.75;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.set(-9, 9.6, 9);
    camera.lookAt(0, 0.6, 0);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-6, 8, -3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    Object.assign(keyLight.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 0.5, far: 40 });
    keyLight.shadow.bias = -0.0004; keyLight.shadow.normalBias = 0.02; keyLight.shadow.radius = 4;
    const fill = new THREE.DirectionalLight(0xc8c2ff, 0.55);
    fill.position.set(4, 6, 6);
    const rim = new THREE.DirectionalLight(0x33d6e6, 0.6);
    rim.position.set(6, 3, -8);
    scene.add(keyLight, keyLight.target, fill, rim);

    /* ---------- hierarquia: placement > reveal > spin > layout ---------- */
    const board = new THREE.Group(), reveal = new THREE.Group(), spin = new THREE.Group(), layout = new THREE.Group();
    board.add(reveal); reveal.add(spin); spin.add(layout); scene.add(board);
    // Pose "projetos" do original (a da referência): rotação da seção × rotação da pose.
    const CAT_ORDER = 'XYZ';
    const baseQ = new THREE.Quaternion(), tiltQ = new THREE.Quaternion(), tiltE = new THREE.Euler();
    function setPose() {
      const mobile = innerWidth < 768;
      const qs = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.119863065, 0.007200782, 0.119863065));
      const qr = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, mobile ? -Math.PI / 6 : -Math.PI / 12, 0));
      const ql = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, Math.PI / 3, Math.PI));
      baseQ.copy(qs).multiply(qr).multiply(ql);
    }
    setPose();
    const cols = Math.min(COLS, SKILLS.length), rows = Math.ceil(SKILLS.length / cols);
    const innerX = KIT.cutX + (cols - 6) * KIT.pitch / 2;
    const innerZ = KIT.cutZ + (rows - 4) * KIT.pitch / 2;
    const span = innerX + innerZ + KIT.halfW - KIT.cutX + KIT.halfD - KIT.cutZ;
    const fit = Math.min(1.2, (KIT.halfW + KIT.halfD) / span);
    layout.position.y = -((KIT.keyY + KIT.keyTop) / 2) * fit;
    layout.scale.setScalar(fit);

    const loader = new GLTFLoader();
    const [kc, bongo] = await Promise.all([loader.loadAsync(A.keycaps), loader.loadAsync(A.bongo)]);

    /* ---------- gabinete (9-slice: estica o meio para qualquer grade) ---------- */
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x1b1c20, roughness: 0.6, metalness: 0.05 });
    let capGeo = null;
    const meshes = [];
    kc.scene.traverse(o => { if (o.isMesh) meshes.push(o); });
    meshes.forEach(o => {
      if (/^keycap/i.test(o.name)) { capGeo = o.geometry; return; }
      const m = /^case[ _]?(\d)(\d)$/i.exec(o.name);
      if (!m) return;
      const ix = +m[1], iz = +m[2];
      const piece = new THREE.Mesh(o.geometry, caseMat);
      piece.castShadow = piece.receiveShadow = true;
      if (ix === 1) piece.scale.x = innerX / KIT.cutX; else piece.position.x = (ix === 0 ? -1 : 1) * (innerX - KIT.cutX);
      if (iz === 1) piece.scale.z = innerZ / KIT.cutZ; else piece.position.z = (iz === 0 ? -1 : 1) * (innerZ - KIT.cutZ);
      layout.add(piece);
    });
    if (!capGeo) throw new Error('keycap não encontrado no modelo');

    // sombra no "chão"
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.35 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.002; ground.receiveShadow = true;
    layout.add(ground);

    /* ---------- teclas ---------- */
    const shortcut = i => PHYSICAL_ROWS[PHYSICAL_ROWS.length - rows + Math.floor(i / cols)]?.[i % cols];
    const logoGeo = new THREE.PlaneGeometry(0.52, 0.52);
    const keys = SKILLS.map((s, i) => {
      const slot = new THREE.Group();
      slot.position.set((i % cols - (cols - 1) / 2) * KIT.pitch, KIT.keyY, (Math.floor(i / cols) - (rows - 1) / 2) * KIT.pitch);
      const motion = new THREE.Group(); slot.add(motion);
      const color = new THREE.Color(s.color);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0, emissive: color.clone(), emissiveIntensity: 0 });
      const cap = new THREE.Mesh(capGeo, mat); cap.castShadow = cap.receiveShadow = true;
      motion.add(cap);
      const logoMat = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 });
      const logo = new THREE.Mesh(logoGeo, logoMat);
      logo.rotation.x = -Math.PI / 2; logo.position.y = KIT.logoY; logo.receiveShadow = true;
      cap.add(logo);
      layout.add(slot);
      const k = { s, i, cap, motion, mat, logoMat, code: shortcut(i), held: new Set(), press: { y: 0 }, drop: { y: 0 }, glow: { v: 0 } };
      cap.userData.key = k; logo.userData.key = k;
      return k;
    });

    // logos desenhados em canvas (cor do ícone escolhida pelo contraste com a tecla)
    async function iconTexture(spec, bg) {
      const size = 256, cv = document.createElement('canvas'); cv.width = cv.height = size;
      const ctx = cv.getContext('2d');
      const ink = luminance(bg) > 0.62 ? '#111114' : '#ffffff';
      const [type, ...rest] = spec.split(':'); const val = rest.join(':');
      if (type === 't') {
        if (document.fonts) await document.fonts.load('800 100px Syne').catch(() => {});
        ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = `800 ${val.length > 3 ? 72 : 96}px Syne, "Arial Black", sans-serif`;
        ctx.fillText(val, size / 2, size / 2 + 6);
      } else {
        let svg = await (await fetch((type === 's' ? SI : DEV) + val + '.svg')).text();
        if (type === 's') svg = svg.replace('<svg ', `<svg fill="${ink}" `);
        if (!/<svg[^>]*\swidth=/.test(svg)) svg = svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
        const img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        await img.decode();
        const pad = size * 0.08;
        ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
      }
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    }
    keys.forEach(k => iconTexture(k.s.icon || 't:' + k.s.name.slice(0, 3), k.s.color)
      .then(tex => { k.logoMat.map = tex; k.logoMat.needsUpdate = true; to(k.logoMat, { opacity: 1, duration: 0.4 }); })
      .catch(() => iconTexture('t:' + k.s.name.slice(0, 3).toUpperCase(), k.s.color).then(tex => { k.logoMat.map = tex; k.logoMat.opacity = 1; k.logoMat.needsUpdate = true; busyUntil = performance.now() + 100; })));

    /* ---------- gatinho (2 frames, troca a cada tecla) ---------- */
    // Posição/rotação originais do gato (pose "projetos" do projeto de referência):
    // ele fica em perspectiva atrás da borda do teclado, com as teclas da frente na frente dele.
    const outerZ = innerZ + KIT.halfD - KIT.cutZ;
    const CAT_W = 5.336, CAT_H = CAT_W * 289 / 457;
    const cat = new THREE.Group();
    cat.position.set(-0.277, 2.356, outerZ - 0.631);
    cat.rotation.set(...[-141.199253, -1.535221, -167.469916].map(d => d * Math.PI / 180), CAT_ORDER);
    layout.add(cat);
    const frames = [];
    bongo.scene.traverse(o => { if (o.isMesh) frames.push(o); });
    frames.sort((a, b) => a.name.localeCompare(b.name));
    frames.forEach((m, f) => {
      m.removeFromParent();
      m.position.set(0, -CAT_H / 2, 0);
      m.rotation.set(0, 0, 0);
      m.scale.set(CAT_W, CAT_H, 1);
      m.visible = f === 0;
      cat.add(m);
    });
    // como no original: o gato "batuca" sem parar, trocando de frame a cada 0,2 s;
    // cada tecla pressionada força a troca na hora
    const CAT_STEP = 200;
    let catFrame = 0, catSwap = 0;
    const showFrame = f => { catFrame = f; frames.forEach((m, i) => (m.visible = i === f)); };
    const nextFrame = now => { showFrame((catFrame + 1) % frames.length); catSwap = now; };
    function bongoTap() {
      nextFrame(performance.now());
    }

    /* ---------- som ---------- */
    let audio = null; const buffers = {};
    async function initAudio() {
      if (audio || !window.AudioContext) return;
      audio = new AudioContext();
      await Promise.all(['press', 'release'].map(async n => {
        const ab = await (await fetch(A[n])).arrayBuffer();
        buffers[n] = await audio.decodeAudioData(ab);
      })).catch(() => {});
    }
    const unlock = () => { initAudio().then(() => audio && audio.state === 'suspended' && audio.resume().catch(() => {})); };
    addEventListener('pointerdown', unlock, { capture: true, passive: true });
    addEventListener('keydown', unlock, { capture: true });
    function play(down) {
      if (!soundOn || !audio || audio.state !== 'running') return;
      const b = buffers[down ? 'press' : 'release']; if (!b) return;
      const src = audio.createBufferSource(), gain = audio.createGain();
      src.buffer = b; gain.gain.value = 0.4;
      src.connect(gain).connect(audio.destination);
      src.onended = () => { src.disconnect(); gain.disconnect(); };
      src.start();
    }

    /* ---------- entrada (várias fontes podem segurar a mesma tecla) ---------- */
    const heldBy = new Map(); const stack = [];
    let lastUser = performance.now(), catPlaying = false;
    function press(source, k) {
      if (!k || heldBy.get(source) === k) return;
      release(source);
      heldBy.set(source, k);
      const first = k.held.size === 0;
      k.held.add(source);
      if (first) change(k, true, source);
    }
    function release(source) {
      const k = heldBy.get(source); if (!k) return;
      heldBy.delete(source); k.held.delete(source);
      if (k.held.size === 0) change(k, false, source);
    }
    const releaseAll = () => [...heldBy.keys()].forEach(release);
    // posição/brilho de repouso: levemente erguida e acesa quando o mouse está em cima
    const restY = k => (k === hovered ? 0.09 : 0);
    const restGlow = k => (k === hovered ? 0.28 : 0);
    function showSkill(k) {
      if (nameEl.textContent === k.s.name) return;
      nameEl.textContent = k.s.name; descEl.textContent = k.s.desc;
      labelEl.classList.remove('is-pop'); void labelEl.offsetWidth; labelEl.classList.add('is-pop');
    }
    function change(k, down, source) {
      to(k.press, { y: down ? -KIT.keyHeight * 0.6 : restY(k), duration: down ? 0.08 : 0.16, ease: 'power2.out', overwrite: true });
      to(k.glow, { v: down ? 0.75 : restGlow(k), duration: down ? 0.06 : 0.3, overwrite: true });
      const at = stack.indexOf(k); if (at >= 0) stack.splice(at, 1);
      if (down) { stack.push(k); showSkill(k); bongoTap(); }
      if (source !== 'cat' && source !== 'hover-out') play(down);
      // o rótulo continua mostrando a última tecnologia escolhida
    }
    let hovered = null;
    function setHover(k) {
      if (k === hovered) return;
      const prev = hovered; hovered = k;
      if (prev && prev.held.size === 0) change(prev, false, 'hover-out');
      if (k && k.held.size === 0) {
        to(k.press, { y: restY(k), duration: 0.18, ease: 'power2.out', overwrite: true });
        to(k.glow, { v: restGlow(k), duration: 0.2, overwrite: true });
        showSkill(k);
      }
    }
    const userActive = () => { lastUser = performance.now(); if (catPlaying) stopCat(); };

    // raycast
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), caps = keys.map(k => k.cap);
    function pick(e) {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(caps, true)[0];
      return hit ? hit.object.userData.key || null : null;
    }
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.22;
      tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.1;
      if (e.pointerType !== 'mouse') return;
      const k = pick(e);
      if (k) userActive();
      setHover(k);
      canvas.style.cursor = k ? 'pointer' : 'default';
    });
    canvas.addEventListener('pointerleave', () => { setHover(null); tilt.tx = tilt.ty = 0; });
    canvas.addEventListener('pointerdown', e => {
      const k = pick(e);
      if (!k) return;
      e.preventDefault(); // evita seleção de texto/arraste que "engole" o clique
      userActive(); press('p' + e.pointerId, k);
    });
    addEventListener('pointerup', e => release('p' + e.pointerId));
    addEventListener('pointercancel', e => release('p' + e.pointerId));

    const byCode = new Map(keys.filter(k => k.code).map(k => [k.code, k]));
    addEventListener('keydown', e => {
      if (!inView() || e.repeat || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      const k = byCode.get(e.code);
      if (k) { userActive(); press('key:' + e.code, k); }
    });
    addEventListener('keyup', e => release('key:' + e.code));
    addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });

    /* ---------- o gatinho toca sozinho quando ninguém está mexendo ---------- */
    let catTimers = [];
    function stopCat() { catPlaying = false; catTimers.forEach(clearTimeout); catTimers = []; release('cat'); }
    function catSolo() {
      catPlaying = true;
      const notes = 4 + Math.floor(Math.random() * 3);
      for (let n = 0; n < notes; n++) {
        catTimers.push(setTimeout(() => press('cat', keys[Math.floor(Math.random() * keys.length)]), n * 300));
        catTimers.push(setTimeout(() => release('cat'), n * 300 + 150));
      }
      catTimers.push(setTimeout(() => { catPlaying = false; lastUser = performance.now() - 2000; }, notes * 300 + 100));
    }

    /* ---------- enquadramento ortográfico ---------- */
    let needsRender = true;
    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
      needsRender = true;
      setPose();
      renderer.setSize(w, h, false);
      const aspect = w / h;
      let halfH = 5.1, halfW = halfH * aspect;
      const minHalfW = aspect < 1 ? 5.0 : 5.6;
      if (halfW < minHalfW) { halfW = minHalfW; halfH = halfW / aspect; }
      // espaço em cima para o gatinho e embaixo para o rótulo
      camera.left = -halfW; camera.right = halfW;
      camera.top = halfH * 0.94; camera.bottom = -halfH * 1.06;
      camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(stage);
    resize();

    /* ---------- visibilidade + entrada animada ---------- */
    let visible = false, revealed = false;
    // checagem direta da posição (robusta mesmo com a seção "pinada" pelo ScrollTrigger)
    const inView = () => { const r = stage.getBoundingClientRect(); return r.bottom > innerHeight * 0.2 && r.top < innerHeight * 0.8; };
    const revealS = { v: reduce ? 1 : 0.001 };
    reveal.scale.setScalar(revealS.v);
    if (!reduce) keys.forEach(k => { k.drop.y = 150 / 296.741333; k.motion.visible = false; });
    function doReveal() {
      if (revealed) return; revealed = true;
      if (reduce) return;
      to(revealS, { v: 1, duration: 1.5, ease: 'elastic.out(1,0.6)' });
      keys.forEach((k, i) => {
        later(0.9 + i * 0.07, () => { k.motion.visible = true; });
        to(k.drop, { y: 0, delay: 1 + i * 0.07, duration: 0.5, ease: 'bounce.out' });
      });
    }
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) { releaseAll(); stopCat(); setHover(null); }
      if (e.intersectionRatio > 0.3) doReveal();
    }, { threshold: [0, 0.3] }).observe(stage);

    /* ---------- loop ---------- */
    // Só redesenha quando algo muda (tween, inclinação do mouse, frame do gato, resize).
    let firstFrame = true;
    function frame() {
      requestAnimationFrame(frame);
      if ((!visible && !firstFrame && !inView()) || document.hidden) return;
      const now = performance.now();
      let dirty = firstFrame || needsRender || now < busyUntil;
      const dx = tilt.tx - tilt.x, dy = tilt.ty - tilt.y;
      if (Math.abs(dx) + Math.abs(dy) > 1e-4) { tilt.x += dx * 0.08; tilt.y += dy * 0.08; dirty = true; }
      if (!reduce && now - catSwap >= CAT_STEP) { nextFrame(now); dirty = true; }
      if (!reduce && revealed && visible && !catPlaying && now - lastUser > 6000) catSolo();
      if (!dirty) return;
      needsRender = false;
      tiltQ.setFromEuler(tiltE.set(tilt.x, tilt.y, 0));
      board.quaternion.multiplyQuaternions(tiltQ, baseQ);
      reveal.scale.setScalar(revealS.v);
      for (const k of keys) {
        k.motion.position.y = k.drop.y;
        k.cap.position.y = k.press.y;
        k.mat.emissiveIntensity = k.glow.v;
      }
      renderer.render(scene, camera);
      if (firstFrame) { firstFrame = false; root.classList.add('is-ready'); }
    }
    frame();
  }
})();
