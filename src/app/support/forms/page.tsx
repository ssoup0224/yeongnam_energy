import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Certificates } from "@/components/pages/support";

export const metadata: Metadata = { title: "서식·증명 발급" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "서식·증명 발급", en: "Forms & Certificates" }}
      lead={{ ko: "사용증명서·납부확인서·완납증명서를 바로 발급하고 인쇄하세요.", en: "Issue and print usage, payment and no-arrears certificates instantly." }}
      crumbs={[CRUMB.support, { label: { ko: "서식·증명 발급", en: "Forms & Certificates" } }]}
    >
      <Certificates />
    </PageShell>
  );
}
