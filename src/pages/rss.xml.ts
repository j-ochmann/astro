import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const docs = await getCollection('docs');
  return rss({
    title: 'Název vašeho webu',
    description: 'Stručný popis vaší dokumentace',
    site: context.site,
    items: docs.map((post) => ({
      title: post.data.title,
      pubDate: post.data.lastUpdated || new Date(), // Starlight používá lastUpdated
      description: post.data.description,
      link: `/${post.slug}/`,
    })),
  });
}
