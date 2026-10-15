import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "합산요금조회" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "합산요금조회", en: "Combined Billing" }}
      lead={{ ko: "여러 호실의 요금을 한 번에 조회합니다. 임대인·상가 관리자용 기능입니다.", en: "Look up charges for multiple units at once — for landlords and building managers." }}
      crumbs={[{ label: { ko: "요금·납부", en: "Billing" }, href: "/bill" }, { label: { ko: "합산요금조회", en: "Combined Billing" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }, { label: { ko: "사용계약 조회", en: "Service Contract" }, href: "/use/contract" }]}
    />
  );
}
