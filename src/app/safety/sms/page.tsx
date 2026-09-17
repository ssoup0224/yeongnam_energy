import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "안전점검 SMS 사전안내" };

export default function Page() {
  return (
    <ComingSoon
      title={"안전점검 SMS 사전안내"}
      lead={"방문 7일 전 문자로 점검 일정을 미리 받아보세요."}
      crumbs={[{ label: "안전·점검", href: "/safety" }, { label: "안전점검 SMS 사전안내" }]}
      related={[{ label: "가스시설 점검 안내", href: "/safety/inspection" }]}
    />
  );
}
