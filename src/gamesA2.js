'use strict';
/* ===== חלק א׳ – יחידות 5–7: ספיגה, מפעל הכדוריות, בנק הדם ===== */

/* ---------- 5. מסלולי ספיגה ---------- */
registerGame({
  id: 'a_absorb', part: 'A', sec: 'basics', icon: '🥗', title: 'ספיגה: מה עוזר ומה מפריע', desc: 'ברזל – מגבירים ומעכבים, ומסע B12 בגוף',
  teacherNote: 'שלב 1: מיון גורמים המשפיעים על ספיגת ברזל (לפי הספר). שלב 2: סידור מסלול ספיגת B12 עם הפקטור הפנימי.',
  mount(root, ctx) {
    root.insertAdjacentHTML('afterbegin', say('ארוחה בריאה היא לא תמיד ארוחה יעילה. אני הברזל – בואו נראה מה מעלה ומה מוריד את הספיגה שלי!', 'wink', 'iron'));
    let s1 = 0;
    const items = [
      { e: '🍊', t: 'כוס מיץ תפוזים לצד הארוחה', b: 0, why: 'ויטמין C (בפירות הדר) משפר משמעותית את ספיגת הברזל, בעיקר ברזל מהצומח.' },
      { e: '🍋', t: 'לימון סחוט על סלט עדשים', b: 0, why: 'ויטמין C משפר ספיגה של ברזל מהצומח.' },
      { e: '🍊', t: 'אשכולית או תפוז אחרי כדור ברזל', b: 0, why: 'פירות הדר – ויטמין C – מסייעים בספיגה.' },
      { e: '🍵', t: 'כוס תה לצד ארוחה עשירה בברזל', b: 1, why: 'תה מעכב את ספיגת הברזל. מומלץ להימנע ממנו כשעה לפני ואחרי ארוחה כזו.' },
      { e: '☕', t: 'קפה עם הארוחה', b: 1, why: 'קפה מעכב ספיגת ברזל.' },
      { e: '🥛', t: 'כוס חלב לצד כדור ברזל', b: 1, why: 'סידן ומוצרי חלב מעכבים את הספיגה.' },
      { e: '🧀', t: 'גבינה צהובה לצד ארוחת בשר', b: 1, why: 'סידן במוצרי חלב מעכב ספיגת ברזל.' },
    ];
    sortGame(root, { items, buckets: ['מגביר ספיגה', 'מעכב ספיגה'], tag: 'iron_absorb', onDone: p => { s1 = p; root.innerHTML = ''; stage2(); } });
    function stage2() {
      root.insertAdjacentHTML('afterbegin', say('אני B12, ובלי המונית של הפקטור הפנימי אני לא מגיע לשום מקום…', 'think', 'b12') + fig('b12abs', 'ספיגת B12 (איור מהספר)'));
      const steps = ['ויטמין B12 משתחרר מהמזון בעזרת חומצת הקיבה ואנזימים',
        'בקיבה הוא נקשר לפקטור הפנימי (Intrinsic Factor) שמיוצר בתאי הקיבה',
        'הקומפלקס עובר במעי הדק עד לחלקו האחרון',
        'קולטנים מיוחדים בדופן המעי מזהים את הקומפלקס וקולטים אותו',
        'B12 נספג לדם ונקשר לחלבוני הובלה, ומגיע בעיקר למח העצם ולמערכת העצבים',
        'העודפים נאגרים בכבד – מאגר שמספיק ל-3 עד 6 שנים'];
      orderGame(root, { steps, tag: 'b12_absorb', onDone: p => { root.innerHTML = ''; ctx.finish(Math.round((s1 + p) / 2), '<div class="card soft"><b>למה זה חשוב?</b> חוסר בפקטור פנימי (למשל אחרי ניתוח קיבה או במחלה אוטואימונית בקיבה) מוביל לחוסר B12 גם בתזונה עשירה – והמאגר בכבד גורם לכך שהחוסר מתפתח לאט, לעיתים שנים.</div>'); } });
    }
  },
});

