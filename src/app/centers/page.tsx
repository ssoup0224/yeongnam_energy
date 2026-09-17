import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CenterSearch from "@/components/CenterSearch";

export const metadata: Metadata = {
  title: "지역 서비스센터 찾기",
  description: "포항 지역 도시가스 서비스센터의 담당 구역, 주소, 직통번호를 확인하세요.",
};

export default function CentersPage() {
  return (
    <>
      <PageHero
        title="우리 동네 서비스센터 찾기"
        lead="방문 신청, 안전점검, 시설 문의는 담당 센터로 연락하시면 더 빠릅니다."
        crumbs={[{ label: "고객지원", href: "/support" }, { label: "지역 서비스센터 찾기" }]}
      />
      <div className="shell py-10 lg:py-14">
        <CenterSearch />
      </div>
    </>
  );
}
