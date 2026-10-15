import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "온라인 자율점검" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "온라인 자율점검", en: "Online Self-check" }}
      lead={{ ko: "점검원 방문 없이 집에서 직접 가스시설을 확인하고 결과를 등록하세요.", en: "Check your gas facilities yourself at home and submit the result — no visit needed." }}
      crumbs={[{ label: { ko: "안전·점검", en: "Safety" }, href: "/safety" }, { label: { ko: "온라인 자율점검", en: "Online Self-check" } }]}
      related={[{ label: { ko: "가스 안전사용 요령", en: "Safe Use Tips" }, href: "/safety" }, { label: { ko: "가스시설 점검 안내", en: "Facility Inspection" }, href: "/safety/inspection" }]}
    />
  );
}
