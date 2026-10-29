import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Discounts } from "@/components/pages/billing";

export const metadata: Metadata = { title: "요금경감 제도 안내" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "요금경감 제도 안내", en: "Bill Discounts" }}
      lead={{ ko: "대상 여부를 확인하고 온라인으로 바로 신청하세요.", en: "Check whether you qualify and apply online." }}
      crumbs={[CRUMB.bill, { label: { ko: "요금경감 제도 안내", en: "Bill Discounts" } }]}
    >
      <Discounts />
    </PageShell>
  );
}