/* ---------- 6. מפעל הכדוריות ---------- */
registerGame({
  id: 'a_factory', part: 'A', sec: 'basics', icon: '🏭', title: 'מפעל הכדוריות: ברזל, B12 ופולית', desc: 'שנו את חומרי הגלם וצפו בכדוריות ובמדדי הדם',
  teacherNote: 'המודל איכותני: ברזל נמוך ← MCV ו-MCH נמוכים, RDW גבוה. B12 או פולית נמוכים ← MCV גבוה ומספר תאים נמוך. שניהם יחד ← MCV כמעט תקין עם RDW גבוה מאוד ("מלכודת"). ערכים להמחשה בלבד.',
  mount(root, ctx) {
    const S = { ir: 100, b12: 100, fol: 100 };
    const done = new Set();
    const MIS = [
      { id: 1, t: 'בנו אנמיה מחוסר ברזל: הורידו ברזל ל-30 או פחות, והשאירו את השאר גבוה', ok: (m, s) => s.ir <= 30 && s.b12 >= 80 && s.fol >= 80 && m.mcv < 80 },
      { id: 2, t: 'בנו חוסר B12: הורידו B12 ל-30 או פחות', ok: (m, s) => s.b12 <= 30 && s.ir >= 80 && s.fol >= 80 && m.mcv > 100 },
      { id: 3, t: 'בנו חוסר חומצה פולית: הורידו פולית ל-30 או פחות', ok: (m, s) => s.fol <= 30 && s.ir >= 80 && s.b12 >= 80 && m.mcv > 100 },
      { id: 4, t: 'המלכודת: הורידו גם ברזל וגם B12 – ראו מה קורה ל-MCV וה-RDW', ok: (m, s) => s.ir <= 30 && s.b12 <= 30 && m.mcv >= 80 && m.mcv <= 100 && m.rdw > 20 },
    ];
    const PRE = [
      ['🥕 צמחונית', { ir: 60, b12: 85, fol: 100 }, 'תזונה צמחונית: ברזל מהצומח נספג פחות, ו-B12 קיים בעיקר במזון מהחי.'],
      ['🌱 טבעונית בלי תוסף', { ir: 55, b12: 20, fol: 100 }, 'טבעונים שלא נוטלים תוסף B12 בסיכון גבוה לחוסר (המאגר בכבד נגמר אחרי שנים).'],
      ['🩸 וסת כבדה', { ir: 25, b12: 100, fol: 100 }, 'איבוד דם כרוני מרוקן את מאגרי הברזל.'],
      ['🤰 היריון + תזונה דלה', { ir: 50, b12: 100, fol: 35 }, 'דרישה מוגברת לברזל ולפולית, בלי תוספים וירקות ירוקים.'],
      ['🏥 אחרי ניתוח קיבה', { ir: 60, b12: 5, fol: 100 }, 'בלי פקטור פנימי אי אפשר לספוג B12, גם אם אוכלים נכון.'],
      ['🌾 צליאק', { ir: 35, b12: 70, fol: 40 }, 'מחלה שפוגעת במעי הדק ולכן מפחיתה ספיגה של כמה חומרים.'],
    ];
    function model(s) {
      const I = s.ir / 100, D = Math.min(s.b12, s.fol) / 100;
      const mcv = 90 * (1 - .30 * (1 - I)) * (1 + .45 * (1 - D));
      const mchc = 33 - (1 - I) * 6.5;
      const count = 4.8 * (.35 + .65 * D) * (.65 + .35 * I);
      const mch = mcv * mchc / 100, hb = count * mch / 10;
      const rdw = clamp(13 + 9 * (1 - I) + 8 * (1 - D), 12, 27);
      const ret = 1.2 * D * (.5 + .5 * I);
      return { mcv, mchc, mch, hb, count, rdw, ret, I, D };
    }
    root.insertAdjacentHTML('afterbegin', say('ברוכים הבאים למפעל! זה קו הייצור של מח העצם. שנו את אספקת חומרי הגלם וראו איזה כדוריות יוצאות 🏭', 'wow'));
    const main = el('<div class="card"></div>'); root.appendChild(main);
    const mis = el('<div class="card"></div>'); root.appendChild(mis);
    const nextBox = el('<div></div>'); root.appendChild(nextBox);
    let story = '';
    function draw() {
      const m = model(S);
      const verdict = m.hb >= 12 ? ['תקין', 'g'] : m.mcv < 80 ? ['אנמיה מיקרוציטית – חשד לחוסר ברזל', 'r'] : m.mcv > 100 ? ['אנמיה מאקרוציטית – חשד לחוסר B12 או פולית', 'r'] : m.rdw > 18 ? ['MCV תקין אבל RDW גבוה מאוד – שני חסרים ביחד?', 'y'] : ['אנמיה נורמוציטית', 'y'];
      const fl = (k, v) => labFlag(k, v, 'F');
      main.innerHTML = `<div class="smear">${cellsStrip({ mcv: m.mcv, mchc: m.mchc, aniso: clamp((m.rdw - 12) / 38, .04, .42), count: clamp(m.count / 4.8, .35, 1), macroOval: m.D < .6, seed: 5 })}</div>
        <div class="row" style="margin:8px 0"><span class="pill ${verdict[1]}">${verdict[0]}</span></div>
        <div class="kpi"><div class="${fl('Hb', m.hb)}"><b>${m.hb.toFixed(1)}</b><span>המוגלובין g/dL</span></div><div class="${fl('MCV', m.mcv)}"><b>${Math.round(m.mcv)}</b><span>MCV fL</span></div><div class="${fl('RDW', m.rdw)}"><b>${m.rdw.toFixed(1)}</b><span>RDW %</span></div><div class="${fl('RBC', m.count)}"><b>${m.count.toFixed(1)}</b><span>RBC M/µL</span></div><div class="${fl('RET', m.ret)}"><b>${m.ret.toFixed(1)}</b><span>רטיקולוציטים %</span></div></div>
        <h3>חומרי גלם</h3>
        ${[['ir', '🔩 ברזל', 'ברזל זמין לבניית המוגלובין'], ['b12', '🥩 ויטמין B12', 'לסינתזת DNA ולמיאלין'], ['fol', '🥬 חומצה פולית (B9)', 'לסינתזת DNA']].map(([k, t]) => `<div class="slider"><label><span>${t}</span><b class="ltr">${S[k]}%</b></label><input type="range" min="0" max="100" step="5" value="${S[k]}" data-k="${k}"></div>`).join('')}
        <div class="row" style="margin-top:6px">${PRE.map((p, i) => `<button class="btn sm" data-pre="${i}">${p[0]}</button>`).join('')}<button class="btn sm ghost" data-pre="-1">↺ איפוס</button></div>
        ${story ? `<div class="explain">${story}</div>` : ''}`;
      MIS.forEach(x => { if (!done.has(x.id) && x.ok(m, S)) { done.add(x.id); toast('משימה הושלמה! 🎉'); confetti(10); } });
      mis.innerHTML = `<h3>משימות (${done.size}/4)</h3>${MIS.map(x => `<div class="row" style="margin:6px 0"><span style="font-size:1.3rem">${done.has(x.id) ? '✅' : '⬜'}</span><span class="${done.has(x.id) ? 'muted' : ''}">${x.t}</span></div>`).join('')}`;
      nextBox.innerHTML = done.size >= 4 ? '<button class="btn primary block" id="go">כל המשימות הושלמו – למבחן 🏁</button>' : '';
      if (done.size >= 4) $('#go', nextBox).onclick = quiz;
      if (done.size === 4 && !mis.dataset.k) { mis.dataset.k = 1; }
    }
    main.addEventListener('input', e => { const r = e.target.closest('input[type=range]'); if (!r) return; S[r.dataset.k] = +r.value; story = ''; const y = window.scrollY; const k = r.dataset.k; draw(); window.scrollTo(0, y); const n = $(`input[data-k=${k}]`, main); n && n.focus(); });
    main.addEventListener('click', e => { const b = e.target.closest('[data-pre]'); if (!b) return; const i = +b.dataset.pre; if (i < 0) { Object.assign(S, { ir: 100, b12: 100, fol: 100 }); story = ''; } else { Object.assign(S, PRE[i][1]); story = '📖 ' + PRE[i][2]; } draw(); });
    draw();
    function quiz() {
      root.innerHTML = '';
      runQuiz(root, ctx, [
        { q: 'מה קורה לגודל הכדוריות (MCV) ולצבען בחוסר ברזל?', tag: 'nutrients', options: [{ t: 'קטנות (מיקרוציטיות) וחיוורות (היפוכרומיות)', ok: true, why: 'בלי ברזל אי אפשר לבנות מספיק המוגלובין, והתאים נוצרים קטנים יותר.' }, { t: 'גדולות וצפופות', why: 'זה אופייני לחוסר ויטמינים.' }, { t: 'תקינות לגמרי', why: 'חוסר ברזל משפיע ישירות על ההמוגלובין.' }] },
        { q: 'מדוע חוסר B12 או חומצה פולית יוצר כדוריות גדולות (מאקרוציטים)?', tag: 'nutrients', options: [{ t: 'סינתזת ה-DNA נפגעת: הגרעין "תקוע" בשלב לא בשל בעוד הציטופלזמה ממשיכה לגדול', ok: true, why: 'רוב התאים הפגומים נהרסים במח העצם עוד לפני שיצאו לדם.' }, { t: 'חוסר ברזל מנפח את התאים', why: 'חוסר ברזל גורם לתאים קטנים.' }, { t: 'ה-EPO גבוה מדי', why: 'הסיבה היא פגיעה בשכפול DNA.' }] },
        { q: 'חסרה לכדוריות רק חומצה פולית. איזה ויטמין אחר גורם בעקיפין לאותו מצב?', tag: 'nutrients', options: [{ t: 'B12 – הוא ממחזר את הפולית לצורתה הפעילה', ok: true, why: 'חוסר B12 גורם לחוסר פולית פעילה, ושניהם עוצרים את שכפול ה-DNA.' }, { t: 'ויטמין C', why: 'ויטמין C מסייע לספיגת ברזל.' }, { t: 'ויטמין K', why: 'קשור לקרישה.' }] },
        { q: 'למה חוסר ב-B12 מתפתח לעיתים לאט מאוד?', tag: 'b12_absorb', options: [{ t: 'מאגר גדול בכבד שמספיק ל-3–6 שנים', ok: true, why: 'לכן הסימפטומים מופיעים רק אחרי זמן ארוך.' }, { t: 'כי B12 לא חיוני', why: 'הוא חיוני, גם לעצבים.' }, { t: 'כי מח העצם מייצר B12', why: 'הגוף לא מייצר B12.' }] },
        { q: 'אישה אחרי ניתוח לעקיפת קיבה אוכלת בשר ודגים ובכל זאת מפתחת חוסר B12. למה?', tag: 'b12_absorb', options: [{ t: 'אין פקטור פנימי מהקיבה, ולכן B12 לא נספג', ok: true, why: 'הפקטור הפנימי חיוני לספיגה בקצה המעי הדק.' }, { t: 'בשר ודגים לא מכילים B12', why: 'הם מקור עשיר ל-B12.' }, { t: 'היא סובלת מחוסר ברזל', why: 'לא קשור לספיגת B12.' }] },
        { q: 'איזה מדד הוא הרגיש והספציפי ביותר לחוסר ברזל?', tag: 'nutrients', options: [{ t: 'פריטין נמוך', ok: true, why: 'הוא משקף ישירות את התרוקנות מאגרי הברזל.' }, { t: 'RDW נמוך', why: 'ב-חוסר ברזל ה-RDW גבוה.' }, { t: 'MCV גבוה', why: 'MCV נמוך בחוסר ברזל.' }] },
      ], { after: fig('mega_diet', 'מניעה: מקורות B12 ופולית (איור מהספר)') });
    }
  },
});

