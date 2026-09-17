import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FaqList from "@/components/FaqList";

export const metadata: Metadata = { title: "자주 묻는 질문" };

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="자주 묻는 질문"
        lead="고객센터로 가장 많이 들어오는 질문과 답변입니다. 찾는 내용이 없으면 온라인 상담을 이용하세요."
        crumbs={[{ label: "고객지원", href: "/support" }, { label: "자주 묻는 질문" }]}
      />
      <div className="shell py-10 lg:py-14">
        <FaqList />
      </div>
    </>
  );
}
