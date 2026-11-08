import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/lib/site-config';

export async function GET() {
  const baseUrl = SITE_CONFIG.siteUrl;

  const content = `# دُعَاء | Doua & Tasbih

> ${SITE_CONFIG.description}

- Website: ${baseUrl}
- Language: Arabic (ar)
- Direction: RTL
- Architecture: Next.js 14 App Router, PWA Offline-ready, OLED Black Mode (#000000).

## Sections & URLs

- [الرئيسية - العداد التفاعلي وشبكة الأذكار](${baseUrl}/)
  عداد تسبيح تفاعلي ذكي يتوهج بالأخضر من 1 إلى 32 وبالأحمر عند 33 مع اهتزاز تلمسي، وشريط زمني حي حسب وقت اليوم وساعة استجابة الجمعة.

- [أذكار ما بعد الصلاة](${baseUrl}/after-prayer)
  الأذكار المأثورة الصحيحة بعد السلام من الصلوات المفروضة مع بطاقات تكرار تفاعلية تنقص بالضغط وتنتقل تلقائياً للذكر التالي.

- [أذكار الصباح والمساء](${baseUrl}/adhkar)
  أذكار الصباح والمساء كاملة ومضبوطة بالشكل مع عداد التكرار الذكي، فضل كل ذكر، وشريط تقدم يومي يحفظ محلياً دون اتصال بالإنترنت.

- [دليل الصلاة وقصار السور](${baseUrl}/prayer-guide)
  دليل شامل خطوة بخطوة لما يقال في كل ركن من أركان الصلاة من تكبيرة الإحرام إلى التسليم، مع ميزة اقتراح سورتين عشوائيتين من جزء عم.

- [أدعية السفر والطريق](${baseUrl}/travel)
  أدعية السفر والركوب مكتوبة بخط كبير عالي الوضوح، مع خاصية الاستماع الصوتي التلقائي (TTS) للسائقين والمسافرين دون النظر للشاشة.

- [سنن وأدعية يوم الجمعة](${baseUrl}/friday)
  سنن الجمعة، عداد الصلاة على النبي ﷺ، متتبع قراءة سورة الكهف بأقسامها الأربعة، ومؤقت تنازلي حي لساعة الاستجابة قبل غروب الشمس.

- [أدعية الوالدين والأهل](${baseUrl}/family)
  أدعية بر الوالدين أحياء ومتوفين، صلة الرحم، وحفظ الأبناء والعائلة، مع زر إرسال مباشر بلمسة واحدة عبر واتساب.

## Machine-Readable Resources

- Sitemap: ${baseUrl}/sitemap.xml
- RSS Feed: ${baseUrl}/feed.xml
- Full LLM Knowledge Base: ${baseUrl}/llms-full.txt
- Robots: ${baseUrl}/robots.txt
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
