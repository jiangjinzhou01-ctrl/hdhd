# V2 交付记录

开发基线：`hdhd/main@edabe6e1379984d0bfdae391cd6753ca7fb4069c`。开发分支 `v2-development`。生产托管仓库 `symmetrical-carnival/main@06d068d422a027fb9b7f430d3e361ebdaab31e1b` 仅只读检查，没有克隆覆盖、推送或发布。V1 的 dist、设计截图与两个 WebM 原文件保留。

## 可见变化与保留项

开场按钮驱动封面空间缩退与连续进入正文，约 1.2 秒完成，重复点击直接进入，滚轮 / 触摸 / 指针 / 阅读按键可接管。深夜摄影加入轻阻尼滚动层，主题切换同时影响文字、注释、摄影裁切；内容预留稳定高度。双卡保持原构图与阻尼弹簧，强化靠近、对齐和完整复位。城市以静止框触发遮罩揭示，按排版轴对齐日期与事件。信件按段落自然显现，祝福有独立停顿，分享和重读移到其后，增加安静结束语。

原配色、系统字体方案、金属日期意象、深夜静物、六幕真实故事、23:00、和平、邵阳 / 长沙、100 元、未来中考祝福、2026.10.28 周末留言、原生详情、分享和重读均保留。没有虚构通话记录、聊天截图、考试结果或见面过程。减少动态、缺少 IntersectionObserver、图片 / 字体失败时均可继续阅读。

## 具体文件

| 文件 | 修改职责 |
| --- | --- |
| src/App.tsx | 六幕交互、开场状态、响应式图片、纯配置文案、信件与分享 |
| src/StoryMotion.tsx | 统一动效原语、静态回退、滚动阻尼、双卡状态 |
| src/style.css / src/tokens.css | 移动版式、320px / 短屏、稳定高度、主题与结束节奏 |
| src/main.tsx | 缺少观察 API 的静态启动 |
| src/story.ts / src/story-schema.ts / scripts/story-files.ts | 选择单一故事、独立信件装配、类型与运行时校验 |
| stories/private/story.json / letter.json | 原私人资料、独立信件与附言 |
| stories/demo/story.json / letter.json | 明确虚构的友情模板，资料与信件分开 |
| vite.config.ts / index.html | 独立构建、按引用媒体、分享元数据、字体缺字拦截 |
| public/fonts/*.woff2 / src/font-coverage.json | 新中文子集与覆盖表 |
| public/demo-preview.png | 演示分享图 |
| scripts/subset-fonts.py / scripts/verify-fonts.py | 客户字体更新与检查 |
| scripts/verify-config.mjs / scripts/verify-v2.mjs | 数据、响应式、主题、交互、分享、降级与无障碍测试 |
| scripts/verify-motion.mjs / scripts/verify-isolation.mjs | 实际变化采样、复位、极端内容与构建隔离 |
| scripts/check-all.mjs / .github/workflows/check.yml | 自动预览与 CI 检查，不发布 |
| scripts/record-motion.mjs / scripts/render-design.mjs | 真实动态素材、独立镜头、真实页面审查 |
| scripts/deploy.mjs / .github/workflows/deploy.yml | 适配新输出路径；未执行发布 |
| README.md / CUSTOMIZATION.md / QA.md / design/DESIGN.md / ASSETS.md | 运行、定制、实测结果、设计和授权说明 |
| package.json / package-lock.json / .gitignore / src/vite-env.d.ts | V2 命令、版本、资料隔离与虚拟配置类型 |

没有新增运行时依赖。

## 已可用的商业化能力

通过 JSON 修改标题、称呼、关系、日期、城市、图片、章节、交互反馈、重要事件、信件、可选附言、主题与分享封面；不改 React 组件。可选择和隐藏章节，金额不是必需字段。原作与演示按构建分离，没有运行时故事切换器。所选故事才进入 JS / HTML，只有引用媒体进入产物。新增汉字缺字时构建报错，避免关键标题回退。

这是人工资料收集与独立静态交付流程。没有商城、支付、账号、数据库或密码保护。私人客户资料放入本地忽略目录，不会自动上传；保密托管必须有实际服务端或边缘访问控制。

## 实际验证

详细结果见 QA.md。已运行 V1 基线页面与动效测试、TypeScript、两个生产构建、配置校验、两套主题下七组视口的私人 / 演示页面测试、axe、真实动效验证、最简 / 长文案 / 强制主题构建、演示隐私扫描、字体检查与开发服务检查。还运行了与 CI 相同的本地 check-all 编排。结果 JSON 与截图在 qa/v1/、qa/v2/，均保留在本地交付包中。

实验室 Lighthouse 移动模拟：Performance 96，Accessibility / Best Practices / SEO 100，LCP 2.4s、FCP 1.6s、CLS 0、TBT 120ms。同环境顺序对照 V1 为 98 分 / LCP 2.2s / TBT 70ms；V2 其他独立测量有 89–96 分、TBT 130–340ms 的波动，全部报告保留。真实用户 INP 未测得；没有将 TBT 作为 INP。

WebKit 已下载，但机器缺少 GTK4、Graphene、Harfbuzz ICU 等运行库，且没有可用的 sudo；Safari 验证没有执行通过。未进行 iQOO / OriginOS / Android 17 真机、真实 iPhone、微信 / QQ / 抖音内置浏览器和中国大陆网络测试，仍需设备验收。浏览器截图和模拟触摸不能替代真机滚动性能结论。

## 录制与预览

`artifacts/demo-light/`、`artifacts/demo-dark/` 各有约半分钟真实录屏、390×844 手机 WebM / MP4、1080×1920 竖版 MP4、8 个独立操作镜头、shots.json 与 SHOTS.md。竖版使用留边保留完整内容，没有用静态图生成交互。镜头包含加载、真实点击接起、主题切换、双卡靠近与复位、城市、信件和结尾。关键帧已人工查看，视频编码与尺寸由 ffprobe 验证。

`artifacts/review-private/`、`artifacts/review-demo/` 包含两套主题的实际章节图、手机 / 桌面封面与总览。V1 的 design 原图没有覆盖。

```bash
npm ci
npm run build
npm run preview -- --port 4174
# http://localhost:4174/symmetrical-carnival/phone-to-today/
npm run build:demo
npm run preview:demo -- --port 4175
# http://localhost:4175/
```

完整定制步骤见 CUSTOMIZATION.md。上述为本地运行地址，本次没有发布公网 V2 预览。原网站继续保持当前生产版本。
