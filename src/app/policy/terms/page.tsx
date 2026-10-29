import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Terms } from "@/components/pages/legal";

export const metadata: Metadata = { title: "이용약관" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "이용약관", en: "Terms of Use" }}
      lead={{ ko: "홈페이지 이용에 관한 약관입니다.", en: "The terms that govern use of this website." }}
      crumbs={[{ label: { ko: "이용약관", en: "Terms of Use" } }]}
    >
      <Terms />
    </PageShell>
  );
}
