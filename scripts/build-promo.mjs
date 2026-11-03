import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { verifyArtifact, BASE, sha256 } from './lib/commercial.mjs';

const scheme = process.env.TEST_SCHEME || 'light';
if(!['light','dark'].includes(scheme)) throw Error('Use light or dark theme');
const source = resolve(process.env.RECORD_DIR || `artifacts/demo-${scheme}`);
const output = resolve(`artifacts/promo-${scheme}`);
const meta = JSON.parse(await readFile(join(source,'shots.json'),'utf8'));
const raw = join(source,'full-mobile.webm');
const {marker} = await verifyArtifact();
assert.equal(meta.provenance?.fictionalDemo,true,'A provenance-verified fictional recording is required; use RECORD_PROMO=yes');
assert.equal(meta.source,'real Playwright browser interaction recording');
assert.equal(new URL(meta.url).pathname,`${BASE}demo/`);
assert.equal(meta.colorScheme,scheme);
assert.equal(sha256(await readFile(raw)),meta.provenance.videoSHA256,'Recording hash changed');
assert.deepEqual(meta.provenance.demoFiles,Object.fromEntries(Object.entries(marker.files).filter(([n])=>n.startsWith('demo/'))),'Demo differs from the verified recording');
const ffprobe = (file) => JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
const sourceInfo = ffprobe(raw);
const duration = Number(sourceInfo.format.duration);
const cuts = [
  {id:'01-open',cue:'open',duration:2,title:'有些回忆，值得被打开。',note:'实际点击后的空间展开'},
  {id:'02-together',cue:'duo',duration:3,title:'把我们的故事，留在这里。',note:'双卡靠近、对齐与复位'},
  {id:'03-city',cue:'city',duration:3,title:'从各自的城市，到同一次相见。',note:'原生滚动与城市遮罩揭示'},
  {id:'04-letter',cue:'letter',duration:4,title:'有些话，想认真说给你听。',note:'信件逐段显现与祝福'},
  {id:'05-consult',cue:'ending',duration:2,title:'专属互动纪念网页 · ¥29.9',note:'演示结束与真实咨询指引'},
];
await mkdir(join(output,'shots'),{recursive:true});
await mkdir(join(output,'clean'),{recursive:true});
await mkdir(join(output,'source'),{recursive:true});
await mkdir(join(output,'captions'),{recursive:true});
const font = process.env.PROMO_FONT || '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc';
await readFile(font); // fail explicitly when no authorized CJK font is configured
const filterPath = p => p.replace(/\\/g,'/').replace(/:/g,'\\:').replace(/'/g,"'\\''");
const background = scheme==='dark'?'0x08080a':'0xf5f5f7';
const foreground = scheme==='dark'?'0xf5f5f7':'0x1d1d1f';
const secondary = scheme==='dark'?'0xaaaab0':'0x626267';
await writeFile(join(output,'captions/disclosure.txt'),'虚构人物与故事 · 真实网页录屏');
await writeFile(join(output,'captions/consult.txt'),'抖音私信「回忆定制」 · MEMORY GIFT');
const encode = ['-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart'];
let time=0;
for(const cut of cuts) {
  const cue=meta.cues?.[cut.cue];
  assert(cue && Number.isFinite(cue.start) && cue.start>=0 && cue.end>cue.start && cue.end<=duration+0.15,'Invalid source timing');
  const start=Math.max(0,cue.start-(cut.cue==='open'?0.08:0));
  const length=cue.end-start;
  const sourceFilter=`trim=start=${start}:end=${cue.end},setpts=(PTS-STARTPTS)*${cut.duration/length},fps=30`;
  const subtitle=join(output,`captions/${cut.id}.txt`);await writeFile(subtitle,cut.title);
  const baseFilter=`${sourceFilter},scale=720:1470:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1080:1920:(ow-iw)/2:270:color=${background},setsar=1`;
  const text=(file,size,y,color)=>`drawtext=fontfile='${filterPath(font)}':textfile='${filterPath(file)}':fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=${y}`;
  const filters=[baseFilter,text(subtitle,cut.cue==='ending'?49:55,91,foreground),
    text(join(output,'captions/disclosure.txt'),27,190,secondary),
    text(join(output,'captions/consult.txt'),31,1818,foreground)].join(',');
  execFileSync('ffmpeg',['-y','-v','error','-i',raw,'-vf',filters,'-t',String(cut.duration),...encode,join(output,`shots/${cut.id}.mp4`)],{stdio:'inherit'});
  execFileSync('ffmpeg',['-y','-v','error','-i',raw,'-vf',`${sourceFilter},setsar=1`,'-t',String(cut.duration),...encode,join(output,`clean/${cut.id}.mp4`)],{stdio:'inherit'});
  cut.sourceStart=Number(start.toFixed(3));cut.sourceEnd=cue.end;
  cut.targetStart=time;time+=cut.duration;cut.targetEnd=time;
  cut.sha256=sha256(await readFile(join(output,`shots/${cut.id}.mp4`)));
}
const concat=join(output,'concat.txt');
await writeFile(concat,cuts.map(c=>`file 'shots/${c.id}.mp4'`).join('\n')+'\n');
const final=join(output,'memory-gift-14s.mp4');
execFileSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',concat,'-c','copy','-an','-movflags','+faststart',final],{stdio:'inherit'});
for(const file of ['full-mobile.webm','full-mobile.mp4','shots.json','SHOTS.md']) await cp(join(source,file),join(output,'source',file));
const srtTime=t=>`00:00:${String(t).padStart(2,'0')},000`;
await writeFile(join(output,'captions.srt'),cuts.map((c,i)=>`${i+1}\n${srtTime(c.targetStart)} --> ${srtTime(c.targetEnd)}\n${c.title}\n`).join('\n'),'utf8');
const timeline={schema:1,scheme,source:'real Playwright interaction recording only',provenance:meta.provenance,
  framePolicy:'Complete 390×844 viewport scaled to fit a 720×1470 area; padded to 1080×1920. No crop, no synthesized interaction or music.',
  width:1080,height:1920,duration:time,audio:'none',cuts,finalSHA256:sha256(await readFile(final)),probe:ffprobe(final)};
await writeFile(join(output,'timeline.json'),JSON.stringify(timeline,null,2));
await writeFile(join(output,'EDITING.md'),`# MEMORY GIFT · 14 秒真实互动素材\n\n成片：memory-gift-14s.mp4；1080×1920、H.264、30fps、无音频。仅虚构演示。\n\n${cuts.map(c=>`- ${c.targetStart}–${c.targetEnd}s / ${c.title} / 源 ${c.sourceStart}–${c.sourceEnd}s / ${c.note}`).join('\n')}\n\n画面完整保留，上方字幕、下方咨询说明。真实操作时间段适当调整播放速度，未添加静态合成互动。\n\n剪映：导入成片，或导入 clean/ 无字幕的独立手机镜头，项目设为 9:16；用纯色留边保留全画面。captions.srt 可单独导入；source/ 保存原始 WebM、手机 MP4 与真实时间标记。shots/ 是带说明的各竖版镜头。字幕字体来自本机 Noto Sans CJK（SIL OFL），不分发系统字体文件；没有音乐。\n\n生成：先用 RECORD_PROMO=yes 录制已校验商业演示，再运行 npm run build:promo。详见 COMMERCIAL.md。\n`);
console.log(`Real-footage promotional MP4 created: ${final}`);
