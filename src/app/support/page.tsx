import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { NOTICES } from "@/lib/site";
import { T } from "@/lib/i18n";

export const metadata: Metadata = { title: "공지사항" };

export default function SupportPage() {
  return (
    <>
      <PageHero
        title={<T ko="공지사항" en="Notices" />}
        lead={
          <T
            ko="요금, 신청 절차, 안전점검 일정 등 알아두시면 좋은 소식을 모았습니다."
            en="News worth knowing — billing, request steps, safety-inspection schedules and more."
          />
        }
        crumbs={[
          { label: <T ko="고객지원" en="Support" />, href: "/support" },
          { label: <T ko="공지사항" en="Notices" /> },
        ]}
      />
      <div className="shell py-10 lg:py-14">
        <ul className="overflow-hidden rounded-[1.25rem] border border-ink-200 bg-white">
          {NOTICES.map((n, i) => (
            <li key={n.id} id={`notice-${n.id}`} className={`scroll-mt-28 transition-colors target:bg-sk-orange-50 ${i > 0 ? "border-t border-ink-100" : ""}`}>
              <article className="flex items-start gap-4 p-5 lg:p-6">
                <span
                  className={`mt-0.5 inline-flex w-[5.25rem] shrink-0 justify-center rounded-md py-1 text-[0.75rem] font-extrabold
                    ${n.important ? "bg-sk-red-50 text-sk-red-700" : "bg-ink-100 text-ink-600"}`}
                >
                  <T ko={n.tag.ko} en={n.tag.en} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="flex flex-wrap items-center gap-2">
                    {n.important ? (
                      <span className="rounded bg-ink-900 px-1.5 py-0.5 text-[0.625rem] font-extrabold text-white">
                        <T ko="중요" en="Important" />
                      </span>
                    ) : null}
                    <span className="text-[1rem] font-extrabold leading-snug text-ink-900">
                      <T ko={n.title.ko} en={n.title.en} />
                    </span>
                  </h2>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">
                    <T ko={n.summary.ko} en={n.summary.en} />
                  </p>
                  <time dateTime={n.date} className="mt-2 block text-[0.75rem] tabular-nums text-ink-400">
                    {n.date.replaceAll("-", ".")}
                  </time>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
