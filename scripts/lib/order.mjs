import { readFile, realpath, lstat } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { loadStoryFiles } from '../story-files.ts';
import { missingGlyphs, codepoint } from './font-support.mjs';

export const CHECKS = ['copy','media','layout','sharing','fonts'];
export async function checkOrder(input, {delivery=false,publicRelease=false} = {}) {
  const directory = resolve(input);
  const fixture = directory === resolve('tests/fixtures/trial-order');
  const name = relative(resolve('customers'), directory);
  if (!fixture && (!/^mg-(?=[a-z0-9]*[a-z])[a-z0-9]{4,12}$/.test(name) || /\d{7}/.test(name)))
    throw Error('Use customers/mg-<random code>; never use names, phone numbers or paths as order codes');
  if (await realpath(directory) !== directory || (await lstat(directory)).isSymbolicLink())
    throw Error('Order directory symlinks refused');
  const order = JSON.parse(await readFile(join(directory,'order.json'),'utf8'));
  const allowed = ['code','media','publicRelease','finalConfirmed','checks','fontReviewedCodepoints'];
  if (Object.keys(order).some(key=>!allowed.includes(key))) throw Error('order.json may contain only non-sensitive workflow flags; keep copy in story/letter');
  const story = loadStoryFiles(join(directory,'story.json'));
  if (!/^mg-(?=[a-z0-9]*[a-z])[a-z0-9]{4,12}$/.test(order.code) || /\d{7}/.test(order.code) ||
      order.code !== story.id || (!fixture && order.code !== name)) throw Error('Order code, folder and story id must agree');
  if (!['pending','granted','denied'].includes(order.publicRelease) || typeof order.finalConfirmed !== 'boolean')
    throw Error('Explicit publicRelease and finalConfirmed flags required');
  if (!order.checks || Object.keys(order.checks).some(k=>!CHECKS.includes(k)) ||
    !CHECKS.every(k=>typeof order.checks[k]==='boolean') || !Array.isArray(order.fontReviewedCodepoints) ||
    order.fontReviewedCodepoints.some(cp=>typeof cp!=='string' || !/^U\+[A-F0-9]{4,6}$/.test(cp)))
    throw Error('Use only checklist booleans and Unicode codepoints in local order state');
  if (!story.letter.length) throw Error('Letter copy or approved letter material required');
  const limits = [[story.cover.headline,80,'cover headline'],[story.cover.address,60,'address'],
    [story.navigation.name,36,'navigation'],[story.title,100,'title'],
    ...story.letter.map(p=>[p,2000,'letter paragraph']),
    ...(story.duo?.people || []).map(p=>[p.name,40,'person name']),
    [story.meeting?.destination || '',60,'city']];
  for (const [text,limit,label] of limits) if ([...text].length>limit) throw Error(`${label} exceeds trial package copy limit (${limit})`);
  if (story.letter.join('').length>8000) throw Error('Letter exceeds 8000 characters; agree a shorter version');
  if (!Array.isArray(order.media) || order.media.length>2) throw Error('At most two authorized customer image groups');
  const referenced = new Set();
  for (const image of [story.cover.art,story.night?.image].filter(Boolean))
    for (const key of ['src','mobile','dark','darkMobile']) if(image[key]) referenced.add(image[key]);
  if(story.share.image) referenced.add(story.share.image);
  const authorized = new Set();
  for (const media of order.media) {
    if(Object.keys(media).some(k=>!['files','authorizationConfirmed','containsIdentifiableMinor','guardianConsentConfirmed'].includes(k)))
      throw Error('Media state must not contain customer names or free-text personal information');
    if (media.authorizationConfirmed !== true || typeof media.containsIdentifiableMinor !== 'boolean' ||
      typeof media.guardianConsentConfirmed !== 'boolean' || !Array.isArray(media.files) || !media.files.length)
      throw Error('Image use authorization and minor status must be explicitly confirmed');
    if(publicRelease && media.containsIdentifiableMinor && media.guardianConsentConfirmed !== true)
      throw Error('Identifiable minor requires guardian and other necessary publication authorization');
    for(const file of media.files) {
      if(!/^[a-zA-Z0-9][\w.-]*\.(png|webp|jpe?g|avif|svg)$/i.test(file) || !referenced.has(file))
        throw Error('Only selected authorized media files belong in order.json');
      const target = join(directory,'media',file);
      if(await realpath(target) !== target || !(await lstat(target)).isFile()) throw Error('Media symlink or missing file');
      authorized.add(file);
    }
  }
  const shared = new Set(['night-still-life.webp','night-still-life-wide-mobile.webp','demo-preview.png']);
  for(const file of referenced) {
    let local = false; try { await lstat(join(directory,'media',file)); local=true; } catch(e) { if(e.code!=='ENOENT') throw e; }
    if(local && !authorized.has(file) || !local && !shared.has(file)) throw Error('Unconfirmed or non-demo shared media; review authorization');
  }
  const points = missingGlyphs(story).map(codepoint);
  if(delivery) {
    if(!order.finalConfirmed || !CHECKS.every(key=>order.checks?.[key]===true)) throw Error('Delivery blocked: final confirmation and all checklist flags required');
    if(!Array.isArray(order.fontReviewedCodepoints) || points.some(cp=>!order.fontReviewedCodepoints.includes(cp)))
      throw Error('Delivery blocked: inspect supplemental characters and confirm fontReviewedCodepoints');
  }
  if(publicRelease && (!delivery || order.publicRelease !== 'granted')) throw Error('Public packaging blocked: explicit release consent and final delivery checks required');
  return {directory,story,order,fontReview:points,fixture};
}
