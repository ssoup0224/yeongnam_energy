import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { AutoPay } from "@/components/pages/billing";

export const metadata: Metadata = { title: "자동이체 신청" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "자동이체 신청", en: "Auto-pay Setup" }}
      lead={{ ko: "은행 계좌나 카드로 매달 자동 납부하고 월 200원 할인을 받으세요.", en: "Pay automatically each month and save ₩200." }}
      crumbs={[CRUMB.bill, { label: { ko: "자동이체 신청", en: "Auto-pay Setup" } }]}
    >
      <AutoPay />
    </PageShell>
  );
}
