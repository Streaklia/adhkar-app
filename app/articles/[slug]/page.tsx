import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import articlesData from '@/data/articles.json';
import { SITE_CONFIG } from '@/lib/site-config';
import { 
  getArticleSchema, 
  getFAQSchema, 
  getArticleBreadcrumbSchema 
} from '@/lib/schema-helper';
import { ArticleItem } from '@/lib/types';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  HelpCircle,
  BookmarkCheck,
  ChevronLeft
} from 'lucide-react';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return (articlesData as ArticleItem[]).map((a) => ({
    slug: a.slug,
  }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = (articlesData as ArticleItem[]).find((a) => a.slug === params.slug);

  if (!article) {
    return {
      title: 'المقال غير موجود',
      description: 'عذراً، المقال المطلوب غير متوفر.',
    };
  }

  const articleUrl = `${SITE_CONFIG.siteUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: articleUrl,
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
      title: `${article.title} | دُعَاء`,
      description: article.description,
      url: articleUrl,
      siteName: SITE_CONFIG.shortName,
      locale: SITE_CONFIG.locale,
      type: 'article',
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      section: article.category,
      tags: article.keywords,
      images: [
        {
          url: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [
        `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`,
      ],
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = (articlesData as ArticleItem[]).find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = getArticleSchema(article);
  const faqJsonLd = getFAQSchema(article.faqs);
  const breadcrumbJsonLd = getArticleBreadcrumbSchema(article.slug, article.title);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-16">
        {/* Breadcrumb Navigation Bar */}
        <nav aria-label="مسار التصفح" className="flex items-center gap-1.5 text-xs text-zinc-400 py-1 flex-wrap">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            الرئيسية
          </Link>
          <span className="text-zinc-600">/</span>
          <Link href="/articles" className="hover:text-emerald-400 transition-colors">
            المقالات والأحاديث
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 font-medium truncate max-w-[240px] sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="flex flex-col gap-4 border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-900/60 px-3 py-1 rounded-full">
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>وقت القراءة: {article.readingTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <time dateTime={article.datePublished}>
                {new Date(article.datePublished).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-100 font-quran leading-relaxed">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {article.subtitle}
          </p>
        </header>

        {/* Table of Contents (فهرس المقال) */}
        {article.tableOfContents && article.tableOfContents.length > 0 && (
          <nav
            aria-label="فهرس المقال"
            className="w-full rounded-2xl bg-zinc-950/90 border border-zinc-800 p-5 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span>فهرس المقال ومحاور البحث</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400 pt-1">
              {article.tableOfContents.map((item, idx) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex items-center gap-2 hover:text-emerald-400 transition-colors py-1 group"
                  >
                    <span className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[10px] text-zinc-500 group-hover:border-emerald-500/50 group-hover:text-emerald-400">
                      {idx + 1}
                    </span>
                    <span className="line-clamp-1">{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Article Body Sections */}
        <div className="flex flex-col gap-8 text-zinc-200 leading-loose">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 flex flex-col gap-3.5">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-300 font-quran border-r-4 border-emerald-500 pr-3 leading-snug">
                {section.heading}
              </h2>

              <div className="text-sm sm:text-base text-zinc-300 font-normal leading-loose whitespace-pre-line space-y-2">
                {section.content}
              </div>

              {/* Hadith Citation Blocks if present */}
              {section.hadiths && section.hadiths.length > 0 && (
                <div className="flex flex-col gap-3 my-2">
                  {section.hadiths.map((h, hIdx) => (
                    <blockquote
                      key={hIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-l from-emerald-950/30 to-zinc-950 border border-emerald-900/50 relative shadow-sm"
                    >
                      <p className="font-quran text-base sm:text-lg text-emerald-200 font-medium leading-loose mb-2">
                        «{h.text}»
                      </p>
                      <footer className="text-xs text-zinc-400 font-mono flex items-center justify-between border-t border-zinc-900 pt-2 flex-wrap gap-2">
                        <span className="text-zinc-400">التخريج: {h.source}</span>
                        {h.grade && (
                          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                            درجة الحديث: {h.grade}
                          </span>
                        )}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Related App Tool Banner (Internal linking for tool usage) */}
        {article.relatedAppTool && (
          <div className="w-full rounded-2xl bg-gradient-to-l from-emerald-950/70 via-zinc-950 to-zinc-950 border border-emerald-500/40 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-2">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                خدمة تفاعلية مرتبطة بالمقال
              </span>
              <h3 className="text-base sm:text-lg font-bold text-zinc-100 font-quran">
                {article.relatedAppTool.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                يمكنك الآن تجربة هذا الذكر مباشرة مع العداد التفاعلي وحفظ الإنجاز
              </p>
            </div>
            <Link
              href={article.relatedAppTool.link}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950 active:scale-95 transition-all shrink-0"
              title={article.relatedAppTool.label}
            >
              <span>{article.relatedAppTool.label}</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Dedicated FAQ Section for Google Rich Snippets */}
        {article.faqs && article.faqs.length > 0 && (
          <section id="faq" className="scroll-mt-24 pt-6 border-t border-zinc-800/80 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base sm:text-xl font-bold text-zinc-100 font-quran">
                الأسئلة الشائعة والأحكام الفقهية المتعلقة بالمقال
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {article.faqs.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 sm:p-5 shadow-sm flex flex-col gap-2"
                >
                  <h3 className="text-sm sm:text-base font-bold text-emerald-300 font-quran flex items-start gap-2">
                    <span className="text-emerald-500 font-mono text-sm shrink-0">س{fIdx + 1}:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pr-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Back & Social Share */}
        <footer className="pt-6 border-t border-zinc-800/80 flex items-center justify-between gap-4 flex-wrap text-xs">
          <Link
            href="/articles"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 transition-colors font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى قائمة المقالات والأحاديث</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500">تطبيق دُعَاء • مرجع الأذكار والسنة</span>
          </div>
        </footer>
      </article>
    </>
  );
}
