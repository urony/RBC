'use strict';
/* ===== מצב מורה: קישורים, איסוף תוצאות, ספריית מקרים ===== */
const TStore = {
  d: { rows: [] },
  load() { try { const s = localStorage.getItem(CFG.TEACHER_STORE); if (s) this.d = JSON.parse(s); } catch (e) { } },
  save() { try { localStorage.setItem(CFG.TEACHER_STORE, JSON.stringify(this.d)); } catch (e) { } },
  add(o) { const key = o.n + '|' + o.c; const i = this.d.rows.findIndex(r => (r.n + '|' + r.c) === key); if (i >= 0) { if ((this.d.rows[i].t || 0) <= o.t) this.d.rows[i] = o; else return 'old'; } else this.d.rows.push(o); this.save(); return i >= 0 ? 'upd' : 'new'; },
  clear() { this.d.rows = []; this.save(); },
};
TStore.load();
const GAME_TITLE = id => { const g = gameById(id); return g ? g.title : id; };

function teacherPage(root) {
  const base = location.origin === 'null' || location.protocol === 'file:' ? location.href.split('?')[0] : location.origin + location.pathname;
  const studentLink = base, teacherLink = base + '?t=' + CFG.TEACHER_KEY;
  const rows = TStore.d.rows;
  const allG = GAMES.map(g => g.id);
  const avgOf = r => { const v = Object.values(r.g).map(x => x[0]); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0; };
  const mis = {}; rows.forEach(r => Object.keys(r.m || {}).forEach(k => mis[k] = (mis[k] || 0) + r.m[k]));
  const topMis = Object.entries(mis).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const perGame = allG.map(id => { const v = rows.map(r => r.g[id] ? r.g[id][0] : null).filter(x => x != null); return { id, n: v.length, avg: v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null }; });
  root.innerHTML = `<h1>🎓 מצב מורה</h1>
    ${say('כאן הפתרונות מוצגים בכל המשחקים (סימון "מפתח"), וכאן אפשר לאסוף את התוצאות של התלמידים.', 'happy')}
    <div class="card"><h2>🔗 קישורים</h2>
      <p class="small muted">קישור לתלמידים (בלי פתרונות):</p><div class="row"><input type="text" readonly value="${esc(studentLink)}" style="direction:ltr;flex:1"><button class="btn sm" data-cp="${esc(studentLink)}">העתקה</button></div>
      <p class="small muted" style="margin-top:12px">קישור למורה (עם פתרונות וטופס איסוף תוצאות):</p><div class="row"><input type="text" readonly value="${esc(teacherLink)}" style="direction:ltr;flex:1"><button class="btn sm" data-cp="${esc(teacherLink)}">העתקה</button></div>
      <div class="explain" style="margin-top:12px">ℹ️ קישור המורה מוגן רק במילת סוד בכתובת (<span class="ltr">?t=${CFG.TEACHER_KEY}</span>). זו הגנה פשוטה למניעת כניסה בטעות – לא הגנה אמיתית: תלמיד סקרן שיקרא את קוד הדף יוכל למצוא את המילה. אפשר להחליף את המילה במשתנה <span class="ltr">TEACHER_KEY</span> בתחילת הקוד.</div></div>
    <div class="card"><h2>✂️ קישורים נפרדים לכל חלק</h2>
      <p class="small muted">כל קישור פותח לתלמידים רק את מה שנבחר, בלי שיראו את שאר החלקים. אפשר גם לחבר כמה חלקים: <span class="ltr">?only=a,c</span></p>
      ${[['a', '📘 חלק א׳ – חזרה אינטראקטיבית על עקרונות חשובים'], ['b', '🧪 חלק ב׳ – אבחון מבדיקות דם'], ['c', '🚑 חלק ג׳ – תורנות מיון']].map(([k, t]) => { const l = base + '?only=' + k; return `<p class="small" style="margin:12px 0 4px"><b>${t}</b></p><div class="row"><input type="text" readonly value="${esc(l)}" style="direction:ltr;flex:1"><button class="btn sm" data-cp="${esc(l)}">העתקה</button></div>`; }).join('')}
      <details style="margin-top:14px"><summary><b>קישור למשחק בודד</b></summary>${GAMES.map(g => { const l = base + '?only=' + g.id; return `<p class="small" style="margin:10px 0 4px">${g.icon} ${g.title}</p><div class="row"><input type="text" readonly value="${esc(l)}" style="direction:ltr;flex:1"><button class="btn sm" data-cp="${esc(l)}">העתקה</button></div>`; }).join('')}</details></div>
    <div class="card"><h2>📥 איסוף תוצאות תלמידים</h2>
      <p class="small muted">כל תלמיד לוחץ על "שליחת תוצאות" ומעביר לכם קוד שמתחיל ב-HL1. הדביקו כאן קוד אחד או כמה (מופרדים בשורות).</p>
      <textarea id="paste" placeholder="הדביקו כאן קודים…" style="direction:ltr"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primary grow" id="imp">ייבוא</button><button class="btn" id="csv" ${rows.length ? '' : 'disabled'}>⬇️ CSV</button><button class="btn ghost" id="clr" ${rows.length ? '' : 'disabled'}>🗑️ ניקוי</button></div>
      <p class="small muted" style="margin-top:8px">הנתונים נשמרים בדפדפן שלכם בלבד, במכשיר הזה.</p></div>
    ${rows.length ? `<div class="card"><h2>👩‍🎓 תלמידים (${rows.length})</h2><div style="overflow-x:auto"><table class="lab"><thead><tr><th>שם</th><th>כיתה</th><th>משחקים</th><th>ממוצע</th><th></th></tr></thead><tbody>${rows.map((r, i) => `<tr><td>${esc(r.n)}</td><td>${esc(r.c)}</td><td class="v">${Object.keys(r.g).length}/${allG.length}</td><td class="v">${avgOf(r)}%</td><td><button class="btn sm" data-st="${i}">פרטים</button></td></tr>`).join('')}</tbody></table></div></div>
      <div class="card"><h2>📈 ממוצע כיתתי לפי משחק</h2>${perGame.map(g => `<div class="meter"><div class="nm small">${GAME_TITLE(g.id)} <span class="muted">(${g.n})</span></div><div class="bar"><i style="width:${g.avg || 0}%"></i></div><b class="small" style="width:44px;text-align:end">${g.avg == null ? '–' : g.avg + '%'}</b></div>`).join('')}</div>
      <div class="card"><h2>⚠️ הטעויות הנפוצות בכיתה</h2>${topMis.length ? topMis.map(([k, n]) => `<div class="row sp" style="margin:6px 0"><span>${TAGS[k] || k}</span><span class="pill r">${n}</span></div>`).join('') : '<p class="muted">עדיין אין נתונים.</p>'}</div>` : ''}
    <div class="card"><h2>📚 ספריית מקרי תורנות המיון</h2><p class="small muted">כל המטופלים עם האבחנה, הבדיקות החיוניות ונקודת הלימוד.</p>
      ${CASES.map(c => `<details style="margin:8px 0"><summary><b>${c.emoji} ${c.name}</b>, ${c.age} – ${DXOPT[c.dx]} ${c.urgent ? '🚨' : ''}</summary><div class="small" style="padding:8px 4px"><p><b>תלונה:</b> ${c.cc}</p><p><b>בדיקות חיוניות:</b> ${c.must.map(k => TESTS[k].n).join(', ')}</p><p><b>טיפול נכון:</b> ${c.tx.find(x => x.ok).t}</p><p><b>נקודת לימוד:</b> ${c.teach}</p>${labRows(PANEL.cbc.concat(['RET']).concat(PANEL.iron, PANEL.vit, PANEL.hemo, PANEL.infl), caseLabs(c).vals, c.sex)}</div></details>`).join('')}</div>`;
  on(root, 'click', '[data-cp]', async (e, b) => { try { await navigator.clipboard.writeText(b.dataset.cp); toast('הועתק ✅'); } catch (er) { toast('סמנו והעתיקו ידנית'); } });
  const imp = $('#imp', root); if (imp) imp.onclick = () => {
    const lines = $('#paste', root).value.split(/\n+/); let n = 0, bad = 0;
    lines.forEach(l => { if (!l.trim()) return; const o = ResultCode.parse(l); if (o) { TStore.add(o); n++; } else bad++; });
    toast(n ? `יובאו ${n} תוצאות${bad ? ` (${bad} לא תקינות)` : ''}` : 'לא נמצאו קודים תקינים'); if (n) teacherPage(root);
  };
  const clr = $('#clr', root); if (clr) clr.onclick = () => { if (confirm('למחוק את כל התוצאות שנאספו? אי אפשר לשחזר.')) { TStore.clear(); teacherPage(root); } };
  const csv = $('#csv', root); if (csv) csv.onclick = () => {
    const head = ['שם', 'כיתה', 'ממוצע', ...allG.map(GAME_TITLE)];
    const lines = [head].concat(rows.map(r => [r.n, r.c, avgOf(r), ...allG.map(id => r.g[id] ? r.g[id][0] : '')]));
    const txt = '﻿' + lines.map(l => l.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv;charset=utf-8' })); a.download = 'results.csv'; a.click();
  };
  on(root, 'click', '[data-st]', (e, b) => {
    const r = rows[+b.dataset.st];
    modal(`<h2>${esc(r.n)} ${r.c ? '· ' + esc(r.c) : ''}</h2><p class="small muted">נשלח: ${new Date(r.t).toLocaleString('he-IL')}</p>${Object.keys(r.g).map(id => `<div class="meter"><div class="nm small">${GAME_TITLE(id)}</div><div class="bar"><i style="width:${r.g[id][0]}%"></i></div><b class="small" style="width:44px;text-align:end">${r.g[id][0]}%</b></div>`).join('') || '<p class="muted">אין משחקים.</p>'}
      <h3 style="margin-top:14px">טעויות נפוצות</h3>${Object.entries(r.m || {}).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => `<div class="row sp small" style="margin:4px 0"><span>${TAGS[k] || k}</span><span class="pill r">${n}</span></div>`).join('') || '<p class="muted small">אין.</p>'}`);
  });
}
