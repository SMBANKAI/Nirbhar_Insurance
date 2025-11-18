
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const useTranslation = () => {
  const { language, setLanguage, translations } = useContext(LanguageContext);

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to the key itself if translation is not found
        return key;
      }
    }
    
    let translatedString = result || key;
    if (options && typeof translatedString === 'string') {
      for (const optionKey in options) {
        translatedString = translatedString.replace(new RegExp(`{{${optionKey}}}`, 'g'), String(options[optionKey]));
      }
    }
    return translatedString;
  };

  return {
    language,
    setLanguage,
    t,
  };
};
