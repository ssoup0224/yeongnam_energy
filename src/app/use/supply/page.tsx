import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Supply } from "@/components/pages/use";

export const metadata: Metadata = { title: "공급중지·재공급 요청" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "공급중지·재공급 요청", en: "Stop / Resume Supply" }}
      lead={{ ko: "장기간 집을 비우거나 다시 사용할 때 방문을 신청하세요.", en: "Book a visit when you'll be away long-term or are coming back." }}
      crumbs={[CRUMB.use, { label: { ko: "공급중지·재공급", en: "Stop / Resume Supply" } }]}
    >
      <Supply />
    </PageShell>
  );
}
