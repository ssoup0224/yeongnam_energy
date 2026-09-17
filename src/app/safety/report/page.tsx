import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "가스누출 신고" };

export default function Page() {
  return (
    <ComingSoon
      title={"가스누출 신고"}
      lead={"누출이 의심되면 즉시 1544-4500으로 전화해 주세요."}
      crumbs={[{ label: "안전·점검", href: "/safety" }, { label: "가스누출 신고" }]}
      related={[{ label: "가스 안전사용 요령", href: "/safety" }]}
    />
  );
}
