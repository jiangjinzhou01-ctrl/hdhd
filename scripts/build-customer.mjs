import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { checkOrder } from './lib/order.mjs';
import { prepareFonts } from './prepare-fonts.mjs';
import { filesIn, sha256 } from './lib/commercial.mjs';

const args = process.argv.slice(2);
const input = args.find(a=>a.startsWith('--order='))?.slice(8);
if(!input || args.some(a=>!a.startsWith('--order=') && !['--delivery','--public'].includes(a)))
  throw Error('Usage: npm run build:customer -- --order=customers/mg-<code> [--delivery] [--public]');
const start = performance.now();
const result = await checkOrder(input,{delivery:args.includes('--delivery'),publicRelease:args.includes('--public')});
const supplement = await prepareFonts(result.story);
const base = process.env.VITE_BASE_PATH || `/gifts/${result.order.code}/`;
const origin = process.env.STORY_ORIGIN || 'http://127.0.0.1:4190';
if(!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base) || /phone-to-today|memory-gift|\.\./.test(base)) throw Error('Unsafe customer base path');
if(new URL(origin).origin !== origin) throw Error('STORY_ORIGIN must be a plain origin');
if(args.includes('--public') && !origin.startsWith('https://')) throw Error('Public sharing requires an agreed HTTPS origin');
execFileSync('npm',['run','build'],{stdio:'inherit',env:{...process.env,
  STORY_FILE:join(result.directory,'story.json'),VITE_BASE_PATH:base,STORY_ORIGIN:origin}});
const output = resolve(`dist-v2/${result.order.code}`);
const files = await filesIn(output);
if(files.some(f=>/(^|\/)(customers|stories|private|order\.json|letter\.json|story\.json)(\/|$)/.test(f))) throw Error('Customer source included in output');
for(const file of files) if(/\.(js|html)$/.test(file)) {
  const copy = await readFile(join(output,file),'utf8');
  if(/罗琛尧|娄底三中|周末记得陪我聊天/.test(copy)) throw Error('Private content in customer artifact');
}
const authorizedFiles = result.order.media.flatMap(m=>m.files);
for(const name of authorizedFiles) if(sha256(await readFile(join(output,name))) !== sha256(await readFile(join(result.directory,'media',name)))) throw Error('Wrong selected media');
const report = {code:result.order.code,mode:args.includes('--public')?'approved public package':'local preview only',
  finalConfirmed:result.order.finalConfirmed,publicRelease:result.order.publicRelease,output,base,origin,
  supplementalCodepoints:result.fontReview,supplementBytes:supplement?.report.files,
  seconds:Number(((performance.now()-start)/1000).toFixed(2)),files,
  note:'Timing measures automated validation/font/build only; excludes consultation, writing and manual review.'};
await mkdir(`artifacts/orders/${result.order.code}`,{recursive:true});
await writeFile(`artifacts/orders/${result.order.code}/build.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
