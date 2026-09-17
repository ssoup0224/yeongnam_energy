import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RateCalculator from "@/components/RateCalculator";

export const metadata: Metadata = {
  title: "실시간 요금계산기",
  description: "용도와 월 사용량을 입력하면 예상 도시가스 요금을 바로 계산해 드립니다.",
};

export default function CalculatorPage() {
  return (
    <>
      <PageHero
        title="실시간 요금계산기"
        lead="용도와 사용량만 넣으면 기본요금·사용요금·부가세까지 한 번에 계산해 드립니다."
        crumbs={[{ label: "요금·납부", href: "/bill" }, { label: "실시간 요금계산기" }]}
      />
      <div className="shell py-10 lg:py-14">
        <RateCalculator />
      </div>
    </>
  );
}
