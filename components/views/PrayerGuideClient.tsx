'use client';

import React, { useState } from 'react';
import duasData from '@/data/duas.json';
import { BookOpen, Sparkles, Shuffle, ArrowRight, ArrowLeft } from 'lucide-react';
import { triggerHaptic, playBeadSound } from '@/lib/audio-haptics';
import { useAppSettings } from '@/lib/theme-context';
import { ShortSurah } from '@/lib/types';

export default function PrayerGuideClient() {
  const { hapticEnabled, soundEnabled } = useAppSettings();
  const [activeTab, setActiveTab] = useState<'steps' | 'surahs'>('steps');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Suggested Surahs state (two random surahs from Juz Amma)
  const [suggestedSurahs, setSuggestedSurahs] = useState<[ShortSurah, ShortSurah]>(() => {
    const list = duasData.prayer_guide.short_surahs;
    return [list[1] as ShortSurah, list[2] as ShortSurah]; // Al-Ikhlas, Al-Falaq
  });

  const steps = duasData.prayer_guide.steps;
  const currentStep = steps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      if (hapticEnabled) triggerHaptic('light', true);
      if (soundEnabled) playBeadSound();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      if (hapticEnabled) triggerHaptic('light', true);
      if (soundEnabled) playBeadSound();
    }
  };

  const handleRandomSurahs = () => {
    const list = [...duasData.prayer_guide.short_surahs];
    // Shuffle array
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setSuggestedSurahs([list[0] as ShortSurah, list[1] as ShortSurah]);
    if (hapticEnabled) triggerHaptic('medium', true);
    if (soundEnabled) playBeadSound();
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-8">
      {/* Page Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 w-full max-w-md">
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'steps'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-pressed={activeTab === 'steps'}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>خطوات وأذكار الصلاة ({steps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('surahs')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'surahs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-pressed={activeTab === 'surahs'}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>اقترح سورة للصلاة</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Step-by-step Interactive Prayer Guide */}
      {activeTab === 'steps' && (
        <div className="flex flex-col gap-4">
          {/* Steps Horizontal Pill Selector (clickable on desktop & mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {steps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  if (hapticEnabled) triggerHaptic('light', true);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all border ${
                  idx === currentStepIndex
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {s.step}. {s.title}
              </button>
            ))}
          </div>

          {/* Main Step Card: Wide and spacious on Desktop */}
          <article className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-xl flex flex-col justify-between min-h-[380px]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-900 px-3 py-1 rounded-full">
                  الركن {currentStep.step} من {steps.length}
                </span>
                <h2 className="text-base sm:text-xl font-bold text-zinc-100 font-quran">
                  {currentStep.title}
                </h2>
              </div>

              {/* Action Description */}
              <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/60 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <span className="font-semibold text-emerald-400 block mb-1">الصفة والهيئة:</span>
                <p>{currentStep.action}</p>
              </div>

              {/* What to say in Arabic */}
              <div className="my-2 p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
                <span className="text-xs text-zinc-400 font-semibold block mb-2">ما يُقال في هذا الركن:</span>
                <p className="font-quran text-lg sm:text-2xl text-emerald-300 leading-loose whitespace-pre-line font-medium">
                  {currentStep.arabic}
                </p>
                {currentStep.transliteration && (
                  <p className="text-xs text-zinc-500 font-mono mt-2 dir-ltr text-right">
                    {currentStep.transliteration}
                  </p>
                )}
              </div>

              {currentStep.note && (
                <div className="text-xs text-amber-300/90 bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl leading-relaxed">
                  💡 <span className="font-semibold">تنبيه فقهي:</span> {currentStep.note}
                </div>
              )}
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-5 mt-4 border-t border-zinc-900">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                aria-label="الركن السابق"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الركن السابق</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === steps.length - 1}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-lg shadow-emerald-950 transition-all"
                aria-label="الركن التالي"
              >
                <span>الركن التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </article>
        </div>
      )}

      {/* Tab 2: Random Short Surah Suggestor */}
      {activeTab === 'surahs' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-sm">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-100">
                اقترح لي سورتين للصلاة من جزء عم
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                سورة للركعة الأولى وسورة للركعة الثانية للتنويع وتجنب تكرار نفس السور في كل صلاة
              </p>
            </div>
            <button
              onClick={handleRandomSurahs}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-950 active:scale-95 transition-all self-start sm:self-auto shrink-0"
              aria-label="اقتراح سورتين عشوائيتين جديدتين"
            >
              <Shuffle className="w-4 h-4" />
              <span>اقتراح جديد</span>
            </button>
          </div>

          {/* Surahs 2-Column Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Surah 1 (First Rak'ah) */}
            <article className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-900 px-2.5 py-0.5 rounded-full">
                  الركعة الأولى
                </span>
                <h3 className="text-base font-bold text-zinc-100 font-quran">
                  سُورَةُ {suggestedSurahs[0].name} ({suggestedSurahs[0].ayah_count} آيات)
                </h3>
              </div>
              <p className="font-quran text-lg sm:text-xl text-zinc-100 leading-loose pt-1">
                {suggestedSurahs[0].text}
              </p>
            </article>

            {/* Surah 2 (Second Rak'ah) */}
            <article className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-900 px-2.5 py-0.5 rounded-full">
                  الركعة الثانية
                </span>
                <h3 className="text-base font-bold text-zinc-100 font-quran">
                  سُورَةُ {suggestedSurahs[1].name} ({suggestedSurahs[1].ayah_count} آيات)
                </h3>
              </div>
              <p className="font-quran text-lg sm:text-xl text-zinc-100 leading-loose pt-1">
                {suggestedSurahs[1].text}
              </p>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
