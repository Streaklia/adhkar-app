import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/lib/site-config';
import duasData from '@/data/duas.json';
import articlesData from '@/data/articles.json';
import { ArticleItem } from '@/lib/types';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = SITE_CONFIG.siteUrl;
  const now = new Date().toUTCString();

  const itemsXml: string[] = [];

  // 1. Articles Directory Item
  itemsXml.push(`
    <item>
      <title>${escapeXml('المقالات والأحاديث النبوية وأحكام الأذكار')}</title>
      <link>${baseUrl}/articles</link>
      <guid isPermaLink="true">${baseUrl}/articles</guid>
      <description>${escapeXml('دليل المقالات والأحاديث الإسلامية المحققة من القرآن وصحيح السنة النبوية.')}</description>
      <category>المقالات والأحاديث</category>
      <pubDate>${now}</pubDate>
    </item>`);

  // 2. Individual SEO Articles
  (articlesData as ArticleItem[]).forEach((a) => {
    itemsXml.push(`
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${baseUrl}/articles/${a.slug}</link>
      <guid isPermaLink="true">${baseUrl}/articles/${a.slug}</guid>
      <description>${escapeXml(a.description)}</description>
      <category>${escapeXml(`مقالات: ${a.category}`)}</category>
      <pubDate>${new Date(a.datePublished).toUTCString()}</pubDate>
    </item>`);
  });

  // 3. Core Pages
  SITE_CONFIG.pages
    .filter((p) => p.slug !== '')
    .forEach((p) => {
      itemsXml.push(`
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${baseUrl}/${p.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${p.slug}</guid>
      <description>${escapeXml(p.description)}</description>
      <category>أقسام التطبيق</category>
      <pubDate>${now}</pubDate>
    </item>`);
    });

  // 4. After prayer Duas
  duasData.after_prayer.forEach((d) => {
    itemsXml.push(`
    <item>
      <title>${escapeXml(`أذكار بعد الصلاة: ${d.title}`)}</title>
      <link>${baseUrl}/after-prayer#${d.id}</link>
      <guid isPermaLink="false">after-prayer-${d.id}</guid>
      <description>${escapeXml(d.text)}</description>
      <category>أذكار بعد الصلاة</category>
      <pubDate>${now}</pubDate>
    </item>`);
  });

  // 5. Morning Adhkar
  duasData.adhkar.morning.forEach((d) => {
    itemsXml.push(`
    <item>
      <title>${escapeXml(`أذكار الصباح: ${d.title}`)}</title>
      <link>${baseUrl}/adhkar?time=morning#${d.id}</link>
      <guid isPermaLink="false">morning-${d.id}</guid>
      <description>${escapeXml(d.text)}</description>
      <category>أذكار الصباح</category>
      <pubDate>${now}</pubDate>
    </item>`);
  });

  // 6. Evening Adhkar
  duasData.adhkar.evening.forEach((d) => {
    itemsXml.push(`
    <item>
      <title>${escapeXml(`أذكار المساء: ${d.title}`)}</title>
      <link>${baseUrl}/adhkar?time=evening#${d.id}</link>
      <guid isPermaLink="false">evening-${d.id}</guid>
      <description>${escapeXml(d.text)}</description>
      <category>أذكار المساء</category>
      <pubDate>${now}</pubDate>
    </item>`);
  });

  // 7. Travel Duas
  duasData.travel.forEach((d) => {
    itemsXml.push(`
    <item>
      <title>${escapeXml(`أدعية السفر: ${d.title}`)}</title>
      <link>${baseUrl}/travel#${d.id}</link>
      <guid isPermaLink="false">travel-${d.id}</guid>
      <description>${escapeXml(d.text)}</description>
      <category>أدعية السفر</category>
      <pubDate>${now}</pubDate>
    </item>`);
  });

  // 8. Family Duas
  duasData.family.forEach((d) => {
    itemsXml.push(`
    <item>
      <title>${escapeXml(`${d.category_ar}: ${d.title}`)}</title>
      <link>${baseUrl}/family#${d.id}</link>
      <guid isPermaLink="false">family-${d.id}</guid>
      <description>${escapeXml(d.text)}</description>
      <category>أدعية الأسرة والوالدين</category>
      <pubDate>${now}</pubDate>
    </item>`);
  });

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>ar</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml.join('')}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
