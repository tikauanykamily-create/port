/* =========================================================
   KAUANY KAMILY — PORTFÓLIO · main.js
   1. Helpers   2. Render (a partir de data.js)   3. UI
   4. Animações (GSAP + ScrollTrigger + Lenis)
   ========================================================= */
(() => {
  'use strict';
  const D = window.PORTFOLIO;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const pad = n => String(n).padStart(2, '0');
  const DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';
  const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  let lenis = null;

  function icon(spec) {
    if (!spec) return '';
    const [t, a, c] = spec.split(':');
    if (t === 'd') return `<span class="ico"><img src="${DEV}${a}.svg" alt="" width="22" height="22" loading="lazy"></span>`;
    return `<span class="ico"><i style="--src:url(${SI}${a}.svg);--c:${c || '#000'}"></i></span>`;
  }
  const extLink = (href, label, cls = 'btn btn-ghost') =>
    `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener" data-magnetic><span>${esc(label)}</span><span aria-hidden="true">↗</span></a>`;

  /* =========================================================
     2. RENDER
     ========================================================= */
  const P = D.profile;
  $$('[data-loc]').forEach(el => (el.textContent = P.location));
  $$('[data-github]').forEach(el => (el.href = P.github));
  $$('[data-linkedin]').forEach(el => { if (P.linkedin) { el.href = P.linkedin; el.hidden = false; } else el.remove(); });
  $$('[data-behance]').forEach(el => { if (P.behance) { el.href = P.behance; el.hidden = false; } else el.remove(); });
  $$('[data-email]').forEach(el => { if (P.email) { el.href = 'mailto:' + P.email; el.hidden = false; } else el.remove(); });
  $('#year').textContent = new Date().getFullYear();

  $('.hero-roles').innerHTML = P.roles.map((r, i) => `<li><span><small>${pad(i + 1)}</small>${esc(r)}</span></li>`).join('');

  // currículo: só aparece se o arquivo existir (verificação funciona com o site publicado / servidor local)
  const cvBtn = $('[data-cv]');
  if (P.cv && /^https?:/.test(location.protocol + '')) {
    fetch(P.cv, { method: 'HEAD' }).then(r => {
      if (r.ok && !(r.headers.get('content-type') || '').includes('text/html')) { cvBtn.href = P.cv; cvBtn.hidden = false; }
    }).catch(() => {});
  }

  // ticker
  const star = '<svg class="tk-star" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"/></svg>';
  $('#focusTrack').innerHTML = D.focus.map(f => `<span class="tk"><span class="tk-t">${esc(f)}</span>${star}</span>`).join('');

  // timeline
  $('#timeline').innerHTML = D.experience.map((e, i) => `
    <li class="tl-item">
      <div>
        <span class="tl-idx mono">${pad(i + 1)} / ${pad(D.experience.length)}</span>
        <h3 class="tl-company">${esc(e.company)}</h3>
        <p class="tl-role">${esc(e.role)}</p>
        <span class="tl-tag mono">${esc(e.tag)}</span>
      </div>
      <div>
        <p class="tl-summary">${esc(e.summary)}</p>
        ${e.points.length ? `<ul class="tl-points">${e.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        ${e.systems ? `<div class="tl-systems"><span class="mono">Sistemas desenvolvidos</span><ul>${e.systems.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
        ${e.link ? `<a class="tl-link ulink" href="${esc(e.link.href)}" target="_blank" rel="noopener">${esc(e.link.label)} ↗</a>` : ''}
      </div>
    </li>`).join('');

  // stack (abas no desktop, lista completa no mobile)
  $('#stackTabs').innerHTML = D.stack.map((c, i) =>
    `<button class="stack-tab" role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="mono">${pad(i + 1)}</span>${esc(c.title)}</button>`).join('');
  $('#stackPanels').innerHTML = D.stack.map((c, i) => {
    const withIcon = c.items.filter(x => x[1]), plain = c.items.filter(x => !x[1]);
    return `<div class="stack-panel${i === 0 ? ' is-active' : ''}" role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}">
      <h3><span class="mono">${pad(i + 1)}</span>${esc(c.title)}</h3>
      <p class="stack-desc">${esc(c.desc)}</p>
      ${withIcon.length ? `<ul class="chips">${withIcon.map(([n, s]) => `<li class="chip">${icon(s)}${esc(n)}</li>`).join('')}</ul>` : ''}
      ${plain.length ? `<ul class="concepts">${plain.map(([n]) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }).join('');

  // print do site real dentro de uma "janela de navegador" (campo shot em data.js)
  const shotMock = p => `<div class="mock mock-shot" aria-hidden="true"><img src="${esc(p.shot)}" alt="" width="1200" height="750" loading="lazy" decoding="async"></div>`;
  const visual = p => (p.shot ? shotMock(p) : MOCKS[p.id] ? MOCKS[p.id]() : '');
  // mocks visuais dos projetos (ilustrações autorais em HTML/CSS)
  const MOCKS = {
  };

  $('#cards').innerHTML = D.projects.map((p, i) => `
    <article class="card" style="--i:${i};--acc:${p.accent}" data-id="${p.id}" data-cursor="Abrir">
      <div class="card-info">
        <div class="card-top"><span class="card-n">${pad(i + 1)}</span><span class="badge mono">${esc(p.badge)}</span></div>
        <p class="card-kind mono">${esc(p.kind)}</p>
        <h3 class="card-name">${esc(p.name)}</h3>
        <p class="card-tagline">${esc(p.tagline)}</p>
        <ul class="card-stack" aria-label="Tecnologias">${p.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="card-actions">
          <button class="btn btn-acc" type="button" data-case="${p.id}" data-magnetic><span>Ver estudo de caso</span><span aria-hidden="true">→</span></button>
          ${p.links.map(l => extLink(l.href, l.label)).join('')}
        </div>
        ${p.note ? `<p class="card-note">${esc(p.note)}</p>` : ''}
      </div>
      ${visual(p)}
      <i class="card-dim" aria-hidden="true"></i>
    </article>`).join('');

  // galeria "Sistemas desenvolvidos para a Bioma" + lightbox
  const sysGrid = $('#sysGrid');
  if (sysGrid && D.biomaSystems) {
    sysGrid.innerHTML = D.biomaSystems.map((s, i) => `
      <li class="sys-item"><button type="button" data-sys="${i}" aria-label="Ver resumo do ${esc(s.name)}">
        <span class="sys-img"><img src="${esc(s.img)}" alt="Tela do ${esc(s.name)}, sistema desenvolvido para a Bioma Soluções" width="${s.w}" height="${s.h}" loading="lazy" decoding="async"></span>
        <span class="sys-cap"><strong>${esc(s.name)}</strong><span class="sys-more mono">Ver resumo +</span></span>
      </button></li>`).join('');
    const lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('.lb-cap', lb), lbName = $('.lb-name', lb), lbSum = $('.lb-sum', lb);
    sysGrid.addEventListener('click', e => {
      const b = e.target.closest('[data-sys]'); if (!b) return;
      const s = D.biomaSystems[+b.dataset.sys];
      lbImg.src = s.img; lbImg.alt = `Tela do ${s.name}`;
      lbCap.textContent = `${s.type} · Bioma Soluções`; lbName.textContent = s.name; lbSum.textContent = s.summary || '';
      lb.showModal(); lb.scrollTop = 0; lenis && lenis.stop();
    });
    lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.case-close')) lb.close(); });
    lb.addEventListener('close', () => { lenis && lenis.start(); });
  }

  // Ominy no Instagram: perfil + grade estilo feed (cada post abre no Instagram)
  const IG = D.ominyInstagram, igCard = $('#igCard');
  if (IG && igCard) {
    const ICON_GRID = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>';
    const ICON_REEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 8h19M9 2.5 12 8M15 2.5 18 8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M10 11v6l5-3z" fill="currentColor"/></svg>';
    $$('[data-ig-profile]').forEach(a => (a.href = IG.url));
    igCard.innerHTML = `
      <div class="ig-top">
        <a class="ig-avatar" href="${esc(IG.url)}" target="_blank" rel="noopener" aria-label="Perfil @${esc(IG.handle)} no Instagram"><img src="${esc(IG.avatar)}" alt="" width="160" height="160" loading="lazy"></a>
        <div class="ig-info">
          <div class="ig-row"><span class="ig-handle">${esc(IG.handle)}</span><a class="ig-follow" href="${esc(IG.url)}" target="_blank" rel="noopener">Seguir</a></div>
          <span class="ig-name">${esc(IG.name)}</span>
          <p class="ig-bio">${esc(IG.bio)}</p>
        </div>
      </div>
      <div class="ig-tabs"><span>${ICON_GRID}Publicações</span></div>
      <div class="ig-grid">${IG.posts.map(p => `
        <a class="ig-post" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="${p.type === 'reel' ? 'Reel' : 'Publicação'}: ${esc(p.title)} — abrir no Instagram">
          <img src="${esc(p.img)}" alt="" width="640" height="640" loading="lazy" decoding="async">
          ${p.type === 'reel' ? `<span class="ig-type">${ICON_REEL}</span>` : ''}
          <span class="ig-over"><strong>${esc(p.title)}</strong><span>${esc(p.caption)}</span></span>
        </a>`).join('')}</div>`;
  }

  $('#moreList').innerHTML = D.more.map(m => `
    <li class="more-row">
      <span class="more-name">${esc(m.name)}</span>
      <span class="more-type">${esc(m.type)}</span>
      <span class="more-links">
        ${m.site ? `<a href="${esc(m.site)}" target="_blank" rel="noopener" aria-label="Site de ${esc(m.name)}">Site ↗</a>` : ''}
        ${m.repo ? `<a href="${esc(m.repo)}" target="_blank" rel="noopener" aria-label="Código de ${esc(m.name)}">Código ↗</a>` : ''}
      </span>
    </li>`).join('');

  $('#eduList').innerHTML = D.education.map((e, i) => `
    <li class="edu-item">
      <span class="edu-n">${pad(i + 1)}</span>
      <div><h3 class="edu-course">${esc(e.course)}</h3><p class="edu-inst">${esc(e.institution || 'Graduação')}${e.detail ? ` <span>· ${esc(e.detail)}</span>` : ''}</p></div>
      <span class="edu-status mono">${esc(e.status)}</span>
    </li>`).join('');

  const certList = $('#certList');
  if (certList && D.certifications) certList.innerHTML = D.certifications.map(c => `<li><span>${esc(c.name)}</span><small class="mono">${esc(c.org)}</small></li>`).join('');

  const contacts = [
    P.email && ['E-mail', P.email, 'mailto:' + P.email, false],
    ['GitHub', P.github.replace(/^https?:\/\//, ''), P.github, true],
    P.behance && ['Behance', P.behance.replace(/^https?:\/\/(www\.)?/, ''), P.behance, true],
    P.linkedin && ['LinkedIn', P.linkedin.replace(/^https?:\/\/(www\.)?/, ''), P.linkedin, true],
    ['Empresa', 'ominydesenvolvimentos.com', 'https://ominydesenvolvimentos.com', true],
  ].filter(Boolean);
  $('#contactLinks').innerHTML = contacts.map(([k, v, href, ext]) =>
    `<li><a href="${esc(href)}" ${ext ? 'target="_blank" rel="noopener"' : ''}><span class="mono">${k}</span><strong>${esc(v)}</strong><span class="arr" aria-hidden="true">↗</span></a></li>`).join('');

  // marquee: duplica conteúdo para loop infinito
  $$('.marquee .track').forEach(tr => {
    const clone = tr.innerHTML; tr.insertAdjacentHTML('beforeend', clone);
    [...tr.children].slice(tr.children.length / 2).forEach(n => n.setAttribute('aria-hidden', 'true'));
  });

  // split helpers
  function splitChars(el) {
    const text = el.textContent.trim();
    if (!el.hasAttribute('aria-label') && !el.closest('[aria-hidden="true"]')) el.setAttribute('aria-label', text);
    el.innerHTML = [...text].map(ch => ch === ' ' ? '<span class="sp"> </span>' : `<span class="ch" data-c="${esc(ch)}" aria-hidden="true">${esc(ch)}</span>`).join('');
    return $$('.ch', el);
  }
  function splitWords(el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' ');
    return $$('.w', el);
  }
  const heroChars = splitChars($('.hero-title .line'));
  const fillTitles = $$('[data-fill]').map(t => ({ t, chars: splitChars(t) }));
  const words = splitWords($('.reveal-words'));

  function fitTitle() {
    const stage = $('.hero-stage'), t = $('.hero-title');
    stage.style.setProperty('--fs', '100px');
    const fs = Math.min(100 * stage.clientWidth / t.offsetWidth * .98, 420);
    stage.style.setProperty('--fs', fs + 'px');
    // títulos de seção: ocupam a largura disponível sem quebrar a palavra
    $$('.stroke-title').forEach(el => {
      el.style.fontSize = '100px';
      const w = el.scrollWidth, avail = el.parentElement.clientWidth;
      el.style.fontSize = Math.min(100 * avail / w * .98, innerWidth * .12, 170) + 'px';
    });
  }
  fitTitle();

  /* animações CSS só rodam quando o bloco está visível */
  const pauser = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('anim-paused', !e.isIntersecting)), { rootMargin: '100px 0px' });
  $$('.mock, .hero, .about, .contact, .footer, .edu-list, .kb').forEach(el => pauser.observe(el));

  /* =========================================================
     3. UI
     ========================================================= */
  // stack tabs
  const tabs = $$('.stack-tab'), panels = $$('.stack-panel');
  function setTab(i, focus) {
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
    panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
    if (focus) tabs[i].focus();
    if (hasGsap && !reduce) {
      gsap.fromTo($$('.stack-desc, .chip, .concepts li', panels[i]), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .035, duration: .6, ease: 'power3.out', overwrite: true });
    }
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => setTab(i));
    if (fine) t.addEventListener('mouseenter', () => { if (t.getAttribute('aria-selected') !== 'true') setTab(i); });
    t.addEventListener('keydown', e => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); setTab((i + k + tabs.length) % tabs.length, true); }
      if (e.key === 'Home') { e.preventDefault(); setTab(0, true); }
      if (e.key === 'End') { e.preventDefault(); setTab(tabs.length - 1, true); }
    });
  });

  // ominy tabs cycle

  // case study dialog
  const dlg = $('#caseDialog'), body = $('#caseBody');
  let lastFocus = null;
  function openCase(id) {
    const p = D.projects.find(x => x.id === id); if (!p) return;
    lastFocus = document.activeElement;
    dlg.style.setProperty('--acc', p.accent);
    body.innerHTML = `
      <header class="case-hero">
        <p class="mono">${esc(p.kind)}</p>
        <h2 id="caseTitle">${esc(p.name)}</h2>
        <p>${esc(p.tagline)}</p>
        ${visual(p)}
      </header>
      <div class="case-grid">
        <div><h3>Problema</h3><p>${esc(p.problem)}</p></div>
        <div><h3>Solução</h3><p>${esc(p.solution)}</p></div>
        <div><h3>Minha participação</h3><p>${esc(p.role)}</p></div>
      </div>
      <section class="case-sec"><h3>${p.id === 'ominy' ? 'Produtos e frentes' : 'O que foi desenvolvido'}</h3><ul class="case-feats">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></section>
      <section class="case-sec"><h3>Tecnologias e foco</h3><ul class="card-stack">${p.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>
      <section class="case-sec case-links">${p.links.map(l => extLink(l.href, l.label, 'btn btn-acc')).join('')}${p.note ? `<span class="card-note">${esc(p.note)}</span>` : ''}
        <button class="btn btn-ghost" type="button" data-close><span>Voltar aos projetos</span></button></section>`;
    dlg.showModal();
    dlg.scrollTop = 0;
    lenis && lenis.stop();
    $('.case-close', dlg).focus();
  }
  dlg.addEventListener('close', () => { lenis && lenis.start(); lastFocus && lastFocus.focus({ preventScroll: true }); });
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.case-close,[data-close]')) dlg.close(); });
  $('#cards').addEventListener('click', e => {
    const b = e.target.closest('[data-case]');
    if (b) return openCase(b.dataset.case);
    const card = e.target.closest('.card');
    if (card && !e.target.closest('a,button')) openCase(card.dataset.id);
  });

  // mobile menu
  const menuBtn = $('.menu-btn'), mm = $('#mobileMenu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mm.setAttribute('aria-hidden', !open);
    open ? lenis && lenis.stop() : lenis && lenis.start();
    if (open && hasGsap) gsap.fromTo($$('nav a', mm), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .05, duration: .7, delay: .15, ease: 'expo.out' });
  }
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false); });

  // smooth anchor links
  function goTo(id) {
    const t = $(id); if (!t) return;
    lenis ? lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('[data-link]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (!id || !id.startsWith('#')) return;
    e.preventDefault();
    if (document.body.classList.contains('menu-open')) { setMenu(false); setTimeout(() => goTo(id), 350); } else goTo(id);
  }));

  // nav state + active section
  const nav = $('.nav');
  const navLinks = $$('.nav-links a');
  const secIds = ['sobre', 'formacao', 'experiencia', 'stack', 'projetos', 'contato'];
  let lastY = 0;
  function onScroll(y) {
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 700 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }
  let curSec = '';
  function setActive(id) {
    if (id === curSec) return; curSec = id;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
  }

  // custom cursor
  if (fine && !reduce) {
    const cur = $('.cursor'), dot = $('.c-dot'), ring = $('.c-ring'), label = $('.c-ring span');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
    let raf = null;
    const loop = () => {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      raf = Math.abs(mx - rx) + Math.abs(my - ry) > .3 ? requestAnimationFrame(loop) : null;
    };
    addEventListener('pointermove', () => { if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const lab = e.target.closest('[data-cursor]'), act = e.target.closest('a,button,[role="tab"]');
      cur.classList.toggle('is-label', !!lab && !act);
      cur.classList.toggle('is-hover', !!act);
      if (lab) label.textContent = lab.dataset.cursor;
    });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-hover', 'is-label'));
  }

  // máscara líquida do retrato: ver js/hero-mask.js

  /* =========================================================
     5. ANIMAÇÕES
     ========================================================= */
  const progress = $('.progress i');
  if (!hasGsap) {
    document.documentElement.classList.remove('js');
    addEventListener('scroll', () => { onScroll(scrollY); progress.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight)})`; }, { passive: true });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const setProgress = gsap.quickSetter(progress, 'scaleX');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { setProgress(s.progress); onScroll(s.scroll()); } });
  secIds.forEach(id => ScrollTrigger.create({ trigger: '#' + id, start: 'top 45%', end: 'bottom 45%', onToggle: s => s.isActive && setActive(id), onLeaveBack: () => id === secIds[0] && setActive('') }));

  /* painéis que deslizam sobre a seção anterior */
  $$('[data-cover]').map(sec => ({ sec, next: sec.nextElementSibling })).forEach(({ sec, next }) => {
    if (!next) return;
    const dist = () => Math.min(next.offsetHeight, innerHeight);
    ScrollTrigger.create({ trigger: sec, start: 'bottom bottom', end: () => '+=' + dist(), pin: true, pinSpacing: false, invalidateOnRefresh: true });
    gsap.to(sec.querySelector('.cover-inner'), { scale: .92, opacity: .3, ease: 'none', scrollTrigger: { trigger: sec, start: 'bottom bottom', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true } });
  });

  /* HOME — intro */
  gsap.set('.hero-stage', { visibility: 'visible' });
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.nav > *', { y: -30, opacity: 0, stagger: .06, duration: 1 }, 0)
    .from(heroChars, { yPercent: 110, duration: 1.4, stagger: .06 }, .15)
    .from('.photo-pop', { yPercent: 18, opacity: 0, scale: .92, duration: 1.6 }, .5)
    .from('.hero-roles li > span', { yPercent: 110, stagger: .08, duration: 1.1 }, .9)
    .from('.hero-actions > *:not([hidden])', { y: 30, opacity: 0, stagger: .08, duration: 1 }, 1)
    .from(['.hero-loc', '.hero-scroll'], { opacity: 0, duration: 1 }, 1.2);

  /* HOME — parallax ao rolar */
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-title', { yPercent: -55, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero-photo', { y: () => innerHeight * .2, ease: 'none', scrollTrigger: { ...heroST, invalidateOnRefresh: true } });
  gsap.to(['.hero-roles', '.hero-actions'], { y: -70, opacity: 0, ease: 'none', scrollTrigger: { ...heroST, end: '55% top' } });

  /* marquee reativo à velocidade da rolagem */
  const marquees = $$('.marquee').map(m => {
    const tr = $('.track', m), dir = +m.dataset.dir || -1, dur = +m.dataset.dur || 40;
    return dir < 0 ? gsap.to(tr, { xPercent: -50, duration: dur, ease: 'none', repeat: -1 })
      : gsap.fromTo(tr, { xPercent: -50 }, { xPercent: 0, duration: dur, ease: 'none', repeat: -1 });
  });
  const skew = gsap.quickSetter('.ticker .marquee', 'skewX', 'deg');
  let ts = 1, sk = 0, lastTs = 1;
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : 0;
    ts += ((reduce ? .3 : 1) + Math.min(Math.abs(v) * .12, 5) - ts) * .08;
    if (Math.abs(ts - lastTs) > .005) { marquees.forEach(m => m.timeScale(ts)); lastTs = ts; }
    const nsk = sk + (gsap.utils.clamp(-6, 6, -v * .2) - sk) * .1;
    if (Math.abs(nsk - sk) > .01 || (sk !== 0 && Math.abs(nsk) < .01)) { sk = Math.abs(nsk) < .01 ? 0 : nsk; skew(sk); }
  });
  ScrollTrigger.create({ trigger: '.ticker', start: 'top bottom', end: 'bottom top', onToggle: s => marquees.forEach(m => s.isActive ? m.play() : m.pause()) });
  gsap.from('.ticker .marquee', { y: 80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.ticker', start: 'top bottom', end: 'top 60%', scrub: true } });

  /* títulos: contorno → preenchimento */
  fillTitles.forEach(({ t, chars }) => {
    gsap.fromTo(chars, { '--f': 0, yPercent: 25 }, { '--f': 1, yPercent: 0, stagger: .1, ease: 'none', scrollTrigger: { trigger: t, start: 'top 92%', end: 'top 45%', scrub: true } });
  });
  gsap.utils.toArray('.sec-idx').forEach(el => gsap.from(el, { x: -20, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } }));

  /* SOBRE */
  gsap.fromTo(words, { opacity: .12 }, { opacity: 1, stagger: .08, ease: 'none', scrollTrigger: { trigger: '.about-lead', start: 'top 80%', end: 'bottom 50%', scrub: true } });
  gsap.from('.about-body p', { y: 40, opacity: 0, stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about-body', start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.from('.facts > div', { y: 30, opacity: 0, stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.facts', start: 'top 92%', toggleActions: 'play none none reverse' } });
  $$('.float').forEach(f => {
    const s = +f.dataset.speed || 1;
    gsap.fromTo(f, { y: 140 * s, rotate: -20 * s }, { y: -140 * s, rotate: 20 * s, ease: 'none', scrollTrigger: { trigger: f.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* EXPERIÊNCIA — linha do tempo */
  gsap.to('.tl-rail i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
  $$('.tl-item').forEach(it => {
    ScrollTrigger.create({ trigger: it, start: 'top 70%', onToggle: s => it.classList.toggle('is-on', s.isActive || s.progress > 0), end: 'max' });
    gsap.fromTo(it.children, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: it, start: 'top 95%', end: 'top 60%', scrub: true } });
  });

  /* TECNOLOGIAS */
  gsap.from('.stack-tab', { x: -30, opacity: 0, stagger: .06, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.stack-ui', start: 'top 80%', toggleActions: 'play none none reverse' } });
  if (innerWidth <= 1100) {
    $$('.stack-panel').forEach(p => gsap.from($$('.stack-desc, .chip, .concepts li', p), { y: 24, opacity: 0, stagger: .03, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 85%' } }));
  } else {
    ScrollTrigger.create({ trigger: '.stack-ui', start: 'top 75%', once: true, onEnter: () => setTab(0) });
  }

  /* PROJETOS — cards empilhados */
  const cards = $$('.card');
  cards.forEach((card, i) => {
    gsap.from(card, { y: 120, opacity: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 80%', scrub: true } });
    const nx = cards[i + 1];
    if (nx && innerWidth > 1100) gsap.to([card, card.querySelector('.card-dim')], { scale: k => k ? 1 : .93 + i * .02, opacity: k => k ? .45 : 1, ease: 'none', scrollTrigger: { trigger: nx, start: 'top 70%', end: 'top 20%', scrub: true } });
  });
  gsap.from('.sys-item', { y: 60, opacity: 0, stagger: .08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.sys-grid', start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.from('.ig-card', { y: 80, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.ig', start: 'top 80%', toggleActions: 'play none none reverse' } });
  gsap.from('.ig-post', { scale: .9, opacity: 0, stagger: .08, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.ig-grid', start: 'top 88%', toggleActions: 'play none none reverse' } });
  gsap.from('.more-row', { y: 40, opacity: 0, stagger: .07, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.more-list', start: 'top 85%', toggleActions: 'play none none reverse' } });

  /* FORMAÇÃO */
  gsap.from('.edu-intro', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.edu-intro', start: 'top 88%', toggleActions: 'play none none reverse' } });
  $$('.edu-item').forEach(it => gsap.from(it.children, { y: 50, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: it, start: 'top 85%', toggleActions: 'play none none reverse' } }));

  /* CONTATO */
  gsap.from('.contact-title .ln > span', { yPercent: 110, stagger: .12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.contact-title', start: 'top 80%', toggleActions: 'play none none reverse' } });
  gsap.from(['.contact-sub', '.contact-links li'], { y: 40, opacity: 0, stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.contact-sub', start: 'top 88%', toggleActions: 'play none none reverse' } });

  /* RODAPÉ */
  gsap.from('.foot-name span', { yPercent: 100, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.from('.shapes .shp', { y: 140, rotate: -120, scale: .2, opacity: 0, stagger: .07, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.footer', start: 'top 70%', toggleActions: 'play none none reverse' } });

  /* botões magnéticos */
  if (fine && !reduce) $$('[data-magnetic]').forEach(b => {
    const x = gsap.quickTo(b, 'x', { duration: .6, ease: 'elastic.out(1,.4)' }), y = gsap.quickTo(b, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .3); y((e.clientY - r.top - r.height / 2) * .3); });
    b.addEventListener('pointerleave', () => { x(0); y(0); });
  });

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fitTitle(); ScrollTrigger.refresh(); }, 200); });
  document.fonts && document.fonts.ready.then(() => { fitTitle(); ScrollTrigger.refresh(); });
})();
