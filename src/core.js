'use strict';
/* ===== הגדרות ===== */
const CFG = {
  TEACHER_KEY: 'hemo-teacher',   // מילת הסוד בקישור המורה: ?t=hemo-teacher  (ניתן לשנות)
  STORE_KEY: 'hemolab_v1',
  TEACHER_STORE: 'hemolab_teacher_v1',
  TITLE: 'מעבדת הדם',
};
const QS = new URLSearchParams(location.search);
const IS_TEACHER = QS.get('t') === CFG.TEACHER_KEY;
const IMG = (typeof IMG_DATA !== 'undefined') ? IMG_DATA : {};
const ART = (typeof ART_DATA !== 'undefined') ? ART_DATA : {};

/* ===== עזרים ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const rng = { f: Math.random };
function shuffle(a, r = Math.random) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
const pick = (a, r = Math.random) => a[Math.floor(r() * a.length)];
const between = (lo, hi, r = Math.random) => lo + (hi - lo) * r();
const round = (x, d = 0) => { const m = Math.pow(10, d); return Math.round(x * m) / m; };

function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function on(root, ev, sel, fn) { root.addEventListener(ev, e => { const t = e.target.closest(sel); if (t && root.contains(t)) fn(e, t); }); }

/* ===== אחסון מקומי (שם, התקדמות, טעויות נפוצות) ===== */
const Store = {
  d: { name: '', cls: '', games: {}, mistakes: {}, created: Date.now() },
  load() { try { const s = localStorage.getItem(CFG.STORE_KEY); if (s) this.d = Object.assign(this.d, JSON.parse(s)); } catch (e) { } },
  save() { try { localStorage.setItem(CFG.STORE_KEY, JSON.stringify(this.d)); } catch (e) { } },
  setName(n, c) { this.d.name = n.trim().slice(0, 30); this.d.cls = (c || '').trim().slice(0, 12); this.save(); },
  record(id, pct) {
    const g = this.d.games[id] || { best: 0, attempts: 0 };
    g.attempts++; g.best = Math.max(g.best, Math.round(pct)); g.last = Math.round(pct); g.ts = Date.now();
    this.d.games[id] = g; this.save(); return g;
  },
  mistake(tag) { if (!tag) return; this.d.mistakes[tag] = (this.d.mistakes[tag] || 0) + 1; this.save(); },
  stars(id) { const g = this.d.games[id]; if (!g) return 0; return g.best >= 90 ? 3 : g.best >= 70 ? 2 : g.best >= 40 ? 1 : 0; },
  totalStars() { return Object.keys(this.d.games).reduce((s, k) => s + this.stars(k), 0); },
  reset() { try { localStorage.removeItem(CFG.STORE_KEY); } catch (e) { } this.d = { name: '', cls: '', games: {}, mistakes: {}, created: Date.now() }; },
};
Store.load();

/* קוד תוצאות – הילד שולח למורה (וואטסאפ/העתקה), והמורה מדביק בלוח שלו */
const ResultCode = {
  make() {
    const g = {}; Object.keys(Store.d.games).forEach(k => { const x = Store.d.games[k]; g[k] = [x.best, x.attempts]; });
    const o = { v: 1, n: Store.d.name || 'ללא שם', c: Store.d.cls || '', t: Date.now(), g, m: Store.d.mistakes };
    return 'HL1:' + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  },
  parse(s) {
    s = s.trim(); const i = s.indexOf('HL1:'); if (i < 0) return null;
    const code = s.slice(i + 4).split(/\s/)[0];
    try { const o = JSON.parse(decodeURIComponent(escape(atob(code)))); if (o && o.v === 1) return o; } catch (e) { }
    return null;
  },
};

/* ===== ממשק ===== */
function toast(msg, ms = 2200) {
  const t = el(`<div class="toast" role="status">${esc(msg)}</div>`); document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}
function modal(html, opts = {}) {
  const bg = el(`<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`);
  bg.addEventListener('click', e => { if (e.target === bg && !opts.sticky) bg.remove(); });
  document.body.appendChild(bg); return bg;
}
function lightbox(src) {
  const lb = el(`<div class="lightbox"><button class="btn x">✕ סגירה</button><img src="${src}" alt=""></div>`);
  lb.addEventListener('click', () => lb.remove()); document.body.appendChild(lb);
}
document.addEventListener('click', e => { const im = e.target.closest('.fig img'); if (im) lightbox(im.src); });

function fig(name, cap) {
  const src = IMG[name] || ('assets/' + name + '.webp');
  return `<figure class="fig"><img loading="lazy" src="${src}" alt="${esc(cap || name)}"><figcaption>${esc(cap || '')} · לחיצה להגדלה</figcaption></figure>`;
}

