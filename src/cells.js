'use strict';
/* ===== איורי תאים סכמטיים (SVG) – משטחי דם מומחשים ===== */
const SMEAR_DEFS = `<defs>
<radialGradient id="body" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#f08a9b"/><stop offset="1" stop-color="#c63f59"/></radialGradient>
<radialGradient id="dense" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#e0566d"/><stop offset="1" stop-color="#a92440"/></radialGradient>
<radialGradient id="poly" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#c98bc0"/><stop offset="1" stop-color="#9a5b9b"/></radialGradient>
<radialGradient id="pal"><stop offset="0" stop-color="#fdeef1"/><stop offset=".75" stop-color="#fdeef1" stop-opacity=".9"/><stop offset="1" stop-color="#fdeef1" stop-opacity="0"/></radialGradient>
</defs>`;
const SMEAR_BG = '#fbe3e8';

function rbcShape(x, y, rx, ry, o = {}) {
  const rot = o.rot || 0, pal = o.pal == null ? .4 : o.pal, shape = o.shape || 'round';
  const g = `transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)})"`;
  const stroke = 'stroke="#b3304b" stroke-width=".8"';
  if (shape === 'sickle') {
    const r = rx;
    return `<g ${g}><path d="M${-1.25 * r} 0 Q0 ${-1.25 * r} ${1.25 * r} 0 Q0 ${-0.3 * r} ${-1.25 * r} 0Z" fill="url(#dense)" ${stroke}/></g>`;
  }
  if (shape === 'bite') {
    return `<g ${g}><ellipse rx="${rx}" ry="${ry}" fill="url(#body)" ${stroke}/><circle cx="${rx * .85}" cy="0" r="${rx * .42}" fill="${SMEAR_BG}" stroke="#b3304b" stroke-width=".6"/></g>`;
  }
  const fill = o.fill || (o.dense ? 'url(#dense)' : 'url(#body)');
  let s = `<g ${g}><ellipse rx="${rx}" ry="${ry}" fill="${fill}" ${stroke}/>`;
  if (pal > 0.05) s += `<ellipse rx="${(rx * pal).toFixed(1)}" ry="${(ry * pal).toFixed(1)}" fill="url(#pal)"/>`;
  if (shape === 'target') s += `<circle r="${(rx * .17).toFixed(1)}" fill="#c63f59"/>`;
  if (shape === 'blister') s += `<ellipse cx="${rx * .45}" cy="0" rx="${rx * .38}" ry="${ry * .5}" fill="#fdeef1" opacity=".95"/>`;
  return s + '</g>';
}
function neutrophilHyper(x, y) {
  let s = `<circle cx="${x}" cy="${y}" r="21" fill="#e8dcf2" stroke="#b9a2d6" stroke-width=".8"/>`;
  const pts = [[-9, -9], [2, -12], [11, -4], [10, 8], [-1, 12], [-11, 4]];
  s += `<polyline points="${pts.map(p => (x + p[0]) + ',' + (y + p[1])).join(' ')}" fill="none" stroke="#7a4aa8" stroke-width="1.6"/>`;
  pts.forEach(p => s += `<ellipse cx="${x + p[0]}" cy="${y + p[1]}" rx="5.2" ry="4.4" fill="#6a3d9e"/>`);
  return s;
}
function lymphocyte(x, y) { return `<circle cx="${x}" cy="${y}" r="15" fill="#cfe0f2" stroke="#9fb9d8" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="11" fill="#5b3c93"/>`; }
function platelets(r, n, w, h) { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(1.6 + r() * 1.2).toFixed(1)}" fill="#8e5ab0"/>`; return s; }

