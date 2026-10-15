import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "공급중지·재공급 요청" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "공급중지·재공급 요청", en: "Stop / Resume Supply" }}
      lead={{ ko: "장기간 집을 비우거나 다시 사용할 때 신청하세요.", en: "Apply when you'll be away long-term, or when you resume use." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" }, href: "/use" }, { label: { ko: "공급중지·재공급 요청", en: "Stop / Resume Supply" } }]}
      related={[{ label: { ko: "전출신청", en: "Move-out Request" }, href: "/move/out" }, { label: { ko: "전입신청", en: "Move-in Request" }, href: "/move/in" }]}
    />
  );
}
