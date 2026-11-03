# V2.1 基线审计

审计时间：2026-11-03。开始修改前读取用户列出的源码、JSON、设计说明、测试、录制及部署脚本。没有新建 React 项目。

- 源码：`jiangjinzhou01-ctrl/hdhd`，`v2-development@d621a0e52d83dde0c07afce59b122a8a08910c92`，与提供基线一致。
- 功能分支在远端不存在；从上述提交创建 `feature/memory-gift-trial-v2-1`。
- 托管：`jiangjinzhou01-ctrl/symmetrical-carnival/main@4c734249f36413310af148dccc21c90132c3e555`，与提供基线一致；仅只读克隆与检查。
- 根站是 TIANGONG 的静态 Vinext 产物；`phone-to-today/` 有独立私人作品与标记。没有 `memory-gift/` 或同类商品页。
- 仓库没有自定义 Pages workflow；实际运行是 GitHub 的 `dynamic/pages/pages-build-deployment`。最近运行 [41282763411](https://github.com/jiangjinzhou01-ctrl/symmetrical-carnival/actions/runs/41282763411) 成功，对应当前 main。旧 README 的 Actions 说明与实际运行不同，以真实运行记录为准。
- 本地 Node 24.19.0、Chromium 154、FFmpeg 7.1.5 可用。现有 npm scripts 已检查；基线检查日志保存在忽略的 `artifacts/baseline/`。

| 需求 | 现有实现 | 缺口 | 复用方案 | 必要改动 |
| --- | --- | --- | --- | --- |
| 高质量故事 | App 六幕、StoryMotion、tokens | 无确认缺陷 | 整体保留 | 不重写主体 |
| JSON 定制 | story-schema、story-files、独立 letter | 无订单授权门槛 | 继续使用原字段与校验 | 仅增加本地订单检查与构建入口 |
| 独立演示 | stories/demo，首尾声明，按素材构建 | 商业 Pages 子路径未打包 | 固定 STORY_FILE / BASE / ORIGIN | 商业构建组合目录 |
| 公开商品页 | 无 | 产品说明、视觉、咨询 | 复用配色、字体与真实演示 | 静态 HTML/CSS/小型 JS |
| 中文字库 | 405 字覆盖、缺字报错 | 新字需重制全站字体 | 保留原字库和检查 | 自动生成按订单的补充字体，未知字继续阻断 |
| 客户隔离 | customers 忽略，仅复制引用素材 | 授权、最终确认、可交付检查 | 不新增故事 schema | 非敏感 order.json、试单 fixture |
| 宣传录屏 | Playwright、390×844、MP4、镜头时间 | 缺 12–15 秒成片和可核验演示来源 | 扩展现有标记与录制 | FFmpeg 精剪、字幕、来源哈希 |
| 部署 | deploy.mjs 仅私人目录 | 不能用于商业站 | 不动私人脚本 | 固定 memory-gift 独立安全入口 |
| 验收 | V2 页面、动效、隔离、axe | 商业流程与目录安全未覆盖 | 继续跑全部相关回归 | 商业专项、授权负例、性能记录 |

预计新增：commercial/、商业构建/检查/部署/剪辑、订单与字体辅助、小型测试夹具和文档。按需修改 package.json、Vite 字体接入、record-motion、check workflow、README/CUSTOMIZATION/ASSETS/.gitignore。不修改私人故事、App 六幕、StoryMotion、tokens、私人部署脚本/工作流、既有设计录像或生产仓库。

Sites 技能仅用于本地静态设计与验收指导。用户明确指定 GitHub 仓库与禁止生产发布，因此不注册或发布额外 Sites 项目。
