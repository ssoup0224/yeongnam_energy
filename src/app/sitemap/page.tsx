import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { NAV } from "@/lib/site";
import { IconArrowRight } from "@/components/Icons";

export const metadata: Metadata = { title: "전체 메뉴" };

export default function SitemapPage() {
  return (
    <>
      <PageHero
        title="전체 메뉴"
        lead="이 사이트에서 할 수 있는 모든 업무를 한 화면에 모았습니다."
        crumbs={[{ label: "전체 메뉴" }]}
      />
      <div className="shell grid grid-cols-1 gap-4 py-10 md:grid-cols-2 lg:grid-cols-3 lg:py-14">
        {NAV.map((item) => (
          <section
            key={item.label}
            aria-labelledby={`sm-${item.href}`}
            className="rounded-[1.25rem] border border-ink-200 bg-white p-5"
          >
            <h2 id={`sm-${item.href}`} className="text-base font-extrabold text-ink-900">
              {item.label}
            </h2>
            <ul className="mt-3 space-y-1">
              {item.children.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="group flex min-h-12 items-center gap-2 rounded-lg px-3 text-[0.875rem] font-semibold text-ink-600 transition hover:bg-sk-red-50 hover:text-sk-red-700"
                  >
                    {c.label}
                    <IconArrowRight className="ml-auto size-3.5 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
