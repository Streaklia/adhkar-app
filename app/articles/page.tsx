import type { Metadata } from 'next';
import ArticlesIndexClient from '@/components/views/ArticlesIndexClient';
import { SITE_CONFIG } from '@/lib/site-config';
import { getBreadcrumbSchema, getItemListSchema } from '@/lib/schema-helper';
import articlesData from '@/data/articles.json';
import { BookOpen } from 'lucide-react';
import { ArticleItem } from '@/lib/types';

export const metadata: Metadata = {
  title: 'المقالات والأحاديث النبوية وأحكام الأذكار',
  description: 'دليل المقالات الإسلامية الموثقة من القرآن الكريم وصحيح السنة النبوية حول فضل الأذكار، صفة الصلاة، سنن يوم الجمعة، أدعية السفر، وبر الوالدين.',
  keywords: [
    'مقالات إسلامية',
    'أحاديث نبوية صحيحة',
    'فضل الأذكار',
    'أحكام الصلاة',
    'سنن الجمعة',
    'دعاء السفر',
    'بر الوالدين',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/articles`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'المقالات والأحاديث النبوية وأحكام الأذكار | دُعَاء',
    description: 'دليل المقالات والأحاديث الإسلامية المحققة من القرآن وصحيح السنة النبوية.',
    url: `${SITE_CONFIG.siteUrl}/articles`,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('المقالات والأحاديث النبوية')}&category=${encodeURIComponent('مكتبة المعرفة الإسلامية')}`,
        width: 1200,
        height: 630,
        alt: 'المقالات والأحاديث النبوية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'المقالات والأحاديث النبوية وأحكام الأذكار | دُعَاء',
    description: 'دليل المقالات والأحاديث الإسلامية المحققة من القرآن وصحيح السنة النبوية.',
    images: [`${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('المقالات والأحاديث النبوية')}&category=${encodeURIComponent('مكتبة المعرفة الإسلامية')}`],
  },
};

export default function ArticlesPage() {
  const articles = articlesData as ArticleItem[];
  const breadcrumbSchema = getBreadcrumbSchema('articles', 'المقالات والأحاديث');
  const articlesListSchema = getItemListSchema(
    'مقالات الأذكار والأحاديث النبوية',
    articles.map((a) => ({ name: a.title, text: a.description }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articlesListSchema) }}
      />

      <div className="w-full flex flex-col gap-6 pb-12">
        {/* Main H1 Heading */}
        <header className="border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">مكتبة المعرفة الإسلامية</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-zinc-100 font-quran">
            المقالات والأحاديث النبوية وأحكام الأذكار
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            مقالات موثقة بأصح الأحاديث النبوية المخرجة في الصحيحين، تجيب على الأسئلة الشائعة حول فضل الأذكار والصلاة وسنن الجمعة والسفر وبر الوالدين
          </p>
        </header>

        {/* Client Interactive Filter & Grid */}
        <ArticlesIndexClient articles={articles} />
      </div>
    </>
  );
}
