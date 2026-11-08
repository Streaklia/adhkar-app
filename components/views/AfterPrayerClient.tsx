'use client';

import React, { useState } from 'react';
import DhikrCard from '@/components/DhikrCard';
import duasData from '@/data/duas.json';
import { RotateCcw, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/audio-haptics';
import { useAppSettings } from '@/lib/theme-context';

export default function AfterPrayerClient() {
  const { hapticEnabled } = useAppSettings();
  const [resetKey, setResetKey] = useState<number>(0);

  const handleResetAll = () => {
    duasData.after_prayer.forEach((d) => {
      try {
        localStorage.removeItem(`doua_card_${d.id}`);
      } catch {}
    });
    setResetKey((prev) => prev + 1);
    if (hapticEnabled) triggerHaptic('medium', true);
  };

  return (
    <div className="w-full flex flex-col gap-4" key={resetKey}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <p className="text-xs sm:text-sm text-zinc-400">
          اضغط على أي بطاقة لإنقاص التكرار، وسيتم حفظ التقدم تلقائياً.
        </p>

        <button
          onClick={handleResetAll}
          type="button"
          className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl active:scale-95 transition-all shrink-0"
          title="إعادة تعيين جميع البطاقات"
          aria-label="تصفير جميع عدادات بطاقات بعد الصلاة"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          <span>تصفير الكل</span>
        </button>
      </div>

      {/* Cards Multi-Column Grid on Desktop & Tablet (1 col on mobile, 2 cols on md/lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {duasData.after_prayer.map((dua, index) => {
          const nextDua = duasData.after_prayer[index + 1];
          return (
            <DhikrCard
              key={dua.id}
              id={dua.id}
              title={dua.title}
              text={dua.text}
              count={dua.count}
              note={dua.note}
              reference={dua.reference}
              nextCardId={nextDua ? nextDua.id : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
