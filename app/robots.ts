import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.siteUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'anthropic-ai',
          'ClaudeBot',
          'PerplexityBot',
          'Applebot-Extended',
          'CCBot',
        ],
        allow: '/',
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/feed.xml`,
    ],
    host: baseUrl,
  };
}
