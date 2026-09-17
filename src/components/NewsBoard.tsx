import Link from "next/link";
import { NOTICES, SITE } from "@/lib/site";
import { IconArrowRight, IconCenter, IconChat, IconPhone } from "./Icons";

export default function NewsBoard() {
  return (
    <section
      aria-labelledby="news-title"
      className="shell grid grid-cols-1 gap-3 py-9 lg:grid-cols-[1.6fr_1fr] lg:py-12"
    >
      <div className="rounded-[1.25rem] border border-ink-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <h2 id="news-title" className="text-lg font-extrabold text-ink-900">
            공지사항
          </h2>
          <Link
            href="/support"
            className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-[0.8125rem] font-bold text-ink-500 hover:text-sk-red-600"
          >
            더보기 <IconArrowRight className="size-3.5" />
          </Link>
        </div>

        <ul className="divide-y divide-ink-100">
          {NOTICES.slice(0, 4).map((n) => (
            <li key={n.id}>
              <Link
                href="/support"
                className="flex items-center gap-3 px-5 py-4 transition hover:bg-ink-50"
              >
                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-[0.6875rem] font-extrabold
                    ${n.important ? "bg-sk-red-50 text-sk-red-700" : "bg-ink-100 text-ink-600"}`}
                >
                  {n.tag}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-bold text-ink-900">
                  {n.title}
                </span>
                <time
                  dateTime={n.date}
                  className="hidden shrink-0 text-[0.75rem] tabular-nums text-ink-400 sm:block"
                >
                  {n.date.replaceAll("-", ".")}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Support rail */}
      <div className="flex flex-col gap-3">
        <a
          href={`tel:${SITE.callCenter}`}
          className="flex items-center gap-4 rounded-[1.25rem] border border-ink-200 bg-white p-5 transition hover:border-sk-red-300"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sk-red-50 text-sk-red-600">
            <IconPhone className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.75rem] text-ink-500">고객센터 · 평일 09:00–18:00</span>
            <span className="block text-xl font-extrabold tabular-nums tracking-tight text-ink-900">
              {SITE.callCenter}
            </span>
          </span>
        </a>

        {[
          { label: "지역 서비스센터 찾기", desc: "우리 동네 담당 센터 직통번호", href: "/centers", Icon: IconCenter },
          { label: "온라인 상담 (Q&A)", desc: "24시간 접수 · 1영업일 내 답변", href: "/support/qna", Icon: IconChat },
        ].map(({ label, desc, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-1 items-center gap-4 rounded-[1.25rem] border border-ink-200 bg-white p-5 transition hover:border-sk-red-300"
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
        ))}
      </div>
    </section>
  );
}
