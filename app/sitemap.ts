import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';
import articlesData from '@/data/articles.json';
import { ArticleItem } from '@/lib/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.siteUrl;
  const now = new Date();

  // Core pages
  const corePages: MetadataRoute.Sitemap = SITE_CONFIG.pages.map((page) => ({
    url: page.slug ? `${baseUrl}/${page.slug}` : baseUrl,
    lastModified: now,
    changeFrequency: page.changefreq,
    priority: page.priority,
  }));

  // Articles index page
  const articlesIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/articles`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic individual article pages
  const articlePages: MetadataRoute.Sitemap = (articlesData as ArticleItem[]).map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(a.dateModified || a.datePublished),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...corePages, ...articlesIndex, ...articlePages];
}
