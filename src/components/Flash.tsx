"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconCheck } from "./Icons";

const KEY = "yes-flash";

/** One-off confirmation carried across a navigation (sessionStorage "yes-flash"). */
export default function Flash() {
  const pathname = usePathname();
  const [msg, setMsg] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- read sessionStorage after navigation */
  useEffect(() => {
    try {
      const m = sessionStorage.getItem(KEY);
      if (m) {
        sessionStorage.removeItem(KEY);
        setMsg(m);
      }
    } catch {}
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!msg) return;
    const h = window.setTimeout(() => setMsg(null), 4500);
    return () => window.clearTimeout(h);
  }, [msg]);

  if (!msg) return null;
  return (
    <div role="status" className="fade-up fixed inset-x-4 bottom-20 z-[70] mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink-900 px-4 py-3.5 text-[0.875rem] font-bold text-white shadow-xl lg:bottom-8">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500"><IconCheck className="size-4" /></span>
      {msg}
    </div>
  );
}
