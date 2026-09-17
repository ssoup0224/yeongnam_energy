import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { FAQS, NAV, NOTICES } from "@/lib/site";
import { IconArrowRight, IconSearch } from "@/components/Icons";

export const metadata: Metadata = { title: "통합 검색" };

type Hit = { label: string; href: string; kind: string; snippet?: string };

function search(q: string): Hit[] {
  if (!q.trim()) return [];
  const n = q.trim();
  const hits: Hit[] = [];

  for (const g of NAV) {
    for (const c of g.children) {
      if (c.label.includes(n) || (c.desc ?? "").includes(n) || g.label.includes(n)) {
        hits.push({ label: c.label, href: c.href, kind: g.label, snippet: c.desc });
      }
    }
  }
  for (const x of NOTICES) {
    if (x.title.includes(n) || x.summary.includes(n) || x.tag.includes(n)) {
      hits.push({ label: x.title, href: "/support", kind: "공지사항", snippet: x.summary });
    }
  }
  for (const f of FAQS) {
    if (f.q.includes(n) || f.a.includes(n)) {
      hits.push({ label: f.q, href: "/support/faq", kind: "자주 묻는 질문", snippet: f.a });
    }
  }
  return hits;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const hits = search(q);

  return (
    <>
      <PageHero
        title="통합 검색"
        lead="업무 이름, 공지 제목, 자주 묻는 질문을 한 번에 찾습니다."
        crumbs={[{ label: "통합 검색" }]}
      />

      <div className="shell py-10 lg:py-14">
        <form role="search" action="/search" className="max-w-2xl">
          <label htmlFor="q" className="sr-only">
            검색어
          </label>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-ink-900 bg-white p-1.5">
            <IconSearch className="ml-3 size-5 shrink-0 text-ink-400" />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="무엇을 도와드릴까요?"
              className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-ink-400"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-xl sk-gradient px-6 text-sm font-bold text-white hover:brightness-95"
            >
              검색
            </button>
          </div>
        </form>

        {q && (
          <p className="mt-7 text-[0.9375rem] text-ink-600">
            <strong className="font-extrabold text-ink-900">‘{q}’</strong> 검색 결과{" "}
            <strong className="font-extrabold text-sk-red-600">{hits.length}</strong>건
          </p>
        )}

        {q && hits.length === 0 && (
          <div className="mt-4 rounded-[1.25rem] border border-dashed border-ink-300 bg-white p-10 text-center">
            <p className="text-base font-extrabold text-ink-900">검색 결과가 없습니다</p>
            <p className="mt-1.5 text-[0.875rem] text-ink-500">
              띄어쓰기를 줄이거나 더 짧은 단어로 검색해 보세요. (예: 이사, 요금, 검침)
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {["이사", "요금", "자동이체", "검침", "안전"].map((s) => (
                <li key={s}>
                  <Link
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-ink-200 px-4 text-[0.875rem] font-bold text-ink-600 hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hits.length > 0 && (
          <ul className="mt-4 overflow-hidden rounded-[1.25rem] border border-ink-200 bg-white">
            {hits.map((h, i) => (
              <li key={`${h.href}-${i}`} className={i > 0 ? "border-t border-ink-100" : ""}>
                <Link href={h.href} className="group flex items-start gap-3 p-5 transition hover:bg-ink-50">
                  <span className="mt-0.5 shrink-0 rounded-md bg-ink-100 px-2 py-1 text-[0.6875rem] font-extrabold text-ink-600">
                    {h.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-extrabold leading-snug text-ink-900">
                      {h.label}
                    </span>
                    {h.snippet && (
                      <span className="mt-1 block line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-500">
                        {h.snippet}
                      </span>
                    )}
                  </span>
                  <IconArrowRight className="mt-1 size-4 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
