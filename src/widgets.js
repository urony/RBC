'use strict';
/* ===== רכיבי משחק משותפים: סידור לפי סדר, מיון, התאמה, מד, גרף ===== */

/* סידור שלבים לפי הסדר הנכון (לחיצה על שלב מציבה אותו במשבצת הבאה) */
function orderGame(root, { steps, hint, tag, onDone }) {
  const N = steps.length, order = shuffle(steps.map((_, i) => i));
  let placed = [], first = null, checked = false;
  const host = el('<div class="card"></div>'); root.appendChild(host);
  function draw() {
    host.innerHTML = `<p class="muted small">${hint || 'לחצו על השלבים לפי הסדר הנכון. לחיצה על שלב שהוצב מחזירה אותו.'}</p>
      <div class="col" id="slots">${Array.from({ length: N }, (_, p) => {
        const idx = placed[p]; const cls = idx == null ? '' : 'fill' + (checked ? (idx === p ? ' ok' : ' no') : '');
        return `<div class="slot ${cls}" data-p="${p}"><span class="n">${p + 1}</span><span>${idx == null ? '<span class="muted">…</span>' : steps[idx]}</span></div>`;
      }).join('')}</div>
      <h3 style="margin-top:16px">השלבים (בסדר מעורבב)</h3><div class="col" id="pool">${order.map(i => `<button class="sort-item ${placed.includes(i) ? 'used' : ''}" data-i="${i}" ${placed.includes(i) || checked ? 'disabled' : ''}>${steps[i]}</button>`).join('')}</div>
      <div class="row" style="margin-top:14px"><button class="btn primary grow" id="chk" ${placed.length < N || checked ? 'disabled' : ''}>בדיקה ✔</button><button class="btn" id="rst">איפוס</button></div><div id="res"></div>`;
    if (IS_TEACHER) host.insertAdjacentHTML('beforeend', `<div class="tnote"><b>סדר נכון:</b><ol style="margin:4px 0 0;padding-inline-start:20px">${steps.map(s => `<li>${s}</li>`).join('')}</ol></div>`);
  }
  draw();
  host.addEventListener('click', e => {
    const b = e.target.closest('[data-i]'), s = e.target.closest('[data-p]'), c = e.target.closest('#chk'), r = e.target.closest('#rst');
    if (checked && !r) return;
    if (b && placed.length < N) { placed.push(+b.dataset.i); draw(); }
    else if (s && placed[+s.dataset.p] != null) { placed.splice(+s.dataset.p, 1); draw(); }
    else if (r) { placed = []; checked = false; draw(); }
    else if (c && placed.length === N) {
      checked = true; draw();
      const right = placed.filter((v, p) => v === p).length, pct = Math.round(100 * right / N);
      if (first == null) first = pct;
      if (pct < 100) { Store.mistake(tag || 'bili_path'); }
      $('#res', host).innerHTML = `<div class="explain ${pct === 100 ? 'good' : 'bad'}">${pct === 100 ? '✅ סדר מושלם!' : `🤔 ${right} מתוך ${N} במקום הנכון. לחצו "איפוס" ונסו שוב, או המשיכו.`}</div><button class="btn primary block" id="go" style="margin-top:10px">המשך ←</button>`;
      $('#go', host).onclick = () => onDone(first);
    }
  });
}

/* מיון פריטים לשתי קבוצות – פריט אחד בכל פעם */
function sortGame(root, { items, buckets, tag, onDone }) {
  const list = shuffle(items); let i = 0, right = 0;
  const host = el('<div class="card"></div>'); root.appendChild(host);
  function draw() {
    if (i >= list.length) { onDone(Math.round(100 * right / list.length)); return; }
    const it = list[i];
    host.innerHTML = `<div class="row sp small muted"><span>${i + 1}/${list.length}</span><span>✓ ${right}</span></div><div class="bar" style="margin:8px 0 14px"><i style="width:${100 * i / list.length}%"></i></div>
      <div class="center" style="font-size:2.4rem">${it.e || ''}</div><div class="q center">${it.t}</div>
      <div class="row">${buckets.map((b, k) => `<button class="btn grow ${IS_TEACHER && it.b === k ? 't-ok' : ''}" data-k="${k}">${b}</button>`).join('')}</div><div id="fb"></div>`;
  }
  draw();
  host.addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b) { if (e.target.closest('#nx')) { i++; draw(); } return; }
    const it = list[i], ok = +b.dataset.k === it.b; if (ok) right++; else Store.mistake(tag);
    $$('[data-k]', host).forEach(x => x.disabled = true);
    b.classList.add(ok ? 'primary' : 'bad');
    $('#fb', host).innerHTML = `<div class="explain ${ok ? 'good' : 'bad'}">${ok ? '✅ ' : '🤔 '}${it.why}</div><button class="btn primary block" id="nx" style="margin-top:10px">הבא ←</button>`;
  });
}