/* ---------- 7. בנק הדם ---------- */
registerGame({
  id: 'a_bank', part: 'A', sec: 'basics', icon: '🏥', title: 'בנק הדם: ABO ו-Rh', desc: 'התאימו יחידת דם בטוחה, ופתרו את תעלומת ההיריון',
  teacherNote: 'כלל: נוגדנים טבעיים נגד האנטיגן הזר (A,B). עירוי בטוח: אנטיגני התורם צריכים להיות מוכרים כ"עצמי" אצל המקבל. Rh שלילי לא יקבל Rh חיובי. במצב חירום (סוג לא ידוע) – O שלילי.',
  mount(root, ctx) {
    const ABO = ['O', 'A', 'B', 'AB'];
    const aboOK = (d, r) => d === 'O' || r === 'AB' || d === r;
    const safe = (d, r) => aboOK(d.abo, r.abo) && (r.rh || !d.rh);
    const lbl = t => `<b class="ltr">${t.abo}${t.rh ? '+' : '−'}</b>`;
    const anti = abo => abo === 'A' ? 'anti-B' : abo === 'B' ? 'anti-A' : abo === 'O' ? 'anti-A ו-anti-B' : 'אין (לא מכיר כנוגדנים לאף אחד)';
    function makeRound(k) {
      const emergency = k === 8;
      const pt = { abo: pick(ABO), rh: Math.random() < .6 };
      let units, tries = 0;
      do { units = shuffle(ABO.flatMap(a => [true, false].map(r => ({ abo: a, rh: r })))).slice(0, 4); tries++; } while ((!units.some(u => emergency ? (u.abo === 'O' && !u.rh) : safe(u, pt)) || (units.filter(u => safe(u, pt)).length > 2)) && tries < 80);
      if (emergency) { units = shuffle([{ abo: 'O', rh: false }, { abo: 'A', rh: true }, { abo: 'AB', rh: true }, { abo: 'B', rh: false }]); }
      return { pt, units, emergency };
    }
    const rounds = Array.from({ length: 9 }, (_, k) => makeRound(k));
    let i = 0, right = 0;
    root.insertAdjacentHTML('afterbegin', say('כאן בנק הדם – כל טעות היא (חלילה) מסוכנת, אז טוב שזה משחק. 😅 בחרו לכל מטופל יחידה שמתאימה לו.', 'think'));
    const legend = el(`<div class="card soft small row">${bloodCellABO('AB', true, 38)}<span>🔵 אנטיגן A · 🟡 אנטיגן B · 🟢 אנטיגן D (Rh חיובי)</span></div>`); root.appendChild(legend);
    const host = el('<div></div>'); root.appendChild(host);
    function draw() {
      if (i >= rounds.length) { rhStage(); return; }
      const R = rounds[i], p = R.pt; host.innerHTML = '';
      const c = el(`<div class="card"><div class="row sp small muted"><span>מטופל ${i + 1} מתוך ${rounds.length}</span><span>✓ ${right}</span></div><div class="bar" style="margin:8px 0"><i style="width:${100 * i / rounds.length}%"></i></div></div>`); host.appendChild(c);
      if (R.emergency) c.insertAdjacentHTML('beforeend', `<div class="patient-head"><div class="avatar">🚑</div><div><h3 style="margin:0">חירום! דימום מסיבי</h3><div class="muted">סוג הדם של המטופל עדיין לא ידוע, ואין זמן לבדוק. איזו יחידה תבחרו?</div></div></div>`);
      else c.insertAdjacentHTML('beforeend', `<div class="patient-head">${bloodCellABO(p.abo, p.rh, 64)}<div><h3 style="margin:0">מטופל/ת עם סוג דם ${lbl(p)}</h3><div class="muted small">נוגדנים טבעיים: ${anti(p.abo)}${p.rh ? '' : ' · Rh שלילי – לא יקבל Rh חיובי'}</div></div></div>`);
      c.insertAdjacentHTML('beforeend', `<div class="q" style="margin-top:12px">איזו יחידת דם תבחרו?</div><div class="grid" id="un">${R.units.map((u, k) => `<button class="tile ${IS_TEACHER && (R.emergency ? (u.abo === 'O' && !u.rh) : safe(u, p)) ? 't-ok' : ''}" data-k="${k}" style="align-items:center;min-height:120px">${bloodCellABO(u.abo, u.rh, 56)}<span class="t">יחידה ${lbl(u)}</span></button>`).join('')}</div><div id="fb"></div>`);
      c.addEventListener('click', e => {
        const b = e.target.closest('[data-k]'); if (!b || c.dataset.d) return; c.dataset.d = 1;
        const u = R.units[+b.dataset.k]; const ok = R.emergency ? (u.abo === 'O' && !u.rh) : safe(u, p);
        $$('[data-k]', c).forEach(x => { x.disabled = true; const uu = R.units[+x.dataset.k]; const s = R.emergency ? (uu.abo === 'O' && !uu.rh) : safe(uu, p); x.style.borderColor = s ? 'var(--good)' : ''; x.style.background = s ? 'var(--good-soft)' : ''; });
        let why = '';
        if (ok) why = R.emergency ? 'O שלילי הוא "התורם האוניברסלי": אין עליו אנטיגני A, B או D, ולכן לא תהיה תגובה חיסונית אצל אף מקבל.' : 'מצוין! אנטיגני התורם מוכרים כ"עצמי" אצל המקבל.';
        else if (R.emergency) why = 'במצב חירום בוחרים O שלילי – אין עליו אנטיגנים A, B ו-D, ולכן הוא מתאים לכולם.';
        else if (!aboOK(u.abo, p.abo)) { Store.mistake('abo_rules'); why = `למקבל מסוג ${p.abo} יש נוגדנים נגד ${p.abo === 'O' ? 'A ו-B' : p.abo === 'A' ? 'B' : 'A'}. תאי התורם נושאים אנטיגן זר ⇒ הצמתה והמוליזה חריפה.`; }
        else { Store.mistake('rh_pregnancy'); why = 'המקבל Rh שלילי ולכן לא נותנים לו Rh חיובי – אנטיגן D יעורר תגובה חיסונית.'; }
        if (!ok && R.emergency) Store.mistake('abo_rules');
        if (ok) right++;
        $('#fb', c).innerHTML = `<div class="explain ${ok ? 'good' : 'bad'}">${ok ? '✅ ' : '🚨 '}${why}</div><button class="btn primary block" id="nx" style="margin-top:10px">הבא ←</button>`;
        $('#nx', c).onclick = () => { i++; draw(); };
      });
    }
    draw();
    function rhStage() {
      host.innerHTML = ''; legend.remove();
      const base = Math.round(100 * right / rounds.length);
      host.insertAdjacentHTML('beforeend', say('עכשיו לחלק הדרמטי: Rh והיריון. תעלומה שלמה במשפחה אחת…', 'wow') + fig('rh', 'אי-התאמת Rh בין אם לעובר (איור מהספר)'));
      const wrap = { ...ctx, finish: (p, ex) => ctx.finish(Math.round((base + p) / 2), ex) };
      runQuiz(host, wrap, [
        { q: 'אישה Rh שלילי בהיריון עם עובר Rh חיובי (שירש את זה מהאב). מתי מערכת החיסון שלה נחשפת לדם העובר?', tag: 'rh_pregnancy', options: [{ t: 'במיוחד בלידה, כשכמות קטנה של דם עוברי חוצה לשליה ונכנסת למחזור האם', ok: true, why: 'האם מזהה את אנטיגן D כגוף זר.' }, { t: 'אף פעם – הדם לא מתערבב', why: 'כמות קטנה של דם עוברי כן חוצה.' }, { t: 'רק אחרי הגיל 40', why: 'הגיל לא רלוונטי.' }] },
        { q: 'מה קורה בהיריון הראשון?', tag: 'rh_pregnancy', options: [{ t: 'לרוב התגובה לא מספיקה לפגוע בעובר, אבל נוצר זיכרון חיסוני', ok: true, why: 'הבעיה המרכזית היא "הזיכרון החיסוני" של האם.' }, { t: 'העובר תמיד נפגע קשה', why: 'בהיריון הראשון לרוב לא.' }, { t: 'לא קורה כלום ולא יקרה לעולם', why: 'נוצר זיכרון שיפעל בהיריון הבא.' }] },
        { q: 'בהיריון הבא עם עובר Rh חיובי, ללא מניעה – מה יקרה?', tag: 'rh_pregnancy', options: [{ t: 'נוגדני Anti-D של האם חוצים את השליה ותוקפים את כדוריות העובר – אנמיה המוליטית של היילוד', ok: true, why: 'מצב מסכן חיים הקרוי מחלה המוליטית של היילוד.' }, { t: 'העובר ייצר נוגדנים נגד האם', why: 'הכיוון הפוך.' }, { t: 'האם תפתח אנמיה חרמשית', why: 'אין קשר.' }] },
        { q: 'איך מונעים את הבעיה?', tag: 'rh_pregnancy', options: [{ t: 'זריקת נוגדני Anti-D מוכנים מראש (בשבוע 28 ובתוך 72 שעות אחרי הלידה): הם מנטרלים את הכדוריות העובריות לפני שמערכת החיסון של האם מפתחת זיכרון', ok: true, why: 'המטרה: לא לתת לאם להתחסן.' }, { t: 'עירוי דם מהאב', why: 'זה יחמיר.' }, { t: 'ברזל בזריקות', why: 'לא קשור.' }] },
        { q: 'האם יכולה להיווצר אותה בעיה אם האם Rh חיובי והעובר Rh שלילי?', tag: 'rh_pregnancy', options: [{ t: 'לא – האם מזהה את אנטיגן D כ"עצמי", אין לה תגובה נגד עובר Rh שלילי', ok: true, why: 'הבעיה נוצרת רק כשהעובר נושא אנטיגן שהאם חסרה.' }, { t: 'כן, תמיד', why: 'האם שלילית היא זו שמפתחת נוגדנים נגד D.' }] },
        { q: 'שתי כדוריות: אחת מסוג A ואחת מסוג B. למי יש נוגדנים נגד שתיהן באופן טבעי?', tag: 'abo_rules', fig: 'abo', figCap: 'אנטיגנים ונוגדנים במערכת ABO (איור מהספר)', options: [{ t: 'לבעל סוג דם O', ok: true, why: 'אין לו אנטיגנים A ו-B ולכן מפתח נוגדנים נגד שניהם.' }, { t: 'לבעל סוג דם AB', why: 'הוא מכיר את שניהם כעצמי.' }, { t: 'לאף אחד', why: 'בעלי סוג O כן.' }] },
      ]);
    }
  },
});
