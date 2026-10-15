import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MoveForm from "@/components/MoveForm";
import MoveAside from "@/components/MoveAside";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "전입신청",
  description: "이사 들어오실 때 도시가스 사용 개시를 신청하세요.",
};

export default function MoveInPage() {
  return (
    <>
      <PageHero
        title={<T ko="전입신청" en="Move-in Request" />}
        lead={
          <T
            ko="이사 들어오시는 집에서 도시가스를 쓰려면 사용 개시 신청이 필요합니다. 3단계면 끝납니다."
            en="To use city gas at your new home, request a service start. It takes just three steps."
          />
        }
        crumbs={[
          { label: <T ko="도시가스 이용" en="Using Gas" />, href: "/use" },
          { label: <T ko="전입신청" en="Move-in Request" /> },
        ]}
      />
      <div className="shell grid grid-cols-1 gap-4 py-10 lg:grid-cols-[1.5fr_1fr] lg:py-14">
        <MoveForm kind="in" />
        <MoveAside kind="in" />
      </div>
    </>
  );
}
