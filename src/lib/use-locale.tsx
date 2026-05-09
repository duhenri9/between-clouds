"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Locale } from "./i18n-dict";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getNestedValue(obj: unknown, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj) as string ?? path;
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "pt-BR";
  try {
    const saved = localStorage.getItem("bc-locale") as Locale | null;
    if (saved && (saved === "en" || saved === "pt-BR")) return saved;
  } catch {
    // localStorage unavailable
  }
  return "pt-BR";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("bc-locale", l);
  }, []);

  const t = useCallback(
    (key: string) => {
      return getNestedValue(translations[locale], key);
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
