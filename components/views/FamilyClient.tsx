'use client';

import React, { useState } from 'react';
import duasData from '@/data/duas.json';
import { Share2, Copy, Check } from 'lucide-react';
import { triggerHaptic } from '@/lib/audio-haptics';
import { useAppSettings } from '@/lib/theme-context';

type CategoryFilter = 'all' | 'parents_alive' | 'parents_deceased' | 'siblings' | 'children_family';

export default function FamilyClient() {
  const { hapticEnabled } = useAppSettings();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filterTabs: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'parents_alive', label: 'للوالدين (أحياء)' },
    { id: 'parents_deceased', label: 'للوالدين (متوفين)' },
    { id: 'siblings', label: 'للإخوة والأخوات' },
    { id: 'children_family', label: 'للأبناء والعائلة' },
  ];

  const filteredDuas = duasData.family.filter((dua) => {
    if (selectedCategory === 'all') return true;
    return dua.category === selectedCategory;
  });

  const handleShareWhatsApp = (title: string, text: string) => {
    const formatted = `🌿 *${title}*\n\n${text}\n\n— تطبيق دُعَاء (https://adhkarr.vercel.app)`;
    const encoded = encodeURIComponent(formatted);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    if (hapticEnabled) triggerHaptic('light', true);
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
      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedCategory(tab.id);
              if (hapticEnabled) triggerHaptic('light', true);
            }}
            type="button"
            className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all border ${
              selectedCategory === tab.id
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700'
            }`}
            aria-pressed={selectedCategory === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Duas 2-Column Responsive Grid on Desktop & Tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {filteredDuas.map((dua) => (
          <article
            key={dua.id}
            id={dua.id}
            className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-md flex flex-col justify-between gap-3 hover:border-rose-500/30 transition-colors"
          >
            <div>
              {/* Top row */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-2.5 py-0.5 rounded-full">
                    {dua.category_ar}
                  </span>
                  <h2 className="text-xs sm:text-sm font-bold text-zinc-100">{dua.title}</h2>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
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

                  {/* WhatsApp Share Button */}
                  <button
                    onClick={() => handleShareWhatsApp(dua.title, dua.text)}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                    title="مشاركة عبر واتساب"
                    aria-label="مشاركة الدعاء عبر واتساب"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </button>
                </div>
              </div>

              {/* Arabic Dua Text */}
              <p className="font-quran text-base sm:text-lg text-zinc-100 leading-loose py-1">
                {dua.text}
              </p>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-900 flex-wrap">
              {dua.tags.map((tag) => (
                <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Pre-rendered DOM Content for all family duas so search engine crawlers always index 100% of items regardless of tab */}
      <div className="sr-only" aria-hidden="true">
        <h2>أدعية بر الوالدين والأسرة المكتملة</h2>
        {duasData.family.map((f) => (
          <div key={`crawl_fam_${f.id}`}>
            <h3>{f.title} ({f.category_ar})</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
