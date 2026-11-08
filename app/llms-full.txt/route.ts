import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/lib/site-config';
import duasData from '@/data/duas.json';
import articlesData from '@/data/articles.json';
import { ArticleItem } from '@/lib/types';

export async function GET() {
  const baseUrl = SITE_CONFIG.siteUrl;

  let fullMarkdown = `# قاعدة المعرفة الكاملة لتطبيق دُعَاء (Doua Full Knowledge Base)

الموقع: ${baseUrl}
الوصف: ${SITE_CONFIG.description}
اللغة: العربية (Arabic)

---

# 1. أذكار ما بعد الصلاة المفروضة (${baseUrl}/after-prayer)

`;

  duasData.after_prayer.forEach((d, idx) => {
    fullMarkdown += `### ${idx + 1}. ${d.title} (${d.count}x)\n`;
    fullMarkdown += `${d.text}\n`;
    if (d.reference) fullMarkdown += `_المصدر: ${d.reference}_\n`;
    if (d.note) fullMarkdown += `_ملاحظة: ${d.note}_\n`;
    fullMarkdown += `\n`;
  });

  fullMarkdown += `---

# 2. أذكار الصباح (${baseUrl}/adhkar?time=morning)

`;

  duasData.adhkar.morning.forEach((d, idx) => {
    fullMarkdown += `### ${idx + 1}. ${d.title} (${d.count}x)\n`;
    fullMarkdown += `${d.text}\n`;
    if (d.virtue) fullMarkdown += `_الفضل: ${d.virtue}_\n`;
    fullMarkdown += `\n`;
  });

  fullMarkdown += `---

# 3. أذكار المساء (${baseUrl}/adhkar?time=evening)

`;

  duasData.adhkar.evening.forEach((d, idx) => {
    fullMarkdown += `### ${idx + 1}. ${d.title} (${d.count}x)\n`;
    fullMarkdown += `${d.text}\n`;
    if (d.virtue) fullMarkdown += `_الفضل: ${d.virtue}_\n`;
    fullMarkdown += `\n`;
  });

  fullMarkdown += `---

# 4. دليل الصلاة خطوة بخطوة (${baseUrl}/prayer-guide)

`;

  duasData.prayer_guide.steps.forEach((s) => {
    fullMarkdown += `### الخطوة ${s.step}: ${s.title}\n`;
    fullMarkdown += `**الفعل:** ${s.action}\n\n`;
    fullMarkdown += `**ما يقال:**\n${s.arabic}\n\n`;
    if (s.transliteration) fullMarkdown += `_Transliteration: ${s.transliteration}_\n`;
    if (s.note) fullMarkdown += `_ملاحظة: ${s.note}_\n`;
    fullMarkdown += `\n`;
  });

  fullMarkdown += `## قصار السور للصلاة من جزء عم:\n\n`;
  duasData.prayer_guide.short_surahs.forEach((surah) => {
    fullMarkdown += `### سورة ${surah.name} (${surah.ayah_count} آيات):\n`;
    fullMarkdown += `${surah.text}\n\n`;
  });

  fullMarkdown += `---

# 5. أدعية السفر والطريق (${baseUrl}/travel)

`;

  duasData.travel.forEach((t, idx) => {
    fullMarkdown += `### ${idx + 1}. ${t.title}\n`;
    fullMarkdown += `${t.text}\n`;
    fullMarkdown += `_المصدر: ${t.reference}_\n\n`;
  });

  fullMarkdown += `---

# 6. سنن وأدعية يوم الجمعة (${baseUrl}/friday)

## سنن الجمعة:
`;

  duasData.friday.sunnahs.forEach((s) => {
    fullMarkdown += `- **${s.title}:** ${s.desc}\n`;
  });

  fullMarkdown += `\n## الصلاة على النبي ﷺ:\n`;
  fullMarkdown += `${duasData.friday.salawat_counter.text} (الهدف: ${duasData.friday.salawat_counter.target})\n\n`;

  fullMarkdown += `## أدعية ساعة الاستجابة قبل غروب الشمس:\n`;
  duasData.friday.last_hour_dua.duas.forEach((d, idx) => {
    fullMarkdown += `${idx + 1}. ${d}\n\n`;
  });

  fullMarkdown += `## متتبع قراءة سورة الكهف:\n`;
  duasData.friday.kahf_sections.forEach((k) => {
    fullMarkdown += `- **${k.title} (${k.ayah_range}):** ${k.summary}\n`;
  });

  fullMarkdown += `\n---

# 7. أدعية الوالدين والأهل (${baseUrl}/family)

`;

  duasData.family.forEach((f, idx) => {
    fullMarkdown += `### ${idx + 1}. ${f.title} (${f.category_ar})\n`;
    fullMarkdown += `${f.text}\n\n`;
  });

  fullMarkdown += `---

# 8. مقالات وأحاديث الأذكار والسنن النبوية (${baseUrl}/articles)

`;

  (articlesData as ArticleItem[]).forEach((a, aIdx) => {
    fullMarkdown += `## 8.${aIdx + 1} ${a.title} (${baseUrl}/articles/${a.slug})\n`;
    fullMarkdown += `**التصنيف:** ${a.category} | **وقت القراءة:** ${a.readingTime}\n\n`;
    fullMarkdown += `> ${a.description}\n\n`;

    a.sections.forEach((sec) => {
      fullMarkdown += `### ${sec.heading}\n\n${sec.content}\n\n`;
      if (sec.hadiths) {
        sec.hadiths.forEach((h) => {
          fullMarkdown += `> «${h.text}»\n> — ${h.source}${h.grade ? ` (${h.grade})` : ''}\n\n`;
        });
      }
    });

    if (a.faqs && a.faqs.length > 0) {
      fullMarkdown += `#### الأسئلة الشائعة:\n\n`;
      a.faqs.forEach((faq) => {
        fullMarkdown += `**س: ${faq.question}**\n${faq.answer}\n\n`;
      });
    }

    fullMarkdown += `---\n\n`;
  });

  return new NextResponse(fullMarkdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
