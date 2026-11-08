import type { Metadata, Viewport } from 'next';
import { Cairo, Amiri } from 'next/font/google';
import './globals.css';
import { AppSettingsProvider } from '@/lib/theme-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { SITE_CONFIG } from '@/lib/site-config';
import { getWebsiteSchema, getWebApplicationSchema } from '@/lib/schema-helper';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: SITE_CONFIG.name,
    template: '%s | دُعَاء',
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.shortName,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
  manifest: '/manifest.json',
  keywords: [
    'أذكار',
    'تسبيح',
    'أذكار الصباح والمساء',
    'أذكار بعد الصلاة',
    'دليل الصلاة',
    'أدعية السفر',
    'يوم الجمعة',
    'سورة الكهف',
    'أدعية الوالدين',
    'عداد تسبيح ذكي',
    'تطبيق إسلامي',
    'OLED Tasbih',
    'Islamic Duas',
    'Adhkar PWA',
  ],
  alternates: {
    canonical: SITE_CONFIG.siteUrl,
    types: {
      'application/rss+xml': `${SITE_CONFIG.siteUrl}/feed.xml`,
    },
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
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.shortName,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.siteUrl}/opengraph-image`],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'دُعَاء',
  },
  verification: {
    google: 'e0KcFmXhFs4disyf3M0bSCdHpb9Uf1KgyT2I1ANj4K4',
  },
  other: {
    'google-site-verification': 'e0KcFmXhFs4disyf3M0bSCdHpb9Uf1KgyT2I1ANj4K4',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = getWebsiteSchema();
  const webAppSchema = getWebApplicationSchema();

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable} oled-mode`}>
      <head>
        <meta name="google-site-verification" content="e0KcFmXhFs4disyf3M0bSCdHpb9Uf1KgyT2I1ANj4K4" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="alternate" type="application/rss+xml" title="دُعَاء RSS Feed" href="/feed.xml" />
        {/* Structured Data: WebSite & WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>
      <body className="bg-[var(--bg-main)] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30">
        <AppSettingsProvider>
          <ServiceWorkerRegister />
          {/* Responsive full-width container on Desktop & Mobile */}
          <div className="w-full max-w-6xl mx-auto min-h-screen flex flex-col relative px-4 sm:px-6 lg:px-8 pb-12 pt-3">
            <Header />
            <main className="flex-1 flex flex-col w-full" id="main-content">
              {children}
            </main>
            <Footer />
            <SearchModal />
          </div>
        </AppSettingsProvider>
      </body>
    </html>
  );
}
