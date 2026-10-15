import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "요금표·단가" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "요금표·단가", en: "Rate Table" }}
      lead={{ ko: "용도별 기본요금과 사용요금 단가를 확인하세요.", en: "Check base rates and unit prices by usage type." }}
      crumbs={[{ label: { ko: "요금·납부", en: "Billing" }, href: "/bill" }, { label: { ko: "요금표·단가", en: "Rate Table" } }]}
      related={[{ label: { ko: "실시간 요금계산기", en: "Rate Calculator" }, href: "/bill/calculator" }]}
    />
  );
}
