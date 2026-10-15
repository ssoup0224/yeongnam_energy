import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "회원가입" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "회원가입", en: "Sign Up" }}
      lead={{ ko: "회원이 되시면 청구서와 신청 내역을 한 곳에서 관리할 수 있습니다.", en: "As a member you can manage your bills and requests in one place." }}
      crumbs={[{ label: { ko: "회원가입", en: "Sign Up" } }]}
      related={[{ label: { ko: "로그인", en: "Log in" }, href: "/login" }]}
    />
  );
}
