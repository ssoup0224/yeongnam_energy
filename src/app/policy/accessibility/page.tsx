import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Accessibility } from "@/components/pages/legal";

export const metadata: Metadata = { title: "웹 접근성 안내" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "웹 접근성 안내", en: "Accessibility" }}
      lead={{ ko: "이 사이트가 지키는 접근성 기준과 이용 방법을 안내합니다.", en: "The accessibility standards this site follows and how to use them." }}
      crumbs={[{ label: { ko: "웹 접근성 안내", en: "Accessibility" } }]}
    >
      <Accessibility />
    </PageShell>
  );
}
