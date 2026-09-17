import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "보도자료" };

export default function Page() {
  return (
    <ComingSoon
      title={"보도자료"}
      lead={"영남에너지서비스의 최근 소식입니다."}
      crumbs={[{ label: "회사소개", href: "/about" }, { label: "보도자료" }]}
      related={[{ label: "회사 개요", href: "/about" }]}
    />
  );
}
