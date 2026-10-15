import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MoveForm from "@/components/MoveForm";
import MoveAside from "@/components/MoveAside";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "전출신청",
  description: "이사 나가실 때 도시가스 요금 정산과 차단을 신청하세요.",
};

export default function MoveOutPage() {
  return (
    <>
      <PageHero
        title={<T ko="전출신청" en="Move-out Request" />}
        lead={
          <T
            ko="이사 나가시는 날 계량기 지침으로 요금을 정산하고 가스를 안전하게 차단해 드립니다."
            en="On your move-out day we settle the bill from the meter reading and safely shut off the gas."
          />
        }
        crumbs={[
          { label: <T ko="도시가스 이용" en="Using Gas" />, href: "/use" },
          { label: <T ko="전출신청" en="Move-out Request" /> },
        ]}
      />
      <div className="shell grid grid-cols-1 gap-4 py-10 lg:grid-cols-[1.5fr_1fr] lg:py-14">
        <MoveForm kind="out" />
        <MoveAside kind="out" />
      </div>
    </>
  );
}
