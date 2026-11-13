'use strict';
/* ===== תוספות חוויה: צלילים, "המומחה", דירוג מאבחן, תעודה, מצב תחרות, מדריכים ===== */

/* ---- צלילים נעימים (עם השתקה) ---- */
const Snd = {
  on: (() => { try { return localStorage.getItem('hemolab_snd') !== '0'; } catch (e) { return true; } })(),
  ac: null,
  toggle() { this.on = !this.on; try { localStorage.setItem('hemolab_snd', this.on ? '1' : '0'); } catch (e) { } return this.on; },
  _ctx() { try { if (!this.ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this.ac = new C(); } if (this.ac.state === 'suspended') this.ac.resume(); return this.ac; } catch (e) { return null; } },
  _tone(f, t0, dur, vol, type) {
    const c = this._ctx(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, c.currentTime + t0); g.gain.exponentialRampToValueAtTime(vol, c.currentTime + t0 + .02); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + dur);
    o.connect(g); g.connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + .05);
  },
  play(kind) {
    if (!this.on) return;
    try {
      if (kind === 'ok') { this._tone(660, 0, .16, .05, 'sine'); this._tone(880, .1, .22, .05, 'sine'); }
      else if (kind === 'no') { this._tone(330, 0, .22, .035, 'triangle'); this._tone(262, .12, .26, .03, 'triangle'); }
      else if (kind === 'win') { [523, 659, 784, 1047].forEach((f, i) => this._tone(f, i * .12, .3, .05, 'sine')); }
    } catch (e) { }
  },
};

/* ---- "המומחה": דמות רופא/ה שמעודדת ---- */
const EXP_G = Math.random() < .5 ? 'f' : 'm';
const EXP_IMG = { f: { great: ['expert_f_clap', 'expert_f_proud'], good: ['expert_f_proud'], try: ['expert_f_think'] }, m: { great: ['expert_m_proud'], good: ['expert_m_proud'], try: ['expert_m_think'] } };
const EXP_TXT = {
  great: ['כל הכבוד! אבחון מקצועי.', 'עבודה יפה. את/ה רואה את הדפוס.', 'זה בדיוק מה שרופא טוב עושה: מחבר את כל הרמזים.', 'מרשים! כך נראה/ית מאבחנ/ת מנוסה.'],
  good: ['עבודה טובה! עוד קצת דיוק ואת/ה שם.', 'יפה מאוד. כדאי לחזור על הנושאים שטעיתם בהם.', 'את/ה בכיוון הנכון. עוד סיבוב אחד ויהיה מצוין.'],
  try: ['לא נורא. כל טעות מלמדת, ובפעם הבאה תזהו את הדפוס.', 'שווה לנסות שוב: הדפוסים נקלטים עם התרגול.', 'אפילו מומחים התחילו משם. נסו שוב!'],
};
function expertKind(pct) { return pct >= 85 ? 'great' : pct >= 60 ? 'good' : 'try'; }
function expertCard(kindOrPct, text) {
  const kind = typeof kindOrPct === 'number' ? expertKind(kindOrPct) : kindOrPct;
  const names = EXP_IMG[EXP_G][kind] || EXP_IMG[EXP_G].good, nm = pick(names);
  if (!ART[nm]) return '';
  return `<div class="card expert"><img src="${ART[nm]}" alt="המומחה" loading="lazy"><div><b class="small muted">המומחה/ית</b><div class="bubble" style="margin-top:4px">${text || pick(EXP_TXT[kind])}</div></div></div>`;
}

