# Memory Gift V2.1 · ¥29.9 试卖手册

商品名：**一份可以打开的回忆 / MEMORY GIFT**。基于原 V2 模板人工定制，用于朋友、生日、重逢等场景。人工接单、人工收款，自动化辅助制作；没有商城、支付、账号、数据库或客户后台。

本次只交付源码分支、PR、可复核产物与本地预览，**未获准发布生产**。两个 GitHub Pages 地址仍是部署目标，不表示已上线：

- 展示：`https://jiangjinzhou01-ctrl.github.io/symmetrical-carnival/memory-gift/`
- 虚构演示：上述路径的 `demo/`
- 原私人作品始终留在 `phone-to-today/`，商业工具不写入该目录或根站。

## 套餐与接单说明

¥29.9 / 份包含一份现有模板互动网页，专属称呼、日期、地点、双方故事和共同回忆，一封信与祝福，最多两张有必要授权的图片，既有交互及 light / dark / system 主题，交付前文字校对和一次合理范围内的文字修正。明确同意公开发布后才提供公开托管链接。

不包含全新设计、无限修改、拖拽编辑器、在线支付或订单系统、账号后台、数据库、自定义域名、全新动画/3D、真实密码保护；不承诺永久托管。后续修改、新增内容或改版，先沟通范围和费用。没有编造交付时长、销量或真实客户案例。

页面没有经过核实的抖音账号 URL，因此只提供「回忆定制」复制功能，指引访客回到分享作品的抖音作者主页私信。复制被浏览器拒绝时自动选中关键词；JavaScript 失败时仍可手动复制。上线运营时应从实际接单账号分享页面，不把来源不明的链接当作有效咨询渠道。

## 安装与商业构建

Node 24、npm。浏览器验收使用 Chromium；自动新字补充需要 Python 3 + fonttools/Brotli；录屏另需 Playwright FFmpeg、系统 FFmpeg 和授权中文字体。

```bash
npm ci
python -m pip install -r scripts/font-requirements.txt
npx playwright install chromium ffmpeg
# Linux 如缺浏览器系统库：npx playwright install --with-deps chromium
# Debian/Ubuntu 视频工具：apt-get install ffmpeg fonts-noto-cjk
npm run build:commercial
npm run check:commercial
npm run preview:commercial
```

本地预览：`http://127.0.0.1:4180/symmetrical-carnival/memory-gift/`，`PORT` 可调整。服务器只监听本机，完整复现 Pages 子路径，缺少的文件返回 404。文本响应支持 HTTP gzip，冷缓存性能测量会记录这一条件。

`build:commercial` 固定所选故事为现有 `stories/demo/story.json`，固定 BASE 与 ORIGIN，调用原 Vite 构建，再组合为 `dist-commercial/memory-gift/`。继承的客户故事环境变量不能改变商业输入。先在 staging 完整构建和校验，再替换本地商业输出。不会将 demo 写进 `dist-v2/private/`。

静态商品页不另建框架，使用 V2 的灰/石墨/蓝配色、系统中文字体与克制留白。唯一 JS 是复制功能；没有滚动动画或运行时故事切换器。纸张意象由 CSS 绘制并明确标注为设计意象；真实体验图使用原虚构演示封面。原 App / StoryMotion / tokens / 私人部署入口保持原样。

产物包含 HTML/CSS/JS、demo 引用的媒体/字体、OFL 和第三方声明、`.nojekyll`、`.memory-gift.json`。标记记录 source SHA、工作区是否干净、固定目标和每个文件的 SHA-256。检查同时验证固定文件名单、完整性、子路径、分享元信息、已知私人内容和私人独占图片哈希；多余文件、符号链接、客户目录与密钥文件均拒绝。

## 从私信到客户交付