/* type: normal | ida | mega | aiha | g6pd | sickle | acd | aplastic */
function smearSVG(type, seed = 1) {
  const W = 320, H = 190, r = mulberry32(hashStr(type) + seed * 977);
  let cells = '', extras = '', n = 0;
  const P = {
    normal: { sp: 27, rx: [9.5, 10.5], pal: .42 },
    ida: { sp: 25, rx: [6, 9], pal: .72 },
    mega: { sp: 33, rx: [12, 14.5], pal: .3 },
    aiha: { sp: 26, rx: [7, 8.4], pal: 0 },
    g6pd: { sp: 27, rx: [9, 10.5], pal: .4 },
    sickle: { sp: 28, rx: [8.5, 10], pal: .4 },
    acd: { sp: 27, rx: [8.8, 10], pal: .38 },
    aplastic: { sp: 52, rx: [9, 10.5], pal: .4 },
  }[type] || { sp: 27, rx: [9.5, 10.5], pal: .4 };
  const cols = Math.floor(W / P.sp), rows = Math.floor(H / P.sp);
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    if (type === 'aplastic' && r() < .45) continue;
    const x = (i + .5) * P.sp + (r() - .5) * P.sp * .5, y = (j + .5) * P.sp + (r() - .5) * P.sp * .5;
    let rx = between(P.rx[0], P.rx[1], r), ry = rx * between(.92, 1.0, r), o = { rot: r() * 180, pal: P.pal * between(.85, 1.15, r) };
    const q = r();
    if (type === 'ida') { if (q < .16) { rx = 11; ry = 3.8; o.pal = .2; } else if (q < .3) o.pal = .85; }
    if (type === 'mega') { ry = rx * between(.7, .85, r); }
    if (type === 'aiha') { o.dense = true; o.pal = 0; if (q < .22) { rx = between(10.5, 12.5, r); ry = rx; o.fill = 'url(#poly)'; o.dense = false; o.pal = .1; } }
    if (type === 'g6pd') { if (q < .3) o.shape = 'bite'; else if (q < .45) o.shape = 'blister'; }
    if (type === 'sickle') { if (q < .42) { o.shape = 'sickle'; rx = between(8, 10, r); } else if (q < .6) o.shape = 'target'; }
    cells += rbcShape(x, y, rx, ry, o); n++;
  }
  if (type === 'mega') extras += neutrophilHyper(W * .62, H * .45);
  if (type === 'aplastic') extras += lymphocyte(W * .45, H * .5);
  const plt = type === 'aplastic' ? 1 : type === 'ida' ? 8 : 4;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="איור סכמטי של משטח דם">${SMEAR_DEFS}<rect width="${W}" height="${H}" fill="${SMEAR_BG}"/>${cells}${extras}${platelets(r, plt, W, H)}</svg>`;
}
const SMEAR_DESC = {
  normal: 'תאי דם אדומים בגודל אחיד עם חיוורון מרכזי קל',
  ida: 'תאי דם אדומים קטנים וחיוורים מאוד (מיקרוציטים היפוכרומיים), גדלים שונים, ותאים מוארכים כמו עיפרון',
  mega: 'תאי דם אדומים גדולים ואליפטיים (מאקרו-אובלוציטים) ונויטרופיל עם גרעין מרובה אונות. במיקוד: "היפרכרומיים", כלומר עם הרבה המוגלובין בכל תא, אך MCHC תקין',
  aiha: 'תאי דם אדומים קטנים, צפופים וכהים ללא חיוורון מרכזי (ספרוציטים) ותאים צעירים גדולים וסגלגלים (פוליכרומזיה)',
  g6pd: 'תאים "נגוסים" (bite cells) ותאי בועה (blister cells)',
  sickle: 'תאי חרמש ותאי מטרה',
  acd: 'תאי דם אדומים בגודל כמעט תקין, שונות קלה',
  aplastic: 'מעט מאוד תאים, רקע ריק, בלי שורות צעירות',
};

const SMEAR_WHY = {
  ida: 'מחסור בברזל מקטין את ייצור ההמוגלובין, ולכן התאים קטנים וחיוורים.',
  mega: 'סינתזת DNA פגועה מאטה את חלוקת התאים, והם גדלים יותר מהרגיל לפני שהם משתחררים.',
  aiha: 'הטחול "נוגס" בקרום של תאים מצופי נוגדנים. הם מאבדים שטח פנים והופכים לספרוציטים קטנים וצפופים.',
  g6pd: 'תאים נגוסים (bite cells) נוצרים כשהטחול מסיר מהתא אזורי המוגלובין שניזוקו בעקה חמצונית.',
  acd: 'אין ממצא ייחודי, ולכן המשטח לא מכריע. נשענים על פרופיל הברזל וסמני הדלקת.',
  aplastic: 'מח העצם ריק ולכן יש מעט תאים בכל השורות, בהתאם לפנציטופניה.',
};

/* פס תאי דם אדומים לסימולטור "מפעל הדם" */
function cellsStrip({ mcv = 90, mchc = 33, aniso = .1, n = 21, seed = 3, macroOval = false, count = 1 }) {
  const W = 320, H = 150, r = mulberry32(seed * 131 + 7);
  const base = 9.6 * Math.sqrt(mcv / 90);
  const pal = clamp(.38 + (33 - mchc) * .075, .2, .88);
  let s = '';
  const sp = 28, cols = Math.floor(W / sp), rows = Math.floor(H / sp);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    if (r() > count) continue;
    const x = (i + .5) * sp + (r() - .5) * 8 + (j % 2 ? 7 : 0), y = (j + .5) * sp + (r() - .5) * 8;
    const rx = Math.max(4.5, base * (1 + (r() - .5) * 2 * aniso));
    const ry = macroOval ? rx * .78 : rx * between(.93, 1, r);
    s += rbcShape(x, y, rx, ry, { rot: r() * 180, pal: pal * between(.9, 1.1, r) });
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="תאי דם מומחשים">${SMEAR_DEFS}<rect width="${W}" height="${H}" rx="10" fill="${SMEAR_BG}"/>${s}</svg>`;
}

/* אנטיגנים/נוגדנים להמחשת סוגי דם */
function bloodCellABO(type, rh, size = 70) {
  const hasA = type.includes('A'), hasB = type.includes('B');
  const ag = []; if (hasA) ag.push('#3a6fe0'); if (hasB) ag.push('#f0ab2e'); if (rh) ag.push('#1b9a68');
  let marks = '';
  const pts = [[0, -34], [26, -22], [32, 6], [14, 30], [-14, 30], [-32, 6], [-26, -22]];
  ag.forEach((c, k) => { for (let i = k; i < pts.length; i += ag.length) { const p = pts[i]; marks += `<circle cx="${60 + p[0]}" cy="${60 + p[1]}" r="5" fill="${c}" stroke="#fff" stroke-width="1.5"/>`; } });
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="סוג דם ${type}${rh ? '+' : '-'}"><defs><radialGradient id="abc" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#f08a9b"/><stop offset="1" stop-color="#c63f59"/></radialGradient></defs><circle cx="60" cy="60" r="38" fill="url(#abc)"/><circle cx="60" cy="60" r="14" fill="#fdeef1" opacity=".7"/>${marks}</svg>`;
}
