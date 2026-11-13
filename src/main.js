'use strict';
/* ===== ניווט ומסכים ראשיים ===== */
const PARTS = {
  A: { l: 'א׳', t: 'חזרה אינטראקטיבית על עקרונות חשובים', d: 'חזרה מהירה וחביבה על האנטומיה והפיזיולוגיה של תא הדם האדום, ועל חמש האנמיות', col: 'var(--primary)', ic: '📘' },
  B: { l: 'ב׳', t: 'אבחון מבדיקות דם', d: 'מקבלים בדיקות דם ומחליטים איזו אנמיה זו', col: 'var(--teal)', ic: '🧪' },
  C: { l: 'ג׳', t: 'תורנות מיון', d: 'מטופלים אמיתיים: שיחה, בדיקות, אבחנה וטיפול', col: 'var(--violet)', ic: '🚑' },
};
const SECS = { basics: ['🧬 הבסיס: תא הדם האדום', 'מבנה, חמצן, ייצור, ברזל וויטמינים וסוגי דם'], anemia: ['🩸 חמש האנמיות', 'תסמינים, אבחון והבדלים'] };
const view = () => $('#view');

function themeInit() { try { const t = localStorage.getItem('hemolab_theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) { } }
function setTheme(t) { try { if (t === 'auto') { localStorage.removeItem('hemolab_theme'); delete document.documentElement.dataset.theme; } else { localStorage.setItem('hemolab_theme', t); document.documentElement.dataset.theme = t; } } catch (e) { } }
themeInit();

function shell() {
  document.title = CFG.TITLE;
  document.body.innerHTML = `<header class="topbar"><div class="brand" id="logo"><span style="width:34px;height:34px;display:inline-block">${ART.mascot_happy ? `<img src="${ART.mascot_happy}" alt="" style="width:100%;height:100%">` : mascotSVG('happy')}</span><span>${CFG.TITLE}</span></div><div class="sp"></div>${IS_TEACHER ? '<span class="chip t">🎓 מצב מורה</span>' : ''}<span class="chip" id="stars">⭐ 0</span></header>
  <main class="page" id="view"></main>
  <footer class="credit">פותח על ידי אורי העליון</footer>
  <nav class="nav" aria-label="ניווט ראשי">${[['home', '🏠', 'בית'], ['a', '📘', 'א׳ חזרה'], ['b', '🧪', 'ב׳ אבחון'], ['c', '🚑', 'ג׳ מיון'], ['me', '👤', 'אני']].filter(n => !LOCK || n[0] === 'me' || (n[0] !== 'home' && allowedParts().includes(n[0]))).concat(IS_TEACHER ? [['t', '🎓', 'מורה']] : []).map(n => `<a href="#/${n[0]}" data-n="${n[0]}"><span class="ic">${n[1]}</span><span>${n[2]}</span></a>`).join('')}</nav>`;
  $('#logo').onclick = () => location.hash = LOCK ? '#/' + allowedParts()[0] : '#/home';
}
function updateTop(route) {
  $('#stars').textContent = '⭐ ' + Store.totalStars();
  $$('.nav a').forEach(a => a.classList.toggle('on', a.dataset.n === route));
}

const gameAllowed = g => !LOCK || ONLY.includes(g.part.toLowerCase()) || ONLY.includes(g.id.toLowerCase());
const allowedParts = () => ['a', 'b', 'c'].filter(p => GAMES.some(g => g.part.toLowerCase() === p && gameAllowed(g)));
function gamesOfPart(p) { return GAMES.filter(g => g.part === p && gameAllowed(g)); }
function nameCard(redraw) {
  return Store.d.name ? '' : `<div class="card"><h3>איך קוראים לך?</h3><p class="muted small">אפשר גם כינוי. השם נשמר רק במכשיר שלך, ונשלח למורה רק אם תלחצו על "שליחת תוצאות".</p><input type="text" id="nm" placeholder="שם או כינוי" maxlength="30" autocomplete="off"><div style="height:8px"></div><input type="text" id="cl" placeholder="כיתה (לא חובה)" maxlength="12" autocomplete="off"><button class="btn primary block" id="sv" style="margin-top:10px">נתחיל! 🚀</button></div>`;
}
function bindName(redraw) { const sv = $('#sv'); if (sv) sv.onclick = () => { const n = $('#nm').value.trim(); if (!n) { toast('כתבו שם או כינוי'); return; } Store.setName(n, $('#cl').value); redraw(); }; }
function partProgress(p) { const g = gamesOfPart(p); const d = g.filter(x => Store.stars(x.id) > 0).length; return { d, n: g.length, pct: g.length ? Math.round(100 * d / g.length) : 0 }; }
function tile(g) { return `<button class="tile" data-g="${g.id}">${starsHTML(Store.stars(g.id))}<span class="ic">${g.icon}</span><span class="t">${g.title}</span><span class="d">${g.desc}</span></button>`; }

function heroBg(g) { return ART.hero_bg ? `background:linear-gradient(135deg,${g}),url(${ART.hero_bg}) center/cover` : ''; }
function home() {
  const hasName = !!Store.d.name;
  const prog = Object.keys(PARTS).map(k => ({ k, ...partProgress(k) }));
  const next = GAMES.find(g => !Store.stars(g.id));
  view().innerHTML = `<div class="hero" style="${heroBg('rgba(150,30,50,.62),rgba(70,30,100,.5)')}">${mascot('wow')}<div><h1>${hasName ? 'היי ' + esc(Store.d.name) + '! 👋' : 'ברוכים הבאים למעבדת הדם'}</h1><p>לומדים על תאי הדם האדומים והאנמיות – דרך משחקים, חידות ותורנות מיון.</p></div></div>
    ${hasName ? '' : `<div class="card"><h3>איך קוראים לך?</h3><p class="muted small">אפשר גם כינוי. השם נשמר רק במכשיר שלך, ונשלח למורה רק אם תלחצו על "שליחת תוצאות".</p>
      <input type="text" id="nm" placeholder="שם או כינוי" maxlength="30" autocomplete="off"><div style="height:8px"></div><input type="text" id="cl" placeholder="כיתה (לא חובה)" maxlength="12" autocomplete="off">
      <button class="btn primary block" id="sv" style="margin-top:10px">נתחיל! 🚀</button></div>`}
    ${next ? `<button class="tile" data-g="${next.id}" style="width:100%;min-height:0;flex-direction:row;align-items:center;gap:14px"><span class="ic">${next.icon}</span><span><span class="d">המשך מהמקום שעצרת</span><br><span class="t">${next.title}</span></span></button>` : '<div class="card center">🎉 סיימתם את כל המשחקים! אפשר לשפר ציונים או לשלוח למורה.</div>'}
    <div class="part"><h2 style="margin:0">שלושה חלקים</h2></div>
    ${prog.map(p => `<a href="#/${p.k.toLowerCase()}" class="card" style="display:block;text-decoration:none;color:inherit;border-inline-start:6px solid ${PARTS[p.k].col}"><div class="row sp"><div class="row"><span style="font-size:2rem">${PARTS[p.k].ic}</span><div><h3 style="margin:0">חלק ${PARTS[p.k].l} – ${PARTS[p.k].t}</h3><div class="muted small">${PARTS[p.k].d}</div></div></div></div><div class="bar" style="margin-top:12px"><i style="width:${p.pct}%"></i></div><div class="small muted" style="margin-top:4px">${p.d} מתוך ${p.n} הושלמו</div></a>`).join('')}
    ${hasName && Object.keys(Store.d.games).length ? '<button class="btn block" id="shr">📤 שליחת התוצאות למורה</button>' : ''}
    <p class="small muted center" style="margin-top:18px">כלי לימוד בהתבסס על "ספר המגמה: המטולוגיה". המקרים והערכים להמחשה לימודית בלבד ואינם תחליף לייעוץ רפואי.</p>`;
  const sv = $('#sv'); if (sv) sv.onclick = () => { const n = $('#nm').value.trim(); if (!n) { toast('כתבו שם או כינוי'); return; } Store.setName(n, $('#cl').value); home(); };
  const sh = $('#shr'); if (sh) sh.onclick = shareResultsModal;
}

function partPage(p) {
  const P = PARTS[p], gs = gamesOfPart(p);
  let h = `<div class="hero" style="${ART.hero_bg ? heroBg(p === 'A' ? 'rgba(160,30,55,.65),rgba(110,30,60,.5)' : p === 'B' ? 'rgba(15,110,115,.65),rgba(26,90,150,.5)' : 'rgba(110,70,200,.65),rgba(60,40,140,.5)') : 'background:linear-gradient(135deg,' + (p === 'A' ? '#d23b4c,#8e1b2e' : p === 'B' ? '#0f9b95,#1a6fa0' : '#7a4fd6,#4b2f9c') + ')'}">${mascot(p === 'C' ? 'think' : 'happy')}<div><h1>חלק ${P.l}: ${P.t}</h1><p>${P.d}</p></div></div>`;
  if (p === 'A') {
    h += `<div class="card soft small">📘 כאן חוזרים בקצרה, בעזרת כלים קטנים ומשחקיים, על עקרונות חשובים באנטומיה ובפיזיולוגיה של תא הדם האדום. זה לא תחליף ללימוד, אלא חזרה מהירה וחביבה. אפשר לעבוד לפי הסדר או לדלג בין יחידות.</div>`;
    Object.keys(SECS).forEach(s => { const g = gs.filter(x => x.sec === s); h += `<div class="part"><h2 style="margin:0">${SECS[s][0]}</h2></div><p class="muted small" style="margin-top:0">${SECS[s][1]}</p><div class="grid">${g.map(tile).join('')}</div>`; });
  } else if (p === 'B') {
    h += `<div class="card soft"><b>איך זה עובד?</b> מקבלים תוצאות בדיקות דם ובוחרים: איזו אנמיה זו? כל רמה קשה יותר מקודמתה.</div><div class="grid">${gs.map(tile).join('')}</div>
      <details class="card" style="margin-top:14px"><summary><b>📋 כרטיס עזר: ערכי ייחוס</b></summary><div style="margin-top:10px">${refTable()}<p class="small muted">ערכי הייחוס לפי הספר; ערכים שאינם מופיעים בו (MCH, RDW, MCHC, פריטין, ברזל, B12 וכו׳) הם טווחים מקובלים בלבד להמחשה.</p></div></details>`;
  } else {
    h += `<div class="card soft small">🚑 לכל מטופל: אנמנזה ← בדיקה גופנית ← תוצאות בדיקות דם ← אבחנה, סיבה וטיפול.</div><div class="grid">${gs.map(tile).join('')}</div>`;
  }
  if (LOCK) h = h.replace('</div></div>', '</div></div>' + nameCard(), 1);
  view().innerHTML = h;
  if (LOCK) bindName(() => partPage(p));
}
function refTable() {
  const keys = ['Hb', 'RBC', 'HCT', 'MCV', 'MCH', 'MCHC', 'RDW', 'RET', 'WBC', 'PLT', 'FER', 'FE', 'TRF', 'B12', 'FOL', 'BILI', 'LDH', 'HAPT', 'CRP', 'ESR'];
  return `<table class="lab"><thead><tr><th>בדיקה</th><th>נשים</th><th>גברים</th></tr></thead><tbody>${keys.map(k => { const f = labRange(k, 'F'), m = labRange(k, 'M'); return `<tr><td>${LAB[k].n} <span class="muted small">${LAB[k].u}</span></td><td class="r">${f[0]}–${f[1]}</td><td class="r">${m[0]}–${m[1]}</td></tr>`; }).join('')}</tbody></table>`;
}

function mePage() {
  const d = Store.d, gs = GAMES.filter(g => d.games[g.id]);
  const mis = Object.entries(d.mistakes).sort((a, b) => b[1] - a[1]).slice(0, 6);
  view().innerHTML = `<h1>👤 אני</h1>
    <div class="card"><h3>הפרטים שלי</h3><input type="text" id="nm" value="${esc(d.name)}" placeholder="שם או כינוי" maxlength="30"><div style="height:8px"></div><input type="text" id="cl" value="${esc(d.cls)}" placeholder="כיתה (לא חובה)" maxlength="12"><button class="btn primary block" id="sv" style="margin-top:10px">שמירה</button></div>
    <div class="card"><h3>ההתקדמות שלי · ⭐ ${Store.totalStars()}</h3>${gs.length ? gs.map(g => `<div class="meter"><div class="nm small">${g.title}</div><div class="bar"><i style="width:${d.games[g.id].best}%"></i></div><b class="small" style="width:44px;text-align:end">${d.games[g.id].best}%</b></div>`).join('') : '<p class="muted">עוד לא שיחקתם. בואו נתחיל! 🎮</p>'}</div>
    ${mis.length ? `<div class="card"><h3>על מה כדאי לחזור?</h3>${mis.map(([k, n]) => `<div class="row sp" style="margin:6px 0"><span>${TAGS[k] || k}</span><span class="pill y">${n} טעויות</span></div>`).join('')}</div>` : ''}
    <button class="btn block" id="shr">📤 שליחת התוצאות למורה</button>
    <div class="card" style="margin-top:14px"><h3>מראה</h3><div class="seg"><button data-th="auto">אוטומטי</button><button data-th="light">בהיר</button><button data-th="dark">כהה</button></div></div>
    <button class="btn ghost block" id="rs">🗑️ איפוס כל הנתונים במכשיר</button>
    <p class="small muted center" style="margin-top:14px">הנתונים שלכם נשמרים רק בדפדפן במכשיר הזה.</p>`;
  $('#sv').onclick = () => { Store.setName($('#nm').value, $('#cl').value); toast('נשמר ✅'); updateTop('me'); };
  $('#shr').onclick = () => { if (!Store.d.name) { toast('הוסיפו קודם שם'); return; } shareResultsModal(); };
  $('#rs').onclick = () => { if (confirm('למחוק את השם, הציונים וההתקדמות במכשיר הזה?')) { Store.reset(); mePage(); updateTop('me'); } };
  on(view(), 'click', '[data-th]', (e, b) => { setTheme(b.dataset.th); toast('עודכן'); });
}

function router() {
  const h = location.hash.replace(/^#\/?/, '') || 'home', [r, id] = h.split('/');
  window.scrollTo(0, 0);
  if (LOCK) { const ap = allowedParts(), okG = r === 'g' && gameById(id) && gameAllowed(gameById(id)); if (!(r === 'me' || okG || ap.includes(r))) { location.replace('#/' + ap[0]); return; } }
  if (r === 'g') { updateTop('a'); const g = gameById(id); $$('.nav a').forEach(a => a.classList.toggle('on', g && a.dataset.n === g.part.toLowerCase())); mountGame(id, view()); return; }
  updateTop(r);
  if (r === 'home') home(); else if (r === 'a' || r === 'b' || r === 'c') partPage(r.toUpperCase()); else if (r === 'me') mePage(); else if (r === 't' && IS_TEACHER) teacherPage(view()); else home();
}
document.addEventListener('click', e => { const t = e.target.closest('[data-g]'); if (t) { location.hash = '#/g/' + t.dataset.g; } });
window.addEventListener('hashchange', router);
shell(); router();
