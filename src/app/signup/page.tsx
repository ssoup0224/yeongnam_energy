import type { Metadata } from "next";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import { Signup } from "@/components/pages/account";

export const metadata: Metadata = { title: "회원가입" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "회원가입", en: "Sign Up" }}
      lead={{ ko: "고객번호를 연결하면 로그인만으로 요금과 사용량을 확인할 수 있습니다.", en: "Link your customer number to see your bill and usage just by signing in." }}
      crumbs={[{ label: { ko: "회원가입", en: "Sign Up" } }]}
    >
      <Suspense fallback={null}>
        <Signup />
      </Suspense>
    </PageShell>
  );
}
