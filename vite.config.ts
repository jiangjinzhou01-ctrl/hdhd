import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadStoryFiles } from "./scripts/story-files.ts";
import { loadSupplement, codepoint } from "./scripts/lib/font-support.mjs";

const storyFile = resolve(
  process.env.STORY_FILE || "stories/private/story.json",
);
const story = loadStoryFiles(storyFile);
const letterName = JSON.parse(readFileSync(storyFile, "utf8")).letterFile;
const inputs = [
  storyFile,
  ...(letterName ? [resolve(storyFile, "../", letterName)] : []),
];
const supplement = loadSupplement(story);
const base = process.env.VITE_BASE_PATH || "/symmetrical-carnival/phone-to-today/";
if (supplement) console.warn(`Supplemental font glyphs require delivery review: ${supplement.missing.map(codepoint).join(", ")}`);
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const media = [story.cover.art, story.night?.image].filter(Boolean);
const names = new Set(["favicon.svg", "third-party-licenses.txt", "fonts/OFL.txt"]);
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
          )
          .replace(
            "</head>",
            (supplement ? `<style>${[400, 600].map((weight, i) => `@font-face{font-family:'Today Sans';font-weight:${weight};font-style:normal;font-display:swap;src:url('${base}fonts/order-${i ? "semibold" : "regular"}.woff2') format('woff2');unicode-range:${supplement.missing.map(codepoint).join(",")}}`).join("")}</style>` : "") + "</head>",
          );
      },
      generateBundle() {
        this.emitFile({ type: "asset", fileName: ".nojekyll", source: "" });
        if (supplement) for (const weight of ["regular", "semibold"]) this.emitFile({
          type: "asset", fileName: `fonts/order-${weight}.woff2`,
          source: readFileSync(resolve(supplement.directory, `${weight}.woff2`)),
        });
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
