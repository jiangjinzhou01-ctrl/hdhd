import { preview } from './lib/preview.mjs';
import { readFile } from 'node:fs/promises';
const code = process.argv[2];
if(!/^mg-(?=[a-z0-9]*[a-z])[a-z0-9]{4,12}$/.test(code || '')) throw Error('Usage: npm run preview:customer -- mg-<code>');
const report = JSON.parse(await readFile(`artifacts/orders/${code}/build.json`,'utf8'));
const server = await preview(`dist-v2/${code}`,report.base,Number(process.env.PORT||4190));
console.log(`Local-only customer preview: ${server.url}\nBound to 127.0.0.1; do not expose the server or upload the artifact without explicit release consent.`);
