import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "청구서 유형 변경" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "청구서 유형 변경", en: "Change Bill Type" }}
      lead={{ ko: "종이 청구서를 모바일·이메일로 바꾸면 매월 할인이 적용됩니다.", en: "Switch from a paper bill to mobile/email for a monthly discount." }}
      crumbs={[{ label: { ko: "요금·납부", en: "Billing" }, href: "/bill" }, { label: { ko: "청구서 유형 변경", en: "Change Bill Type" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }, { label: { ko: "자동이체 신청", en: "Auto-pay Setup" }, href: "/bill/auto" }]}
    />
  );
}
