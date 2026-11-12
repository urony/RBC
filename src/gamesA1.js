'use strict';
/* ===== חלק א׳ – יחידות 1–4: מבנה, חמצן, EPO, בילירובין ===== */

/* ---------- 1. מבנה ותפקוד ---------- */
registerGame({
  id: 'a_struct', part: 'A', sec: 'basics', icon: '🔬', title: 'מעבדת התכנון: בנו כדורית', desc: 'מבנה מכתיב תפקוד – גלו את התכנון האידיאלי',
  teacherNote: 'הפתרון האידיאלי: בלי גרעין, בלי אברונים, דיסקית דו-קעורה וגמישה. הסטודנטים מגלים זאת דרך ניסוי ואז עונים על שאלות סיכום.',
  mount(root, ctx) {
    const S = { nuc: true, org: true, shape: 'sphere', flex: false };
    const card = el('<div class="card"></div>'); root.appendChild(card);
    root.insertAdjacentHTML('afterbegin', say('אני צריכה כדורית שמובילה חמצן בצורה הכי יעילה בגוף. עזרו לי לתכנן אותי! שחקו עם ההגדרות עד שכל המדדים יגיעו ל-90% ומעלה.', 'think'));
    const out = el('<div class="card"></div>'); const next = el('<div></div>');
    root.append(out, next);
    function calc() {
      const hb = 100 - (S.nuc ? 28 : 0) - (S.org ? 14 : 0);
      const gas = S.shape === 'disc' ? 100 : 72;
      const cap = clamp((S.flex ? 100 : 12) - (S.nuc ? 35 : 0), 0, 100);
      const o2 = S.org ? 68 : 100;
      return { hb, gas, cap, o2 };
    }
    function draw() {
      const m = calc(), win = Object.values(m).every(v => v >= 90);
      card.innerHTML = `<h3>בחרו את מאפייני התא</h3><div class="col">
        <div><b>גרעין</b><div class="seg" data-k="nuc"><button data-v="1" class="${S.nuc ? 'on' : ''}">יש גרעין</button><button data-v="0" class="${!S.nuc ? 'on' : ''}">אין גרעין</button></div></div>
        <div><b>אברונים (כולל מיטוכונדריה)</b><div class="seg" data-k="org"><button data-v="1" class="${S.org ? 'on' : ''}">יש אברונים</button><button data-v="0" class="${!S.org ? 'on' : ''}">אין אברונים</button></div></div>
        <div><b>צורה</b><div class="seg" data-k="shape"><button data-v="sphere" class="${S.shape === 'sphere' ? 'on' : ''}">כדור</button><button data-v="disc" class="${S.shape === 'disc' ? 'on' : ''}">דיסקית דו-קעורה</button></div></div>
        <div><b>גמישות הממברנה</b><div class="seg" data-k="flex"><button data-v="0" class="${!S.flex ? 'on' : ''}">קשיחה</button><button data-v="1" class="${S.flex ? 'on' : ''}">גמישה</button></div></div></div>`;
      out.innerHTML = `<h3>תוצאות התכנון</h3>${meter('מקום פנוי להמוגלובין', m.hb)}${meter('יעילות חילופי גזים (שטח פנים ביחס לנפח)', m.gas)}${meter('מעבר בנימי דם צרים (פחות מ-3 מיקרון)', m.cap)}${meter('חמצן שמגיע לתאי הגוף (לא נצרך בתא)', m.o2)}
        <div class="explain ${win ? 'good' : ''}">${win ? '🎉 זה התכנון של כדורית הדם האדומה האמיתית! לכן אין גרעין ואברונים, והצורה דו-קעורה וגמישה.' : hint(m)}</div>
        <div class="small muted" style="margin-top:8px">שטח הפנים של דיסקית דו-קעורה גדול בכ-40% משטח הפנים של כדור באותו נפח (בערך 135 לעומת 97 מיקרומטר רבועים).</div>`;
      next.innerHTML = win ? `<button class="btn primary block" id="go">למבחן קצר 🏁</button>` : '';
      if (win) { $('#go', next).onclick = quiz; }
    }
    function hint(m) { if (m.hb < 90) return 'רמז: מה תופס מקום מיותר בתוך התא שצריך להיות מלא בהמוגלובין?'; if (m.gas < 90) return 'רמז: איזו צורה נותנת הכי הרבה שטח פנים ביחס לנפח?'; if (m.cap < 90) return 'רמז: הנימים צרים יותר מקוטר התא (7.5 מיקרון) – מה צריך כדי לעבור שם?'; return 'רמז: מי "גונב" חמצן לעצמו?'; }
    card.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const k = b.parentElement.dataset.k, v = b.dataset.v; if (k === 'shape') S.shape = v; else S[k] = v === '1'; draw(); });
    draw();
    function quiz() {
      root.innerHTML = '';
      runQuiz(root, ctx, [
        { q: 'מדוע היעדר הגרעין מועיל לכדורית הדם האדומה?', tag: 'struct_func', options: [{ t: 'מתפנה נפח לאחסון עשרות מיליוני מולקולות המוגלובין', ok: true, why: 'כל כדורית נושאת כ-200–250 מיליון מולקולות המוגלובין.' }, { t: 'כך היא יכולה לשכפל את עצמה', why: 'כדורית בוגרת אינה מתחלקת.' }, { t: 'כך היא מייצרת חלבונים בקצב מהיר יותר', why: 'היעדר גרעין פירושו שהיא לא מייצרת חלבונים חדשים.' }] },
        { q: 'מה היתרון של הצורה הדו-קעורה?', tag: 'struct_func', fig: 'rbc_structure', figCap: 'מבנה כדורית הדם האדומה (איור מהספר)', options: [{ t: 'יחס גבוה בין שטח הפנים לנפח – דיפוזיה יעילה של גזים', ok: true, why: 'שטח פנים גדול מקצר את זמן הרוויה בחמצן בריאות ואת זמן השחרור ברקמות.' }, { t: 'היא מאפשרת לכדורית להכיל יותר גרעינים', why: 'אין גרעין בכדורית בוגרת.' }, { t: 'היא הופכת את הכדורית לקשיחה יותר', why: 'להפך – גמישות היא יתרון.' }] },
        { q: 'כדורית חיה כ-120 יום ואינה מתקנת נזקים. מדוע?', tag: 'struct_func', options: [{ t: 'בלי אברונים היא אינה מסוגלת לייצר חלבונים חדשים או לתקן את המבנה', ok: true, why: 'לאחר כ-120 יום היא מאבדת גמישות ונלכדת בטחול ובכבד על ידי מקרופאגים.' }, { t: 'הכבד מחסל אותה בכוונה אחרי 120 יום, גם אם היא תקינה לגמרי', why: 'ההסרה נובעת מהזדקנות ומשינויים בקרום התא.' }, { t: 'היא פשוט מתרוקנת מהמוגלובין', why: 'ההמוגלובין לא "נגמר" – הבעיה היא פגיעה מצטברת בממברנה.' }] },
        { q: 'מדוע חסרה לכדורית הבוגרת מיטוכונדריה?', tag: 'struct_func', options: [{ t: 'כדי שלא תצרוך חמצן בעצמה – כל החמצן מגיע לתאי היעד', ok: true, why: 'היעדר מיטוכונדריה מבטיח שהחמצן המובל לא נצרך על ידי הכדורית עצמה.' }, { t: 'כי החמצן מזיק לה', why: 'לא זו הסיבה.' }, { t: 'כי המיטוכונדריה גדולה מדי לנימים', why: 'הסיבה האמיתית היא מניעת צריכת חמצן עצמית.' }] },
        { q: 'קוטר כדורית כ-7.5 מיקרון, וקוטר נימים לעיתים פחות מ-3 מיקרון. מה מאפשר לה לעבור?', tag: 'struct_func', options: [{ t: 'גמישות מכנית – היא מתקפלת ומתעוותת בלי להינזק', ok: true, why: 'הגמישות נובעת משלד הממברנה ומהיעדר גרעין.' }, { t: 'היא מתפרקת לחתיכות וחוזרת להתחבר', why: 'הכדורית נשארת שלמה.' }, { t: 'הלחץ בדם דוחף אותה בכוח', why: 'הלחץ לא מספיק אם התא קשיח.' }] },
      ]);
    }
  },
});

