'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { getDictionary, TranslationKey, Dictionary } from "@/lib/translations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface AppContextType {
  lang: string;
  setLang: (lang: string) => void;
  dictionary: Dictionary;
  t: (key: TranslationKey | string) => string;
  isHydrated: boolean;
  isRTL: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL is the source of truth for the language
  const currentLangFromUrl = searchParams.get('lang') || 'en';

  const [lang, setInternalLang] = useState(currentLangFromUrl);
  const [dictionary, setDictionary] = useState<Dictionary>({} as any);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync state with URL when URL changes
  useEffect(() => {
    if (currentLangFromUrl !== lang) {
      setInternalLang(currentLangFromUrl);
    }
  }, [currentLangFromUrl, lang]);

  const setLang = useCallback((newLang: string) => {
    // Update internal state first for immediate UI responsiveness
    setInternalLang(newLang);
    
    const params = new URLSearchParams(searchParams.toString());
    if (newLang === 'en') {
      params.delete('lang');
    } else {
      params.set('lang', newLang);
    }
    
    const queryString = params.toString();
    const url = `${pathname}${queryString ? `?${queryString}` : ''}`;
    
    // Use router to update the URL
    router.push(url, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const fetchDictionary = async () => {
      const d = await getDictionary(lang);
      setDictionary(d);
      if (!isHydrated) {
        setIsHydrated(true);
      }
    };
    fetchDictionary();
  }, [lang, isHydrated]);

  const isRTL = lang === 'he' || lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  const t = useCallback((key: TranslationKey | string): string => {
    if (dictionary && (dictionary as any)[key]) {
      return (dictionary as any)[key] as string;
    }
    return String(key);
  }, [dictionary]);

  const value = {
    lang,
    setLang,
    dictionary,
    t,
    isHydrated,
    isRTL
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
