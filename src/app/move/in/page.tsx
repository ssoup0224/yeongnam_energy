import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MoveForm from "@/components/MoveForm";
import MoveAside from "@/components/MoveAside";

export const metadata: Metadata = {
  title: "전입신청",
  description: "이사 들어오실 때 도시가스 사용 개시를 신청하세요.",
};

export default function MoveInPage() {
  return (
    <>
      <PageHero
        title="전입신청"
        lead="이사 들어오시는 집에서 도시가스를 쓰려면 사용 개시 신청이 필요합니다. 3단계면 끝납니다."
        crumbs={[{ label: "도시가스 이용", href: "/use" }, { label: "전입신청" }]}
      />
      <div className="shell grid grid-cols-1 gap-4 py-10 lg:grid-cols-[1.5fr_1fr] lg:py-14">
        <MoveForm kind="in" />
        <MoveAside kind="in" />
      </div>
    </>
  );
}
