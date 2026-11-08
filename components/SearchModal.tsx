'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSettings } from '@/lib/theme-context';
import { Search, X, ChevronLeft, Sparkles } from 'lucide-react';
import duasData from '@/data/duas.json';

interface SearchItem {
  id: string;
  title: string;
  text: string;
  categoryName: string;
  href: string;
  tags: string[];
}

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useAppSettings();
  const [internalQuery, setInternalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen) {
      setInternalQuery(searchQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen, searchQuery]);

  // Build searchable corpus from duasData
  const allSearchItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];

    // 1. After prayer
    duasData.after_prayer.forEach((d) => {
      items.push({
        id: d.id,
        title: d.title,
        text: d.text,
        categoryName: 'بعد الصلاة',
        href: '/after-prayer',
        tags: d.tags || [],
      });
    });

    // 2. Morning Adhkar
    duasData.adhkar.morning.forEach((d) => {
      items.push({
        id: d.id,
        title: d.title,
        text: d.text,
        categoryName: 'أذكار الصباح',
        href: '/adhkar?time=morning',
        tags: d.tags || [],
      });
    });

    // 3. Evening Adhkar
    duasData.adhkar.evening.forEach((d) => {
      items.push({
        id: d.id,
        title: d.title,
        text: d.text,
        categoryName: 'أذكار المساء',
        href: '/adhkar?time=evening',
        tags: d.tags || [],
      });
    });

    // 4. Travel Duas
    duasData.travel.forEach((d) => {
      items.push({
        id: d.id,
        title: d.title,
        text: d.text,
        categoryName: 'أدعية السفر',
        href: '/travel',
        tags: d.tags || [],
      });
    });

    // 5. Family Duas
    duasData.family.forEach((d) => {
      items.push({
        id: d.id,
        title: d.title,
        text: d.text,
        categoryName: d.category_ar,
        href: '/family',
        tags: d.tags || [],
      });
    });

    // 6. Friday
    duasData.friday.last_hour_dua.duas.forEach((d, idx) => {
      items.push({
        id: `fri_dua_${idx}`,
        title: 'دعاء ساعة الاستجابة يوم الجمعة',
        text: d,
        categoryName: 'يوم الجمعة',
        href: '/friday',
        tags: ['جمعة', 'استجابة', 'دعاء'],
      });
    });

    // 7. Prayer Guide Short Surahs
    duasData.prayer_guide.short_surahs.forEach((s) => {
      items.push({
        id: `surah_${s.number}`,
        title: `سورة ${s.name}`,
        text: s.text,
        categoryName: 'قصار السور للصلاة',
        href: '/prayer-guide',
        tags: ['صلاة', 'قرآن', 'سورة', s.name],
      });
    });

    return items;
  }, []);

  // Filtered items based on query
  const filtered = useMemo(() => {
    const q = internalQuery.trim().toLowerCase();
    if (!q) return [];

    return allSearchItems.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchText = item.text.toLowerCase().includes(q);
      const matchCategory = item.categoryName.toLowerCase().includes(q);
      const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchTitle || matchText || matchCategory || matchTags;
    });
  }, [allSearchItems, internalQuery]);

  const quickMoods = [
    { tag: 'سفر', label: '🚗 سفر وطريق' },
    { tag: 'قلق', label: '🌿 قلق وهم' },
    { tag: 'مطر', label: '🌧️ مطر وخير' },
    { tag: 'والدين', label: '🤲 للوالدين' },
    { tag: 'نوم', label: '🌙 نوم ومساء' },
    { tag: 'شفاء', label: '🤍 شفاء وعافية' },
    { tag: 'رزق', label: '✨ رزق وبركة' },
    { tag: 'جمعة', label: '🕌 يوم الجمعة' },
  ];

  if (!isSearchOpen) return null;

  const handleSelect = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setInternalQuery('');
    router.push(href);
  };

  const handleClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setInternalQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start bg-black/80 backdrop-blur-md px-3 pt-6 animate-in fade-in duration-200">
      <div className="w-full max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-3 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={internalQuery}
            onChange={(e) => setInternalQuery(e.target.value)}
            placeholder="ابحث: سفر، قلق، مطر، شفاء، استخارة..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
          />
          {internalQuery && (
            <button
              onClick={() => setInternalQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-xs text-zinc-400 hover:text-zinc-100 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0"
          >
            إغلاق
          </button>
        </div>

        {/* Quick Mood / Keyword suggestions */}
        <div className="py-2.5 border-b border-zinc-900 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mr-1" />
          {quickMoods.map((m) => (
            <button
              key={m.tag}
              onClick={() => setInternalQuery(m.tag)}
              className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
                internalQuery === m.tag
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2 divide-y divide-zinc-900">
          {internalQuery.trim() === '' ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              اكتب كلمة للبحث الفوري أو اختر من الحالات المقترحة أعلاه.
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              لم نجد أدعية مطابقة لكلمة &quot;{internalQuery}&quot;. جرب كلمة أخرى مثل: سفر، قلق، نوم.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.href)}
                className="py-2.5 px-2 hover:bg-zinc-900/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-900/40 px-1.5 py-0.5 rounded">
                      {item.categoryName}
                    </span>
                    <h4 className="text-xs font-semibold text-zinc-200 truncate group-hover:text-emerald-300">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 font-quran leading-relaxed">
                    {item.text}
                  </p>
                </div>
                <ChevronLeft className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:-translate-x-1" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
