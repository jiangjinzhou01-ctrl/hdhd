import { loadStoryFiles } from "./story-files.ts";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStory } from "../src/story-schema.ts";
const privateStory = loadStoryFiles("stories/private/story.json");
const demo = loadStoryFiles("stories/demo/story.json");
assert.equal(validateStory(privateStory).weekend.dateISO, "2026-10-28");
assert.equal(validateStory(demo).demo, true);
for (const change of [
  (s) => delete s.title,
  (s) => (s.dateISO = "2026-99-99"),
  (s) => (s.dateISO = "2026-02-30"),
  (s) => (s.night.themes[0].lines = []),
  (s) => (s.duo.people = []),
  (s) => (s.cover.art.src = "../secret"),
  (s) => (s.share.image = "https://unknown.test/a.png"),
  (s) => (s.theme = "purple"),
]) {
  const s = structuredClone(privateStory);
  change(s);
  assert.throws(() => validateStory(s));
}
const minimal = structuredClone(demo);
for (const key of ["night", "duo", "meeting", "surprise", "weekend"])
  minimal[key] = {};
minimal.letter = [];
assert.equal(validateStory(minimal).night, undefined);
const empty = structuredClone(demo);
empty.night.themes = [];
assert.equal(validateStory(empty).night, undefined);
const long = structuredClone(demo);
long.cover.headline = "愿你每天都开心".repeat(30);
assert(validateStory(long));
assert.throws(() => validateStory(null));
console.log(
  "Config: private/demo, required fields, real dates, optional/empty scenes, asset paths, long copy passed.",
);

for (const change of [
  (s) => (s.surprise.mark = {}),
  (s) => (s.blessing[0].emphasis = "yes"),
  (s) => (s.night.themes = [null]),
]) {
  const s = structuredClone(privateStory);
  change(s);
  assert.throws(() => validateStory(s));
}

const directory = mkdtempSync(join(tmpdir(), "story-files-"));
try {
  const file = join(directory, "story.json");
  writeFileSync(
    file,
    JSON.stringify({ ...demo, letterFile: "../private/letter.json" }),
  );
  assert.throws(() => loadStoryFiles(file), /letterFile/);
  writeFileSync(file, JSON.stringify({ ...demo, letterFile: "letter.json" }));
  writeFileSync(
    join(directory, "letter.json"),
    JSON.stringify({
      intro: demo.letterIntro,
      paragraphs: demo.letter,
      blessing: demo.blessing,
    }),
  );
  assert.deepEqual(loadStoryFiles(file).letter, demo.letter);
  assert.equal(loadStoryFiles(file).weekend, undefined);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
console.log("Separated letter assembly and cross-directory rejection passed.");
