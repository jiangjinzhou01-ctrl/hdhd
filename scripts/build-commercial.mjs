import { execFileSync } from 'node:child_process';
import { mkdir, cp, writeFile, rename, rm, mkdtemp } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { BASE, ORIGIN, HOST, SOURCE, DIRECTORY, OUTPUT, MARKER, manifest, verifyArtifact } from './lib/commercial.mjs';

// Inputs and destination are fixed: never use an inherited customer/private story.
execFileSync('npm', ['run', 'build'], { stdio: 'inherit', env: {
  ...process.env, STORY_FILE: 'stories/demo/story.json', VITE_BASE_PATH: `${BASE}demo/`,
  STORY_ORIGIN: ORIGIN, STORY_FONT_DIR: '',
}});
await mkdir('dist-commercial', { recursive: true });
const staging = await mkdtemp(resolve('dist-commercial/.build-'));
const backup = resolve('dist-commercial/.previous');
try {
  for (const file of ['index.html', 'styles.css', 'app.js'])
    await cp(join('commercial', file), join(staging, file));
  await cp('dist-v2/demo', join(staging, 'demo'), { recursive: true });
  await writeFile(join(staging, '.nojekyll'), '');
  await writeFile(join(staging, MARKER), JSON.stringify({
    schema: 1, project: DIRECTORY, directory: DIRECTORY, repository: HOST,
    source: SOURCE, sourceSHA: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    sourceDirty: Boolean(execFileSync('git', ['status','--porcelain'], { encoding:'utf8' }).trim()),
    base: BASE, story: 'demo', files: await manifest(staging),
  }, null, 2) + '\n');
  await verifyArtifact(staging);
  await rm(backup, { recursive: true, force: true });
  let previous = false;
  try { await rename(OUTPUT, backup); previous = true; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  try { await rename(staging, OUTPUT); }
  catch (e) { if (previous) await rename(backup, OUTPUT); throw e; }
  await rm(backup, { recursive: true, force: true });
  console.log(`Verified commercial build: ${OUTPUT} → ${ORIGIN}${BASE}`);
} finally { await rm(staging, { recursive: true, force: true }); }
