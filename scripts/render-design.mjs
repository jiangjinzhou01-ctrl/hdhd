import { chromium } from '@playwright/test'
import { readFile, mkdir } from 'node:fs/promises'

const url = process.env.TEST_URL || 'http://localhost:4173/symmetrical-carnival/phone-to-today/'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
await mkdir('design', { recursive: true })
await mkdir('qa', { recursive: true })
const font = async name => `data:font/woff2;base64,${(await readFile(`public/fonts/${name}`)).toString('base64')}`
const regular = await font('today-sans-regular.woff2')
const semibold = await font('today-sans-semibold.woff2')
const faces = `@font-face{font-family:Today;src:url('${regular}');font-weight:400}@font-face{font-family:Today;src:url('${semibold}');font-weight:600}`
const scenes = [
  ['beginning', '封面', '标题、时间与独立图像'],
  ['night-calls', '深夜通话', '主题选择与内容回应'],
  ['duo', '一起打过的很多局', '双卡互动与可逆状态'],
  ['today', '今天，在长沙见', '到达地与小惊喜'],
  ['letter', '写给罗琛尧', '单列阅读与最后的祝福'],
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
  const screenMarkup = await Promise.all(scenes.map(async ([id, title, caption]) => {
    const data = (await readFile(`qa/review-${id}.png`)).toString('base64')
    return `<figure><figcaption><h2>${title}</h2><p>${caption}</p></figcaption><img src="data:image/png;base64,${data}"></figure>`
  }))
  const board = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 })
  await board.setContent(`<!doctype html><html lang="zh-CN"><style>${faces}*{box-sizing:border-box}body{margin:0;background:#e8edeb;color:#1d252c;font-family:Today,sans-serif}.board{padding:62px 52px 64px}header{display:flex;align-items:end;justify-content:space-between;gap:50px}h1{font-size:43px;line-height:1.4;letter-spacing:-1.5px;font-weight:600;margin:0}header p{font-size:15px;line-height:1.9;margin:12px 0 0;color:#535e65;max-width:960px}.stamp{font-family:monospace;font-size:14px;white-space:nowrap;color:#535e65}.system{display:flex;gap:34px;align-items:center;margin-top:29px;margin-bottom:39px;font-size:13px;color:#535e65}.swatches{display:flex;gap:16px}.swatch{display:flex;align-items:center;gap:8px}.swatch i{width:22px;height:22px;border-radius:4px;display:inline-block}.screens{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:24px}figure{margin:0}figcaption{margin-bottom:18px}figcaption h2{margin:0 0 8px;font-size:17px;font-weight:600}figcaption p{margin:0;color:#535e65;font-size:12px}figure img{display:block;width:100%;height:auto;box-shadow:0 8px 28px #1d252c0d}.note{font-size:12px;color:#535e65;line-height:1.9;margin-top:30px}</style><div class="board"><header><div><h1>电话那头，今天见。</h1><p>一份今天交到你手里的见面纪念册。用时间、称呼和地点组织五幕；画面来自已实现网站的真实截图。</p></div><div class="stamp">UI DESIGN / 2026.10.25</div></header><div class="system"><span>Today Sans / 400 + 600</span><span>12 栏桌面 / 4 栏手机</span><span>16–18px 正文 / 44px 以上触摸区域</span><div class="swatches">${[['#14191F','夜色'],['#F1F3F2','今天'],['#1D252C','正文'],['#E6B36B','琥珀']].map(([color,label])=>`<span class="swatch"><i style="background:${color}"></i>${label}</span>`).join('')}</div></div><div class="screens">${screenMarkup.join('')}</div><p class="note">五幕对应不同的阅读任务，沿用同一套字形、色彩与操作规则。无贯穿线、波形或装饰轨迹；静物为原创意象，故事文字与纪念日期来自作者提供的内容。</p></div></html>`)
  await board.evaluate(() => document.fonts.ready)
  await board.locator('img').evaluateAll(nodes => Promise.all(nodes.map(node => node.decode())))
  await board.screenshot({ path: 'design/ui-overview.png', fullPage: true })
  const still = `data:image/webp;base64,${(await readFile('public/night-still-life.webp')).toString('base64')}`
  await board.setViewportSize({ width: 1200, height: 630 })
  await board.setContent(`<!doctype html><html lang="zh-CN"><style>${faces}*{box-sizing:border-box}body{margin:0;background:#14191f;color:#f1f3f2;font-family:Today,sans-serif}.cover{height:630px;padding:56px 64px;position:relative}.name{color:#e6b36b;font-size:16px;margin:0 0 24px}h1{font-size:77px;line-height:1.24;font-weight:400;letter-spacing:-4px;margin:0}h1 strong{display:block;font-weight:600}.time{position:absolute;left:64px;bottom:68px;font:88px/1 monospace;letter-spacing:-7px}.note{position:absolute;left:440px;bottom:69px;font-size:16px;line-height:1.9;color:#b6c0c7;width:225px}.photo{position:absolute;right:64px;top:56px;width:300px;height:474px;object-fit:cover;object-position:84% center}.date{position:absolute;right:64px;bottom:48px;font:13px monospace;color:#b6c0c7}</style><div class="cover"><p class="name">给罗琛尧</p><h1>电话那头，<strong>今天见。</strong></h1><div class="time">23:00</div><p class="note">从初二、初三的深夜，<br>聊到今天的长沙。</p><img class="photo" src="${still}" alt=""><span class="date">2026.10.25</span></div></html>`)
  await board.evaluate(() => document.fonts.ready)
  await board.locator('img').evaluate(node => node.decode())
  await board.screenshot({ path: 'public/social-preview.png' })
  await board.close()
  console.log('Created design/ui-overview.png, design/desktop-cover.png, and the matching share preview.')
} finally { await browser.close() }
