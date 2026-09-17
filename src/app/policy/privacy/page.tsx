import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "개인정보처리방침" };

export default function Page() {
  return (
    <ComingSoon
      title={"개인정보처리방침"}
      lead={"수집하는 개인정보의 항목과 이용 목적, 보관 기간을 안내합니다."}
      crumbs={[{ label: "개인정보처리방침" }]}
      related={[]}
    />
  );
}
