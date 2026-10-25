# Third-party notices

版本来自提交的 package-lock.json。未修改任何依赖的源码；本项目原创排版、封面静物意象与分享图不属于下列项目。没有真实私人照片或音频，因此未安装 PhotoSwipe、Lenis、Radix Dialog；小惊喜采用原生 details / summary。未使用外部字体、图片、音频、CDN 或付费 API。

## 直接采用的项目

- React / React DOM：界面与 DOM 渲染，MIT，https://github.com/facebook/react
- Motion：封面轻微位移、局部文字切换与并肩反馈，MIT，https://github.com/motiondivision/motion
- Phosphor Icons：少量统一风格图标，MIT，https://github.com/phosphor-icons/react
- Vite 与 React 插件：静态构建与本地开发，MIT，https://github.com/vitejs/vite
- Tailwind CSS v4 与 Vite 集成：基础样式与布局工具，MIT，https://github.com/tailwindlabs/tailwindcss
- TypeScript：类型检查，Apache-2.0，https://github.com/microsoft/TypeScript
- Playwright：浏览器验证，Apache-2.0，https://github.com/microsoft/playwright
- axe-core / Playwright：无障碍检查，具体 MPL-2.0 / Apache-2.0 见下表，https://github.com/dequelabs/axe-core
- Lighthouse：实验室性能审计，Apache-2.0，https://github.com/GoogleChrome/lighthouse

## 完整锁定依赖清单与原始许可证

原始 LICENSE / NOTICE 文本保留在 licenses/。不同依赖使用不同许可证，不将所有源码可见项目归为 MIT。

