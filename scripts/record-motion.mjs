import { chromium } from "@playwright/test";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
// Public recording defaults to the fictional demo. Private stories require an explicit TEST_URL.
const url = process.env.TEST_URL || "http://localhost:4175/";
const colorScheme = process.env.TEST_SCHEME || "light";
const output = resolve(
  process.env.RECORD_DIR || `artifacts/demo-${colorScheme}`,
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
await mkdir(output, { recursive: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  colorScheme,
  reducedMotion: "no-preference",
  recordVideo: { dir: output, size: { width: 390, height: 844 } },
});
const page = await context.newPage();
const marks = [];
const started = Date.now();
let last = 0;
function mark(label) {
  const now = (Date.now() - started) / 1000;
  marks.push({
    shot: label,
    start: Number(last.toFixed(2)),
    end: Number(now.toFixed(2)),
  });
  last = now;
}
async function show(selector, hold = 1500) {
  await page
    .locator(selector)
    .evaluate((n) => n.scrollIntoView({ behavior: "smooth", block: "center" }));
  await page.waitForTimeout(hold);
}
let video;
try {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2200);
  mark("01-cover");
  await page.locator(".enter-button").tap();
  await page.waitForTimeout(1600);
  mark("02-answer-and-enter");
  await show(".night-feature", 1600);
  await page.locator(".theme-buttons button").nth(1).tap();
  await page.waitForTimeout(1000);
  await page.locator(".theme-buttons button").nth(2).tap();
  await page.waitForTimeout(1000);
  mark("03-memory-and-photograph");
  await show("#duo .chapter-heading", 1300);
  await show(".duo-stage", 1500);
  await page.locator(".ready-button").tap();
  await page.waitForTimeout(1100);
  await page.locator(".ready-button").tap();
  await page.waitForTimeout(950);
  mark("04-together-and-return");
  await show("#meeting-title", 1400);
  await show(".arrival-poster", 1700);
  mark("05-cities");
  if (await page.locator(".small-surprise").count()) {
    await show(".small-surprise", 1000);
    await page.locator("summary").tap();
    await page.waitForTimeout(700);
    mark("06-small-detail");
  }
  await show("#letter-title", 1400);
  for (const p of await page.locator(".letter-body > p").all()) {
    await p.evaluate((n) =>
      n.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
    await page.waitForTimeout(1500);
  }
  await show(".final-blessing", 1900);
  mark("07-letter");
  if (await page.locator("#weekend-note").count())
    await show("#weekend-note", 1600);
  await show(".story-ending", 1500);
  mark("08-ending");
  video = page.video();
  await context.close();
  const original = await video.path();
  const raw = resolve(output, "full-mobile.webm");
  await video.saveAs(raw);
  if (original !== raw) await rm(original, { force: true });
  await writeFile(
    resolve(output, "shots.json"),
    JSON.stringify(
      {
        url,
        colorScheme,
        viewport: { width: 390, height: 844 },
        source: "real Playwright browser interaction recording",
        shots: marks,
      },
      null,
      2,
    ),
  );
  const notes = [
    "# 真实浏览器镜头表",
    "",
    `来源：${url}；${colorScheme}；390 × 844。人物与故事是否为演示，以页面标记为准。`,
    "",
    "原始完整画面：full-mobile.webm。MP4 为同一录屏转码；9:16 版上下留边，保留完整手机画面。没有生成转场。",
    "",
    ...marks.map(
      (m) => `- ${m.shot}: ${m.start}–${m.end}s；独立镜头同名 .mp4。`,
    ),
    "",
    "剪映导入 full-9x16.mp4，按上方区间截取。开场、主题切换、双卡落位可各保留 2–4 秒。",
  ];
  await writeFile(resolve(output, "SHOTS.md"), notes.join("\n"));
  try {
    execFileSync("ffmpeg", [
      "-y",
      "-loglevel",
      "error",
      "-i",
      raw,
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      resolve(output, "full-mobile.mp4"),
    ]);
    // Letterbox the real viewport instead of cropping content or inventing frames.
    execFileSync("ffmpeg", [
      "-y",
      "-loglevel",
      "error",
      "-i",
      raw,
      "-an",
      "-vf",
      `scale=1080:1920:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=${colorScheme === "dark" ? "0x08080a" : "0xf5f5f7"}`,
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      resolve(output, "full-9x16.mp4"),
    ]);
    for (const m of marks)
      execFileSync("ffmpeg", [
        "-y",
        "-loglevel",
        "error",
        "-ss",
        String(m.start),
        "-i",
        resolve(output, "full-mobile.mp4"),
        "-t",
        String(m.end - m.start),
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        resolve(output, `${m.shot}.mp4`),
      ]);
    console.log(`Real video, MP4 and ${marks.length} shots saved to ${output}`);
  } catch (error) {
    console.error(
      `Raw WebM and shot log saved. MP4 conversion incomplete: ${error.message}`,
    );
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
