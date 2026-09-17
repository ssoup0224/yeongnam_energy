import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "도시가스 이용" };

export default function Page() {
  return (
    <ComingSoon
      title={"도시가스 이용"}
      lead={"전입·전출부터 시설 변경까지, 도시가스 이용에 필요한 모든 신청입니다."}
      crumbs={[{ label: "도시가스 이용" }]}
      related={[{ label: "전입신청", href: "/move/in" }, { label: "전출신청", href: "/move/out" }, { label: "가스레인지 교체·철거", href: "/move/stove" }]}
    />
  );
}
