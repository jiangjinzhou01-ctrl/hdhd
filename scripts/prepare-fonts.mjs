import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { missingGlyphs, supplementDirectory, loadSupplement, FONT_URL, FONT_SHA, digest, codepoint } from './lib/font-support.mjs';
import { loadStoryFiles } from './story-files.ts';

export async function prepareFonts(story) {
  const points = missingGlyphs(story);
  if (!points.length) return null;
  try { return loadSupplement(story); } catch { /* create or repair only this order's cached supplement */ }
  const source = resolve('.cache/font-source/NotoSansSC-VF.ttf');
  await mkdir(resolve('.cache/font-source'),{recursive:true});
  let available = false;
  try { available = digest(await readFile(source)) === FONT_SHA; } catch {}
  if (!available) {
    const temporary = `${source}.download`;
    try {
      execFileSync('curl',['--fail','--location','--silent','--show-error',FONT_URL,'-o',temporary],{stdio:'inherit'});
      if (digest(await readFile(temporary)) !== FONT_SHA) throw Error('Upstream font checksum mismatch');
      await rename(temporary,source);
    } finally { await rm(temporary,{force:true}); }
  }
  const directory = supplementDirectory(points);
  await mkdir(directory,{recursive:true});
  const list = join(directory,'requested.json');
  await writeFile(list,JSON.stringify(points));
  try {
    execFileSync(process.env.PYTHON || 'python',['scripts/prepare-order-fonts.py',source,list,directory],{stdio:'pipe'});
  } catch (error) {
    throw Error(`Cannot prepare font supplement. Python fonttools + brotli are required (python -m pip install fonttools brotli). Unsupported glyphs must be reviewed.\n${error.stderr?.toString() || error.message}`);
  } finally { await rm(list,{force:true}); }
  const result = loadSupplement(story);
  console.warn(`Font supplement prepared: ${points.map(codepoint).join(', ')}. Confirm important names in the delivery preview.`);
  return result;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const storyFile = process.argv[2];
  if (!storyFile) throw Error('Usage: node scripts/prepare-fonts.mjs <selected story.json>');
  await prepareFonts(loadStoryFiles(storyFile));
}
