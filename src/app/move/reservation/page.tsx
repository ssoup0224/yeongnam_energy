import type { Metadata } from "next";
import { Suspense } from "react";
import PageShell, { CRUMB } from "@/components/PageShell";
import { Reservation } from "@/components/pages/use";

export const metadata: Metadata = { title: "방문예약 확인·변경" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "방문예약 확인·변경", en: "Visit Booking" }}
      lead={{ ko: "접수한 방문 일정을 조회하고 날짜·시간을 바꾸거나 취소할 수 있습니다.", en: "Check a booked visit, change its date or time, or cancel it." }}
      crumbs={[CRUMB.use, { label: { ko: "방문예약 확인·변경", en: "Visit Booking" } }]}
    >
      <Suspense fallback={null}>
        <Reservation />
      </Suspense>
    </PageShell>
  );
}
