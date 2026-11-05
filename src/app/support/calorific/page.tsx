import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Calorific } from "@/components/pages/support";

export const metadata: Metadata = { title: "열량계수 조회" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "열량계수 조회", en: "Heat Value Factors" }}
      lead={{ ko: "요금 계산에 쓰이는 월별 열량 보정계수를 확인하세요.", en: "Monthly calorific coefficients used in billing." }}
      crumbs={[CRUMB.support, { label: { ko: "열량계수 조회", en: "Heat Value Factors" } }]}
    >
      <Calorific />
    </PageShell>
  );
}
