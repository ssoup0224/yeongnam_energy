import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Owner } from "@/components/pages/use";

export const metadata: Metadata = { title: "명의변경" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "명의변경", en: "Change of Holder" }}
      lead={{ ko: "사용자가 바뀔 때 방문 없이 온라인으로 명의를 변경하세요.", en: "Change the account holder online — no visit needed." }}
      crumbs={[CRUMB.use, { label: { ko: "명의변경", en: "Change of Holder" } }]}
    >
      <Owner />
    </PageShell>
  );
}
