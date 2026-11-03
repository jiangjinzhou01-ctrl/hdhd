import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

export const FONT_URL = 'https://raw.githubusercontent.com/google/fonts/2894aab31764f10f29c421bdfd2340d3b382d384/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf';
export const FONT_SHA = 'a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da';
export const digest = (data) => createHash('sha256').update(data).digest('hex');
export const codepoint = (cp) => `U+${cp.toString(16).toUpperCase()}`;
export function missingGlyphs(story) {
  const coverage = new Set(JSON.parse(readFileSync('src/font-coverage.json','utf8')));
  return [...new Set([...JSON.stringify(story)].filter(c =>
    (/\p{Script=Han}/u.test(c) || /[\u3000-\u303f\uff00-\uffef“”‘’—…]/u.test(c)) && !coverage.has(c.codePointAt(0))
  ).map(c=>c.codePointAt(0)))].sort((a,b)=>a-b);
}
export function supplementDirectory(points) {
  return resolve('.cache/story-fonts',digest(JSON.stringify(points)+FONT_SHA).slice(0,20));
}
// Both files must match their independently generated cmap manifest. Missing or stale coverage still fails the build.
export function loadSupplement(story) {
  const missing = missingGlyphs(story);
  if (!missing.length) return null;
  const directory = supplementDirectory(missing);
  if (!existsSync(join(directory,'coverage.json')))
    throw Error(`Uncovered Chinese glyphs ${missing.map(codepoint).join(', ')}. Use npm run build:customer to prepare the licensed per-order supplement; do not disable this check.`);
  const report = JSON.parse(readFileSync(join(directory,'coverage.json'),'utf8'));
  if (report.sourceSHA256 !== FONT_SHA || JSON.stringify(report.codepoints) !== JSON.stringify(missing))
    throw Error('Stale or wrong supplemental font coverage');
  for (const weight of ['regular','semibold']) {
    const bytes = readFileSync(join(directory,`${weight}.woff2`));
    if (digest(bytes) !== report.files[weight].sha256 || missing.some(cp=>!report.files[weight].codepoints.includes(cp)))
      throw Error('Incomplete supplemental font or cmap');
    if (bytes.length > 250_000) throw Error('Supplement exceeds 250 KB per weight; review copy/font scope');
  }
  return { directory, report, missing };
}
