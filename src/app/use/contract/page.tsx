import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "사용계약 조회" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "사용계약 조회", en: "Service Contract" }}
      lead={{ ko: "현재 등록된 가스 사용계약 정보를 확인하세요.", en: "Review your currently registered gas service contract." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" }, href: "/use" }, { label: { ko: "사용계약 조회", en: "Service Contract" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }]}
    />
  );
}
