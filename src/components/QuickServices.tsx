import Link from "next/link";
import {
  IconAutoPay,
  IconBill,
  IconCalculator,
  IconCenter,
  IconMeter,
  IconMoveIn,
  IconMoveOut,
  IconStove,
} from "./Icons";

const SERVICES = [
  { label: "전입신청", sub: "이사 들어올 때", href: "/move/in", Icon: IconMoveIn },
  { label: "전출신청", sub: "이사 나갈 때", href: "/move/out", Icon: IconMoveOut },
  { label: "요금 조회·납부", sub: "이번 달 청구요금", href: "/bill", Icon: IconBill },
  { label: "자동이체 신청", sub: "은행·카드 납부", href: "/bill/auto", Icon: IconAutoPay },
  { label: "자가검침 입력", sub: "계량기 지침 등록", href: "/safety/meter", Icon: IconMeter },
  { label: "실시간 요금계산", sub: "사용량으로 계산", href: "/bill/calculator", Icon: IconCalculator },
  { label: "가스레인지 교체", sub: "철거·변경 신청", href: "/move/stove", Icon: IconStove },
  { label: "서비스센터 찾기", sub: "우리 동네 센터", href: "/centers", Icon: IconCenter },
];

export default function QuickServices() {
  return (
    <section aria-labelledby="quick-title" className="shell py-9 lg:py-12">
      <div className="flex items-end justify-between gap-4">
        <h2 id="quick-title" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          자주 찾는 서비스
        </h2>
        <Link
          href="/sitemap"
          className="hidden shrink-0 items-center rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-700 hover:border-ink-300 sm:inline-flex"
        >
          전체 서비스
        </Link>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {SERVICES.map(({ label, sub, href, Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 transition
                         hover:-translate-y-0.5 hover:border-sk-red-300 hover:shadow-[0_14px_30px_-20px_rgba(234,0,44,.6)] lg:p-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-ink-50 text-ink-700 transition group-hover:bg-sk-red-500 group-hover:text-white">
                <Icon className="size-6" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-extrabold leading-snug text-ink-900 lg:text-base">
                  {label}
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-ink-500">{sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
