import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "자동이체 신청" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "자동이체 신청", en: "Auto-pay Setup" }}
      lead={{ ko: "은행 계좌나 카드로 매달 자동 납부하고 요금 할인도 받으세요.", en: "Pay automatically each month by bank or card — and get a discount." }}
      crumbs={[{ label: { ko: "요금·납부", en: "Billing" }, href: "/bill" }, { label: { ko: "자동이체 신청", en: "Auto-pay Setup" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }, { label: { ko: "청구서 유형 변경", en: "Change Bill Type" }, href: "/bill/type" }]}
    />
  );
}
