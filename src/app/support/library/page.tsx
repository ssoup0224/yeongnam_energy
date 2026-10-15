import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "자료실" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "자료실", en: "Downloads" }}
      lead={{ ko: "약관, 신청 서식, 안내 책자를 내려받으실 수 있습니다.", en: "Download terms, request forms and information booklets." }}
      crumbs={[{ label: { ko: "고객지원", en: "Support" }, href: "/support" }, { label: { ko: "자료실", en: "Downloads" } }]}
      related={[{ label: { ko: "각종 서식·증명 발급", en: "Forms & Certificates" }, href: "/support/forms" }]}
    />
  );
}