| 项目 | 锁定版本 | 许可证 | 用途 | 仓库 | 原始文本 |
| --- | --- | --- | --- | --- | --- |
| @axe-core/playwright | 4.14.0 | MPL-2.0 | 开发 / 构建 / 验证 | https://github.com/dequelabs/axe-core-npm.git | [axe-core__playwright-4.14.0-LICENSE](licenses/axe-core__playwright-4.14.0-LICENSE) |
| @formatjs/ecma402-abstract | 2.3.6 | MIT | 开发 / 构建 / 验证 | git@github.com:formatjs/formatjs.git | [formatjs__ecma402-abstract-2.3.6-LICENSE.md](licenses/formatjs__ecma402-abstract-2.3.6-LICENSE.md) |
| @formatjs/fast-memoize | 2.2.7 | MIT | 开发 / 构建 / 验证 | formatjs/formatjs.git | [formatjs__fast-memoize-2.2.7-LICENSE.md](licenses/formatjs__fast-memoize-2.2.7-LICENSE.md) |
| @formatjs/icu-messageformat-parser | 2.11.4 | MIT | 开发 / 构建 / 验证 | https://github.com/formatjs/formatjs.git | [formatjs__icu-messageformat-parser-2.11.4-LICENSE.md](licenses/formatjs__icu-messageformat-parser-2.11.4-LICENSE.md) |
| @formatjs/icu-skeleton-parser | 1.8.16 | MIT | 开发 / 构建 / 验证 | https://github.com/formatjs/formatjs.git | [formatjs__icu-skeleton-parser-1.8.16-LICENSE.md](licenses/formatjs__icu-skeleton-parser-1.8.16-LICENSE.md) |
| @formatjs/intl-localematcher | 0.6.2 | MIT | 开发 / 构建 / 验证 | formatjs/formatjs.git | [formatjs__intl-localematcher-0.6.2-LICENSE.md](licenses/formatjs__intl-localematcher-0.6.2-LICENSE.md) |
| @jridgewell/gen-mapping | 0.3.13 | MIT | 开发 / 构建 / 验证 | https://github.com/jridgewell/sourcemaps.git | [jridgewell__gen-mapping-0.3.13-LICENSE](licenses/jridgewell__gen-mapping-0.3.13-LICENSE) |
| @jridgewell/remapping | 2.3.5 | MIT | 开发 / 构建 / 验证 | https://github.com/jridgewell/sourcemaps.git | [jridgewell__remapping-2.3.5-LICENSE](licenses/jridgewell__remapping-2.3.5-LICENSE) |
| @jridgewell/resolve-uri | 3.1.2 | MIT | 开发 / 构建 / 验证 | https://github.com/jridgewell/resolve-uri | [jridgewell__resolve-uri-3.1.2-LICENSE](licenses/jridgewell__resolve-uri-3.1.2-LICENSE) |
| @jridgewell/sourcemap-codec | 1.6.0 | MIT | 开发 / 构建 / 验证 | https://github.com/jridgewell/sourcemaps.git | [jridgewell__sourcemap-codec-1.6.0-LICENSE](licenses/jridgewell__sourcemap-codec-1.6.0-LICENSE) |
| @jridgewell/trace-mapping | 0.3.31 | MIT | 开发 / 构建 / 验证 | https://github.com/jridgewell/sourcemaps.git | [jridgewell__trace-mapping-0.3.31-LICENSE](licenses/jridgewell__trace-mapping-0.3.31-LICENSE) |
| @opentelemetry/api | 1.9.1 | Apache-2.0 | 开发 / 构建 / 验证 | open-telemetry/opentelemetry-js | [opentelemetry__api-1.9.1-LICENSE](licenses/opentelemetry__api-1.9.1-LICENSE) |
| @opentelemetry/api-logs | 0.220.0 | Apache-2.0 | 开发 / 构建 / 验证 | open-telemetry/opentelemetry-js | [opentelemetry__api-logs-0.220.0-LICENSE](licenses/opentelemetry__api-logs-0.220.0-LICENSE) |
| @opentelemetry/core | 2.12.0 | Apache-2.0 | 开发 / 构建 / 验证 | open-telemetry/opentelemetry-js | [opentelemetry__core-2.12.0-LICENSE](licenses/opentelemetry__core-2.12.0-LICENSE) |
| @opentelemetry/instrumentation | 0.220.0 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/open-telemetry/opentelemetry-js.git | [opentelemetry__instrumentation-0.220.0-LICENSE](licenses/opentelemetry__instrumentation-0.220.0-LICENSE) |
| @opentelemetry/resources | 2.12.0 | Apache-2.0 | 开发 / 构建 / 验证 | open-telemetry/opentelemetry-js | [opentelemetry__resources-2.12.0-LICENSE](licenses/opentelemetry__resources-2.12.0-LICENSE) |
| @opentelemetry/sdk-trace | 2.12.0 | Apache-2.0 | 开发 / 构建 / 验证 | open-telemetry/opentelemetry-js | [opentelemetry__sdk-trace-2.12.0-LICENSE](licenses/opentelemetry__sdk-trace-2.12.0-LICENSE) |
| @opentelemetry/sdk-trace-base | 2.12.0 | Apache-2.0 | 开发 / 构建 / 验证 | open-telemetry/opentelemetry-js | [opentelemetry__sdk-trace-base-2.12.0-LICENSE](licenses/opentelemetry__sdk-trace-base-2.12.0-LICENSE) |
| @opentelemetry/semantic-conventions | 1.43.0 | Apache-2.0 | 开发 / 构建 / 验证 | open-telemetry/opentelemetry-js | [opentelemetry__semantic-conventions-1.43.0-LICENSE](licenses/opentelemetry__semantic-conventions-1.43.0-LICENSE) |
| @oxc-project/types | 0.155.0 | MIT | 开发 / 构建 / 验证 | https://github.com/oxc-project/oxc.git | [oxc-project__types-0.155.0-LICENSE](licenses/oxc-project__types-0.155.0-LICENSE) |
| @paulirish/trace_engine | 0.0.65 | BSD-3-Clause | 开发 / 构建 / 验证 |  | [paulirish__trace_engine-0.0.65-LICENSE](licenses/paulirish__trace_engine-0.0.65-LICENSE) |
| @phosphor-icons/react | 2.1.10 | MIT | 运行时或其依赖 | phosphor-icons/react | [phosphor-icons__react-2.1.10-LICENSE](licenses/phosphor-icons__react-2.1.10-LICENSE) |
| @playwright/test | 1.64.1 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/microsoft/playwright.git | [playwright__test-1.64.1-LICENSE](licenses/playwright__test-1.64.1-LICENSE), [playwright__test-1.64.1-NOTICE](licenses/playwright__test-1.64.1-NOTICE) |
| @puppeteer/browsers | 3.2.6 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/puppeteer/puppeteer/tree/main/packages/browsers | 见上游仓库 |
| @rolldown/binding-linux-x64-gnu | 1.2.15 | MIT | 开发 / 构建 / 验证 | https://github.com/rolldown/rolldown.git | 见上游仓库 |
| @rolldown/pluginutils | 1.0.1 | MIT | 开发 / 构建 / 验证 | https://github.com/rolldown/plugins.git | [rolldown__pluginutils-1.0.1-LICENSE](licenses/rolldown__pluginutils-1.0.1-LICENSE) |
| @sentry/conventions | 0.16.0 | MIT | 开发 / 构建 / 验证 | https://github.com/getsentry/sentry-conventions.git | [sentry__conventions-0.16.0-LICENSE](licenses/sentry__conventions-0.16.0-LICENSE) |
| @sentry/core | 10.76.2 | MIT | 开发 / 构建 / 验证 | git://github.com/getsentry/sentry-javascript.git | [sentry__core-10.76.2-LICENSE](licenses/sentry__core-10.76.2-LICENSE) |
| @sentry/node | 10.76.2 | MIT | 开发 / 构建 / 验证 | git://github.com/getsentry/sentry-javascript.git | [sentry__node-10.76.2-LICENSE](licenses/sentry__node-10.76.2-LICENSE) |
| @sentry/node-core | 10.76.2 | MIT | 开发 / 构建 / 验证 | git://github.com/getsentry/sentry-javascript.git | [sentry__node-core-10.76.2-LICENSE](licenses/sentry__node-core-10.76.2-LICENSE) |
| @sentry/opentelemetry | 10.76.2 | MIT | 开发 / 构建 / 验证 | git://github.com/getsentry/sentry-javascript.git | [sentry__opentelemetry-10.76.2-LICENSE](licenses/sentry__opentelemetry-10.76.2-LICENSE) |
| @sentry/server-utils | 10.76.2 | MIT | 开发 / 构建 / 验证 | git://github.com/getsentry/sentry-javascript.git | 见上游仓库 |
| @tailwindcss/node | 4.3.3 | MIT | 开发 / 构建 / 验证 | https://github.com/tailwindlabs/tailwindcss.git | [tailwindcss__node-4.3.3-LICENSE](licenses/tailwindcss__node-4.3.3-LICENSE) |
| @tailwindcss/oxide | 4.3.3 | MIT | 开发 / 构建 / 验证 | https://github.com/tailwindlabs/tailwindcss.git | [tailwindcss__oxide-4.3.3-LICENSE](licenses/tailwindcss__oxide-4.3.3-LICENSE) |
| @tailwindcss/oxide-linux-x64-gnu | 4.3.3 | MIT | 开发 / 构建 / 验证 | https://github.com/tailwindlabs/tailwindcss.git | [tailwindcss__oxide-linux-x64-gnu-4.3.3-LICENSE](licenses/tailwindcss__oxide-linux-x64-gnu-4.3.3-LICENSE) |
| @tailwindcss/vite | 4.3.3 | MIT | 开发 / 构建 / 验证 | https://github.com/tailwindlabs/tailwindcss.git | [tailwindcss__vite-4.3.3-LICENSE](licenses/tailwindcss__vite-4.3.3-LICENSE) |
| @types/node | 26.6.5 | MIT | 开发 / 构建 / 验证 | https://github.com/DefinitelyTyped/DefinitelyTyped.git | [types__node-26.6.5-LICENSE](licenses/types__node-26.6.5-LICENSE) |
| @types/react | 19.3.0 | MIT | 开发 / 构建 / 验证 | https://github.com/DefinitelyTyped/DefinitelyTyped.git | [types__react-19.3.0-LICENSE](licenses/types__react-19.3.0-LICENSE) |
| @types/react-dom | 19.3.0 | MIT | 开发 / 构建 / 验证 | https://github.com/DefinitelyTyped/DefinitelyTyped.git | [types__react-dom-19.3.0-LICENSE](licenses/types__react-dom-19.3.0-LICENSE) |
| @typescript/typescript-linux-x64 | 7.0.2 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/microsoft/TypeScript.git | [typescript__typescript-linux-x64-7.0.2-LICENSE](licenses/typescript__typescript-linux-x64-7.0.2-LICENSE), [typescript__typescript-linux-x64-7.0.2-NOTICE.txt](licenses/typescript__typescript-linux-x64-7.0.2-NOTICE.txt) |
| @vitejs/plugin-react | 6.1.2 | MIT | 开发 / 构建 / 验证 | https://github.com/vitejs/vite-plugin-react.git | [vitejs__plugin-react-6.1.2-LICENSE](licenses/vitejs__plugin-react-6.1.2-LICENSE) |
| ajv | 8.20.0 | MIT | 开发 / 构建 / 验证 | ajv-validator/ajv | [ajv-8.20.0-LICENSE](licenses/ajv-8.20.0-LICENSE) |
| ajv-formats | 3.0.1 | MIT | 开发 / 构建 / 验证 | https://github.com/ajv-validator/ajv-formats.git | [ajv-formats-3.0.1-LICENSE](licenses/ajv-formats-3.0.1-LICENSE) |
| ansi-colors | 4.1.3 | MIT | 开发 / 构建 / 验证 | doowb/ansi-colors | [ansi-colors-4.1.3-LICENSE](licenses/ansi-colors-4.1.3-LICENSE) |
| ansi-regex | 5.0.1 | MIT | 开发 / 构建 / 验证 | chalk/ansi-regex | [ansi-regex-5.0.1-license](licenses/ansi-regex-5.0.1-license) |
| ansi-regex | 6.4.0 | MIT | 开发 / 构建 / 验证 | chalk/ansi-regex | [ansi-regex-6.4.0-license](licenses/ansi-regex-6.4.0-license) |
| ansi-styles | 4.3.0 | MIT | 开发 / 构建 / 验证 | chalk/ansi-styles | [ansi-styles-4.3.0-license](licenses/ansi-styles-4.3.0-license) |
| ansi-styles | 6.2.3 | MIT | 开发 / 构建 / 验证 | chalk/ansi-styles | [ansi-styles-6.2.3-license](licenses/ansi-styles-6.2.3-license) |
| atomically | 2.1.1 | MIT | 开发 / 构建 / 验证 | github:fabiospampinato/atomically | [atomically-2.1.1-license](licenses/atomically-2.1.1-license) |
| axe-core | 4.14.0 | MPL-2.0 | 开发 / 构建 / 验证 | https://github.com/dequelabs/axe-core.git | [axe-core-4.14.0-LICENSE](licenses/axe-core-4.14.0-LICENSE), [axe-core-4.14.0-LICENSE-3RD-PARTY.txt](licenses/axe-core-4.14.0-LICENSE-3RD-PARTY.txt) |
| chrome-launcher | 1.2.2 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/GoogleChrome/chrome-launcher.git | [chrome-launcher-1.2.2-LICENSE](licenses/chrome-launcher-1.2.2-LICENSE) |
| chromium-bidi | 157.0.8090-0 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/GoogleChromeLabs/chromium-bidi.git | [chromium-bidi-157.0.8090-0-LICENSE](licenses/chromium-bidi-157.0.8090-0-LICENSE) |
| cjs-module-lexer | 2.3.0 | MIT | 开发 / 构建 / 验证 | https://github.com/nodejs/cjs-module-lexer.git | [cjs-module-lexer-2.3.0-LICENSE](licenses/cjs-module-lexer-2.3.0-LICENSE) |
| cliui | 8.0.1 | ISC | 开发 / 构建 / 验证 | yargs/cliui | [cliui-8.0.1-LICENSE.txt](licenses/cliui-8.0.1-LICENSE.txt) |
| cliui | 9.0.1 | ISC | 开发 / 构建 / 验证 | yargs/cliui | [cliui-9.0.1-LICENSE.txt](licenses/cliui-9.0.1-LICENSE.txt) |
| color-convert | 2.0.1 | MIT | 开发 / 构建 / 验证 | Qix-/color-convert | [color-convert-2.0.1-LICENSE](licenses/color-convert-2.0.1-LICENSE) |
| color-name | 1.1.4 | MIT | 开发 / 构建 / 验证 | git@github.com:colorjs/color-name.git | [color-name-1.1.4-LICENSE](licenses/color-name-1.1.4-LICENSE) |
| configstore | 7.1.0 | BSD-2-Clause | 开发 / 构建 / 验证 | sindresorhus/configstore | [configstore-7.1.0-license](licenses/configstore-7.1.0-license) |
| csp_evaluator | 1.1.8 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/google/csp-evaluator.git | [csp_evaluator-1.1.8-LICENSE](licenses/csp_evaluator-1.1.8-LICENSE) |
| csstype | 3.2.3 | MIT | 开发 / 构建 / 验证 | https://github.com/frenic/csstype | [csstype-3.2.3-LICENSE](licenses/csstype-3.2.3-LICENSE) |
| debug | 4.4.3 | MIT | 开发 / 构建 / 验证 | git://github.com/debug-js/debug.git | [debug-4.4.3-LICENSE](licenses/debug-4.4.3-LICENSE) |
| decimal.js | 10.6.0 | MIT | 开发 / 构建 / 验证 | https://github.com/MikeMcl/decimal.js.git | [decimal.js-10.6.0-LICENCE.md](licenses/decimal.js-10.6.0-LICENCE.md) |
| define-lazy-prop | 2.0.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/define-lazy-prop | [define-lazy-prop-2.0.0-license](licenses/define-lazy-prop-2.0.0-license) |
| detect-libc | 2.1.2 | Apache-2.0 | 开发 / 构建 / 验证 | git://github.com/lovell/detect-libc.git | [detect-libc-2.1.2-LICENSE](licenses/detect-libc-2.1.2-LICENSE) |
| devtools-protocol | 0.0.1687809 | BSD-3-Clause | 开发 / 构建 / 验证 | https://github.com/ChromeDevTools/devtools-protocol | [devtools-protocol-0.0.1687809-LICENSE](licenses/devtools-protocol-0.0.1687809-LICENSE) |
| devtools-protocol | 0.0.1704951 | BSD-3-Clause | 开发 / 构建 / 验证 | https://github.com/ChromeDevTools/devtools-protocol | [devtools-protocol-0.0.1704951-LICENSE](licenses/devtools-protocol-0.0.1704951-LICENSE) |
| dot-prop | 9.0.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/dot-prop | [dot-prop-9.0.0-license](licenses/dot-prop-9.0.0-license) |
| emoji-regex | 10.6.0 | MIT | 开发 / 构建 / 验证 | https://github.com/mathiasbynens/emoji-regex.git | [emoji-regex-10.6.0-LICENSE-MIT.txt](licenses/emoji-regex-10.6.0-LICENSE-MIT.txt) |
| emoji-regex | 8.0.0 | MIT | 开发 / 构建 / 验证 | https://github.com/mathiasbynens/emoji-regex.git | [emoji-regex-8.0.0-LICENSE-MIT.txt](licenses/emoji-regex-8.0.0-LICENSE-MIT.txt) |
| enhanced-resolve | 5.26.0 | MIT | 开发 / 构建 / 验证 | https://github.com/webpack/enhanced-resolve.git | [enhanced-resolve-5.26.0-LICENSE](licenses/enhanced-resolve-5.26.0-LICENSE) |
| enquirer | 2.4.1 | MIT | 开发 / 构建 / 验证 | enquirer/enquirer | [enquirer-2.4.1-LICENSE](licenses/enquirer-2.4.1-LICENSE) |
| es-module-lexer | 3.0.4 | MIT | 开发 / 构建 / 验证 | https://github.com/guybedford/es-module-lexer.git | [es-module-lexer-3.0.4-LICENSE](licenses/es-module-lexer-3.0.4-LICENSE) |
| escalade | 3.2.0 | MIT | 开发 / 构建 / 验证 | lukeed/escalade | [escalade-3.2.0-license](licenses/escalade-3.2.0-license) |
| escape-string-regexp | 4.0.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/escape-string-regexp | [escape-string-regexp-4.0.0-license](licenses/escape-string-regexp-4.0.0-license) |
| fast-deep-equal | 3.1.3 | MIT | 开发 / 构建 / 验证 | https://github.com/epoberezkin/fast-deep-equal.git | [fast-deep-equal-3.1.3-LICENSE](licenses/fast-deep-equal-3.1.3-LICENSE) |
| fast-uri | 3.1.9 | BSD-3-Clause | 开发 / 构建 / 验证 | https://github.com/fastify/fast-uri.git | [fast-uri-3.1.9-LICENSE](licenses/fast-uri-3.1.9-LICENSE) |
| fdir | 6.5.0 | MIT | 开发 / 构建 / 验证 | https://github.com/thecodrr/fdir.git | [fdir-6.5.0-LICENSE](licenses/fdir-6.5.0-LICENSE) |
| framer-motion | 14.6.0 | MIT | 运行时或其依赖 | https://github.com/motiondivision/motion/ | [framer-motion-14.6.0-LICENSE.md](licenses/framer-motion-14.6.0-LICENSE.md) |
| get-caller-file | 2.0.5 | ISC | 开发 / 构建 / 验证 | https://github.com/stefanpenner/get-caller-file.git | [get-caller-file-2.0.5-LICENSE.md](licenses/get-caller-file-2.0.5-LICENSE.md) |
| get-east-asian-width | 1.7.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/get-east-asian-width | [get-east-asian-width-1.7.0-license](licenses/get-east-asian-width-1.7.0-license) |
| graceful-fs | 4.2.11 | ISC | 开发 / 构建 / 验证 | https://github.com/isaacs/node-graceful-fs | [graceful-fs-4.2.11-LICENSE](licenses/graceful-fs-4.2.11-LICENSE) |
| http-link-header | 1.1.4 | MIT | 开发 / 构建 / 验证 | https://codeberg.org/jhermsmeier/node-http-link-header.git | [http-link-header-1.1.4-LICENSE.md](licenses/http-link-header-1.1.4-LICENSE.md) |
| image-ssim | 0.2.0 | MIT | 开发 / 构建 / 验证 | darosh/image-ssim-js | [image-ssim-0.2.0-LICENSE](licenses/image-ssim-0.2.0-LICENSE) |
| import-in-the-middle | 3.5.2 | Apache-2.0 | 开发 / 构建 / 验证 | ssh://git@github.com/nodejs/import-in-the-middle.git | [import-in-the-middle-3.5.2-LICENSE](licenses/import-in-the-middle-3.5.2-LICENSE), [import-in-the-middle-3.5.2-LICENSE-3rdparty.csv](licenses/import-in-the-middle-3.5.2-LICENSE-3rdparty.csv), [import-in-the-middle-3.5.2-NOTICE](licenses/import-in-the-middle-3.5.2-NOTICE) |
| intl-messageformat | 10.7.18 | BSD-3-Clause | 开发 / 构建 / 验证 | git@github.com:formatjs/formatjs.git | [intl-messageformat-10.7.18-LICENSE.md](licenses/intl-messageformat-10.7.18-LICENSE.md) |
| is-docker | 2.2.1 | MIT | 开发 / 构建 / 验证 | sindresorhus/is-docker | [is-docker-2.2.1-license](licenses/is-docker-2.2.1-license) |
| is-fullwidth-code-point | 3.0.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/is-fullwidth-code-point | [is-fullwidth-code-point-3.0.0-license](licenses/is-fullwidth-code-point-3.0.0-license) |
| is-wsl | 2.2.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/is-wsl | [is-wsl-2.2.0-license](licenses/is-wsl-2.2.0-license) |
| jiti | 2.7.0 | MIT | 开发 / 构建 / 验证 | unjs/jiti | [jiti-2.7.0-LICENSE](licenses/jiti-2.7.0-LICENSE) |
| jpeg-js | 0.4.4 | BSD-3-Clause | 开发 / 构建 / 验证 | https://github.com/eugeneware/jpeg-js | [jpeg-js-0.4.4-LICENSE](licenses/jpeg-js-0.4.4-LICENSE) |
| js-library-detector | 6.7.0 | MIT | 开发 / 构建 / 验证 | https://github.com/johnmichel/Library-Detector-for-Chrome.git | [js-library-detector-6.7.0-LICENSE](licenses/js-library-detector-6.7.0-LICENSE) |
| json-schema-traverse | 1.0.0 | MIT | 开发 / 构建 / 验证 | https://github.com/epoberezkin/json-schema-traverse.git | [json-schema-traverse-1.0.0-LICENSE](licenses/json-schema-traverse-1.0.0-LICENSE) |
| legacy-javascript | 0.0.4 | Apache-2.0 | 开发 / 构建 / 验证 | GoogleChrome/lighthouse | 见上游仓库 |
| lighthouse | 13.5.0 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/GoogleChrome/lighthouse.git | [lighthouse-13.5.0-LICENSE](licenses/lighthouse-13.5.0-LICENSE) |
| lighthouse-logger | 2.0.2 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/GoogleChrome/lighthouse.git | [lighthouse-logger-2.0.2-LICENSE](licenses/lighthouse-logger-2.0.2-LICENSE) |
| lighthouse-stack-packs | 1.12.3 | Apache-2.0 | 开发 / 构建 / 验证 | GoogleChrome/lighthouse-stack-packs | [lighthouse-stack-packs-1.12.3-LICENSE](licenses/lighthouse-stack-packs-1.12.3-LICENSE) |
| lightningcss | 1.32.0 | MPL-2.0 | 开发 / 构建 / 验证 | https://github.com/parcel-bundler/lightningcss.git | [lightningcss-1.32.0-LICENSE](licenses/lightningcss-1.32.0-LICENSE) |
| lightningcss | 1.33.0 | MPL-2.0 | 开发 / 构建 / 验证 | https://github.com/parcel-bundler/lightningcss.git | [lightningcss-1.33.0-LICENSE](licenses/lightningcss-1.33.0-LICENSE) |
| lightningcss-linux-x64-gnu | 1.32.0 | MPL-2.0 | 开发 / 构建 / 验证 | https://github.com/parcel-bundler/lightningcss.git | [lightningcss-linux-x64-gnu-1.32.0-LICENSE](licenses/lightningcss-linux-x64-gnu-1.32.0-LICENSE) |
| lightningcss-linux-x64-gnu | 1.33.0 | MPL-2.0 | 开发 / 构建 / 验证 | https://github.com/parcel-bundler/lightningcss.git | [lightningcss-linux-x64-gnu-1.33.0-LICENSE](licenses/lightningcss-linux-x64-gnu-1.33.0-LICENSE) |
| lodash-es | 4.18.1 | MIT | 开发 / 构建 / 验证 | lodash/lodash | [lodash-es-4.18.1-LICENSE](licenses/lodash-es-4.18.1-LICENSE) |
| lookup-closest-locale | 6.2.0 | MIT | 开发 / 构建 / 验证 | format-message/format-message | 见上游仓库 |
| magic-string | 0.30.21 | MIT | 开发 / 构建 / 验证 | https://github.com/Rich-Harris/magic-string.git | [magic-string-0.30.21-LICENSE](licenses/magic-string-0.30.21-LICENSE) |
| marky | 1.3.0 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/nolanlawson/marky.git | [marky-1.3.0-LICENSE](licenses/marky-1.3.0-LICENSE) |
| mitt | 3.0.1 | MIT | 开发 / 构建 / 验证 | developit/mitt | [mitt-3.0.1-LICENSE](licenses/mitt-3.0.1-LICENSE) |
| modern-tar | 0.8.6 | MIT | 开发 / 构建 / 验证 | https://github.com/ayuhito/modern-tar.git | [modern-tar-0.8.6-LICENSE](licenses/modern-tar-0.8.6-LICENSE) |
| module-details-from-path | 1.0.4 | MIT | 开发 / 构建 / 验证 | https://github.com/watson/module-details-from-path.git | [module-details-from-path-1.0.4-LICENSE](licenses/module-details-from-path-1.0.4-LICENSE) |
| motion | 14.6.0 | MIT | 运行时或其依赖 | https://github.com/motiondivision/motion | [motion-14.6.0-LICENSE.md](licenses/motion-14.6.0-LICENSE.md) |
| motion-dom | 14.6.0 | MIT | 运行时或其依赖 | https://github.com/motiondivision/motion | [motion-dom-14.6.0-LICENSE.md](licenses/motion-dom-14.6.0-LICENSE.md) |
| motion-utils | 14.6.0 | MIT | 运行时或其依赖 | https://github.com/motiondivision/motion | [motion-utils-14.6.0-LICENSE.md](licenses/motion-utils-14.6.0-LICENSE.md) |
| ms | 2.1.3 | MIT | 开发 / 构建 / 验证 | vercel/ms | [ms-2.1.3-license.md](licenses/ms-2.1.3-license.md) |
| nanoid | 3.3.20 | MIT | 开发 / 构建 / 验证 | ai/nanoid | [nanoid-3.3.20-LICENSE](licenses/nanoid-3.3.20-LICENSE) |
| open | 8.4.2 | MIT | 开发 / 构建 / 验证 | sindresorhus/open | [open-8.4.2-license](licenses/open-8.4.2-license) |
| picocolors | 1.1.1 | ISC | 开发 / 构建 / 验证 | alexeyraspopov/picocolors | [picocolors-1.1.1-LICENSE](licenses/picocolors-1.1.1-LICENSE) |
| picomatch | 4.0.7 | MIT | 开发 / 构建 / 验证 | micromatch/picomatch | [picomatch-4.0.7-LICENSE](licenses/picomatch-4.0.7-LICENSE) |
| playwright | 1.64.1 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/microsoft/playwright.git | [playwright-1.64.1-LICENSE](licenses/playwright-1.64.1-LICENSE), [playwright-1.64.1-NOTICE](licenses/playwright-1.64.1-NOTICE) |
| playwright-core | 1.64.1 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/microsoft/playwright.git | [playwright-core-1.64.1-LICENSE](licenses/playwright-core-1.64.1-LICENSE), [playwright-core-1.64.1-NOTICE](licenses/playwright-core-1.64.1-NOTICE) |
| postcss | 8.5.31 | MIT | 开发 / 构建 / 验证 | postcss/postcss | [postcss-8.5.31-LICENSE](licenses/postcss-8.5.31-LICENSE) |
| puppeteer-core | 25.16.0 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/puppeteer/puppeteer/tree/main/packages/puppeteer-core | 见上游仓库 |
| react | 19.3.1 | MIT | 运行时或其依赖 | https://github.com/react/react.git | [react-19.3.1-LICENSE](licenses/react-19.3.1-LICENSE) |
| react-dom | 19.3.1 | MIT | 运行时或其依赖 | https://github.com/react/react.git | [react-dom-19.3.1-LICENSE](licenses/react-dom-19.3.1-LICENSE) |
| require-directory | 2.1.1 | MIT | 开发 / 构建 / 验证 | git://github.com/troygoode/node-require-directory.git | [require-directory-2.1.1-LICENSE](licenses/require-directory-2.1.1-LICENSE) |
| require-from-string | 2.0.2 | MIT | 开发 / 构建 / 验证 | floatdrop/require-from-string | [require-from-string-2.0.2-license](licenses/require-from-string-2.0.2-license) |
| require-in-the-middle | 8.0.1 | MIT | 开发 / 构建 / 验证 | https://github.com/nodejs/require-in-the-middle.git | [require-in-the-middle-8.0.1-LICENSE](licenses/require-in-the-middle-8.0.1-LICENSE) |
| robots-parser | 3.0.1 | MIT | 开发 / 构建 / 验证 | https://github.com/samclarke/robots-parser.git | [robots-parser-3.0.1-LICENSE.md](licenses/robots-parser-3.0.1-LICENSE.md) |
| rolldown | 1.2.15 | MIT | 开发 / 构建 / 验证 | https://github.com/rolldown/rolldown.git | [rolldown-1.2.15-LICENSE](licenses/rolldown-1.2.15-LICENSE) |
| scheduler | 0.28.0 | MIT | 运行时或其依赖 | https://github.com/react/react.git | [scheduler-0.28.0-LICENSE](licenses/scheduler-0.28.0-LICENSE) |
| source-map-js | 1.2.2 | BSD-3-Clause | 开发 / 构建 / 验证 | 7rulnik/source-map-js | [source-map-js-1.2.2-LICENSE](licenses/source-map-js-1.2.2-LICENSE) |
| speedline-core | 1.4.3 | MIT | 开发 / 构建 / 验证 | https://github.com/paulirish/speedline | 见上游仓库 |
| string-width | 4.2.3 | MIT | 开发 / 构建 / 验证 | sindresorhus/string-width | [string-width-4.2.3-license](licenses/string-width-4.2.3-license) |
| string-width | 7.2.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/string-width | [string-width-7.2.0-license](licenses/string-width-7.2.0-license) |
| string-width | 7.2.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/string-width | [string-width-7.2.0-license](licenses/string-width-7.2.0-license) |
| string-width | 8.3.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/string-width | [string-width-8.3.0-license](licenses/string-width-8.3.0-license) |
| strip-ansi | 6.0.1 | MIT | 开发 / 构建 / 验证 | chalk/strip-ansi | [strip-ansi-6.0.1-license](licenses/strip-ansi-6.0.1-license) |
| strip-ansi | 7.2.0 | MIT | 开发 / 构建 / 验证 | chalk/strip-ansi | [strip-ansi-7.2.0-license](licenses/strip-ansi-7.2.0-license) |
| stubborn-fs | 2.0.0 | MIT | 开发 / 构建 / 验证 | github:fabiospampinato/stubborn-fs | [stubborn-fs-2.0.0-license](licenses/stubborn-fs-2.0.0-license) |
| stubborn-utils | 1.0.2 | MIT | 开发 / 构建 / 验证 | github:fabiospampinato/stubborn-utils | [stubborn-utils-1.0.2-license](licenses/stubborn-utils-1.0.2-license) |
| tailwindcss | 4.3.3 | MIT | 开发 / 构建 / 验证 | https://github.com/tailwindlabs/tailwindcss.git | [tailwindcss-4.3.3-LICENSE](licenses/tailwindcss-4.3.3-LICENSE) |
| tapable | 2.3.3 | MIT | 开发 / 构建 / 验证 | http://github.com/webpack/tapable.git | [tapable-2.3.3-LICENSE](licenses/tapable-2.3.3-LICENSE) |
| third-party-web | 0.30.0 | MIT | 开发 / 构建 / 验证 | https://github.com/patrickhulce/third-party-web.git | [third-party-web-0.30.0-LICENSE](licenses/third-party-web-0.30.0-LICENSE) |
| tinyglobby | 0.2.17 | MIT | 开发 / 构建 / 验证 | https://github.com/SuperchupuDev/tinyglobby.git | [tinyglobby-0.2.17-LICENSE](licenses/tinyglobby-0.2.17-LICENSE) |
| tldts-core | 7.4.19 | MIT | 开发 / 构建 / 验证 | ssh://git@github.com/remusao/tldts.git | [tldts-core-7.4.19-LICENSE](licenses/tldts-core-7.4.19-LICENSE) |
| tldts-icann | 7.4.19 | MIT | 开发 / 构建 / 验证 | ssh://git@github.com/remusao/tldts.git | [tldts-icann-7.4.19-LICENSE](licenses/tldts-icann-7.4.19-LICENSE) |
| tslib | 2.8.1 | 0BSD | 运行时或其依赖 | https://github.com/Microsoft/tslib.git | [tslib-2.8.1-LICENSE.txt](licenses/tslib-2.8.1-LICENSE.txt) |
| type-fest | 4.41.0 | (MIT OR CC0-1.0) | 开发 / 构建 / 验证 | sindresorhus/type-fest | [type-fest-4.41.0-license-cc0](licenses/type-fest-4.41.0-license-cc0), [type-fest-4.41.0-license-mit](licenses/type-fest-4.41.0-license-mit) |
| typed-query-selector | 2.12.3 | MIT | 开发 / 构建 / 验证 | g-plane/typed-query-selector | [typed-query-selector-2.12.3-LICENSE](licenses/typed-query-selector-2.12.3-LICENSE) |
| typescript | 7.0.2 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/microsoft/TypeScript.git | [typescript-7.0.2-LICENSE](licenses/typescript-7.0.2-LICENSE), [typescript-7.0.2-NOTICE.txt](licenses/typescript-7.0.2-NOTICE.txt) |
| undici-types | 8.9.0 | MIT | 开发 / 构建 / 验证 | https://github.com/nodejs/undici.git | [undici-types-8.9.0-LICENSE](licenses/undici-types-8.9.0-LICENSE) |
| vite | 8.3.5 | MIT | 开发 / 构建 / 验证 | https://github.com/vitejs/vite.git | [vite-8.3.5-LICENSE.md](licenses/vite-8.3.5-LICENSE.md) |
| web-features | 3.44.0 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/web-platform-dx/web-features.git | [web-features-3.44.0-LICENSE.txt](licenses/web-features-3.44.0-LICENSE.txt) |
| webdriver-bidi-protocol | 1.0.1 | Apache-2.0 | 开发 / 构建 / 验证 | https://github.com/GoogleChromeLabs/webdriver-bidi-protocol.git | [webdriver-bidi-protocol-1.0.1-LICENSE](licenses/webdriver-bidi-protocol-1.0.1-LICENSE) |
| when-exit | 2.1.5 | MIT | 开发 / 构建 / 验证 | github:fabiospampinato/when-exit | [when-exit-2.1.5-license](licenses/when-exit-2.1.5-license) |
| wrap-ansi | 7.0.0 | MIT | 开发 / 构建 / 验证 | chalk/wrap-ansi | [wrap-ansi-7.0.0-license](licenses/wrap-ansi-7.0.0-license) |
| wrap-ansi | 9.0.2 | MIT | 开发 / 构建 / 验证 | chalk/wrap-ansi | [wrap-ansi-9.0.2-license](licenses/wrap-ansi-9.0.2-license) |
| ws | 7.5.13 | MIT | 开发 / 构建 / 验证 | websockets/ws | [ws-7.5.13-LICENSE](licenses/ws-7.5.13-LICENSE) |
| ws | 8.22.0 | MIT | 开发 / 构建 / 验证 | https://github.com/websockets/ws.git | [ws-8.22.0-LICENSE](licenses/ws-8.22.0-LICENSE) |
| xdg-basedir | 5.1.0 | MIT | 开发 / 构建 / 验证 | sindresorhus/xdg-basedir | [xdg-basedir-5.1.0-license](licenses/xdg-basedir-5.1.0-license) |
| y18n | 5.0.8 | ISC | 开发 / 构建 / 验证 | yargs/y18n | [y18n-5.0.8-LICENSE](licenses/y18n-5.0.8-LICENSE) |
| yargs | 17.7.3 | MIT | 开发 / 构建 / 验证 | https://github.com/yargs/yargs.git | [yargs-17.7.3-LICENSE](licenses/yargs-17.7.3-LICENSE) |
| yargs | 18.2.0 | MIT | 开发 / 构建 / 验证 | https://github.com/yargs/yargs.git | [yargs-18.2.0-LICENSE](licenses/yargs-18.2.0-LICENSE) |
| yargs-parser | 21.1.1 | ISC | 开发 / 构建 / 验证 | https://github.com/yargs/yargs-parser.git | [yargs-parser-21.1.1-LICENSE.txt](licenses/yargs-parser-21.1.1-LICENSE.txt) |
| yargs-parser | 22.0.0 | ISC | 开发 / 构建 / 验证 | https://github.com/yargs/yargs-parser.git | [yargs-parser-22.0.0-LICENSE.txt](licenses/yargs-parser-22.0.0-LICENSE.txt) |
| zod | 4.6.7 | MIT | 开发 / 构建 / 验证 | https://github.com/colinhacks/zod.git | [zod-4.6.7-LICENSE](licenses/zod-4.6.7-LICENSE) |
