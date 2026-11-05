import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Inspection } from "@/components/pages/safety";

export const metadata: Metadata = { title: "가스시설 점검 안내" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "가스시설 점검 안내", en: "Safety Inspections" }}
      lead={{ ko: "법정 정기 안전점검 절차와 우리 동네 점검 일정을 확인하세요.", en: "How the statutory inspection works and when your area is due." }}
      crumbs={[CRUMB.safety, { label: { ko: "가스시설 점검 안내", en: "Safety Inspections" } }]}
    >
      <Inspection />
    </PageShell>
  );
}