/* ---- דירוג מאבחן: אבחונים נכונים בלי שום טעות ---- */
const RANKS = [
  { lvl: 1, t: 'מאבחן/ת מצטיין/ת', img: 'badge_1', f: .6 },
  { lvl: 2, t: 'מאבחן/ת דלוקס', img: 'badge_2', f: .8 },
  { lvl: 3, t: 'איך עדיין לא המטולוג/ית?', img: 'badge_3', f: 1 },
];
function diagRank(perfect, n) {
  if (!n || perfect < 3) return null;
  let r = null; RANKS.forEach(x => { if (perfect >= Math.ceil(x.f * n - 1e-9)) r = x; });
  return r;
}
function rankCard(r, perfect, n) {
  if (!r) return '';
  return `<div class="card center rank"><div class="row" style="justify-content:center;gap:14px;flex-wrap:nowrap">${ART[r.img] ? `<img src="${ART[r.img]}" alt="" style="width:92px">` : '<span style="font-size:3rem">🏅</span>'}<div style="text-align:start"><h3 style="margin:0">${r.t}</h3><div class="muted small">${perfect} מתוך ${n} אבחונים נכונים בלי שום טעות</div></div></div></div>`;
}

/* ---- תעודת סיום: הדפסה / PDF והורדה כתמונה ---- */
function certData(game, pct, rank) {
  return { name: (Store.d.name || '').trim(), title: game.title, pct, rank, date: new Date().toLocaleDateString('he-IL') };
}
function certHTML(c) {
  const exp = ART[EXP_IMG[EXP_G].great[0]];
  return `<div class="cert"><div class="cert-in">
    <div class="cert-top">${c.rank && ART[c.rank.img] ? `<img src="${ART[c.rank.img]}" alt="" class="cert-badge">` : '<span class="cert-star">🏅</span>'}</div>
    <div class="cert-h">תעודת הצטיינות</div>
    <div class="cert-s">מעבדת הדם · חזרה אינטראקטיבית על אנמיות</div>
    <div class="cert-s">מוענקת בזאת ל</div>
    <div class="cert-name">ד״ר ${esc(c.name || 'שם התלמיד/ה')}</div>
    <div class="cert-s">על הישג של <b>${c.pct}%</b> במשחק <b>${esc(c.title)}</b></div>
    ${c.rank ? `<div class="cert-rank">${c.rank.t}</div>` : ''}
    <div class="cert-foot"><div>${c.date}</div>${exp ? `<img src="${exp}" alt="" class="cert-exp">` : ''}<div>חתימת המומחה/ית ✍️</div></div>
  </div></div>`;
}
function certModal(game, pct, rank) {
  const c = certData(game, pct, rank);
  const m = modal(`<h2 style="margin-top:0">🎓 תעודת סיום</h2>${c.name ? '' : '<p class="small muted">כתבו שם כדי שיופיע בתעודה:</p><input type="text" id="cn" placeholder="שם או כינוי" maxlength="30" style="margin-bottom:10px">'}<div id="certhost">${certHTML(c)}</div>
    <div class="row" style="margin-top:12px"><button class="btn primary grow" id="cprint">🖨️ הדפסה / שמירה כ-PDF</button><button class="btn grow" id="cpng">⬇️ הורדה כתמונה</button></div>
    <button class="btn ghost block" id="cx" style="margin-top:8px">סגירה</button>
    <p class="small muted" style="margin-top:8px">להורדת PDF: בחלון ההדפסה בוחרים "שמירה כ-PDF" כיעד.</p>`);
  const redraw = () => { $('#certhost', m).innerHTML = certHTML(c); };
  const cn = $('#cn', m); if (cn) cn.oninput = () => { c.name = cn.value.trim(); redraw(); };
  $('#cx', m).onclick = () => m.remove();
  $('#cprint', m).onclick = () => {
    if (!c.name && cn) { toast('כתבו קודם שם'); return; }
    const st = document.createElement('style'); st.id = 'certpage'; st.textContent = '@page{size:A4 landscape;margin:8mm}';
    const host = document.createElement('div'); host.id = 'certprint'; host.innerHTML = certHTML(c);
    document.head.appendChild(st); document.body.appendChild(host); document.body.classList.add('cert-printing');
    const clean = () => { host.remove(); st.remove(); document.body.classList.remove('cert-printing'); window.removeEventListener('afterprint', clean); };
    window.addEventListener('afterprint', clean); setTimeout(() => window.print(), 60);
  };
  $('#cpng', m).onclick = () => { if (!c.name && cn) { toast('כתבו קודם שם'); return; } certPng(c); };
}
function certPng(c) {
  const W = 1600, H = 1130, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const load = src => new Promise(r => { if (!src) return r(null); const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const font = w => `${w} px Heebo, Arial, sans-serif`;
  Promise.all([load(c.rank && ART[c.rank.img]), load(ART[EXP_IMG[EXP_G].great[0]]), document.fonts ? document.fonts.ready : 0]).then(([badge, exp]) => {
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#fff8ee'); bg.addColorStop(1, '#ffe9e4'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#d4a017'; g.lineWidth = 14; g.strokeRect(40, 40, W - 80, H - 80); g.strokeStyle = '#d23b4c'; g.lineWidth = 4; g.strokeRect(70, 70, W - 140, H - 140);
    g.direction = 'rtl'; g.textAlign = 'center'; g.fillStyle = '#3a2430';
    if (badge) g.drawImage(badge, W / 2 - 100, 100, 200, 200);
    g.fillStyle = '#d23b4c'; g.font = '800 92px Heebo, Arial, sans-serif'; g.fillText('תעודת הצטיינות', W / 2, 400);
    g.fillStyle = '#6b5560'; g.font = '500 38px Heebo, Arial, sans-serif'; g.fillText('מעבדת הדם · חזרה אינטראקטיבית על אנמיות', W / 2, 460); g.fillText('מוענקת בזאת ל', W / 2, 530);
    g.fillStyle = '#1b9a68'; g.font = '800 104px Heebo, Arial, sans-serif'; g.fillText('ד״ר ' + (c.name || 'שם התלמיד/ה'), W / 2, 650);
    g.fillStyle = '#3a2430'; g.font = '500 40px Heebo, Arial, sans-serif'; g.fillText(`על הישג של ${c.pct}% במשחק ${c.title}`, W / 2, 735);
    if (c.rank) { g.fillStyle = '#b8860b'; g.font = '800 62px Heebo, Arial, sans-serif'; g.fillText(c.rank.t, W / 2, 830); }
    g.fillStyle = '#6b5560'; g.font = '500 34px Heebo, Arial, sans-serif'; g.fillText(c.date, W - 260, 1000); g.fillText('חתימת המומחה/ית', 300, 1000);
    if (exp) g.drawImage(exp, W / 2 - 80, 900, 160, 160);
    cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'certificate.png'; a.click(); }, 'image/png');
  });
}

