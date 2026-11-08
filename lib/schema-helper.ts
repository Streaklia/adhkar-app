import { SITE_CONFIG } from './site-config';

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    url: SITE_CONFIG.siteUrl,
    inLanguage: 'ar',
    description: SITE_CONFIG.description,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.shortName,
      url: SITE_CONFIG.siteUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_CONFIG.name,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript and HTML5 support',
    inLanguage: 'ar',
    url: SITE_CONFIG.siteUrl,
    description: SITE_CONFIG.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'عداد تسبيح تفاعلي بالاهتزاز والألوان التنبيهية',
      'دعم العمل دون اتصال بالإنترنت (PWA)',
      'وضع أسود حقيقي لشاشات OLED',
      'أذكار الصباح والمساء وأذكار ما بعد الصلاة',
      'قراءة صوتية لأدعية السفر بدون لمس الشاشة',
      'مؤقت حي لساعة الاستجابة يوم الجمعة',
      'مشاركة الأدعية بلمسة واحدة عبر واتساب',
    ],
  };
}

export function getBreadcrumbSchema(slug: string, title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: SITE_CONFIG.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: `${SITE_CONFIG.siteUrl}/${slug}`,
      },
    ],
  };
}

export function getItemListSchema(title: string, items: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      description: item.text,
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getArticleBreadcrumbSchema(articleSlug: string, articleTitle: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: SITE_CONFIG.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المقالات والأحاديث',
        item: `${SITE_CONFIG.siteUrl}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: articleTitle,
        item: `${SITE_CONFIG.siteUrl}/articles/${articleSlug}`,
      },
    ],
  };
}

export function getArticleSchema(article: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  category: string;
  keywords: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: `${SITE_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: 'ar',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.siteUrl}/articles/${article.slug}`,
    },
    author: {
      '@type': 'Organization',
      name: 'أذكار - Adhkarr',
      url: SITE_CONFIG.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'أذكار - Adhkarr',
      url: SITE_CONFIG.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.siteUrl}/icon.svg`,
      },
    },
    articleSection: article.category,
    keywords: article.keywords.join(', '),
  };
}

