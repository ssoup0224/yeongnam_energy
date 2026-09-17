import Link from "next/link";
import { SITE } from "@/lib/site";
import { IconAlert, IconArrowRight, IconPhone } from "./Icons";

const NOTES = {
  in: [
    "전 사용자의 전출 처리가 끝나야 개시가 가능합니다.",
    "방문 시 세대 내부에 성인이 계셔야 합니다.",
    "사용계약서는 방문 전 알림톡으로 미리 작성하실 수 있습니다.",
    "연결비·수수료는 센터별 고시 금액이 적용됩니다.",
  ],
  out: [
    "이사 3일 전까지 신청하시면 원하는 날짜에 방문합니다.",
    "정산 요금은 카드 결제 또는 계좌이체만 가능합니다. (현금 불가)",
    "방문 시 계량기 앞에 물건이 없도록 치워주세요.",
    "자동이체를 쓰셨다면 별도로 해지하지 않아도 됩니다.",
  ],
};

export default function MoveAside({ kind }: { kind: "in" | "out" }) {
  return (
    <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-ink-900">
          <IconAlert className="size-4 text-sk-orange-500" />
          신청 전 확인하세요
        </h2>
        <ul className="mt-3.5 space-y-2.5">
          {NOTES[kind].map((n) => (
            <li key={n} className="flex items-start gap-2.5">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sk-red-400" />
              <span className="text-[0.875rem] leading-relaxed text-ink-600">{n}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5">
        <h2 className="text-base font-extrabold text-ink-900">함께 하면 좋은 신청</h2>
        <ul className="mt-3 space-y-2">
          {[
            { label: kind === "in" ? "전출신청 (이전 집)" : "전입신청 (새 집)", href: kind === "in" ? "/move/out" : "/move/in" },
            { label: "자동이체 신청", href: "/bill/auto" },
            { label: "모바일 청구서 신청", href: "/bill/type" },
            { label: "방문예약 확인·변경", href: "/move/reservation" },
          ].map((l) => (
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
          <span className="block text-[0.75rem] text-ink-500">전화 신청도 가능합니다</span>
          <span className="block text-lg font-extrabold tabular-nums text-ink-900">
            {SITE.callCenter}
          </span>
        </span>
      </a>
    </aside>
  );
}
