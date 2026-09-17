import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "가스레인지 교체·철거" };

export default function Page() {
  return (
    <ComingSoon
      title={"가스레인지 교체·철거"}
      lead={"이사 없이 가스레인지만 바꾸거나 떼어낼 때 신청하세요."}
      crumbs={[{ label: "도시가스 이용", href: "/use" }, { label: "가스레인지 교체·철거" }]}
      related={[{ label: "전입신청", href: "/move/in" }, { label: "방문예약 확인·변경", href: "/move/reservation" }]}
    />
  );
}
