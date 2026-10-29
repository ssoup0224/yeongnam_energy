import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { QuickBill } from "@/components/pages/billing";

export const metadata: Metadata = { title: "간편요금조회" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "간편요금조회", en: "Quick Bill Lookup" }}
      lead={{ ko: "고객번호만 입력하면 이번 달 청구금액을 바로 보여드립니다.", en: "Enter just your customer number to see this month's charges instantly." }}
      crumbs={[CRUMB.bill, { label: { ko: "간편요금조회", en: "Quick Bill Lookup" } }]}
    >
      <QuickBill />
    </PageShell>
  );
}
