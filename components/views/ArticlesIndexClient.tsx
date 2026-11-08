'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Clock, Calendar, ArrowLeft, Sparkles, Tag } from 'lucide-react';
import { ArticleItem } from '@/lib/types';

interface ArticlesIndexClientProps {
  articles: ArticleItem[];
}

export default function ArticlesIndexClient({ articles }: ArticlesIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = ['الكل'];
    articles.forEach((a) => {
      if (!cats.includes(a.category)) {
        cats.push(a.category);
      }
    });
    return cats;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCategory = selectedCategory === 'الكل' || article.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.keywords.some((k) => k.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-zinc-950/80 p-3.5 sm:p-4 rounded-2xl border border-zinc-800">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المقالات: الصلاة، السفر، الجمعة، الوالدين..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500/60 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all border ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid (Spacious 2-column or 3-column layout on desktop) */}
      {filteredArticles.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 text-xs sm:text-sm bg-zinc-950 rounded-2xl border border-zinc-800">
          لم يتم العثور على مقالات تطابق بحثك. جرب كلمة أخرى أو اختر تصنيفاً مختلفاً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-950/20"
            >
              <div>
                {/* Category & Reading Time */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-900/60 px-2.5 py-0.5 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{article.readingTime}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h2 className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors leading-snug mb-2 font-quran">
                  <Link href={`/articles/${article.slug}`} className="focus:outline-none">
                    {article.title}
                  </Link>
                </h2>

                {/* Subtitle / Excerpt */}
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                  {article.description}
                </p>
              </div>

              {/* Card Footer: Date & Link */}
              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                <span className="text-zinc-500 text-[11px]">
                  {new Date(article.datePublished).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <Link
                  href={`/articles/${article.slug}`}
                  className="flex items-center gap-1 font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors text-xs"
                  title={`قراءة مقال ${article.title}`}
                >
                  <span>اقرأ المقال</span>
                  <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