/* ---------- 2. הובלת חמצן ---------- */
registerGame({
  id: 'a_o2', part: 'A', sec: 'basics', icon: '🫁', title: 'הובלת חמצן: המוגלובין בפעולה', desc: 'עקומת הרוויה, הרעלת CO ומה באמת קורה באנמיה',
  teacherNote: 'נקודת המפתח: באנמיה הרוויה (SpO₂) תקינה אך תכולת החמצן ירודה, כי יש פחות המוגלובין. הסימולציה משתמשת במשוואה סטנדרטית (עקומת היל) להמחשה, וערכי התכולה הם קירוב.',
  mount(root, ctx) {
    const S = { p: 100, hb: 14, co: 0 };
    const n = 2.7, P50 = 26.8;
    const sat = (p, co) => { const p50 = P50 * (1 - .45 * co); const x = Math.pow(p, n); return x / (x + Math.pow(p50, n)); };
    root.insertAdjacentHTML('afterbegin', say('הנה המוגלובין! שחקו עם הלחץ החלקי של החמצן, עם רמת ההמוגלובין ועם פחמן חד-חמצני – ובדקו מה משתנה.', 'wow'));
    const card = el('<div class="card"></div>'); root.appendChild(card);
    function draw() {
      const co = S.co / 100, hbEff = S.hb * (1 - co);
      const sL = sat(100, co), sT = sat(40, co), cL = 1.34 * hbEff * sL + .003 * 100, cT = 1.34 * hbEff * sT + .003 * 40, cur = sat(S.p, co);
      let path = ''; for (let p = 0; p <= 110; p += 2) path += `${p === 0 ? 'M' : 'L'}${30 + p * 2.6},${150 - sat(p, co) * 130} `;
      const X = p => 30 + p * 2.6, Y = s => 150 - s * 130;
      card.innerHTML = `<svg class="chart" viewBox="0 0 330 175"><text x="318" y="12" font-size="11" fill="var(--muted)" text-anchor="end">רוויית המוגלובין לפי לחץ חמצן</text>
        <line x1="30" y1="150" x2="316" y2="150" stroke="var(--line)"/><line x1="30" y1="20" x2="30" y2="150" stroke="var(--line)"/>
        <path d="${path}" fill="none" stroke="var(--primary)" stroke-width="3"/>
        <line x1="${X(100)}" x2="${X(100)}" y1="20" y2="150" stroke="var(--teal)" stroke-dasharray="4 4"/><text x="${X(100)}" y="165" font-size="10" fill="var(--teal)" text-anchor="middle">ריאות 100</text>
        <line x1="${X(40)}" x2="${X(40)}" y1="20" y2="150" stroke="var(--blue)" stroke-dasharray="4 4"/><text x="${X(40)}" y="165" font-size="10" fill="var(--blue)" text-anchor="middle">רקמות 40</text>
        <circle cx="${X(S.p)}" cy="${Y(cur)}" r="7" fill="var(--gold)" stroke="#fff" stroke-width="2"/></svg>
        <div class="slider"><label><span>לחץ חלקי של חמצן (pO₂)</span><b class="ltr">${S.p} mmHg</b></label><input type="range" min="0" max="110" value="${S.p}" data-k="p"></div>
        <div class="slider"><label><span>רמת המוגלובין בדם</span><b class="ltr">${S.hb} g/dL</b></label><input type="range" min="4" max="18" step=".5" value="${S.hb}" data-k="hb"></div>
        <div class="slider"><label><span>פחמן חד-חמצני (CO) – אחוז המוגלובין תפוס</span><b class="ltr">${S.co}%</b></label><input type="range" min="0" max="60" step="5" value="${S.co}" data-k="co"></div>
        <div class="kpi"><div><b>${Math.round(cur * 100)}%</b><span>רוויה בלחץ שנבחר</span></div><div><b>${Math.round(sL * 100)}%</b><span>רוויה בריאות</span></div><div><b>${Math.round(sT * 100)}%</b><span>רוויה ברקמות</span></div></div>
        <div class="kpi"><div><b>${cL.toFixed(1)}</b><span>חמצן בדם (מ"ל/ד"ל) – ריאות</span></div><div><b>${cT.toFixed(1)}</b><span>חמצן בדם – רקמות</span></div><div class="${(cL - cT) < 3.5 ? 'L' : ''}"><b>${(cL - cT).toFixed(1)}</b><span>חמצן שנמסר לרקמות</span></div></div>
        <div class="explain">${S.hb < 11 && S.co === 0 ? '💡 שימו לב: ברמת המוגלובין נמוכה הרוויה נשארת גבוהה, אבל הכמות הכוללת של חמצן שהדם נושא קטנה! אנמיה פוגעת בקיבולת ההובלה, לא באחוז הרוויה.' : S.co >= 20 ? '☠️ CO נקשר להמוגלובין חזק פי 200 מחמצן, תופס מקום ומקשה גם על שחרור החמצן – לכן כמות החמצן שנמסרת צונחת.' : 'נסו להוריד את המוגלובין או להוסיף CO ולראות את החמצן שנמסר לרקמות.'}</div>
        ${fig('o2_delivery', 'העברת חמצן בריאות וברקמות (איור מהספר)')}`;
      $$('input[type=range]', card).forEach(r => r.oninput = () => { S[r.dataset.k] = +r.value; const y = window.scrollY; draw(); window.scrollTo(0, y); const nr = $(`input[data-k=${r.dataset.k}]`, card); nr && nr.focus(); });
    }
    draw();
    const go = el('<button class="btn primary block">למבחן קצר 🏁</button>'); root.appendChild(go);
    go.onclick = () => { root.innerHTML = ''; runQuiz(root, ctx, [
      { q: 'אדם עם המוגלובין 7 g/dL (אנמיה) והריאות שלו תקינות. מה תהיה רוויית החמצן בהמוגלובין (SpO₂) שלו?', tag: 'o2_transport', options: [{ t: 'תקינה – אבל כמות החמצן הכוללת בדם נמוכה', ok: true, why: 'באחוז הרוויה כל מולקולת המוגלובין עמוסה, אבל יש פחות מולקולות.' }, { t: 'נמוכה מאוד', why: 'הרוויה תלויה בלחץ החמצן ולא בכמות ההמוגלובין.' }, { t: 'גבוהה מ-100%', why: 'אי אפשר לעבור 100%.' }] },
      { q: 'מדוע הרעלת פחמן חד-חמצני (CO) מסוכנת כל כך?', tag: 'o2_transport', options: [{ t: 'CO נקשר לברזל בהמוגלובין חזק פי 200 מחמצן ומונע הובלת חמצן', ok: true, why: 'לכן דורש טיפול רפואי דחוף.' }, { t: 'CO הורס את הכדוריות מיד', why: 'הבעיה היא תפיסת אתרי הקישור.' }, { t: 'CO מוריד את מספר הכדוריות', why: 'המספר נשמר, אבל הן "תפוסות".' }] },
      { q: 'כמה מולקולות חמצן יכולה לשאת מולקולת המוגלובין אחת, ולמה?', tag: 'o2_transport', fig: 'hemoglobin', figCap: 'מבנה ההמוגלובין (איור מהספר)', options: [{ t: 'עד 4 – יש בה 4 תת-יחידות, בכל אחת קבוצת הֶם עם אטום ברזל', ok: true, why: 'אטום הברזל בהֶם הוא האתר הפעיל לקישור חמצן.' }, { t: '1 – יש רק אטום ברזל אחד', why: 'יש ארבע קבוצות הֶם.' }, { t: '100 – כל חומצת אמינו קושרת חמצן', why: 'הקישור הוא לברזל שבהֶם.' }] },
      { q: 'איך עובר החמצן מהאלוואולי אל הדם וממנו לרקמות?', tag: 'o2_transport', options: [{ t: 'בדיפוזיה פשוטה לפי מפל ריכוזים, בלי צריכת אנרגיה', ok: true, why: 'לחץ החמצן כ-100 mmHg בריאות וכ-40 ברקמות.' }, { t: 'בהובלה פעילה שצורכת ATP', why: 'אין צורך באנרגיה מטבולית.' }, { t: 'על ידי שאיבה של הלב', why: 'הלב מזרים דם, אך הגז עובר בדיפוזיה.' }] },
      { q: 'איך מובל רוב הפחמן הדו-חמצני בדם?', tag: 'o2_transport', fig: 'co2', figCap: 'הובלת CO₂ (איור מהספר)', options: [{ t: 'כ-60% כביקרבונט בפלזמה, בזכות האנזים קרבוניק אנהידראז בכדורית', ok: true, why: 'כ-30% נקשרים לגלובין וכ-10% מומסים.' }, { t: 'כ-60% נקשרים לברזל בהֶם', why: 'לברזל נקשר חמצן; CO₂ נקשר לגלובין (כ-30%).' }, { t: 'כולו מומס בפלזמה', why: 'רק כ-10% מומסים.' }] },
    ]); };
  },
});

