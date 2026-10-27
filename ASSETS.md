# 视觉素材

`public/night-still-life.webp` 与 `public/night-still-life-mobile.webp` 来自本项目为新版封面生成的一幅原创深夜静物意象。内容是桌上的手机和暖光，不是作者或罗琛尧的物品实拍，也不是两人的真实回忆照片。图片的替代文本明确标为“深夜静物意象”。没有人物、私人账号、真实聊天界面或品牌标识。

原始生成文件保留于本次工作环境：`/workspace/generated_images/exec-7d8e1c94-4659-426b-a2be-3941bbba0439.png`。网站使用 ImageMagick 制作的 WebP 压缩版本；移动版对右侧主体裁剪并缩放，以配合手机构图。没有外部图片请求。

先前封面的手机画面使用 `night-still-life-wide-mobile.webp`，约 15KB，以横向完整构图保留手机与暗部，配合时间旁注。原有竖向移动版本保留为素材。没有增加新的虚构回忆画面。

分享图为网站原创排版的浏览器渲染图。所有文字均保留为站点的 DOM 文本；没有把故事文字烘焙进正文图片。

## 字体

`public/fonts/today-sans-regular.woff2` 与 `today-sans-semibold.woff2` 由 Noto Sans SC 2.004 的 400 / 600 字重制作，仅保留页面实际需要的字符，每个文件约 33KB。修改后的字体族重命名为 Today Sans；上游版权与 SIL OFL 1.1 许可证保留在字体名称表、`public/fonts/OFL.txt` 和 `licenses/NotoSansSC-OFL.txt`。

上游：https://github.com/google/fonts/tree/main/ofl/notosanssc 。原始下载文件的版本字段为 `Version 2.004-H2;hotconv 1.0.118;makeotfexe 2.5.65603`。源码中的 `scripts/subset-fonts.py` 记录了子集与重命名方式。常规 npm 构建直接使用已经提交的字体文件，不下载整套字体。

## 当前浅色首页的日期意象

meeting-date.webp 与 meeting-date-mobile.webp 来自本项目原创生成的银色 10.25 排版雕塑，原始文件为 /workspace/generated_images/exec-4668abd6-47c9-4abc-85a1-54359d2f8509.png。网站使用裁剪并压缩的 WebP 版本，四周以静态遮罩融合浅灰底。它是纪念日期的设计意象，不是两人的合照或见面实拍。完整日期 2026.10.25 仍以 DOM 文字呈现。

Apple 官网只作版式、留白和动效节奏的参考；没有下载和复用 Apple 的 Logo、产品图、视频或 SF Pro 字体文件。

## 深色日期意象

`meeting-date-dark.webp` 与 `meeting-date-dark-mobile.webp` 是在同一原始日期雕塑基础上制作的独立深色版本。原始编辑结果保留在 `/workspace/generated_images/exec-2b0e23ab-20d9-461a-b039-6e0e780b8e85.png`。构图与 10.25 字样保持一致，材质改为石墨黑金属与银色边缘高光，背景改为近黑摄影棚。它仍然是纪念日期的设计意象。

WebP 文件沿用浅色版本的裁剪范围，桌面宽 1440px、约 30KB，手机宽 800px、约 11KB。通过 picture / source 与带媒体条件的预加载跟随系统颜色偏好选择，首次深色访问只请求相应尺寸的深色图像。所有版本均由本站托管。
