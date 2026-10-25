import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const lock = JSON.parse(await readFile('package-lock.json', 'utf8'))
const rows = []
const runtimeLicenses = ['Third-party software licenses for 电话那头，今天见。\nUnmodified upstream packages; versions are locked in package-lock.json.\n']
await mkdir('licenses', { recursive: true })
for (const [location, entry] of Object.entries(lock.packages)) {
  if (!location || entry.link) continue
  const packagePath = path.join(location, 'package.json')
  let pkg
  try { pkg = JSON.parse(await readFile(packagePath, 'utf8')) } catch { continue }
  const repo = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url || pkg.homepage || ''
  const names = await readdir(location)
  const licenses = names.filter(name => /^(licen[cs]e|copying|notice)(\.|$|-)/i.test(name))
  const saved = []
  for (const name of licenses) {
    const target = `${pkg.name.replaceAll('/', '__').replace('@', '')}-${pkg.version}-${name}`
    try {
      const original = await readFile(path.join(location, name), 'utf8')
      await writeFile(path.join('licenses', target), original)
      saved.push(target)
      if (!entry.dev) runtimeLicenses.push(`\n${pkg.name} ${entry.version} / ${name}\n${repo}\n\n${original}\n`)
    } catch {}
  }
  rows.push(`| ${pkg.name} | ${entry.version} | ${entry.license || pkg.license || '参阅包内许可证'} | ${entry.dev ? '开发 / 构建 / 验证' : '运行时或其依赖'} | ${repo.replace(/^git\+/, '')} | ${saved.map(name => `[${name}](licenses/${name})`).join(', ') || '见上游仓库'} |`)
}
const intro = `# Third-party notices\n\n版本来自提交的 package-lock.json。未修改任何依赖的源码；本项目原创排版、日期雕塑、静物意象与分享图不属于下列项目。没有真实私人照片或音频，因此未安装 PhotoSwipe、Lenis、Radix Dialog；小惊喜采用原生 details / summary。字体子集与静物图片随站点部署，无运行时外部资源请求、音频、CDN 或付费 API。\n\n## 直接采用的项目\n\n- Noto Sans SC 2.004：400 / 600 中文字体子集，修改后族名 Today Sans，SIL OFL 1.1，https://github.com/google/fonts/tree/main/ofl/notosanssc ，原始文本见 licenses/NotoSansSC-OFL.txt。\n- React / React DOM：界面与 DOM 渲染，MIT，https://github.com/facebook/react\n- Motion：首屏、章节滚动、城市揭示与互动反馈，MIT，https://github.com/motiondivision/motion\n- Phosphor Icons：少量统一风格图标，MIT，https://github.com/phosphor-icons/react\n- Vite 与 React 插件：静态构建与本地开发，MIT，https://github.com/vitejs/vite\n- Tailwind CSS v4 与 Vite 集成：基础样式与布局工具，MIT，https://github.com/tailwindlabs/tailwindcss\n- TypeScript：类型检查，Apache-2.0，https://github.com/microsoft/TypeScript\n- Playwright：浏览器验证，Apache-2.0，https://github.com/microsoft/playwright\n- axe-core / Playwright：无障碍检查，具体 MPL-2.0 / Apache-2.0 见下表，https://github.com/dequelabs/axe-core\n- Lighthouse：实验室性能审计，Apache-2.0，https://github.com/GoogleChrome/lighthouse\n\n## 完整锁定依赖清单与原始许可证\n\n原始 LICENSE / NOTICE 文本保留在 licenses/。不同依赖使用不同许可证，不将所有源码可见项目归为 MIT。\n\n| 项目 | 锁定版本 | 许可证 | 用途 | 仓库 | 原始文本 |\n| --- | --- | --- | --- | --- | --- |\n`
await writeFile('THIRD_PARTY_NOTICES.md', intro + rows.sort().join('\n') + '\n')
await writeFile('public/third-party-licenses.txt', runtimeLicenses.join('\n'))
console.log(`Recorded ${rows.length} installed packages and their license files.`)
