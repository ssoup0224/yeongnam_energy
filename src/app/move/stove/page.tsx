import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "가스레인지 교체·철거" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "가스레인지 교체·철거", en: "Stove Change / Removal" }}
      lead={{ ko: "이사 없이 가스레인지만 바꾸거나 떼어낼 때 신청하세요.", en: "Apply to change or remove just your gas stove without moving." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" }, href: "/use" }, { label: { ko: "가스레인지 교체·철거", en: "Stove Change / Removal" } }]}
      related={[{ label: { ko: "전입신청", en: "Move-in Request" }, href: "/move/in" }, { label: { ko: "방문예약 확인·변경", en: "Visit Booking" }, href: "/move/reservation" }]}
    />
  );
}
