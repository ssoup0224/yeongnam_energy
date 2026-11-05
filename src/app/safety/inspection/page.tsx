import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Inspection } from "@/components/pages/safety";

export const metadata: Metadata = {
  title: "안전점검 예약",
  description: "원하는 날짜와 시간에 가스 안전점검을 예약하고, 우리 동네 정기점검 일정을 확인하세요.",
};

export default function Page() {
  return (
    <PageShell
      title={{ ko: "안전점검 예약", en: "Book an Inspection" }}
      lead={{ ko: "원하는 날짜와 시간을 골라 안전점검을 예약하세요. 약 15분, 비용은 없습니다.", en: "Pick a date and time for your safety inspection — about 15 minutes, free of charge." }}
      crumbs={[CRUMB.safety, { label: { ko: "안전점검 예약", en: "Book an Inspection" } }]}
    >
      <Inspection />
    </PageShell>
  );
}
