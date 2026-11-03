import { preview } from './lib/preview.mjs';
import { OUTPUT, BASE, verifyArtifact } from './lib/commercial.mjs';
await verifyArtifact();
const { url } = await preview(OUTPUT, BASE, Number(process.env.PORT || 4180));
console.log(`Local commercial preview: ${url}`);
