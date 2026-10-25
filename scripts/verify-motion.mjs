import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'

const url = process.env.TEST_URL || 'http://localhost:4173/symmetrical-carnival/phone-to-today/'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
const report = { url, errors: [] }
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' })
  page.on('pageerror', error => report.errors.push(error.message))
  await page.addInitScript(() => {
    window.__motionFrames = []
    let first = 0
    function sample() {
      const headline = document.querySelector('.headline-window strong')
      const picture = document.querySelector('.still-media picture')
      if (headline && picture) {
        first ||= performance.now()
        window.__motionFrames.push({ headline: getComputedStyle(headline).transform, image: getComputedStyle(picture).transform })
      }
      if (!first || performance.now() - first < 2000) requestAnimationFrame(sample)
      else window.__motionDone = true
    }
    requestAnimationFrame(sample)
  })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.__motionDone)
  const samples = await page.evaluate(() => window.__motionFrames)
  report.heroHeadlineStates = new Set(samples.map(frame => frame.headline)).size
  report.heroImageStates = new Set(samples.map(frame => frame.image)).size
  assert(report.heroHeadlineStates > 8, 'Headline actually animates on entry')
  assert(report.heroImageStates > 8, 'Photograph actually settles on entry')
  await page.locator('#night-calls').evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'center' }))
  await page.waitForTimeout(150)
  const beforeDrift = await page.locator('.call-memory').evaluate(node => getComputedStyle(node).transform)
  await page.evaluate(() => window.scrollBy({ top: 160, behavior: 'instant' }))
  await page.waitForTimeout(150)
  const afterDrift = await page.locator('.call-memory').evaluate(node => getComputedStyle(node).transform)
  report.callDrift = { before: beforeDrift, after: afterDrift }
  assert.notEqual(beforeDrift, afterDrift, 'The call scene responds to actual scroll position')
  await page.locator('.duo-stage').evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'center' }))
  const cardsStart = await page.locator('.memory-cards').evaluate(node => getComputedStyle(node).transform)
  await page.waitForTimeout(1100)
  const cardsEnd = await page.locator('.memory-cards').evaluate(node => getComputedStyle(node).transform)
  assert.notEqual(cardsStart, cardsEnd, 'Cards visibly enter before any click')
  report.cardEntrance = { before: cardsStart, after: cardsEnd }
  await page.locator('.arrival-poster').evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'center' }))
  const cityStart = await page.locator('.city-word').evaluate(node => getComputedStyle(node).transform)
  await page.waitForTimeout(1400)
  const cityEnd = await page.locator('.city-word').evaluate(node => getComputedStyle(node).transform)
  assert.notEqual(cityStart, cityEnd, 'The destination reveal visibly completes')
  report.destination = { before: cityStart, after: cityEnd }
  assert((await page.locator('#today .body-copy').innerText()).includes('已经见面了'))
  for (const id of ['beginning', 'letter', 'duo', 'night-calls', 'today', 'letter']) {
    await page.locator('#' + id).evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
    await page.waitForTimeout(70)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390)
  }
  assert.equal(await page.locator('main p').last().textContent(), '不管那次你有没有考上娄底三中，你永远是我的 best friends。')
  await page.close()
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await reduced.goto(url, { waitUntil: 'networkidle' })
  const stationary = await reduced.locator('.headline-window strong, .still-media picture, .memory-cards, .city-word, .final-blessing').evaluateAll(nodes => nodes.every(node => {
    const transform = getComputedStyle(node).transform
    return transform === 'none' || new DOMMatrixReadOnly(transform).isIdentity
  }))
  assert(stationary, 'Reduced motion renders the complete static story immediately')
  report.reducedMotionStatic = stationary
  assert.equal(await reduced.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(245, 245, 247)')
  await reduced.close()
  assert.deepEqual(report.errors, [])
  console.log(JSON.stringify(report, null, 2))
} finally {
  await writeFile('qa/motion-results.json', JSON.stringify(report, null, 2))
  await browser.close()
}
