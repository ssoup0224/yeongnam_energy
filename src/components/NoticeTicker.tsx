"use client";

import Link from "next/link";
import { useState } from "react";
import { NOTICES } from "@/lib/site";
import { pick, useLang, useT } from "@/lib/i18n";
import { IconClose, IconPause, IconPlay } from "./Icons";

const items = NOTICES.filter((n) => n.important);

export default function NoticeTicker() {
  const { lang } = useLang();
  const t = useT();
  const [paused, setPaused] = useState(false);
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <aside
      aria-label={t("중요 공지", "Important notice")}
      className={`border-b border-ink-200 bg-ink-900 text-white no-print ${paused ? "ticker-paused" : ""}`}
    >
      <div className="shell flex h-12 items-center gap-3">
        <span className="hidden shrink-0 rounded-full bg-sk-red-500 px-2.5 py-1 text-[0.6875rem] font-extrabold sm:block">
          {t("중요 공지", "Notice")}
        </span>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track gap-10">
            {[...items, ...items].map((n, i) => (
              <Link
                key={`${n.id}-${i}`}
                href="/support"
                className="flex shrink-0 items-center gap-2 text-[0.8125rem] text-white/90 hover:text-white hover:underline"
                aria-hidden={i >= items.length}
                tabIndex={i >= items.length ? -1 : 0}
              >
                <span className="rounded bg-white/15 px-1.5 py-0.5 text-[0.6875rem] font-bold">
                  {pick(n.tag, lang)}
                </span>
                {pick(n.title, lang)}
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? t("공지 자동 흐름 재생", "Play notice scroll") : t("공지 자동 흐름 정지", "Pause notice scroll")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          {paused ? <IconPlay className="size-4" /> : <IconPause className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label={t("중요 공지 닫기", "Dismiss notice")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          <IconClose className="size-4" />
        </button>
      </div>
    </aside>
  );
}
