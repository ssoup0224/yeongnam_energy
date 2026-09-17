import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "방문예약 확인·변경" };

export default function Page() {
  return (
    <ComingSoon
      title={"방문예약 확인·변경"}
      lead={"접수한 방문 일정을 조회하고 날짜·시간을 바꿀 수 있습니다."}
      crumbs={[{ label: "도시가스 이용", href: "/use" }, { label: "방문예약 확인·변경" }]}
      related={[{ label: "전입신청", href: "/move/in" }, { label: "전출신청", href: "/move/out" }]}
    />
  );
}
