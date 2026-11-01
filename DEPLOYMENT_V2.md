# V2 生产部署

本次在用户明确发出“部署”后，更新已有 GitHub Pages 的 phone-to-today/ 子目录。

- 生产地址：https://jiangjinzhou01-ctrl.github.io/symmetrical-carnival/phone-to-today/?v=v2
- 应用源码：hdhd/v2-development，fd0ae2842541e537417d1213415b04f881f2fb30。
- 生产提交：4c734249f36413310af148dccc21c90132c3e555。
- Pages 发布成功：https://github.com/jiangjinzhou01-ctrl/symmetrical-carnival/actions/runs/41282763411
- 回退基线：06d068d422a027fb9b7f430d3e361ebdaab31e1b。若需回退，只恢复该提交的 phone-to-today/，不要重置整个托管仓库。

发布为私人原作，完整保留原姓名、故事与周末附言，没有用虚构商业演示替换私人作品。构建设置正式 origin，分享封面使用完整线上 URL。全部变更限定在 phone-to-today/；根目录其他项目未变。

字体 OFL 许可证与 Pages 标记保留；源码的构建逻辑已补充自动携带这两个文件。README、QA、V2_DELIVERY 中“未部署”描述的是先前开发交付时点，本记录为后续部署状态。

线上验证结果存于 qa/v2/production-*；真机、内置浏览器和真实用户 INP 的既有验证限制仍然适用。

线上完整页面测试通过：14 组视口 / 主题组合、分享、图片与字体失败、静态回退与可访问性；明暗 axe 均为 0 violations，正常运行无未处理异常。真实动效检查通过，包括 33 处显现、双卡复位、指针接管和实时减少动态切换。15 个公开资源与正式构建逐字节一致。旧版带哈希的资源继续保留，以支持浏览器缓存中的 V1 入口。
