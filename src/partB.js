'use strict';
/* ===== חלק ב׳ – אבחון לפי בדיקות דם ===== */
const PANEL_NAMES = { cbc: 'ספירת דם (CBC)', retic: 'רטיקולוציטים', iron: 'פרופיל ברזל', vit: 'ויטמינים', hemo: 'סמני המוליזה', infl: 'מדדי דלקת', kidney: 'תפקודי כליה' };
const NEXT_OK = { ida: ['iron'], acd: ['iron', 'infl'], b12: ['vit'], folate: ['vit'], aiha: ['hemo'], g6pd: ['hemo'], aplastic: ['marrow'] };
const NEXT_OPTS = { iron: 'פרופיל ברזל: פריטין וטרנספרין', vit: 'ויטמין B12 וחומצה פולית', hemo: 'סמני המוליזה: LDH ובילירובין', marrow: 'ביופסיית מח עצם', infl: 'סמני דלקת: CRP ושקיעת דם' };
const NEXT_WHY = { iron: 'מתאימה כשה-MCV נמוך, כדי להבדיל בין חוסר ברזל למחלה כרונית.', vit: 'מתאימה כשה-MCV גבוה, כדי לבדוק חוסר B12 או פולית.', hemo: 'מתאימה כשהרטיקולוציטים גבוהים, כדי לאשר המוליזה.', marrow: 'שמורה לפנציטופניה עם רטיקולוציטים נמוכים מאוד, ולא נעשית בשלב ראשון.', infl: 'CRP לבדו לא מאבחן אנמיה. הוא משלים רק כשיש חשד למחלה כרונית.' };
const CATOPT = k => `${ANEMIA_CATS[k].ic} ${k === 'mega' ? 'אנמיה מגלובלסטית' : ANEMIA_CATS[k].n}`;

function makePatient(type, edge) {
  const sex = type === 'g6pd' ? 'M' : type === 'ida' ? (Math.random() < .75 ? 'F' : 'M') : Math.random() < .5 ? 'F' : 'M';
  const age = { ida: sex === 'F' ? [15, 45] : [45, 72], b12: [55, 82], folate: [20, 40], aiha: [25, 60], g6pd: [6, 30], acd: [55, 80], aplastic: [14, 35] }[type];
  const p = genLabs(type, sex, Math.random, { edge });
  p.age = Math.round(between(age[0], age[1])); return p;
}
function patientLine(p) { return `${p.sex === 'F' ? 'אישה' : 'גבר'} בת/בן ${p.age} · תלונה: עייפות וחולשה`.replace('בת/בן', p.sex === 'F' ? 'בת' : 'בן'); }
function resetLabNote() { _labNoteShown = false; }
const TUBE_OF = k => (k === PANEL.cbc || k === PANEL.retic) ? 'tube_purple' : (k === PANEL.infl || k === PANEL.kidney) ? 'tube_green' : 'tube_gold';
const TUBE_NAME = { tube_purple: 'צינורית סגולה', tube_gold: 'צינורית צהובה', tube_green: 'צינורית ירוקה' };
function panelCard(p, keys, title, extra = '', hl = []) {
  const tb = TUBE_OF(keys); p.sid = p.sid || (1000 + Math.floor(Math.random() * 9000));
  return `<div class="card flat labform"><div class="lf-head">${ART[tb] ? `<img src="${ART[tb]}" alt="">` : ''}<div><h3 style="margin:0">${title}</h3><div class="small muted">🏥 מעבדה מרכזית · ${TUBE_NAME[tb]} · דגימה #${p.sid}</div></div></div>${labRows(keys, p.vals, p.sex, hl, keys === PANEL.hemo ? p.coombs : null)}${extra}</div>`;
}
function smearCard(p) { return `<div class="card flat" style="padding:12px;margin-top:8px"><h3>משטח דם <span class="pill">איור סכמטי</span></h3><div class="smear">${smearSVG(p.smear, Math.floor(Math.random() * 9999))}</div><p style="margin:8px 0 2px"><b>מה רואים:</b> ${SMEAR_DESC[p.smear]}</p><p class="small muted" style="margin:0">${SMEAR_WHY[p.smear]}</p></div>`; }

