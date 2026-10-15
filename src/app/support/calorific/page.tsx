import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "열량계수 조회" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "열량계수 조회", en: "Calorific Coefficient" }}
      lead={{ ko: "월별 열량 보정계수를 확인하실 수 있습니다. 요금 계산에 쓰입니다.", en: "Check the monthly calorific correction coefficient used in billing." }}
      crumbs={[{ label: { ko: "고객지원", en: "Support" }, href: "/support" }, { label: { ko: "열량계수 조회", en: "Calorific Coefficient" } }]}
      related={[{ label: { ko: "실시간 요금계산기", en: "Rate Calculator" }, href: "/bill/calculator" }, { label: { ko: "요금표·단가", en: "Rate Table" }, href: "/bill/rates" }]}
    />
  );
}
