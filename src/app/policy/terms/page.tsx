import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "이용약관" };

export default function Page() {
  return (
    <ComingSoon
      title={"이용약관"}
      lead={"홈페이지 이용에 관한 약관입니다."}
      crumbs={[{ label: "이용약관" }]}
      related={[]}
    />
  );
}
