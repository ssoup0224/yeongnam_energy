import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "전용계좌 안내" };

export default function Page() {
  return (
    <ComingSoon
      title={"전용계좌 안내"}
      lead={"고객님 전용 가상계좌로 입금하시면 자동으로 수납 처리됩니다."}
      crumbs={[{ label: "요금·납부", href: "/bill" }, { label: "전용계좌 안내" }]}
      related={[{ label: "요금 조회·납부", href: "/bill" }]}
    />
  );
}
