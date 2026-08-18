import { getCollection } from 'astro:content';

// 站点地图（构建时生成，帮助搜索引擎收录）
export async function GET(context) {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);
  const base = context.site?.toString().replace(/\/$/, '') ?? '';

  const urls = [
    '',
    '/blog/',
    '/about/',
    '/friends/',
    ...posts.map((p) => `/blog/${p.id}/`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
