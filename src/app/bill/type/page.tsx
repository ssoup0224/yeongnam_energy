import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "청구서 유형 변경" };

export default function Page() {
  return (
    <ComingSoon
      title={"청구서 유형 변경"}
      lead={"종이 청구서를 모바일·이메일로 바꾸면 매월 할인이 적용됩니다."}
      crumbs={[{ label: "요금·납부", href: "/bill" }, { label: "청구서 유형 변경" }]}
      related={[{ label: "요금 조회·납부", href: "/bill" }, { label: "자동이체 신청", href: "/bill/auto" }]}
    />
  );
}
