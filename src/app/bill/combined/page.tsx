import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { CombinedBill } from "@/components/pages/billing";

export const metadata: Metadata = { title: "합산요금조회" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "합산요금조회", en: "Combined Billing" }}
      lead={{ ko: "여러 호실의 요금을 한 번에 조회하고 납부합니다.", en: "Look up and pay several units at once." }}
      crumbs={[CRUMB.bill, { label: { ko: "합산요금조회", en: "Combined Billing" } }]}
    >
      <CombinedBill />
    </PageShell>
  );
}
