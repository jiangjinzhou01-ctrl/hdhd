import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'

const url = process.env.TEST_URL || 'http://localhost:4173/symmetrical-carnival/phone-to-today/'
const colorScheme = process.env.TEST_SCHEME || 'light'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
const report = { url, colorScheme, errors: [] }
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', colorScheme })
  page.on('pageerror', error => report.errors.push(error.message))
  await page.addInitScript(() => {
    window.__motionFrames = []
    let first = 0
    function sample() {
      const headline = document.querySelector('.headline-window:last-child strong')
      const picture = document.querySelector('.still-media picture')
      if (headline && picture) {
        first ||= performance.now()
        const opacity = selector => Number(getComputedStyle(document.querySelector(selector)).opacity)
        window.__motionFrames.push({ time: performance.now() - first, headline: getComputedStyle(headline).transform, focus: getComputedStyle(headline).filter, image: getComputedStyle(picture).transform, dedication: opacity('.dedication'), headlineOpacity: Number(getComputedStyle(headline).opacity), description: opacity('.hero-description'), actions: opacity('.hero-actions') })
      }
      if (!first || performance.now() - first < 2000) requestAnimationFrame(sample)
      else window.__motionDone = true
    }
    requestAnimationFrame(sample)
  })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.__motionDone)
  report.dateImage = await page.locator('.still-media img').evaluate(node => node.currentSrc.split('/').at(-1))
  assert.equal(report.dateImage, colorScheme === 'dark' ? 'meeting-date-dark-mobile.webp' : 'meeting-date-mobile.webp')
  const samples = await page.evaluate(() => window.__motionFrames)
  report.heroHeadlineStates = new Set(samples.map(frame => frame.headline)).size
  report.heroImageStates = new Set(samples.map(frame => frame.image)).size
  assert(report.heroHeadlineStates > 8, 'Headline actually animates on entry')
  assert(report.heroImageStates > 8, 'Photograph actually settles on entry')
  report.headlineFocus = { states: new Set(samples.map(frame => frame.focus)).size, softest: Math.max(...samples.map(frame => parseFloat(frame.focus.match(/blur\(([\d.]+)px\)/)?.[1] || '0'))), final: samples.at(-1).focus }
  assert(report.headlineFocus.states > 8 && report.headlineFocus.softest > 4, 'The headline visibly resolves from optical blur, beyond opacity alone')
  assert.equal(report.headlineFocus.final, 'none', 'The headline releases its filter when focused')
  report.heroFadeOrder = Object.fromEntries(['dedication', 'headlineOpacity', 'description', 'actions'].map(key => [key, samples.find(frame => frame[key] > 0.02)?.time]))
  const order = Object.values(report.heroFadeOrder)
  assert(order.every(time => Number.isFinite(time)), 'Every hero text and action fades into view')
  assert(order.every((time, index) => !index || time > order[index - 1]), 'Hero content enters in reading order')
  await page.locator('#night-calls').evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'center' }))
  const headingOrder = await page.locator('#night-title').evaluate(node => new Promise(resolve => {
    const lines = [...node.querySelectorAll('.text-line')]
    const result = lines.map(() => [])
    const start = performance.now()
    function sample() {
      lines.forEach((line, index) => result[index].push({ time: performance.now() - start, opacity: Number(getComputedStyle(line).opacity), transform: getComputedStyle(line).transform, filter: getComputedStyle(line).filter }))
      if (performance.now() - start < 1300) requestAnimationFrame(sample)
      else resolve(result.map(frames => ({ firstVisible: frames.find(frame => frame.opacity > 0.02)?.time, states: new Set(frames.map(frame => frame.transform)).size, focusStates: new Set(frames.map(frame => frame.filter)).size, finalFilter: frames.at(-1).filter, last: frames.at(-1).opacity })))
    }
    requestAnimationFrame(sample)
  }))
  assert(headingOrder.every(line => line.states > 5 && line.last === 1), 'Each heading line actually rises and becomes fully readable')
  assert(headingOrder[1].firstVisible > headingOrder[0].firstVisible, 'Heading lines reveal in reading order')
  assert(headingOrder.every(line => line.focusStates > 5 && line.finalFilter === 'none'), 'Every heading line finishes crisply')
  report.headingLines = headingOrder
  await page.waitForTimeout(150)
  const beforeDrift = await page.locator('.call-memory').evaluate(node => getComputedStyle(node).transform)
  await page.evaluate(() => window.scrollBy({ top: 160, behavior: 'instant' }))
  await page.waitForTimeout(150)
  const afterDrift = await page.locator('.call-memory').evaluate(node => getComputedStyle(node).transform)
  report.callDrift = { before: beforeDrift, after: afterDrift }
  assert.notEqual(beforeDrift, afterDrift, 'The call scene responds to actual scroll position')
  await page.locator('.duo-stage').evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'center' }))
  const cardsStart = await page.locator('.memory-cards').evaluate(node => getComputedStyle(node).transform)
  const individualCardsStart = await page.locator('[data-memory-card]').evaluateAll(nodes => nodes.map(node => ({ transform: getComputedStyle(node).transform, opacity: Number(getComputedStyle(node).opacity) })))
  await page.waitForTimeout(1100)
  const cardsEnd = await page.locator('.memory-cards').evaluate(node => getComputedStyle(node).transform)
  assert.notEqual(cardsStart, cardsEnd, 'Cards visibly enter before any click')
  report.cardEntrance = { before: cardsStart, after: cardsEnd }
  const individualCardsEnd = await page.locator('[data-memory-card]').evaluateAll(nodes => nodes.map(node => ({ transform: getComputedStyle(node).transform, opacity: Number(getComputedStyle(node).opacity) })))
  assert(individualCardsEnd.every((card, index) => card.opacity === 1 && card.transform !== individualCardsStart[index].transform), 'Both cards independently settle into view')
  report.individualCardEntrance = { before: individualCardsStart, after: individualCardsEnd }
  await page.getByRole('button', { name: '一起准备', exact: true }).click()
  await page.waitForFunction(() => [...document.querySelectorAll('[data-memory-card]')].every(node => {
    const transform = getComputedStyle(node).transform
    return transform === 'none' || new DOMMatrixReadOnly(transform).isIdentity
  }))
  report.cardsAligned = true
  await page.getByRole('button', { name: '再准备一次', exact: true }).click()
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
  assert.equal(await page.locator('.final-blessing').textContent(), '不管你以后能不能考上娄底三中，你永远是我的 best friends。')
  assert.equal(await page.locator('main > section').last().getAttribute('id'), 'weekend-note')
  assert.equal(await page.locator('#weekend-note time').getAttribute('datetime'), '2026-10-28')
  await page.close()
  // A fresh, actual wheel-scroll tour verifies text AND components, including the
  // paragraphs near the page end. Once seen, a reveal must remain readable.
  const tour = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', colorScheme })
  tour.on('pageerror', error => report.errors.push(error.message))
  await tour.goto(url, { waitUntil: 'networkidle' })
  await tour.evaluate(() => {
    const nodes = [...document.querySelectorAll('[data-reveal="scroll"]')]
    window.__revealTour = nodes.map((node, index) => ({ element: node.id || `${node.closest('[data-text-reveal]')?.id || node.className || 'body'}-${index}`, focusing: node.hasAttribute('data-focus-reveal'), values: [], filters: [] }))
    window.__captureRevealTour = true
    function sample() {
      nodes.forEach((node, index) => {
        window.__revealTour[index].values.push(Number(getComputedStyle(node).opacity))
        window.__revealTour[index].filters.push(getComputedStyle(node).filter)
      })
      if (window.__captureRevealTour) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  const tourHeight = await tour.evaluate(() => document.documentElement.scrollHeight)
  for (let position = 0; position < tourHeight; position += 400) {
    await tour.mouse.wheel(0, 400)
    await tour.waitForTimeout(320)
  }
  await tour.waitForTimeout(1100)
  report.scrollFades = await tour.evaluate(() => {
    window.__captureRevealTour = false
    return window.__revealTour.map(({ element, focusing, values, filters }) => ({ element, focusing, first: values[0], last: values.at(-1), states: new Set(values).size, focusStates: new Set(filters).size, finalFilter: filters.at(-1) }))
  })
  for (const fade of report.scrollFades) {
    assert.equal(fade.last, 1, `${fade.element} completes its fade`)
    assert(fade.states > 5, `${fade.element} actually fades while scrolling`)
    if (fade.focusing) assert(fade.focusStates > 5 && fade.finalFilter === 'none', `${fade.element} resolves into fully sharp text`)
  }
  assert(report.scrollFades.length >= 18, 'Reveal coverage includes headings, body text, component panels, and the letter')
  await tour.locator('#beginning').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  assert(await tour.locator('[data-reveal="scroll"]').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).opacity === '1')), 'Scrolling back never hides previously read content')
  await tour.close()
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme })
  await reduced.goto(url, { waitUntil: 'networkidle' })
  const stationary = await reduced.locator('.headline-window strong, .still-media picture, .memory-cards, .city-word, .final-blessing').evaluateAll(nodes => nodes.every(node => {
    const transform = getComputedStyle(node).transform
    return transform === 'none' || new DOMMatrixReadOnly(transform).isIdentity
  }))
  assert(stationary, 'Reduced motion renders the complete static story immediately')
  assert(await reduced.locator('[data-reveal]').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).opacity === '1')), 'Reduced motion shows every paragraph and component, even below the viewport')
  assert(await reduced.locator('[data-focus-reveal]').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).filter === 'none')), 'Reduced motion never blurs text, including unseen content')
  report.reducedMotionStatic = stationary
  assert.equal(await reduced.evaluate(() => getComputedStyle(document.body).backgroundColor), colorScheme === 'dark' ? 'rgb(8, 8, 10)' : 'rgb(245, 245, 247)')
  await reduced.close()
  assert.deepEqual(report.errors, [])
  console.log(JSON.stringify(report, null, 2))
} finally {
  await writeFile('qa/motion-results.json', JSON.stringify(report, null, 2))
  await browser.close()
}
