# ALL0VEPH4U

个人博客，零成本上线。基于 [Astro](https://astro.build) 构建，托管在 GitHub Pages，设计遵循 Apple 设计语言（清晰 · 谦逊 · 层次），支持明暗双主题。

## 本地开发

```bash
npm install
npm run dev
```

## 写文章

在 `src/content/blog/` 下新建一个 Markdown 文件即可，例如 `my-post.md`：

```md
---
title: 文章标题
description: 一句话摘要
pubDate: 2026-08-14
---

正文内容…
```

推到 `main` 分支后，GitHub Actions 会自动构建并部署。

## 技术栈

- [Astro 7](https://astro.build) — 静态站点生成器，零 JS 输出
- [@astrojs/rss](https://docs.astro.build/en/guides/rss/) — RSS 订阅源
- GitHub Actions — 自动构建部署到 GitHub Pages

## 结构

```
blog/
├── src/
│   ├── content/blog/     # 文章（Markdown）
│   ├── content.config.ts # 内容集合 schema
│   ├── layouts/          # 页面布局
│   ├── pages/            # 路由页面 + RSS
│   └── styles/global.css # 苹果风设计系统
├── public/               # 静态资源（favicon 等）
└── .github/workflows/    # 自动部署
```
