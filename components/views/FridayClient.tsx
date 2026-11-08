'use client';

import React, { useState, useEffect } from 'react';
import duasData from '@/data/duas.json';
import { 
  Clock, 
  Sparkles, 
  Heart, 
  BookOpen, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { triggerHaptic, playBeadSound, playMilestoneSound } from '@/lib/audio-haptics';
import { useAppSettings } from '@/lib/theme-context';

export default function FridayClient() {
  const { hapticEnabled, soundEnabled } = useAppSettings();

  // Friday Salawat Counter
  const [salawatCount, setSalawatCount] = useState<number>(0);
  const salawatTarget = duasData.friday.salawat_counter.target;

  // Sunnah checklist state
  const [checkedSunnahs, setCheckedSunnahs] = useState<Record<string, boolean>>({});

  // Kahf Sections progress tracker
  const [readSections, setReadSections] = useState<Record<string, boolean>>({});

  // Last Hour Countdown to Maghrib
  const [countdownText, setCountdownText] = useState<{ hours: number; minutes: number; seconds: number; isPast: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  // Load persistence
  useEffect(() => {
    try {
      const storedSalawat = localStorage.getItem('doua_friday_salawat');
      if (storedSalawat !== null) setSalawatCount(Number(storedSalawat) || 0);

      const storedSunnahs = localStorage.getItem('doua_friday_sunnahs');
      if (storedSunnahs) setCheckedSunnahs(JSON.parse(storedSunnahs));

      const storedKahf = localStorage.getItem('doua_friday_kahf');
      if (storedKahf) setReadSections(JSON.parse(storedKahf));
    } catch {}
  }, []);

  // Live countdown to sunset (approx 17:45 or local Maghrib time)
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const sunset = new Date();
      sunset.setHours(17, 45, 0, 0);

      const diff = sunset.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownText({ hours, minutes, seconds, isPast: false });
      } else {
        setCountdownText({ hours: 0, minutes: 0, seconds: 0, isPast: true });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Tap handler for Salawat counter
  const handleSalawatTap = () => {
    const nextCount = salawatCount + 1;
    setSalawatCount(nextCount);
    try {
      localStorage.setItem('doua_friday_salawat', String(nextCount));
    } catch {}

    if (nextCount % salawatTarget === 0) {
      if (hapticEnabled) triggerHaptic('heavy', true);
      if (soundEnabled) playMilestoneSound();
    } else {
      if (hapticEnabled) triggerHaptic('light', true);
      if (soundEnabled) playBeadSound();
    }
  };

  const handleResetSalawat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSalawatCount(0);
    try {
      localStorage.setItem('doua_friday_salawat', '0');
    } catch {}
    if (hapticEnabled) triggerHaptic('medium', true);
  };

  const toggleSunnah = (id: string) => {
    setCheckedSunnahs((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('doua_friday_sunnahs', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (hapticEnabled) triggerHaptic('light', true);
  };

  const toggleKahfSection = (id: string) => {
    setReadSections((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('doua_friday_kahf', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (hapticEnabled) triggerHaptic('medium', true);
  };

  const completedKahfCount = Object.values(readSections).filter(Boolean).length;
  const kahfPercent = Math.round((completedKahfCount / duasData.friday.kahf_sections.length) * 100);

  return (
    <div className="w-full flex flex-col gap-6 pb-8">
      {/* Responsive Desktop 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Column 1: Last Hour Countdown & Salawat Counter */}
        <div className="flex flex-col gap-6">
          {/* 1. Last Hour Countdown (ساعة الاستجابة) */}
          <article className="w-full rounded-2xl bg-gradient-to-br from-emerald-950/70 via-zinc-950 to-zinc-950 border border-emerald-500/40 p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </span>
                <h2 className="text-sm font-bold text-emerald-300">
                  ساعة الاستجابة (الوقت المتبقي لغروب شمس الجمعة)
                </h2>
              </div>
            </div>

            {countdownText.isPast ? (
              <div className="text-center py-3 text-sm font-bold text-amber-300 bg-amber-950/30 rounded-xl border border-amber-900/40">
                غربت شمس الجمعة، تقبل الله منا ومنكم صالح الأعمال
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 py-2">
                <div className="flex flex-col items-center bg-zinc-900/90 border border-emerald-800/40 rounded-2xl px-4 py-2.5 min-w-[72px]">
                  <span className="font-mono text-3xl font-bold text-emerald-400">
                    {String(countdownText.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">ساعة</span>
                </div>
                <span className="text-2xl font-bold text-emerald-500">:</span>
                <div className="flex flex-col items-center bg-zinc-900/90 border border-emerald-800/40 rounded-2xl px-4 py-2.5 min-w-[72px]">
                  <span className="font-mono text-3xl font-bold text-emerald-400">
                    {String(countdownText.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">دقيقة</span>
                </div>
                <span className="text-2xl font-bold text-emerald-500">:</span>
                <div className="flex flex-col items-center bg-zinc-900/90 border border-emerald-800/40 rounded-2xl px-4 py-2.5 min-w-[72px]">
                  <span className="font-mono text-3xl font-bold text-emerald-400">
                    {String(countdownText.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">ثانية</span>
                </div>
              </div>
            )}

            {/* Recommended Duas for Friday */}
            <div className="mt-4 pt-3 border-t border-zinc-900 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-zinc-300 block">
                أدعية مأثورة لساعة الاستجابة:
              </span>
              {duasData.friday.last_hour_dua.duas.map((d, idx) => (
                <p key={idx} className="font-quran text-xs sm:text-sm text-zinc-200 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60 leading-relaxed">
                  {d}
                </p>
              ))}
            </div>
          </article>

          {/* 2. Interactive Salawat Counter */}
          <article
            onClick={handleSalawatTap}
            role="button"
            tabIndex={0}
            aria-label={`الصلاة على النبي ﷺ. العدد المنجز: ${salawatCount} من أصل ${salawatTarget}. اضغط للتسبيح`}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleSalawatTap();
              }
            }}
            className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-lg cursor-pointer select-none active:scale-[0.99] transition-all flex flex-col gap-3 hover:border-emerald-500/40"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20" />
                <h2 className="text-xs sm:text-sm font-bold text-zinc-100">
                  الصلاة على النبي ﷺ (الهدف: {salawatTarget})
                </h2>
              </div>
              <button
                onClick={handleResetSalawat}
                type="button"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                title="تصفير عداد الصلاة على النبي"
                aria-label="تصفير عداد الصلاة على النبي"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <p className="font-quran text-base sm:text-xl text-emerald-300 text-center py-2.5 leading-relaxed font-semibold">
              {duasData.friday.salawat_counter.text}
            </p>

            <div className="flex items-center justify-between bg-zinc-900/90 rounded-2xl px-5 py-3 border border-zinc-800 shadow-inner">
              <span className="text-xs sm:text-sm text-zinc-400">العدد المنجز:</span>
              <span className="font-mono text-3xl font-extrabold text-emerald-400">
                {salawatCount}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 text-center font-mono">
              اضغط في أي مكان لزيادة العداد أو اضغط مفتاح المسافة
            </div>
          </article>
        </div>

        {/* Column 2: Surah Al-Kahf Tracker & Sunnahs Checklist */}
        <div className="flex flex-col gap-6">
          {/* 3. Surah Al-Kahf Tracker */}
          <article className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xs sm:text-sm font-bold text-zinc-100">
                  متتبع قراءة سورة الكهف ({completedKahfCount}/4)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {kahfPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${kahfPercent}%` }}
              />
            </div>

            {/* 4 Story Sections Checklist */}
            <div className="flex flex-col gap-2.5 mt-1">
              {duasData.friday.kahf_sections.map((section) => {
                const isRead = !!readSections[section.id];
                return (
                  <div
                    key={section.id}
                    onClick={() => toggleKahfSection(section.id)}
                    role="checkbox"
                    aria-checked={isRead}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleKahfSection(section.id);
                      }
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isRead
                        ? 'bg-emerald-950/30 border-emerald-800/40 opacity-80'
                        : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                        isRead
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-zinc-700 bg-zinc-800'
                      }`}
                    >
                      {isRead && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-xs sm:text-sm font-bold ${isRead ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                          {section.title}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {section.ayah_range}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {section.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* 4. Friday Sunnahs Checklist */}
          <article className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xs sm:text-sm font-bold text-zinc-100">سنن يوم الجمعة المستحبة</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {duasData.friday.sunnahs.map((sunnah) => {
                const isDone = !!checkedSunnahs[sunnah.id];
                return (
                  <div
                    key={sunnah.id}
                    onClick={() => toggleSunnah(sunnah.id)}
                    role="checkbox"
                    aria-checked={isDone}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleSunnah(sunnah.id);
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 select-none ${
                      isDone
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                        : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-zinc-700 bg-zinc-800'
                      }`}
                    >
                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${isDone ? 'line-through opacity-80' : ''}`}>
                        {sunnah.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 line-clamp-1">
                        {sunnah.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
