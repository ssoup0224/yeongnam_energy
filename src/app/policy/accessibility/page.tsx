import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "웹 접근성 안내" };

export default function Page() {
  return (
    <ComingSoon
      title={"웹 접근성 안내"}
      lead={"이 사이트가 지키고 있는 접근성 기준과 이용 방법을 안내합니다."}
      crumbs={[{ label: "웹 접근성 안내" }]}
      related={[]}
    />
  );
}
