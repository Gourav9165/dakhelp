'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { enTranslations, TranslationKey } from './translations-en';
import { hiTranslations } from './translations-hi';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isHindi: boolean;
}

const STORAGE_KEY = 'dak_help_language';

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: TranslationKey) => enTranslations[key] || key,
  isHindi: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'en' || saved === 'hi') {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage access errors (e.g. private browsing)
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  };

  const isHindi = language === 'hi';

  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      if (language === 'hi') {
        return hiTranslations[key] ?? enTranslations[key] ?? key;
      }
      return enTranslations[key] ?? key;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isHindi }}>
      <div lang={language} className={isHindi ? 'font-hindi' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
