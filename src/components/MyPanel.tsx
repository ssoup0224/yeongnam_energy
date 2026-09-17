import Link from "next/link";
import { SITE } from "@/lib/site";
import { IconAlert, IconArrowRight, IconPhone, IconUser } from "./Icons";

/** Four words per step — the full walkthrough lives on /safety. */
const STEPS = ["밸브 잠그기", "창문 열기", "전기 만지지 않기", "밖에서 신고"];

export default function MyPanel() {
  return (
    <section
      aria-labelledby="my-title"
      className="shell grid grid-cols-1 gap-3 py-9 lg:grid-cols-2 lg:py-12"
    >
      {/* Sign-in */}
      <div className="relative overflow-hidden rounded-[1.25rem] border border-ink-200 bg-ink-900 p-6 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-14 size-52 rounded-full sk-gradient opacity-25 blur-2xl"
        />
        <div className="relative">
          <h2 id="my-title" className="text-lg font-extrabold">
            로그인하면 이번 달 요금이 바로 보입니다
          </h2>
          <p className="mt-2 max-w-sm text-[0.875rem] leading-relaxed text-white/70">
            고객번호를 매번 입력하지 않아도 청구서와 납부 내역을 한 화면에서 확인하세요.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-[0.9375rem] font-extrabold text-ink-900 transition hover:bg-ink-100"
            >
              <IconUser className="size-4" /> 로그인
            </Link>
            <Link
              href="/bill"
              className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-white/30 px-5 text-[0.9375rem] font-bold text-white transition hover:bg-white/10"
            >
              비회원 조회 <IconArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency */}
      <div className="rounded-[1.25rem] border-2 border-sk-red-200 bg-sk-red-50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
          <IconAlert className="size-5 text-sk-red-500" />
          가스 냄새가 난다면
        </h2>

        <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {STEPS.map((t, i) => (
            <li key={t} className="flex items-center gap-1.5">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
                <span className="text-[0.6875rem] font-extrabold text-sk-red-600">{i + 1}</span>
                <span className="text-[0.8125rem] font-bold text-ink-800">{t}</span>
              </span>
              {i < STEPS.length - 1 && (
                <IconArrowRight className="size-3 shrink-0 text-sk-red-300" />
              )}
            </li>
          ))}
        </ol>

        <a
          href={`tel:${SITE.safetyLine}`}
          className="mt-5 flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-sk-red-500 px-5 text-lg font-extrabold text-white transition hover:bg-sk-red-600"
        >
          <IconPhone className="size-5" />
          {SITE.safetyLine} 신고
        </a>
        <Link
          href="/safety"
          className="mt-2 flex min-h-10 items-center justify-center gap-1 text-[0.8125rem] font-bold text-ink-600 hover:text-sk-red-700 hover:underline"
        >
          자세한 안전 행동요령 보기 <IconArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
