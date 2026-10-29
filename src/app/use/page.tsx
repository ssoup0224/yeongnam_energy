import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { UseHub } from "@/components/pages/use";

export const metadata: Metadata = { title: "도시가스 이용" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "도시가스 이용", en: "Using Gas" }}
      lead={{ ko: "전입·전출부터 시설 변경까지, 도시가스 이용에 필요한 모든 신청입니다.", en: "Every request you need — from moving in and out to changing equipment." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" } }]}
    >
      <UseHub />
    </PageShell>
  );
}
