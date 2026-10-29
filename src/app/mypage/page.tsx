import type { Metadata } from "next";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import { MyPage } from "@/components/pages/account";

export const metadata: Metadata = { title: "마이페이지" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "마이페이지", en: "My Page" }}
      lead={{ ko: "요금, 신청 내역, 납부·안내 설정을 한곳에서 관리하세요.", en: "Your bill, requests and settings in one place." }}
      crumbs={[{ label: { ko: "마이페이지", en: "My Page" } }]}
    >
      <Suspense fallback={null}>
        <MyPage />
      </Suspense>
    </PageShell>
  );
}
