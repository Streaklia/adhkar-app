'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppSettingsContextType {
  isOled: boolean;
  toggleOled: () => void;
  hapticEnabled: boolean;
  toggleHaptic: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType>({
  isOled: true, // Default to sleek OLED black mode
  toggleOled: () => {},
  hapticEnabled: true,
  toggleHaptic: () => {},
  soundEnabled: true,
  toggleSound: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
});

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOled, setIsOled] = useState<boolean>(true);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedOled = localStorage.getItem('doua_oled');
      if (storedOled !== null) {
        setIsOled(storedOled === 'true');
      }

      const storedHaptic = localStorage.getItem('doua_haptic');
      if (storedHaptic !== null) {
        setHapticEnabled(storedHaptic === 'true');
      }

      const storedSound = localStorage.getItem('doua_sound');
      if (storedSound !== null) {
        setSoundEnabled(storedSound === 'true');
      }
    } catch (e) {
      console.warn('LocalStorage access warning:', e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('doua_oled', String(isOled));
      const htmlEl = document.documentElement;
      if (isOled) {
        htmlEl.classList.add('oled-mode', 'dark');
        htmlEl.style.backgroundColor = '#000000';
      } else {
        htmlEl.classList.remove('oled-mode');
        htmlEl.classList.add('dark'); // elegant dark slate theme when not pure black
        htmlEl.style.backgroundColor = '#0b0f19';
      }
    } catch {}
  }, [isOled, mounted]);

  const toggleOled = () => {
    setIsOled(prev => !prev);
  };

  const toggleHaptic = () => {
    setHapticEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('doua_haptic', String(next));
      } catch {}
      return next;
    });
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('doua_sound', String(next));
      } catch {}
      return next;
    });
  };

  return (
    <AppSettingsContext.Provider
      value={{
        isOled,
        toggleOled,
        hapticEnabled,
        toggleHaptic,
        soundEnabled,
        toggleSound,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
