import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { LeakReport } from "@/components/pages/safety";

export const metadata: Metadata = { title: "가스누출 신고" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "가스누출 신고", en: "Report a Gas Leak" }}
      lead={{ ko: "누출이 의심되면 즉시 1544-4500으로 전화해 주세요.", en: "If you suspect a leak, call 1544-4500 right away." }}
      crumbs={[CRUMB.safety, { label: { ko: "가스누출 신고", en: "Report a Gas Leak" } }]}
    >
      <LeakReport />
    </PageShell>
  );
}
