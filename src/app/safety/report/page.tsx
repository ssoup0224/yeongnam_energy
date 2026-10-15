import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "가스누출 신고" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "가스누출 신고", en: "Report a Gas Leak" }}
      lead={{ ko: "누출이 의심되면 즉시 1544-4500으로 전화해 주세요.", en: "If you suspect a leak, call 1544-4500 right away." }}
      crumbs={[{ label: { ko: "안전·점검", en: "Safety" }, href: "/safety" }, { label: { ko: "가스누출 신고", en: "Report a Gas Leak" } }]}
      related={[{ label: { ko: "가스 안전사용 요령", en: "Safe Use Tips" }, href: "/safety" }]}
    />
  );
}
