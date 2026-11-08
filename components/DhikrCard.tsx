'use client';

import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Volume2, Copy } from 'lucide-react';
import { useAppSettings } from '@/lib/theme-context';
import { triggerHaptic, playBeadSound, playMilestoneSound, speakArabic } from '@/lib/audio-haptics';

interface DhikrCardProps {
  id: string;
  title: string;
  text: string;
  count: number;
  virtue?: string;
  reference?: string;
  note?: string;
  onComplete?: () => void;
  nextCardId?: string;
  enableTTS?: boolean;
}

export default function DhikrCard({
  id,
  title,
  text,
  count: initialCount,
  virtue,
  reference,
  note,
  onComplete,
  nextCardId,
  enableTTS = false,
}: DhikrCardProps) {
  const { hapticEnabled, soundEnabled } = useAppSettings();
  const [remaining, setRemaining] = useState<number>(initialCount);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Load card persistence from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`doua_card_${id}`);
      if (stored !== null) {
        const val = Number(stored);
        setRemaining(val);
        if (val === 0) setIsCompleted(true);
      }
    } catch {}
  }, [id]);

  const handleCardTap = (e: React.MouseEvent) => {
    // Prevent if clicking action buttons inside card
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    if (remaining <= 0) return;

    const nextVal = remaining - 1;
    setRemaining(nextVal);
    try {
      localStorage.setItem(`doua_card_${id}`, String(nextVal));
    } catch {}

    if (nextVal === 0) {
      setIsCompleted(true);
      if (hapticEnabled) triggerHaptic('heavy', true);
      if (soundEnabled) playMilestoneSound();
      onComplete?.();

      // Smooth auto-scroll to the next card after short delay
      if (nextCardId) {
        setTimeout(() => {
          const nextEl = document.getElementById(nextCardId);
          if (nextEl) {
            nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 220);
      }
    } else {
      if (hapticEnabled) triggerHaptic('light', true);
      if (soundEnabled) playBeadSound();
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemaining(initialCount);
    setIsCompleted(false);
    try {
      localStorage.setItem(`doua_card_${id}`, String(initialCount));
    } catch {}
    if (hapticEnabled) triggerHaptic('medium', true);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title}\n\n${text}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      if (hapticEnabled) triggerHaptic('light', true);
    }
  };

  const handleTTS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      setIsSpeaking(false);
      window.speechSynthesis?.cancel();
    } else {
      setIsSpeaking(true);
      speakArabic(text, () => setIsSpeaking(false), () => setIsSpeaking(false));
    }
  };

  return (
    <article
      id={id}
      onClick={handleCardTap}
      role="button"
      tabIndex={0}
      aria-label={`${title}. التكرار المتبقي: ${remaining} من أصل ${initialCount}`}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleCardTap(e as unknown as React.MouseEvent);
        }
      }}
      className={`relative w-full rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer select-none border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
        isCompleted
          ? 'bg-zinc-950/40 border-emerald-900/30 opacity-75'
          : 'bg-zinc-950/90 hover:bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700 active:scale-[0.99] shadow-sm'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Status Check or Repetition Badge */}
          {isCompleted ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <Check className="w-3 h-3 stroke-[3]" />
              مُكْتَمَل
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              {remaining}x
            </span>
          )}
          <h2 className="text-xs sm:text-sm font-bold text-zinc-100">{title}</h2>
        </div>

        {/* Small Action Icons */}
        <div className="flex items-center gap-1">
          {enableTTS && (
            <button
              onClick={handleTTS}
              type="button"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isSpeaking ? 'bg-emerald-500 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="استماع للدعاء"
              aria-label="استماع للدعاء بصوت مسموع"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            type="button"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="نسخ النص"
            aria-label="نسخ نص الذكر"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {isCompleted && (
            <button
              onClick={handleReset}
              type="button"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="إعادة التكرار"
              aria-label="إعادة تعيين هذا الذكر"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Arabic Dua Text */}
      <div className="my-2.5">
        <p className="font-quran text-base sm:text-lg lg:text-xl text-zinc-100 font-normal leading-loose tracking-wide">
          {text}
        </p>
      </div>

      {/* Footer Notes / Reference / Virtue */}
      {(virtue || reference || note) && (
        <div className="mt-3 pt-2.5 border-t border-zinc-900 flex flex-col gap-1 text-[11px] sm:text-xs text-zinc-400">
          {virtue && (
            <div className="text-emerald-400/90 flex items-start gap-1">
              <span className="font-semibold text-emerald-500 shrink-0">الفضل:</span>
              <span>{virtue}</span>
            </div>
          )}
          {note && <div className="text-amber-400/90">{note}</div>}
          {reference && (
            <div className="text-zinc-500 font-mono text-[10px]">
              المصدر: {reference}
            </div>
          )}
        </div>
      )}

      {/* Bottom tap prompt indicator if not completed */}
      {!isCompleted && (
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>اضغط في أي مكان للعد</span>
          <span>المتبقي: {remaining}</span>
        </div>
      )}
    </article>
  );
}
