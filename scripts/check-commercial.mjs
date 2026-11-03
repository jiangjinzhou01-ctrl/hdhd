import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { verifyArtifact, OUTPUT, BASE } from './lib/commercial.mjs';
import { preview } from './lib/preview.mjs';

const { count } = await verifyArtifact();
const server = await preview(OUTPUT, BASE);
const chrome = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
const browser = await chromium.launch({ executablePath:chrome,args:['--no-sandbox'] });
const report = {date:new Date().toISOString(),browser:browser.version(),files:count,viewports:[],axe:[],checks:[],errors:[]};
const run = (script,env={}) => new Promise((done,reject)=>{
  const child=spawn('node',[script],{stdio:'inherit',env:{...process.env,...env}});
  child.on('error',reject);child.on('exit',code=>code===0?done():reject(Error(`${script} failed (${code})`)));
});
await mkdir('artifacts/commercial/screens',{recursive:true});
try {
  for (const colorScheme of ['light','dark']) for (const width of [320,360,390,430,768,1024,1440]) {
    const height = width >= 768 ? 1000 : width === 320 ? 568 : 844;
    const context = await browser.newContext({viewport:{width,height},colorScheme,reducedMotion:'reduce',hasTouch:width<768});
    const page = await context.newPage();
    page.on('pageerror',e=>report.errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400) report.errors.push(`${r.status()} ${r.url()}`);});
    await page.goto(server.url,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`overflow ${width} ${colorScheme}`);
    assert.equal(await page.locator('h1').count(),1);
    assert((await page.locator('body').innerText()).includes('29.9'));
    const links = await page.locator('a').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')));
    for (const href of links) {
      if(href.startsWith('#')) assert.equal(await page.locator(href).count(),1,`broken anchor ${href}`);
      else assert.equal(href,'demo/','no invented account/contact links');
    }
    const targets = await page.locator('.button,nav a,summary').evaluateAll(ns=>ns.map(n=>{
      const r=n.getBoundingClientRect();return {label:n.textContent,height:r.height,width:r.width,left:r.left,right:r.right,visible:getComputedStyle(n).display!=='none'};
    }));
    assert(targets.filter(t=>t.visible).every(t=>t.height>=44 && t.left>=0 && t.right<=width+1),JSON.stringify(targets));
    const first = page.locator('summary').first(); await first.focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('details').first().getAttribute('open'),'');
    await page.keyboard.press('Enter');
    await page.locator('nav a[href="#price"]').click();
    assert(await page.locator('#price').evaluate(n=>{const r=n.getBoundingClientRect();return r.bottom>80 && r.top<innerHeight;}));
    await page.locator('#top').evaluate(n=>n.scrollIntoView({behavior:'instant'}));
    if ([320,390,768,1440].includes(width)) {
      await page.screenshot({path:`artifacts/commercial/screens/home-${width}-${colorScheme}.png`});
      await page.screenshot({path:`artifacts/commercial/screens/home-${width}-${colorScheme}-full.png`,fullPage:true});
      if(width===390) for(const section of ['experience','includes','price','process','faq','consult'])
        await page.locator(`#${section}`).screenshot({path:`artifacts/commercial/screens/${section}-${colorScheme}.png`,
          style:'.header,.skip{visibility:hidden !important}'});
    }
    if ([390,1440].includes(width)) {
      const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      report.axe.push({width,colorScheme,violations:axe.violations});
      assert.equal(axe.violations.length,0,JSON.stringify(axe.violations));
    }
    report.viewports.push({width,height,colorScheme,passed:true});
    await context.close();
  }
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async t=>window.__copied=t},configurable:true}));
  await page.goto(server.url);
  await page.locator('#copy-keyword').click();
  assert.equal(await page.evaluate(()=>window.__copied),'回忆定制');
  await page.evaluate(()=>navigator.clipboard.writeText=async()=>{throw Error('denied');});
  await page.locator('#copy-keyword').focus(); await page.keyboard.press('Enter');
  assert((await page.locator('#copy-status').textContent()).includes('已选中'));
  assert.equal(await page.evaluate(()=>getSelection().toString()),'回忆定制');
  await page.goto(server.url);
  await page.locator('.hero .button').click();
  assert.equal(page.url(),`${server.url}demo/`);
  await page.waitForSelector('.demo-label');
  assert.equal(await page.locator('.demo-label').textContent(),'友情纪念 · 虚构演示');
  assert((await page.locator('.story-ending small').textContent()).includes('虚构'));
  assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'),
    'https://jiangjinzhou01-ctrl.github.io/symmetrical-carnival/memory-gift/demo/demo-preview.png');
  await page.close();
  report.checks.push('native FAQ keyboard, all anchors, real demo navigation, clipboard success/denial, fictional labels, sharing metadata');
  const offline = await browser.newPage({javaScriptEnabled:false,viewport:{width:320,height:568}});
  await offline.goto(server.url);
  assert(await offline.locator('h1').isVisible());
  await offline.locator('summary').first().click();
  assert.equal(await offline.locator('details').first().getAttribute('open'),'');
  assert(await offline.locator('#consult-keyword').isVisible());
  assert.equal(await offline.evaluate(()=>document.documentElement.scrollWidth),320);
  await offline.close();
  const large = await browser.newPage({viewport:{width:320,height:640},reducedMotion:'reduce'});
  await large.goto(server.url);
  await large.addStyleTag({content:'body{font-size:200%} h1{font-size:3.5rem} h2{font-size:2.8rem} p,summary,dt,dd{font-size:1.4rem}'});
  assert.equal(await large.evaluate(()=>document.documentElement.scrollWidth),320);
  await large.close();
  assert.equal((await fetch(server.url.replace(BASE,'/phone-to-today/'))).status,404);
  assert.equal((await fetch(server.url+'demo/assets/missing.js')).status,404);
  report.checks.push('JS disabled still readable, text enlargement, exact Pages mount, missing resources return 404');
  assert.deepEqual(report.errors,[]);
  if (!process.argv.includes('--page-only')) {
    for (const [script,env] of [
      ['scripts/verify-v2.mjs',{TEST_STORY:'demo'}],
      ['scripts/verify-motion.mjs',{}],
      ['scripts/verify-motion.mjs',{TEST_SCHEME:'dark'}],
    ]) await run(script,{CHROMIUM_PATH:chrome,TEST_URL:`${server.url}demo/`,...env});
    await run('scripts/test-commercial-safety.mjs');
    report.checks.push('original V2 full browser suite on deployed demo subpath, light/dark motion, deployment safety');
  }
  console.log(JSON.stringify(report,null,2));
} finally {
  await writeFile('artifacts/commercial/check.json',JSON.stringify(report,null,2));
  await browser.close(); await server.close();
}
