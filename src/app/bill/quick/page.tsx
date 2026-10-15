import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "간편요금조회" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "간편요금조회", en: "Quick Bill Lookup" }}
      lead={{ ko: "고객번호만 입력하면 이번 달 청구금액을 바로 보여드립니다.", en: "Enter just your customer number to see this month's charges instantly." }}
      crumbs={[{ label: { ko: "요금·납부", en: "Billing" }, href: "/bill" }, { label: { ko: "간편요금조회", en: "Quick Bill Lookup" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }, { label: { ko: "실시간 요금계산기", en: "Rate Calculator" }, href: "/bill/calculator" }]}
    />
  );
}
