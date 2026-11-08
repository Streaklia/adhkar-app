'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Moon, Rss, FileText, Compass, HeartHandshake, BookOpen, SunMoon } from 'lucide-react';
import { useAppSettings } from '@/lib/theme-context';

export default function Footer() {
  const { isOled, toggleOled } = useAppSettings();

  return (
    <footer className="w-full mt-16 pt-8 pb-6 border-t border-zinc-800/60 flex flex-col gap-6 text-zinc-500 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Col 1: About & mission */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-sm text-zinc-200">تطبيق دُعَاء</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400">
            تطبيق إسلامي فائق البساطة ومفتوح المصدر للأذكار اليومية والتسبيح، مصمم للهواتف والحواسيب بدون إعلانات وبدون تتبع، مع دعم كامل للعمل دون اتصال بالإنترنت.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-zinc-300 text-xs">أقسام التطبيق الرئيسية</span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <Link href="/after-prayer" title="أذكار ما بعد الصلاة المفروضة" className="hover:text-emerald-400 transition-colors">
              بعد الصلاة
            </Link>
            <Link href="/adhkar" title="أذكار الصباح والمساء" className="hover:text-emerald-400 transition-colors">
              أذكار الصباح والمساء
            </Link>
            <Link href="/prayer-guide" title="دليل صفة الصلاة وقصار السور" className="hover:text-emerald-400 transition-colors">
              دليل الصلاة
            </Link>
            <Link href="/travel" title="أدعية السفر والطريق" className="hover:text-emerald-400 transition-colors">
              أدعية السفر
            </Link>
            <Link href="/friday" title="سنن وأدعية يوم الجمعة" className="hover:text-emerald-400 transition-colors">
              يوم الجمعة
            </Link>
            <Link href="/family" title="أدعية الوالدين والأسرة" className="hover:text-emerald-400 transition-colors">
              الوالدين والأهل
            </Link>
            <Link href="/articles" title="المقالات والأحاديث النبوية" className="hover:text-emerald-400 transition-colors text-emerald-400 font-medium">
              المقالات والأحاديث
            </Link>
          </div>
        </div>

        {/* Col 3: Machine-Readable links */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-zinc-300 text-xs">روابط التغذية والبيانات</span>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-800 transition-all font-mono"
              title="خلاصة RSS للأدعية والأذكار"
            >
              <Rss className="w-3 h-3 text-amber-500" />
              <span>RSS 2.0</span>
            </a>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-800 transition-all font-mono"
              title="خريطة الموقع"
            >
              <span>sitemap.xml</span>
            </a>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-800 transition-all font-mono"
              title="فهرس النصوص"
            >
              <FileText className="w-3 h-3 text-cyan-400" />
              <span>llms.txt</span>
            </a>
            <a
              href="/llms-full.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-800 transition-all font-mono"
              title="قاعدة المعرفة الكاملة للأذكار"
            >
              <FileText className="w-3 h-3 text-emerald-400" />
              <span>llms-full.txt</span>
            </a>
          </div>
          <span className="text-[10px] text-zinc-600 mt-1">
            نسخة إسلامية خفيفة بدون إعلانات
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-900 gap-2 text-[11px]">
        <p className="text-zinc-500">
          صدقة جارية • اللهم تقبل منا ومنكم صالح الأعمال
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleOled}
            type="button"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[10px]"
            aria-label="تبديل وضع الشاشة"
          >
            <Moon className="w-3 h-3" />
            <span>{isOled ? 'وضع OLED مفعل' : 'الوضع الداكن'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
