import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "전용계좌 안내" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "전용계좌 안내", en: "Dedicated Account" }}
      lead={{ ko: "고객님 전용 가상계좌로 입금하시면 자동으로 수납 처리됩니다.", en: "Deposit to your personal virtual account and payment is applied automatically." }}
      crumbs={[{ label: { ko: "요금·납부", en: "Billing" }, href: "/bill" }, { label: { ko: "전용계좌 안내", en: "Dedicated Account" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }]}
    />
  );
}
