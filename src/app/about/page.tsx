import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { BUSINESS, SITE } from "@/lib/site";
import {
  IconBattery,
  IconFlame,
  IconLeaf,
  IconSnow,
  IconTruck,
} from "@/components/Icons";

export const metadata: Metadata = { title: "회사소개" };

const ICONS = {
  "city-gas": IconFlame,
  "fuel-cell": IconBattery,
  "gas-cooling": IconSnow,
  renewable: IconLeaf,
  cng: IconTruck,
} as const;

const DETAIL: Record<string, string[]> = {
  "city-gas": [
    "포항시 전역 약 20만 세대와 산업체에 천연가스를 공급합니다.",
    "배관 순찰·정기 안전점검·24시간 상황실로 공급 안정성을 유지합니다.",
  ],
  "fuel-cell": [
    "천연가스를 개질해 전기와 열을 동시에 생산하는 고효율 분산형 발전입니다.",
    "송전 손실이 적고 미세먼지 배출이 거의 없어 도심에 설치할 수 있습니다.",
  ],
  "gas-cooling": [
    "여름철 전력 피크를 낮추는 가스 구동 냉방(GHP·흡수식) 설비를 보급합니다.",
    "설치 보조금과 요금 할인을 함께 안내해 드립니다.",
  ],
  renewable: [
    "태양광, 바이오가스 등 지역 자원을 활용한 재생에너지 사업을 넓히고 있습니다.",
    "지자체·주민과 함께하는 참여형 모델을 지향합니다.",
  ],
  cng: [
    "시내버스와 상용차를 위한 압축천연가스 충전 인프라를 운영합니다.",
    "경유 대비 질소산화물과 미세먼지 배출을 크게 줄입니다.",
  ],
};

const FACTS = [
  ["공급 지역", "포항시 남구·북구 전역"],
  ["공급 세대", "약 20만 세대"],
  ["서비스센터", "5개소 운영"],
  ["안전상황실", "24시간 · 365일"],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="회사소개"
        lead={`${SITE.company}는 ${SITE.group}의 도시가스 공급사로, 포항 지역의 에너지를 책임지고 있습니다.`}
        crumbs={[{ label: "회사소개", href: "/about" }, { label: "회사 개요" }]}
        tone="brand"
      />

      <section aria-label="회사 현황" className="shell py-10 lg:py-14">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-ink-200 bg-white p-5">
              <dt className="text-[0.8125rem] font-semibold text-ink-500">{k}</dt>
              <dd className="mt-1.5 text-lg font-extrabold text-ink-900">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="biz" className="shell pb-12 lg:pb-16">
        <h2 id="biz" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          사업 영역
        </h2>
        <p className="mt-1.5 text-sm text-ink-500">
          도시가스를 기반으로 다섯 가지 에너지 사업을 운영하고 있습니다.
        </p>

        <div className="mt-6 space-y-3">
          {BUSINESS.map((b) => {
            const Icon = ICONS[b.id as keyof typeof ICONS];
            return (
              <article
                key={b.id}
                id={b.id}
                className="scroll-mt-28 rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ink-50 text-ink-700">
                    <Icon className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold text-ink-900">{b.name}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">{b.desc}</p>
                    <ul className="mt-3 space-y-2">
                      {DETAIL[b.id].map((d) => (
                        <li key={d} className="flex items-start gap-2.5">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sk-orange-400" />
                          <span className="text-[0.875rem] leading-relaxed text-ink-600">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
