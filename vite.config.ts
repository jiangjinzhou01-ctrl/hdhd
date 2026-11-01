import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadStoryFiles } from "./scripts/story-files.ts";

const storyFile = resolve(
  process.env.STORY_FILE || "stories/private/story.json",
);
const story = loadStoryFiles(storyFile);
const letterName = JSON.parse(readFileSync(storyFile, "utf8")).letterFile;
const inputs = [
  storyFile,
  ...(letterName ? [resolve(storyFile, "../", letterName)] : []),
];
const coverage = new Set<number>(
  JSON.parse(readFileSync("src/font-coverage.json", "utf8")),
);
const missing = [
  ...new Set(
    [...JSON.stringify(story)].filter(
      (char) =>
        /[\u3000-\u9fff]/u.test(char) && !coverage.has(char.codePointAt(0)!),
    ),
  ),
];
if (missing.length)
  throw Error(
    `Story has uncovered Chinese glyphs: ${missing.join("")}. Rebuild fonts with STORY_FILE and scripts/subset-fonts.py before delivery.`,
  );
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const media = [story.cover.art, story.night?.image].filter(Boolean);
const names = new Set(["favicon.svg", "third-party-licenses.txt"]);
for (const image of media)
  for (const key of ["src", "mobile", "dark", "darkMobile"] as const)
    if (image?.[key]) names.add(image[key]);
if (story.share.image) names.add(story.share.image);
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "isolated-story",
      resolveId(id) {
        if (id === "virtual:story") return "\0virtual:story";
      },
      load(id) {
        if (id === "\0virtual:story")
          return `export default ${JSON.stringify(story)}`;
      },
      configureServer(server) {
        server.watcher.add(inputs);
        server.middlewares.use((req, res, next) => {
          const name = decodeURIComponent((req.url || "").split("?")[0])
            .replace(server.config.base, "")
            .replace(/^\//, "");
          if (!names.has(name)) return next();
          const customer = resolve(storyFile, "../media", name);
          const file = existsSync(customer)
            ? customer
            : resolve("public", name);
          if (!existsSync(file)) return next();
          res.setHeader(
            "Content-Type",
            name.endsWith(".webp")
              ? "image/webp"
              : name.endsWith(".svg")
                ? "image/svg+xml"
                : name.endsWith(".png")
                  ? "image/png"
                  : /\.jpe?g$/i.test(name)
                    ? "image/jpeg"
                    : name.endsWith(".avif")
                      ? "image/avif"
                      : name.endsWith(".gif")
                        ? "image/gif"
                        : "text/plain",
          );
          res.end(readFileSync(file));
        });
      },
      handleHotUpdate(ctx) {
        if (inputs.includes(ctx.file)) ctx.server.restart();
      },
      transformIndexHtml(html) {
        return html
          .replace(/__TITLE__/g, escape(story.share.title))
          .replace(/__DESCRIPTION__/g, escape(story.opening))
          .replace(
            "<!-- share-image -->",
            story.share.image
              ? `<meta property="og:image" content="${escape(process.env.STORY_ORIGIN || "")}${process.env.VITE_BASE_PATH || "/symmetrical-carnival/phone-to-today/"}${escape(story.share.image)}" />`
              : "",
          )
          .replace(
            "<!-- story-theme -->",
            `<script>document.documentElement.dataset.theme=${JSON.stringify(story.theme)}</script>`,
          );
      },
      generateBundle() {
        // Only authorized media referenced by this build enters its output. Never copy customers/ wholesale.
        for (const name of names) {
          const customer = resolve(storyFile, "../media", name);
          const shared = resolve("public", name);
          const file = existsSync(customer) ? customer : shared;
          if (!existsSync(file)) throw Error(`Missing story asset: ${name}`);
          this.emitFile({
            type: "asset",
            fileName: name,
            source: readFileSync(file),
          });
        }
      },
    },
  ],
  publicDir: false,
  base: process.env.VITE_BASE_PATH || "/symmetrical-carnival/phone-to-today/",
  build: { target: "es2020", outDir: `dist-v2/${story.id}`, emptyOutDir: true },
});
