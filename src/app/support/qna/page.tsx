import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Qna } from "@/components/pages/support";

export const metadata: Metadata = { title: "온라인 상담" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "온라인 상담", en: "Ask Us Online" }}
      lead={{ ko: "24시간 접수하고 1영업일 안에 답변드립니다.", en: "Ask any time — we reply within one business day." }}
      crumbs={[CRUMB.support, { label: { ko: "온라인 상담", en: "Ask Us Online" } }]}
    >
      <Qna />
    </PageShell>
  );
}
