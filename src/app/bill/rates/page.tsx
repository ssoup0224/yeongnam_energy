import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Rates } from "@/components/pages/billing";

export const metadata: Metadata = { title: "요금표·단가" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "요금표·단가", en: "Gas Rates" }}
      lead={{ ko: "용도별 기본요금과 사용요금 단가를 확인하세요.", en: "Base charges and unit prices by usage type." }}
      crumbs={[CRUMB.bill, { label: { ko: "요금표·단가", en: "Gas Rates" } }]}
    >
      <Rates />
    </PageShell>
  );
}
