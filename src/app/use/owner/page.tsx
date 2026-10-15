import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "명의변경 안내" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "명의변경 안내", en: "Change of Holder" }}
      lead={{ ko: "사용자가 바뀔 때 가스 사용계약 명의를 변경하는 절차입니다.", en: "How to change the name on the gas contract when the user changes." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" }, href: "/use" }, { label: { ko: "명의변경 안내", en: "Change of Holder" } }]}
      related={[{ label: { ko: "전입신청", en: "Move-in Request" }, href: "/move/in" }, { label: { ko: "사용계약 조회", en: "Service Contract" }, href: "/use/contract" }]}
    />
  );
}
