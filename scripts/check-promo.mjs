import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { sha256 } from './lib/commercial.mjs';
const scheme=process.env.TEST_SCHEME||'light';
const root=resolve(`artifacts/promo-${scheme}`);
const timeline=JSON.parse(await readFile(join(root,'timeline.json'),'utf8'));
const video=join(root,'memory-gift-14s.mp4');
assert.equal(sha256(await readFile(video)),timeline.finalSHA256);
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',video],{encoding:'utf8'}));
const streams=probe.streams;assert.equal(streams.length,1);
assert.equal(streams[0].codec_name,'h264');assert.equal(streams[0].pix_fmt,'yuv420p');
assert.equal(streams[0].width,1080);assert.equal(streams[0].height,1920);
assert.equal(streams[0].avg_frame_rate,'30/1');
// Real 25fps browser capture is retimed to 30fps; frame boundaries vary slightly.
// The product brief accepts 12–15 seconds, so do not fail valid footage at 13.9s.
assert(Number(probe.format.duration)>=12 && Number(probe.format.duration)<=15);
assert.deepEqual(timeline.cuts.map(c=>[c.cue,c.targetStart,c.targetEnd]),[['open',0,2],['duo',2,5],['city',5,8],['letter',8,12],['ending',12,14]]);
const motion=[];
for(const cut of timeline.cuts) {
  const clip=join(root,`shots/${cut.id}.mp4`);
  assert.equal(sha256(await readFile(clip)),cut.sha256);
  assert.equal(await readFile(join(root,`captions/${cut.id}.txt`),'utf8'),cut.title);
  const hashes=execFileSync('ffmpeg',['-v','error','-i',clip,'-vf','fps=10','-f','framemd5','-'],{encoding:'utf8'}).split('\n').filter(l=>l && !l.startsWith('#')).map(l=>l.split(',').at(-1).trim());
  const unique=new Set(hashes).size;
  if(cut.cue!=='ending') assert(unique>=8,`Expected real continuous changes in ${cut.id}, got ${unique}`);
  motion.push({id:cut.id,decodedUniqueFrames:unique});
}
await mkdir(join(root,'frames'),{recursive:true});
for(const t of [0.2,0.8,1.2,2.2,2.8,3.5,4.5,5.3,6.3,7.5,8.4,9.5,10.8,11.7,13])
  execFileSync('ffmpeg',['-y','-v','error','-ss',String(t),'-i',video,'-frames:v','1',join(root,`frames/${t}s.jpg`)],{stdio:'pipe'});
const report={passed:true,probe,motion,sourceVerified:timeline.provenance,manualReview:'Inspect frames/ and storyboard before release. Codec compatibility verified; an actual Jianying application import requires that app.'};
await writeFile(join(root,'check.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:true,duration:probe.format.duration,motion},null,2));
