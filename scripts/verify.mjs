import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const url = process.env.TEST_URL || 'http://localhost:4173/symmetrical-carnival/phone-to-today/'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
await mkdir('qa', { recursive: true })
const report = { url, browser: browser.version(), viewports: [], accessibility: [], errors: [] }
try {
  for (const width of [360, 390, 430, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: width < 768 ? 844 : 1000 }, deviceScaleFactor: 1,
      isMobile: width < 768, hasTouch: width < 768,
      userAgent: width < 768 ? 'Mozilla/5.0 (Linux; Android 15; iQOO 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36' : undefined,
    })
    page.on('pageerror', error => report.errors.push(error.message))
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`) })
    await page.goto(url, { waitUntil: 'networkidle' })
    assert.equal(await page.locator('main > section').count(), 5)
    assert.equal(await page.locator('audio, video, iframe').count(), 0)
    assert.equal(await page.locator('img').count(), 1)
    assert(await page.locator('img').evaluate(node => node.complete && node.naturalWidth > 0))
    assert.equal(await page.locator('main > svg, [data-wire], .connection-path, .waveform, .clock-orbit, .duo-tracks').count(), 0)
    assert(await page.locator('svg').evaluateAll(nodes => nodes.every(node => Number(node.getAttribute('width')) <= 24 && Number(node.getAttribute('height')) <= 24)), 'Only small functional icons remain')
    assert.equal(await page.locator('time').first().getAttribute('datetime'), '2026-10-25')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width)
    const buttonBounds = await page.getByRole('button', { name: '接起这段回忆' }).boundingBox()
    assert(buttonBounds.y + buttonBounds.height <= (width < 768 ? 844 : 1000), 'Opening action must fit first viewport')
    await page.screenshot({ path: `qa/${width}-top.png` })
    await page.getByRole('button', { name: '接起这段回忆' }).click()
    await page.waitForFunction(() => document.activeElement?.id === 'night-title')
    await page.waitForTimeout(650)
    for (const [label, expected] of [['初二', '初二的时候，你在。'], ['初三', '初三的时候，你也在。'], ['什么都聊', '很多话，都能跟你说。']]) {
      await page.getByRole('button', { name: label, exact: true }).click()
      await page.waitForFunction(text => document.querySelector('.memory-response')?.textContent === text, expected)
      assert.equal(await page.getByRole('button', { name: label, exact: true }).getAttribute('aria-pressed'), 'true')
    }
    await page.getByRole('button', { name: '一起准备', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('.duo-response')?.textContent === '这一段回忆里，你一直是我的队友。')
    assert.equal(await page.getByRole('button', { name: '再准备一次' }).getAttribute('aria-pressed'), 'true')
    await page.getByRole('button', { name: '再准备一次' }).click()
    assert.equal(await page.getByRole('button', { name: '一起准备', exact: true }).getAttribute('aria-pressed'), 'false')
    await page.locator('#today').scrollIntoViewIfNeeded()
    await page.waitForTimeout(350)
    await page.screenshot({ path: `qa/${width}-middle.png` })
    const summary = page.locator('summary')
    await summary.click()
    assert.equal(await page.locator('details').getAttribute('open'), '')
    assert(await page.getByText('这个小惊喜，我也想一起记住。').isVisible())
    await summary.click()
    assert.equal(await page.locator('details').getAttribute('open'), null)
    await summary.focus()
    await page.keyboard.press('Enter')
    assert.equal(await page.locator('details').getAttribute('open'), '')
    await page.keyboard.press('Enter')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(650)
    const lastParagraph = await page.locator('main p').last().innerText()
    assert.equal(lastParagraph.replace(/\n/g, ''), '不管那次你有没有考上娄底三中，你永远是我的 best friends。')
    await page.screenshot({ path: `qa/${width}-bottom.png` })
    for (const id of ['#beginning', '#duo', '#letter', '#night-calls', '#letter']) {
      await page.locator(id).evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
      assert(await page.locator(`${id} h1, ${id} h2`).isVisible())
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width)
    report.viewports.push({ width, passed: true, height: await page.evaluate(() => document.documentElement.scrollHeight) })
    await page.close()
  }
  for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle' })
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto')
    assert.equal(await page.locator('#today').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(241, 243, 242)')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    report.accessibility.push({ colorScheme, violations: results.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) })
    assert.equal(results.violations.length, 0, `Accessibility violations: ${JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))}`)
    await page.getByRole('button', { name: '接起这段回忆' }).click()
    await page.waitForTimeout(100)
    assert.equal(await page.evaluate(() => document.activeElement.id), 'night-title')
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
    await page.screenshot({ path: `qa/reduced-${colorScheme}.png` })
    await context.close()
  }
  const share = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await share.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.__copied = text } }, configurable: true })
  })
  await share.goto(url)
  await share.getByRole('button', { name: '分享这份回忆' }).click()
  assert.equal(await share.locator('[role="status"]').innerText(), '链接已复制，可以发给你了。')
  assert((await share.evaluate(() => window.__copied)).endsWith('/symmetrical-carnival/phone-to-today/'))
  await share.evaluate(() => { navigator.clipboard.writeText = async () => { throw Error('denied') } })
  await share.getByRole('button', { name: '分享这份回忆' }).click()
  assert.equal(await share.locator('[role="status"]').innerText(), '暂时无法分享，请复制浏览器地址。')
  await share.close()
  const fallback = await browser.newPage({ viewport: { width: 360, height: 640 }, reducedMotion: 'reduce' })
  await fallback.route('**/night-still-life*.webp', route => route.abort())
  await fallback.goto(url, { waitUntil: 'networkidle' })
  assert.equal(await fallback.locator('img').count(), 0)
  const fallbackButton = await fallback.locator('.enter-button').boundingBox()
  assert(fallbackButton.y + fallbackButton.height <= 640, 'Short-screen action visible even with image failure')
  assert.equal(await fallback.evaluate(() => document.documentElement.scrollWidth), 360)
  assert(await fallback.locator('.final-blessing').isVisible())
  await fallback.close()
  assert.deepEqual(report.errors, [])
  console.log(JSON.stringify(report, null, 2))
} finally {
  await writeFile('qa/results.json', JSON.stringify(report, null, 2))
  await browser.close()
}
