此目录用于本地客户资料，不提交客户配置与照片。复制整个 stories/demo/ 到 <代号>/，分别编辑 story.json（资料）和 letter.json（信件与附言），授权素材放入 <代号>/media/。完整流程见 ../CUSTOMIZATION.md。

V2.1 推荐 `npm run order:new` 创建随机 mg- 代号，再运行 `npm run build:customer -- --order=customers/<代号>`。本地 order.json 只保存授权、公开同意和最终检查状态，不保存姓名/手机号等资料。完整收集字段映射、字库处理、交付授权与隐私说明见 ../COMMERCIAL.md。不要把真实订单或产物放入公开测试夹具。
