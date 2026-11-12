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

const order = ['core', 'widgets', 'cells', 'data', 'gamesA1', 'gamesA2', 'gamesA3', 'partB', 'partC', 'teacher', 'main'];
const js = order.map(n => `/* ---- ${n}.js ---- */\n` + read(`src/${n}.js`)).join('\n');
const css = read('src/styles.css');
const img = folderToMap('assets'), art = folderToMap('art');

const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#d23b4c">
<title>מעבדת הדם</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body><noscript>הכלי דורש JavaScript.</noscript>
<script>const IMG_DATA=${JSON.stringify(img)};const ART_DATA=${JSON.stringify(art)};</script>
<script>
${js}
</script>
</body>
</html>`;

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/index.html'), html);
console.log('built dist/index.html', Math.round(html.length / 1024) + ' KB', '| images:', Object.keys(img).length, '| art:', Object.keys(art).length);
