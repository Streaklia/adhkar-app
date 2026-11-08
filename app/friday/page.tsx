import type { Metadata } from 'next';
import FridayClient from '@/components/views/FridayClient';
import { SITE_CONFIG } from '@/lib/site-config';
import { getBreadcrumbSchema, getItemListSchema } from '@/lib/schema-helper';
import duasData from '@/data/duas.json';
import { CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سنن وأدعية يوم الجمعة وسورة الكهف وعداد ساعة الاستجابة',
  description: 'سنن وآداب يوم الجمعة المباركة، عداد الصلاة على النبي ﷺ، متتبع قراءة سورة الكهف بأقسامها الأربعة، ومؤقت تنازلي حي لساعة الاستجابة قبل غروب الشمس.',
  keywords: [
    'يوم الجمعة',
    'سنن الجمعة',
    'سورة الكهف',
    'الصلاة على النبي',
    'ساعة الاستجابة يوم الجمعة',
    'أدعية الجمعة',
    'فضل يوم الجمعة',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/friday`,
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
    title: 'سنن وأدعية يوم الجمعة وسورة الكهف وعداد الاستجابة | دُعَاء',
    description: 'سنن الجمعة المباركة، الصلاة على النبي ﷺ، متتبع سورة الكهف، ومؤقت ساعة الاستجابة.',
    url: `${SITE_CONFIG.siteUrl}/friday`,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'article',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('سنن وأدعية يوم الجمعة')}&category=${encodeURIComponent('سيد الأيام')}`,
        width: 1200,
        height: 630,
        alt: 'سنن وأدعية يوم الجمعة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سنن وأدعية يوم الجمعة وسورة الكهف | دُعَاء',
    description: 'سنن الجمعة المباركة، الصلاة على النبي ﷺ، متتبع سورة الكهف، ومؤقت ساعة الاستجابة.',
    images: [`${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('سنن وأدعية يوم الجمعة')}&category=${encodeURIComponent('سيد الأيام')}`],
  },
};

export default function FridayPage() {
  const breadcrumbSchema = getBreadcrumbSchema('friday', 'يوم الجمعة');
  const sunnahsListSchema = getItemListSchema(
    'سنن وأدعية يوم الجمعة',
    duasData.friday.sunnahs.map((s) => ({ name: s.title, text: s.desc }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sunnahsListSchema) }}
      />

      <div className="w-full flex flex-col gap-5 pb-12">
        {/* Main H1 Heading */}
        <header className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CalendarDays className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">سيد الأيام</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 font-quran">
            سنن وأدعية يوم الجمعة وساعة الاستجابة
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            خير يوم طلعت عليه الشمس، فيه ساعة لا يوافقها عبد مسلم يسأل الله خيراً إلا آتاه إياه
          </p>
        </header>

        {/* Client Interactive Area */}
        <FridayClient />
      </div>
    </>
  );
}
