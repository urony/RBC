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
const EXP_IMG = { f: { great: ['expert_f_clap', 'expert_f_proud'], good: ['expert_f_proud'], try: ['expert_f_think'] }, m: { great: ['expert_m_clap', 'expert_m_proud'], good: ['expert_m_proud'], try: ['expert_m_think'] } };
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

/* ---- תעודות: השתתפות / סיום / הצטיינות. הדפסה או PDF, הורדה כתמונה ושיתוף ---- */
const CERT_KINDS = {
  part: { h: 'תעודת השתתפות', dr: false, line: c => `על השתתפות פעילה ב${c.what}` },
  done: { h: 'תעודת סיום', dr: false, line: c => `על סיום ${c.pct != null ? `בציון <b>${c.pct}%</b> ` : ''}ב${c.what}` },
  excel: { h: 'תעודת הצטיינות', dr: true, line: c => `על הישג ${c.pct != null ? `של <b>${c.pct}%</b> ` : ''}ב${c.what}` },
};
function certData(game, pct, rank) {
  return { name: (Store.d.name || '').trim(), what: 'משחק ' + game.title, pct, rank, kind: pct >= 70 ? 'excel' : 'part', sig: 'חתימת המומחה/ית', date: new Date().toLocaleDateString('he-IL') };
}
function certTexts(c) {
  const k = CERT_KINDS[c.kind || 'excel'], dr = c.dr == null ? k.dr : c.dr;
  return { h: k.h, name: (dr ? 'ד״ר ' : '') + (c.name || 'שם התלמיד/ה'), line: k.line(c), sub: c.sub || 'מעבדת הדם · חזרה אינטראקטיבית על אנמיות' };
}
function certHTML(c) {
  const exp = ART[EXP_IMG[EXP_G].great[0]], t = certTexts(c);
  return `<div class="cert"><div class="cert-in">
    <div class="cert-top">${c.rank && ART[c.rank.img] ? `<img src="${ART[c.rank.img]}" alt="" class="cert-badge">` : '<span class="cert-star">🏅</span>'}</div>
    <div class="cert-h">${t.h}</div>
    <div class="cert-s">${esc(t.sub)}</div>
    <div class="cert-s">מוענקת בזאת ל</div>
    <div class="cert-name">${esc(t.name)}</div>
    <div class="cert-s">${t.line}</div>
    ${c.rank ? `<div class="cert-rank">${c.rank.t}</div>` : ''}
    <div class="cert-foot"><div>${c.date}</div>${exp ? `<img src="${exp}" alt="" class="cert-exp">` : ''}<div>${esc(c.sig || 'חתימת המומחה/ית')} ✍️</div></div>
  </div></div>`;
}
/* הדפסה של תעודה אחת או כמה: כל תעודה בעמוד A4 לרוחב */
function printCerts(list) {
  const st = document.createElement('style'); st.id = 'certpage'; st.textContent = '@page{size:A4 landscape;margin:8mm}';
  const host = document.createElement('div'); host.id = 'certprint'; host.innerHTML = list.map(c => `<div class="certpg">${certHTML(c)}</div>`).join('');
  document.head.appendChild(st); document.body.appendChild(host); document.body.classList.add('cert-printing');
  const clean = () => { host.remove(); st.remove(); document.body.classList.remove('cert-printing'); window.removeEventListener('afterprint', clean); };
  window.addEventListener('afterprint', clean); setTimeout(() => window.print(), 60);
}
function certModal(game, pct, rank) {
  const c = certData(game, pct, rank), isP = c.kind === 'part';
  const m = modal(`<h2 style="margin-top:0">🎓 ${isP ? 'תעודת השתתפות' : 'תעודת הצטיינות'}</h2>${c.name ? '' : '<p class="small muted">כתבו שם כדי שיופיע בתעודה:</p><input type="text" id="cn" placeholder="שם או כינוי" maxlength="30" style="margin-bottom:10px">'}<div id="certhost">${certHTML(c)}</div>
    <div class="row" style="margin-top:12px"><button class="btn primary grow" id="cprint">🖨️ הדפסה / שמירה כ-PDF</button><button class="btn grow" id="cpng">⬇️ הורדה כתמונה</button></div>
    <button class="btn block" id="cshare" style="margin-top:8px">📤 שליחה למורה (שיתוף תמונה)</button>
    <button class="btn ghost block" id="cx" style="margin-top:8px">סגירה</button>
    <p class="small muted" style="margin-top:8px">להורדת PDF: בחלון ההדפסה בוחרים "שמירה כ-PDF" כיעד. אפשר גם להוריד כתמונה ולשלוח למורה.</p>`);
  const redraw = () => { $('#certhost', m).innerHTML = certHTML(c); };
  const cn = $('#cn', m); if (cn) cn.oninput = () => { c.name = cn.value.trim(); redraw(); };
  const need = () => { if (!c.name && cn) { toast('כתבו קודם שם'); return true; } return false; };
  $('#cx', m).onclick = () => m.remove();
  $('#cprint', m).onclick = () => { if (!need()) printCerts([c]); };
  $('#cpng', m).onclick = () => { if (!need()) certPng(c); };
  $('#cshare', m).onclick = () => { if (!need()) certPng(c, true); };
}
function certPng(c, share) {
  const W = 1600, H = 1130, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const load = src => new Promise(r => { if (!src) return r(null); const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const t = certTexts(c), plain = t.line.replace(/<[^>]+>/g, '');
  Promise.all([load(c.rank && ART[c.rank.img]), load(ART[EXP_IMG[EXP_G].great[0]]), document.fonts ? document.fonts.ready : 0]).then(([badge, exp]) => {
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#fff8ee'); bg.addColorStop(1, '#ffe9e4'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#d4a017'; g.lineWidth = 14; g.strokeRect(40, 40, W - 80, H - 80); g.strokeStyle = '#d23b4c'; g.lineWidth = 4; g.strokeRect(70, 70, W - 140, H - 140);
    g.direction = 'rtl'; g.textAlign = 'center'; g.fillStyle = '#3a2430';
    if (badge) g.drawImage(badge, W / 2 - 100, 100, 200, 200); else { g.font = '120px serif'; g.fillText('🏅', W / 2, 260); }
    g.fillStyle = '#d23b4c'; g.font = '800 92px Heebo, Arial, sans-serif'; g.fillText(t.h, W / 2, 400);
    g.fillStyle = '#6b5560'; g.font = '500 38px Heebo, Arial, sans-serif'; g.fillText(t.sub, W / 2, 460); g.fillText('מוענקת בזאת ל', W / 2, 530);
    g.fillStyle = '#1b9a68'; g.font = '800 104px Heebo, Arial, sans-serif'; g.fillText(t.name, W / 2, 650);
    g.fillStyle = '#3a2430'; g.font = '500 40px Heebo, Arial, sans-serif'; g.fillText(plain, W / 2, 735);
    if (c.rank) { g.fillStyle = '#b8860b'; g.font = '800 62px Heebo, Arial, sans-serif'; g.fillText(c.rank.t, W / 2, 830); }
    g.fillStyle = '#6b5560'; g.font = '500 34px Heebo, Arial, sans-serif'; g.fillText(c.date, W - 260, 1000); g.fillText(c.sig || 'חתימת המומחה/ית', 300, 1000);
    if (exp) g.drawImage(exp, W / 2 - 80, 900, 160, 160);
    cv.toBlob(async b => {
      const fname = 'certificate' + (c.name ? '-' + c.name.replace(/[^\p{L}\p{N}]+/gu, '_') : '') + '.png';
      if (share) {
        try { const f = new File([b], fname, { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: 'התעודה שלי ממעבדת הדם' }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
        toast('השיתוף לא נתמך במכשיר הזה. התמונה ירדה, אפשר לשלוח אותה ידנית.');
      }
      const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fname; a.click();
    }, 'image/png');
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
  c10: 'בטן נפוחה ללא רגישות: מתאימה לבעיית ספיגה במעי, למשל צליאק. שימו לב שהמטופלת לוקחת ברזל כבר חצי שנה בלי שיפור.',
  c9: 'צואה שחורה ודביקה (מלנה): דימום מהמערכת העיכול העליונה. רגישות בבטן העליונה מתאימה לכיב אפשרי.',
};

/* הסבר קצר על מצב תחרות, מוצג במסך הבחירה */
function compRules(g) {
  const target = gameSize(g) * (g.part === 'C' ? 110 : 60), maxB = Math.round(target * 1.5);
  return `<details class="small" style="margin-top:10px;text-align:start"><summary style="cursor:pointer;font-weight:700">❓ מה זה מצב תחרות ואיך מנצחים?</summary>
    <ul style="margin:8px 0 0;padding-inline-start:20px;line-height:1.6">
      <li><b>הטיימר רץ</b> מרגע שהתחלתם ועד הסיום.</li>
      <li><b>נקודות דיוק:</b> 10 נקודות על כל אחוז הצלחה (עד 1000).</li>
      <li><b>בונוס מהירות:</b> אם סיימתם בפחות מ-${Math.round(target / 60)} דקות, כל שנייה שחסכתם נותנת 1.5 נקודות (עד ${maxB}). הבונוס ניתן רק מציון 40 ומעלה, כך שאין טעם למהר סתם.</li>
      <li><b>כדי לנצח:</b> ענו נכון על כמה שיותר, ובמהירות סבירה. דיוק שווה יותר ממהירות.</li>
      <li>בסוף תראו את חמש התוצאות הטובות ביותר <b>במכשיר הזה</b>. אין השוואה בין מכשירים, והניקוד הרגיל והכוכבים נשמרים כרגיל.</li></ul></details>`;
}