/* ---- מצב תחרות: טיימר, בונוס מהירות ודירוג מקומי ---- */
const COMP_KEY = 'hemolab_comp_v1';
const Comp = {
  load() { try { return JSON.parse(localStorage.getItem(COMP_KEY) || '{}'); } catch (e) { return {}; } },
  save(o) { try { localStorage.setItem(COMP_KEY, JSON.stringify(o)); } catch (e) { } },
  add(id, rec) { const o = this.load(); const l = (o[id] || []).concat([rec]).sort((a, b) => b.pts - a.pts).slice(0, 5); o[id] = l; this.save(o); return l; },
};
function gameSize(g) {
  if (g.part === 'B') return g.id === 'b_l3' ? 7 : 8;
  if (g.part === 'C') { const S = Object.values(SHIFTS).find(x => x.id === g.id); return S ? S.ids.length : 5; }
  return 8;
}
const fmtT = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
function attachComp(ctx, g, hdr) {
  const t0 = Date.now(), target = gameSize(g) * (g.part === 'C' ? 110 : 60);
  const pill = el('<span class="chip" style="margin-inline-start:auto">⏱ 00:00</span>'); hdr.querySelector('.row').appendChild(pill);
  const iv = setInterval(() => { if (!document.body.contains(pill)) { clearInterval(iv); return; } pill.textContent = '⏱ ' + fmtT(Math.round((Date.now() - t0) / 1000)); }, 500);
  const orig = ctx.finish; ctx.comp = true;
  ctx.finish = (pct, extra = '') => {
    clearInterval(iv); pill.remove();
    const secs = Math.round((Date.now() - t0) / 1000), bonus = pct >= 40 ? Math.max(0, Math.round((target - secs) * 1.5)) : 0, pts = Math.round(pct * 10) + bonus;
    const list = Comp.add(g.id, { pts, secs, pct, n: Store.d.name || 'אני', d: Date.now() });
    const card = `<div class="card"><h3>⏱️ מצב תחרות</h3><div class="kpi"><div><b>${fmtT(secs)}</b><span>זמן</span></div><div><b>+${bonus}</b><span>בונוס מהירות</span></div><div><b>${pts}</b><span>נקודות</span></div></div>
      <p class="small muted" style="margin:10px 0 4px"><b>הדירוג שלך במכשיר הזה:</b></p>${list.map((r, i) => `<div class="row sp small" style="margin:3px 0"><span>${i + 1}. ${esc(r.n)} · ${fmtT(r.secs)}</span><b>${r.pts}</b></div>`).join('')}</div>`;
    orig.call(ctx, pct, extra + card);
  };
}

