'use strict';
/* ===== חלק א׳ – יחידות 1–4: מבנה, חמצן, EPO, בילירובין ===== */

/* ---------- 1. מבנה ותפקוד ---------- */
registerGame({
  id: 'a_struct', part: 'A', learned: [
    'כדורית בוגרת בלי גרעין ובלי אברונים, כולל מיטוכונדריה.',
    'בלי גרעין יש יותר מקום להמוגלובין, ולכן כל תא נושא יותר חמצן.',
    'בלי מיטוכונדריה התא לא צורך את החמצן שהוא מוביל.',
    'דיסקית דו-קעורה נותנת שטח פנים גדול ביחס לנפח, ולכן חילופי הגזים יעילים.',
    'גמישות הממברנה מאפשרת לעבור בנימים צרים מקוטר התא.',
    'המחיר: אין תיקון עצמי, ולכן אורך החיים הוא כ-120 יום.'
  ], sec: 'basics', icon: '🔬', title: 'מעבדת התכנון: בנו כדורית', desc: 'מבנה מכתיב תפקוד – גלו את התכנון האידיאלי',
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
        { q: 'מדוע היעדר הגרעין מועיל לכדורית הדם האדומה?', tag: 'struct_func', options: [
          { t: 'מתפנה בתא נפח לעוד המוגלובין, ולכן הוא נושא יותר חמצן', ok: true, why: 'כל כדורית נושאת כ-200–250 מיליון מולקולות המוגלובין.' },
          { t: 'התא מפסיק לצרוך חמצן, ולכן נשאר יותר חמצן להובלה', why: 'צריכת החמצן העצמית תלויה במיטוכונדריה, לא בגרעין.' },
          { t: 'התא יכול להתחלק מהר יותר ולחדש את עצמו בזרם הדם', why: 'כדורית בוגרת אינה מתחלקת.' },
          { t: 'התא חי זמן רב יותר כי אין גרעין שמתבלה', why: 'להפך: בלי גרעין אין תיקון, והחיים מוגבלים ל-120 יום.' }] },
        { q: 'מה היתרון של הצורה הדו-קעורה?', tag: 'struct_func', options: [
          { t: 'שטח פנים גדול ביחס לנפח, כך שהגזים עוברים בדיפוזיה מהר', ok: true, why: 'שטח פנים גדול מקצר את זמן הרוויה בריאות ואת השחרור ברקמות.' },
          { t: 'נפח פנימי גדול יותר מכדור, ולכן נכנס יותר המוגלובין', why: 'היתרון הוא היחס בין שטח הפנים לנפח, לא הנפח עצמו.' },
          { t: 'קשיחות גבוהה שמונעת מהתא להתעוות בזרם הדם', why: 'להפך: גמישות היא יתרון חשוב.' },
          { t: 'חיכוך נמוך עם דופן כלי הדם, ולכן התא נע מהר יותר', why: 'הצורה משפיעה בעיקר על חילופי הגזים.' }] },
        { q: 'כדורית חיה כ-120 יום ואינה מתקנת נזקים. מדוע?', tag: 'struct_func', options: [
          { t: 'אין לה אברונים לייצר חלבונים חדשים, ולכן נזקי הממברנה מצטברים', ok: true, why: 'אחרי כ-120 יום היא מאבדת גמישות ונלכדת בטחול ובכבד על ידי מקרופאגים.' },
          { t: 'ההמוגלובין שלה מתרוקן בהדרגה עד שהיא חסרת תועלת', why: 'ההמוגלובין לא "נגמר"; הבעיה היא פגיעה מצטברת בממברנה.' },
          { t: 'הטחול משמיד אותה לפי שעון קבוע, בלי קשר למצבה', why: 'ההסרה נובעת משינויים בקרום התא ולא מ"שעון".' },
          { t: 'מח העצם שולח אות להרוס כל כדורית בת 120 יום', why: 'אין אות כזה; הזיהוי מבוסס על מצב התא.' }] },
        { q: 'מדוע חסרה לכדורית הבוגרת מיטוכונדריה?', tag: 'struct_func', options: [
          { t: 'כדי שהתא לא יצרוך בעצמו את החמצן שהוא מוביל', ok: true, why: 'כך כל החמצן המובל מגיע לתאי היעד. את האנרגיה היא מפיקה בגליקוליזה.' },
          { t: 'כדי שהיא תפיק אנרגיה מחמצן ביעילות רבה יותר', why: 'להפך: המיטוכונדריה היא האברון שצורך חמצן להפקת אנרגיה.' },
          { t: 'כי התא אינו זקוק לאנרגיה כלל', why: 'היא זקוקה לאנרגיה לשמירת הצורה והגמישות, ומפיקה אותה בגליקוליזה.' },
          { t: 'כדי להקטין את התא בלבד, בלי קשר לחמצן', why: 'ההסבר הוא מניעת צריכת חמצן עצמית.' }] },
        { q: 'קוטר כדורית כ-7.5 מיקרון, וקוטר נימים לעיתים פחות מ-3 מיקרון. מה מאפשר לה לעבור?', tag: 'struct_func', fig: 'rbc_structure', figCap: 'מבנה כדורית הדם האדומה (איור מהספר)', options: [
          { t: 'גמישות: התא מתכופף ומשנה צורה בלי להיקרע', ok: true, why: 'הגמישות נובעת משלד הממברנה ומהיעדר גרעין.' },
          { t: 'התא מתכווץ לגודל של 3 מיקרון ומתרחב שוב אחרי הנימים', why: 'התא משנה צורה, לא נפח.' },
          { t: 'הלחץ בכלי הדם דוחף אותו בכוח, גם כשהוא קשיח', why: 'תא קשיח נתקע, ולכן הגמישות חיונית.' },
          { t: 'התא מרוקן את תוכנו זמנית ונטען מחדש בכלי הגדול', why: 'התא נשאר שלם ומלא בהמוגלובין.' }] },
      ]);
    }
  },
});

