'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  SunMoon, 
  BookOpen, 
  Compass, 
  CalendarDays, 
  HeartHandshake,
  ArrowLeft
} from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export default function NavGrid() {
  const items: NavItem[] = [
    {
      id: 'after-prayer',
      title: 'بَعْدَ الصَّلَاةِ',
      slug: '/after-prayer',
      description: 'أذكار الاستغفار والسلام وآية الكرسي والتسبيح بعد الصلاة المفروضة',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      badge: 'مأثورة',
      badgeColor: 'border-emerald-800 text-emerald-400 bg-emerald-950/50',
    },
    {
      id: 'adhkar',
      title: 'أَذْكَارُ الصَّبَاحِ وَالمَسَاءِ',
      slug: '/adhkar',
      description: 'حصنك الحصين وبركة اليوم والليلة مع عداد تفاعلي وتتبع للإنجاز',
      icon: <SunMoon className="w-5 h-5 text-amber-400" />,
      badge: 'يومي',
      badgeColor: 'border-amber-800 text-amber-400 bg-amber-950/50',
    },
    {
      id: 'prayer-guide',
      title: 'دَلِيلُ الصَّلَاةِ وَالسُّوَرِ',
      slug: '/prayer-guide',
      description: 'صفة الصلاة خطوة بخطوة مع ميزة اقتراح سورتين للصلاة من جزء عم',
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
      badge: 'تعليمي',
      badgeColor: 'border-cyan-800 text-cyan-400 bg-cyan-950/50',
    },
    {
      id: 'travel',
      title: 'أَدْعِيَةُ السَّفَرِ وَالطَّرِيقِ',
      slug: '/travel',
      description: 'دعاء الركوب والسفر بخط كبير عالي الوضوح مع قراءة صوتية للسائق',
      icon: <Compass className="w-5 h-5 text-indigo-400" />,
      badge: 'صوتي',
      badgeColor: 'border-indigo-800 text-indigo-400 bg-indigo-950/50',
    },
    {
      id: 'friday',
      title: 'سُنَنُ وَأَدْعِيَةُ الجُمُعَةِ',
      slug: '/friday',
      description: 'الصلاة على النبي ﷺ، متتبع سورة الكهف، ومؤقت ساعة الاستجابة للغروب',
      icon: <CalendarDays className="w-5 h-5 text-emerald-400" />,
      badge: 'مستحب',
      badgeColor: 'border-emerald-800 text-emerald-400 bg-emerald-950/50',
    },
    {
      id: 'family',
      title: 'الوَالِدَيْنِ وَالأَهْلِ',
      slug: '/family',
      description: 'بر الوالدين وصلة الرحم والأبناء مع زر مشاركة فوري عبر واتساب',
      icon: <HeartHandshake className="w-5 h-5 text-rose-400" />,
      badge: 'مشاركة',
      badgeColor: 'border-rose-800 text-rose-400 bg-rose-950/50',
    },
  ];

  return (
    <section aria-label="أقسام الأذكار والأدعية" className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
            <span>أقسام الأذكار والأدعية</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            وصول سريع ومنظم لجميع الأبواب الإسلامية
          </p>
        </div>
      </div>

      {/* Spacious 3-column grid on desktop, 2-column on tablet, 1 or 2-column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.slug}
            title={`تصفح ${item.title}`}
            aria-label={`تصفح قسم ${item.title}`}
            className="group relative flex flex-col justify-between p-5 rounded-2xl bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/40 active:scale-[0.98] transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-950/20"
          >
            <div>
              {/* Card Header with Icon and Badge */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:scale-110 group-hover:border-zinc-700 transition-all shadow-inner">
                  {item.icon}
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-zinc-100 group-hover:text-emerald-300 tracking-wide font-quran text-base sm:text-lg mb-1.5 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Bottom Arrow Indicator */}
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 group-hover:text-emerald-400 transition-colors">
              <span className="text-[11px] font-medium">فتح القسم</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
