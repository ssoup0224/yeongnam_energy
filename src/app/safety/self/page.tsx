import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { SelfCheck } from "@/components/pages/safety";

export const metadata: Metadata = { title: "온라인 자율점검" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "온라인 자율점검", en: "Online Self-check" }}
      lead={{ ko: "점검원 방문 없이 집에서 직접 가스시설을 확인하고 결과를 저장하세요.", en: "Check your gas facilities yourself and save the result." }}
      crumbs={[CRUMB.safety, { label: { ko: "온라인 자율점검", en: "Online Self-check" } }]}
    >
      <SelfCheck />
    </PageShell>
  );
}
