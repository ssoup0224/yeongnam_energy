import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "계량기 교체 예약" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "계량기 교체 예약", en: "Meter Replacement" }}
      lead={{ ko: "계량기 검정 유효기간이 끝나면 교체 방문을 예약하세요.", en: "Book a replacement visit when your meter's certification expires." }}
      crumbs={[{ label: { ko: "안전·점검", en: "Safety" }, href: "/safety" }, { label: { ko: "계량기 교체 예약", en: "Meter Replacement" } }]}
      related={[{ label: { ko: "자가검침 입력", en: "Self Meter Reading" }, href: "/safety/meter" }, { label: { ko: "방문예약 확인·변경", en: "Visit Booking" }, href: "/move/reservation" }]}
    />
  );
}
