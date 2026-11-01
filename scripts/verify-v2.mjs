import { chromium, webkit } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const url =
  process.env.TEST_URL ||
  "http://localhost:4174/symmetrical-carnival/phone-to-today/";
const isDemo = process.env.TEST_STORY === "demo";
const engine = process.env.TEST_ENGINE || "chromium";
const browser = await (engine === "webkit"
  ? webkit.launch()
  : chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    }));
const report = {
  url,
  engine,
  browser: browser.version(),
  story: isDemo ? "demo" : "private",
  viewports: [],
  accessibility: [],
  checks: [],
  errors: [],
};
await mkdir("qa/v2", { recursive: true });
try {
  for (const colorScheme of ["light", "dark"])
    for (const [width, height] of [
      [320, 568],
      [360, 640],
      [390, 844],
      [430, 932],
      [768, 1024],
      [844, 390],
      [1440, 1000],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height },
        colorScheme,
        reducedMotion: "reduce",
        isMobile: width < 768,
        hasTouch: width < 768,
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => report.errors.push(e.message));
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
        `${width} overflow`,
      );
      if (!isDemo) {
        const expected = `meeting-date${colorScheme === "dark" ? "-dark" : ""}${width < 768 ? "-mobile" : ""}.webp`;
        assert(
          (
            await page.locator(".still-media img").evaluate((n) => n.currentSrc)
          ).endsWith(expected),
          "theme-specific date image",
        );
      }
      assert(
        await page
          .locator(".night-photo img")
          .evaluate((n) =>
            n.currentSrc.endsWith(
              innerWidth < 768
                ? "night-still-life-wide-mobile.webp"
                : "night-still-life.webp",
            ),
          ),
        "dedicated mobile photograph",
      );
      assert.equal(
        await page.evaluate(
          () => getComputedStyle(document.body).backgroundColor,
        ),
        colorScheme === "dark" ? "rgb(8, 8, 10)" : "rgb(245, 245, 247)",
      );
      assert(
        await page
          .locator("[data-reveal]")
          .evaluateAll((nodes) =>
            nodes.every((n) => getComputedStyle(n).opacity === "1"),
          ),
      );
      assert(
        await page
          .locator("[data-focus-reveal]")
          .evaluateAll((nodes) =>
            nodes.every((n) => getComputedStyle(n).filter === "none"),
          ),
      );
      const button = await page.locator(".enter-button").boundingBox();
      assert(button.height >= 44);
      if (height >= 568)
        assert(button.y + button.height <= height, `entry visible ${width}`);
      await page.locator(".enter-button").click();
      assert.equal(
        await page.evaluate(() => document.activeElement.id),
        "night-title",
      );
      const size = await page.locator(".night-feature").boundingBox();
      const themes = page.locator(".theme-buttons button");
      for (let i = 0; i < (await themes.count()); i++) {
        await themes.nth(i).click();
        assert.equal(await themes.nth(i).getAttribute("aria-pressed"), "true");
        const after = await page.locator(".night-feature").boundingBox();
        assert(
          Math.abs(after.height - size.height) < 1,
          "theme switch preserves height",
        );
      }
      await page.getByRole("button", { name: "一起准备", exact: true }).click();
      assert.equal(
        await page.locator(".ready-button").getAttribute("aria-pressed"),
        "true",
      );
      await page
        .getByRole("button", { name: "再准备一次", exact: true })
        .click();
      assert.equal(
        await page.locator(".ready-button").getAttribute("aria-pressed"),
        "false",
      );
      const summary = page.locator("summary");
      await summary.focus();
      await page.keyboard.press("Enter");
      assert.equal(await page.locator("details").getAttribute("open"), "");
      if (!isDemo) {
        assert(
          (await page.locator("#weekend-title").innerText()).includes(
            "周末记得陪我聊天",
          ),
        );
        assert(
          (await page.locator(".final-blessing").textContent()).includes(
            "以后能不能考上娄底三中",
          ),
        );
        assert(
          (await page.locator(".letter-body").textContent()).includes(
            "中考还在前面",
          ),
        );
      } else {
        assert(await page.locator(".demo-label").isVisible());
        assert.equal(await page.locator("#weekend-note").count(), 0);
        assert(
          !/罗琛尧|娄底三中|邵阳|100 块/.test(
            await page.locator("body").textContent(),
          ),
        );
      }
      await page.setViewportSize({ width: height, height: width });
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        height,
        "rotation",
      );
      await page.setViewportSize({ width, height });
      if (width === 390) {
        await page.emulateMedia({
          colorScheme: colorScheme === "dark" ? "light" : "dark",
        });
        assert.equal(
          await page.locator(".ready-button").getAttribute("aria-pressed"),
          "false",
        );
        await page.emulateMedia({ colorScheme });
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        report.accessibility.push({
          colorScheme,
          violations: axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
        assert.equal(
          axe.violations.length,
          0,
          JSON.stringify(report.accessibility),
        );
        await page
          .locator("#beginning")
          .evaluate((n) => n.scrollIntoView({ behavior: "instant" }));
        await page.screenshot({
          path: `qa/v2/${isDemo ? "demo" : "private"}-${colorScheme}-cover.png`,
        });
        for (const s of [
          ".night-feature",
          ".duo-stage",
          ".arrival-poster",
          "#letter",
        ])
          await page
            .locator(s)
            .screenshot({
              path: `qa/v2/${isDemo ? "demo" : "private"}-${colorScheme}-${s.replace(/[#.]/g, "")}.png`,
            });
      }
      report.viewports.push({ width, height, colorScheme, passed: true });
      await context.close();
    }
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (text) => (window.__copied = text) },
      configurable: true,
    });
  });
  await page.goto(url);
  await page.getByRole("button", { name: "分享这份回忆" }).click();
  assert.equal(
    await page.locator('[role="status"]').innerText(),
    "链接已复制，可以发给你了。",
  );
  assert.equal(await page.evaluate(() => window.__copied), url);
  await page.evaluate(
    () =>
      (navigator.clipboard.writeText = async () => {
        throw Error("denied");
      }),
  );
  await page.getByRole("button", { name: "分享这份回忆" }).click();
  assert(
    (await page.locator('[role="status"]').innerText()).includes(
      "暂时无法分享",
    ),
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: async () => {
        throw new DOMException("cancelled", "AbortError");
      },
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "分享这份回忆" }).click();
  assert(
    (await page.locator('[role="status"]').innerText()).includes("等你想分享"),
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: async (data) => (window.__shared = data),
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "分享这份回忆" }).click();
  assert.equal((await page.evaluate(() => window.__shared)).url, url);
  report.checks.push("clipboard success/denial, native share/cancel");
  await page.close();
  const fallback = await browser.newPage({
    viewport: { width: 320, height: 568 },
    reducedMotion: "reduce",
  });
  await fallback.route(/\.(webp|woff2)$/, (r) => r.abort());
  await fallback.goto(url, { waitUntil: "networkidle" });
  assert.equal(await fallback.locator(".night-photo img").count(), 0);
  assert(await fallback.locator(".call-time").isVisible());
  assert.equal(
    await fallback.evaluate(() => document.documentElement.scrollWidth),
    320,
  );
  await fallback.locator(".enter-button").click();
  await fallback.getByRole("button", { name: "一起准备", exact: true }).click();
  assert.equal(
    await fallback.locator(".ready-button").getAttribute("aria-pressed"),
    "true",
  );
  await fallback.close();
  report.checks.push("image/font failure retains reading and interaction");
  const staticPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await staticPage.addInitScript(() => {
    delete window.IntersectionObserver;
  });
  const staticErrors = [];
  staticPage.on("pageerror", (e) => staticErrors.push(e.message));
  await staticPage.goto(url, { waitUntil: "networkidle" });
  assert.deepEqual(staticErrors, []);
  assert(
    await staticPage
      .locator("[data-reveal],[data-memory-card],[data-city-reveal]")
      .evaluateAll((ns) =>
        ns.every((n) => getComputedStyle(n).opacity === "1"),
      ),
  );
  await staticPage.close();
  report.checks.push("missing IntersectionObserver renders static story");
  const large = await browser.newPage({
    viewport: { width: 320, height: 640 },
    reducedMotion: "reduce",
  });
  await large.goto(url);
  await large.addStyleTag({
    content:
      "body { font-size: 200% } h1,h2 {font-size: 3.1rem} .body-copy,.letter-body {font-size: 1.4rem}",
  });
  for (const id of [
    "#beginning",
    "#night-calls",
    "#duo",
    "#today",
    "#letter",
  ]) {
    await large
      .locator(id)
      .evaluate((n) => n.scrollIntoView({ behavior: "instant" }));
    assert.equal(
      await large.evaluate(() => document.documentElement.scrollWidth),
      320,
    );
  }
  await large.close();
  report.checks.push("enlarged text at 320px");
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(
    `qa/v2/${isDemo ? "demo" : "private"}-${engine}-results.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
