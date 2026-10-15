import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "자가검침 입력" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "자가검침 입력", en: "Self Meter Reading" }}
      lead={{ ko: "계량기 숫자를 직접 입력하시면 실제 사용량으로 청구됩니다.", en: "Enter your meter reading yourself and be billed on actual usage." }}
      crumbs={[{ label: { ko: "안전·점검", en: "Safety" }, href: "/safety" }, { label: { ko: "자가검침 입력", en: "Self Meter Reading" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }, { label: { ko: "실시간 요금계산기", en: "Rate Calculator" }, href: "/bill/calculator" }]}
    />
  );
}
