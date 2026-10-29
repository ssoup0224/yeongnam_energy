import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Stove } from "@/components/pages/use";

export const metadata: Metadata = { title: "가스레인지 교체·철거" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "가스레인지 교체·철거", en: "Stove Change / Removal" }}
      lead={{ ko: "이사 없이 가스레인지만 바꾸거나 떼어낼 때 방문을 신청하세요.", en: "Book a visit to replace or remove a gas stove without moving." }}
      crumbs={[CRUMB.use, { label: { ko: "가스레인지 교체·철거", en: "Stove Change / Removal" } }]}
    >
      <Stove />
    </PageShell>
  );
}
