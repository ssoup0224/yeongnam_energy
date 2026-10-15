import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "방문예약 확인·변경" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "방문예약 확인·변경", en: "Visit Booking" }}
      lead={{ ko: "접수한 방문 일정을 조회하고 날짜·시간을 바꿀 수 있습니다.", en: "Check a scheduled visit and change its date or time." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" }, href: "/use" }, { label: { ko: "방문예약 확인·변경", en: "Visit Booking" } }]}
      related={[{ label: { ko: "전입신청", en: "Move-in Request" }, href: "/move/in" }, { label: { ko: "전출신청", en: "Move-out Request" }, href: "/move/out" }]}
    />
  );
}
