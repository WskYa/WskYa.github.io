#!/bin/zsh
# Obsidian → 博客 自动发布
# 博客内容目录有变化时，自动提交并推送到 GitHub（触发自动部署）
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export GIT_TERMINAL_PROMPT=0
cd /Users/a1ph4/docu/projext/blog || exit 1

sleep 5 # 等 Obsidian 写完文件

if git status --porcelain src/content/ | grep -q .; then
  git add -A
  git commit -m "auto: 博客内容更新 $(date '+%Y-%m-%d %H:%M:%S')"
  git push origin main >> /tmp/blog-autopush.log 2>&1
fi
