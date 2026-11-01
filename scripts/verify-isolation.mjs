import assert from "node:assert/strict";
import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";
import { chromium } from "@playwright/test";
const demo = JSON.parse(await readFile("stories/demo/story.json", "utf8"));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};
const report = [];
await mkdir("customers/qa", { recursive: true });
try {
  for (const variant of ["minimal", "long", "dark"]) {
    const s = structuredClone(demo);
    s.id = `qa-${variant}`;
    if (variant === "minimal") {
      for (const key of ["night", "duo", "meeting", "surprise", "weekend"])
        delete s[key];
      s.letter = [];
    }
    if (variant === "long") {
      s.cover.headline = "从电话那头到今天的长沙".repeat(12);
      s.night.themes[1].lines = [
        "很多话".repeat(35),
        "都能跟你说。".repeat(15),
      ];
      s.meeting.destination = "长沙长沙长沙长沙长沙";
      s.duo.people[0].name = "我的老朋友";
      s.duo.people[1].name = "并肩的你";
    }
    if (variant === "dark") s.theme = "dark";
    const config = `customers/qa/${variant}.json`;
    await writeFile(config, JSON.stringify(s));
    execFileSync("node", ["node_modules/vite/bin/vite.js", "build"], {
      env: { ...process.env, STORY_FILE: config, VITE_BASE_PATH: "/" },
      stdio: "pipe",
    });
    const root = resolve(`dist-v2/${s.id}`);
    const server = createServer(async (req, res) => {
      try {
        const path = resolve(
          root,
          "." + (req.url === "/" ? "/index.html" : req.url.split("?")[0]),
        );
        if (!path.startsWith(root + "/")) throw Error("path");
        res.setHeader(
          "Content-Type",
          mime[extname(path)] || "application/octet-stream",
        );
        res.end(await readFile(path));
      } catch {
        res.statusCode = 404;
        res.end();
      }
    });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    const url = `http://127.0.0.1:${server.address().port}/`;
    try {
      const p = await browser.newPage({
        viewport: { width: 320, height: 640 },
        reducedMotion: "reduce",
        colorScheme: "light",
      });
      await p.goto(url, { waitUntil: "networkidle" });
      assert.equal(
        await p.evaluate(() => document.documentElement.scrollWidth),
        320,
      );
      if (variant === "minimal") {
        assert.equal(await p.locator("main > section").count(), 2);
        await p.locator(".enter-button").click();
        assert.equal(
          await p.evaluate(() => document.activeElement.id),
          "letter-title",
        );
        assert.equal(await p.locator(".site-header nav a").count(), 1);
      }
      if (variant === "long") {
        const before = await p.locator(".night-feature").boundingBox();
        await p.locator(".theme-buttons button").nth(1).click();
        const after = await p.locator(".night-feature").boundingBox();
        assert.equal(before.height, after.height);
        assert.equal(
          await p.evaluate(() => document.documentElement.scrollWidth),
          320,
        );
      }
      if (variant === "long") {
        const sizes = await p
          .locator("[data-memory-card]")
          .evaluateAll((nodes) =>
            nodes.map((node) => {
              const card = node.getBoundingClientRect();
              const name = node.querySelector("span").getBoundingClientRect();
              return { height: card.height, fits: name.bottom < card.bottom };
            }),
          );
        assert(
          sizes.every((s) => s.fits),
          "long names remain inside cards",
        );
        assert(
          Math.abs(sizes[0].height - sizes[1].height) < 1,
          "cards retain a shared height",
        );
      }
      if (variant === "dark")
        assert.equal(
          await p.evaluate(
            () => getComputedStyle(document.body).backgroundColor,
          ),
          "rgb(8, 8, 10)",
        );
      await p.close();
      report.push({ variant, passed: true });
    } finally {
      await new Promise((r) => server.close(r));
    }
  }
  async function scan(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, item.name);
      if (item.isDirectory()) await scan(path);
      else if (/\.(js|html|json|txt)$/.test(item.name)) {
        const text = await readFile(path, "utf8");
        assert(
          !/罗琛尧|娄底三中|邵阳|周末记得陪我聊天/.test(text),
          `private leak in ${path}`,
        );
      }
    }
  }
  await scan("dist-v2/demo");
  const names = await readdir("dist-v2/demo");
  assert(!names.some((n) => /meeting-date|social-preview\.png/.test(n)));
  report.push({ demoPrivateDataAndMediaAbsent: true });
  console.log(JSON.stringify(report, null, 2));
  await writeFile("qa/v2/isolation.json", JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  await rm("customers/qa", { recursive: true, force: true });
}
