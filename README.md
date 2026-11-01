# 电话那头，今天见。— V2

在 V1 `edabe6e` 上升级的私人纪念网站。React 19、TypeScript、Vite 8、motion/react；保留浅灰 / 石墨黑主题、Today Sans 中文字体、原创金属日期和深夜静物意象。

**V2 开发分支：`v2-development`。未发布、未替换现有 GitHub Pages。** 原 `dist/`、V1 的设计图和录屏保留；V2 独立输出到 `dist-v2/<故事 id>/`。

## 运行

Node.js 24，npm。

```bash
npm ci
npm run dev
```

私人原作：`http://localhost:5173/symmetrical-carnival/phone-to-today/`。

```bash
npm run dev:demo
```

虚构友情演示：`http://localhost:5173/`。人物与经历在页面首尾明确标注为演示，不含原作姓名、学校、私人经历与周末留言。

## 构建与生产预览

```bash
npm run build
npm run preview -- --port 4174
# http://localhost:4174/symmetrical-carnival/phone-to-today/

npm run build:demo
npm run preview:demo -- --port 4175
# http://localhost:4175/
```

构建私人版和演示版互不覆盖；构建不会部署。原线上地址维持不变：
https://jiangjinzhou01-ctrl.github.io/symmetrical-carnival/phone-to-today/

## V2 体验

- 点击开场后，封面缩退、日期让位、正文进入；整个转换约 1.2 秒，含标题加载的开场可录制为约 3 秒镜头。滚轮、触摸和阅读按键可立即接管，再次点击直接进入。没有滚动锁定或声音。
- 深夜场景的照片跟随滚动；主题切换同时调整裁切、照片注释与文字。所有回应预留最长内容的高度，减少移动端跳动。
- 两张卡片独立错位进入，点击后靠近并对齐，可完整复位；触摸和键盘均可操作。
- 城市采用静止外框触发的遮罩揭示、轻视差、日期与事件对齐。
- 信件按段落清晰显现；祝福前留出停顿，分享和重读放在祝福后。私人原作的 2026.10.28 周末便笺完整保留；页尾有结束停顿。
- 减少动态效果、缺少 IntersectionObserver 时提供静态可读版本；图片失败保留日期与通话内容。

## 定制交付

复制整个 `stories/demo/` 到 `customers/<客户代号>/`。`story.json` 管理资料与章节，`letter.json` 单独保存信件与附言，授权图片放在 `media/`；不改 React 组件。

```bash
STORY_FILE=customers/client-001/story.json \
VITE_BASE_PATH=/gifts/client-001/ \
STORY_ORIGIN=https://example.com \
npm run build
```

`id` 决定输出目录，使用唯一英文代号。照片放在配置旁的 `media/`，配置中使用相对路径。构建只复制所选故事引用的素材，不会复制整个客户资料目录。`customers/` 和 `dist-v2/` 已忽略，不应将私人资料提交到公开仓库。

章节设置为 `null`、`{}` 或删除字段即可隐藏。通话主题为空会隐藏该章节；信件空段落会忽略。`theme` 支持 `system`、`light`、`dark`。日期图可选；没有图时使用可编辑的日期排版，避免把 `10.25` 套给其他客户。

完整字段、字体更新、媒体权限和托管说明见 [CUSTOMIZATION.md](CUSTOMIZATION.md)。静态站点没有密码验证；私人资料需要托管层实际访问控制，随机链接不提供访问保护。

## 验证与真实录制

```bash
npm run test:config
npm run typecheck
npm run build
npm run build:demo
# 启动上面的 4174 / 4175 预览后：
npm run test:e2e
TEST_URL=http://localhost:4175/ TEST_STORY=demo npm run test:e2e
npm run test:motion
TEST_SCHEME=dark npm run test:motion
node scripts/verify-isolation.mjs
```

默认浏览器 `/usr/bin/chromium`；其他位置设置 `CHROMIUM_PATH`。CI 会安装 Playwright Chromium，并运行 `scripts/check-all.mjs`（自动启停独立预览）。WebKit 可以用 `TEST_ENGINE=webkit` 运行页面测试，但必须先安装其浏览器与系统库。

```bash
npm run design:review
npm run design:motion
TEST_SCHEME=dark npm run design:motion
```

设计审查和录制默认访问 4175 的**虚构演示**。输出在 `artifacts/`，不覆盖 V1。录制为 Playwright 的真实浏览器视频，包含实际加载、点击、滚动、主题切换、双卡往返、城市与信件。FFmpeg 输出完整手机 WebM / MP4、保留完整画面的 1080 × 1920 MP4、独立镜头、`shots.json` 和剪映区间说明。没有将截图伪造成互动。私人录制需显式设置 `TEST_URL` 和单独的 `RECORD_DIR`。

实际结果与限制见 [QA.md](QA.md)、[V2_DELIVERY.md](V2_DELIVERY.md)。实验室 LCP / CLS 不等于真机结果，TBT 不等于 INP。

## 发布边界

本次没有运行 `deploy`，没有修改 `symmetrical-carnival`。源码 CI 只验证构建。独立 Pages 工作流仍需人工触发；现有生产部署脚本另外要求 `ALLOW_PRODUCTION_DEPLOY=yes`，避免将 V2 预览误发到私人原作地址。该变量不能替代用户的明确发布授权。

未来获准发布后，只上传选定故事的完整输出目录。Cloudflare Pages 可直接托管静态目录，暂不需要数据库、商城或支付系统。开启真正的访问保护后再托管需要保密的客户故事。
