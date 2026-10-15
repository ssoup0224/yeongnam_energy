import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "웹 접근성 안내" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "웹 접근성 안내", en: "Accessibility" }}
      lead={{ ko: "이 사이트가 지키고 있는 접근성 기준과 이용 방법을 안내합니다.", en: "The accessibility standards this site follows and how to use them." }}
      crumbs={[{ label: { ko: "웹 접근성 안내", en: "Accessibility" } }]}
      related={[]}
    />
  );
}
