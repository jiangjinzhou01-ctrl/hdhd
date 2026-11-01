import { spawn, execFileSync } from "node:child_process";
import { chromium } from "@playwright/test";
const jobs = [];
const chrome = process.env.CHROMIUM_PATH || chromium.executablePath();
const run = (script, env = {}) =>
  execFileSync("node", [script], {
    stdio: "inherit",
    env: { ...process.env, CHROMIUM_PATH: chrome, ...env },
  });
async function serve(port, env = {}) {
  const child = spawn(
    "node",
    [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    { stdio: "ignore", env: { ...process.env, ...env } },
  );
  jobs.push(child);
  const base = env.VITE_BASE_PATH || "/symmetrical-carnival/phone-to-today/";
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw Error("Preview failed");
    try {
      if ((await fetch(`http://127.0.0.1:${port}${base}`)).ok)
        return `http://127.0.0.1:${port}${base}`;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error("Preview timeout");
}
try {
  const privateURL = await serve(4176);
  run("scripts/verify-v2.mjs", { TEST_URL: privateURL });
  run("scripts/verify-motion.mjs", { TEST_URL: privateURL });
  const demoURL = await serve(4177, {
    STORY_FILE: "stories/demo/story.json",
    VITE_BASE_PATH: "/",
  });
  run("scripts/verify-v2.mjs", { TEST_URL: demoURL, TEST_STORY: "demo" });
  run("scripts/verify-isolation.mjs");
} finally {
  for (const child of jobs) child.kill("SIGTERM");
}
