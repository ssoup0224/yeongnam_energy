import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { MeterReading } from "@/components/pages/safety";

export const metadata: Metadata = { title: "자가검침 입력" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "자가검침 입력", en: "Submit a Meter Reading" }}
      lead={{ ko: "계량기 숫자를 직접 입력하시면 실제 사용량으로 청구됩니다.", en: "Enter your meter reading and be billed on actual usage." }}
      crumbs={[CRUMB.safety, { label: { ko: "자가검침 입력", en: "Submit a Meter Reading" } }]}
    >
      <MeterReading />
    </PageShell>
  );
}
