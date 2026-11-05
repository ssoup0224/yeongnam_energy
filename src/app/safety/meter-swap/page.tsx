import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { MeterSwap } from "@/components/pages/safety";

export const metadata: Metadata = { title: "계량기 교체 예약" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "계량기 교체 예약", en: "Replace Your Meter" }}
      lead={{ ko: "검정 기간이 끝났거나 이상이 있을 때 교체 방문을 예약하세요.", en: "Book a replacement when certification expires or the meter misbehaves." }}
      crumbs={[CRUMB.safety, { label: { ko: "계량기 교체 예약", en: "Replace Your Meter" } }]}
    >
      <MeterSwap />
    </PageShell>
  );
}
