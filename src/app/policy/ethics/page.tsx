import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "SK 윤리경영 상담·제보" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "SK 윤리경영 상담·제보", en: "SK Ethics Hotline" }}
      lead={{ ko: "윤리 위반 사항을 익명으로 제보하실 수 있습니다.", en: "Report an ethics violation anonymously." }}
      crumbs={[{ label: { ko: "SK 윤리경영 상담·제보", en: "SK Ethics Hotline" } }]}
      related={[]}
    />
  );
}
