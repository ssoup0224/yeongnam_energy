import type { Metadata } from "next";
import PageShell, { CRUMB } from "@/components/PageShell";
import { BillType } from "@/components/pages/billing";

export const metadata: Metadata = { title: "청구서 유형 변경" };

export default function Page() {
  return (
    <PageShell
      title={{ ko: "청구서 유형 변경", en: "Change Bill Delivery" }}
      lead={{ ko: "종이 청구서를 모바일·이메일로 바꾸면 매월 200원이 할인됩니다.", en: "Switch to a mobile or email bill and save ₩200 a month." }}
      crumbs={[CRUMB.bill, { label: { ko: "청구서 유형 변경", en: "Change Bill Delivery" } }]}
    >
      <BillType />
    </PageShell>
  );
}