/* ---------- 3. EPO ---------- */
registerGame({
  id: 'a_epo', part: 'A', sec: 'basics', icon: '🧪', title: 'הכליה מווסתת: משוב ה-EPO', desc: 'נבאו, הריצו סימולציה וראו את מנגנון המשוב השלילי',
  teacherNote: 'הסימולציה היא מודל פשטני (אותו עיקרון כמו בספר): ירידה בחמצן ברקמות ← עלייה ב-EPO ← ייצור מוגבר. כוללת השהיה של כמה ימים בבשלות במח העצם. המספרים להמחשה בלבד.',
  mount(root, ctx) {
    const SCN = [
      { id: 'bleed', ic: '🩸', t: 'דימום חריף – אובדן כ-20% מהכדוריות', epo: 'hi', fin: 'norm', exp: 'החמצן ברקמות יורד ← הכליות מפרישות יותר EPO ← ייצור מוגבר, ומספר הכדוריות חוזר בהדרגה לנורמה (כל עוד יש חומרי גלם).', p: { bleed: 20 } },
      { id: 'alt', ic: '🏔️', t: 'טיול לגובה רב – פחות חמצן באוויר', epo: 'hi', fin: 'up', exp: 'בגובה החמצן ברקמות יורד ← עלייה ב-EPO ← יותר כדוריות. המספר מתייצב מעל הנורמה, ואז ה-EPO חוזר לרמה כמעט תקינה (משוב שלילי).', p: { o2f: .8 } },
      { id: 'ckd', ic: '🫘', t: 'אי-ספיקת כליות כרונית', epo: 'lo', fin: 'down', exp: 'הכליות הפגועות לא מסוגלות לייצר EPO מספיק, אז הייצור נמוך ומתפתחת אנמיה משנית.', p: { k: .2 } },
      { id: 'ckdE', ic: '💉', t: 'אי-ספיקת כליות + זריקות EPO סינתטי', epo: 'norm', fin: 'norm', exp: 'ה-EPO הסינתטי מחליף את ההורמון שהכליות לא מייצרות ומשיב את הייצור כמעט לנורמה.', p: { k: .2, inj: 1, R0: 76 } },
      { id: 'hem', ic: '💥', t: 'המוליזה – הכדוריות נהרסות מהר פי 3', epo: 'hi', fin: 'down', exp: 'ה-EPO עולה והמח מייצר מהר יותר (רטיקולוציטוזיס), אבל הייצור לא תמיד מדביק את ההרס, ולכן נשארת אנמיה.', p: { h: 3 } },
    ];
    const EO = { hi: 'EPO גבוה מהנורמה', lo: 'EPO נמוך מהנורמה', norm: 'EPO תקין (או ללא שינוי)' };
    const FO = { norm: 'יחזור לנורמה', up: 'יתייצב מעל הנורמה', down: 'יתייצב מתחת לנורמה' };
    function simulate(p, days = 90) {
      let R = p.R0 || 100, E = 1; const lag = 4, pipe = Array(lag).fill(100 / 120), Rs = [], Es = [], Ts = [];
      if (p.bleed) R -= p.bleed;
      for (let d = 0; d < days; d++) {
        const supply = R * (p.o2f || 1);
        let tgt = (p.k || 1) * (1 + (100 - supply) * .12); tgt = clamp(tgt, .05, 6);
        if (p.inj) tgt = Math.max(tgt, p.inj);
        E += (tgt - E) * .35;
        const prod = (100 / 120) * Math.min(E, 6);
        pipe.push(prod); const out = pipe.shift();
        R += out - R / 120 * (p.h || 1);
        const rl = 1 + .4 * Math.max(0, E - 1);
        Rs.push(R); Es.push(E); Ts.push(clamp(prod / R * 100 * rl, 0, 25));
      }
      return { Rs, Es, Ts };
    }
    let i = 0, right = 0, total = 0;
    const host = el('<div></div>'); root.appendChild(host);
    function round() {
      if (i >= SCN.length) { ctx.finish(Math.round(100 * right / total), ''); return; }
      const sc = SCN[i]; host.innerHTML = '';
      const hd = el(`<div class="row sp small muted"><span>תרחיש ${i + 1} מתוך ${SCN.length}</span><span>✓ ${right}</span></div>`); host.appendChild(hd);
      const c = el(`<div class="card"><div class="center" style="font-size:2.4rem">${sc.ic}</div><h3 class="center">${sc.t}</h3></div>`); host.appendChild(c);
      let step = 0;
      function ask1() {
        mcq(c, { q: 'נבאו: מה יקרה לרמת ה-EPO בהתחלה?', tag: 'epo_feedback', options: Object.keys(EO).map(k => ({ t: EO[k], ok: k === sc.epo })), onDone: ok => { total++; if (ok) right++; ask2(); } });
      }
      function ask2() {
        const box = el('<div style="margin-top:16px"></div>'); c.appendChild(box);
        mcq(box, { q: 'ומה יקרה למספר הכדוריות לאורך זמן?', tag: 'epo_feedback', options: Object.keys(FO).map(k => ({ t: FO[k], ok: k === sc.fin })), onDone: ok => { total++; if (ok) right++; run(); } });
      }
      function run() {
        const sim = simulate(sc.p), box = el('<div style="margin-top:16px"><h3>הסימולציה</h3><div id="ch"></div><div class="explain" id="ex" style="display:none"></div></div>'); c.appendChild(box);
        let k = 2; const n = sim.Rs.length;
        const iv = setInterval(() => {
          k += 3; const kk = Math.min(k, n);
          $('#ch', box).innerHTML = lineChart([{ pts: sim.Rs.slice(0, kk), color: 'var(--primary)', n }], { yMin: 40, yMax: 150, ref: 100, label: 'מספר הכדוריות (100 = נורמה)' }) + '<div style="height:6px"></div>' +
            lineChart([{ pts: sim.Es.slice(0, kk), color: 'var(--blue)', n }], { yMin: 0, yMax: 6, ref: 1, label: 'רמת EPO (1 = נורמה)', h: 100 }) + '<div style="height:6px"></div>' +
            lineChart([{ pts: sim.Ts.slice(0, kk), color: 'var(--gold)', n }], { yMin: 0, yMax: 12, ref: 1.5, label: 'רטיקולוציטים (%)', h: 100 });
          if (kk >= n) { clearInterval(iv); const ex = $('#ex', box); ex.style.display = ''; ex.innerHTML = `💡 ${sc.exp}`; const nx = el(`<button class="btn primary block" style="margin-top:12px">${i + 1 >= SCN.length ? 'לסיכום 🏁' : 'לתרחיש הבא ←'}</button>`); nx.onclick = () => { i++; round(); }; c.appendChild(nx); }
        }, 45);
        c._iv = iv;
      }
      ask1();
    }
    root.insertAdjacentHTML('afterbegin', say('אני הכליה, ואני מחליטה כמה EPO לשלוח. בכל תרחיש נבאו קודם – ורק אז תראו מה קורה. 🔮', 'wink', 'kidney'));
    root.appendChild(el(fig('epo', 'משוב שלילי של EPO (איור מהספר)').replace('<figure', '<figure style="margin-top:0"')));
    round();
  },
});