/* ---- מדריכים במשחקי חלק א׳ (דמויות שבוחנות את החומר) ---- */
const GUIDES = {
  a_factory: ['guide_iron', 'אני פֶרוֹ, אטום הברזל! בלעדיי ההמוגלובין לא נושא חמצן. שחקו עם הסליידרים וראו מה קורה כשאני חסר.'],
  a_absorb: ['guide_taxi', 'ברוכים הבאים לתחנת המוניות של הקיבה! רק B12 עם הפקטור הפנימי עולה על המונית, ובלעדיה הוא לא יגיע לדם.'],
  a_bili: ['guide_spleen', 'אני הטחול, הסדרן של המועדון. תא דם אדום בן 120 יום? תודה ולהתראות. בואו נעקוב אחרי מה שקורה להֶם שלו.'],
};
function guideSay(id) { const x = GUIDES[id]; return x && ART[x[0]] ? say(x[1], 'happy', x[0]) : ''; }

/* ---- חדר מיון: שעון והודעות אחות ---- */
const NURSE = ['דוקטור, מטופל/ת חדש/ה בחדר 3!', 'הדם כבר במעבדה, התוצאות בדרך.', 'שימו לב לסימנים החיוניים.', 'מישהו ביקש קפה? קודם המטופל.', 'המחלקה עמוסה הלילה, אבל אתם מצוינים.', 'הכניסו את הרמזים יחד, לא לוותר על אנמנזה.', 'בדקו גם את הבדיקה הגופנית לפני שמזמינים.'];
function erClock(t0, i) { const [h, m] = t0.split(':').map(Number); let tot = h * 60 + m + i * 25; return String(Math.floor(tot / 60) % 24).padStart(2, '0') + ':' + String(tot % 60).padStart(2, '0'); }
const EXAMCAP = {
  c1: 'חיוורון בלחמית העין וציפורניים בעלות מראה של כף. שני סימנים קלאסיים לחוסר ברזל ממושך.',
  c2: 'לשון אדומה, חלקה ונפוחה (גלוסיטיס): הפפילות נעלמו. מופיעה בחוסר B12.',
  c3: 'חיוורון קל ולשון אדומה וכואבת. בהיריון הדרישה לפולית עולה.',
  c4: 'לובן העין צהוב (צהבת) והשתן כהה כתה. סימנים להרס מהיר של תאי דם אדומים.',
  c5: 'פריחה בצורת פרפר בלחיים (מאפיינת זאבת) וצהבת קלה בעיניים, כמו בהמוליזה.',
  c6: 'מפרקי הידיים נפוחים ואדומים: דלקת מפרקים פעילה. הדלקת הכרונית גורמת לאנמיה.',
  c7: 'בצקת ברגליים: לחיצה בעדינות משאירה גומה בעור. סימן לכשל כלייתי.',
  c8: 'נקודות אדומות קטנות (פטכיות), חבורות וחניכיים מדממות: הטסיות נמוכות מאוד.',
  c9: 'צואה שחורה ודביקה (מלנה): דימום מהמערכת העיכול העליונה. רגישות בבטן העליונה מתאימה לכיב אפשרי.',
};

const flowStrip = () => `<div class="flow" aria-hidden="true">${[0, 1, 2, 3, 4, 5, 6].map(i => `<i style="animation-delay:-${i}s"></i>`).join('')}</div>`;
