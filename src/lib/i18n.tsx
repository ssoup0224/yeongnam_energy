"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ──────────────────────────────────────────────────────────────
   Client-side language toggle.

   URLs stay the same (/bill, /safety); the chosen language lives in
   the browser (localStorage) and flips the rendered strings at runtime.
   Korean is the default — the first server render and the first client
   render both use "ko", so there is no hydration mismatch; if the saved
   choice is "en" the UI updates right after mount.

   Three ways to render a string, depending on the component:
   • <T ko="로그인" en="Log in" />   — inside a Server Component (JSX text)
   • const t = useT(); t("로그인", "Log in")  — Client Component, attrs
   • pick(item.label, lang)          — bilingual data from site.ts
   ────────────────────────────────────────────────────────────── */

export type Lang = "ko" | "en";

/** A string that exists in both languages. */
export type Bi = { ko: string; en: string };

/** Resolve a bilingual value (or a plain string) for the active language. */
export function pick(v: Bi | string, lang: Lang): string {
  if (typeof v === "string") return v;
  return lang === "en" ? v.en : v.ko;
}

const STORAGE_KEY = "yes-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko");

  // Pick up the saved choice after mount. This must run in an effect, not a
  // lazy initializer: the server renders "ko", so the first client render has
  // to match "ko" too — updating here keeps hydration clean.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount sync
      if (saved === "ko" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  // Keep the document in sync so CSS (and assistive tech) see the real lang.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}

/** `t("한국어", "English")` — for Client Components, attributes especially. */
export function useT() {
  const { lang } = useLang();
  return (ko: string, en: string) => (lang === "en" ? en : ko);
}

/** Renders the active language's node. Usable inside Server Components. */
export function T({ ko, en }: { ko: ReactNode; en: ReactNode }) {
  const { lang } = useLang();
  return <>{lang === "en" ? en : ko}</>;
}

/**
 * Runs before paint to set <html lang>/data-lang from the saved choice, so
 * CSS-driven swaps (e.g. the per-language logo) don't flash on first load.
 * Dropped into <head> as a tiny inline script.
 */
export const langBootScript = `(function(){try{var l=localStorage.getItem('${STORAGE_KEY}');if(l==='en'||l==='ko'){document.documentElement.lang=l;document.documentElement.setAttribute('data-lang',l);}else{document.documentElement.setAttribute('data-lang','ko');}}catch(e){document.documentElement.setAttribute('data-lang','ko');}})();`;
