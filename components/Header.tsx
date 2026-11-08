'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSettings } from '@/lib/theme-context';
import { 
  Search, 
  Moon, 
  Sun, 
  Smartphone, 
  SmartphoneNfc, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const {
    isOled,
    toggleOled,
    hapticEnabled,
    toggleHaptic,
    searchQuery,
    setIsSearchOpen,
  } = useAppSettings();

  // Desktop keyboard shortcut listener: Pressing '/' opens the search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses '/' and is not already typing in an input
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const navLinks = [
    { href: '/after-prayer', label: 'بعد الصلاة' },
    { href: '/adhkar', label: 'الصباح والمساء' },
    { href: '/prayer-guide', label: 'دليل الصلاة' },
    { href: '/travel', label: 'أدعية السفر' },
    { href: '/friday', label: 'يوم الجمعة' },
    { href: '/family', label: 'الأهل والوالدين' },
    { href: '/articles', label: 'المقالات' },
  ];

  return (
    <header className="w-full flex flex-col gap-3 pb-3 pt-1 border-b border-zinc-800/60 mb-5 sticky top-0 z-40 bg-[var(--bg-main)]/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        {/* Brand or Back Button */}
        <div className="flex items-center gap-3">
          {!isHome ? (
            <Link
              href="/"
              className="px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold border border-zinc-800"
              title="العودة إلى الصفحة الرئيسية"
              aria-label="العودة إلى الصفحة الرئيسية"
            >
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>الرئيسية</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 group"
              title="تطبيق دُعَاء - الصفحة الرئيسية"
              aria-label="تطبيق دُعَاء"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-zinc-100 group-hover:text-emerald-400 transition-colors">
                دُعَاء
              </span>
            </Link>
          )}

          {/* Desktop quick links (hidden on mobile, visible on tablet/desktop) */}
          <nav className="hidden md:flex items-center gap-1 mr-2" aria-label="التنقل الرئيسي">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    isActive
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                  title={link.label}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center / Search bar on Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-2.5 bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl px-3.5 py-1.5 text-xs text-zinc-400 cursor-pointer transition-all shadow-inner"
            role="button"
            tabIndex={0}
            aria-label="فتح نافذة البحث الفوري"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-zinc-400 text-xs truncate">
              {searchQuery || 'ابحث: سفر، قلق، مطر، شفاء، استخارة...'}
            </span>
            <kbd className="mr-auto text-[10px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
              /
            </kbd>
          </div>
        </div>

        {/* Right Action Icons: OLED toggle & Vibration/Mute toggle */}
        <div className="flex items-center gap-2">
          {/* OLED Toggle Button */}
          <button
            onClick={toggleOled}
            type="button"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isOled
                ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700/60'
            }`}
            title={isOled ? 'وضع أسود OLED حقيقي (مُفعل)' : 'الوضع الليلي الكحلي'}
            aria-label={isOled ? 'تعطيل وضع OLED الأسود' : 'تفعيل وضع OLED الأسود'}
          >
            {isOled ? (
              <>
                <Moon className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span className="text-[11px] font-mono">OLED</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">داكن</span>
              </>
            )}
          </button>

          {/* Haptic & Sound Toggle */}
          <button
            onClick={toggleHaptic}
            type="button"
            className={`p-2 rounded-xl text-xs transition-all ${
              hapticEnabled
                ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800'
            }`}
            title={hapticEnabled ? 'الاهتزاز والصوت مفعل' : 'الاهتزاز والصوت صامت'}
            aria-label={hapticEnabled ? 'كتم الاهتزاز والصوت' : 'تشغيل الاهتزاز والصوت'}
          >
            {hapticEnabled ? (
              <SmartphoneNfc className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4 opacity-50" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Search Bar (visible on small/medium screens) */}
      <div className="relative w-full lg:hidden">
        <div
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-400 cursor-pointer transition-all shadow-inner"
          role="button"
          tabIndex={0}
          aria-label="فتح نافذة البحث الفوري"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            readOnly
            value={searchQuery}
            placeholder="ابحث: سفر، قلق، مطر، شفاء، استخارة..."
            className="w-full bg-transparent border-none outline-none text-xs text-zinc-200 placeholder:text-zinc-500 cursor-pointer pointer-events-none"
            aria-label="حقل البحث"
          />
          <kbd className="text-[9px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50 font-mono">
            /
          </kbd>
        </div>
      </div>
    </header>
  );
}
