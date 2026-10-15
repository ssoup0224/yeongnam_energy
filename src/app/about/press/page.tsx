import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "보도자료" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "보도자료", en: "Press" }}
      lead={{ ko: "영남에너지서비스의 최근 소식입니다.", en: "The latest news from Yeongnam Energy Service." }}
      crumbs={[{ label: { ko: "회사소개", en: "Company" }, href: "/about" }, { label: { ko: "보도자료", en: "Press" } }]}
      related={[{ label: { ko: "회사 개요", en: "Overview" }, href: "/about" }]}
    />
  );
}
