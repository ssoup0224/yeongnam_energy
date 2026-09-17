import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "도시가스 공급 절차" };

export default function Page() {
  return (
    <ComingSoon
      title={"도시가스 공급 절차"}
      lead={"신규 공급 신청부터 사용 개시까지의 단계를 안내합니다."}
      crumbs={[{ label: "도시가스 이용", href: "/use" }, { label: "도시가스 공급 절차" }]}
      related={[{ label: "전입신청", href: "/move/in" }]}
    />
  );
}
