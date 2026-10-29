"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import BillStatement from "./BillStatement";
import CustomerLookup from "./CustomerLookup";

/**
 * 요금 조회·납부. Signed-in members see their own bill straight away (with
 * their discounts applied); anyone can also look up a bill by customer number.
 */
export default function BillLookup() {
  const t = useT();
  const { user, ready } = useAuth();
  const [lookedUp, setLookedUp] = useState<string | null>(null);
  const [other, setOther] = useState(false);

  if (!ready) return <div className="min-h-64" aria-hidden />;

  if (user && !other) {
    return (
      <div className="space-y-3">
        <BillStatement customerNo={user.customerDigits} own />
        <button
          type="button"
          onClick={() => setOther(true)}
          className="w-full rounded-xl border-2 border-dashed border-ink-200 px-4 py-3 text-[0.875rem] font-bold text-ink-600 hover:border-ink-300"
        >
          {t("다른 고객번호로 조회하기", "Look up another customer number")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CustomerLookup
        title={t("청구요금 조회", "Look up your bill")}
        sub={t("고객번호 10자리를 입력하시면 이번 달 청구 내역을 보여드립니다.", "Enter your 10-digit customer number to see this month's statement.")}
        onFound={setLookedUp}
      />
      {lookedUp ? <BillStatement key={lookedUp} customerNo={lookedUp} own={!!user && user.customerDigits === lookedUp} /> : null}
      {user && other ? (
        <button type="button" onClick={() => { setOther(false); setLookedUp(null); }} className="text-[0.875rem] font-bold text-ink-600 underline underline-offset-2">
          {t("내 요금으로 돌아가기", "Back to my bill")}
        </button>
      ) : null}
    </div>
  );
}
