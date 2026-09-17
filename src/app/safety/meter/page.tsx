import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "자가검침 입력" };

export default function Page() {
  return (
    <ComingSoon
      title={"자가검침 입력"}
      lead={"계량기 숫자를 직접 입력하시면 실제 사용량으로 청구됩니다."}
      crumbs={[{ label: "안전·점검", href: "/safety" }, { label: "자가검침 입력" }]}
      related={[{ label: "요금 조회·납부", href: "/bill" }, { label: "실시간 요금계산기", href: "/bill/calculator" }]}
    />
  );
}
