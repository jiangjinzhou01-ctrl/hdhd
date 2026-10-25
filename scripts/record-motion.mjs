import { chromium } from '@playwright/test'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const url = process.env.TEST_URL || 'http://localhost:4173/symmetrical-carnival/phone-to-today/'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
const temporary = await mkdtemp(path.join(tmpdir(), 'friendship-motion-'))
await mkdir('design', { recursive: true })
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' })
  const cdp = await page.context().newCDPSession(page)
  const frames = []
  cdp.on('Page.screencastFrame', frame => {
    frames.push({ time: Date.now(), data: frame.data })
    cdp.send('Page.screencastFrameAck', { sessionId: frame.sessionId }).catch(() => {})
  })
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 390, maxHeight: 844, everyNthFrame: 1 })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2100)
  async function show(selector, duration = 1500) {
    await page.locator(selector).evaluate(node => node.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    await page.waitForTimeout(duration)
  }
  await show('#night-calls .chapter-heading', 1450)
  await show('.night-feature', 1450)
  await page.getByRole('button', { name: '什么都聊', exact: true }).click()
  await page.waitForTimeout(650)
  await show('#duo .chapter-heading', 1350)
  await show('.duo-stage', 1550)
  await page.getByRole('button', { name: '一起准备', exact: true }).click()
  await page.waitForTimeout(800)
  await show('#meeting-title', 1500)
  await show('.arrival-poster', 1800)
  await show('.small-surprise', 1100)
  await page.locator('summary').click()
  await page.waitForTimeout(650)
  await show('#letter-title', 1400)
  await show('.final-blessing', 1500)
  await cdp.send('Page.stopScreencast')
  const list = []
  for (let i = 0; i < frames.length; i++) {
    const file = path.join(temporary, String(i).padStart(6, '0') + '.jpg')
    await writeFile(file, Buffer.from(frames[i].data, 'base64'))
    list.push(`file '${file}'`)
    if (i + 1 < frames.length) list.push(`duration ${Math.max((frames[i + 1].time - frames[i].time) / 1000, 0.016).toFixed(3)}`)
  }
  const concat = path.join(temporary, 'frames.txt')
  await writeFile(concat, list.join('\n'))
  await browser.close()
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', concat, '-an', '-vf', 'fps=30,format=yuv420p', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-deadline', 'realtime', '-cpu-used', '6', 'design/motion-preview.webm'])
  console.log(`Recorded ${frames.length} real browser frames to design/motion-preview.webm; capture timing is preserved.`)
} finally {
  await browser.close()
  await rm(temporary, { recursive: true, force: true })
}
