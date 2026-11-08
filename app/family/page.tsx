import type { Metadata } from 'next';
import FamilyClient from '@/components/views/FamilyClient';
import { SITE_CONFIG } from '@/lib/site-config';
import { getBreadcrumbSchema, getItemListSchema } from '@/lib/schema-helper';
import duasData from '@/data/duas.json';
import { HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'أدعية الوالدين والأهل والأبناء مع مشاركة واتساب',
  description: 'أدعية بر الوالدين أحياء ومتوفين، وصلة الرحم والإخوة، وحفظ الأبناء والزوجة والبيت من القرآن والسنة، مع زر مشاركة مباشر بلمسة واحدة عبر تطبيق واتساب.',
  keywords: [
    'أدعية الوالدين',
    'دعاء للوالدين المتوفين',
    'دعاء للوالدين الأحياء',
    'بر الوالدين',
    'دعاء للأبناء',
    'دعاء للإخوة والأخوات',
    'مشاركة دعاء واتساب',
    'رب ارحمهما كما ربياني صغيرا',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/family`,
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
    title: 'أدعية الوالدين والأهل والأبناء مع مشاركة واتساب | دُعَاء',
    description: 'أدعية بر الوالدين أحياء ومتوفين وصلة الرحم وحفظ الأبناء مع زر مشاركة فوري عبر واتساب.',
    url: `${SITE_CONFIG.siteUrl}/family`,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'article',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('أدعية الوالدين والأهل')}&category=${encodeURIComponent('بر وصلة رحم')}`,
        width: 1200,
        height: 630,
        alt: 'أدعية الوالدين والأهل',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أدعية الوالدين والأهل والأبناء | دُعَاء',
    description: 'أدعية بر الوالدين أحياء ومتوفين وصلة الرحم وحفظ الأبناء مع زر مشاركة فوري عبر واتساب.',
    images: [`${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('أدعية الوالدين والأهل')}&category=${encodeURIComponent('بر وصلة رحم')}`],
  },
};

export default function FamilyPage() {
  const breadcrumbSchema = getBreadcrumbSchema('family', 'أدعية الوالدين والأهل');
  const familyListSchema = getItemListSchema(
    'أدعية بر الوالدين والأسرة',
    duasData.family.map((d) => ({ name: d.title, text: d.text }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(familyListSchema) }}
      />

      <div className="w-full flex flex-col gap-5 pb-12">
        {/* Main H1 Heading */}
        <header className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-rose-400">صلة وبر</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 font-quran">
            أدعية الوالدين والأهل والأبناء
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            أدعية بر الوالدين أحياء ومتوفين وصلة الرحم والإخوة والأبناء مع زر مشاركة سريع ومباشر عبر واتساب
          </p>
        </header>

        {/* Client Interactive Area */}
        <FamilyClient />
      </div>
    </>
  );
}
