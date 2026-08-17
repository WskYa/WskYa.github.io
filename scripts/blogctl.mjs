#!/usr/bin/env node
// blogctl — 博客命令行小工具
//
// 用法（在 blog/ 目录下，或任意位置自动定位）：
//   node scripts/blogctl.mjs new "文章标题"        # 从模板新建草稿（自动带今天日期）
//   node scripts/blogctl.mjs list                 # 列出全部文章（草稿/已发布）
//   node scripts/blogctl.mjs publish "标题或文件名" # 发布草稿（draft: true → false）
//   node scripts/blogctl.mjs unpublish "标题或文件名" # 撤回为草稿
//   node scripts/blogctl.mjs deploy "提交说明"      # 提交并推送（触发自动部署）
//   node scripts/blogctl.mjs preview              # 本地预览
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(HERE, '..');
const CONTENT_DIR = join(BLOG_ROOT, 'src', 'content', 'blog');

const [,, cmd, ...args] = process.argv;

const USAGE = `blogctl 用法:
  blogctl new "标题"         新建草稿（自动带今天日期，draft: true）
  blogctl list               列出全部文章
  blogctl publish "标题或文件名"  发布草稿
  blogctl unpublish "标题或文件名" 撤回为草稿
  blogctl deploy "提交说明"    提交并推送（触发自动部署）
  blogctl preview            本地预览`;

// ---------- 工具 ----------

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function sanitizeFilename(name) {
  return name.replace(/[\\/:*?"<>|\s]+/g, '').trim();
}

function frontmatterOf(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return fields;
}

function listPosts() {
  if (!existsSync(CONTENT_DIR)) return [];
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = readFileSync(join(CONTENT_DIR, file), 'utf8');
      const fm = frontmatterOf(raw);
      return {
        file,
        title: (fm && fm.title) || file.replace(/\.md$/, ''),
        // 没有 draft 字段 = 已发布（schema 默认 false）；只有显式 draft: true 才算草稿
        draft: fm ? fm.draft === 'true' : true,
      };
    })
    .sort((a, b) => (a.draft === b.draft ? a.file.localeCompare(b.file) : a.draft ? 1 : -1));
}

function findPost(query) {
  const posts = listPosts();
  return (
    posts.find((p) => p.file === query || p.file === `${query}.md`) ||
    posts.find((p) => p.title === query) ||
    null
  );
}

function flipDraft(post, draft) {
  const path = join(CONTENT_DIR, post.file);
  let raw = readFileSync(path, 'utf8');
  if (draft) {
    raw = raw.replace(/(^|\n)draft:\s*false/, '$1draft: true');
  } else {
    if (/draft:\s*true/.test(raw)) {
      raw = raw.replace(/draft:\s*true/, 'draft: false');
    } else {
      raw = raw.replace(/^---\n/, '---\ndraft: false\n');
    }
  }
  writeFileSync(path, raw);
}

// ---------- 命令 ----------

async function main() {
  switch (cmd) {
    case 'new': {
      const title = args.join(' ').trim();
      if (!title) return console.log('用法: blogctl new "文章标题"');
      const file = `${sanitizeFilename(title)}.md`;
      const path = join(CONTENT_DIR, file);
      if (existsSync(path)) return console.log(`❌ 已存在同名文件: ${file}`);
      mkdirSync(CONTENT_DIR, { recursive: true });
      writeFileSync(
        path,
        `---
title: ${title}
description: 
pubDate: ${today()}
draft: true
---

正文开始…
`
      );
      console.log(`✅ 已创建草稿: ${file}（draft: true，发布前不会上线）`);
      break;
    }

    case 'list': {
      const posts = listPosts();
      if (!posts.length) return console.log('（暂无文章）');
      for (const p of posts) {
        console.log(`${p.draft ? '📝 草稿' : '🌐 已发布'}  ${p.title}  (${p.file})`);
      }
      break;
    }

    case 'publish':
    case 'unpublish': {
      const query = args.join(' ').trim();
      if (!query) return console.log(`用法: blogctl ${cmd} "标题或文件名"`);
      const post = findPost(query);
      if (!post) return console.log(`❌ 找不到文章: ${query}`);
      const toDraft = cmd === 'unpublish';
      if (post.draft === toDraft) {
        return console.log(`ℹ️ ${post.file} 已经是${toDraft ? '草稿' : '发布'}状态`);
      }
      flipDraft(post, toDraft);
      console.log(
        toDraft
          ? `✅ 已撤回为草稿: ${post.title}`
          : `✅ 已发布（记得 deploy 才会上线）: ${post.title}`
      );
      break;
    }

    case 'deploy': {
      const msg = args.join(' ').trim() || `blog: 内容更新 ${today()}`;
      execSync('git add -A', { cwd: BLOG_ROOT, stdio: 'inherit' });
      execSync(`git commit -m "${msg.replace(/"/g, '')}"`, { cwd: BLOG_ROOT, stdio: 'inherit' });
      execSync('git push', { cwd: BLOG_ROOT, stdio: 'inherit' });
      console.log('🚀 已推送，GitHub Actions 自动部署中（约 1 分钟）');
      break;
    }

    case 'preview':
      execSync('npm run preview', { cwd: BLOG_ROOT, stdio: 'inherit' });
      break;

    default:
      console.log(USAGE);
  }
}

main();
