import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RateCalculator from "@/components/RateCalculator";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "실시간 요금계산기",
  description: "용도와 월 사용량을 입력하면 예상 도시가스 요금을 바로 계산해 드립니다.",
};

export default function CalculatorPage() {
  return (
    <>
      <PageHero
        title={<T ko="실시간 요금계산기" en="Rate Calculator" />}
        lead={
          <T
            ko="용도와 사용량만 넣으면 기본요금·사용요금·부가세까지 한 번에 계산해 드립니다."
            en="Enter usage type and amount to get base charge, usage charge and VAT all at once."
          />
        }
        crumbs={[
          { label: <T ko="요금·납부" en="Billing" />, href: "/bill" },
          { label: <T ko="실시간 요금계산기" en="Rate Calculator" /> },
        ]}
      />
      <div className="shell py-10 lg:py-14">
        <RateCalculator />
      </div>
    </>
  );
}
