import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Press } from "@/components/pages/support";

export const metadata: Metadata = { title: "보도자료" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "보도자료", en: "Press" }}
      lead={{ ko: "영남에너지서비스의 최근 소식입니다.", en: "The latest news from Yeongnam Energy Service." }}
      crumbs={[CRUMB.about, { label: { ko: "보도자료", en: "Press" } }]}
    >
      <Press />
    </PageShell>
  );
}