1. **咨询与收款**：先说明 ¥29.9 范围、一次文字修正、公开网页边界，人工确认收款与制作安排。没有自动支付订单。
2. **随机代号**：运行 `npm run order:new`。自动创建 `customers/mg-<随机代号>/`，不使用姓名或手机号。
3. **收集并录入**：称呼放 friend / cover.address / duo.people；关系放 relationship；日期放 date / dateISO；地点放 cover.location / meeting；共同回忆放 cover.memory 及原章节字段；希望表达的话、信件、祝福放独立 `letter.json`。不另建故事字段结构。
4. **授权资料**：最多两张客户图片，含对应尺寸变体，放本订单 `media/`。在本地 `order.json` 只记录文件名与授权布尔值，不记录姓名、电话、聊天或支付截图。实际授权凭证在安全渠道另外保存，发布前人工核实。
5. **制作预览**：运行下列 build / preview。未获公开同意时只提供本机或具有实际访问控制的预览。不要将本地端口、预览 ZIP、截图或内容上传到公共服务。
6. **校对确认**：逐字检查名字、日期、城市、共同故事、信件、图片主体、必要授权、隐藏章节、主题、分享封面和补充汉字；完成一次约定范围内的文字修正。
7. **授权与最终检查**：把已实际确认的 checklist 项设为 true；将已检查的字体 Unicode 码点列入 fontReviewedCodepoints；确认 finalConfirmed。公开发布必须另外取得明确同意，才将 publicRelease 设为 granted。布尔值是操作门槛，不替代真实授权凭证。
8. **交付**：`--delivery` 验证最终本地交付；只有真实公开授权齐全时才可加 `--public` 生成待公开包，仍不会上传或发布。客户成品交付到另外约定、已授权的空间；商业部署工具只接受固定 demo，不能发布客户故事。

```bash
npm run order:new
# 使用该命令实际输出的代号，编辑对应 story.json / letter.json / media/ / order.json
npm run build:customer -- --order=customers/mg-abcdefghij
npm run preview:customer -- mg-abcdefghij
# http://127.0.0.1:4190/gifts/mg-abcdefghij/

# 最终本地交付检查，不发布：
npm run build:customer -- --order=customers/mg-abcdefghij --delivery

# 仅在已取得客户公开授权、所有检查通过并确定实际托管地址后，生成待公开包：
STORY_ORIGIN=https://approved.example VITE_BASE_PATH=/gifts/mg-abcdefghij/ \
npm run build:customer -- --order=customers/mg-abcdefghij --delivery --public
```

客户产物固定为 `dist-v2/<代号>/`；本地检查报告在 `artifacts/orders/<代号>/`。客户脚本拒绝私人/演示 ID、不安全路径、过长套餐文案、未确认图片、超两组图片或未经必要监护授权的可识别未成年人公开素材。既有 schema 仍负责配置、日期与章节校验；媒体只按所选故事复制。

`customers/`、`dist-v2/`、`.cache/` 和 `artifacts/` 都在 Git 忽略中。公开仓库只保留独立虚构夹具 `tests/fixtures/trial-order/`，不能把真实订单移进测试目录或提交 build 报告。源 JSON 不出现在交付网页中，但**网页 JS/HTML 本身包含客户内容**；未获公开授权的产物同样不能上传公共 GitHub。

### 资料映射与最终清单

| 收集资料 | 继续使用的配置 / 本地状态 |
| --- | --- |
| 订单代号 | story.id、目录名、order.code 必须一致 |
| 对方/双方称呼、关系 | friend、cover.address、duo.people、relationship |
| 纪念日期、地点 | date / dateISO、cover、meeting、events |
| 共同回忆、想说的话 | cover.memory、已有 night / duo / meeting 内容、letter.json |
| 信件与祝福 | letter.json 的 intro / paragraphs / blessing |
| 图片与必要授权 | 本订单 media/、order.media 授权状态 |
| 是否允许公开 | publicRelease: pending / granted / denied |
| 最终确认 | finalConfirmed、checks.copy / media / layout / sharing / fonts |
| 新汉字复核 | fontReviewedCodepoints: ["U+...."]，从构建报告取值并实际查看后确认 |

普通公开静态站点没有真实访问保密能力。随机链接、隐藏按钮、robots.txt、noindex 均不是访问保护。保密客户只提供安全本地/真正受控预览；没有访问控制就不承诺私密在线托管。涉及未成年人可识别资料，公开前需监护人等必要授权。

### 字体策略与异常处理

保留原 Today Sans 400/600、405 字覆盖表和所有许可证。`missingGlyphs` 同时检查中文标点和扩展区汉字，不再漏过基本汉字区之外的人名用字。

