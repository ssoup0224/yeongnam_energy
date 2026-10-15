import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SituationGuide from "@/components/SituationGuide";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";
import { IconArrowRight, IconPhone } from "@/components/Icons";

export const metadata: Metadata = {
  title: "상황별 안내",
  description:
    "이사할 때, 요금을 낼 때, 가스 냄새가 날 때, 안전점검을 받을 때 — 상황을 고르면 순서대로 안내해 드립니다.",
};

export default function GuidePage() {
  return (
    <>
      <PageHero
        title={<T ko="이럴 땐 이렇게 하세요" en="Here's what to do" />}
        lead={
          <T
            ko="메뉴 이름을 몰라도 괜찮습니다. 지금 처한 상황을 고르시면 처음부터 끝까지 순서대로 안내해 드립니다."
            en="No need to know the menu names. Pick your situation and we'll guide you from start to finish."
          />
        }
        crumbs={[{ label: <T ko="상황별 안내" en="Guides by situation" /> }]}
      />

      <div className="shell py-10 lg:py-14">
        <SituationGuide standalone />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${SITE.callCenter}`}
            className="group flex flex-1 items-center gap-4 rounded-[1.25rem] border border-ink-200 bg-white p-5 transition hover:border-sk-red-300"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sk-red-50 text-sk-red-600">
              <IconPhone className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.75rem] text-ink-500">
                <T ko="직접 여쭤보고 싶다면" en="Prefer to ask us directly?" />
              </span>
              <span className="block text-lg font-extrabold tabular-nums text-ink-900">
                {SITE.callCenter}
              </span>
            </span>
          </a>
          <Link
            href="/sitemap"
            className="group flex flex-1 items-center gap-4 rounded-[1.25rem] border border-ink-200 bg-white p-5 transition hover:border-sk-red-300"
          >
            <span className="min-w-0">
              <span className="block text-[0.75rem] text-ink-500">
                <T ko="찾는 업무가 없나요?" en="Can't find your task?" />
              </span>
              <span className="block text-[0.9375rem] font-extrabold text-ink-900">
                <T ko="전체 메뉴에서 찾아보기" en="Browse the full menu" />
              </span>
            </span>
            <IconArrowRight className="ml-auto size-4 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
          </Link>
        </div>
      </div>
    </>
  );
}
