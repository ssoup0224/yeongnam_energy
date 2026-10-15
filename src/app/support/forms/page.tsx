import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "서식·증명 발급" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "서식·증명 발급", en: "Forms & Certificates" }}
      lead={{ ko: "사용증명서, 납부확인서 등을 즉시 발급받으실 수 있습니다.", en: "Issue a proof-of-use or payment certificate instantly." }}
      crumbs={[{ label: { ko: "고객지원", en: "Support" }, href: "/support" }, { label: { ko: "서식·증명 발급", en: "Forms & Certificates" } }]}
      related={[{ label: { ko: "요금 조회·납부", en: "View & Pay Bill" }, href: "/bill" }]}
    />
  );
}
