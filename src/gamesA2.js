'use strict';
/* ===== חלק א׳ – יחידות 5–7: ספיגה, מפעל הכדוריות, בנק הדם ===== */

/* ---------- 5. מסלולי ספיגה ---------- */
registerGame({
  id: 'a_absorb', part: 'A', learned: [
    'ויטמין C מגביר ספיגת ברזל. תה, קפה וחלב (סידן) מעכבים אותה.',
    'ברזל מהצומח נספג פחות מברזל מהחי, ולכן צמחונים וטבעונים בסיכון.',
    'B12 נספג בקצה המעי הדק רק בליווי הפקטור הפנימי מהקיבה.',
    'בלי פקטור פנימי יש חוסר B12 גם בתזונה עשירה, והמאגר בכבד מאט את הופעת החוסר.'
  ], sec: 'basics', icon: '🥗', title: 'ספיגה: מה עוזר ומה מפריע', desc: 'ברזל – מגבירים ומעכבים, ומסע B12 בגוף',
  teacherNote: 'שלב 1: מיון גורמים המשפיעים על ספיגת ברזל (לפי הספר). שלב 2: סידור מסלול ספיגת B12 עם הפקטור הפנימי.',
  mount(root, ctx) {
    root.insertAdjacentHTML('afterbegin', say('ארוחה בריאה היא לא תמיד ארוחה יעילה. אני הברזל – בואו נראה מה מעלה ומה מוריד את הספיגה שלי!', 'wink', 'iron'));
    let s1 = 0;
    const items = [
      { e: '🍊', t: 'מיץ תפוזים', b: 0, why: 'ויטמין C (בפירות הדר) משפר משמעותית את ספיגת הברזל, בעיקר ברזל מהצומח.' },
      { e: '🍋', t: 'לימון על סלט עדשים', b: 0, why: 'ויטמין C משפר ספיגה של ברזל מהצומח.' },
      { e: '🍓', t: 'תותים לצד כדור ברזל', b: 0, why: 'תותים עשירים בוויטמין C, שמסייע בספיגה.' },
      { e: '🍵', t: 'תה עם הארוחה', b: 1, why: 'תה מעכב את ספיגת הברזל. מומלץ להימנע ממנו כשעה לפני ואחרי ארוחה כזו.' },
      { e: '☕', t: 'קפה עם הארוחה', b: 1, why: 'קפה מעכב ספיגת ברזל.' },
      { e: '🥛', t: 'חלב לצד כדור ברזל', b: 1, why: 'סידן ומוצרי חלב מעכבים את הספיגה.' },
      { e: '🧀', t: 'גבינה צהובה עם ארוחת בשר', b: 1, why: 'סידן במוצרי חלב מעכב ספיגת ברזל.' },
    ];
    binGame(root, { items, buckets: ['מגביר ספיגה ✅', 'מעכב ספיגה ⛔'], tag: 'iron_absorb', title: 'בחרו מוצר, ואז לחצו על התיבה שמתאימה לו', onDone: p => { s1 = p; root.innerHTML = ''; stage2(); } });
    function stage2() {
      root.insertAdjacentHTML('afterbegin', say('אני B12, ובלי המונית של הפקטור הפנימי אני לא מגיע לשום מקום…', 'think', 'b12') + fig('b12abs', 'ספיגת B12'));
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
  id: 'a_factory', part: 'A', learned: [
    'חוסר ברזל: כדוריות קטנות וחיוורות (MCV נמוך, RDW גבוה).',
    'חוסר B12 או פולית: כדוריות גדולות ופחות תאים (MCV גבוה).',
    'שני חסרים יחד יכולים להסתיר זה את זה: MCV כמעט תקין ו-RDW גבוה מאוד.',
    'תזונה צמחונית או טבעונית, וסת כבדה, היריון, צליאק וניתוחי קיבה: כל אחד מהם פוגע בחומר גלם אחר.'
  ], sec: 'basics', icon: '🏭', title: 'מפעל הכדוריות: ברזל, B12 ופולית', desc: 'שנו את חומרי הגלם וצפו בכדוריות ובמדדי הדם',
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
      ['🌱 טבעונית קפדנית', { ir: 55, b12: 20, fol: 100 }, 'B12 נמצא כמעט רק במוצרי חי. בלי תוסף המאגר בכבד נגמר אחרי שנים, ומתפתח חוסר.'],
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
    const mis = el('<div class="card"></div>'), ctl = el('<div class="card"></div>'), res = el('<div class="card"></div>'), img = el('<div class="card"></div>'), nextBox = el('<div></div>');
    root.append(mis, ctl, res, img, nextBox);
    let story = '';
    const SL = [['ir', '🔩 ברזל', 'ברזל זמין לבניית המוגלובין'], ['b12', '🥩 ויטמין B12', 'לסינתזת DNA ולמיאלין'], ['fol', '🥬 חומצה פולית (B9)', 'לסינתזת DNA']];
    function drawCtl() {
      ctl.innerHTML = `<h3>חומרי גלם</h3>
        ${SL.map(([k, t]) => `<div class="slider"><label><span>${t}</span><b class="ltr" data-v="${k}">${S[k]}%</b></label><input type="range" min="0" max="100" step="5" value="${S[k]}" data-k="${k}"></div>`).join('')}
        <p class="muted small" style="margin:8px 0 4px">או נסו מצב מהחיים:</p>
        <div class="row">${PRE.map((p, i) => `<button class="btn sm" data-pre="${i}">${p[0]}</button>`).join('')}<button class="btn sm ghost" data-pre="-1">↺ איפוס</button></div>
        ${story ? `<div class="explain" id="story">${story}</div>` : ''}`;
    }
    function drawRes() {
      const m = model(S);
      const verdict = m.hb >= 12 ? ['תקין', 'g'] : m.mcv < 80 ? ['אנמיה מיקרוציטית – חשד לחוסר ברזל', 'r'] : m.mcv > 100 ? ['אנמיה מאקרוציטית – חשד לחוסר B12 או פולית', 'r'] : m.rdw > 18 ? ['MCV תקין אבל RDW גבוה מאוד – שני חסרים ביחד?', 'y'] : ['אנמיה נורמוציטית', 'y'];
      const fl = (k, v) => labFlag(k, v, 'F');
      res.innerHTML = `<h3>תוצאות</h3><div class="row" style="margin:6px 0"><span class="pill ${verdict[1]}">${verdict[0]}</span></div>
        <div class="kpi"><div class="${fl('Hb', m.hb)}"><b>${m.hb.toFixed(1)}</b><span>המוגלובין g/dL</span></div><div class="${fl('MCV', m.mcv)}"><b>${Math.round(m.mcv)}</b><span>MCV fL</span></div><div class="${fl('RDW', m.rdw)}"><b>${m.rdw.toFixed(1)}</b><span>RDW %</span></div><div class="${fl('RBC', m.count)}"><b>${m.count.toFixed(1)}</b><span>RBC M/µL</span></div><div class="${fl('RET', m.ret)}"><b>${m.ret.toFixed(1)}</b><span>רטיקולוציטים %</span></div></div>`;
      img.innerHTML = `<h3>כך נראות הכדוריות</h3><div class="smear">${cellsStrip({ mcv: m.mcv, mchc: m.mchc, aniso: clamp((m.rdw - 12) / 38, .04, .42), count: clamp(m.count / 4.8, .35, 1), macroOval: m.D < .6, seed: 5 })}</div>`;
      MIS.forEach(x => { if (!done.has(x.id) && x.ok(m, S)) { done.add(x.id); toast('משימה הושלמה! 🎉'); confetti(10); } });
      mis.innerHTML = `<h3>🎯 משימות (${done.size}/4)</h3>${MIS.map(x => `<div class="row" style="margin:6px 0"><span style="font-size:1.3rem">${done.has(x.id) ? '✅' : '⬜'}</span><span class="${done.has(x.id) ? 'muted' : ''}">${x.t}</span></div>`).join('')}`;
      nextBox.innerHTML = done.size >= 4 ? '<button class="btn primary block" id="go">כל המשימות הושלמו – למבחן 🏁</button>' : '';
      if (done.size >= 4) $('#go', nextBox).onclick = quiz;
    }
    ctl.addEventListener('input', e => { const r = e.target.closest('input[type=range]'); if (!r) return; S[r.dataset.k] = +r.value; $(`[data-v=${r.dataset.k}]`, ctl).textContent = r.value + '%'; if (story) { story = ''; const st = $('#story', ctl); st && st.remove(); } drawRes(); });
    ctl.addEventListener('click', e => { const b = e.target.closest('[data-pre]'); if (!b) return; const i = +b.dataset.pre; if (i < 0) { Object.assign(S, { ir: 100, b12: 100, fol: 100 }); story = ''; } else { Object.assign(S, PRE[i][1]); story = '📖 ' + PRE[i][2]; } drawCtl(); drawRes(); });
    drawCtl(); drawRes();
    function quiz() {
      root.innerHTML = '';
      runQuiz(root, ctx, [
        { q: 'מה קורה לגודל הכדוריות ולצבען בחוסר ברזל?', tag: 'nutrients', options: [
          { t: 'קטנות וחיוורות, כי חסר ברזל לבניית ההמוגלובין', ok: true, why: 'בלי ברזל אי אפשר לבנות מספיק המוגלובין, והתאים נוצרים קטנים.' },
          { t: 'גדולות וחיוורות, כי התאים אוגרים יותר נוזל', why: 'גדולות מאפיין חוסר ויטמינים.' },
          { t: 'קטנות אך כהות, כי ההמוגלובין מצטבר בתא', why: 'ההמוגלובין בתאים אלה נמוך ולכן הם חיוורים.' },
          { t: 'תקינות בגודלן, כי החוסר משפיע רק על מספר התאים', why: 'חוסר ברזל משפיע ישירות על ההמוגלובין ועל גודל התא.' }] },
        { q: 'מדוע חוסר B12 או חומצה פולית יוצר כדוריות גדולות (מאקרוציטים)?', tag: 'nutrients', options: [
          { t: 'שכפול ה-DNA נפגע, והציטופלזמה ממשיכה לגדול בעוד הגרעין מתעכב', ok: true, why: 'רוב התאים הפגומים נהרסים במח העצם עוד לפני שיצאו לדם.' },
          { t: 'בניית ההמוגלובין מואצת, ולכן התא מתנפח', why: 'הבעיה היא ב-DNA ולא בהמוגלובין.' },
          { t: 'רמת ה-EPO הגבוהה גורמת לתאים להתחלק פחות', why: 'EPO מגביר ייצור, והסיבה היא חוסר בחומרי גלם.' },
          { t: 'קרום התא נעשה דק ונמתח, ולכן התא גדל', why: 'הקרום תקין; הפגיעה היא בהתחלקות הגרעין.' }] },
        { q: 'איזה ויטמין נוסף נחוץ כדי לשמור על פולית בצורתה הפעילה?', tag: 'nutrients', options: [
          { t: 'B12, שמסייע בהפיכת הפולית לצורתה הפעילה', ok: true, why: 'חוסר B12 גורם לחוסר פולית פעילה, ושניהם עוצרים את שכפול ה-DNA.' },
          { t: 'ויטמין C, שמסייע בספיגת הפולית מהמעי', why: 'ויטמין C מסייע בעיקר בספיגת ברזל.' },
          { t: 'ויטמין K, שמשתתף בסינתזת ה-DNA', why: 'ויטמין K קשור לקרישת דם.' },
          { t: 'ויטמין A, שנחוץ לבשלות הכדוריות', why: 'ויטמין A אינו קשור לחילוף הפולית.' }] },
        { q: 'למה חוסר ב-B12 מתפתח לעיתים לאט מאוד?', tag: 'b12_absorb', options: [
          { t: 'יש מאגר גדול בכבד שמספיק לשנים רבות', ok: true, why: 'המאגר מספיק ל-3–6 שנים, ולכן הסימפטומים מופיעים רק אחרי זמן ארוך.' },
          { t: 'הגוף מייצר B12 בעצמו בכמויות קטנות', why: 'הגוף אינו מייצר B12.' },
          { t: 'הצורך בו נמוך, והוא נצרך רק פעם בשנה', why: 'הוא נצרך כל הזמן, אך בכמויות זעירות.' },
          { t: 'מח העצם משתמש בו רק כשהכדוריות מתחדשות לאט', why: 'הוא נחוץ לייצור רציף של תאים חדשים.' }] },
        { q: 'אישה אחרי ניתוח לעקיפת קיבה אוכלת בשר ודגים ובכל זאת מפתחת חוסר B12. למה?', tag: 'b12_absorb', options: [
          { t: 'אין פקטור פנימי מהקיבה, ולכן B12 לא נספג בקצה המעי', ok: true, why: 'הפקטור הפנימי חיוני לספיגה בקצה המעי הדק.' },
          { t: 'הבשר והדגים מתפרקים מהר מדי, ו-B12 יוצא בצואה', why: 'בשר ודגים הם מקור עשיר ל-B12; הבעיה בספיגה.' },
          { t: 'הניתוח גורם להרס כדוריות, ולכן הצורך ב-B12 עולה', why: 'הניתוח אינו גורם להרס כדוריות.' },
          { t: 'הקיבה המוקטנת מפרישה יותר חומצה והורסת את הוויטמין', why: 'ההפרשה בדרך כלל יורדת ואינה הורסת את B12.' }] },
        { q: 'איזה מדד הוא הרגיש והספציפי ביותר לחוסר ברזל?', tag: 'nutrients', options: [
          { t: 'פריטין נמוך, כי הוא משקף את מאגרי הברזל', ok: true, why: 'הוא משקף ישירות את התרוקנות מאגרי הברזל.' },
          { t: 'RDW נמוך, כי כל התאים נעשים דומים בגודלם', why: 'בחוסר ברזל ה-RDW גבוה.' },
          { t: 'טרנספרין נמוך, כי הגוף מפסיק לייצר חלבון הובלה', why: 'בחוסר ברזל הטרנספרין גבוה.' },
          { t: 'ברזל בסרום בלבד, כי הוא יציב לאורך היום', why: 'ברזל בסרום משתנה מאוד ואינו המדד המומלץ.' }] },
      ], { after: fig('mega_diet', 'מניעה: מקורות B12 ופולית (איור מהספר)') });
    }
  },
});

/* ---------- 7. בנק הדם ---------- */
registerGame({
  id: 'a_bank', part: 'A', learned: [
    'לבעל סוג O יש נוגדנים נגד A ו-B. לבעל AB אין נוגדנים כאלה.',
    'מקבל Rh שלילי לא מקבל Rh חיובי. במצב חירום בלי סוג ידוע נותנים O שלילי.',
    'אם Rh שלילית נחשפת לדם עובר Rh חיובי, היא מפתחת נוגדנים שיפגעו בהיריון הבא.',
    'מניעה: זריקת anti-D בשבוע 28 ובתוך 72 שעות אחרי הלידה.'
  ], sec: 'basics', icon: '🏥', title: 'בנק הדם: ABO ו-Rh', desc: 'התאימו יחידת דם בטוחה, ופתרו את תעלומת ההיריון',
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
    root.insertAdjacentHTML('afterbegin', say('כאן בנק הדם – כל טעות היא (חלילה) מסוכנת, אז טוב שזה משחק. 😅 לכל מטופל יש לפעמים יותר מיחידה מתאימה אחת. סמנו את כולן.', 'think'));
    const legend = el(`<div class="card soft small row">${bloodCellABO('AB', true, 38)}<span>🔵 אנטיגן A · 🟡 אנטיגן B · 🟢 אנטיגן D (Rh חיובי)</span></div>`); root.appendChild(legend);
    const host = el('<div></div>'); root.appendChild(host);
    function draw() {
      if (i >= rounds.length) { rhStage(); return; }
      const R = rounds[i], p = R.pt; host.innerHTML = '';
      const isOk = u => R.emergency ? (u.abo === 'O' && !u.rh) : safe(u, p);
      const c = el(`<div class="card"><div class="row sp small muted"><span>מטופל ${i + 1} מתוך ${rounds.length}</span><span>✓ ${right}</span></div><div class="bar" style="margin:8px 0"><i style="width:${100 * i / rounds.length}%"></i></div></div>`); host.appendChild(c);
      if (R.emergency) c.insertAdjacentHTML('beforeend', `<div class="patient-head"><div class="avatar">🚑</div><div><h3 style="margin:0">חירום! דימום מסיבי</h3><div class="muted">סוג הדם של המטופל עדיין לא ידוע, ואין זמן לבדוק.</div></div></div>`);
      else c.insertAdjacentHTML('beforeend', `<div class="patient-head">${bloodCellABO(p.abo, p.rh, 64)}<div><h3 style="margin:0">מטופל/ת עם סוג דם ${lbl(p)}</h3><div class="muted small">נוגדנים טבעיים: ${anti(p.abo)}${p.rh ? '' : ' · Rh שלילי – לא יקבל Rh חיובי'}</div></div></div>`);
      c.insertAdjacentHTML('beforeend', `<div class="q" style="margin-top:12px">אילו יחידות דם מתאימות למטופל? <span class="muted small">(אפשר לסמן יותר מאחת, ואז ללחוץ "סיימתי")</span></div><div class="grid" id="un">${R.units.map((u, k) => `<button class="tile ${IS_TEACHER && isOk(u) ? 't-ok' : ''}" data-k="${k}" style="align-items:center;min-height:120px">${bloodCellABO(u.abo, u.rh, 56)}<span class="t">יחידה ${lbl(u)}</span></button>`).join('')}</div><button class="btn primary block" id="dn" style="margin-top:12px" disabled>סיימתי ✔</button><div id="fb"></div>`);
      const sel = new Set();
      const why1 = u => !aboOK(u.abo, p.abo) ? `יחידה ${lbl(u)}: למקבל מסוג ${p.abo} יש נוגדנים נגד ${p.abo === 'O' ? 'A ו-B' : p.abo === 'A' ? 'B' : 'A'}, ותאי התורם נושאים אנטיגן זר ⇒ הצמתה והמוליזה חריפה.` : `יחידה ${lbl(u)}: המקבל Rh שלילי, ולכן לא נותנים לו Rh חיובי. אנטיגן D יעורר תגובה חיסונית.`;
      c.addEventListener('click', e => {
        if (c.dataset.d) return;
        const b = e.target.closest('[data-k]');
        if (b) { const k = +b.dataset.k; if (sel.has(k)) sel.delete(k); else sel.add(k); b.classList.toggle('pick', sel.has(k)); $('#dn', c).disabled = !sel.size; return; }
        if (!e.target.closest('#dn') || !sel.size) return;
        c.dataset.d = 1; $('#dn', c).remove();
        const bad = [], missed = [];
        $$('[data-k]', c).forEach(x => {
          const k = +x.dataset.k, u = R.units[k], s = isOk(u); x.disabled = true; x.classList.remove('pick');
          x.style.borderColor = s ? 'var(--good)' : sel.has(k) ? 'var(--bad)' : ''; x.style.background = s ? 'var(--good-soft)' : sel.has(k) ? 'var(--bad-soft)' : '';
          if (sel.has(k) && !s) bad.push(u); if (!sel.has(k) && s) missed.push(u);
        });
        const ok = !bad.length && !missed.length; let why = '';
        if (ok) why = R.emergency ? 'O שלילי הוא "התורם האוניברסלי": אין עליו אנטיגני A, B או D, ולכן לא תהיה תגובה חיסונית אצל אף מקבל.' : 'מצוין! כל היחידות שבחרתם בטוחות, ולא פספסתם אף יחידה מתאימה.';
        else {
          if (R.emergency) { Store.mistake('abo_rules'); why = 'במצב חירום בוחרים O שלילי בלבד – אין עליו אנטיגנים A, B ו-D, ולכן הוא מתאים לכולם.'; }
          else {
            if (bad.length) { bad.forEach(u => { Store.mistake(!aboOK(u.abo, p.abo) ? 'abo_rules' : 'rh_pregnancy'); }); why += '🚨 יחידה לא בטוחה נבחרה:<br>' + bad.map(why1).join('<br>') + '<br>'; }
            if (missed.length) why += '➕ גם יחידה זו הייתה מתאימה: ' + missed.map(lbl).join(', ') + '.';
          }
        }
        if (ok) right++;
        $('#fb', c).innerHTML = `<div class="explain ${ok ? 'good' : 'bad'}">${ok ? '✅ ' : ''}${why}</div><button class="btn primary block" id="nx" style="margin-top:10px">הבא ←</button>`;
        $('#nx', c).onclick = () => { i++; draw(); };
      });
    }
    draw();
    function rhStage() {
      host.innerHTML = ''; legend.remove();
      const base = Math.round(100 * right / rounds.length);
      host.insertAdjacentHTML('beforeend', say('עכשיו לחלק הדרמטי: Rh והיריון. תעלומה שלמה במשפחה אחת…', 'wow'));
      const wrap = { ...ctx, finish: (p, ex) => ctx.finish(Math.round((base + p) / 2), ex) };
      runQuiz(host, wrap, [
        { q: 'אישה Rh שלילית בהיריון עם עובר Rh חיובי (שירש זאת מהאב). מתי מערכת החיסון שלה נחשפת בעיקר לדם העובר?', tag: 'rh_pregnancy', options: [
          { t: 'בלידה, כשכמות קטנה של דם עוברי חוצה את השליה', ok: true, why: 'האם מזהה את אנטיגן D כגוף זר.' },
          { t: 'לאורך כל ההיריון, כשדם העובר מתערבב עם דם האם', why: 'הדם אינו מתערבב; בדרך כלל רק כמות קטנה חוצה, בעיקר בלידה.' },
          { t: 'בהנקה, כשכדוריות העובר עוברות בחלב', why: 'הנקה אינה חושפת את האם לדם העובר.' },
          { t: 'בהפריה, כשהזרע נושא אנטיגן D', why: 'אנטיגן D נמצא על כדוריות הדם, לא על הזרע.' }] },
        { q: 'מה קורה בדרך כלל בהיריון הראשון?', tag: 'rh_pregnancy', options: [
          { t: 'העובר לרוב אינו נפגע, אך מערכת החיסון של האם יוצרת זיכרון', ok: true, why: 'הבעיה המרכזית היא "הזיכרון החיסוני" של האם.' },
          { t: 'העובר נפגע קשה, כי לאם כבר יש נוגדנים מוכנים', why: 'בהיריון הראשון עדיין אין נוגדנים.' },
          { t: 'אין תגובה חיסונית כלל, גם בהיריונות הבאים', why: 'נוצר זיכרון שיפעל בהיריון הבא.' },
          { t: 'האם מפתחת אנמיה, כי העובר צורך את הכדוריות שלה', why: 'הבעיה נוגעת לנוגדנים, לא לצריכת כדוריות.' }] },
        { q: 'בהיריון הבא עם עובר Rh חיובי, בלי טיפול מניעתי, מה צפוי?', tag: 'rh_pregnancy', options: [
          { t: 'נוגדני anti-D של האם חוצים את השליה ופוגעים בכדוריות העובר', ok: true, why: 'מצב מסכן חיים הקרוי מחלה המוליטית של היילוד.' },
          { t: 'העובר מפתח נוגדנים נגד דם האם ותוקף את כדוריותיה', why: 'הכיוון הפוך: נוגדני האם תוקפים את העובר.' },
          { t: 'כדוריות העובר מייצרות עודף אנטיגן D ונהרסות מעצמן', why: 'ההרס נגרם מנוגדני האם.' },
          { t: 'השליה נסתמת בגלל הצטברות נוגדנים בדם האם', why: 'הנוגדנים חוצים את השליה, ולא סותמים אותה.' }] },
        { q: 'איך מונעים את הבעיה?', tag: 'rh_pregnancy', options: [
          { t: 'זריקת anti-D לאם בשבוע 28 ואחרי הלידה, לנטרול כדוריות העובר', ok: true, why: 'המטרה: לנטרל את הכדוריות העובריות לפני שהאם מתחסנת. הזריקה בשבוע 28 ובתוך 72 שעות אחרי הלידה.' },
          { t: 'זריקת anti-D לעובר בשבוע 28, לחיזוק מערכת החיסון שלו', why: 'הטיפול ניתן לאם, לא לעובר.' },
          { t: 'עירוי דם Rh חיובי לאם, כדי שתתרגל לאנטיגן D', why: 'זה יגרום לה להתחסן, והמטרה הפוכה.' },
          { t: 'טיפול בברזל לאם בכל היריון, למניעת אנמיה אצל העובר', why: 'ברזל אינו מונע הצטברות נוגדנים.' }] },
        { q: 'האם יכולה להיווצר אותה בעיה אם האם Rh חיובית והעובר Rh שלילי?', tag: 'rh_pregnancy', options: [
          { t: 'לא, כי האם מזהה את אנטיגן D כחלק מעצמה', ok: true, why: 'הבעיה נוצרת רק כשהעובר נושא אנטיגן שהאם חסרה.' },
          { t: 'כן, כי העובר חסר אנטיגן D וגורם לאם לייצר נוגדנים', why: 'האם נושאת את אנטיגן D ולכן לא תתחסן נגדו.' },
          { t: 'כן, אך רק בהיריון השני ואילך', why: 'אין מנגנון שיוצר נוגדנים נגד D אצל אם Rh חיובית.' },
          { t: 'לא, כי העובר אינו מייצר כדוריות עד הלידה', why: 'כדוריות עובריות נוצרות כבר בשלבים מוקדמים.' }] },
        { q: 'שתי כדוריות: אחת מסוג A ואחת מסוג B. למי יש נוגדנים טבעיים נגד שתיהן?', tag: 'abo_rules', fig: 'abo', figCap: 'אנטיגנים ונוגדנים במערכת ABO', options: [
          { t: 'לבעל סוג דם O, שאין לו אנטיגן A או B', ok: true, why: 'אין לו אנטיגנים A ו-B ולכן מפתח נוגדנים נגד שניהם.' },
          { t: 'לבעל סוג דם AB, שיש לו את שני האנטיגנים', why: 'הוא מכיר את שניהם כעצמי.' },
          { t: 'לבעל סוג דם A, כי הוא מכיר רק את האנטיגן שלו', why: 'לבעל A יש נוגדנים נגד B בלבד.' },
          { t: 'לאף סוג, כי נוגדנים נוצרים רק אחרי עירוי', why: 'הנוגדנים הטבעיים קיימים גם בלי עירוי.' }] },
      ], { after: fig('rh', 'אי-התאמת Rh בין אם לעובר') });
    }
  },
});
