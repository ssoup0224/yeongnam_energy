import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { BUSINESS, SITE } from "@/lib/site";
import { T, type Bi } from "@/lib/i18n";
import {
  IconBattery,
  IconFlame,
  IconLeaf,
  IconShield,
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
  csr: IconShield,
} as const;

const DETAIL: Record<string, Bi[]> = {
  "city-gas": [
    { ko: "포항시 전역 약 20만 세대와 산업체에 천연가스를 공급합니다.", en: "Natural gas for about 200,000 households and industry across Pohang." },
    { ko: "배관 순찰·정기 안전점검·24시간 상황실로 공급 안정성을 유지합니다.", en: "Pipeline patrols, regular inspections and a 24h control room keep supply stable." },
  ],
  "fuel-cell": [
    { ko: "천연가스를 개질해 전기와 열을 동시에 생산하는 고효율 분산형 발전입니다.", en: "High-efficiency distributed generation producing power and heat from natural gas." },
    { ko: "송전 손실이 적고 미세먼지 배출이 거의 없어 도심에 설치할 수 있습니다.", en: "Low transmission loss and almost no particulates, so it can sit inside the city." },
  ],
  "gas-cooling": [
    { ko: "여름철 전력 피크를 낮추는 가스 구동 냉방(GHP·흡수식) 설비를 보급합니다.", en: "Gas-driven cooling (GHP / absorption) that lowers summer peak demand." },
    { ko: "설치 보조금과 요금 할인을 함께 안내해 드립니다.", en: "We also guide you through installation subsidies and rate discounts." },
  ],
  renewable: [
    { ko: "태양광, 바이오가스 등 지역 자원을 활용한 재생에너지 사업을 넓히고 있습니다.", en: "Expanding renewables that use local resources such as solar and biogas." },
    { ko: "지자체·주민과 함께하는 참여형 모델을 지향합니다.", en: "Built on a participatory model with local government and residents." },
  ],
  cng: [
    { ko: "시내버스와 상용차를 위한 압축천연가스 충전 인프라를 운영합니다.", en: "CNG refueling infrastructure for city buses and commercial vehicles." },
    { ko: "경유 대비 질소산화물과 미세먼지 배출을 크게 줄입니다.", en: "Far lower NOx and particulate emissions than diesel." },
  ],
  csr: [
    { ko: "에너지 취약계층의 난방비와 노후 가스시설 교체를 지원합니다.", en: "Support with heating costs and aging-facility replacement for vulnerable households." },
    { ko: "지역 사회복지시설과 연계한 상생 활동을 이어가고 있습니다.", en: "Ongoing partnerships with local welfare facilities." },
  ],
};

const FACTS: { k: Bi; v: Bi }[] = [
  { k: { ko: "공급 지역", en: "Service area" }, v: { ko: "포항시 남구·북구 전역", en: "All of Nam-gu & Buk-gu, Pohang" } },
  { k: { ko: "공급 세대", en: "Households served" }, v: { ko: "약 20만 세대", en: "About 200,000" } },
  { k: { ko: "서비스센터", en: "Service centers" }, v: { ko: "5개소 운영", en: "5 locations" } },
  { k: { ko: "안전상황실", en: "Safety control room" }, v: { ko: "24시간 · 365일", en: "24/7 · 365 days" } },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={<T ko="회사소개" en="About us" />}
        lead={
          <T
            ko={`${SITE.company.ko}는 ${SITE.group.ko}의 도시가스 공급사로, 포항 지역의 에너지를 책임지고 있습니다.`}
            en={`${SITE.company.en} is the ${SITE.group.en} city-gas supplier responsible for energy across Pohang.`}
          />
        }
        crumbs={[
          { label: <T ko="회사소개" en="About us" />, href: "/about" },
          { label: <T ko="회사 개요" en="Overview" /> },
        ]}
        tone="brand"
      />

      <section aria-label="Company facts" className="shell py-10 lg:py-14">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.k.ko} className="rounded-2xl border border-ink-200 bg-white p-5">
              <dt className="text-[0.8125rem] font-semibold text-ink-500">
                <T ko={f.k.ko} en={f.k.en} />
              </dt>
              <dd className="mt-1.5 text-lg font-extrabold text-ink-900">
                <T ko={f.v.ko} en={f.v.en} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="biz" className="shell pb-12 lg:pb-16">
        <h2 id="biz" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          <T ko="사업 영역" en="What we do" />
        </h2>
        <p className="mt-1.5 text-sm text-ink-500">
          <T
            ko="도시가스를 기반으로 다섯 가지 에너지 사업을 운영하고 있습니다."
            en="Built on city gas, we run five energy businesses."
          />
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
                    <h3 className="text-lg font-extrabold text-ink-900">
                      <T ko={b.name.ko} en={b.name.en} />
                    </h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">
                      <T ko={b.desc.ko} en={b.desc.en} />
                    </p>
                    <ul className="mt-3 space-y-2">
                      {DETAIL[b.id].map((d) => (
                        <li key={d.ko} className="flex items-start gap-2.5">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sk-orange-400" />
                          <span className="text-[0.875rem] leading-relaxed text-ink-600">
                            <T ko={d.ko} en={d.en} />
                          </span>
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
