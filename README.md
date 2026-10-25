# 电话那头，今天见。

写给罗琛尧的一份私人友情纪念。纪念日期固定为 **2026.10.25**。

- 网站：https://jiangjinzhou01-ctrl.github.io/symmetrical-carnival/phone-to-today/
- 源码：https://github.com/jiangjinzhou01-ctrl/hdhd
- 发布目录：`jiangjinzhou01-ctrl/symmetrical-carnival` 的 `phone-to-today/`，其他原有文件保持原样。

## 运行和构建

需要 Node.js 24 和 npm。

```bash
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

默认 base 为 `/symmetrical-carnival/phone-to-today/`。开发和预览地址在命令输出中给出。构建产物完整保存在 `dist/`，不需要服务端、数据库、账号或付费服务。

如改为独立仓库 Pages：

```bash
VITE_BASE_PATH=/仓库名/ npm run build
```

根域名托管设置 `VITE_BASE_PATH=/`。更换公开地址时同步更新 `index.html` 的 `og:image`。所有运行时资源均随站点部署，无外部字体和 CDN。

## 发布

本次 GitHub 连接允许推送代码，但创建仓库、重命名仓库、启用新 Pages 的请求均返回 403。源码因此使用经确认完全为空的 `hdhd`，成品发布到已经启用 Pages 的托管仓库内的新子目录。没有替换现有站点首页。

更新当前网站需要 Git、GitHub CLI 和拥有对应仓库内容写入权限的已认证会话：

```bash
npm run deploy
```

脚本构建后克隆托管仓库，只更新 `phone-to-today/`，提交并推送。它检查本项目的部署标记，避免覆盖其他目录；GitHub Pages 的现有分支发布机制随后重新构建。发布后检查托管仓库的 `pages-build-deployment` 和线上地址。凭据只由运行环境提供，不写入项目或工作流。

`.github/workflows/check.yml` 在源码推送时自动安装锁定依赖、检查类型并构建。`.github/workflows/deploy.yml` 是独立仓库 GitHub Pages 配置，保留为手动触发：获得 Pages 配置权限后，先在 Settings → Pages 选择 GitHub Actions，再运行它。它按实际仓库名称设置 base。**这份独立站点工作流不是当前子目录网站的发布通道。** 当前网站通过上面的部署脚本更新。

Actions 版本于 2026-10-25 对照 GitHub 官方 Pages 文档及 setup-node 官方仓库确认：checkout v6、setup-node v7、configure-pages v5、upload-pages-artifact v4、deploy-pages v4。

## 内容与结构

- `src/story.ts`：姓名、固定日期、事实与主要文案。
- `src/tokens.css`：夜色、浅色、正文、琥珀色、字体、圆角和层级令牌。
- `src/App.tsx`：五个语义化场景、统一 StoryShell 与 ConnectionPath。
- `src/style.css`：移动端优先排版；360px 到桌面的明确适配。
- `public/social-preview.png`：原创排版分享图，由浏览器渲染生成，不含人物照片。
- `THIRD_PARTY_NOTICES.md`、`licenses/`：锁定版本、上游链接、实际许可证及原文。
- `public/third-party-licenses.txt`：部署时一同提供的运行时依赖原始许可证。
- `QA.md`：验证条件和结果。

连接线使用实际 DOM 锚点和 ResizeObserver 计算；Motion 的 motion values 控制滚动关联，不在每次滚动时触发 React 状态。通话主题使用原生 button 和 aria-pressed；双人准备可以复位；100 元小插曲使用可关闭的原生 details / summary。默认可读，没有音频或照片入口。开启减少动态效果时直接呈现完整静态路径和明亮会面场景。

目前未提供真实照片、语音，所以没有安装 PhotoSwipe、Lenis 或 Radix Dialog。若以后补充素材，需确认真实来源和使用权限，再添加照片预留尺寸、懒加载与动态导入；不使用假合照。

## 验证

先运行预览服务，再在另一个终端运行：

```bash
npm run preview -- --port 4173
npm run test:e2e
```

测试默认使用 `/usr/bin/chromium`；可设置 `CHROMIUM_PATH`。使用 `TEST_URL` 可以测试已经发布的地址。`qa/` 输出各视口顶部、中部、底部截图和 JSON 结果，临时图片不进入源码仓库。

```bash
CHROME_PATH=/usr/bin/chromium npx lighthouse http://localhost:4173/symmetrical-carnival/phone-to-today/ --chrome-flags='--headless --no-sandbox' --output=html --output-path=qa/lighthouse.html
```

该项目的动效和性能评估为 Chromium 模拟，不能替代 Android 真机、微信 / QQ 内置浏览器和国内网络实测。Lighthouse 的 TBT 不是 INP，尚无真实用户 INP 数据。
