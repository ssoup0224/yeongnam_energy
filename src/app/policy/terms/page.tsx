import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "이용약관" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "이용약관", en: "Terms of Use" }}
      lead={{ ko: "홈페이지 이용에 관한 약관입니다.", en: "The terms that govern use of this website." }}
      crumbs={[{ label: { ko: "이용약관", en: "Terms of Use" } }]}
      related={[]}
    />
  );
}
