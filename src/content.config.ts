import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().default('未命名'),
    description: z.string().default(''),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
