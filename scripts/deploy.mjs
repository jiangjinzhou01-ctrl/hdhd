import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, mkdir, cp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

// Publish only this dedicated directory; preserve every other file in the host.
const host = 'jiangjinzhou01-ctrl/symmetrical-carnival'
const directory = 'phone-to-today'
const run = (command, args, cwd = process.cwd()) => execFileSync(command, args, { cwd, stdio: 'inherit', env: process.env })
run('npm', ['run', 'build'])
const temporary = await mkdtemp(path.join(tmpdir(), 'phone-to-today-deploy-'))
try {
  run('gh', ['repo', 'clone', host, temporary, '--', '--depth=1'])
  const destination = path.join(temporary, directory)
  try {
    const marker = JSON.parse(await readFile(path.join(destination, '.phone-to-today.json'), 'utf8'))
    if (marker.project !== 'phone-to-today') throw Error('The deployment directory belongs to another project.')
    await rm(destination, { recursive: true })
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    // Existing unrelated directories are never replaced.
    try { await readFile(path.join(destination, 'index.html')); throw Error('Directory exists without our deployment marker.') }
    catch (inner) { if (inner.code !== 'ENOENT') throw inner }
  }
  await mkdir(destination, { recursive: true })
  await cp('dist', destination, { recursive: true })
  await writeFile(path.join(destination, '.phone-to-today.json'), JSON.stringify({ project: 'phone-to-today', source: 'https://github.com/jiangjinzhou01-ctrl/hdhd' }))
  run('git', ['config', 'user.name', 'jiangjinzhou01-ctrl'], temporary)
  run('git', ['config', 'user.email', '310395594+jiangjinzhou01-ctrl@users.noreply.github.com'], temporary)
  run('git', ['add', '--', directory], temporary)
  try { execFileSync('git', ['diff', '--cached', '--quiet'], { cwd: temporary }) }
  catch {
    run('git', ['commit', '-m', 'Publish 电话那头，今天见 in its own directory'], temporary)
    run('git', ['push', 'origin', 'main'], temporary)
  }
  console.log('Uploaded. Check the GitHub Pages build before sharing: https://jiangjinzhou01-ctrl.github.io/symmetrical-carnival/phone-to-today/')
} finally { await rm(temporary, { recursive: true, force: true }) }
