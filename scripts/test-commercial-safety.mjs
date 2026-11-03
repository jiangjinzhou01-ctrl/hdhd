import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { HOST, SOURCE, BASE, DIRECTORY, MARKER, OUTPUT, manifest, verifyArtifact, assertDestination } from './lib/commercial.mjs';
import { requirePushAuthorization, assertScopedChanges, assertHost, stageCommercial } from './deploy-commercial.mjs';

const root = await mkdtemp(join(tmpdir(), 'memory-gift-safety-'));
const passed = [];
try {
  assert.throws(() => requirePushAuthorization(true, 'a'.repeat(40), {}), /Push refused/);
  assert.throws(() => requirePushAuthorization(true, undefined, { ALLOW_COMMERCIAL_DEPLOY:'yes' }), /Push refused/);
  requirePushAuthorization(false);
  const blocked = (() => { try { execFileSync('node', ['scripts/deploy-commercial.mjs','--push'],
    { env:{...process.env,ALLOW_COMMERCIAL_DEPLOY:''},stdio:'pipe' }); return false; } catch { return true; } })();
  assert(blocked);
  passed.push('unauthorized push fails before network or mutation');
  for (const paths of [['index.html'],['phone-to-today/index.html'],['memory-gift/../phone-to-today/index.html'],[]])
    assert.throws(() => assertScopedChanges(paths));
  assertScopedChanges(['memory-gift/index.html']);
  assert.throws(() => assertHost('https://github.com/jiangjinzhou01-ctrl/hdhd.git'));
  assertHost(`https://github.com/${HOST}.git`);
  passed.push('host, root and private directory boundaries');

  const artifact = join(root, 'artifact');
  await mkdir(artifact);
  await cp(join(OUTPUT,'demo'), join(artifact,'demo'), { recursive:true });
  for (const file of ['index.html','styles.css','app.js','.nojekyll']) await writeFile(join(artifact,file), '');
  const marker = {schema:1,project:DIRECTORY,directory:DIRECTORY,repository:HOST,
    source:SOURCE,sourceSHA:'d621a0e52d83dde0c07afce59b122a8a08910c92',base:BASE,story:'demo'};
  async function seal() { await writeFile(join(artifact,MARKER),JSON.stringify({...marker,files:await manifest(artifact)})); }
  await seal(); await verifyArtifact(artifact);
  const checkout = join(root,'host');
  await mkdir(join(checkout,'phone-to-today'),{recursive:true});
  await writeFile(join(checkout,'index.html'),'TIANGONG sentinel');
  await writeFile(join(checkout,'phone-to-today/index.html'),'private sentinel');
  await mkdir(join(checkout,DIRECTORY));
  await writeFile(join(checkout,DIRECTORY,'existing.txt'),'unowned');
  await assert.rejects(stageCommercial(checkout,artifact),/marker/);
  assert.equal(await readFile(join(checkout,DIRECTORY,'existing.txt'),'utf8'),'unowned');
  passed.push('unmarked directory conflict preserves existing contents');
  await rm(join(checkout,DIRECTORY),{recursive:true});
  await stageCommercial(checkout,artifact);
  await stageCommercial(checkout,artifact);
  assert.equal(await readFile(join(checkout,'index.html'),'utf8'),'TIANGONG sentinel');
  assert.equal(await readFile(join(checkout,'phone-to-today/index.html'),'utf8'),'private sentinel');
  passed.push('new install and complete replacement affect only memory-gift');
  await symlink(join(checkout,'phone-to-today'),join(checkout,'.memory-gift-stage'));
  await assert.rejects(stageCommercial(checkout,artifact),/Reserved staging/);
  await rm(join(checkout,'.memory-gift-stage'));
  passed.push('reserved staging conflicts cannot redirect replacement to another project');

  await writeFile(join(artifact,'app.js'),'tampered');
  await assert.rejects(stageCommercial(checkout,artifact),/manifest/);
  assert.equal(await readFile(join(checkout,DIRECTORY,'app.js'),'utf8'),'');
  passed.push('incomplete build fails before replacement');
  await seal();
  for (const path of ['customers/order.txt','.env','private/data.txt']) {
    const parent = path.split('/').slice(0,-1).join('/');
    if (parent) await mkdir(join(artifact,parent),{recursive:true});
    await writeFile(join(artifact,path),'forbidden'); await seal();
    await assert.rejects(verifyArtifact(artifact));
    await rm(join(artifact,parent || path),{recursive:true});
  }
  await cp('public/social-preview.png',join(artifact,'renamed.png')); await seal();
  await assert.rejects(verifyArtifact(artifact),/Private media|Unexpected file/);
  await rm(join(artifact,'renamed.png')); await seal();
  await symlink(join(checkout,'index.html'),join(artifact,'escape.html'));
  await assert.rejects(verifyArtifact(artifact),/Unsafe/);
  await rm(join(artifact,'escape.html'));
  await rm(join(checkout,DIRECTORY),{recursive:true});
  await symlink(join(checkout,'phone-to-today'),join(checkout,DIRECTORY));
  await assert.rejects(assertDestination(checkout));
  assert.equal(await readFile(join(checkout,'phone-to-today/index.html'),'utf8'),'private sentinel');
  passed.push('customer directories, secrets, renamed private images and symlinks rejected');
  await mkdir('artifacts/commercial',{recursive:true});
  await writeFile('artifacts/commercial/safety.json',JSON.stringify({passed},null,2));
  console.log(JSON.stringify({passed},null,2));
} finally { await rm(root,{recursive:true,force:true}); }
