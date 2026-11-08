'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Plus, ChevronRight, ChevronLeft, Sparkles, X, Check, Keyboard } from 'lucide-react';
import { useAppSettings } from '@/lib/theme-context';
import { triggerHaptic, playBeadSound, playMilestoneSound } from '@/lib/audio-haptics';
import { TasbihPreset } from '@/lib/types';
import defaultData from '@/data/duas.json';

export default function TasbihHero() {
  const { hapticEnabled, soundEnabled } = useAppSettings();

  // Presets & Active State
  const [presets, setPresets] = useState<TasbihPreset[]>(defaultData.tasbih_presets);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [isAlertState, setIsAlertState] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [customTarget, setCustomTarget] = useState<number>(33);
  const [isTapAnim, setIsTapAnim] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load persistence
  useEffect(() => {
    try {
      const storedPresets = localStorage.getItem('doua_custom_presets');
      if (storedPresets) {
        const parsed = JSON.parse(storedPresets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPresets(parsed);
        }
      }

      const storedIdx = localStorage.getItem('doua_active_idx');
      if (storedIdx !== null) {
        setCurrentIndex(Number(storedIdx) || 0);
      }

      const storedCount = localStorage.getItem('doua_count');
      if (storedCount !== null) {
        const c = Number(storedCount) || 0;
        setCount(c);
      }
    } catch (e) {
      console.warn('Error loading tasbih state:', e);
    }
    setMounted(true);
  }, []);

  // Save persistence
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('doua_count', String(count));
      localStorage.setItem('doua_active_idx', String(currentIndex));
      localStorage.setItem('doua_custom_presets', JSON.stringify(presets));
    } catch {}
  }, [count, currentIndex, presets, mounted]);

  const activePreset = presets[currentIndex] || presets[0];
  const target = activePreset.target || 33;

  // Check alert state (when count reaches target e.g. 33)
  useEffect(() => {
    if (count >= target && count > 0) {
      setIsAlertState(true);
    } else {
      setIsAlertState(false);
    }
  }, [count, target]);

  // Main tap handler for the circle area
  const handleTap = useCallback(() => {
    setIsTapAnim(true);
    setTimeout(() => setIsTapAnim(false), 120);

    // If currently at or above target (e.g. 33 reached on previous tap), advance to next dhikr
    if (count >= target) {
      // Cycle to next preset and reset count to 0
      const nextIndex = (currentIndex + 1) % presets.length;
      setCurrentIndex(nextIndex);
      setCount(0);
      setIsAlertState(false);

      if (hapticEnabled) triggerHaptic('light', true);
      if (soundEnabled) playBeadSound();
      return;
    }

    const nextCount = count + 1;
    setCount(nextCount);

    if (nextCount === target) {
      // Reached 33 / target!
      // Transitions to Red (#EF4444) and triggers stronger vibration + milestone sound
      setIsAlertState(true);
      if (hapticEnabled) triggerHaptic('heavy', true);
      if (soundEnabled) playMilestoneSound();
    } else {
      // Normal count (1 to 32)
      if (hapticEnabled) triggerHaptic('light', true);
      if (soundEnabled) playBeadSound();
    }
  }, [count, target, currentIndex, presets.length, hapticEnabled, soundEnabled]);

  // Keyboard navigation support: Pressing Space or Enter increments the counter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input or modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleTap();
      } else if (e.key === 'r' || e.key === 'R') {
        // 'R' key to reset
        setCount(0);
        setIsAlertState(false);
        if (hapticEnabled) triggerHaptic('medium', true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTap, hapticEnabled]);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(0);
    setIsAlertState(false);
    if (hapticEnabled) triggerHaptic('medium', true);
  };

  const handleNextDhikr = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % presets.length;
    setCurrentIndex(nextIdx);
    setCount(0);
    setIsAlertState(false);
    if (hapticEnabled) triggerHaptic('light', true);
  };

  const handlePrevDhikr = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentIndex - 1 + presets.length) % presets.length;
    setCurrentIndex(prevIdx);
    setCount(0);
    setIsAlertState(false);
    if (hapticEnabled) triggerHaptic('light', true);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newPreset: TasbihPreset = {
      id: `custom_${Date.now()}`,
      text: customText.trim(),
      target: Number(customTarget) || 33,
      isCustom: true,
      meaning: 'ذكر مخصص',
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    setCurrentIndex(updated.length - 1);
    setCount(0);
    setIsAlertState(false);
    setCustomText('');
    setShowAddModal(false);
    if (hapticEnabled) triggerHaptic('medium', true);
  };

  // Circular progress calculation
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(count / target, 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Color styling logic:
  // While counting 1 to 32: Glowing Green (#10B981)
  // When count reaches 33 (or target): Red (#EF4444)
  const isRed = count >= target && target > 0;
  const themeColorHex = isRed ? '#EF4444' : '#10B981';
  const themeGlowClass = isRed
    ? 'shadow-[0_0_50px_rgba(239,68,68,0.4)] border-red-500/80 text-red-400'
    : 'shadow-[0_0_45px_rgba(16,185,129,0.25)] border-emerald-500/60 text-emerald-400';

  return (
    <section 
      aria-label="العداد التفاعلي الذكي للتسبيح" 
      className="w-full flex flex-col items-center justify-center pt-2 pb-4 relative"
    >
      {/* Dhikr Selector Bar (Switch active dhikr easily) */}
      <div className="w-full max-w-md flex items-center justify-between px-3 mb-2">
        <button
          onClick={handlePrevDhikr}
          type="button"
          aria-label="الذكر السابق"
          className="p-2 rounded-full text-zinc-400 hover:text-white active:scale-95 transition-all hover:bg-zinc-900 border border-zinc-800/60"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="font-mono text-xs text-zinc-400">
            {currentIndex + 1} / {presets.length}
          </span>
          <span className="text-[11px] font-semibold bg-zinc-900 text-emerald-400 px-2.5 py-0.5 rounded-full border border-zinc-800">
            الهدف: {target}
          </span>
        </div>

        <button
          onClick={handleNextDhikr}
          type="button"
          aria-label="الذكر التالي"
          className="p-2 rounded-full text-zinc-400 hover:text-white active:scale-95 transition-all hover:bg-zinc-900 border border-zinc-800/60"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Large Tappable Circular Counter Area */}
      <div className="relative flex items-center justify-center my-2 select-none">
        <button
          onClick={handleTap}
          type="button"
          aria-label={`تسبيح: ${activePreset.text}، العدد الحالي ${count} من أصل ${target}. اضغط للتسبيح أو اضغط مسافة`}
          className={`relative w-72 h-72 sm:w-80 sm:h-80 md:w-84 md:h-84 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${themeGlowClass} ${
            isTapAnim ? 'scale-95' : 'scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(18,24,27,0.92) 0%, rgba(5,7,9,0.98) 85%, #000000 100%)',
          }}
        >
          {/* SVG Circular Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 240 240">
            {/* Background Track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-zinc-900/90"
            />
            {/* Active Colored Ring (Green -> Red at 33) */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke={themeColorHex}
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: 'stroke-dashoffset 0.15s ease-out, stroke 0.3s ease',
              }}
            />
          </svg>

          {/* Central Counter Display */}
          <div className="z-10 flex flex-col items-center justify-center text-center px-4 max-w-[240px]">
            <span
              className={`font-mono text-6xl sm:text-7xl font-extrabold tracking-tight transition-colors duration-300 ${
                isRed ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {count}
            </span>

            {/* Active Dhikr Text */}
            <h2 className="mt-2 font-quran text-lg sm:text-xl text-zinc-100 font-bold leading-relaxed line-clamp-2 px-1">
              {activePreset.text}
            </h2>

            {/* Subtitle / Milestone indicator */}
            {isRed ? (
              <span className="mt-1 text-xs font-bold text-red-400 bg-red-950/80 border border-red-800 px-3 py-1 rounded-full animate-bounce">
                تم الهدف! اضغط للمتابعة
              </span>
            ) : (
              <span className="mt-1 text-[11px] text-zinc-400 tracking-wide">
                اضغط في أي مكان للعد
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Desktop Keyboard Helper Badge */}
      <div className="hidden md:flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400">
        <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
        <span>اختصار لوحة المفاتيح: اضغط</span>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[10px] border border-zinc-700">Space</kbd>
        <span>أو</span>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[10px] border border-zinc-700">Enter</kbd>
        <span>للتسبيح</span>
      </div>

      {/* Small Controls Row Next to / Under Counter */}
      <div className="w-full max-w-md flex items-center justify-center gap-3 mt-3">
        {/* Reset Counter Button */}
        <button
          onClick={handleReset}
          type="button"
          title="تصفير العداد (اختصار: R)"
          aria-label="تصفير العداد"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition-all text-xs font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          <span>تصفير</span>
        </button>

        {/* Add Custom Dhikr Button */}
        <button
          onClick={() => setShowAddModal(true)}
          type="button"
          title="إضافة ذكر مخصص"
          aria-label="إضافة ذكر مخصص"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-emerald-400 active:scale-95 transition-all text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>ذكر مخصص</span>
        </button>
      </div>

      {/* Add Custom Dhikr Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-custom-dhikr-title"
        >
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 id="modal-custom-dhikr-title" className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                إضافة ذكر مخصص
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-200"
                aria-label="إغلاق النافذة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="mt-4 flex flex-col gap-3">
              <div>
                <label htmlFor="custom-dhikr-input" className="block text-xs text-zinc-400 mb-1">
                  نص الذكر:
                </label>
                <input
                  id="custom-dhikr-input"
                  type="text"
                  required
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="مثال: لا حول ولا قوة إلا بالله"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none focus:border-emerald-500 font-quran text-base"
                />
              </div>

              <div>
                <label htmlFor="custom-target-input" className="block text-xs text-zinc-400 mb-1">
                  العدد المستهدف:
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {[33, 70, 100, 1000].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCustomTarget(num)}
                      className={`py-1 text-xs rounded-lg font-mono border transition-all ${
                        customTarget === num
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <input
                  id="custom-target-input"
                  type="number"
                  min="1"
                  max="100000"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(Number(e.target.value) || 33)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                حفظ وبدء التسبيح
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
