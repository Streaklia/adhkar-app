import type { Metadata } from 'next';
import TravelClient from '@/components/views/TravelClient';
import { SITE_CONFIG } from '@/lib/site-config';
import { getBreadcrumbSchema, getItemListSchema } from '@/lib/schema-helper';
import duasData from '@/data/duas.json';
import { Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'أدعية السفر والطريق مكتوبة بالتشكيل مع القراءة الصوتية',
  description: 'أدعية السفر الصحيحة المأثورة وركوب الدابة والسيارة والطائرة مكتوبة بخط كبير عالي الوضوح، مع خاصية الاستماع الصوتي المباشر دون الحاجة للنظر للشاشة أثناء القيادة.',
  keywords: [
    'دعاء السفر',
    'دعاء ركوب السيارة',
    'دعاء السفر كامل',
    'دعاء الرجوع من السفر',
    'دعاء السفر في الطائرة',
    'أدعية المسافر',
    'قراءة صوتية لدعاء السفر',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/travel`,
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
    title: 'أدعية السفر والطريق مكتوبة مع القراءة الصوتية | دُعَاء',
    description: 'أدعية السفر وركوب الدابة والسيارة بخط كبير عالي الوضوح مع خاصية الاستماع الصوتي.',
    url: `${SITE_CONFIG.siteUrl}/travel`,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'article',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('أدعية السفر والطريق')}&category=${encodeURIComponent('أدعية المسافر')}`,
        width: 1200,
        height: 630,
        alt: 'أدعية السفر والطريق',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أدعية السفر والطريق مع القراءة الصوتية | دُعَاء',
    description: 'أدعية السفر وركوب الدابة والسيارة بخط كبير مع خاصية الاستماع الصوتي.',
    images: [`${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('أدعية السفر والطريق')}&category=${encodeURIComponent('أدعية المسافر')}`],
  },
};

export default function TravelPage() {
  const breadcrumbSchema = getBreadcrumbSchema('travel', 'أدعية السفر');
  const travelListSchema = getItemListSchema(
    'أدعية السفر والطريق المأثورة',
    duasData.travel.map((d) => ({ name: d.title, text: d.text }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelListSchema) }}
      />

      <div className="w-full flex flex-col gap-5 pb-12">
        {/* Main H1 Heading */}
        <header className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-indigo-400">أدعية الطريق</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 font-quran">
            أدعية السفر والطريق وركوب الدابة
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            أدعية المسافر المأثورة عن النبي ﷺ بخط عالي التباين وقراءة صوتية تلقائية دون اتصال بالإنترنت
          </p>
        </header>

        {/* Client Interactive Area */}
        <TravelClient />
      </div>
    </>
  );
}
