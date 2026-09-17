import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "가스시설 점검 안내" };

export default function Page() {
  return (
    <ComingSoon
      title={"가스시설 점검 안내"}
      lead={"법정 정기 안전점검의 절차와 준비 사항을 안내합니다."}
      crumbs={[{ label: "안전·점검", href: "/safety" }, { label: "가스시설 점검 안내" }]}
      related={[{ label: "가스 안전사용 요령", href: "/safety" }, { label: "안전점검 SMS 사전안내", href: "/safety/sms" }]}
    />
  );
}
