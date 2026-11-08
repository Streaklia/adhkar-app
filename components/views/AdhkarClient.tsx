'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DhikrCard from '@/components/DhikrCard';
import duasData from '@/data/duas.json';
import { Sun, Moon, RotateCcw, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '@/lib/audio-haptics';
import { useAppSettings } from '@/lib/theme-context';

export default function AdhkarClient() {
  const searchParams = useSearchParams();
  const timeQuery = searchParams.get('time');
  const { hapticEnabled } = useAppSettings();

  // Determine active tab (Morning or Evening)
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [resetKey, setResetKey] = useState<number>(0);
  const [completedMorningCount, setCompletedMorningCount] = useState<number>(0);
  const [completedEveningCount, setCompletedEveningCount] = useState<number>(0);

  useEffect(() => {
    if (timeQuery === 'evening') {
      setActiveTab('evening');
    } else if (timeQuery === 'morning') {
      setActiveTab('morning');
    } else {
      const hours = new Date().getHours();
      if (hours >= 4 && hours < 12) {
        setActiveTab('morning');
      } else {
        setActiveTab('evening');
      }
    }
  }, [timeQuery]);

  // Track completed cards for both sections
  useEffect(() => {
    let mCount = 0;
    duasData.adhkar.morning.forEach((item) => {
      try {
        const val = localStorage.getItem(`doua_card_${item.id}`);
        if (val !== null && Number(val) === 0) mCount++;
      } catch {}
    });
    setCompletedMorningCount(mCount);

    let eCount = 0;
    duasData.adhkar.evening.forEach((item) => {
      try {
        const val = localStorage.getItem(`doua_card_${item.id}`);
        if (val !== null && Number(val) === 0) eCount++;
      } catch {}
    });
    setCompletedEveningCount(eCount);
  }, [resetKey]);

  const activeItems = activeTab === 'morning' ? duasData.adhkar.morning : duasData.adhkar.evening;
  const currentCompleted = activeTab === 'morning' ? completedMorningCount : completedEveningCount;
  const progressPercent = Math.round((currentCompleted / activeItems.length) * 100);

  const handleCardComplete = () => {
    if (activeTab === 'morning') {
      setCompletedMorningCount((prev) => Math.min(prev + 1, duasData.adhkar.morning.length));
    } else {
      setCompletedEveningCount((prev) => Math.min(prev + 1, duasData.adhkar.evening.length));
    }
  };

  const handleResetAll = () => {
    activeItems.forEach((item) => {
      try {
        localStorage.removeItem(`doua_card_${item.id}`);
      } catch {}
    });
    setResetKey((prev) => prev + 1);
    if (activeTab === 'morning') setCompletedMorningCount(0);
    else setCompletedEveningCount(0);
    if (hapticEnabled) triggerHaptic('medium', true);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-8" key={`${activeTab}_${resetKey}`}>
      {/* Top Controls: Segmented Morning/Evening Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('morning');
              if (hapticEnabled) triggerHaptic('light', true);
            }}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'morning'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-pressed={activeTab === 'morning'}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>أذكار الصباح ({duasData.adhkar.morning.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('evening');
              if (hapticEnabled) triggerHaptic('light', true);
            }}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'evening'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-pressed={activeTab === 'evening'}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>أذكار المساء ({duasData.adhkar.evening.length})</span>
          </button>
        </div>

        <button
          onClick={handleResetAll}
          type="button"
          className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl active:scale-95 transition-all self-end sm:self-auto"
          title="تصفير عدادات هذا القسم"
          aria-label="تصفير أذكار هذا القسم"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          <span>تصفير هذا القسم</span>
        </button>
      </div>

      {/* Progress Bar Banner */}
      <div className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-zinc-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            إنجاز {activeTab === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}: {currentCompleted} من {activeItems.length}
          </span>
          <span className="font-mono text-emerald-400 font-bold text-sm">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Tab Adhkar Cards in Responsive Multi-Column Grid (1 col on mobile, 2 cols on md/lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {activeItems.map((item, index) => {
          const nextItem = activeItems[index + 1];
          return (
            <DhikrCard
              key={item.id}
              id={item.id}
              title={item.title}
              text={item.text}
              count={item.count}
              virtue={item.virtue}
              onComplete={handleCardComplete}
              nextCardId={nextItem ? nextItem.id : undefined}
            />
          );
        })}
      </div>

      {/* Pre-rendered DOM Content for the alternate section so search engine crawlers always see 100% of both sections */}
      <div className="sr-only" aria-hidden="true">
        <h2>أذكار الصباح والمساء الكاملة لأرشفة محركات البحث</h2>
        <div>
          <h3>أذكار الصباح</h3>
          {duasData.adhkar.morning.map((m) => (
            <div key={`crawl_m_${m.id}`}>
              <h4>{m.title}</h4>
              <p>{m.text}</p>
              {m.virtue && <p>{m.virtue}</p>}
            </div>
          ))}
        </div>
        <div>
          <h3>أذكار المساء</h3>
          {duasData.adhkar.evening.map((e) => (
            <div key={`crawl_e_${e.id}`}>
              <h4>{e.title}</h4>
              <p>{e.text}</p>
              {e.virtue && <p>{e.virtue}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
