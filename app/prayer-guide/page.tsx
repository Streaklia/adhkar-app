import type { Metadata } from 'next';
import PrayerGuideClient from '@/components/views/PrayerGuideClient';
import { SITE_CONFIG } from '@/lib/site-config';
import { getBreadcrumbSchema, getItemListSchema, getFAQSchema } from '@/lib/schema-helper';
import duasData from '@/data/duas.json';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'دليل الصلاة خطوة بخطوة بالتشكيل مع اقتراح سور جزء عم',
  description: 'دليل شامل لصفة الصلاة الصحيحة وما يقال في كل ركن من تكبيرة الإحرام والركوع والسجود إلى التشهد والتسليم، مع ميزة اقتراح سورتين للصلاة من قصار السور.',
  keywords: [
    'دليل الصلاة',
    'صفة الصلاة الصحيحة',
    'ما يقال في الركوع',
    'ما يقال في السجود',
    'دعاء الاستفتاح',
    'التشهد الأخير والصلاة الإبراهيمية',
    'سور قصيرة للصلاة',
    'جزء عم',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/prayer-guide`,
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
    title: 'دليل الصلاة خطوة بخطوة بالتشكيل | دُعَاء',
    description: 'تعلم صفة الصلاة النبوية الصحيحة وما يقال في كل ركن مع ميزة اقتراح سور للصلاة.',
    url: `${SITE_CONFIG.siteUrl}/prayer-guide`,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'article',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('دليل الصلاة وقصار السور')}&category=${encodeURIComponent('تعليمي فقهي')}`,
        width: 1200,
        height: 630,
        alt: 'دليل الصلاة وقصار السور',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دليل الصلاة خطوة بخطوة | دُعَاء',
    description: 'تعلم صفة الصلاة النبوية الصحيحة وما يقال في كل ركن مع ميزة اقتراح سور للصلاة.',
    images: [`${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent('دليل الصلاة وقصار السور')}&category=${encodeURIComponent('تعليمي فقهي')}`],
  },
};

export default function PrayerGuidePage() {
  const breadcrumbSchema = getBreadcrumbSchema('prayer-guide', 'دليل الصلاة');
  const stepsListSchema = getItemListSchema(
    'خطوات وأركان الصلاة',
    duasData.prayer_guide.steps.map((s) => ({ name: s.title, text: `${s.action} - ما يقال: ${s.arabic}` }))
  );
  const faqSchema = getFAQSchema([
    {
      question: 'ما هو دعاء الاستفتاح في الصلاة؟',
      answer: 'يقال سراً بعد تكبيرة الإحرام وقبل الفاتحة: (سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ).',
    },
    {
      question: 'ماذا يقال في الركوع والرفع منه؟',
      answer: 'في الركوع يقال ثلاثاً: (سُبْحَانَ رَبِّيَ الْعَظِيمِ). وعند الرفع يقول الإمام والمنفرد: (سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ)، ويقول الجميع: (رَبَّنَا وَلَكَ الْحَمْدُ، حَمْداً كَثِيراً طَيِّباً مُبَارَكاً فِيهِ).',
    },
    {
      question: 'ماذا يقال في السجود وبين السجدتين؟',
      answer: 'في السجود يقال ثلاثاً: (سُبْحَانَ رَبِّيَ الْأَعْلَى) ويكثر من الدعاء. وبين السجدتين يقال: (رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي).',
    },
    {
      question: 'ما هو نص التشهد الأخير والصلاة الإبراهيمية؟',
      answer: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. ثم الصلاة الإبراهيمية.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stepsListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full flex flex-col gap-5 pb-12">
        {/* Main H1 Heading */}
        <header className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-cyan-400">تعليم الصلاة</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 font-quran">
            دليل الصلاة خطوة بخطوة وقصار السور
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            صفة الصلاة النبوية الشريفة وما يقال في كل ركن مع اقتراح سور من جزء عم للتنويع في الركعات
          </p>
        </header>

        {/* Client Interactive Area */}
        <PrayerGuideClient />

        {/* Semantic SEO FAQ Section */}
        <section className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col gap-4" aria-label="الأسئلة الشائعة حول صفة الصلاة">
          <h2 className="text-sm sm:text-base font-bold text-zinc-200">
            الأسئلة الشائعة حول صفة وأذكار الصلاة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col gap-2">
              <h3 className="font-bold text-cyan-300">ماذا يقال في دعاء الاستفتاح؟</h3>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ. يقال بعد تكبيرة الإحرام وقبل الفاتحة.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col gap-2">
              <h3 className="font-bold text-cyan-300">ما فضل الدعاء في السجود؟</h3>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                قال رسول الله ﷺ: «أقرب ما يكون العبد من ربه وهو ساجد فأكثروا الدعاء»، فيجمع المصلي بين التسبيح والدعاء بما يحب.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