/* ---------- 4. בילירובין ---------- */
registerGame({
  id: 'a_bili', part: 'A', sec: 'basics', icon: '🟡', title: 'מסע ההֶם: מכדורית ישנה לצהבת', desc: 'סדרו את מסלול הפירוק והבילירובין',
  teacherNote: 'שלב ראשון: סידור 8 שלבים. שלב שני: 4 שאלות על צהבת בהמוליזה. הציון הוא ממוצע של הסידור (בניסיון הראשון) והשאלות.',
  mount(root, ctx) {
    const steps = [
      'כדורית בת כ-120 יום מאבדת גמישות, ומקרופאג בטחול או בכבד לוכד ובולע אותה',
      'המקרופאג מפרק את ההמוגלובין: הגלובין לחומצות אמינו, והברזל נקשר לטרנספרין ומוחזר',
      'שארית ההֶם (בלי ברזל) הופכת לפיגמנט צהוב-כתום: בילירובין לא ישיר',
      'הבילירובין הלא ישיר נקשר לאלבומין ומועבר בדם אל הכבד',
      'בתאי הכבד הוא הופך לבילירובין ישיר – מסיס במים',
      'הבילירובין הישיר מופרש במרה לכיס המרה ומשם למעי הדק',
      'חיידקי המעי מפרקים אותו לפיגמנט שצובע את הצואה בחום',
      'חלק קטן נספג חזרה ומופרש בשתן כאורובילינוגן (צבע צהוב)',
    ];
    root.insertAdjacentHTML('afterbegin', say('כל כדורית עוברת אצלי בדיקת תוקף: 120 יום ויציאה. אבל היא לא נזרקת – ממחזרים! סדרו את המסע שלה.', 'wink', 'spleen'));
    let ord = 0;
    orderGame(root, { steps, onDone: p => { ord = p; root.innerHTML = ''; root.insertAdjacentHTML('afterbegin', fig('bili', 'מסלול הבילירובין (איור מהספר)')); quiz(); } });
    function quiz() {
      const wrap = { ...ctx, finish: (p, ex) => ctx.finish(Math.round((ord + p) / 2), ex) };
      runQuiz(root, wrap, [
        { q: 'במצב של המוליזה מוגברת, איזה בילירובין עולה בדם?', tag: 'bili_path', options: [{ t: 'בילירובין לא ישיר', ok: true, why: 'הוא נוצר מפירוק ההֶם, והכבד לא מספיק לעבד את כולו.' }, { t: 'בילירובין ישיר בלבד', why: 'הישיר נוצר בכבד, והבעיה בהמוליזה היא עודף ייצור לפני הכבד.' }] },
        { q: 'מדוע מופיעה צהבת (עור ולובן עיניים צהובים) באנמיה המוליטית?', tag: 'bili_path', options: [{ t: 'הכבד מוצף בבילירובין מעבר ליכולת העיבוד שלו, והעודף שוקע ברקמות', ok: true, why: 'כך הבילירובין הלא ישיר מצטבר בדם ומצהיב את העור והלחמיות.' }, { t: 'הכבד מפסיק לעבוד לחלוטין', why: 'הכבד תקין, אך הוצף.' }, { t: 'חוסר ברזל גורם לצהבת', why: 'צהבת קשורה לבילירובין, לא לחוסר ברזל.' }] },
        { q: 'מה קורה לברזל שמשתחרר בפירוק ההֶם?', tag: 'bili_path', options: [{ t: 'נקשר לטרנספרין ומוחזר למח העצם לייצור המוגלובין חדש, או נאגר בכבד', ok: true, why: 'כ-95% מהברזל שנדרש נלקח ממיחזור.' }, { t: 'מופרש בשתן כבילירובין', why: 'הבילירובין נוצר מהֶם בלי הברזל.' }, { t: 'נהרס לחלוטין', why: 'הברזל יקר – ממחזרים אותו.' }] },
        { q: 'למה השתן נעשה כהה (דמוי תה) בהמוליזה חריפה?', tag: 'bili_path', options: [{ t: 'תוצרי פירוק של ההמוגלובין מסוננים בכליות ומופרשים בשתן', ok: true, why: 'בגלל ריכוזם הגבוה בזמן המוליזה.' }, { t: 'הכליות מייצרות פיגמנט חדש', why: 'מדובר בתוצרי פירוק מהדם.' }, { t: 'רק התייבשות', why: 'התייבשות לא מסבירה צבע כהה כזה.' }] },
      ]);
    }
  },
});
