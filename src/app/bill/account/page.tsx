import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { DedicatedAccount } from "@/components/pages/billing";

export const metadata: Metadata = { title: "전용계좌 안내" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "전용계좌 안내", en: "Your Payment Account" }}
      lead={{ ko: "고객님 전용 가상계좌로 입금하시면 자동으로 납부 처리됩니다.", en: "Transfer to your personal virtual account and payment is applied automatically." }}
      crumbs={[CRUMB.bill, { label: { ko: "전용계좌 안내", en: "Your Payment Account" } }]}
    >
      <DedicatedAccount />
    </PageShell>
  );
}
