import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  LanguageOption,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
} from '../i18n/translations';

interface LanguageContextType {
  // App UI Language
  appLanguage: LanguageCode;
  setAppLanguage: (lang: LanguageCode) => void;
  currentAppLanguage: LanguageOption;

  // Ask / Voice / Conversational Language
  askLanguage: LanguageCode;
  setAskLanguage: (lang: LanguageCode) => void;
  currentAskLanguage: LanguageOption;
  askSpeechLocale: string;

  // Backward-compatibility aliases
  language: LanguageCode;
  currentLanguage: LanguageOption;
  setLanguage: (lang: LanguageCode) => void;
  aiLanguageName: string;

  // UI Translation & Voice helpers
  t: (key: string, fallback?: string) => string;
  autoReadAnswers: boolean;
  setAutoReadAnswers: (enabled: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const APP_LANGUAGE_STORAGE_KEY = 'civic_language_pref';
const ASK_LANGUAGE_STORAGE_KEY = 'civic_ask_language_pref';
const AUTOREAD_STORAGE_KEY = 'civic_autoread_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. App Language (UI / Navigation / Menus / Settings)
  const [appLanguage, setAppLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved as LanguageCode;
      }
      if (typeof navigator !== 'undefined' && navigator.language) {
        const navLang = navigator.language.toLowerCase();
        if (navLang.startsWith('hi')) return 'hi';
        if (navLang.startsWith('bn')) return 'bn';
        if (navLang.startsWith('ta')) return 'ta';
        if (navLang.startsWith('te')) return 'te';
        if (navLang.startsWith('mr')) return 'mr';
        if (navLang.startsWith('gu')) return 'gu';
        if (navLang.startsWith('kn')) return 'kn';
        if (navLang.startsWith('ml')) return 'ml';
        if (navLang.startsWith('pa')) return 'pa';
        if (navLang.startsWith('or')) return 'or';
        if (navLang.startsWith('as')) return 'as';
        if (navLang.startsWith('ur')) return 'ur';
      }
    } catch {}
    return 'en';
  });

  // 2. Ask / Voice Language (Conversational AI / Mic Speech Recognition)
  const [askLanguage, setAskLanguageState] = useState<LanguageCode>(() => {
    try {
      const savedAsk = localStorage.getItem(ASK_LANGUAGE_STORAGE_KEY);
      if (savedAsk && SUPPORTED_LANGUAGES.some((l) => l.code === savedAsk)) {
        return savedAsk as LanguageCode;
      }
      // If no explicit ask language saved, default to Hindi ('hi') or English ('en')
      const savedApp = localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
      if (savedApp && SUPPORTED_LANGUAGES.some((l) => l.code === savedApp)) {
        return savedApp as LanguageCode;
      }
    } catch {}
    return 'hi'; // Conversational AI defaults to Hindi for multilingual voice, or matches app
  });

  const [autoReadAnswers, setAutoReadAnswersState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTOREAD_STORAGE_KEY);
      return saved === 'true';
    } catch {}
    return false;
  });

  // Persist App Language
  useEffect(() => {
    try {
      localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, appLanguage);
      document.documentElement.setAttribute('lang', appLanguage);
    } catch {}
  }, [appLanguage]);

  // Persist Ask / Voice Language
  useEffect(() => {
    try {
      localStorage.setItem(ASK_LANGUAGE_STORAGE_KEY, askLanguage);
    } catch {}
  }, [askLanguage]);

  // Persist Auto-read preference
  useEffect(() => {
    try {
      localStorage.setItem(AUTOREAD_STORAGE_KEY, String(autoReadAnswers));
    } catch {}
  }, [autoReadAnswers]);

  const currentAppLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === appLanguage) || SUPPORTED_LANGUAGES[0];

  const currentAskLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === askLanguage) ||
    SUPPORTED_LANGUAGES.find((l) => l.code === 'hi') ||
    SUPPORTED_LANGUAGES[0];

  const setAppLanguage = (newLang: LanguageCode) => {
    setAppLanguageState(newLang);
    // When App Language changes, synchronize Ask/Conversation Language as default
    setAskLanguageState(newLang);
  };

  const setAskLanguage = (newLang: LanguageCode) => {
    // Allows independent choice of Conversation Language without resetting App Language
    setAskLanguageState(newLang);
  };

  const setAutoReadAnswers = (enabled: boolean) => {
    setAutoReadAnswersState(enabled);
  };

  // Translation helper uses App Language
  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[appLanguage];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        appLanguage,
        setAppLanguage,
        currentAppLanguage,
        askLanguage,
        setAskLanguage,
        currentAskLanguage,
        askSpeechLocale: currentAskLanguage.speechLocale || 'hi-IN',

        // Backwards compatibility aliases
        language: appLanguage,
        currentLanguage: currentAppLanguage,
        setLanguage: setAppLanguage,
        aiLanguageName: currentAskLanguage.aiName,

        t,
        autoReadAnswers,
        setAutoReadAnswers,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
