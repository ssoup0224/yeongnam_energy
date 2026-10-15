"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { IconAlert, IconArrowRight, IconPhone } from "./Icons";

const NOTES: Record<"in" | "out", Bi[]> = {
  in: [
    { ko: "전 사용자의 전출 처리가 끝나야 개시가 가능합니다.", en: "Service can only start once the previous user's move-out is complete." },
    { ko: "방문 시 세대 내부에 성인이 계셔야 합니다.", en: "An adult must be present inside the home during the visit." },
    { ko: "사용계약서는 방문 전 알림톡으로 미리 작성하실 수 있습니다.", en: "You can fill out the service contract in advance via the notification link." },
    { ko: "연결비·수수료는 센터별 고시 금액이 적용됩니다.", en: "Connection fees and charges follow each center's posted rates." },
  ],
  out: [
    { ko: "이사 3일 전까지 신청하시면 원하는 날짜에 방문합니다.", en: "Apply at least 3 days before moving and we'll visit on your chosen date." },
    { ko: "정산 요금은 카드 결제 또는 계좌이체만 가능합니다. (현금 불가)", en: "Final charges can be paid by card or bank transfer only (no cash)." },
    { ko: "방문 시 계량기 앞에 물건이 없도록 치워주세요.", en: "Please clear any items in front of the meter before the visit." },
    { ko: "자동이체를 쓰셨다면 별도로 해지하지 않아도 됩니다.", en: "If you used auto-pay, there's no need to cancel it separately." },
  ],
};

export default function MoveAside({ kind }: { kind: "in" | "out" }) {
  const { lang } = useLang();
  const t = useT();

  const related = [
    {
      label: kind === "in" ? t("전출신청 (이전 집)", "Move-out (old home)") : t("전입신청 (새 집)", "Move-in (new home)"),
      href: kind === "in" ? "/move/out" : "/move/in",
    },
    { label: t("자동이체 신청", "Auto-pay setup"), href: "/bill/auto" },
    { label: t("모바일 청구서 신청", "Switch to mobile bill"), href: "/bill/type" },
    { label: t("방문예약 확인·변경", "Visit booking"), href: "/move/reservation" },
  ];

  return (
    <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-ink-900">
          <IconAlert className="size-4 text-sk-orange-500" />
          {t("신청 전 확인하세요", "Before you apply")}
        </h2>
        <ul className="mt-3.5 space-y-2.5">
          {NOTES[kind].map((n) => (
            <li key={n.ko} className="flex items-start gap-2.5">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sk-red-400" />
              <span className="text-[0.875rem] leading-relaxed text-ink-600">{pick(n, lang)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5">
        <h2 className="text-base font-extrabold text-ink-900">{t("함께 하면 좋은 신청", "You may also need")}</h2>
        <ul className="mt-3 space-y-2">
          {related.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex min-h-12 items-center gap-2 rounded-xl border border-ink-200 px-4 text-[0.875rem] font-bold text-ink-800 transition hover:border-sk-red-300 hover:bg-sk-red-50"
              >
                {l.label}
                <IconArrowRight className="ml-auto size-3.5 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={`tel:${SITE.callCenter}`}
        className="flex items-center gap-4 rounded-[1.25rem] border border-ink-200 bg-white p-5 transition hover:border-sk-red-300"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sk-red-50 text-sk-red-600">
          <IconPhone className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[0.75rem] text-ink-500">{t("전화 신청도 가능합니다", "You can also apply by phone")}</span>
          <span className="block text-lg font-extrabold tabular-nums text-ink-900">
            {SITE.callCenter}
          </span>
        </span>
      </a>
    </aside>
  );
}
