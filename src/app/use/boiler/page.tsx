import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Boiler } from "@/components/pages/use";

export const metadata: Metadata = { title: "보일러 서류접수" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "보일러 서류접수", en: "Submit Boiler Documents" }}
      lead={{ ko: "보일러 설치·교체·철거 서류를 온라인으로 제출하세요.", en: "Submit boiler installation, replacement or removal documents online." }}
      crumbs={[CRUMB.use, { label: { ko: "보일러 서류접수", en: "Boiler Documents" } }]}
    >
      <Boiler />
    </PageShell>
  );
}
