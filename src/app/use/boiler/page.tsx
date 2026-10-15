import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "보일러 서류접수" };

export default function Page() {
  return (
    <ComingSoon
      title={{ ko: "보일러 서류접수", en: "Boiler Document Intake" }}
      lead={{ ko: "보일러 설치·교체 관련 서류를 온라인으로 접수합니다.", en: "Submit boiler installation or replacement documents online." }}
      crumbs={[{ label: { ko: "도시가스 이용", en: "Using Gas" }, href: "/use" }, { label: { ko: "보일러 서류접수", en: "Boiler Document Intake" } }]}
      related={[{ label: { ko: "가스시설 점검 안내", en: "Facility Inspection" }, href: "/safety/inspection" }]}
    />
  );
}