/* ---------- 2. הובלת חמצן ---------- */
registerGame({
  id: 'a_o2', part: 'A', learned: [
    'רוויית ההמוגלובין תלויה בלחץ החלקי של החמצן, לא בכמות ההמוגלובין.',
    'באנמיה הרוויה תקינה אך כמות החמצן הכוללת נמוכה, כי יש פחות המוגלובין.',
    'פחמן חד-חמצני נקשר להמוגלובין חזק פי 200 מחמצן ותופס את מקומו.',
    'חמצן עובר בדיפוזיה מהריאה לדם ומהדם לרקמות. CO₂ מובל בעיקר כביקרבונט בפלזמה.'
  ], sec: 'basics', icon: '🫁', title: 'הובלת חמצן: המוגלובין בפעולה', desc: 'עקומת הרוויה, הרעלת CO ומה באמת קורה באנמיה',
  teacherNote: 'נקודת המפתח: באנמיה הרוויה (SpO₂) תקינה אך תכולת החמצן ירודה, כי יש פחות המוגלובין. הסימולציה משתמשת במשוואה סטנדרטית (עקומת היל) להמחשה, וערכי התכולה הם קירוב.',
  mount(root, ctx) {
    const S = { p: 100, hb: 14, co: 0 }, M = { a: false, b: false, c: false };
    const n = 2.7, P50 = 26.8;
    const sat = (p, co) => { const p50 = P50 * (1 - .45 * co); const x = Math.pow(p, n); return x / (x + Math.pow(p50, n)); };
    root.insertAdjacentHTML('afterbegin', say('הנה המוגלובין! שחקו עם הלחץ החלקי של החמצן, עם רמת ההמוגלובין ועם פחמן חד-חמצני – ובדקו מה משתנה.', 'wow'));
    const card = el('<div class="card"></div>'); root.appendChild(card);
    function draw() {
      const co = S.co / 100, hbEff = S.hb * (1 - co);
      if (S.hb <= 8 && S.co === 0) M.a = true; if (S.co >= 30) M.b = true; if (S.p === 40) M.c = true;
      const sL = sat(100, co), sT = sat(40, co), cL = 1.34 * hbEff * sL + .003 * 100, cT = 1.34 * hbEff * sT + .003 * 40, cur = sat(S.p, co);
      let path = ''; for (let p = 0; p <= 110; p += 2) path += `${p === 0 ? 'M' : 'L'}${30 + p * 2.6},${150 - sat(p, co) * 130} `;
      const X = p => 30 + p * 2.6, Y = s => 150 - s * 130;
      const missions = [
        [M.a, 'הורידו את ההמוגלובין ל-8 או פחות (בלי CO) וראו מה קורה לרוויה ולחמצן שנמסר'],
        [M.b, 'הוסיפו פחמן חד-חמצני (CO) ל-30% או יותר'],
        [M.c, 'העבירו את הלחץ החלקי ל-40 mmHg (כמו ברקמות) וראו את הרוויה'],
      ];
      card.innerHTML = `<div class="mission"><h3>🎯 משימות: מה לנסות</h3>${missions.map(m => `<div class="row" style="margin:5px 0"><span>${m[0] ? '✅' : '⬜'}</span><span class="${m[0] ? 'muted' : ''}">${m[1]}</span></div>`).join('')}</div>
        <div class="slider"><label><span>לחץ חלקי של חמצן (pO₂)</span><b class="ltr">${S.p} mmHg</b></label><input type="range" min="0" max="110" value="${S.p}" data-k="p"></div>
        <div class="slider"><label><span>רמת המוגלובין בדם</span><b class="ltr">${S.hb} g/dL</b></label><input type="range" min="4" max="18" step=".5" value="${S.hb}" data-k="hb"></div>
        <div class="slider"><label><span>פחמן חד-חמצני (CO) – אחוז המוגלובין תפוס</span><b class="ltr">${S.co}%</b></label><input type="range" min="0" max="60" step="5" value="${S.co}" data-k="co"></div>
        <svg class="chart" viewBox="0 0 330 175"><text x="318" y="12" font-size="11" fill="var(--muted)" text-anchor="end">רוויית המוגלובין לפי לחץ חמצן</text>
        <line x1="30" y1="150" x2="316" y2="150" stroke="var(--line)"/><line x1="30" y1="20" x2="30" y2="150" stroke="var(--line)"/>
        <path d="${path}" fill="none" stroke="var(--primary)" stroke-width="3"/>
        <line x1="${X(100)}" x2="${X(100)}" y1="20" y2="150" stroke="var(--teal)" stroke-dasharray="4 4"/><text x="${X(100)}" y="165" font-size="10" fill="var(--teal)" text-anchor="middle">ריאות 100</text>
        <line x1="${X(40)}" x2="${X(40)}" y1="20" y2="150" stroke="var(--blue)" stroke-dasharray="4 4"/><text x="${X(40)}" y="165" font-size="10" fill="var(--blue)" text-anchor="middle">רקמות 40</text>
        <circle cx="${X(S.p)}" cy="${Y(cur)}" r="7" fill="var(--gold)" stroke="#fff" stroke-width="2"/></svg>
        <div class="kpi"><div><b>${Math.round(cur * 100)}%</b><span>רוויה בלחץ שנבחר</span></div><div><b>${Math.round(sL * 100)}%</b><span>רוויה בריאות</span></div><div><b>${Math.round(sT * 100)}%</b><span>רוויה ברקמות</span></div></div>
        <div class="kpi"><div><b>${cL.toFixed(1)}</b><span>חמצן בדם (מ"ל/ד"ל) – ריאות</span></div><div><b>${cT.toFixed(1)}</b><span>חמצן בדם – רקמות</span></div><div class="${(cL - cT) < 3.5 ? 'L' : ''}"><b>${(cL - cT).toFixed(1)}</b><span>חמצן שנמסר לרקמות</span></div></div>
        <div class="explain">${S.hb < 11 && S.co === 0 ? '💡 שימו לב: ברמת המוגלובין נמוכה הרוויה נשארת גבוהה, אבל הכמות הכוללת של חמצן שהדם נושא קטנה! אנמיה פוגעת בקיבולת ההובלה, לא באחוז הרוויה.' : S.co >= 20 ? '☠️ CO נקשר להמוגלובין חזק פי 200 מחמצן, תופס מקום ומקשה גם על שחרור החמצן – לכן כמות החמצן שנמסרת צונחת.' : 'נסו להוריד את ההמוגלובין או להוסיף CO ולראות את החמצן שנמסר לרקמות.'}</div>
        ${fig('o2_delivery', 'העברת חמצן בריאות וברקמות (איור מהספר)')}`;
      $$('input[type=range]', card).forEach(r => r.oninput = () => { S[r.dataset.k] = +r.value; const y = window.scrollY; draw(); window.scrollTo(0, y); const nr = $(`input[data-k=${r.dataset.k}]`, card); nr && nr.focus(); });
    }
    draw();
    const go = el('<button class="btn primary block">למבחן קצר 🏁</button>'); root.appendChild(go);
    go.onclick = () => { root.innerHTML = ''; runQuiz(root, ctx, [
      { q: 'אדם עם המוגלובין 7 g/dL (אנמיה) והריאות שלו תקינות. מה יהיו רוויית החמצן (SpO₂) והכמות הכוללת של חמצן בדם?', tag: 'o2_transport', options: [
        { t: 'הרוויה תקינה, אך הכמות הכוללת של החמצן בדם נמוכה', ok: true, why: 'כל מולקולת המוגלובין עמוסה, אבל יש פחות מולקולות.' },
        { t: 'הרוויה נמוכה, כי יש פחות המוגלובין שקושר חמצן', why: 'הרוויה תלויה בלחץ החמצן ולא בכמות ההמוגלובין.' },
        { t: 'הרוויה גבוהה במיוחד, כי כל מולקולה קושרת יותר חמצן', why: 'מולקולה קושרת עד 4 מולקולות חמצן בלבד.' },
        { t: 'גם הרוויה וגם הכמות תקינות, כי הריאות תקינות', why: 'הכמות הכוללת תלויה גם ברמת ההמוגלובין.' }] },
      { q: 'מדוע הרעלת פחמן חד-חמצני (CO) מסוכנת כל כך?', tag: 'o2_transport', options: [
        { t: 'הוא נקשר להמוגלובין חזק פי 200 מחמצן ומונע הובלת חמצן', ok: true, why: 'לכן דורש טיפול רפואי דחוף.' },
        { t: 'הוא מפרק את ההמוגלובין ומונע ייצור כדוריות חדשות', why: 'הבעיה היא תפיסת אתרי הקישור, לא פירוק.' },
        { t: 'הוא מגביר את צריכת החמצן ברקמות מעבר ליכולת הדם', why: 'הצריכה לא משתנה; ההובלה היא שנפגעת.' },
        { t: 'הוא הורס את קרום הכדורית ומחסל את התאים בדקות', why: 'הכדוריות נשארות שלמות אך "תפוסות".' }] },
      { q: 'כמה מולקולות חמצן יכולה לשאת מולקולת המוגלובין אחת, ולמה?', tag: 'o2_transport', fig: 'hemoglobin', figCap: 'מבנה ההמוגלובין (איור מהספר)', options: [
        { t: 'עד ארבע: יש בה ארבע קבוצות הֶם, ובכל אחת אטום ברזל', ok: true, why: 'אטום הברזל בהֶם הוא האתר הפעיל לקישור חמצן.' },
        { t: 'אחת, כי יש במולקולה אטום ברזל אחד בלבד', why: 'יש ארבע קבוצות הֶם.' },
        { t: 'שתיים, כי היא בנויה משתי שרשראות בלבד', why: 'היא בנויה מארבע תת-יחידות, כל אחת עם הֶם.' },
        { t: 'מאות, כי כל חומצת אמינו קושרת חמצן', why: 'הקישור הוא לברזל שבהֶם.' }] },
      { q: 'איך עובר החמצן מהאלוואולי אל הדם וממנו לרקמות?', tag: 'o2_transport', options: [
        { t: 'בדיפוזיה לפי הפרש לחצים, בלי צריכת אנרגיה', ok: true, why: 'לחץ החמצן כ-100 mmHg בריאות וכ-40 ברקמות.' },
        { t: 'בהובלה פעילה שמשתמשת בחלבוני קרום ובאנרגיה', why: 'אין צורך באנרגיה מטבולית.' },
        { t: 'בשאיבה של הלב שדוחפת את הגז דרך דופן הנימים', why: 'הלב מזרים דם, אך הגז עובר בדיפוזיה.' },
        { t: 'באנדוציטוזה של בועיות חמצן אל תוך הכדוריות', why: 'חמצן הוא מולקולה קטנה שעוברת ישירות.' }] },
      { q: 'איך מובל רוב הפחמן הדו-חמצני בדם?', tag: 'o2_transport', fig: 'co2', figCap: 'הובלת CO₂ (איור מהספר)', options: [
        { t: 'בעיקר כביקרבונט בפלזמה, בעזרת אנזים בתוך הכדורית', ok: true, why: 'האנזים הוא קרבוניק אנהידראז. כ-30% נקשרים לגלובין וכ-10% מומסים.' },
        { t: 'בעיקר קשור לברזל בהֶם, באותו אתר כמו החמצן', why: 'לברזל נקשר חמצן; CO₂ נקשר לחלק הגלובין.' },
        { t: 'בעיקר מומס בפלזמה כגז, בלי צורך בכדוריות', why: 'רק כ-10% מומסים.' },
        { t: 'בעיקר קשור לאלבומין בפלזמה', why: 'אלבומין אינו נשא עיקרי של CO₂.' }] },
    ]); };
  },
});

