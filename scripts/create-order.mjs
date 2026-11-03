import { randomBytes } from 'node:crypto';
import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { CHECKS } from './lib/order.mjs';
const code = `mg-${randomBytes(5).toString('hex').replace(/\d/g,d=>'ghijklmnop'[Number(d)])}`;
const directory = `customers/${code}`;
await mkdir(directory,{recursive:false});
await cp('stories/demo/letter.json',`${directory}/letter.json`);
await mkdir(`${directory}/media`);
const story = JSON.parse(await readFile('stories/demo/story.json','utf8'));
story.id = code;
// Fictional labels remain until the operator has replaced and reviewed every placeholder.
await writeFile(`${directory}/story.json`,JSON.stringify(story,null,2)+'\n');
await writeFile(`${directory}/order.json`,JSON.stringify({code,media:[],publicRelease:'pending',
  finalConfirmed:false,checks:Object.fromEntries(CHECKS.map(k=>[k,false])),fontReviewedCodepoints:[]},null,2)+'\n');
console.log(`Local order created at ${directory}. Replace all fictional placeholder copy; do not commit customer files.`);
