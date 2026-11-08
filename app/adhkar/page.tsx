import type { Metadata } from 'next';
import { Suspense } from 'react';
import AdhkarClient from '@/components/views/AdhkarClient';
import { SITE_CONFIG } from '@/lib/site-config';
import { getBreadcrumbSchema, getItemListSchema } from '@/lib/schema-helper';
import duasData from '@/data/duas.json';
import { SunMoon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'أذكار الصباح والمساء مكتوبة كاملة بالتشكيل مع عداد التكرار',
  description: 'أذكار الصباح والمساء الصحيحة المأثورة عن النبي ﷺ بالتشكيل الكامل، مع عداد تكرار تفاعلي ذكي، فضل كل ذكر، وشريط إنجاز يومي يحفظ محلياً دون اتصال بالإنترنت.',
  keywords: [
    'أذكار الصباح',
    'أذكار المساء',
    'أذكار الصباح والمساء مكتوبة',
    'سيد الاستغفار',
    'آية الكرسي في الأذكار',
    'المعوذات',
    'أصبحنا وأصبح الملك لله',
    'أمسينا وأمسى الملك لله',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/adhkar`,
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
    title: 'أذكار الصباح والمساء مكتوبة كاملة بالتشكيل | دُعَاء',
    description: 'أذكار الصباح والمساء الصحيحة المأثورة مع عداد تكرار تفاعلي وتتبع للإنجاز.',
    url: `${SITE_CONFIG.siteUrl}/adhkar`,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'article',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('أذكار الصباح والمساء')}&category=${encodeURIComponent('الحصن اليومي')}`,
        width: 1200,
        height: 630,
        alt: 'أذكار الصباح والمساء',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أذكار الصباح والمساء مكتوبة كاملة | دُعَاء',
    description: 'أذكار الصباح والمساء الصحيحة المأثورة مع عداد تكرار تفاعلي وتتبع للإنجاز.',
    images: [`${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('أذكار الصباح والمساء')}&category=${encodeURIComponent('الحصن اليومي')}`],
  },
};

export default function AdhkarPage() {
  const breadcrumbSchema = getBreadcrumbSchema('adhkar', 'أذكار الصباح والمساء');
  const morningListSchema = getItemListSchema(
    'أذكار الصباح الصحيحة',
    duasData.adhkar.morning.map((d) => ({ name: d.title, text: d.text }))
  );
  const eveningListSchema = getItemListSchema(
    'أذكار المساء الصحيحة',
    duasData.adhkar.evening.map((d) => ({ name: d.title, text: d.text }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(morningListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eveningListSchema) }}
      />

      <div className="w-full flex flex-col gap-5 pb-12">
        {/* Main H1 Heading */}
        <header className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <SunMoon className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-amber-400">الحصن اليومي</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 font-quran">
            أذكار الصباح والمساء
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            حصن المسلم اليومي بأذكار الصباح والمساء النبوية الصحيحة كاملة بالتشكيل مع عداد تنازلي تفاعلي لكل ذكر
          </p>
        </header>

        {/* Client Interactive Area */}
        <Suspense fallback={<div className="py-12 text-center text-zinc-500 text-xs">جارٍ تحميل الأذكار...</div>}>
          <AdhkarClient />
        </Suspense>
      </div>
    </>
  );
}