function feedbackDx(p, chosenCat, withSmear) {
  const info = DX_INFO[p.cat], right = chosenCat === p.cat;
  let h = `<div class="explain ${right ? 'good' : 'bad'}">${right ? '✅ נכון! ' : `🤔 לא בדיוק. זו ${ANEMIA_CATS[p.cat].n}. `}`;
  if (!right) h += `<br><b>${ANEMIA_CATS[chosenCat].short}:</b> ${WHYNOT[chosenCat]}`;
  h += `<br><b>מה מצביע על כך כאן:</b></div>` + `<div class="card flat" style="padding:10px;margin-top:8px">${labRows(info.key, p.vals, p.sex, info.key)}<ul style="padding-inline-start:20px;margin:10px 0 0">${info.pts.map(x => `<li>${x}</li>`).join('')}</ul></div>` + (withSmear ? smearCard(p) : '');
  return h;
}

/* מריץ סבב מטופלים: items = [{type, edge}], mode: 1|2|3 */
function runLabRounds(root, ctx, mode, types) {
  const edge = mode === 2; let i = 0; const scores = types.map(() => null), pats = [];
  const sumScore = () => scores.reduce((a, b) => a + (b || 0), 0);
  const host = el('<div></div>'); root.appendChild(host);
  function patientRound() {
    if (i >= types.length) { const per = scores.filter(x => x != null && x >= .999).length, rk = diagRank(per, types.length); ctx.rank = rk; ctx.finish(Math.round(100 * sumScore() / types.length), rankCard(rk, per, types.length)); return; }
    const type = types[i], p = pats[i] || (pats[i] = makePatient(type, edge)); host.innerHTML = '';
    const answeredN = scores.filter(x => x != null).length;
    const head = el(`<div><div class="row sp small muted"><span>מטופל ${i + 1} מתוך ${types.length}</span><span>⭐ ${Math.round(sumScore() * 10) / 10}</span></div><div class="bar" style="margin:8px 0"><i style="width:${100 * answeredN / types.length}%"></i></div></div>`);
    head.appendChild(jumpBar(types.length, i, scores.map(x => x != null), j => { i = j; patientRound(); window.scrollTo(0, 0); }));
    const who = el(`<div class="card"><div class="patient-head"><div class="avatar">${p.sex === 'F' ? '👩' : '👨'}</div><div><h3 style="margin:0">תוצאות בדיקות דם</h3><div class="muted">${patientLine(p)}</div></div></div></div>`);
    host.append(head, who);
    if (IS_TEACHER) who.insertAdjacentHTML('beforeend', `<div class="tnote"><b>מפתח:</b> ${TYPE_NAME[type]} (${ANEMIA_CATS[p.cat].n}). ${DX_INFO[p.cat].need}.</div>`);
    const labs = el('<div></div>'); host.appendChild(labs);
    const q = el('<div class="card"></div>'); host.appendChild(q);
    const fb = el('<div></div>'); host.appendChild(fb);
    let pts = 0; const finish = (dxPts) => { if (scores[i] == null) scores[i] = dxPts; const left = types.map((_, k) => k).filter(k => scores[k] == null); const nxt = left.find(k => k > i); const last = left.length === 0; const nx = el(`<button class="btn primary block" style="margin:12px 0">${last ? 'לסיכום 🏁' : 'מטופל הבא ←'}</button>`); nx.onclick = () => { if (last) i = types.length; else i = nxt != null ? nxt : left[0]; patientRound(); window.scrollTo(0, 0); }; fb.appendChild(nx); nx.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };

    function dxStep(nextPts = 0, weightDx = 1) {
      const opts = Object.keys(ANEMIA_CATS).map(k => ({ t: CATOPT(k), ok: k === p.cat, tag: CAT_TAG[k], _k: k }));
      mcq(q, { q: 'מהי האנמיה?', tag: CAT_TAG[p.cat], options: opts, onDone: (ok, o) => {
        fb.innerHTML = feedbackDx(p, o._k, true);
        const sub = SUBDX[p.cat];
        if (ok && sub) {
          const q2 = el('<div class="card" style="margin-top:10px"></div>'); fb.appendChild(q2);
          const correct = sub.ok(p.cat === 'mega' ? p.vals : p), keys = Object.keys(sub.opts);
          mcq(q2, { q: sub.q, tag: 'sub_dx', options: keys.map(k => ({ t: sub.opts[k][0], ok: k === correct, why: sub.opts[k][1] })), onDone: ok2 => finish(weightDx * (0.7 + 0.3 * (ok2 ? 1 : 0)) + nextPts) });
        } else finish(ok ? weightDx + nextPts : nextPts);
      } });
    }

    if (mode === 1) {
      labs.innerHTML = (resetLabNote(), '') + panelCard(p, PANEL.cbc, 'ספירת דם מלאה') + panelCard(p, PANEL.retic, 'רטיקולוציטים') + panelCard(p, PANEL.iron, 'פרופיל ברזל') + panelCard(p, PANEL.vit, 'ויטמינים') +
        panelCard(p, PANEL.hemo, 'סמני המוליזה') + panelCard(p, PANEL.infl, 'מדדי דלקת') +
        `<div class="card flat" style="padding:12px"><h3>משטח דם <span class="pill">איור סכמטי</span></h3><div class="smear">${smearSVG(p.smear, Math.floor(Math.random() * 9999))}</div><p class="muted small" style="margin:8px 0 0">${SMEAR_DESC[p.smear]}</p></div>`;
      const mcv = p.vals.MCV, cls = mcv < 80 ? 0 : mcv > 100 ? 2 : 1;
      mcq(q, { q: 'שלב 1: לפי ה-MCV, איזה סוג אנמיה זה?', tag: 'mcv_class', options: [{ t: 'מיקרוציטית (תאים קטנים)', ok: cls === 0, why: `MCV ${mcv} fL (תקין 80–100)` }, { t: 'נורמוציטית (גודל תקין)', ok: cls === 1, why: `MCV ${mcv} fL (תקין 80–100)` }, { t: 'מאקרוציטית (תאים גדולים)', ok: cls === 2, why: `MCV ${mcv} fL (תקין 80–100)` }], onDone: () => { const q2 = el('<div></div>'); q.appendChild(el('<hr style="border:0;border-top:1px solid var(--line);margin:16px 0">')); q.appendChild(q2); dxStepIn(q2); } });
      function dxStepIn(box) { const old = q; const tmp = q; /* מציג את שלב 2 בתוך אותו כרטיס */ const opts = Object.keys(ANEMIA_CATS).map(k => ({ t: CATOPT(k), ok: k === p.cat, tag: CAT_TAG[k], _k: k }));
        mcq(box, { q: 'שלב 2: מהי האנמיה?', tag: CAT_TAG[p.cat], options: opts, onDone: (ok, o) => { fb.innerHTML = feedbackDx(p, o._k); const sub = SUBDX[p.cat];
          if (ok && sub) { const q3 = el('<div class="card" style="margin-top:10px"></div>'); fb.appendChild(q3); const correct = sub.ok(p.cat === 'mega' ? p.vals : p), keys = Object.keys(sub.opts); mcq(q3, { q: sub.q, tag: 'sub_dx', options: keys.map(k => ({ t: sub.opts[k][0], ok: k === correct, why: sub.opts[k][1] })), onDone: ok2 => finish(0.7 + 0.3 * (ok2 ? 1 : 0)) }); } else finish(ok ? 1 : 0); } }); }
    } else if (mode === 2) {
      labs.innerHTML = (resetLabNote(), '') + panelCard(p, PANEL.cbc, 'ספירת דם מלאה') + panelCard(p, PANEL.retic, 'רטיקולוציטים') + panelCard(p, PANEL.iron, 'פרופיל ברזל') + panelCard(p, PANEL.vit, 'ויטמינים') +
        panelCard(p, PANEL.hemo, 'סמני המוליזה') + panelCard(p, PANEL.infl, 'מדדי דלקת');
      q.insertAdjacentHTML('afterbegin', '<div class="explain" style="margin-bottom:12px">⚠️ רמת קושי מתקדמת: הערכים בגבולות – לעיתים ה-MCV או הברזל "מטעים". חפשו את הדפוס כולו.</div>');
      dxStep();
    } else {
      labs.innerHTML = (resetLabNote(), '') + panelCard(p, PANEL.cbc, 'ספירת דם מלאה') + panelCard(p, PANEL.retic, 'רטיקולוציטים');
      const ok = NEXT_OK[type];
      mcq(q, { q: 'מה הבדיקה הבאה שתבקשו – זו שתקדם הכי הרבה את האבחנה?', tag: 'next_test', options: Object.keys(NEXT_OPTS).map(k => ({ t: NEXT_OPTS[k], ok: ok.includes(k), why: ok.includes(k) ? NEXT_WHY[k] : NEXT_WHY[k], _k: k })), onDone: (okN, o) => {
        const best = ok[0]; const keysOf = { iron: PANEL.iron, vit: PANEL.vit, hemo: PANEL.hemo, infl: PANEL.infl };
        let rev = '';
        const show = k => { if (k === 'marrow') return `<div class="card flat" style="padding:12px"><h3>ביופסיית מח עצם</h3><p>${p.cat === 'aplastic' ? 'מח עצם <b>היפוצלולרי</b>: רקמת שומן במקום תאים מייצרי דם.' : 'ללא ממצא מחשיד לכשל מח עצם.'}</p></div>`; return panelCard(p, keysOf[k], PANEL_NAMES[k]); };
        const shown = new Set([o._k]); rev += show(o._k);
        if (!okN) { rev = `<div class="explain bad">הבדיקה שתועיל הכי הרבה כאן: <b>${NEXT_OPTS[best]}</b></div>` + rev + show(best); }
        labs.insertAdjacentHTML('beforeend', rev);
        const q2 = el('<div class="card" style="margin-top:10px"></div>'); host.insertBefore(q2, fb);
        const opts = Object.keys(ANEMIA_CATS).map(k => ({ t: CATOPT(k), ok: k === p.cat, tag: CAT_TAG[k], _k: k }));
        mcq(q2, { q: 'ועכשיו – מהי האנמיה?', tag: CAT_TAG[p.cat], options: opts, onDone: (okD, od) => {
          fb.innerHTML = feedbackDx(p, od._k, true); const sub = SUBDX[p.cat]; const np = okN ? .3 : 0;
          if (okD && sub) { const q3 = el('<div class="card" style="margin-top:10px"></div>'); fb.appendChild(q3); const correct = sub.ok(p.cat === 'mega' ? p.vals : p), keys = Object.keys(sub.opts); mcq(q3, { q: sub.q, tag: 'sub_dx', options: keys.map(k => ({ t: sub.opts[k][0], ok: k === correct, why: sub.opts[k][1] })), onDone: ok2 => finish(np + .7 * (0.7 + 0.3 * (ok2 ? 1 : 0))) }); }
          else finish(np + (okD ? .7 : 0)); } });
      } });
    }
  }
  patientRound();
}
function labTypes(n = 8) {
  const base = ['ida', 'b12', 'folate', 'aiha', 'g6pd', 'acd', 'aplastic'];
  return shuffle(base.concat(shuffle(base).slice(0, n - base.length)));
}
registerGame({ id: 'b_l1', part: 'B', learned: [
    'MCV מצמצם את האפשרויות: נמוך מצביע על חוסר ברזל, גבוה על חוסר B12 או פולית.',
    'רטיקולוציטים גבוהים מצביעים על המוליזה. נמוכים מצביעים על ייצור לקוי.',
    'פריטין נמוך הוא סימן מובהק לחוסר ברזל. בילירובין ו-LDH גבוהים מצביעים על המוליזה.'
  ], icon: '🧪', title: 'רמה 1 – הבדיקות מול העיניים', desc: 'כל הבדיקות, ממצאים קלאסיים, ומשטח דם. 8 מטופלים.', teacherNote: 'שלב 1: סיווג לפי MCV. שלב 2: האנמיה. שלב 3: סיבה (איזה ויטמין / איזו המוליזה). הערכים מייצגים את הדפוס הטיפוסי.',
  mount(root, ctx) { root.insertAdjacentHTML('afterbegin', say('קיבלתי תוצאות בדיקות דם… ועכשיו אתם הרופאים. התחילו מה-MCV – הוא מצמצם את האפשרויות!', 'think')); runLabRounds(root, ctx, 1, labTypes(8)); } });
