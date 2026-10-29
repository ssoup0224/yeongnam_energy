import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Ethics } from "@/components/pages/support";

export const metadata: Metadata = { title: "SK 윤리경영 상담·제보" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "SK 윤리경영 상담·제보", en: "SK Ethics Hotline" }}
      lead={{ ko: "윤리 위반 사항을 실명 또는 익명으로 제보하실 수 있습니다.", en: "Report an ethics violation, with your name or anonymously." }}
      crumbs={[{ label: { ko: "SK 윤리경영 상담·제보", en: "SK Ethics Hotline" } }]}
    >
      <Ethics />
    </PageShell>
  );
}
