// בונה קובץ HTML יחיד: dist/index.html (CSS + JS + תמונות מוטמעים)
// שימוש:  node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const mime = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };

function folderToMap(dir) {
  const out = {}; const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full)) {
    const ext = path.extname(f).toLowerCase(); if (!mime[ext]) continue;
    out[path.basename(f, ext)] = `data:${mime[ext]};base64,` + fs.readFileSync(path.join(full, f)).toString('base64');
  }
  return out;
}

const order = ['core', 'extras', 'widgets', 'cells', 'data', 'gamesA1', 'gamesA2', 'gamesA3', 'gamesA4', 'partB', 'partC', 'teacher', 'main'];
const js = order.map(n => `/* ---- ${n}.js ---- */\n` + read(`src/${n}.js`)).join('\n');
const css = read('src/styles.css');
const imgAll = folderToMap('assets'), artAll = folderToMap('art');

function makeHtml(img, art, baked, teacher) {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#d23b4c">
<title>${teacher ? 'מעבדת הדם: דף מורה' : 'מעבדת הדם'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body><noscript>הכלי דורש JavaScript.</noscript>
<script>${teacher ? 'const TEACHER_BUILD=true;' : ''}const IMG_DATA=${JSON.stringify(img)};const ART_DATA=${JSON.stringify(art)};${baked ? `const BAKED_ONLY=${JSON.stringify(baked)};` : ''}</script>
<script>
${js}
</script>
</body>
</html>`;
}

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const full = makeHtml(imgAll, artAll, '');
fs.writeFileSync(path.join(root, 'dist/index.html'), full);
console.log('built dist/index.html', Math.round(full.length / 1024) + ' KB', '| images:', Object.keys(imgAll).length, '| art:', Object.keys(artAll).length);

/* ===== קבצים נפרדים: dist/parts/part-X.html ו-game-<id>.html (עם תמונות רק של החלק) ===== */
const shared = ['core', 'extras', 'widgets', 'cells', 'data', 'main', 'teacher'].map(n => read(`src/${n}.js`)).join('\n').replace(/const FIGX = \{[\s\S]*?\n\};/, '');
const partFiles = { a: ['gamesA1', 'gamesA2', 'gamesA3', 'gamesA4'], b: ['partB'], c: ['partC'] };
const usedBy = p => shared + '\n' + partFiles[p].map(n => read(`src/${n}.js`)).join('\n');
function pick(map, p, extra) {
  const txt = usedBy(p), out = {};
  for (const k of Object.keys(map)) if (txt.includes(`'${k}'`) || txt.includes(`"${k}"`) || extra(k)) out[k] = map[k];
  return out;
}
const artExtra = p => k => /^(mascot_|hero_bg|expert_|badge_)/.test(k) || (p === 'c' && /^(patient_|exam_)/.test(k)) || (p === 'b' && /^tube_/.test(k)) || (p === 'a' && /^guide_/.test(k));
const ids = { a: [], b: [], c: [] };
for (const p of ['a', 'b', 'c']) for (const m of partFiles[p].map(n => read(`src/${n}.js`)).join('\n').matchAll(new RegExp(`id: '(${p}_[a-z0-9]+)'`, 'g'))) if (!ids[p].includes(m[1])) ids[p].push(m[1]);
const pdir = path.join(root, 'dist/parts'); fs.rmSync(pdir, { recursive: true, force: true }); fs.mkdirSync(pdir, { recursive: true });
let n = 0, tot = 0;
for (const p of ['a', 'b', 'c']) {
  const im = pick(imgAll, p, () => false), ar = pick(artAll, p, artExtra(p));
  for (const [name, baked] of [[`part-${p.toUpperCase()}.html`, p], ...ids[p].map(i => [`game-${i}.html`, i])]) {
    const h = makeHtml(im, ar, baked); fs.writeFileSync(path.join(pdir, name), h); n++; tot += h.length;
  }
}
/* ===== קבצי מורה: teacher.html (הכול) ו-teacher-parts/teacher-game-<id>.html (משחק בודד, עם כל התשובות) ===== */
fs.writeFileSync(path.join(root, 'dist/teacher.html'), makeHtml(imgAll, artAll, '', true));
const tdir = path.join(root, 'dist/teacher-parts'); fs.rmSync(tdir, { recursive: true, force: true }); fs.mkdirSync(tdir, { recursive: true });
let tn = 0;
for (const p of ['a', 'b', 'c']) {
  const im = pick(imgAll, p, () => false), ar = pick(artAll, p, artExtra(p));
  fs.writeFileSync(path.join(tdir, `teacher-part-${p.toUpperCase()}.html`), makeHtml(im, ar, p, true)); tn++;
  for (const i of ids[p]) { fs.writeFileSync(path.join(tdir, `teacher-game-${i}.html`), makeHtml(im, ar, i, true)); tn++; }
}
console.log('built dist/teacher.html +', tn, 'teacher game files');
console.log('built dist/parts:', n, 'files,', Math.round(tot / 1048576) + ' MB total | games:', ids.a.length + ids.b.length + ids.c.length);
