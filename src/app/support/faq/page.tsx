import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FaqList from "@/components/FaqList";
import { T } from "@/lib/i18n";

export const metadata: Metadata = { title: "자주 묻는 질문" };

export default function FaqPage() {
  return (
    <>
      <PageHero
        title={<T ko="자주 묻는 질문" en="Frequently asked questions" />}
        lead={
          <T
            ko="고객센터로 가장 많이 들어오는 질문과 답변입니다. 찾는 내용이 없으면 온라인 상담을 이용하세요."
            en="The questions our customer center hears most. If yours isn't here, use online Q&A."
          />
        }
        crumbs={[
          { label: <T ko="고객지원" en="Support" />, href: "/support" },
          { label: <T ko="자주 묻는 질문" en="FAQ" /> },
        ]}
      />
      <div className="shell py-10 lg:py-14">
        <FaqList />
      </div>
    </>
  );
}
