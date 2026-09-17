import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "사용계약 조회" };

export default function Page() {
  return (
    <ComingSoon
      title={"사용계약 조회"}
      lead={"현재 등록된 가스 사용계약 정보를 확인하세요."}
      crumbs={[{ label: "도시가스 이용", href: "/use" }, { label: "사용계약 조회" }]}
      related={[{ label: "요금 조회·납부", href: "/bill" }]}
    />
  );
}
