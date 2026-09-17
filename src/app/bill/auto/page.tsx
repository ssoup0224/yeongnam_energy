import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "자동이체 신청" };

export default function Page() {
  return (
    <ComingSoon
      title={"자동이체 신청"}
      lead={"은행 계좌나 카드로 매달 자동 납부하고 요금 할인도 받으세요."}
      crumbs={[{ label: "요금·납부", href: "/bill" }, { label: "자동이체 신청" }]}
      related={[{ label: "요금 조회·납부", href: "/bill" }, { label: "청구서 유형 변경", href: "/bill/type" }]}
    />
  );
}
