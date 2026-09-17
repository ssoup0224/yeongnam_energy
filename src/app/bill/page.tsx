import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import BillLookup from "@/components/BillLookup";
import { IconArrowRight, IconAutoPay, IconCalculator, IconDoc } from "@/components/Icons";

export const metadata: Metadata = {
  title: "요금 조회·납부",
  description: "고객번호로 이번 달 도시가스 청구요금을 조회하고 바로 납부하세요.",
};

const SHORTCUTS = [
  { label: "자동이체 신청", desc: "매달 자동 납부 · 요금 할인", href: "/bill/auto", Icon: IconAutoPay },
  { label: "청구서 유형 변경", desc: "종이 → 모바일·이메일", href: "/bill/type", Icon: IconDoc },
  { label: "실시간 요금계산기", desc: "사용량으로 미리 계산", href: "/bill/calculator", Icon: IconCalculator },
];

export default function BillPage() {
  return (
    <>
      <PageHero
        title="요금 조회·납부"
        lead="고객번호만 있으면 로그인 없이도 이번 달 청구요금을 확인하고 납부할 수 있습니다."
        crumbs={[{ label: "요금·납부", href: "/bill" }, { label: "요금 조회·납부" }]}
      />

      <div className="shell grid grid-cols-1 gap-4 py-10 lg:grid-cols-[1.4fr_1fr] lg:py-14">
        <BillLookup />

        <aside className="flex flex-col gap-3">
          <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5">
            <h2 className="text-base font-extrabold text-ink-900">고객번호는 어디에 있나요?</h2>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">
              종이 청구서 <strong className="font-bold text-ink-900">오른쪽 위</strong>, 또는
              모바일 청구서 알림톡 첫 줄에 있는 <strong className="font-bold text-ink-900">10자리 숫자</strong>입니다.
            </p>
            <div className="mt-4 rounded-xl border border-dashed border-ink-300 bg-ink-50 p-4">
              <p className="text-[0.75rem] font-semibold text-ink-500">청구서 예시</p>
              <p className="mt-1 text-[0.8125rem] text-ink-600">
                고객번호{" "}
                <span className="rounded bg-sk-red-100 px-1.5 py-0.5 font-extrabold tabular-nums text-sk-red-700">
                  1234-567-890
                </span>
              </p>
            </div>
            <p className="mt-3 text-[0.8125rem] text-ink-500">
              번호를 모르시면 고객센터 1800-0098로 문의해 주세요.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {SHORTCUTS.map(({ label, desc, href, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center gap-4 rounded-[1.25rem] border border-ink-200 bg-white p-5 transition hover:border-sk-red-300"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-700 transition group-hover:bg-sk-red-500 group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-extrabold text-ink-900">{label}</span>
                    <span className="mt-0.5 block text-[0.8125rem] text-ink-500">{desc}</span>
                  </span>
                  <IconArrowRight className="ml-auto size-4 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