function mascotSVG(mood = 'happy') {
  const mouths = {
    happy: '<path d="M44 70 Q60 88 76 70" fill="none" stroke="#5a1220" stroke-width="4" stroke-linecap="round"/>',
    wow: '<ellipse cx="60" cy="76" rx="8" ry="10" fill="#5a1220"/>',
    think: '<path d="M46 76 Q58 72 74 78" fill="none" stroke="#5a1220" stroke-width="4" stroke-linecap="round"/>',
    sad: '<path d="M46 80 Q60 66 74 80" fill="none" stroke="#5a1220" stroke-width="4" stroke-linecap="round"/>',
    wink: '<path d="M44 70 Q60 88 76 70" fill="none" stroke="#5a1220" stroke-width="4" stroke-linecap="round"/>',
  };
  const eyeR = mood === 'wink' ? '<path d="M68 50 q7 -6 14 0" fill="none" stroke="#2a0b13" stroke-width="4" stroke-linecap="round"/>' : '<circle cx="75" cy="52" r="8" fill="#fff"/><circle cx="76" cy="53" r="4" fill="#2a0b13"/>';
  const brow = mood === 'think' ? '<path d="M64 38 q10 -7 20 -1" stroke="#7a1a2c" stroke-width="3.5" fill="none" stroke-linecap="round"/>' : '';
  return `<svg viewBox="0 0 120 120" role="img" aria-label="דמות כדורית הדם"><defs><radialGradient id="mg${mood}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#ff8c99"/><stop offset=".55" stop-color="#ee4a5d"/><stop offset="1" stop-color="#b52238"/></radialGradient></defs>
  <ellipse cx="60" cy="110" rx="30" ry="5" fill="rgba(0,0,0,.12)"/>
  <circle cx="60" cy="58" r="50" fill="url(#mg${mood})"/><ellipse cx="60" cy="60" rx="26" ry="22" fill="#ff9aa6" opacity=".35"/>
  <circle cx="45" cy="52" r="8" fill="#fff"/><circle cx="44" cy="53" r="4" fill="#2a0b13"/>${eyeR}${brow}
  <circle cx="34" cy="68" r="6" fill="#ff6f83" opacity=".6"/><circle cx="86" cy="68" r="6" fill="#ff6f83" opacity=".6"/>${mouths[mood] || mouths.happy}</svg>`;
}
function mascot(mood = 'happy', cls = '') {
  const a = ART['mascot_' + mood] || ART.mascot;
  return `<div class="mascot ${cls}">${a ? `<img src="${a}" alt="דמות" style="width:100%">` : mascotSVG(mood)}</div>`;
}
function charImg(name, w = 84) { const a = ART[name]; return a ? `<div class="mascot" style="flex:0 0 ${w}px"><img src="${a}" alt="" style="width:100%;height:auto"></div>` : ''; }
function say(text, mood = 'happy', who) { return `<div class="say">${(who && charImg(who)) || mascot(mood)}<div class="bubble">${text}</div></div>`; }

(function injectConfettiCss() {
  const s = document.createElement('style');
  s.textContent = `.cf{position:fixed;top:-20px;z-index:120;font-size:22px;pointer-events:none;animation:cf 2.4s ease-in forwards}@keyframes cf{to{transform:translateY(105vh) rotate(540deg);opacity:.6}}`;
  document.head.appendChild(s);
})();
function confetti(n = 22) {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const em = ['🩸', '⭐', '✨', '🎉', '💉', '🔬'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'); s.className = 'cf'; s.textContent = pick(em);
    s.style.left = Math.random() * 100 + 'vw'; s.style.animationDelay = Math.random() * .6 + 's';
    document.body.appendChild(s); setTimeout(() => s.remove(), 3200);
  }
}
const starsHTML = n => `<span class="stars" aria-label="${n} כוכבים">${[1, 2, 3].map(i => `<span class="${i <= n ? '' : 'off'}">★</span>`).join('')}</span>`;

