import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CenterSearch from "@/components/CenterSearch";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "지역 서비스센터 찾기",
  description: "포항 지역 도시가스 서비스센터의 담당 구역, 주소, 직통번호를 확인하세요.",
};

export default function CentersPage() {
  return (
    <>
      <PageHero
        title={<T ko="우리 동네 서비스센터 찾기" en="Find your local service center" />}
        lead={
          <T
            ko="방문 신청, 안전점검, 시설 문의는 담당 센터로 연락하시면 더 빠릅니다."
            en="For visits, safety inspections and facility questions, your local center is fastest."
          />
        }
        crumbs={[
          { label: <T ko="고객지원" en="Support" />, href: "/support" },
          { label: <T ko="지역 서비스센터 찾기" en="Find a Service Center" /> },
        ]}
      />
      <div className="shell py-10 lg:py-14">
        <CenterSearch />
      </div>
    </>
  );
}
