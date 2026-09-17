import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MoveForm from "@/components/MoveForm";
import MoveAside from "@/components/MoveAside";

export const metadata: Metadata = {
  title: "전출신청",
  description: "이사 나가실 때 도시가스 요금 정산과 차단을 신청하세요.",
};

export default function MoveOutPage() {
  return (
    <>
      <PageHero
        title="전출신청"
        lead="이사 나가시는 날 계량기 지침으로 요금을 정산하고 가스를 안전하게 차단해 드립니다."
        crumbs={[{ label: "도시가스 이용", href: "/use" }, { label: "전출신청" }]}
      />
      <div className="shell grid grid-cols-1 gap-4 py-10 lg:grid-cols-[1.5fr_1fr] lg:py-14">
        <MoveForm kind="out" />
        <MoveAside kind="out" />
      </div>
    </>
  );
}
