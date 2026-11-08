'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Sun, Moon, ArrowLeft, Clock } from 'lucide-react';

export default function TimeAwareBanner() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [dayOfWeek, setDayOfWeek] = useState<number>(5); // 5 = Friday
  const [currentHour, setCurrentHour] = useState<number>(8);
  const [timeUntilMaghrib, setTimeUntilMaghrib] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDayOfWeek(now.getDay()); // 0 = Sunday, 5 = Friday
      setCurrentHour(now.getHours());

      // Estimate sunset (Maghrib approx around 17:45)
      const sunset = new Date();
      sunset.setHours(17, 45, 0, 0);

      const diff = sunset.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilMaghrib(`${hours}س و ${mins}د`);
      } else {
        setTimeUntilMaghrib('حان وقت الإجابة');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    setMounted(true);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    // SSR fallback neutral banner
    return (
      <div className="w-full my-3">
        <div className="w-full h-14 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 animate-pulse" />
      </div>
    );
  }

  const isFriday = dayOfWeek === 5;
  const isMorning = currentHour >= 4 && currentHour < 12;

  // 1. Friday Banner
  if (isFriday) {
    return (
      <div className="w-full my-3">
        <Link
          href="/friday"
          title="الانتقال إلى سنن وأدعية يوم الجمعة وساعة الاستجابة"
          aria-label="سنن وأدعية يوم الجمعة والوقت المتبقي للغروب"
          className="w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-l from-emerald-950/70 via-zinc-950 to-zinc-950 border border-emerald-500/40 rounded-2xl shadow-lg shadow-emerald-950/20 group hover:border-emerald-500/70 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-emerald-300">
                  سنن وأدعية يوم الجمعة
                </span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/50 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  الوقت المتبقي للغروب: {timeUntilMaghrib}
                </span>
              </div>
              <span className="text-xs text-zinc-400 truncate mt-0.5">
                سورة الكهف، الصلاة على النبي ﷺ ودعاء ساعة الاستجابة
              </span>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1.5 transition-transform shrink-0 mr-2" />
        </Link>
      </div>
    );
  }

  // 2. Morning Adhkar Banner (4 AM - 12 PM)
  if (isMorning) {
    return (
      <div className="w-full my-3">
        <Link
          href="/adhkar?time=morning"
          title="الانتقال إلى أذكار الصباح"
          aria-label="أذكار الصباح مع تتبع التكرار التفاعلي"
          className="w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-l from-amber-950/50 via-zinc-950 to-zinc-950 border border-amber-500/40 rounded-2xl shadow-lg shadow-amber-950/10 group hover:border-amber-500/70 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Sun className="w-5 h-5 animate-pulse" />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-amber-300">
                  أذكار الصباح
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
                  وقتها الآن
                </span>
              </div>
              <span className="text-xs text-zinc-400 truncate mt-0.5">
                حصنك الحصين وبركة يومك مع تتبع التكرار التفاعلي
              </span>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1.5 transition-transform shrink-0 mr-2" />
        </Link>
      </div>
    );
  }

  // 3. Evening Adhkar Banner (12 PM - 4 AM)
  return (
    <div className="w-full my-3">
      <Link
        href="/adhkar?time=evening"
        title="الانتقال إلى أذكار المساء"
        aria-label="أذكار المساء مع تتبع التكرار التفاعلي"
        className="w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-l from-indigo-950/60 via-zinc-950 to-zinc-950 border border-indigo-500/40 rounded-2xl shadow-lg shadow-indigo-950/10 group hover:border-indigo-500/70 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
            <Moon className="w-5 h-5" />
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-indigo-300">
                أذكار المساء
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/40">
                وقتها الآن
              </span>
            </div>
            <span className="text-xs text-zinc-400 truncate mt-0.5">
              سكينة النفس وحفظ الليل والتحصين من كل شر
            </span>
          </div>
        </div>
        <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-1.5 transition-transform shrink-0 mr-2" />
      </Link>
    </div>
  );
}