`build:customer` 自动检测未覆盖字符，第一次使用时下载经固定提交与 SHA-256 校验的 Noto Sans SC 2.004 字体到忽略的 `.cache/font-source/`。有缓存后可离线处理。Python 只为该故事缺字生成两个微型 WOFF2，重命名 Today Order、保留原版权；重新读取编码产物 cmap 并记录每个字体的哈希。浏览器通过 `unicode-range` 在相同字号/字重中回退到这份已知覆盖的补充文件，不下载整套原字体。

Vite 仍会校验覆盖、字库来源和字体哈希。没有准备字库、产物损坏、上游字体不支持，或补充字体单个字重超过 250KB，均明确失败。构建报告列出需人工确认的 Unicode 码点；最终交付要求逐项复核。**不使用系统可能支持某字来代替实际字库验证，不自动改写姓名。** 不支持的字要先取得授权兼容字体或与客户确认写法，不能交付方框。

旧的 `subset-fonts.py` 仍供维护原基础字库；普通订单不需要改基础字体、覆盖表或 React。独立真实字形复查可运行：

```bash
STORY_FILE=tests/fixtures/trial-order/story.json python scripts/verify-fonts.py
```

## 虚构试单与已测耗时

`tests/fixtures/trial-order/` 是全新虚构的「栀夏 / 棠舟、2027.04.16、苏州 / 青岛」生日来信。更换双方称呼、日期、城市、信件与授权模拟素材，隐藏 surprise，使用 dark 主题，包含原字库未覆盖的栀、蒹、葭、霁等字与较长段落。保留 demo 声明，不作为真实成交案例。

```bash
npm run build:customer -- --order=tests/fixtures/trial-order
npm run preview:customer -- mg-q7m2x
npm run test:customer
```

初次自动补字及构建实测 18.91 秒（原始字体已缓存，不含下载）；复用补充字体后的构建约 1.66 秒。本机 Node 24 / Python 3.12，自动化部分计时；**没有测量私信、整理文案、人工校对和整体接单耗时，不承诺整单分钟数**。操作难点是把客户事实正确映射到章节、照片授权与构图、新人名字形复核；工具不能代替这些判断。

## 真实宣传素材

先构建并启动商业预览，再在另一个终端执行：

```bash
RECORD_PROMO=yes \
TEST_URL=http://127.0.0.1:4180/symmetrical-carnival/memory-gift/demo/ \
RECORD_DIR=artifacts/demo-light npm run design:motion
npm run build:promo
npm run check:promo

# 可选深色录制与成片：
RECORD_PROMO=yes TEST_SCHEME=dark \
TEST_URL=http://127.0.0.1:4180/symmetrical-carnival/memory-gift/demo/ \
RECORD_DIR=artifacts/demo-dark npm run design:motion
TEST_SCHEME=dark npm run build:promo
TEST_SCHEME=dark npm run check:promo
```

录制继续使用原 Playwright 真浏览器流程。`RECORD_PROMO=yes` 会校验首尾虚构声明、固定子路径，并对每个实际响应与商业产物逐字节比对；原始 WebM、构建清单和镜头时间均有哈希。剪辑器只接受这种已验证的虚构素材；不能把普通私人物料录屏传给剪辑器。

`artifacts/promo-light/` 包含：成片 `memory-gift-14s.mp4`，`shots/` 带说明竖版分镜，`clean/` 无字幕手机分镜，`source/` 原始 WebM/MP4、shots.json、SHOTS.md，`captions.srt`、字幕文本、`timeline.json`、ffprobe/逐帧检查与 `EDITING.md`。dark 使用独立目录。

时间线：0–2 秒点击展开；2–5 秒双卡靠近对齐；5–8 秒城市/滚动；8–12 秒信件；最后约 2 秒价格与抖音私信提示。来源片段适当调速，完整手机画面缩放到字幕之间，纯色留边，不裁切、不合成按钮、不用截图冒充动画、不添加音乐。成片 H.264/yuv420p/30fps/1080×1920，实际帧边界时长约 13.93 秒。

剪映可导入标准 MP4 或无字幕镜头与 SRT；编码和解码已自动验证，**没有运行剪映应用做真实导入测试**。字幕字体默认使用系统授权 Noto Sans CJK；不同平台可用 `PROMO_FONT` 指定已授权中文字体路径。视频均忽略，不提交大文件。

