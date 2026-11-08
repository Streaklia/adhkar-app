import type { Metadata } from 'next';
import TasbihHero from '@/components/TasbihHero';
import TimeAwareBanner from '@/components/TimeAwareBanner';
import NavGrid from '@/components/NavGrid';
import { SITE_CONFIG } from '@/lib/site-config';
import { getWebsiteSchema, getWebApplicationSchema } from '@/lib/schema-helper';

export const metadata: Metadata = {
  title: 'دُعَاء | أذكار وتسبيح يومي فائق البساطة',
  description: 'تطبيق إسلامي فائق البساطة للأذكار والتسبيح اليومي، متوافق بالكامل مع الجوال والحاسوب، يعمل دون اتصال بالإنترنت مع دعم وضع OLED Black والتنقل بلوحة المفاتيح.',
  keywords: [
    'تسبيح إلكتروني',
    'أذكار المسلم',
    'أذكار الصباح والمساء',
    'أذكار بعد الصلاة',
    'دليل الصلاة',
    'أدعية السفر',
    'سورة الكهف يوم الجمعة',
    'عداد تسبيح ذكي',
  ],
  alternates: {
    canonical: SITE_CONFIG.siteUrl,
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
    title: 'دُعَاء | أذكار وتسبيح يومي فائق البساطة',
    description: 'تطبيق إسلامي فائق البساطة للأذكار والتسبيح اليومي، متوافق بالكامل مع الجوال والحاسوب، يعمل دون اتصال بالإنترنت.',
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'دُعَاء | أذكار وتسبيح يومي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دُعَاء | أذكار وتسبيح يومي فائق البساطة',
    description: 'تطبيق إسلامي فائق البساطة للأذكار والتسبيح اليومي مع دعم وضع OLED الأسود وبدون إنترنت.',
    images: [`${SITE_CONFIG.siteUrl}/opengraph-image`],
  },
};

export default function HomePage() {
  const websiteJsonLd = getWebsiteSchema();
  const webAppJsonLd = getWebApplicationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      <div className="w-full flex flex-col items-center flex-1">
        {/* Main H1 Title for Semantic On-Page SEO */}
        <header className="w-full text-center pt-1 pb-3">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-zinc-100 font-quran tracking-wide">
            دُعَاء | الأذكار والتسبيح اليومي
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl mx-auto leading-relaxed">
            عداد تفاعلي ذكي، أذكار الصباح والمساء، دليل الصلاة، وأدعية السفر بدون اتصال بالإنترنت
          </p>
        </header>

        {/* Hero Section & Smart Banner */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          <TasbihHero />
          <TimeAwareBanner />
        </div>

        {/* Main Navigation Grid (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
        <div className="w-full">
          <NavGrid />
        </div>
      </div>
    </>
  );
}
