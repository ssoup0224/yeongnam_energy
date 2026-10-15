import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "도시가스 이용" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "도시가스 이용", en: "Using Gas" }}
      lead={{ ko: "전입·전출부터 시설 변경까지, 도시가스 이용에 필요한 모든 신청입니다.", en: "Every request you need — from moving in and out to changing equipment." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" } }]}
      related={[{ label: { ko: "전입신청", en: "Move-in Request" }, href: "/move/in" }, { label: { ko: "전출신청", en: "Move-out Request" }, href: "/move/out" }, { label: { ko: "가스레인지 교체·철거", en: "Stove Change / Removal" }, href: "/move/stove" }]}
    />
  );
}
