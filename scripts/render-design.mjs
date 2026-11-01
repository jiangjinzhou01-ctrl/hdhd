import { chromium } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const url = process.env.TEST_URL || "http://localhost:4175/";
const output = resolve(process.env.REVIEW_DIR || "artifacts/review-demo");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const escape = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
await mkdir(output, { recursive: true });
const fonts = await Promise.all(
  ["regular", "semibold"].map(
    async (weight, i) =>
      `@font-face{font-family:Today;src:url('data:font/woff2;base64,${(await readFile(`public/fonts/today-sans-${weight}.woff2`)).toString("base64")}');font-weight:${i ? 600 : 400}}`,
  ),
);
try {
  for (const colorScheme of ["light", "dark"]) {
    const p = await browser.newPage({
      viewport: { width: 390, height: 844 },
      colorScheme,
      reducedMotion: "reduce",
    });
    await p.goto(url, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const title = await p.title();
    const scenes = [];
    for (const section of await p.locator("main > section").all()) {
      const id = (await section.getAttribute("id")) || `scene-${scenes.length}`;
      const heading = await section
        .locator("h1,h2")
        .first()
        .textContent()
        .catch(() => id);
      const file = resolve(output, `${id}-${colorScheme}.png`);
      await section.screenshot({ path: file });
      scenes.push({ id, title: heading, file });
    }
    await p
      .locator("#beginning")
      .evaluate((n) => n.scrollIntoView({ behavior: "instant" }));
    await p.screenshot({
      path: resolve(output, `mobile-cover-${colorScheme}.png`),
    });
    await p.setViewportSize({ width: 1440, height: 1000 });
    await p.screenshot({
      path: resolve(output, `desktop-cover-${colorScheme}.png`),
    });
    await p.close();
    const board = await browser.newPage({
      viewport: {
        width: Math.max(scenes.length * 350 + 96, 1200),
        height: 1000,
      },
    });
    const figures = await Promise.all(
      scenes.map(
        async (s, i) =>
          `<figure><figcaption>${String(i + 1).padStart(2, "0")} / ${escape(s.title)}</figcaption><img src="data:image/png;base64,${(await readFile(s.file)).toString("base64")}"></figure>`,
      ),
    );
    await board.setContent(
      `<!doctype html><html lang="zh-CN"><style>${fonts.join("")}*{box-sizing:border-box}body{margin:0;padding:48px;background:${colorScheme === "dark" ? "#08080a" : "#f5f5f7"};color:${colorScheme === "dark" ? "#f5f5f7" : "#1d1d1f"};font-family:Today,sans-serif}h1{font-size:36px;font-weight:600;margin:0 0 12px}p{font-size:14px;color:${colorScheme === "dark" ? "#aaaab0" : "#626267"};margin-bottom:40px}.screens{display:grid;grid-template-columns:repeat(${scenes.length},1fr);gap:24px}figure{margin:0}figcaption{font-size:14px;font-weight:600;white-space:pre-line;min-height:60px;margin-bottom:16px}img{width:100%;display:block}</style><h1>${escape(title)} / V2</h1><p>真实浏览器画面 · 390 × 844 · ${colorScheme} · 动态演示另见真实录屏</p><div class="screens">${figures.join("")}</div></html>`,
    );
    await board.evaluate(() => document.fonts.ready);
    await board
      .locator("img")
      .evaluateAll((ns) => Promise.all(ns.map((n) => n.decode())));
    await board.screenshot({
      path: resolve(output, `overview-${colorScheme}.png`),
      fullPage: true,
    });
    await board.close();
  }
  console.log(
    `Reviewed real light/dark scenes at ${output}; V1 artifacts were preserved.`,
  );
} finally {
  await browser.close();
}
