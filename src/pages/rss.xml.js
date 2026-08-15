import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        (b.data.pubDate?.valueOf() ?? 0) - (a.data.pubDate?.valueOf() ?? 0)
    );
  return rss({
    title: 'ALL0VEPH4U',
    description: 'ALL0VEPH4U 的个人博客 — 记录与思考。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate ?? new Date(0),
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>zh-cn</language>',
  });
}
