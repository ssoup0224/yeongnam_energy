import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Process } from "@/components/pages/use";

export const metadata: Metadata = { title: "도시가스 공급 절차" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "도시가스 공급 절차", en: "New Gas Connection" }}
      lead={{ ko: "신규 공급 신청부터 사용 개시까지의 단계와 기간을 안내합니다.", en: "The steps and timing from a new supply request to first use." }}
      crumbs={[CRUMB.use, { label: { ko: "도시가스 공급 절차", en: "New Gas Connection" } }]}
    >
      <Process />
    </PageShell>
  );
}