/* ===== שאלה אמריקאית (MCQ) – רכיב משותף ===== */
function mcq(parent, spec) {
  const letters = ['א', 'ב', 'ג', 'ד', 'ה'];
  let opts = spec.options.map((o, i) => ({ ...o, _i: i }));
  if (spec.shuffle !== false) opts = shuffle(opts);
  const box = el(`<div class="mcq"></div>`);
  box.innerHTML = (spec.fig ? fig(spec.fig, spec.figCap) : '') + (spec.vis || '') + `<div class="q">${spec.q}</div>` +
    `<div class="opts">${opts.map((o, i) => `<button class="opt ${IS_TEACHER && o.ok ? 't-ok' : ''}" data-i="${i}"><b>${letters[i]}.</b><span>${o.t}</span><span class="mk"></span></button>`).join('')}</div><div class="fb"></div>`;
  parent.appendChild(box);
  let done = false;
  if (IS_TEACHER) {
    const w = spec.options.find(o => o.ok);
    if (w && w.why) box.querySelector('.fb').innerHTML = `<div class="tnote"><b>למורה – התשובה הנכונה:</b> ${w.why}</div>`;
  }
  box.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b || done) return; done = true;
    const o = opts[+b.dataset.i];
    $$('.opt', box).forEach((x, i) => { x.disabled = true; const oo = opts[i]; if (oo.ok) { x.classList.add('ok'); $('.mk', x).textContent = '✓'; } });
    if (!o.ok) { b.classList.add('no'); $('.mk', b).textContent = '✗'; Store.mistake(o.tag || spec.tag); }
    const right = opts.find(x => x.ok);
    const why = o.ok ? (o.why || '') : `${o.why ? o.why + '<br>' : ''}<b>התשובה הנכונה:</b> ${right.t}${right.why ? ' — ' + right.why : ''}`;
    $('.fb', box).innerHTML = `<div class="explain ${o.ok ? 'good' : 'bad'}">${o.ok ? '✅ נכון! ' : '🤔 כמעט. '}${why}</div>`;
    if (o.ok) confettiSmall();
    spec.onDone && spec.onDone(!!o.ok, o);
  });
  return box;
}
function confettiSmall() { if (Math.random() < .25) confetti(6); }

/* ריצת חידון – מספר שאלות ברצף */
function runQuiz(root, ctx, items, o = {}) {
  let i = 0, right = 0;
  const host = el(`<div></div>`); root.appendChild(host);
  function step() {
    host.innerHTML = '';
    if (i >= items.length) { ctx.finish(Math.round(100 * right / items.length), o.after || ''); return; }
    const it = items[i];
    const head = el(`<div class="row sp small muted" style="margin-bottom:8px"><span>שאלה ${i + 1} מתוך ${items.length}</span><span>✓ ${right}</span></div>`);
    const bar = el(`<div class="bar" style="margin-bottom:14px"><i style="width:${100 * i / items.length}%"></i></div>`);
    host.append(head, bar);
    const card = el(`<div class="card"></div>`); host.appendChild(card);
    mcq(card, { ...it, onDone: ok => {
      if (ok) right++;
      const nx = el(`<button class="btn primary block" style="margin-top:14px">${i + 1 >= items.length ? 'לסיכום 🏁' : 'הבא ←'}</button>`);
      nx.onclick = () => { i++; step(); };
      card.appendChild(nx); nx.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } });
  }
  step();
}

/* ===== רישום משחקים ===== */
const GAMES = [];
function registerGame(g) { GAMES.push(g); }
function gameById(id) { return GAMES.find(g => g.id === id); }

function makeCtx(game, root) {
  return {
    game, root, teacher: IS_TEACHER,
    finish(pct, extra = '') {
      const rec = Store.record(game.id, pct);
      const st = Store.stars(game.id);
      const msg = pct >= 90 ? ['מושלם! אתם מדהימים 🎉', 'wow'] : pct >= 70 ? ['כל הכבוד – ממש מצוין!', 'happy'] : pct >= 40 ? ['יפה! עוד סיבוב ותהיו שם.', 'wink'] : ['לא נורא – טעויות הן הדרך ללמוד. נסו שוב!', 'think'];
      if (pct >= 70) confetti();
      root.innerHTML = `<div class="card victory">${mascot(msg[1], 'hero-m')}<h2>${pct}%</h2><div style="font-size:1.8rem;color:var(--gold)">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</div><p>${msg[0]}</p><div class="muted small">שיא אישי: ${rec.best}% · ניסיונות: ${rec.attempts}</div></div>${extra}
      <div class="row" style="margin-top:6px"><button class="btn primary grow" data-act="again">🔁 שוב</button><button class="btn grow" data-act="back">חזרה לרשימה</button></div>`;
      $('.hero-m', root) && ($('.hero-m', root).style.cssText = 'width:110px;margin:0 auto 8px');
      $$('[data-act]', root).forEach(t => t.onclick = () => { if (t.dataset.act === 'again') { root.innerHTML = ''; game.mount(root, makeCtx(game, root)); } else location.hash = '#/' + game.part.toLowerCase(); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  };
}
function mountGame(id, root) {
  const g = gameById(id); if (!g) { root.innerHTML = '<p>המשחק לא נמצא.</p>'; return; }
  root.innerHTML = '';
  const hdr = el(`<div><button class="back" data-back>→ חזרה</button><div class="row" style="margin-bottom:8px"><span style="font-size:2rem">${g.icon}</span><div><h2 style="margin:0">${g.title}</h2><div class="muted small">${g.desc}</div></div></div></div>`);
  const body = el(`<div id="game-body"></div>`);
  root.append(hdr, body);
  hdr.querySelector('[data-back]').onclick = () => location.hash = '#/' + g.part.toLowerCase();
  if (IS_TEACHER && g.teacherNote) body.appendChild(el(`<div class="tnote"><b>הערה למורה:</b> ${g.teacherNote}</div>`));
  g.mount(body, makeCtx(g, body));
}
