import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "가스시설 점검 안내" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "가스시설 점검 안내", en: "Facility Inspection" }}
      lead={{ ko: "법정 정기 안전점검의 절차와 준비 사항을 안내합니다.", en: "The steps and what to prepare for the statutory regular safety inspection." }}
      crumbs={[{ label: { ko: "안전·점검", en: "Safety" }, href: "/safety" }, { label: { ko: "가스시설 점검 안내", en: "Facility Inspection" } }]}
      related={[{ label: { ko: "가스 안전사용 요령", en: "Safe Use Tips" }, href: "/safety" }, { label: { ko: "안전점검 SMS 사전안내", en: "Inspection SMS Notice" }, href: "/safety/sms" }]}
    />
  );
}
