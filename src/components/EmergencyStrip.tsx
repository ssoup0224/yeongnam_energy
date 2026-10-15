"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";
import { useT } from "@/lib/i18n";
import { IconAlert, IconArrowRight, IconPhone } from "./Icons";

/**
 * Compact safety bar for the signed-in home, where the full emergency card
 * isn't in the hero. Keeps the leak hotline one tap away.
 */
export default function EmergencyStrip() {
  const t = useT();

  return (
    <section aria-label={t("가스 안전", "Gas safety")} className="shell pb-9 lg:pb-12">
      <div className="flex flex-col gap-4 rounded-[1.25rem] border-2 border-sk-red-200 bg-sk-red-50 p-5 sm:flex-row sm:items-center lg:p-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sk-red-500 text-white">
          <IconAlert className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.9375rem] font-extrabold text-ink-900">
            {t("가스 냄새가 나나요?", "Do you smell gas?")}
          </p>
          <p className="mt-0.5 text-[0.8125rem] text-ink-600">
            {t(
              "밸브를 잠그고 창문을 연 뒤, 밖으로 나와 신고하세요.",
              "Close the valve, open windows, go outside, then call.",
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href="/safety"
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-sk-red-200 bg-white px-4 text-[0.875rem] font-bold text-sk-red-700 hover:bg-white"
          >
            {t("행동요령", "Safety steps")} <IconArrowRight className="size-3.5" />
          </Link>
          <a
            href={`tel:${SITE.safetyLine}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sk-red-500 px-5 text-[0.9375rem] font-extrabold text-white transition hover:bg-sk-red-600"
          >
            <IconPhone className="size-4" />
            {SITE.safetyLine}
          </a>
        </div>
      </div>
    </section>
  );
}