## 验收命令与 CI

```bash
npm run test:config
npm run typecheck
npm run build
npm run build:demo
CHROMIUM_PATH=/usr/bin/chromium node scripts/check-all.mjs
npm run build:commercial
npm run check:commercial
npm run test:customer
npm run check:performance
npm run deploy:commercial
```

`check:commercial` 在真实 Pages 子路径检查两套主题 × 320/360/390/430/768/1024/1440px、资源、锚点、键盘、无 JS、放大字体、复制成功/拒绝、真实 demo 入口、四组 axe，然后复用完整 V2 页面测试和明暗动效测试，并执行部署安全负例。`check-all` 保留私人/演示原回归及隔离/极端文案测试。截图不能代替人工视觉审阅；本次实际查看了手机、桌面、窄屏、明暗、价格/流程、演示关键场景与新字试单。

CI 保留原 V2 验证，增加商业/订单/真实宣传片/性能检查，不运行任何 deploy。Actions 的 `memory-gift-v2-1-delivery` 附件收集商业构建、虚构试单和演示素材，包含部署标记。不要把真实订单目录加入 artifact 路径。

性能报告记录 Lighthouse 版本、实际 Chromium UA、412×823 模拟视口、4× CPU、网络节流、LCP/CLS/FCP/TBT 和传输体积。实验室分数不能当作低端 Android、抖音/微信内置浏览器、中国大陆网络或真实 INP；这些仍需真机验收。初次未压缩服务器测量和后续 gzip 条件测量都保留，避免混淆环境差异。

## 商业部署：当前只允许检查

```bash
npm run build:commercial
npm run check:commercial
npm run deploy:commercial
```

默认流程只克隆最新托管 main 到临时目录，校验仓库身份、目标标记和构建，模拟完整目录替换，输出待变更文件与当前 SHA，**不提交、不推送**。不修改用户已有生产 checkout；临时目录结束后清理。

将来需要用户在对话中另行明确批准商业生产发布，确认当前托管 main 的 SHA 与 Pages 设置，准备 Git/GitHub CLI 的适当写权限，并复查构建、隐私隔离和变更名单。只有那时才可执行下列技术开关命令；环境变量本身不是授权：

```bash
# 仅在获得明确生产发布批准后；替换为此次刚审阅的 main SHA：
ALLOW_COMMERCIAL_DEPLOY=yes npm run deploy:commercial -- --push --expected-head=<40位当前mainSHA>
```

脚本锁定 `jiangjinzhou01-ctrl/symmetrical-carnival` 与 `memory-gift/`，拒绝路径覆盖参数；旧目录缺标记、目标符号链接或 staging 冲突时停止。替换在临时 clone 内完成；只暂存商业路径，提交前与推送前检查 main 并发变化，使用普通 fast-forward push，不强制推送。不会先删除线上目录。

推送后记录部署 SHA、之前 SHA、源 SHA 和限定目录回退方式到 `artifacts/deployments/`，查询**该 SHA 对应的 Pages 工作流**。失败或超时明确报错，不把成功 push 当作已上线。

线上批准发布后验收：确认 Pages workflow success；打开展示和 demo 完整子路径；检查 CSS/JS/字体/图片 200、OG 标题与绝对图片 URL、明暗及核心交互；确认根 TIANGONG 和私人页面仍正常；只在验证完毕后分享。当前没有执行这些线上商业验证，因为没有发布授权。

### 只回退商业目录

回退也属于生产变更，需要明确授权。取部署日志中的 `before`，克隆**最新**托管仓库，在最新 main 上建回退分支。先检查当前没有并发商业更新。

若 `before` 有带有效标记的 `memory-gift/`，仅执行 `git restore --source=<before> --staged --worktree -- memory-gift/`。若回退的是首次商业发布，旧提交中根本没有商业目录，仅执行 `git rm -r -- memory-gift/`。**不要 revert 整个共享仓库提交、reset main 或恢复根目录。**

检查 `git diff --cached --name-only` 全部以 `memory-gift/` 开头，确认根站与 `phone-to-today/` 没有变化，再创建针对托管 main 的回退 PR，经批准合入；或在单独批准的操作中普通推送。随后检查对应 SHA 的 Pages workflow 与两个原站。保留新历史，不使用 force push。
