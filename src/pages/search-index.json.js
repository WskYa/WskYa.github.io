import { getCollection } from 'astro:content';

// 构建时生成文章搜索索引（供站内全文搜索使用）
function stripMarkdown(md) {
  return md
    .replace(/```[a-zA-Z]*\n?([\s\S]*?)```/g, '$1') // 代码块：去掉围栏，保留内容
    .replace(/`([^`]*)`/g, '$1') // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接 → 保留文字
    .replace(/^#{1,6}\s+/gm, '') // 标题符号
    .replace(/^>\s?/gm, '') // 引用
    .replace(/[*_~|]/g, ' ') // 强调与表格分隔符
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);
  const index = posts.map((post) => ({
    id: post.id,
    title: post.data.title || post.id,
    description: post.data.description,
    date: post.data.pubDate ? post.data.pubDate.toISOString().slice(0, 10) : '',
    content: stripMarkdown(post.body ?? ''),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
