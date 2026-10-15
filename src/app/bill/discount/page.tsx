import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "요금경감 제도 안내" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "요금경감 제도 안내", en: "Bill Discounts" }}
      lead={{ ko: "다자녀·장애인·국가유공자·사회복지시설 등 요금 감면 대상과 신청 방법입니다.", en: "Who qualifies for reductions — multi-child, disability, national-merit, welfare facilities — and how to apply." }}
      crumbs={[{ label: { ko: "요금·납부", en: "Billing" }, href: "/bill" }, { label: { ko: "요금경감 제도 안내", en: "Bill Discounts" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }]}
    />
  );
}
