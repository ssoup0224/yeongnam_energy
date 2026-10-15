import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "도시가스 공급 절차" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "도시가스 공급 절차", en: "Supply Process" }}
      lead={{ ko: "신규 공급 신청부터 사용 개시까지의 단계를 안내합니다.", en: "The steps from a new supply request to first use." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" }, href: "/use" }, { label: { ko: "도시가스 공급 절차", en: "Supply Process" } }]}
      related={[{ label: { ko: "전입신청", en: "Move-in Request" }, href: "/move/in" }]}
    />
  );
}
