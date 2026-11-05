"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";

const SUFFIX = "Yeongnam Energy Service Pohang";
const HOME = `${SUFFIX} | City Gas Billing, Requests & Safety`;

/**
 * Page titles come from static (Korean) metadata. In English mode, mirror the
 * visible page heading into the tab title instead, and put the Korean title
 * back when the visitor switches language again.
 */
export default function DocTitle() {
  const { lang } = useLang();
  const pathname = usePathname();

  useEffect(() => {
    if (lang !== "en") return;
    let original = document.title;
    let wanted = "";

    const apply = () => {
      const h1 = document.querySelector<HTMLElement>("main h1");
      const name = h1?.innerText.replace(/\s+/g, " ").trim();
      wanted = pathname === "/" || !name ? HOME : `${name} | ${SUFFIX}`;
      if (document.title !== wanted) {
        original = document.title; // Next just (re)wrote the Korean title
        document.title = wanted;
      }
    };

    apply();
    const late = setTimeout(apply, 80);
    const obs = new MutationObserver(apply);
    obs.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      clearTimeout(late);
      obs.disconnect();
      if (document.title === wanted) document.title = original;
    };
  }, [lang, pathname]);

  return null;
}