/* התאמת זוגות: בוחרים פריט מימין ואז את התואם משמאל */
function matchGame(root, { pairs, tag, onDone, leftTitle = 'תסמין', rightTitle = 'מנגנון' }) {
  const L = shuffle(pairs.map((p, i) => i)), R = shuffle(pairs.map((p, i) => i));
  let sel = null, done = new Set(), tries = 0, wrong = 0;
  const host = el('<div class="card"></div>'); root.appendChild(host);
  function draw(flash) {
    host.innerHTML = `<p class="muted small">בחרו ${leftTitle} ואז את ה${rightTitle} שמתאים לו.</p><div class="row" style="align-items:flex-start;flex-wrap:nowrap">
      <div class="col grow" style="flex:1"><b class="small muted">${leftTitle}</b>${L.map(i => `<button class="sort-item ${sel === i ? 'pick' : ''} ${done.has(i) ? 'used' : ''}" data-l="${i}" ${done.has(i) ? 'disabled' : ''}>${pairs[i][0]}</button>`).join('')}</div>
      <div class="col grow" style="flex:1"><b class="small muted">${rightTitle}</b>${R.map(i => `<button class="sort-item ${done.has(i) ? 'used' : ''} ${IS_TEACHER && sel === i ? 'pick' : ''}" data-r="${i}" ${done.has(i) ? 'disabled' : ''}>${pairs[i][1]}</button>`).join('')}</div></div><div id="fb">${flash || ''}</div>`;
    if (IS_TEACHER) host.insertAdjacentHTML('beforeend', `<div class="tnote"><b>פתרון:</b><ul style="margin:4px 0 0;padding-inline-start:18px">${pairs.map(p => `<li>${p[0]} ← ${p[1]}</li>`).join('')}</ul></div>`);
  }
  draw();
  host.addEventListener('click', e => {
    const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
    if (l) { sel = +l.dataset.l; draw(); return; }
    if (r && sel != null) {
      tries++; const ri = +r.dataset.r;
      if (ri === sel) { done.add(sel); sel = null; if (done.size === pairs.length) { onDone(Math.max(0, Math.round(100 * (pairs.length - wrong) / pairs.length))); return; } draw('<div class="explain good">✅ התאמה נכונה!</div>'); }
      else { wrong++; Store.mistake(tag); draw(`<div class="explain bad">🤔 לא מתאים – נסו שוב.</div>`); }
    }
  });
}

/* מד אופקי */
function meter(label, pct, goodHigh = true) {
  const c = pct >= 80 ? 'var(--good)' : pct >= 45 ? 'var(--gold)' : 'var(--bad)';
  return `<div class="meter"><div class="nm">${label}</div><div class="bar"><i style="width:${clamp(pct, 0, 100)}%;background:${c}"></i></div><b class="small" style="width:38px;text-align:end">${Math.round(pct)}%</b></div>`;
}

/* גרף קו קטן (SVG) */
function lineChart(series, { w = 320, h = 120, yMin = 0, yMax = 100, ref = null, label = '' } = {}) {
  const pad = 22, X = (i, n) => pad + (w - pad - 8) * i / Math.max(1, n - 1), Y = v => h - 16 - (h - 28) * (v - yMin) / (yMax - yMin);
  let s = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><text x="${w - 6}" y="12" font-size="11" fill="var(--muted)" text-anchor="end">${esc(label)}</text>`;
  if (ref != null) s += `<line x1="${pad}" x2="${w - 8}" y1="${Y(ref)}" y2="${Y(ref)}" stroke="var(--muted)" stroke-dasharray="4 4" stroke-width="1"/>`;
  series.forEach(se => { if (se.pts.length > 1) s += `<polyline fill="none" stroke="${se.color}" stroke-width="2.6" stroke-linejoin="round" points="${se.pts.map((v, i) => X(i, se.n || se.pts.length).toFixed(1) + ',' + Y(clamp(v, yMin, yMax)).toFixed(1)).join(' ')}"/>`; });
  s += `<text x="${pad}" y="${h - 3}" font-size="10" fill="var(--muted)">יום 0</text><text x="${w - 8}" y="${h - 3}" font-size="10" fill="var(--muted)" text-anchor="end">יום ${series[0].n ? series[0].n - 1 : series[0].pts.length - 1}</text></svg>`;
  return s;
}

/* חלון שיתוף תוצאות */
function shareResultsModal() {
  const code = ResultCode.make();
  const bg = modal(`<h2>שליחת תוצאות למורה</h2><p class="muted small">הקוד מכיל רק את השם שהזנתם, הציונים וסוגי הטעויות. אפשר לשלוח אותו למורה בוואטסאפ או להעתיק.</p>
    <textarea readonly id="code" style="font-size:.8rem;direction:ltr;min-height:90px">${code}</textarea>
    <div class="row" style="margin-top:10px"><button class="btn primary grow" id="sh">📤 שיתוף</button><button class="btn grow" id="cp">📋 העתקה</button></div>
    <a class="btn block" style="margin-top:8px;text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(code)}">שליחה בוואטסאפ</a>`);
  $('#cp', bg).onclick = async () => { try { await navigator.clipboard.writeText(code); toast('הועתק ✅'); } catch (e) { $('#code', bg).select(); document.execCommand('copy'); toast('הועתק ✅'); } };
  $('#sh', bg).onclick = async () => { if (navigator.share) { try { await navigator.share({ text: code }); } catch (e) { } } else { $('#cp', bg).click(); } };
}
