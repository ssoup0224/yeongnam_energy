import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "요금표·단가" };

export default function Page() {
  return (
    <ComingSoon
      title={"요금표·단가"}
      lead={"용도별 기본요금과 사용요금 단가를 확인하세요."}
      crumbs={[{ label: "요금·납부", href: "/bill" }, { label: "요금표·단가" }]}
      related={[{ label: "실시간 요금계산기", href: "/bill/calculator" }]}
    />
  );
}
