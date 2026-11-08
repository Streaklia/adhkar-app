'use client';

import React, { useState } from 'react';
import duasData from '@/data/duas.json';
import { Volume2, VolumeX, WifiOff, Copy, Check } from 'lucide-react';
import { speakArabic, stopArabicSpeech, triggerHaptic } from '@/lib/audio-haptics';
import { useAppSettings } from '@/lib/theme-context';

export default function TravelClient() {
  const { hapticEnabled } = useAppSettings();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [largeFont, setLargeFont] = useState<boolean>(true); // Default to high-contrast large font for road safety

  const handlePlayTTS = (id: string, text: string) => {
    if (playingId === id) {
      stopArabicSpeech();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    if (hapticEnabled) triggerHaptic('light', true);

    speakArabic(
      text,
      () => setPlayingId(null),
      () => setPlayingId(null)
    );
  };

  const handleCopy = (id: string, title: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title}\n\n${text}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      if (hapticEnabled) triggerHaptic('light', true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-8">
      {/* Font Switcher & Offline Indicator */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">
            أدعية المسافر مكتوبة بخط عريض وواضح
          </span>
          <span className="hidden sm:inline-flex text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-900/60 px-2 py-0.5 rounded-full items-center gap-1 font-mono">
            <WifiOff className="w-2.5 h-2.5" />
            جاهز دائماً دون إنترنت
          </span>
        </div>

        {/* Font size toggle */}
        <button
          onClick={() => setLargeFont((prev) => !prev)}
          type="button"
          className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all"
          title="تبديل حجم الخط للقراءة أثناء الحركة"
          aria-label="تبديل حجم الخط"
        >
          {largeFont ? 'خط قياسي' : 'خط كبير جداً'}
        </button>
      </div>

      {/* Travel Duas Cards (Responsive 2-Column Grid on Tablet/Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {duasData.travel.map((dua) => {
          const isCurrentPlaying = playingId === dua.id;
          return (
            <article
              key={dua.id}
              id={dua.id}
              className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-lg flex flex-col justify-between gap-4 transition-all hover:border-indigo-500/30"
            >
              <div>
                {/* Header inside card */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
                  <h2 className="text-xs sm:text-sm font-bold text-indigo-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    {dua.title}
                  </h2>

                  <div className="flex items-center gap-1.5">
                    {/* TTS Play Button */}
                    <button
                      onClick={() => handlePlayTTS(dua.id, dua.text)}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isCurrentPlaying
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-indigo-500/50'
                      }`}
                      title="استماع للدعاء بصوت مسموع"
                      aria-label={isCurrentPlaying ? 'إيقاف الاستماع' : 'استماع للدعاء'}
                    >
                      {isCurrentPlaying ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>إيقاف</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>استماع</span>
                        </>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(dua.id, dua.title, dua.text)}
                      type="button"
                      className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                      title="نسخ الدعاء"
                      aria-label="نسخ نص الدعاء"
                    >
                      {copiedId === dua.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Large High Contrast Arabic Dua Text */}
                <div className="py-1">
                  <p
                    className={`font-quran leading-loose tracking-wide text-zinc-50 ${
                      largeFont ? 'text-lg sm:text-xl lg:text-2xl font-medium' : 'text-base sm:text-lg'
                    }`}
                  >
                    {dua.text}
                  </p>
                </div>
              </div>

              {/* Reference */}
              <div className="text-[11px] text-zinc-500 font-mono border-t border-zinc-900/80 pt-3 flex items-center justify-between">
                <span>المصدر: {dua.reference}</span>
                <span className="text-zinc-600">محفوظ دون اتصال</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
