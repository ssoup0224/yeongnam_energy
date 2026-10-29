import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Contract } from "@/components/pages/use";

export const metadata: Metadata = { title: "사용계약 조회" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "사용계약 조회", en: "Service Contract" }}
      lead={{ ko: "현재 등록된 가스 사용계약 정보를 확인하고 출력하세요.", en: "View and print your registered supply contract." }}
      crumbs={[CRUMB.use, { label: { ko: "사용계약 조회", en: "Service Contract" } }]}
    >
      <Contract />
    </PageShell>
  );
}
