import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Library } from "@/components/pages/support";

export const metadata: Metadata = { title: "자료실" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "자료실", en: "Downloads" }}
      lead={{ ko: "약관, 신청 서식, 안내 책자를 내려받으세요.", en: "Download terms, request forms and guides." }}
      crumbs={[CRUMB.support, { label: { ko: "자료실", en: "Downloads" } }]}
    >
      <Library />
    </PageShell>
  );
}
