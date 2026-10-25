# 视觉素材

`public/night-still-life.webp` 与 `public/night-still-life-mobile.webp` 来自本项目为新版封面生成的一幅原创深夜静物意象。内容是桌上的手机和暖光，不是作者或罗琛尧的物品实拍，也不是两人的真实回忆照片。图片的替代文本明确标为“深夜静物意象”。没有人物、私人账号、真实聊天界面或品牌标识。

原始生成文件保留于本次工作环境：`/workspace/generated_images/exec-7d8e1c94-4659-426b-a2be-3941bbba0439.png`。网站使用 ImageMagick 制作的 WebP 压缩版本；移动版对右侧主体裁剪并缩放，以配合手机构图。没有外部图片请求。

分享图为网站原创排版的浏览器渲染图。所有文字均保留为站点的 DOM 文本；没有把故事文字烘焙进正文图片。

## 字体

`public/fonts/today-sans-regular.woff2` 与 `today-sans-semibold.woff2` 由 Noto Sans SC 2.004 的 400 / 600 字重制作，仅保留页面实际需要的字符，每个文件约 33KB。修改后的字体族重命名为 Today Sans；上游版权与 SIL OFL 1.1 许可证保留在字体名称表、`public/fonts/OFL.txt` 和 `licenses/NotoSansSC-OFL.txt`。

上游：https://github.com/google/fonts/tree/main/ofl/notosanssc 。原始下载文件的版本字段为 `Version 2.004-H2;hotconv 1.0.118;makeotfexe 2.5.65603`。源码中的 `scripts/subset-fonts.py` 记录了子集与重命名方式。常规 npm 构建直接使用已经提交的字体文件，不下载整套字体。
