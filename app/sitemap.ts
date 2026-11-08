import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.siteUrl;
  const now = new Date();

  return SITE_CONFIG.pages.map((page) => ({
    url: page.slug ? `${baseUrl}/${page.slug}` : baseUrl,
    lastModified: now,
    changeFrequency: page.changefreq,
    priority: page.priority,
  }));
}
