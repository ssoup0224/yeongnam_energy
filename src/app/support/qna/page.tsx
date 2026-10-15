import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "온라인 상담 (Q&A)" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "온라인 상담 (Q&A)", en: "Online Q&A" }}
      lead={{ ko: "24시간 접수하고 1영업일 안에 답변드립니다.", en: "Submit any time — we reply within one business day." }}
      crumbs={[{ label: { ko: "고객지원", en: "Support" }, href: "/support" }, { label: { ko: "온라인 상담", en: "Online Q&A" } }]}
      related={[{ label: { ko: "자주 묻는 질문", en: "FAQ" }, href: "/support/faq" }, { label: { ko: "지역 서비스센터 찾기", en: "Find a Service Center" }, href: "/centers" }]}
    />
  );
}