registerGame({ id: 'b_l2', part: 'B', learned: [
    'ערכים בגבול דורשים קריאת דפוס שלם ולא מדד בודד.',
    'באנמיה של מחלה כרונית יכול להיות MCV נמוך, אך הפריטין תקין או גבוה והטרנספרין נמוך.',
    'חוסר ברזל קל: פריטין נמוך גם כשה-Hb כמעט תקין.'
  ], icon: '⚖️', title: 'רמה 2 – ערכים בגבולות', desc: 'דפוסים חופפים: אנמיות קלות, MCV גבולי. בלי משטח דם. 8 מטופלים.', teacherNote: 'ערכי קצה: חוסר ברזל קל, אנמיה של מחלה כרונית עם MCV נמוך, חוסר B12 קל, המוליזה קלה, אפלסטית עם פנציטופניה קלה יחסית. דורש קריאת דפוס שלם.',
  mount(root, ctx) { root.insertAdjacentHTML('afterbegin', say('עכשיו זה לא כל כך ברור… הערכים בגבול. קראו את כל הדפוס ואל תסתמכו על מדד אחד.', 'wink')); runLabRounds(root, ctx, 2, labTypes(8)); } });
registerGame({ id: 'b_l3', part: 'B', learned: [
    'רופא טוב מזמין בדיקות בצורה ממוקדת, לפי דפוס ה-MCV והרטיקולוציטים.',
    'MCV נמוך מוביל לפרופיל ברזל. MCV גבוה מוביל ל-B12 ופולית. רטיקולוציטים גבוהים מובילים לסמני המוליזה.',
    'רטיקולוציטים נמוכים עם פנציטופניה מובילים לביופסיית מח עצם.'
  ], icon: '🧭', title: 'רמה 3 – מה הבדיקה הבאה?', desc: 'מקבלים רק CBC ורטיקולוציטים: בחרו את הבדיקה הבאה ואז אבחנו. 7 מטופלים.', teacherNote: 'מכוון לחשיבה דיאגנוסטית: דפוס MCV + רטיקולוציטים מכוון לבדיקה הבאה (ברזל / ויטמינים / המוליזה / מח עצם). באנמיה של מחלה כרונית מתקבלת גם בדיקת CRP/ESR.',
  mount(root, ctx) { root.insertAdjacentHTML('afterbegin', say('רופא טוב לא מזמין הכול – הוא מזמין חכם. התחילו עם CBC ורטיקולוציטים ובחרו את הצעד הבא.', 'happy')); runLabRounds(root, ctx, 3, labTypes(7).slice(0, 7)); } });
