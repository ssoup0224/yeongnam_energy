import Link from "next/link";
import PageHero from "./PageHero";
import { SITE } from "@/lib/site";
import { T, type Bi } from "@/lib/i18n";
import { IconArrowRight, IconPhone } from "./Icons";

export type BiCrumb = { label: Bi; href?: string };

export default function ComingSoon({
  title,
  lead,
  crumbs,
  related = [],
}: {
  title: Bi;
  lead: Bi;
  crumbs: BiCrumb[];
  related?: { label: Bi; href: string }[];
}) {
  return (
    <>
      <PageHero
        title={<T ko={title.ko} en={title.en} />}
        lead={<T ko={lead.ko} en={lead.en} />}
        crumbs={crumbs.map((c) => ({
          label: <T ko={c.label.ko} en={c.label.en} />,
          href: c.href,
        }))}
      />
      <div className="shell py-12 lg:py-16">
        <div className="rounded-[1.25rem] border border-ink-200 bg-white p-8 text-center lg:p-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-sk-orange-50 px-3.5 py-1.5 text-[0.8125rem] font-extrabold text-sk-orange-700">
            <T ko="준비 중인 화면" en="Coming soon" />
          </p>
          <h2 className="mt-4 text-xl font-extrabold text-ink-900">
            <T
              ko="이 업무는 전화로도 바로 처리하실 수 있습니다"
              en="You can also handle this by phone right now"
            />
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
            <T
              ko="리디자인 시안에서는 이 화면의 상세 기능이 아직 연결되지 않았습니다. 고객센터로 연락 주시면 담당자가 안내해 드립니다."
              en="This screen's detailed features aren't wired up in the redesign draft yet. Contact our customer center and an agent will help you."
            />
          </p>
          <a
            href={`tel:${SITE.callCenter}`}
            className="mt-6 inline-flex min-h-13 items-center gap-2 rounded-xl sk-gradient px-7 py-3.5 text-base font-extrabold text-white hover:brightness-95"
          >
            <IconPhone className="size-5" /> <T ko="고객센터" en="Customer Center" /> {SITE.callCenter}
          </a>

          {related.length > 0 ? (
            <div className="mt-10 border-t border-ink-100 pt-8">
              <p className="text-sm font-extrabold text-ink-900">
                <T ko="이런 업무를 찾으셨나요?" en="Looking for one of these?" />
              </p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {related.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink-200 px-4 text-[0.875rem] font-bold text-ink-700 hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
                    >
                      <T ko={r.label.ko} en={r.label.en} /> <IconArrowRight className="size-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
