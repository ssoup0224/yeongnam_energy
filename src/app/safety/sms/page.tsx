import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "안전점검 SMS 사전안내" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "안전점검 SMS 사전안내", en: "Inspection SMS Notice" }}
      lead={{ ko: "방문 7일 전 문자로 점검 일정을 미리 받아보세요.", en: "Get your inspection date by text 7 days before the visit." }}
      crumbs={[{ label: { ko: "안전·점검", en: "Safety" }, href: "/safety" }, { label: { ko: "안전점검 SMS 사전안내", en: "Inspection SMS Notice" } }]}
      related={[{ label: { ko: "가스시설 점검 안내", en: "Facility Inspection" }, href: "/safety/inspection" }]}
    />
  );
}
