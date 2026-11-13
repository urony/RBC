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

/* ===== דף המורה: מסך הפתיחה של קובץ המורה ===== */
const PART_ICON = { A: '📘', B: '🧪', C: '🚑' };
function teacherPage(root) {
    const rows = TStore.d.rows;
  const allG = GAMES.map(g => g.id);
  const avgOf = r => { const v = Object.values(r.g).map(x => x[0]); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0; };
  const mis = {}; rows.forEach(r => Object.keys(r.m || {}).forEach(k => mis[k] = (mis[k] || 0) + r.m[k]));
  const topMis = Object.entries(mis).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const perGame = allG.map(id => { const v = rows.map(r => r.g[id] ? r.g[id][0] : null).filter(x => x != null); return { id, n: v.length, avg: v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null }; });
  const gameRow = g => `<div class="row sp" style="gap:8px;padding:8px 0;border-top:1px solid var(--line)"><div class="row" style="gap:10px;flex:1;min-width:0"><span style="font-size:1.6rem">${g.icon}</span><div style="min-width:0"><b>${g.title}</b><div class="muted small">${g.desc}</div></div></div><button class="btn sm primary" data-g="${g.id}">👁️ תשובות</button></div>`;
  const partCard = p => `<div class="card"><h2>${PART_ICON[p]} חלק ${PARTS[p].l}: ${PARTS[p].t}</h2>${GAMES.filter(g => g.part === p).map(gameRow).join('')}</div>`;
  root.innerHTML = `<h1>🎓 דף מורה</h1>
    ${say('כל התשובות כאן פתוחות מראש: בוחרים משחק ורואים את הפתרון המלא, בלי ללחוץ על כלום. במטופלים עוברים בין 1, 2, 3 וכן הלאה.', 'happy')}
    <div class="card" style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn primary grow" href="#/key">📋 מפתח תשובות מלא (להדפסה)</a><a class="btn grow" href="#results">📥 תוצאות תלמידים</a><a class="btn grow" href="#/certs">🎓 מחולל תעודות</a></div>
    ${['A', 'B', 'C'].map(partCard).join('')}    ${studentLinksCard()}

    <div class="card" id="results"><h2>📥 איסוף תוצאות תלמידים</h2>
      <p class="small muted">כל תלמיד לוחץ על "שליחת תוצאות" ומעביר לכם קוד שמתחיל ב-HL1. הדביקו כאן קוד אחד או כמה (מופרדים בשורות).</p>
      <textarea id="paste" placeholder="הדביקו כאן קודים…" style="direction:ltr"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primary grow" id="imp">ייבוא</button><button class="btn" id="csv" ${rows.length ? '' : 'disabled'}>⬇️ CSV</button><button class="btn ghost" id="clr" ${rows.length ? '' : 'disabled'}>🗑️ ניקוי</button></div>
      <p class="small muted" style="margin-top:8px">הנתונים נשמרים בדפדפן שלכם בלבד, במכשיר הזה.</p></div>
    ${rows.length ? `<div class="card"><h2>👩‍🎓 תלמידים (${rows.length})</h2><div style="overflow-x:auto"><table class="lab"><thead><tr><th>שם</th><th>כיתה</th><th>משחקים</th><th>ממוצע</th><th></th></tr></thead><tbody>${rows.map((r, i) => `<tr><td>${esc(r.n)}</td><td>${esc(r.c)}</td><td class="v">${Object.keys(r.g).length}/${allG.length}</td><td class="v">${avgOf(r)}%</td><td><button class="btn sm" data-st="${i}">פרטים</button></td></tr>`).join('')}</tbody></table></div></div>
      <div class="card"><h2>📈 ממוצע כיתתי לפי משחק</h2>${perGame.map(g => `<div class="meter"><div class="nm small">${GAME_TITLE(g.id)} <span class="muted">(${g.n})</span></div><div class="bar"><i style="width:${g.avg || 0}%"></i></div><b class="small" style="width:44px;text-align:end">${g.avg == null ? '–' : g.avg + '%'}</b></div>`).join('')}</div>
      <div class="card"><h2>⚠️ הטעויות הנפוצות בכיתה</h2>${topMis.length ? topMis.map(([k, n]) => `<div class="row sp" style="margin:6px 0"><span>${TAGS[k] || k}</span><span class="pill r">${n}</span></div>`).join('') : '<p class="muted">עדיין אין נתונים.</p>'}</div>` : ''}`;
  on(root, 'click', '[data-cp]', async (e, b) => { try { await navigator.clipboard.writeText(b.dataset.cp); toast('הועתק ✅'); } catch (er) { toast('סמנו והעתיקו ידנית'); } });
  const rs = $('a[href="#results"]', root); if (rs) rs.onclick = e => { e.preventDefault(); $('#results', root).scrollIntoView({ behavior: 'smooth' }); };
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

/* ===== מבט מורה על משחק: כל התשובות פתוחות מראש ===== */
const optsKey = (q, opts) => `<div class="q" style="margin-top:12px">${q}</div>` + opts.map(o => o.ok ? `<div class="explain good" style="margin:6px 0">✅ <b>${o.t}</b>${o.why ? `<div class="small">${o.why}</div>` : ''}</div>` : `<div class="small" style="margin:6px 12px;color:var(--muted)">✗ ${o.t}${o.why ? ` <span class="muted">– ${o.why}</span>` : ''}</div>`).join('');

function teacherCmpTable() {
  const cols = ['ida', 'mega', 'hemo', 'acd', 'aplastic'];
  return `<div class="card" style="overflow-x:auto;padding:10px"><p class="small muted">בכל האנמיות ההמוגלובין נמוך. שתי תשובות בתא = שתיהן מתקבלות.</p><table class="cmp"><thead><tr><th>מדד</th>${cols.map(c => `<th>${ANEMIA_CATS[c].ic}<br><span class="small">${ANEMIA_CATS[c].short}</span></th>`).join('')}</tr></thead><tbody>${CMP_ROWS.map(r => `<tr><th class="small">${r[0]}</th>${cols.map(c => `<td><b>${r[1][c].join(' / ')}</b></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function teacherCardsView() {
  const SECN = { mech: '⚙️ מנגנון', causes: '🧩 גורמים', clin: '🩺 קליניקה', dx: '🧪 אבחון', tx: '💊 טיפול', comp: '⚠️ סיבוכים' };
  return Object.keys(ANEM_CARDS).map(k => { const C = ANEM_CARDS[k], I = ANEMIA_CATS[k]; return `<details class="card" open><summary><b>${I.ic} ${I.n}</b></summary>${Object.keys(SECN).filter(x => C[x]).map(x => `<p style="margin:10px 0 2px"><b>${SECN[x]}</b></p>${Array.isArray(C[x]) ? `<ul class="small" style="padding-inline-start:20px;margin:0">${C[x].map(t => `<li>${t}</li>`).join('')}</ul>` : `<p class="small" style="margin:0">${C[x]}</p>`}`).join('')}</details>`; }).join('');
}
function teacherEpoView(E) {
  return `<h3 style="margin:14px 0 6px">✅ התרחישים והתשובות</h3>` + E.SCN.map(s => `<div class="card"><h3>${s.ic} ${s.t}</h3><div class="explain good">✅ <b>${E.EO[s.epo]}</b> · מספר תאי הדם האדומים <b>${E.FO[s.fin]}</b><div class="small">${s.exp}</div></div></div>`).join('');
}
function teacherBankView(body, B) {
  let cur = 0; const host = el('<div></div>'); body.appendChild(host);
  function render() {
    host.innerHTML = ''; host.appendChild(jumpBar(B.rounds.length, cur, [], j => { cur = j; render(); window.scrollTo(0, 0); }));
    const R = B.rounds[cur], p = R.pt, isOk = u => R.emergency ? (u.abo === 'O' && !u.rh) : B.safe(u, p);
    host.insertAdjacentHTML('beforeend', `<div class="card"><div class="patient-head">${R.emergency ? '<div class="avatar">🚑</div>' : bloodCellABO(p.abo, p.rh, 64)}<div><h3 style="margin:0">מטופל ${cur + 1} מתוך ${B.rounds.length}: ${R.emergency ? 'חירום! דימום מסיבי, סוג הדם לא ידוע' : `סוג דם ${B.lbl(p)}`}</h3>${R.emergency ? '' : `<div class="muted small">נוגדנים טבעיים: ${B.anti(p.abo)}${p.rh ? '' : ' · Rh שלילי: לא יקבל Rh חיובי'}</div>`}</div></div>
      <div class="q" style="margin-top:12px">אילו יחידות דם מתאימות? (מסומנות בירוק)</div>
      <div class="grid">${R.units.map(u => { const ok = isOk(u); return `<div class="tile ${ok ? 't-ok' : ''}" style="align-items:center;min-height:120px;${ok ? 'border-color:var(--good);background:var(--good-soft)' : ''}">${bloodCellABO(u.abo, u.rh, 56)}<b class="ltr">${u.abo}${u.rh ? '+' : '−'}</b><span class="small">${ok ? '✅ מתאימה' : (!B.aboOK(u.abo, p.abo) ? '✗ נוגדנים נגד האנטיגן הזר' : '✗ Rh חיובי למקבל Rh שלילי')}</span></div>`; }).join('')}</div>
      ${R.emergency ? '<div class="explain good" style="margin-top:10px">O שלילי הוא "התורם האוניברסלי": אין עליו אנטיגני A, B או D.</div>' : ''}</div>`);
  }
  render();
}

function teacherGameView(g, body, mkCtx) {
  if (g.part === 'B') return teacherLabView(g, body);
  if (g.part === 'C') return teacherShiftView(g, body);
  let special = '';
  if (g.id === 'a_cards') special = teacherCardsView();
  if (g.id === 'a_compare' || g.id === 'a_reverse') special = teacherCmpTable();
  if (g.id === 'a_epo' || g.id === 'a_bank') {
    const host = el('<div></div>'); body.appendChild(host);
    g.mount(el('<div></div>'), { ...mkCtx(g, host), tview: v => { if (g.id === 'a_epo') host.innerHTML = teacherEpoView(v); else teacherBankView(host, v); } });
  }
  const dyn = g.id === 'a_review' || g.id === 'a_exam';
  if (dyn) special = '<div class="card soft small">משחק שנבנה מהשאלות של שאר המשחקים בחלק א׳. אפשר להפעיל אותו ולנסות. התשובות הנכונות של כל השאלות מופיעות במפתח של המשחקים האחרים.</div>';
  const d = dyn ? null : collectKey([g])[0];
  const learned = g.learned && g.learned.length ? `<div class="card learned"><h3>📚 מה למדנו (מה שהתלמיד רואה בסיום)</h3><ul>${g.learned.map(x => `<li>${x}</li>`).join('')}</ul></div>` : '';
  const key = d ? gameKeyBlock(d, null, true) : '';
  const hasKey = d && (d.q.length || d.o.length || d.b.length || d.m.length);
  body.insertAdjacentHTML('beforeend', special + (hasKey ? `<h3 style="margin:14px 0 6px">✅ כל התשובות הנכונות</h3>` + key : (special || g.id === 'a_epo' || g.id === 'a_bank') ? '' : '<div class="card soft small">משחק סימולציה: אין שאלות עם תשובה אחת נכונה. הסבר המשחק מופיע ב"הערה למורה" למעלה, ואפשר להפעיל אותו ולנסות בעצמכם.</div>') + learned);
  const play = el('<div class="card"><button class="btn primary block" id="tplay">▶ הפעלת המשחק (עם סימון התשובות)</button><div id="tgame" style="margin-top:12px"></div></div>');
  body.appendChild(play);
  $('#tplay', play).onclick = () => { $('#tplay', play).remove(); const host = $('#tgame', play); g.mount(host, mkCtx(g, host)); };
}

function teacherLabView(g, body) {
  const mode = { b_l1: 1, b_l2: 2, b_l3: 3 }[g.id] || 1, edge = mode === 2;
  let types = labTypes(mode === 3 ? 7 : 8).slice(0, mode === 3 ? 7 : 8), pats = [], cur = 0;
  const host = el('<div></div>'); body.appendChild(host);
  function render() {
    host.innerHTML = '';
    host.appendChild(jumpBar(types.length, cur, [], j => { cur = j; render(); window.scrollTo(0, 0); }));
    const type = types[cur], p = pats[cur] || (pats[cur] = makePatient(type, edge)), info = DX_INFO[p.cat], sub = SUBDX[p.cat];
    const subTxt = sub ? (() => { const k = sub.ok(p.cat === 'mega' ? p.vals : p); return `<br><b>${sub.q.replace(/^ומה /, 'ולכן ')}</b> ${sub.opts[k][0]}<div class="small muted">${sub.opts[k][1]}</div>`; })() : '';
    resetLabNote();
    let h = `<div class="card"><div class="patient-head"><div class="avatar">${p.sex === 'F' ? '👩' : '👨'}</div><div><h3 style="margin:0">מטופל ${cur + 1} מתוך ${types.length}: ${TYPE_NAME[type]}</h3><div class="muted">${patientLine(p)}</div></div></div></div>`;
    const keys = mode === 3 ? ['cbc', 'retic'] : ['cbc', 'retic', 'iron', 'vit', 'hemo', 'infl'];
    h += keys.map(k => panelCard(p, PANEL[k], PANEL_NAMES[k])).join('');
    if (mode === 1) h += smearCard(p);
    if (mode === 1) { const mcv = p.vals.MCV, cls = mcv < 80 ? 'מיקרוציטית (תאים קטנים)' : mcv > 100 ? 'מאקרוציטית (תאים גדולים)' : 'נורמוציטית (גודל תקין)'; h += `<div class="card flat" style="padding:12px;margin-top:8px"><div class="q">שלב 1: סוג האנמיה לפי MCV</div><div class="explain good" style="margin:6px 0">✅ <b>${cls}</b><div class="small">MCV ${mcv} fL (תקין 80–100)</div></div></div>`; }
    if (mode === 3) { const best = NEXT_OK[type][0], kk = { iron: 'iron', vit: 'vit', hemo: 'hemo', infl: 'infl' }[best]; h += `<div class="card flat" style="padding:12px;margin-top:8px"><div class="q">הבדיקה הבאה הנכונה</div><div class="explain good" style="margin:6px 0">✅ <b>${NEXT_OPTS[best]}</b><div class="small">${NEXT_WHY[best]}</div></div>${best === 'marrow' ? `<p>${p.cat === 'aplastic' ? 'מח עצם <b>היפוצלולרי</b>: רקמת שומן במקום תאים מייצרי דם.' : ''}</p>` : panelCard(p, PANEL[kk], PANEL_NAMES[kk])}</div>`; }
    h += `<div class="card flat" style="padding:12px;margin-top:8px"><div class="q">${mode === 1 ? 'שלב 2: ' : ''}מהי האנמיה?</div><div class="explain good" style="margin:6px 0">✅ <b>${CATOPT(p.cat)}</b>${subTxt}</div><b class="small">מה מצביע על כך כאן:</b>${labRows(info.key, p.vals, p.sex, info.key)}<ul class="small" style="padding-inline-start:20px;margin:8px 0 0">${info.pts.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
    if (mode !== 1) h += smearCard(p);
    h += `<button class="btn block" id="newp" style="margin-top:10px">🔄 מטופל חדש במקום זה</button>`;
    host.insertAdjacentHTML('beforeend', h);
    $('#newp', host).onclick = () => { pats[cur] = null; render(); };
  }
  render();
}

function teacherShiftView(g, body) {
  const S = Object.values(SHIFTS).find(x => x.id === g.id), cases = S.ids.map(id => CASES.find(c => c.id === id));
  let cur = 0; const host = el('<div></div>'); body.appendChild(host);
  function render() {
    host.innerHTML = '';
    host.appendChild(jumpBar(cases.length, cur, [], j => { cur = j; render(); window.scrollTo(0, 0); }));
    const c = cases[cur], p = caseLabs(c), v = c.vitals;
    resetLabNote();
    const shown = Object.keys(TESTS).filter(k => c.must.includes(k) || c.useful.includes(k));
    host.insertAdjacentHTML('beforeend', `<div class="card"><div class="patient-head">${ART['patient_' + c.id] ? `<img class="avatar" src="${ART['patient_' + c.id]}" alt="${c.name}">` : `<div class="avatar">${c.emoji}</div>`}<div><h3 style="margin:0">מטופל ${cur + 1} מתוך ${cases.length}: ${c.name}, ${c.sex === 'F' ? 'בת' : 'בן'} ${c.age}</h3><div class="muted small">${c.quip}</div></div></div>
      <p style="margin:10px 0 4px"><b>תלונה:</b> ${c.cc}</p><p class="small muted">דופק ${v.hr} · לחץ דם ${v.bp} · סטורציה ${v.spo2}% · חום ${v.temp}</p>
      <div class="explain good"><b>האבחנה:</b> ${DXOPT[c.dx]}${c.urgent ? ' · <b>🚨 חירום</b>' : ''}<div class="small">📌 ${c.teach}</div></div></div>
      <div class="card"><h3>💬 אנמנזה</h3>${c.hist.map(h => `<div class="qa"><span class="muted small">${h[0]}</span><br>${h[1]}</div>`).join('')}</div>
      <div class="card"><h3>🩺 בדיקה גופנית</h3>${ART['exam_' + c.id] ? `<img src="${ART['exam_' + c.id]}" alt="" style="width:100%;border-radius:14px"><p class="small muted">${EXAMCAP[c.id] || ''}</p>` : ''}<ul style="padding-inline-start:20px;margin:0">${c.exam.map(x => `<li style="margin:6px 0">${x}</li>`).join('')}</ul></div>
      <div class="card"><h3>🧪 בדיקות דם</h3><p class="small muted">בדיקות חיוניות מסומנות ב-⭐:</p>${shown.map(k => `<div class="slip"><b>${TESTS[k].ic} ${TESTS[k].n}${c.must.includes(k) ? ' ⭐' : ''}</b>${testHTML(c, p, k)}</div>`).join('')}</div>
      <div class="card"><h3>✅ אבחנה, סיבה וטיפול</h3>${optsKey('מהי האבחנה?', Object.keys(DXOPT).map(k => ({ t: DXSHORT[k], ok: k === c.dx })))}${optsKey(c.cause[0], c.cause[1])}${optsKey('מה הטיפול המתאים?', c.tx)}</div>`);
  }
  render();
}


/* ===== מפתח תשובות: נאסף אוטומטית מהמשחקים (חלק א׳) + סיכום לחלקים ב׳ וג׳ ===== */
/* חילוץ שאלות שמוסתרות מאחורי שלבי משחק: קוראים את מערכי השאלות מקוד הפונקציה עצמה */
function litEnd(src, start) {
  let d = 0, q = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; }
    else if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === '[' || c === '{' || c === '(') d++;
    else if (c === ']' || c === '}' || c === ')') { d--; if (d === 0) return i + 1; }
  }
  return -1;
}
function litItems(src) {
  const out = [], re = /runQuiz\(\s*\w+\s*,\s*\w+\s*,\s*\[/g; let m;
  while ((m = re.exec(src))) {
    const st = m.index + m[0].length - 1, en = litEnd(src, st);
    if (en < 0) continue;
    try { const arr = new Function('fig', 'return ' + src.slice(st, en))(fig); arr.forEach(x => out.push(x)); } catch (e) { }
  }
  return out;
}
function collectKey(list) {
  const names = ['runQuiz', 'mcq', 'orderGame', 'binGame', 'matchGame', 'sortGame'];
  const saved = {}; names.forEach(n => saved[n] = window[n]);
  const res = []; let cur = null;
  const dummy = () => document.createElement('div');
  const go = fn => { try { fn(); } catch (e) { } };
  window.runQuiz = (root, ctx, items) => { items.forEach(it => cur.q.push(it)); };
  window.mcq = (p, spec) => { cur.q.push(spec); return dummy(); };
  window.orderGame = (r, o) => { cur.o.push(o.steps); go(() => o.onDone && o.onDone(100)); };
  window.binGame = (r, o) => { cur.b.push(o); go(() => o.onDone && o.onDone(100)); };
  window.sortGame = (r, o) => { cur.b.push(o); go(() => o.onDone && o.onDone(100)); };
  window.matchGame = (r, o) => { cur.m.push(o.pairs); go(() => o.onDone && o.onDone(100)); };
  (list || GAMES.filter(g => g.part === 'A' && g.id !== 'a_review' && g.id !== 'a_exam')).forEach(g => {
    cur = { g, q: [], o: [], b: [], m: [] };
    const root = dummy();
    go(() => g.mount(root, { game: g, root, teacher: true, finish() { } }));
    go(() => litItems(g.mount.toString()).forEach(it => { if (!cur.q.some(x => x.q === it.q)) cur.q.push(it); }));
    res.push(cur);
  });
  names.forEach(n => window[n] = saved[n]);
  return res;
}
function keyHTML() {
  const data = collectKey();
  const qli = it => { const r = it.options.filter(o => o.ok); return `<li><div>${it.q}</div><div class="kans">✔ ${r.map(o => o.t).join(' ; ')}</div>${r[0] && r[0].why ? `<div class="small muted">${r[0].why}</div>` : ''}</li>`; };
  let h = '<h1>📋 מפתח תשובות</h1><p class="small muted">חלק א׳ נאסף אוטומטית מהמשחקים (כך שהוא תמיד מעודכן). בחלק ב׳ המטופלים נוצרים אקראית בכל פעם, ולכן מופיעים כאן הכללים והדפוסים; בחלק ג׳ מופיעים כל המקרים.</p>';
  h += '<h2>📘 חלק א׳</h2>';
  data.forEach(d => { h += gameKeyBlock(d, qli); });
  h += KEY_REST(); return h;
}
function gameKeyBlock(d, qli, noNote) {
  qli = qli || (it => { const r = it.options.filter(o => o.ok); return `<li><div>${it.q}</div><div class="kans">✔ ${r.map(o => o.t).join(' ; ')}</div>${r[0] && r[0].why ? `<div class="small muted">${r[0].why}</div>` : ''}</li>`; });
  let h = '';
  {
    h += `<div class="card"><h3>${d.g.icon} ${d.g.title}</h3>${d.g.teacherNote && !noNote ? `<p class="small"><b>הערה למורה:</b> ${d.g.teacherNote}</p>` : ''}`;
    d.b.forEach(b => { h += `<p class="small"><b>מיון:</b></p><ul class="small">${b.buckets.map((bk, k) => `<li><b>${bk}:</b> ${b.items.filter(i => i.b === k).map(i => i.t).join(' · ')}</li>`).join('')}</ul>`; });
    d.o.forEach(st => { h += `<p class="small"><b>סדר נכון:</b></p><ol class="small">${st.map(x => `<li>${x}</li>`).join('')}</ol>`; });
    d.m.forEach(pr => { h += `<p class="small"><b>התאמות:</b></p><ul class="small">${pr.map(p => `<li>${p[0]} ← ${p[1]}</li>`).join('')}</ul>`; });
    if (d.q.length) h += `<p class="small"><b>שאלות (${d.q.length}):</b></p><ol class="kq small">${d.q.map(qli).join('')}</ol>`;
    h += '</div>';
  }
  return h;
}
function KEY_REST() {
  let h = '';
  h += '<h2>🧪 חלק ב׳: כללי האבחון</h2>';
  Object.keys(ANEMIA_CATS).forEach(k => { const di = DX_INFO[k]; if (!di) return; h += `<div class="card"><h3>${ANEMIA_CATS[k].ic} ${ANEMIA_CATS[k].n}</h3>${di.need ? `<p class="small"><b>נדרש לאבחון:</b> ${di.need}</p>` : ''}<ul class="small">${(di.pts || []).map(x => `<li>${x}</li>`).join('')}</ul></div>`; });
  h += '<h2>🚑 חלק ג׳: כל המקרים</h2>';
  CASES.forEach(c => { h += `<div class="card"><h3>${c.emoji} ${c.name}, ${c.age} – ${DXOPT[c.dx]} ${c.urgent ? '🚨' : ''}</h3><p class="small"><b>תלונה:</b> ${c.cc}</p><p class="small"><b>בדיקות חיוניות:</b> ${c.must.map(k => TESTS[k].n).join(', ')}</p><p class="small"><b>טיפול נכון:</b> ${c.tx.find(x => x.ok).t}</p><p class="small"><b>נקודת לימוד:</b> ${c.teach}</p></div>`; });
  return h;
}
function keyPage(root) {
  root.innerHTML = `<div class="row noprint" style="margin-bottom:10px"><a class="btn sm" href="#/home">→ חזרה</a><button class="btn sm primary grow" id="kp">🖨️ הדפסה / PDF</button><button class="btn sm grow" id="kd">⬇️ שמירה כקובץ</button></div><div id="kbody">${keyHTML()}</div>`;
  $('#kp', root).onclick = () => window.print();
  $('#kd', root).onclick = () => {
    const doc = `<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><title>מפתח תשובות</title><body style="font-family:Arial,sans-serif;max-width:800px;margin:auto;padding:16px;line-height:1.5">${$('#kbody', root).innerHTML}</body></html>`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([doc], { type: 'text/html;charset=utf-8' })); a.download = 'answer-key.html'; a.click();
  };
}

/* ===== מחולל תעודות למורה: שמות, סוג תעודה, נושא; הדפסה או PDF לכולם בבת אחת ===== */
function certsPage(root) {
  const D = { kind: 'part', what: '', free: '', pct: '', sig: '', dr: null, sel: 0 };
  try { const s = JSON.parse(localStorage.getItem('hemolab_certgen') || '{}'); Object.assign(D, s, { sel: 0 }); } catch (e) { }
  const names = () => ($('#cnames', root).value || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
  root.innerHTML = `<button class="back" data-back>→ חזרה לדף המורה</button><h1>🎓 מחולל תעודות</h1>
    <div class="card"><p class="small muted" style="margin-top:0">כותבים שם בכל שורה, בוחרים סוג תעודה ונושא, ומדפיסים. כל תלמיד מקבל עמוד משלו; בחלון ההדפסה אפשר לבחור "שמירה כ-PDF".</p>
      <label class="small"><b>שמות התלמידים</b> (שם בכל שורה)</label><textarea id="cnames" placeholder="נועה כהן&#10;דני לוי" style="min-height:110px">${esc(D.names || '')}</textarea>
      <label class="small"><b>סוג תעודה</b></label><select id="ckind"><option value="part">תעודת השתתפות</option><option value="done">תעודת סיום</option><option value="excel">תעודת הצטיינות</option></select>
      <label class="small"><b>על מה?</b></label><select id="cwhat"><option value="">הכלי כולו (מעבדת הדם)</option>${GAMES.map(g => `<option value="${g.id}">${esc(g.title)}</option>`).join('')}</select>
      <input type="text" id="cfree" placeholder="או נושא חופשי, למשל: שיעור המטולוגיה, פרק אנמיות (לא חובה)" maxlength="60" style="margin-top:6px">
      <div class="row" style="margin-top:6px;gap:8px"><input type="number" id="cpct" placeholder="ציון (לא חובה)" min="0" max="100" style="flex:1"><input type="text" id="csig" placeholder="שם החותם/ת, למשל: המורה דנה" maxlength="30" style="flex:2"></div>
      <label class="row small" style="margin-top:8px;gap:8px"><input type="checkbox" id="cdr" style="width:auto"> להוסיף "ד״ר" לפני השם</label></div>
    <div class="card"><div class="row sp"><b>תצוגה מקדימה</b><span class="small muted" id="cnt"></span></div><div id="cchips" class="row" style="gap:6px;flex-wrap:wrap;margin:8px 0"></div><div id="cprev"></div>
      <div class="row" style="margin-top:12px"><button class="btn primary grow" id="cprintall">🖨️ הדפסה / PDF לכולם</button><button class="btn grow" id="cpng1">⬇️ תמונה לתלמיד המוצג</button></div></div>`;
  $('#ckind', root).value = D.kind; $('#cwhat', root).value = D.what; $('#cfree', root).value = D.free; $('#cpct', root).value = D.pct; $('#csig', root).value = D.sig;
  $('#cdr', root).checked = D.dr == null ? D.kind === 'excel' : !!D.dr;
  const build = nm => {
    const g = $('#cwhat', root).value ? gameById($('#cwhat', root).value) : null, free = $('#cfree', root).value.trim(), pct = $('#cpct', root).value;
    return { name: nm, kind: $('#ckind', root).value, dr: $('#cdr', root).checked, what: free || (g ? 'משחק ' + g.title : 'מעבדת הדם'), pct: pct === '' ? null : Math.max(0, Math.min(100, +pct)), sig: 'חתימת ' + ($('#csig', root).value.trim() || 'המורה'), date: new Date().toLocaleDateString('he-IL'), sub: free ? 'מעבדת הדם' : undefined };
  };
  const refresh = () => {
    const n = names(); D.sel = Math.min(D.sel, Math.max(0, n.length - 1));
    $('#cnt', root).textContent = n.length ? `${n.length} תעודות` : 'עוד אין שמות';
    $('#cchips', root).innerHTML = n.map((x, i) => `<button type="button" class="btn small${i === D.sel ? ' primary' : ''}" data-i="${i}">${esc(x)}</button>`).join('');
    $('#cprev', root).innerHTML = certHTML(build(n[D.sel] || ''));
    ['cprintall', 'cpng1'].forEach(id => $('#' + id, root).disabled = !n.length);
    try { localStorage.setItem('hemolab_certgen', JSON.stringify({ names: $('#cnames', root).value, kind: $('#ckind', root).value, what: $('#cwhat', root).value, free: $('#cfree', root).value, pct: $('#cpct', root).value, sig: $('#csig', root).value, dr: $('#cdr', root).checked })); } catch (e) { }
  };
  ['cnames', 'ckind', 'cwhat', 'cfree', 'cpct', 'csig', 'cdr'].forEach(id => { $('#' + id, root).addEventListener('input', refresh); $('#' + id, root).addEventListener('change', refresh); });
  $('#ckind', root).addEventListener('change', () => { $('#cdr', root).checked = $('#ckind', root).value === 'excel'; refresh(); });
  $('[data-back]', root).onclick = () => location.hash = '#/home';
  $('#cchips', root).onclick = e => { const b = e.target.closest('[data-i]'); if (b) { D.sel = +b.dataset.i; refresh(); } };
  $('#cprintall', root).onclick = () => printCerts(names().map(build));
  $('#cpng1', root).onclick = () => { const n = names(); certPng(build(n[D.sel])); };
  refresh();
}

/* ===== קישורים לתלמידים: מהדף הזה המורה מעתיק קישור לכל הכלי, לחלק או למשחק בודד ===== */
function studentUrl(rel) { try { return new URL(STUDENT_BASE + rel, location.href).href; } catch (e) { return STUDENT_BASE + rel; } }
function studentLinksCard() {
  const row = (label, rel) => `<div class="row" style="gap:6px;margin:6px 0;align-items:center"><span class="small" style="flex:0 0 38%">${label}</span><input type="text" readonly value="${esc(studentUrl(rel))}" style="direction:ltr;flex:1;min-width:0"><button class="btn sm" data-cp="${esc(studentUrl(rel))}">העתקה</button><a class="btn sm" href="${esc(studentUrl(rel))}" target="_blank" rel="noopener">פתיחה</a></div>`;
  return `<div class="card" id="slinks"><h2>🔗 קישורים לתלמידים</h2><p class="small muted" style="margin-top:0">קישורים לגרסת התלמיד (בלי תשובות ובלי כניסת מורה). מעתיקים ושולחים.</p>
    ${row('🧬 הכלי כולו', 'index.html')}${['A', 'B', 'C'].map(p => row(PART_ICON[p] + ' חלק ' + PARTS[p].l + ' כולו', 'parts/part-' + p + '.html')).join('')}
    <details style="margin-top:8px"><summary><b>משחק בודד</b></summary>${GAMES.map(g => row(g.icon + ' ' + g.title.split(':')[0], 'parts/game-' + g.id + '.html')).join('')}</details></div>`;
}
