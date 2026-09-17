import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "서식·증명 발급" };

export default function Page() {
  return (
    <ComingSoon
      title={"서식·증명 발급"}
      lead={"사용증명서, 납부확인서 등을 즉시 발급받으실 수 있습니다."}
      crumbs={[{ label: "고객지원", href: "/support" }, { label: "서식·증명 발급" }]}
      related={[{ label: "요금 조회·납부", href: "/bill" }]}
    />
  );
}
