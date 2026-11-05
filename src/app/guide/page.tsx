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
        title={<T ko="이럴 땐 이렇게 하세요" en="Guides by Situation" />}
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

        {/* Secondary help — deliberately quiet so the steps above lead. */}
        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.875rem] text-ink-500">
          <a href={`tel:${SITE.callCenter}`} className="inline-flex min-h-9 items-center gap-1.5 hover:text-ink-900">
            <IconPhone className="size-4 text-ink-400" />
            <T ko="직접 여쭤보고 싶다면" en="Prefer to ask us?" />{" "}
            <strong className="font-bold tabular-nums text-ink-800 underline-offset-2 hover:underline">{SITE.callCenter}</strong>
          </a>
          <span className="hidden h-3.5 w-px bg-ink-200 sm:block" aria-hidden />
          <Link href="/sitemap" className="inline-flex min-h-9 items-center gap-1 hover:text-ink-900">
            <T ko="찾는 업무가 없나요?" en="Can't find your task?" />{" "}
            <strong className="font-bold text-ink-800 underline-offset-2 hover:underline">
              <T ko="전체 메뉴 보기" en="See all services" />
            </strong>
            <IconArrowRight className="size-3.5 text-ink-400" />
          </Link>
        </p>
      </div>
    </>
  );
}
