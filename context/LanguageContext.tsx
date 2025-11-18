
import React, { createContext, useState, useEffect, useCallback } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translations: {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('nirbhar_lang') || 'en';
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const fetchTranslations = useCallback(async (lang: string) => {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) {
          // Fallback to English if a language file is missing
          console.warn(`Translation file for ${lang} not found, falling back to English.`);
          const enResponse = await fetch(`/locales/en.json`);
          const enData = await enResponse.json();
          setTranslations(enData);
          return;
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }, []);

  useEffect(() => {
    fetchTranslations(language);
  }, [language, fetchTranslations]);
  
  const setLanguage = (lang: string) => {
    localStorage.setItem('nirbhar_lang', lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
