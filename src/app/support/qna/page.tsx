import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "온라인 상담 (Q&A)" };

export default function Page() {
  return (
    <ComingSoon
      title={"온라인 상담 (Q&A)"}
      lead={"24시간 접수하고 1영업일 안에 답변드립니다."}
      crumbs={[{ label: "고객지원", href: "/support" }, { label: "온라인 상담" }]}
      related={[{ label: "자주 묻는 질문", href: "/support/faq" }, { label: "지역 서비스센터 찾기", href: "/centers" }]}
    />
  );
}
