import type { Metadata } from 'next';
import AfterPrayerClient from '@/components/views/AfterPrayerClient';
import { SITE_CONFIG } from '@/lib/site-config';
import { getBreadcrumbSchema, getItemListSchema, getFAQSchema } from '@/lib/schema-helper';
import duasData from '@/data/duas.json';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'أذكار ما بعد الصلاة المفروضة مكتوبة بالتشكيل',
  description: 'الأذكار الصحيحة المأثورة عن النبي ﷺ بعد السلام من الصلاة المكتوبة، مع بطاقات عد تنازلية تفاعلية وتتبع التكرار لآية الكرسي والمعوذات والتسبيح.',
  keywords: [
    'أذكار بعد الصلاة',
    'أذكار ما بعد الصلاة المفروضة',
    'آية الكرسي بعد الصلاة',
    'التسبيح بعد الصلاة',
    'أستغفر الله اللهم أنت السلام',
    'أذكار الصلاة المكتوبة',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/after-prayer`,
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
    title: 'أذكار ما بعد الصلاة المفروضة مكتوبة بالتشكيل | دُعَاء',
    description: 'الأذكار الصحيحة المأثورة عن النبي ﷺ بعد السلام من الصلاة المكتوبة مع بطاقات تفاعلية.',
    url: `${SITE_CONFIG.siteUrl}/after-prayer`,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'article',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('أذكار ما بعد الصلاة')}&category=${encodeURIComponent('الأذكار المأثورة')}`,
        width: 1200,
        height: 630,
        alt: 'أذكار ما بعد الصلاة المفروضة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أذكار ما بعد الصلاة المفروضة | دُعَاء',
    description: 'الأذكار الصحيحة المأثورة عن النبي ﷺ بعد السلام من الصلاة المكتوبة مع بطاقات تفاعلية.',
    images: [`${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('أذكار ما بعد الصلاة')}&category=${encodeURIComponent('الأذكار المأثورة')}`],
  },
};

export default function AfterPrayerPage() {
  const breadcrumbSchema = getBreadcrumbSchema('after-prayer', 'أذكار ما بعد الصلاة');
  const itemListSchema = getItemListSchema(
    'أذكار ما بعد الصلاة المفروضة',
    duasData.after_prayer.map((d) => ({ name: d.title, text: d.text }))
  );
  const faqSchema = getFAQSchema([
    {
      question: 'ما هو أول ما يقوله المصلي بعد السلام من الصلاة المفروضة؟',
      answer: 'يستغفر الله ثلاثاً قائلاً: (أستغفر الله، أستغفر الله، أستغفر الله)، ثم يقول: (اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام).',
    },
    {
      question: 'ما فضل قراءة آية الكرسي بعد كل صلاة مكتوبة؟',
      answer: 'قال رسول الله ﷺ: «من قرأ آية الكرسي دُبُرَ كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت» (رواه النسائي وصححه الألباني).',
    },
    {
      question: 'كيف يكون التسبيح والتحميد والتكبير بعد الصلاة؟',
      answer: 'يسبح الله ثلاثاً وثلاثين (سبحان الله)، ويحمده ثلاثاً وثلاثين (الحمد لله)، ويكبره ثلاثاً وثلاثين (الله أكبر)، ويقول تمام المائة: لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.',
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full flex flex-col gap-5 pb-12">
        {/* Main H1 Heading */}
        <header className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">أذكار الصلاة</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 font-quran">
            أذكار ما بعد الصلاة المفروضة
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            الأذكار المأثورة الثابتة عن النبي ﷺ عقب التسليم من الفريضة بالتشكيل الصحيح وتكراراتها المسنونة
          </p>
        </header>

        {/* Client Interactive Area */}
        <AfterPrayerClient />

        {/* Semantic SEO FAQ Section (Pre-rendered for crawlers) */}
        <section className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col gap-4" aria-label="الأسئلة الشائعة حول أذكار بعد الصلاة">
          <h2 className="text-sm sm:text-base font-bold text-zinc-200">
            أسئلة شائعة وفضائل أذكار بعد الصلاة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col gap-2">
              <h3 className="font-bold text-emerald-300">أول ما يقال بعد السلام؟</h3>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                الاستغفار ثلاثاً ثم قول: «اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام».
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col gap-2">
              <h3 className="font-bold text-emerald-300">فضل آية الكرسي دبر الصلوات؟</h3>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                من قرأها دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا الموت كما صح في الحديث النبوي.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col gap-2">
              <h3 className="font-bold text-emerald-300">صيغة التسبيح المئة؟</h3>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                سبحان الله (33)، الحمد لله (33)، الله أكبر (33)، وختامها بالتهليل لمغفرة الخطايا.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
