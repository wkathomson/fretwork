// Build-time only: fetch latin-subset woff2 for our rounded fonts and emit
// @font-face rules with base64 data URIs, so the app stays single-file with
// no runtime network requests. Writes fonts-block.css.
const https = require('https');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&family=Nunito:wght@400;700;800&display=swap';

function get(url, binary){
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(binary ? Buffer.concat(chunks) : Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject);
  });
}

(async () => {
  const css = await get(CSS_URL, false);
  // split into @font-face blocks, keep only the latin subset of each
  const blocks = css.split('@font-face').slice(1);
  let out = '';
  for (const b of blocks) {
    if (!/U\+0000-00FF/.test(b)) continue;               // latin only
    const fam = (b.match(/font-family:\s*'([^']+)'/) || [])[1];
    const wght = (b.match(/font-weight:\s*(\d+)/) || [])[1];
    const url = (b.match(/url\(([^)]+)\)/) || [])[1];
    if (!fam || !wght || !url) continue;
    const buf = await get(url, true);
    const b64 = buf.toString('base64');
    out += `@font-face{font-family:'${fam}';font-style:normal;font-weight:${wght};font-display:swap;`
         + `src:url(data:font/woff2;base64,${b64}) format('woff2')}\n`;
    console.error(`embedded ${fam} ${wght} (${(buf.length/1024).toFixed(1)} KB)`);
  }
  fs.writeFileSync('fonts-block.css', out);
  console.error('total fonts-block.css size: ' + (out.length/1024).toFixed(1) + ' KB');
})();
