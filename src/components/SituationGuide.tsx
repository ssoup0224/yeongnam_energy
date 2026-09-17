"use client";

import Link from "next/link";
import { useState } from "react";
import { IconArrowRight } from "./Icons";

const GROUPS = [
  {
    key: "move",
    tab: "이사할 때",
    lead: "전출 → 전입 순서로 진행하면 요금 정산이 깔끔합니다.",
    steps: [
      { n: 1, label: "전출신청", desc: "이사 3일 전까지 접수", href: "/move/out" },
      { n: 2, label: "방문일 확정", desc: "알림톡으로 일정 확인", href: "/move/reservation" },
      { n: 3, label: "요금 정산", desc: "계량기 지침으로 마감", href: "/bill" },
      { n: 4, label: "전입신청", desc: "새 주소에서 사용 개시", href: "/move/in" },
    ],
  },
  {
    key: "pay",
    tab: "요금을 낼 때",
    lead: "자동이체와 모바일 청구서를 함께 신청하면 매달 할인됩니다.",
    steps: [
      { n: 1, label: "청구요금 확인", desc: "고객번호로 조회", href: "/bill" },
      { n: 2, label: "납부 방법 선택", desc: "카드·계좌·간편결제", href: "/bill" },
      { n: 3, label: "자동이체 등록", desc: "매달 자동 납부", href: "/bill/auto" },
      { n: 4, label: "청구서 유형 변경", desc: "종이 → 모바일", href: "/bill/type" },
    ],
  },
  {
    key: "safety",
    tab: "가스 냄새가 날 때",
    lead: "전기 스위치는 절대 만지지 마세요. 불꽃이 튈 수 있습니다.",
    steps: [
      { n: 1, label: "밸브 잠그기", desc: "중간밸브·계량기 차단", href: "/safety" },
      { n: 2, label: "창문 열기", desc: "자연 환기로 배출", href: "/safety" },
      { n: 3, label: "전기 만지지 않기", desc: "스위치·콘센트 금지", href: "/safety" },
      { n: 4, label: "밖에서 신고", desc: "1544-4500 또는 119", href: "/safety/report" },
    ],
  },
  {
    key: "check",
    tab: "안전점검을 받을 때",
    lead: "도시가스사업법상 가구당 연 2회 이상 점검이 의무입니다.",
    steps: [
      { n: 1, label: "SMS 사전안내", desc: "방문 7일 전 발송", href: "/safety/sms" },
      { n: 2, label: "일정 조정", desc: "안 맞으면 변경 신청", href: "/move/reservation" },
      { n: 3, label: "점검원 확인", desc: "신분증 꼭 확인하세요", href: "/safety/inspection" },
      { n: 4, label: "결과 확인", desc: "점검 결과지 수령", href: "/safety/inspection" },
    ],
  },
];

export default function SituationGuide({ standalone = false }: { standalone?: boolean }) {
  const [active, setActive] = useState(0);
  const g = GROUPS[active];

  return (
    <section
      aria-labelledby={standalone ? undefined : "sit-title"}
      aria-label={standalone ? "상황별 안내" : undefined}
      className={standalone ? "" : "shell py-10 lg:py-14"}
    >
      {!standalone && (
        <>
          <h2 id="sit-title" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
            이럴 땐 이렇게 하세요
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            메뉴 이름을 몰라도 괜찮습니다. 상황을 고르면 순서대로 안내해 드립니다.
          </p>
        </>
      )}

      <div className={`overflow-hidden rounded-[1.25rem] border border-ink-200 bg-white ${standalone ? "" : "mt-5"}`}>
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="상황별 안내"
          className="no-scrollbar flex gap-1 overflow-x-auto border-b border-ink-200 bg-ink-50 p-2"
        >
          {GROUPS.map((item, i) => (
            <button
              key={item.key}
              role="tab"
              type="button"
              id={`sit-tab-${item.key}`}
              aria-selected={active === i}
              aria-controls={`sit-panel-${item.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setActive((active + 1) % GROUPS.length);
                if (e.key === "ArrowLeft") setActive((active - 1 + GROUPS.length) % GROUPS.length);
              }}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-xl px-4 text-[0.875rem] font-bold transition
                ${active === i ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-white"}`}
            >
              {item.tab}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`sit-panel-${g.key}`}
          aria-labelledby={`sit-tab-${g.key}`}
          className="p-5 lg:p-7"
        >
          <p className="text-[0.9375rem] font-semibold text-ink-700">{g.lead}</p>

          <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {g.steps.map((s, i) => (
              <li key={s.n} className="relative">
                <Link
                  href={s.href}
                  className="group flex h-full items-start gap-3 rounded-xl border border-ink-200 bg-white p-4 transition hover:border-sk-red-300 hover:bg-sk-red-50/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full sk-gradient text-sm font-extrabold text-white">
                    {s.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-extrabold text-ink-900">{s.label}</span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-500">{s.desc}</span>
                  </span>
                </Link>
                {i < g.steps.length - 1 && (
                  <IconArrowRight
                    className="absolute -right-2.5 top-1/2 hidden size-4 -translate-y-1/2 text-ink-300 lg:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
