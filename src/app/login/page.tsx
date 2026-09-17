import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "로그인" };

export default function Page() {
  return (
    <ComingSoon
      title={"로그인"}
      lead={"간편인증이나 공동인증서로 로그인하세요."}
      crumbs={[{ label: "로그인" }]}
      related={[{ label: "요금 조회·납부", href: "/bill" }, { label: "회원가입", href: "/signup" }]}
    />
  );
}
