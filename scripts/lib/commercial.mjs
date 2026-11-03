import { createHash } from 'node:crypto';
import { readFile, readdir, lstat, realpath } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { loadStoryFiles } from '../story-files.ts';

export const HOST = 'jiangjinzhou01-ctrl/symmetrical-carnival';
export const SOURCE = 'jiangjinzhou01-ctrl/hdhd';
export const DIRECTORY = 'memory-gift';
export const BASE = '/symmetrical-carnival/memory-gift/';
export const ORIGIN = 'https://jiangjinzhou01-ctrl.github.io';
export const OUTPUT = resolve('dist-commercial/memory-gift');
export const MARKER = '.memory-gift.json';
export const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

export async function filesIn(root) {
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      const stat = await lstat(file);
      if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory()))
        throw Error(`Unsafe artifact entry: ${relative(root, file)}`);
      if (stat.isDirectory()) await walk(file);
      else files.push(relative(root, file).split('\\').join('/'));
    }
  }
  if ((await lstat(root)).isSymbolicLink()) throw Error('Symlink output refused');
  await walk(root);
  return files.sort();
}

export async function manifest(root) {
  const result = {};
  for (const file of await filesIn(root))
    if (file !== MARKER) result[file] = sha256(await readFile(join(root, file)));
  return result;
}

export function validMarker(marker) {
  if (marker.project !== DIRECTORY || marker.schema !== 1 || marker.repository !== HOST ||
      marker.directory !== DIRECTORY || marker.base !== BASE || marker.story !== 'demo' ||
      marker.source !== SOURCE || !/^[a-f0-9]{40}$/.test(marker.sourceSHA))
    throw Error('Wrong commercial deployment marker');
}

export async function verifyArtifact(root = OUTPUT) {
  const marker = JSON.parse(await readFile(join(root, MARKER), 'utf8'));
  validMarker(marker);
  const actual = await manifest(root);
  if (JSON.stringify(actual) !== JSON.stringify(marker.files))
    throw Error('Incomplete or changed commercial build: manifest mismatch');
  for (const required of ['index.html', 'styles.css', 'app.js', 'demo/index.html',
    'demo/fonts/OFL.txt', 'demo/third-party-licenses.txt', '.nojekyll'])
    if (!actual[required]) throw Error(`Incomplete build: ${required}`);
  const privateStory = loadStoryFiles('stories/private/story.json');
  const forbiddenText = [privateStory.friend, privateStory.weekend?.body,
    'stories/private/', 'customers/', 'phone-to-today/'].filter(Boolean);
  const forbiddenImages = ['social-preview.png', 'meeting-date.webp', 'meeting-date-mobile.webp',
    'meeting-date-dark.webp', 'meeting-date-dark-mobile.webp'];
  const privateHashes = await Promise.all(forbiddenImages.map(async (name) =>
    sha256(await readFile(join('public', name)))));
  for (const [name, hash] of Object.entries(actual)) {
    const fixed = ['index.html','styles.css','app.js','.nojekyll','demo/.nojekyll','demo/index.html',
      'demo/favicon.svg','demo/fonts/OFL.txt','demo/third-party-licenses.txt','demo/demo-preview.png',
      'demo/night-still-life.webp','demo/night-still-life-wide-mobile.webp'];
    if (!fixed.includes(name) && !/^demo\/assets\/(index-[\w-]+\.(js|css)|today-sans-(regular|semibold)-[\w-]+\.woff2)$/.test(name))
      throw Error(`Unexpected file outside the fixed commercial asset list: ${name}`);
    if (/(^|\/)(customers|private|dist-v2|node_modules|\.git|\.env)(\/|$|\.)/i.test(name) ||
        !/\.(html|css|js|svg|webp|png|jpe?g|avif|woff2|txt)$/.test(name) && !['.nojekyll','demo/.nojekyll'].includes(name))
      throw Error(`Disallowed commercial asset: ${name}`);
    if (privateHashes.includes(hash)) throw Error(`Private media in build: ${name}`);
    if (/\.(html|css|js|txt|svg)$/.test(name)) {
      const text = await readFile(join(root, name), 'utf8');
      if (forbiddenText.some((value) => text.includes(value)))
        throw Error(`Private or customer reference in commercial build: ${name}`);
    }
  }
  const demoHTML = await readFile(join(root, 'demo/index.html'), 'utf8');
  if (!demoHTML.includes(`${ORIGIN}${BASE}demo/demo-preview.png`) ||
      !demoHTML.includes('虚构演示') || !demoHTML.includes(`${BASE}demo/assets/`))
    throw Error('Wrong demo sharing metadata or Pages base');
  return { marker, count: Object.keys(actual).length };
}

export async function assertDestination(checkout) {
  const canonical = await realpath(checkout);
  const destination = resolve(canonical, DIRECTORY);
  if (relative(canonical, destination) !== DIRECTORY) throw Error('Wrong target directory');
  try {
    if (!(await lstat(destination)).isDirectory()) throw Error('Commercial target is not a directory');
    if ((await lstat(destination)).isSymbolicLink()) throw Error('Symlink target refused');
    const marker = JSON.parse(await readFile(join(destination, MARKER), 'utf8'));
    validMarker(marker);
    await filesIn(destination);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    // An existing directory with no marker must never be treated as a new target.
    try { await lstat(destination); } catch (missing) {
      if (missing.code === 'ENOENT') return destination;
      throw missing;
    }
    throw Error('Existing commercial directory has no deployment marker');
  }
  return destination;
}
