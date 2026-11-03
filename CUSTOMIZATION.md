# 人工定制与交付

第一阶段是一套友情纪念模板、多个独立故事。赠礼页面没有价格广告或商城入口。演示售价的业务决策不写入私人作品。

## 文件隔离

```text
stories/private/story.json      原私人故事（已在原公开源码存在，完整保留）
stories/demo/story.json         可公开的虚构示例
customers/client-001/story.json 新客户资料与章节配置，Git 忽略
customers/client-001/letter.json 独立信件与附言，Git 忽略
customers/client-001/media/     新客户授权素材，Git 忽略
dist-v2/<id>/                  该故事独立构建，Git 忽略
```

`scripts/story-files.ts` 仅在构建时读取 `letterFile` 指向的同目录信件，将 `intro / paragraphs / blessing / postscript` 合成为页面数据。源 JSON 不进入公开成品，媒体仍单独管理。复制模板时请复制整个目录。

`src/story-schema.ts` 提供完整类型与运行时校验，Vite 加载配置时即校验。无效必填项、错误日期、不安全媒体路径会明确报错；无内容的可选章节省略，超长内容自然换行。不得用中文逗号、学校名或英文祝福来拆分客户内容。

## 配置职责

| 字段 | 用途 |
| --- | --- |
| id / title / friend / relationship | 输出代号、网站标题、称呼、关系 |
| date / dateISO | 显示日期 / 有效 ISO 日期；不随访问时间变更 |
| theme | system、light、dark |
| demo | 是否在首尾明确显示虚构演示标记 |
| navigation | 页眉名称与实际存在章节的导航文字 |
| cover | 称呼、换行标题、介绍、日期排版、地点；art 可选 |
| night | 章节内容、时间意象、图片、可交互 themes |
| night.themes[].lines | 独立文字行数组，最后一行强调；不从标点解析 |
| night.themes[].position | 如 `70% center`，局部摄影裁切 |
| duo | 两个人物的名字与小字、共同回忆、初始 / 对齐反馈 |
| meeting | 原城市、目的城市、真实见面内容 |
| events | 日期与事件标签，在相见章节展示，不伪造经历 |
| surprise | 任意小惊喜；mark 可省略，不必使用金额或数字 |
| letterFile | 指向同目录 `letter.json`，单独保存 intro / paragraphs / blessing / postscript |
| letterIntro / letter | 合成后的信件开头与段落数组；段落可以复制选择 |
| blessing | `{text, emphasis?}` 分段强调，不依赖特定学校或英文 |
| weekend | 可选附言，独立日期、标题与正文 |
| share | 分享标题、文字、可选封面相对路径 |
| ending | 结束语 |

隐藏章节：删除字段，或设为 `null` / `{}`。在 JSON 中不要填写 `undefined`。空主题数组省略通话章节。没有相见章节时，小惊喜仍可独立显示；所有可选章节关闭时开场直接进入信件。

图片字段使用 `{src, alt, mobile?, dark?, darkMobile?}`。文件名使用英文、数字与连字符，路径相对配置旁 `media/`；如无客户素材，回退查找 `public/` 的已授权共享意象。构建时缺少文件会报错；运行时加载失败使用稳定底色与文字降级。图片不是聊天记录或合照，演示静物的 alt 已说明意象性质。

可修改同一静物的裁切，不能因此编造用户经历。通话时间是用户故事提供的意象，页面没有伪造电话界面、记录或在线状态。

## 字体

使用 Noto Sans SC 2.004 的 OFL 子集 Today Sans，原版权与许可证保留。普通 npm 构建不联网下载字体，也不依赖 Python。

Vite 保留 `src/font-coverage.json` 检查，并检查扩展区汉字。V2.1 普通订单推荐运行 `npm run build:customer -- --order=customers/<随机代号>`：自动生成只含所选故事缺字的补充 WOFF2；校验实际 cmap、哈希与字体体积，交付前明确复核新字。不会为一份订单覆盖全站原基础字体。

首次补字需要 Python 3、`python -m pip install -r scripts/font-requirements.txt` 和可下载固定版本字体的网络；缓存后可离线。上游不支持的字仍报错，不能静默回退或改姓名。字体授权来源、完整操作与限制见 [COMMERCIAL.md](COMMERCIAL.md)。原 `subset-fonts.py` 保留用于基础字库维护；不是普通接单必需步骤。

## 独立托管

```bash
STORY_FILE=customers/client-001/story.json \
VITE_BASE_PATH=/ \
STORY_ORIGIN=https://gift.example.com \
npm run build
```

托管 `dist-v2/<id>/`。子路径部署要把 `VITE_BASE_PATH` 设为含首尾斜杠的路径；`STORY_ORIGIN` 为不带末尾斜杠的 origin，使分享图成为完整 URL。构建生成 HTML 分享元数据，不依赖社交爬虫执行 JavaScript。

仅源码由 GitHub 管理。客户资料可离线接收和本地构建，人工上传成品到已授权托管空间。Cloudflare Pages 适合静态发布；敏感内容必须搭配服务端或边缘层访问验证。本期没有实现密码保护、账号、数据库、支付、自动接单或客户后台，不能以随机链接冒充保护。

交付前：核对所有姓名、日期、照片授权、章节、信件与附言；运行构建、字体校验、移动预览、减少动态与分享验证。公开宣传只录制演示版。照片的真实比例与构图仍需人工选裁切，本模板不会自动理解图片主体。

## V2.1 试卖订单入口

完整人工接单流程见 [COMMERCIAL.md](COMMERCIAL.md)。使用 `npm run order:new` 生成不含姓名或手机号的随机代号；原 story / letter 字段不变，本地 order.json 只记录授权与检查状态。公开发布须有明确同意、最终确认和必要监护等授权；新商业部署入口只发布固定虚构 demo，不接受客户故事。

普通公开静态网站没有访问保密能力。客户源码与网页产物包含客户内容，均不能因为源 JSON 未复制就视作可安全公开。测试夹具为独立全新虚构故事，真实订单始终放入 Git 忽略的 customers/。
