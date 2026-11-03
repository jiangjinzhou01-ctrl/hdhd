# Memory Gift V2.1 · 工程交付记录

验证日期：2026-11-03。本次完成开发与测试，未发布商业生产站点。

## 1. 仓库与分支

- 源码：[jiangjinzhou01-ctrl/hdhd](https://github.com/jiangjinzhou01-ctrl/hdhd)
- 基线：`v2-development@d621a0e52d83dde0c07afce59b122a8a08910c92`，执行前重新检查，与用户提供值一致。
- 开发分支：`feature/memory-gift-trial-v2-1`；全部变更仅在该分支提交。
- 实现提交：`eb53be6203b150a327467cbc3bc2fceb3085f8b6`，后续提交只补充交付记录和按实际 12–15 秒规格验收的帧边界容差。
- PR：[hdhd #1](https://github.com/jiangjinzhou01-ctrl/hdhd/pull/1)，目标 `v2-development`，没有合并。
- 托管：`symmetrical-carnival/main@4c734249f36413310af148dccc21c90132c3e555`。只读检查与临时 clone 模拟；再次检查远端 SHA 未变，本地托管 checkout 干净。
- `stories/private/`、App、StoryMotion、tokens、私人 deploy 脚本和 deploy workflow 均无 diff。

## 2. 已实现能力

**新增**：完整静态商品页、独立商业组合构建、固定商业部署保护与完整性清单、非敏感订单状态/授权/最终确认、按单补字、短片精剪、商业与流程验收、操作文档与 CI 附件。

**复用**：原虚构 demo JSON 与独立 letter、story schema/装配、单故事/引用素材构建、六幕布局与 Motion 系统、明暗主题、分享与降级、Playwright 真录制、FFmpeg 转码与原 V2 回归。

**修复**：新汉字不再要求重制全站基础字体；扩展区汉字也纳入缺字检测；360px 礼物意象曾横向溢出，已收紧定位；本地预览支持与静态托管相近的 HTTP gzip。录制缺少 Playwright FFmpeg 时已实际安装并重跑成功；类型声明补齐后 TypeScript 通过。

**不提供**：支付/商城/登录/数据库/客户后台/编辑器、自定义域名、真实密码保护、无限修改、永久托管、全新 3D 或动画引擎。没有将它们包装为已实现。

## 3. 文件与职责

| 文件 | 职责 |
| --- | --- |
| commercial/index.html / styles.css / app.js | 七段商品信息架构、响应式/明暗、真实 demo 入口、FAQ 与复制咨询词 |
| scripts/build-commercial.mjs | 固定 demo、Pages BASE/ORIGIN、完整 staging 校验与本地目录替换 |
| scripts/lib/commercial.mjs | 固定目标、部署标记、SHA-256、文件名单、内容/图片隐私检查、目录边界 |
| scripts/deploy-commercial.mjs | 默认只检查、标记冲突/符号链接保护、并发 main 检查、限定路径提交/普通推送、Pages 状态与回退记录 |
| scripts/lib/preview.mjs / preview-commercial.mjs | 本机 exact 子路径预览、404、正确 MIME、HTTP gzip |
| scripts/lib/order.mjs | 复用 schema，检查套餐长度、两组图片授权、未成年人必要授权、公开同意与最终确认 |
| scripts/create-order.mjs / build-customer.mjs / preview-customer.mjs | 随机本地订单、独立构建/报告、仅本机预览 |
| scripts/lib/font-support.mjs / font-support.d.mts | 原字库缺字检测、含扩展区的 Unicode 检查、补充字体完整性及类型 |
| scripts/prepare-fonts.mjs / prepare-order-fonts.py / font-requirements.txt | 固定字体来源与哈希、按所选故事生成缺字子集、编码后 cmap 验证与依赖 |
| vite.config.ts / scripts/verify-fonts.py | 接入按 Unicode 范围使用的补充字体，保留缺字失败与独立字形复查 |
| scripts/record-motion.mjs | 在原录制上添加操作时间点和每个实际资源的 demo 哈希校验 |
| scripts/build-promo.mjs / check-promo.mjs | 真实来源限定、FFmpeg 精剪、字幕/无字幕镜头/源素材、编码/逐帧与时间线验证 |
| scripts/check-commercial.mjs / test-commercial-safety.mjs | 页面/键盘/axe/无 JS/子路径与原 V2 回归、破坏性部署负例 |
| scripts/test-customer.mjs | 全新虚构试单、授权/长度/罕见字负例、实际字体加载与独立产物 |
| scripts/check-commercial-performance.mjs | 可复现移动模拟与原始 HTML/JSON 报告，记录环境及测量限制 |
| tests/fixtures/trial-order/story.json / letter.json / order.json / media/* | 全新虚构生日试单、模拟自制授权素材，不是真客户 |
| .github/workflows/check.yml | 原回归 + 商业/订单/真实视频/性能 CI；只上传验收附件，不部署 |
| package.json / package-lock.json / .gitignore | 2.1.0 命令入口；没有新增 npm 依赖；商业输出与缓存忽略 |
| README.md / CUSTOMIZATION.md / customers/README.md / ASSETS.md | 入口、操作、资料边界、素材及字体来源 |
| COMMERCIAL_AUDIT.md / COMMERCIAL.md / V2_1_DELIVERY.md | 能力审计、完整运营/技术手册、实际交付记录 |

## 4. 视觉证据

本地 `artifacts/commercial/screens/`：320、390、768、1440 的 light/dark 首屏及完整页；另有 experience/includes/price/process/faq/consult 章节图。完整页面和首屏截图保留真实导航；单章节截图临时隐藏固定导航，避免截图裁片重复覆盖标题，不改变产品页面。

实际查看：390 浅色、320 深色、768 浅色、1440 明暗、套餐与流程章节；礼物意象、价格信息、咨询操作和留白均逐屏审阅。不是仅以自动截图存在作为设计通过依据。

`artifacts/review-demo-commercial/`：原 V2 真实演示的明暗封面、双卡、城市、信件与总览。实际查看了封面、双卡、城市、信件，布局未重写。`artifacts/orders/mg-q7m2x/screens/` 另有新名字与长信件在 320/390/1440 下的真实截图。

## 5. 视频交付

- 浅色成片：`artifacts/promo-light/memory-gift-14s.mp4`
- 深色成片：`artifacts/promo-dark/memory-gift-14s.mp4`
- 每套 `shots/`：5 个带字幕竖版分镜；`clean/`：5 个无字幕手机分镜。
- 每套 `source/`：完整真实 WebM、手机 MP4、原始时间标记和说明。
- 每套 `captions.srt`、`timeline.json`、`EDITING.md`、`check.json` 和 `frames/` 可继续剪映编辑/人工验收。
- 两套实际输出均为 **13.900 秒、1080×1920、H.264、yuv420p、30fps、无音轨**。原录制源为 390×844，完整保留，纯色留边。
- 构建与录制源提交 eb53be6、sourceDirty=false；每套实际加载的 7 个资源均与隔离 demo 的构建哈希一致。
- 0–2 展开、2–5 双卡、5–8 城市、8–12 信件、末尾价格/私信。帧边界略有偏差，实际截取点和目标节奏记录在 timeline.json。
- 关键片段分别有 20 / 30 / 30 / 40 个不同的采样解码帧；实际抽看最终明暗双卡、开场变化、城市/滚动、信件与价格结尾，未用截图拼接冒充互动。

生成命令和环境准备见 [COMMERCIAL.md](COMMERCIAL.md#真实宣传素材)。编码可正常解码，提供剪映兼容源素材；没有在剪映应用实际导入，不能声称该应用验收已完成。

## 6. 实际自动化结果

| 实际命令 | 结果与覆盖 |
| --- | --- |
| npm ci | 成功，167 个既有 npm 包；无新增 npm 依赖 |
| npm run test:config | 通过：必填项、有效日期、章节/路径、独立信件装配与跨目录拒绝 |
| npm run typecheck | 通过；build 也重复执行类型检查 |
| npm run build / npm run build:demo | 通过，分别输出 private/demo，不互相覆盖 |
| CHROMIUM_PATH=/usr/bin/chromium node scripts/check-all.mjs | 修改前基线与修改后回归均完整通过：私人/演示各 14 组视口主题、默认私人动效、降级、分享、axe、极端配置/隔离 |
| npm run build:commercial | 通过：16 个可部署文件 + 完整性标记；输入固定为虚构 demo |
| npm run check:commercial | 通过：商品页 14 组、四组 axe 零违规、键盘/所有链接/无 JS/复制拒绝/资源；在真实商业 demo 子路径复用原页面测试与明暗动效；安全负例 7 组 |
| npm run test:customer | 通过：74 个新字、授权及长度/公开/监护负例、上游不支持的扩展区汉字拒绝、实际字体请求、3 个屏宽、独立图片/分享/隐藏章节 |
| STORY_FILE=tests/fixtures/trial-order/story.json python scripts/verify-fonts.py | 两个实际字体权重的所选故事中文覆盖通过 |
| RECORD_PROMO=yes ... npm run design:motion | light / dark 均成功，真实浏览器录屏、8 个原始操作镜头、MP4 与逐响应来源校验 |
| npm run build:promo / npm run check:promo | light / dark 均通过；尺寸、编码、帧率、时长、字幕、哈希、逐帧变化和源素材有效 |
| npm run check:performance | 通过；原始 Lighthouse HTML/JSON、配置、LCP/CLS/TBT 和网络请求均保留 |
| npm run deploy:commercial | 成功完成最新 main 的只读模拟，打印 CHECK ONLY — NO PUSH；所有待变更文件以 memory-gift/ 开头 |

实际日志：`artifacts/baseline/`、`artifacts/commercial/*-final.log`、`qa/v2/`。正常浏览器验收没有未处理 JS 异常或 404。开发中发现的 360px 溢出、TS 声明缺失、Playwright 录像 FFmpeg 缺失均已修复重测，未隐藏失败。

### 移动实验室性能

本机 Node 24.19.0、Chromium 154、Lighthouse 13.5.0；412×823 / DPR 1.75，4× CPU，150ms 模拟 RTT、1638.4 Kbps 参数，本地冷缓存文本 gzip。共享云机器上分数会波动；以下是最后一次实测，不是承诺。

| 页面 | LCP | FCP | CLS | TBT | 传输 | Performance / A11y / BP / SEO |
| --- | --- | --- | --- | --- | --- | --- |
| 商业首页 | 1.243s | 1.079s | 0 | 40ms | 46,154 B | 100 / 100 / 100 / 100 |
| 演示首页 | 2.335s | 1.510s | 0 | 40.5ms | 253,214 B | 98 / 100 / 100 / 100 |

未压缩首测演示 LCP 3.721s / 83 分；文本 gzip 条件下另一轮为 2.302s / 90 分。所有原始结果保留在 `performance-uncompressed/`、`performance-gzip-shared/` 与 `performance/`，不挑选最高分冒充稳定性能。这里没有真实用户 INP，也没有低端 Android、真实 iPhone、抖音/微信浏览器或中国大陆网络数据。

## 7. 部署边界与操作

构建 `npm run build:commercial`；预览 `npm run preview:commercial`；校验 `npm run check:commercial`；部署预检 `npm run deploy:commercial`。

正式生产命令只供以后取得明确批准时使用：`ALLOW_COMMERCIAL_DEPLOY=yes npm run deploy:commercial -- --push --expected-head=<刚审阅的main完整SHA>`。此变量不能替代对话中的明确授权。本次没有设置或运行生产 push。

发布前核对完整性、隐私隔离、目标与标记、最新 main 无并发变更、仅商业路径 diff；发布后以该 SHA 的 Pages workflow success、两个新地址的资源/交互/分享和两个原站无回归为准。回退只从部署日志的 before 恢复 `memory-gift/`；首次发布的回退只删除该目录。不要 reset / revert 整个托管仓库。完整步骤见手册。

## 8. 试单结论

已完成栀夏/棠舟的独立虚构生日订单：改双方称呼、2027.04.16、苏州/青岛、信件/祝福、两组自制授权素材、dark 主题，隐藏 surprise；无需改 React 即生成可独立预览/部署的成品。待公开同意与最终检查未完成时，会拒绝公开包装；测试也演练了所有明确确认后生成待公开包，但没有上传。

字体新增 74 个码点；regular 13,180 B / semibold 13,392 B。首次自动补字+构建 18.91 秒（源字体已缓存）；后续缓存构建实测 1.66–3.20 秒。只测自动化步骤，没测人工接单、文案整理和整体制作耗时。主要操作难点：确认事实、图片授权/裁切、新字姓名与全文校对。

## 9. 尚需验证或批准

- 商业生产发布未授权，两个新 Pages 地址未上线验证。需要用户另行明确批准。
- 没有真实设备、Safari/WebKit、内置浏览器与中国大陆网络验收；不能把 Chromium 模拟当成真机。
- 没有剪映应用实际导入；仅验证标准 MP4 可解码与可导入格式/源素材准备。
- 抖音账号主页 URL 未经核实，页面只提供真实可用的复制词和来源作者私信指引。
- 第一次补字需要 Python 依赖与上游字体下载网络；字体缓存后可离线，完全不支持的字会阻断，需要人工处理。
- 普通静态站点无保密访问控制；客户授权、最终确认和必要监护授权必须真实取得，不能只改本地布尔值冒充同意。

远程 CI 的最终状态以 [PR Checks](https://github.com/jiangjinzhou01-ctrl/hdhd/pull/1/checks) 为准；本记录中的本地成功不替代远程状态。
