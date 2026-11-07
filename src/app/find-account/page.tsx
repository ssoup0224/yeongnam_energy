import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import FindAccount from "@/components/FindAccount";

export const metadata: Metadata = { title: "아이디·비밀번호 찾기" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "아이디·비밀번호 찾기", en: "Find ID or Password" }}
      lead={{ ko: "휴대폰 본인인증으로 아이디를 확인하거나 비밀번호를 새로 정하세요.", en: "Verify with your phone to see your ID or set a new password." }}
      crumbs={[{ label: { ko: "로그인", en: "Log in" }, href: "/login" }, { label: { ko: "아이디·비밀번호 찾기", en: "Find ID or Password" } }]}
    >
      <div className="mx-auto max-w-lg">
        <FindAccount />
      </div>
    </PageShell>
  );
}