/* ---------- 3. EPO ---------- */
registerGame({
  id: 'a_epo', part: 'A', learned: [
    'ירידה באספקת החמצן לרקמות מעלה את ה-EPO מהכליה, והייצור במח העצם גובר.',
    'כשמספר הכדוריות חוזר לנורמה ה-EPO יורד: זה משוב שלילי.',
    'במחלת כליות כרונית ה-EPO עצמו נפגע, ולכן אין איזון ונוצרת אנמיה. EPO סינתטי יכול לתקן זאת.',
    'בהמוליזה ה-EPO עולה והמח מואץ, אך הייצור לא תמיד מדביק את ההרס.'
  ], sec: 'basics', icon: '🧪', title: 'הכליה מווסתת: משוב ה-EPO', desc: 'נבאו, הריצו סימולציה וראו את מנגנון המשוב השלילי',
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
        const sim = simulate(sc.p), n = sim.Rs.length;
        const box = el('<div style="margin-top:16px"><h3>הסימולציה</h3><p class="muted small">שלושה גרפים לאורך 90 ימים. הקו המקווקו הוא הערך התקין.</p><div id="ch"></div><div class="explain" id="ex" style="display:none"></div><div id="ctl"></div></div>'); c.appendChild(box);
        const LG = (col, t) => `<div class="lg"><i style="background:${col}"></i>${t}</div>`;
        function frame(kk) {
          $('#ch', box).innerHTML = LG('var(--primary)', 'מספר הכדוריות בדם <span class="muted">(100 = נורמה)</span>') + lineChart([{ pts: sim.Rs.slice(0, kk), color: 'var(--primary)', n }], { yMin: 40, yMax: 150, ref: 100 }) +
            LG('var(--blue)', 'רמת ה-EPO שהכליה מפרישה <span class="muted">(1 = נורמה)</span>') + lineChart([{ pts: sim.Es.slice(0, kk), color: 'var(--blue)', n }], { yMin: 0, yMax: 6, ref: 1, h: 100 }) +
            LG('var(--gold)', 'קצב ייצור כדוריות חדשות: רטיקולוציטים <span class="muted">(%)</span>') + lineChart([{ pts: sim.Ts.slice(0, kk), color: 'var(--gold)', n }], { yMin: 0, yMax: 12, ref: 1.5, h: 100 });
        }
        let nxBtn = null;
        function play() {
          $('#ex', box).style.display = 'none'; $('#ctl', box).innerHTML = '';
          let k = 2;
          const iv = setInterval(() => {
            k += 3; const kk = Math.min(k, n); frame(kk);
            if (kk >= n) {
              clearInterval(iv); const ex = $('#ex', box); ex.style.display = ''; ex.innerHTML = `💡 ${sc.exp}`;
              const ctl = $('#ctl', box); ctl.innerHTML = '<button class="btn block" id="rp" style="margin-top:10px">↻ הצג שוב</button>';
              $('#rp', ctl).onclick = play;
              if (!nxBtn) { nxBtn = el(`<button class="btn primary block" style="margin-top:10px">${i + 1 >= SCN.length ? 'לסיכום 🏁' : 'לתרחיש הבא ←'}</button>`); nxBtn.onclick = () => { i++; round(); }; }
              ctl.appendChild(nxBtn);
            }
          }, 45);
          c._iv = iv;
        }
        play();
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
  id: 'a_bili', part: 'A', learned: [
    'כדורית ישנה נבלעת במקרופאג: הגלובין הופך לחומצות אמינו, הברזל מוחזר וההֶם הופך לבילירובין.',
    'בילירובין לא ישיר נקשר לאלבומין ועובר לכבד, שם הופך לישיר ומסיס.',
    'בילירובין ישיר עובר דרך המרה למעי, ושם נוצר הצבע החום של הצואה.',
    'בהמוליזה עולה הבילירובין הלא ישיר, ולכן מופיעים צהבת ושתן כהה.'
  ], sec: 'basics', icon: '🟡', title: 'מסע ההֶם: מכדורית ישנה לצהבת', desc: 'סדרו את מסלול הפירוק והבילירובין',
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
        { q: 'במצב של המוליזה מוגברת, איזה בילירובין עולה בדם?', tag: 'bili_path', options: [
          { t: 'בילירובין לא ישיר, שנוצר מההֶם לפני שהוא מגיע לכבד', ok: true, why: 'הכבד לא מספיק לעבד את כולו.' },
          { t: 'בילירובין ישיר, כי הכבד מעבד יותר מדי בבת אחת', why: 'הישיר נוצר בכבד; הבעיה בהמוליזה היא עודף ייצור לפני הכבד.' },
          { t: 'שני הסוגים באותה מידה, כי הכבד חסום', why: 'הכבד תקין; העלייה היא בעיקר בלא ישיר.' },
          { t: 'אורובילינוגן בלבד, כי חיידקי המעי פעילים יותר', why: 'גם הוא עולה, אך הממצא העיקרי בדם הוא הבילירובין הלא ישיר.' }] },
        { q: 'מדוע מופיעה צהבת באנמיה המוליטית?', tag: 'bili_path', options: [
          { t: 'הכבד מוצף בבילירובין מעבר ליכולתו, והעודף נצבר ברקמות', ok: true, why: 'כך הבילירובין הלא ישיר מצהיב את העור והלחמיות.' },
          { t: 'הכבד נפגע מההמוליזה ומפסיק לעבד בילירובין', why: 'הכבד תקין, אך הוצף.' },
          { t: 'דרכי המרה נחסמות, והבילירובין חוזר לדם', why: 'זו צהבת חסימתית, ולא צהבת המוליטית.' },
          { t: 'הברזל שמשתחרר מהכדוריות מצהיב את העור', why: 'הצהבת נובעת מבילירובין, לא מברזל.' }] },
        { q: 'מה קורה לברזל שמשתחרר בפירוק ההֶם?', tag: 'bili_path', options: [
          { t: 'הוא נקשר לטרנספרין ומוחזר למח העצם, או נאגר בכבד', ok: true, why: 'מיחזור הברזל מספק את רוב הברזל לייצור כדוריות.' },
          { t: 'הוא הופך לבילירובין ומופרש ברובו בצואה', why: 'הבילירובין נוצר מההֶם בלי הברזל.' },
          { t: 'הוא מופרש בשתן יחד עם תוצרי הפירוק של ההֶם', why: 'הברזל יקר ומוחזר ולא מופרש.' },
          { t: 'הוא נהרס במקרופאג ונפלט מהגוף', why: 'הברזל אינו נהרס, ומיוחזר.' }] },
        { q: 'למה השתן נעשה כהה (דמוי תה) בהמוליזה חריפה?', tag: 'bili_path', options: [
          { t: 'תוצרי פירוק של ההמוגלובין מסוננים בכליות ומופרשים בשתן', ok: true, why: 'בגלל ריכוזם הגבוה בזמן המוליזה.' },
          { t: 'בילירובין לא ישיר מסונן בקלות בכליות ומצבע את השתן', why: 'הבילירובין הלא ישיר קשור לאלבומין ולכן אינו מסונן.' },
          { t: 'הכליות מייצרות פיגמנט חדש בתגובה לאנמיה', why: 'מדובר בתוצרי פירוק מהדם.' },
          { t: 'התייבשות מרכזת את השתן, וזה כל ההסבר', why: 'התייבשות לא מסבירה צבע כהה כזה.' }] },
      ]);
    }
  },
});
