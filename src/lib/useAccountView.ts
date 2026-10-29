"use client";

import { calcBill, currentPeriod, lookupAccount, nextDueDate } from "./data";
import { useStore } from "./store";

/**
 * Everything the UI needs about one customer's current bill, in one place:
 * the account, usage with this month's submitted meter reading merged in,
 * the bill breakdown (with the member's auto-pay / e-bill discounts when
 * `own` is true), the due date and whether it's already been paid.
 */
export function useAccountView(customerNo: string | undefined, own = false) {
  const { state, isPaid } = useStore();
  const acct = customerNo ? lookupAccount(customerNo) : null;
  if (!acct) return null;

  const period = currentPeriod();
  const reading = state.readings.find((r) => r.customerNo === acct.customerNo && r.period === period);
  const usage = acct.usage.map((u, i) =>
    i === acct.usage.length - 1 && reading ? { ...u, value: reading.usage } : u,
  );
  const latest = usage[usage.length - 1].value;
  const payment = state.payments.find((p) => p.customerNo === acct.customerNo && p.period === period);
  const s = state.settings;
  // Once paid, the statement shows what was actually paid (settings changed
  // afterwards apply from the next bill); until then, live discounts apply.
  const discount = payment
    ? Math.max(0, calcBill(latest, acct.tariffId).total - payment.amount)
    : own
      ? (s.autoPay ? 200 : 0) + (s.billType !== "paper" ? 200 : 0)
      : 0;
  const bill = calcBill(latest, acct.tariffId, discount);

  return {
    acct,
    usage,
    bill,
    period,
    due: nextDueDate(),
    paid: isPaid(acct.customerNo, period),
    payment,
    reading,
    discount,
  };
}

export type AccountView = NonNullable<ReturnType<typeof useAccountView>>;
