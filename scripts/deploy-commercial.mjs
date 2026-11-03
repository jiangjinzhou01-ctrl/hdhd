import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, cp, rename, writeFile, mkdir, lstat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { HOST, BASE, ORIGIN, DIRECTORY, OUTPUT, assertDestination, verifyArtifact } from './lib/commercial.mjs';

const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
export function requirePushAuthorization(push, expected, env = process.env) {
  if (push && (env.ALLOW_COMMERCIAL_DEPLOY !== 'yes' || !/^[a-f0-9]{40}$/.test(expected || '')))
    throw Error('Push refused: obtain explicit user production approval, ALLOW_COMMERCIAL_DEPLOY=yes and --expected-head=<reviewed main SHA>.');
}
export function assertScopedChanges(paths) {
  if (!paths.length || paths.some((p) => !p.startsWith(`${DIRECTORY}/`) || p.includes('..')))
    throw Error('Changes outside memory-gift/ refused');
}
export function assertHost(remote) {
  if (![`https://github.com/${HOST}.git`, `https://github.com/${HOST}`, `git@github.com:${HOST}.git`].includes(remote))
    throw Error('Wrong production repository');
}
// This always runs in a fresh disposable clone. The remote is untouched until a normal fast-forward push.
export async function stageCommercial(checkout, artifact = OUTPUT) {
  await verifyArtifact(artifact); // fully validate BEFORE replacing any directory
  const destination = await assertDestination(checkout);
  const staging = join(checkout, '.memory-gift-stage');
  const old = join(checkout, '.memory-gift-previous');
  for (const path of [staging, old]) {
    try { await lstat(path); } catch (e) { if(e.code==='ENOENT') continue; throw e; }
    throw Error('Reserved staging path already exists; no replacement performed');
  }
  await cp(artifact, staging, { recursive: true, errorOnExist: true, force: false });
  try {
    let previous = false;
    try { await rename(destination, old); previous = true; } catch (e) { if (e.code !== 'ENOENT') throw e; }
    try { await rename(staging, destination); }
    catch (e) { if (previous) await rename(old, destination); throw e; }
    if (previous) await rm(old, { recursive: true });
  } finally { await rm(staging, { recursive: true, force: true }); }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((a) => a !== '--check' && a !== '--push' && !/^--expected-head=[a-f0-9]{40}$/.test(a)))
    throw Error('Only --check (default), --push and --expected-head are supported. Target cannot be overridden.');
  const push = args.includes('--push');
  const expected = args.find((a) => a.startsWith('--expected-head='))?.split('=')[1];
  requirePushAuthorization(push, expected);
  const { marker, count } = await verifyArtifact();
  const checkout = await mkdtemp(join(tmpdir(), 'memory-gift-deploy-'));
  try {
    git(['clone', '--branch', 'main', '--single-branch', `https://github.com/${HOST}.git`, checkout]);
    assertHost(git(['remote','get-url','origin'], checkout));
    const before = git(['rev-parse','HEAD'], checkout);
    if (expected && expected !== before) throw Error(`Production advanced to ${before}; re-review before retrying.`);
    await stageCommercial(checkout);
    git(['add', '--', DIRECTORY], checkout);
    const paths = git(['diff','--cached','--name-only'], checkout).split('\n').filter(Boolean);
    if (!paths.length) { console.log('No commercial changes. No push.'); return; }
    assertScopedChanges(paths);
    console.log(JSON.stringify({ mode: push ? 'authorized-push' : 'CHECK ONLY — NO PUSH', host: HOST,
      before, source: marker.sourceSHA, verifiedFiles: count, changedFiles: paths, url: `${ORIGIN}${BASE}` }, null, 2));
    if (!push) return;
    git(['fetch','origin','main'], checkout);
    if (git(['rev-parse','origin/main'], checkout) !== before) throw Error('Concurrent production update; no push.');
    git(['-c','user.name=Memory Gift delivery','-c','user.email=codex@openai.com',
      'commit','-m',`Publish Memory Gift from hdhd ${marker.sourceSHA.slice(0,7)}`], checkout);
    const deployedSHA = git(['rev-parse','HEAD'], checkout);
    git(['push','origin','HEAD:main'], checkout); // never force
    await mkdir('artifacts/deployments', { recursive: true });
    await writeFile(resolve(`artifacts/deployments/${deployedSHA}.json`), JSON.stringify({
      host: HOST, before, deployedSHA, sourceSHA: marker.sourceSHA, paths, directory: DIRECTORY,
      rollback: `Restore only memory-gift/ from ${before}; see COMMERCIAL.md.`,
    }, null, 2));
    // Observe the real Pages workflow for this exact SHA; never claim a push means publication succeeded.
    for (let attempt = 0; attempt < 60; attempt++) {
      const result = execFileSync('gh', ['run','list','--repo',HOST,'--commit',deployedSHA,
        '--json','databaseId,status,conclusion,url,name'], { encoding:'utf8' });
      const run = JSON.parse(result).find((r) => /pages/i.test(r.name));
      if (run?.status === 'completed') {
        if (run.conclusion !== 'success') throw Error(`Pages failed: ${run.url}; see scoped rollback instructions.`);
        console.log(`Pages success: ${run.url}\n${ORIGIN}${BASE}`); return;
      }
      await new Promise((r) => setTimeout(r, 5000));
    }
    throw Error(`Pushed ${deployedSHA}; Pages success not verified. Check GitHub Actions before sharing.`);
  } finally { await rm(checkout, { recursive: true, force: true }); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  main().catch((e) => { console.error(e.message); process.exitCode = 1; });
