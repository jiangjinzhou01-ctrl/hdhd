import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const url =
  process.env.TEST_URL ||
  "http://localhost:4174/symmetrical-carnival/phone-to-today/";
const colorScheme = process.env.TEST_SCHEME || "light";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const report = { url, colorScheme, errors: [] };
await mkdir("qa/v2", { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    colorScheme,
    reducedMotion: "no-preference",
    hasTouch: true,
  });
  page.on("pageerror", (e) => report.errors.push(e.message));
  async function sample(selector, duration = 1300, action = async () => {}) {
    await page.evaluate(
      ({ selector, duration }) => {
        window.__frames = [];
        const start = performance.now();
        function frame() {
          const node = document.querySelector(selector);
          if (node) {
            const s = getComputedStyle(node);
            window.__frames.push({
              time: performance.now() - start,
              opacity: s.opacity,
              transform: s.transform,
              filter: s.filter,
              crop: s.objectPosition,
              scroll: scrollY,
            });
          }
          if (window.__sampling) requestAnimationFrame(frame);
        }
        window.__sampling = true;
        frame();
      },
      { selector, duration },
    );
    await action();
    await page.waitForTimeout(duration);
    return page.evaluate(() => {
      window.__sampling = false;
      return window.__frames;
    });
  }
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const hero = await sample(".headline-window:last-child strong", 1400);
  assert(new Set(hero.map((f) => f.filter)).size > 8);
  assert.equal(hero.at(-1).filter, "none");
  report.heroFocusStates = new Set(hero.map((f) => f.filter)).size;
  const opening = await sample(".hero-inner", 1600, () =>
    page.locator(".enter-button").click(),
  );
  assert(new Set(opening.map((f) => f.transform)).size > 8);
  assert(Math.min(...opening.map((f) => Number(f.opacity))) < 0.6);
  assert.equal(
    await page.locator("#beginning").getAttribute("data-opening-phase"),
    "opened",
  );
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "night-title",
  );
  report.opening = {
    states: new Set(opening.map((f) => f.transform)).size,
    scrollStates: new Set(opening.map((f) => f.scroll)).size,
    finalPhase: "opened",
  };
  await page
    .locator(".night-feature")
    .evaluate((n) =>
      n.scrollIntoView({ behavior: "instant", block: "center" }),
    );
  await page.waitForTimeout(1000);
  const before = await page.locator(".night-feature").boundingBox();
  const crop = await sample("[data-image-transition]", 950, () =>
    page.locator(".theme-buttons button").nth(1).click(),
  );
  assert(new Set(crop.map((f) => f.crop)).size > 8);
  const after = await page.locator(".night-feature").boundingBox();
  assert.equal(before.height, after.height);
  report.photoCropStates = new Set(crop.map((f) => f.crop)).size;
  const drift = await sample("[data-scroll-scene]", 500, () =>
    page.mouse.wheel(0, 180),
  );
  assert(new Set(drift.map((f) => f.transform)).size > 5);
  report.scrollSceneStates = new Set(drift.map((f) => f.transform)).size;
  await page
    .locator(".duo-stage")
    .evaluate((n) =>
      n.scrollIntoView({ behavior: "instant", block: "center" }),
    );
  await page.waitForTimeout(1000);
  const resting = await page
    .locator("[data-memory-card]")
    .evaluateAll((ns) => ns.map((n) => getComputedStyle(n).transform));
  const duo = await sample("[data-memory-card]", 900, () =>
    page.locator(".ready-button").click(),
  );
  assert(new Set(duo.map((f) => f.transform)).size > 8);
  const aligned = await page.locator("[data-memory-card]").evaluateAll((ns) =>
    ns.map((n) => {
      const m = new DOMMatrix(getComputedStyle(n).transform);
      return { a: m.a, b: m.b, c: m.c, d: m.d, x: m.e, y: m.f };
    }),
  );
  assert(
    aligned.every(
      (m) =>
        Math.abs(m.b) < 0.001 &&
        Math.abs(m.y) < 0.01 &&
        Math.abs(m.a - 1) < 0.001,
    ),
  );
  report.cards = { states: new Set(duo.map((f) => f.transform)).size, aligned };
  await page.locator(".ready-button").click();
  await page.waitForTimeout(900);
  const restored = await page
    .locator("[data-memory-card]")
    .evaluateAll((ns) => ns.map((n) => getComputedStyle(n).transform));
  assert(
    restored.every((matrix, i) => {
      const numbers = (s) => s.match(/-?[\d.]+/g).map(Number);
      return numbers(matrix).every(
        (n, j) => Math.abs(n - numbers(resting[i])[j]) < 0.001,
      );
    }),
    "Reverse spring returns to its resting pose within 0.001",
  );
  report.cards.reverse = true;
  const city = await sample(".city-word", 1300, () =>
    page
      .locator(".arrival-poster")
      .evaluate((n) =>
        n.scrollIntoView({ behavior: "instant", block: "center" }),
      ),
  );
  assert(new Set(city.map((f) => f.transform)).size > 8);
  assert.equal(Number(city.at(-1).opacity), 1);
  report.cityMaskStates = new Set(city.map((f) => f.transform)).size;
  await page.close();
  // A full real wheel tour catches missed reveals, rapid reverse scroll and final crispness.
  const tour = await browser.newPage({
    viewport: { width: 390, height: 844 },
    colorScheme,
  });
  tour.on("pageerror", (e) => report.errors.push(e.message));
  await tour.goto(url, { waitUntil: "networkidle" });
  const height = await tour.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < height; y += 420) {
    await tour.mouse.wheel(0, 420);
    await tour.waitForTimeout(230);
  }
  await tour.waitForTimeout(1200);
  assert(
    await tour
      .locator("[data-reveal]")
      .evaluateAll((ns) =>
        ns.every((n) => Number(getComputedStyle(n).opacity) === 1),
      ),
  );
  assert(
    await tour
      .locator("[data-focus-reveal]")
      .evaluateAll((ns) =>
        ns.every((n) => getComputedStyle(n).filter === "none"),
      ),
  );
  report.revealsCompleted = await tour.locator("[data-reveal]").count();
  await tour
    .locator("#beginning")
    .evaluate((n) => n.scrollIntoView({ behavior: "instant" }));
  await tour.waitForTimeout(300);
  assert(
    await tour
      .locator("[data-reveal]")
      .evaluateAll((ns) =>
        ns.every((n) => Number(getComputedStyle(n).opacity) === 1),
      ),
  );
  // Reopen in a fresh page; user wheel must take over before animation finishes.
  await tour.reload({ waitUntil: "networkidle" });
  await tour.locator(".enter-button").click();
  await tour.waitForTimeout(120);
  await tour.mouse.wheel(0, 120);
  await tour.waitForTimeout(100);
  assert.equal(
    await tour.locator("#beginning").getAttribute("data-opening-phase"),
    "opened",
  );
  report.userInterrupt = true;
  // Fast traversal still converges to readable states.
  for (const id of ["letter", "night-calls", "duo", "today", "letter"]) {
    await tour
      .locator("#" + id)
      .evaluate((n) => n.scrollIntoView({ behavior: "instant" }));
    await tour.waitForTimeout(60);
  }
  await tour.waitForTimeout(1200);
  assert.equal(
    await tour
      .locator(".final-blessing")
      .evaluate((n) => getComputedStyle(n).opacity),
    "1",
  );
  await tour.reload({ waitUntil: "networkidle" });
  await tour.locator(".enter-button").click();
  await tour.waitForTimeout(100);
  await tour.mouse.click(12, 120);
  await tour.waitForFunction(() => document.querySelector("#beginning").dataset.openingPhase === "opened", undefined, { timeout: 500 });
  report.pointerInterrupt = true;
  await tour.reload({ waitUntil: "networkidle" });
  await tour.locator(".enter-button").click();
  await tour.waitForTimeout(100);
  await tour.emulateMedia({ reducedMotion: "reduce" });
  await tour.waitForFunction(() => document.querySelector("#beginning").dataset.openingPhase === "opened", undefined, { timeout: 500 });
  report.liveReducedMotion = true;
  await tour.close();
  const reduced = await browser.newPage({
    viewport: { width: 320, height: 568 },
    colorScheme,
    reducedMotion: "reduce",
  });
  await reduced.goto(url, { waitUntil: "networkidle" });
  assert(
    await reduced
      .locator("[data-reveal]")
      .evaluateAll((ns) =>
        ns.every((n) => getComputedStyle(n).opacity === "1"),
      ),
  );
  await reduced.locator(".enter-button").click();
  assert.equal(
    await reduced.evaluate(() => document.activeElement.id),
    "night-title",
  );
  report.reducedMotion = true;
  await reduced.close();
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(
    `qa/v2/motion-${colorScheme}.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
