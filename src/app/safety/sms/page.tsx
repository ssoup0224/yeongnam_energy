import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { SmsAlerts } from "@/components/pages/safety";

export const metadata: Metadata = { title: "안전점검 SMS 사전안내" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "안전점검 SMS 사전안내", en: "Inspection SMS Notice" }}
      lead={{ ko: "방문 7일 전 점검 일정 등 필요한 안내를 문자로 받아보세요.", en: "Get the inspection date and other notices by text." }}
      crumbs={[CRUMB.safety, { label: { ko: "SMS 사전안내", en: "SMS Alerts" } }]}
    >
      <SmsAlerts />
    </PageShell>
  );
}
