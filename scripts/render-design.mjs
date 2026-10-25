import { chromium } from '@playwright/test'
import { readFile, mkdir } from 'node:fs/promises'

const url = process.env.TEST_URL || 'http://localhost:4173/symmetrical-carnival/phone-to-today/'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
await mkdir('design', { recursive: true })
await mkdir('qa', { recursive: true })
const font = async name => `data:font/woff2;base64,${(await readFile(`public/fonts/${name}`)).toString('base64')}`
const faces = `@font-face{font-family:Today;src:url('${await font('today-sans-regular.woff2')}');font-weight:400}@font-face{font-family:Today;src:url('${await font('today-sans-semibold.woff2')}');font-weight:600}`
const scenes = [
  ['beginning', '今天，见到你了', '从已经见面的今天开场'],
  ['night-calls', '那些深夜', '回忆中的电话与文字回应'],
  ['duo', '一直并肩', '双卡进入与可逆互动'],
  ['today', '长沙见面', '真实地点与一个小惊喜'],
  ['letter', '见面后的信', '读完祝福，再把它记住'],
]
try {
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  await mobile.goto(url, { waitUntil: 'networkidle' })
  await mobile.evaluate(() => document.fonts.ready)
  for (const [id] of scenes) await mobile.locator(`#${id}`).screenshot({ path: `qa/review-${id}.png` })
  await mobile.close()
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  await desktop.goto(url, { waitUntil: 'networkidle' })
  await desktop.screenshot({ path: 'design/desktop-cover.png' })
  await desktop.close()
  const markup = await Promise.all(scenes.map(async ([id, title, caption]) => `<figure><figcaption><h2>${title}</h2><p>${caption}</p></figcaption><img src="data:image/png;base64,${(await readFile(`qa/review-${id}.png`)).toString('base64')}"></figure>`))
  const board = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 })
  await board.setContent(`<!doctype html><html lang="zh-CN"><style>${faces}*{box-sizing:border-box}body{margin:0;background:#ececf0;color:#1d1d1f;font-family:Today,sans-serif}.board{padding:54px 52px 60px}header{display:flex;justify-content:space-between;align-items:end;gap:40px}h1{font-size:43px;line-height:1.35;font-weight:600;letter-spacing:-1.5px;margin:0}header p{font-size:15px;line-height:1.8;margin:12px 0 0;color:#626267}.date{font:14px monospace;color:#626267;white-space:nowrap}.system{display:flex;align-items:center;gap:28px;margin:28px 0 39px;font-size:13px;color:#626267}.swatches{display:flex;gap:17px}.swatch{display:flex;align-items:center;gap:8px}.swatch i{display:block;width:22px;height:22px;border-radius:6px}.screens{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:24px}figure{margin:0}figcaption{margin-bottom:18px}figcaption h2{font-size:17px;font-weight:600;margin:0 0 8px}figcaption p{font-size:12px;color:#626267;margin:0}figure img{display:block;width:100%;height:auto;box-shadow:0 8px 25px #1d1d1f08}.note{font-size:12px;color:#626267;margin:30px 0 0;line-height:1.8}</style><div class="board"><header><div><h1>今天，见到你了。</h1><p>给罗琛尧的一份见面纪念。参考 Apple 产品页的留白、层级与滚动节奏；实际内容与画面为本项目原创。</p></div><div class="date">2026.10.25 / 长沙</div></header><div class="system"><span>系统无衬线 / Today Sans 400 + 600</span><span>桌面与手机独立构图</span><span>16px 手机正文 / 44px 以上触摸区域</span><div class="swatches">${[['#f5f5f7','浅灰'],['#fbfbfd','画面'],['#1d1d1f','正文'],['#0071e3','操作']].map(([color,label])=>`<span class="swatch"><i style="background:${color}"></i>${label}</span>`).join('')}</div></div><div class="screens">${markup.join('')}</div><p class="note">这是已实现网站的静态截图，动态过程见 motion-preview.webm。日期雕塑与深夜静物均为原创意象，不冒充两人的见面照片。</p></div></html>`)
  await board.evaluate(() => document.fonts.ready)
  await board.locator('img').evaluateAll(nodes => Promise.all(nodes.map(node => node.decode())))
  await board.screenshot({ path: 'design/ui-overview.png', fullPage: true })
  const dateImage = `data:image/webp;base64,${(await readFile('public/meeting-date.webp')).toString('base64')}`
  await board.setViewportSize({ width: 1200, height: 630 })
  await board.setContent(`<!doctype html><html lang="zh-CN"><style>${faces}*{box-sizing:border-box}body{margin:0;background:#f5f5f7;color:#1d1d1f;font-family:Today,sans-serif}.cover{height:630px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:30px}.name{font-size:17px;font-weight:600;margin:0 0 13px}h1{font-size:65px;line-height:1.12;font-weight:600;letter-spacing:-3px;margin:0}.note{font-size:19px;line-height:1.5;margin:17px 0 4px;color:#626267}.art{height:230px;width:700px;object-fit:contain;mask-image:linear-gradient(to bottom,transparent,#000 12%,#000 88%,transparent)}.date{font-size:13px;color:#626267;margin-top:5px}</style><div class="cover"><p class="name">罗琛尧，这份纪念送给你。</p><h1>今天，<br>见到你了。</h1><p class="note">从电话那头，到今天的长沙。</p><img class="art" src="${dateImage}" alt=""><p class="date">2026.10.25 / 长沙，见面纪念</p></div></html>`)
  await board.evaluate(() => document.fonts.ready)
  await board.locator('img').evaluate(node => node.decode())
  await board.screenshot({ path: 'public/social-preview.png' })
  await board.close()
  console.log('Updated the complete UI overview, desktop cover, and share preview for the completed meeting.')
} finally { await browser.close() }
