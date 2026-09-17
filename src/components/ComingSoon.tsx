import Link from "next/link";
import PageHero, { type Crumb } from "./PageHero";
import { SITE } from "@/lib/site";
import { IconArrowRight, IconPhone } from "./Icons";

export default function ComingSoon({
  title,
  lead,
  crumbs,
  related = [],
}: {
  title: string;
  lead: string;
  crumbs: Crumb[];
  related?: { label: string; href: string }[];
}) {
  return (
    <>
      <PageHero title={title} lead={lead} crumbs={crumbs} />
      <div className="shell py-12 lg:py-16">
        <div className="rounded-[1.25rem] border border-ink-200 bg-white p-8 text-center lg:p-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-sk-orange-50 px-3.5 py-1.5 text-[0.8125rem] font-extrabold text-sk-orange-700">
            준비 중인 화면
          </p>
          <h2 className="mt-4 text-xl font-extrabold text-ink-900">
            이 업무는 전화로도 바로 처리하실 수 있습니다
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
            리디자인 시안에서는 이 화면의 상세 기능이 아직 연결되지 않았습니다.
            고객센터로 연락 주시면 담당자가 안내해 드립니다.
          </p>
          <a
            href={`tel:${SITE.callCenter}`}
            className="mt-6 inline-flex min-h-13 items-center gap-2 rounded-xl sk-gradient px-7 py-3.5 text-base font-extrabold text-white hover:brightness-95"
          >
            <IconPhone className="size-5" /> 고객센터 {SITE.callCenter}
          </a>

          {related.length > 0 && (
            <div className="mt-10 border-t border-ink-100 pt-8">
              <p className="text-sm font-extrabold text-ink-900">이런 업무를 찾으셨나요?</p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {related.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink-200 px-4 text-[0.875rem] font-bold text-ink-700 hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
                    >
                      {r.label} <IconArrowRight className="size-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
