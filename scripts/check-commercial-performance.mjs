import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { preview } from './lib/preview.mjs';
import { verifyArtifact, OUTPUT, BASE } from './lib/commercial.mjs';
await verifyArtifact();
const server=await preview(OUTPUT,BASE);
await mkdir('artifacts/commercial/performance',{recursive:true});
const results=[];
try {
  for(const [name,url] of [['commercial',server.url],['demo',server.url+'demo/']]) {
    const chrome=await launch({chromePath:process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium')?'/usr/bin/chromium':chromium.executablePath()),
      chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
    try {
      const result=await lighthouse(url,{port:chrome.port,onlyCategories:['performance','accessibility','best-practices','seo'],
        output:['html','json'],formFactor:'mobile',logLevel:'error',throttlingMethod:'simulate'});
      await writeFile(`artifacts/commercial/performance/${name}.html`,result.report[0]);
      await writeFile(`artifacts/commercial/performance/${name}.json`,result.report[1]);
      const lhr=result.lhr;
      const metrics={name,date:lhr.fetchTime,version:lhr.lighthouseVersion,node:process.version,
        environment:lhr.environment,screen:lhr.configSettings.screenEmulation,throttling:lhr.configSettings.throttling,
        throttlingMethod:lhr.configSettings.throttlingMethod,
        scores:Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)])),
        LCPms:lhr.audits['largest-contentful-paint'].numericValue,CLS:lhr.audits['cumulative-layout-shift'].numericValue,
        FCPms:lhr.audits['first-contentful-paint'].numericValue,TBTms:lhr.audits['total-blocking-time'].numericValue,
        transferBytes:lhr.audits['total-byte-weight'].numericValue,
        limitation:'Local static server with HTTP gzip for text assets, no cache; Lighthouse mobile CPU/network simulation. Not a low-end Android phone, in-app browser, China network, field INP or real-user data.'};
      results.push(metrics);
      console.log(JSON.stringify(metrics,null,2));
      if(metrics.CLS>0.1 || metrics.LCPms>4000) throw Error(`${name}: observed lab regression requires review`);
    } finally { await chrome.kill(); }
  }
} finally {await server.close();await writeFile('artifacts/commercial/performance/summary.json',JSON.stringify(results,null,2));}
