import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { validateStory, type StoryConfig } from "../src/story-schema.ts";

// Customer metadata, letters and media stay in separate local files. Only the
// selected story is assembled during the build; no source JSON is served.
export function loadStoryFiles(file: string): StoryConfig {
  const input = JSON.parse(readFileSync(file, "utf8"));
  if (!input || typeof input !== "object" || Array.isArray(input))
    return validateStory(input);
  if (input.letterFile !== undefined) {
    const name = input.letterFile;
    if (
      typeof name !== "string" ||
      !/^[\w.-]+\.json$/.test(name) ||
      name.includes("..")
    ) {
      throw Error(
        "letterFile: use a JSON filename beside the story configuration",
      );
    }
    const letter = JSON.parse(
      readFileSync(resolve(dirname(file), name), "utf8"),
    );
    if (!letter || typeof letter !== "object" || Array.isArray(letter))
      throw Error("letterFile: expected letter object");
    input.letterIntro = letter.intro;
    input.letter = letter.paragraphs;
    input.blessing = letter.blessing;
    input.weekend = letter.postscript;
    delete input.letterFile;
  }
  return validateStory(input);
}
