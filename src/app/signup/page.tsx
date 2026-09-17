import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "회원가입" };

export default function Page() {
  return (
    <ComingSoon
      title={"회원가입"}
      lead={"회원이 되시면 청구서와 신청 내역을 한 곳에서 관리할 수 있습니다."}
      crumbs={[{ label: "회원가입" }]}
      related={[{ label: "로그인", href: "/login" }]}
    />
  );
}
