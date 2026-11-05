"use client";

import { useState } from "react";
import { calcBill, dateLabel, formatCustomerNo, monthLabel, periodLabel, tariffById, won } from "@/lib/data";
import { pick, useLang, useT } from "@/lib/i18n";
import { useAccountView } from "@/lib/useAccountView";
import { printArea } from "@/lib/print";
import PayDialog from "./PayDialog";
import { IconBill, IconCheck, IconPrint } from "./Icons";

/**
 * One customer's current statement: amount, breakdown, due date, paid state,
 * the previous months, and pay / print actions. `own` shows the holder's full
 * name and applies the member's auto-pay and e-bill discounts.
 */
export default function BillStatement({
  customerNo,
  own = false,
  compact = false,
}: {
  customerNo: string;
  own?: boolean;
  compact?: boolean;
}) {
  const { lang } = useLang();
  const t = useT();
  const view = useAccountView(customerNo, own);
  const [paying, setPaying] = useState(false);

  if (!view) return null;
  const { acct, bill, usage, period, due, paid, discount, reading } = view;
  const latest = usage[usage.length - 1].value;
  const prev = usage[usage.length - 2].value;
  const diff = latest - prev;
  const tariff = tariffById(acct.tariffId);

  return (
    <div className="print-area fade-up space-y-4">
      <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.8125rem] text-ink-500">
              {pick(own ? acct.holderFull : acct.holder, lang)} · {t("고객번호", "Customer no.")} {formatCustomerNo(acct.customerNo)}
            </p>
            <p className="mt-0.5 truncate text-[0.8125rem] text-ink-500">{pick(acct.address, lang)}</p>
            <h3 className="mt-2 text-lg font-extrabold text-ink-900">
              {t(`${periodLabel(period, lang)} 청구서`, `${periodLabel(period, lang)} statement`)}
            </h3>
          </div>
          {paid ? (
            <span data-bill-status="paid" className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[0.75rem] font-extrabold text-emerald-700">
              <IconCheck className="size-3.5" /> {t("납부 완료", "Paid")}
            </span>
          ) : (
            <span data-bill-status="due" className="rounded-full bg-sk-orange-100 px-3 py-1.5 text-[0.75rem] font-extrabold text-sk-orange-700">
              {t(`납기일 ${dateLabel(due, lang)}`, `Due ${dateLabel(due, lang)}`)}
            </span>
          )}
        </div>

        <div className={`mt-4 rounded-2xl p-5 ${paid ? "bg-ink-900 text-white" : "sk-gradient text-white"}`}>
          <p className="text-[0.8125rem] text-white/80">{paid ? t("납부한 금액", "Amount paid") : t("이번 달 청구금액", "This month's charge")}</p>
          <p data-bill-total className="mt-1 text-[2rem] font-extrabold tabular-nums tracking-tight sm:text-[2.5rem]">{won(bill.total, lang)}</p>
          <p className="mt-1 text-[0.8125rem] text-white/80">
            {t(`사용량 ${latest}㎥`, `Usage ${latest}㎥`)}
            {" · "}
            {diff === 0
              ? t("전월과 동일", "same as last month")
              : diff > 0
                ? t(`전월 대비 ${diff}㎥ 증가`, `up ${diff}㎥ on last month`)
                : t(`전월 대비 ${-diff}㎥ 감소`, `down ${-diff}㎥ on last month`)}
            {reading ? ` · ${t("자가검침 반영", "self-reading applied")}` : ""}
          </p>
        </div>

        <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200">
          {[
            { k: t(`사용요금 (${latest}㎥ × ${tariff.unit.toLocaleString()}원)`, `Usage (${latest}㎥ × ₩${tariff.unit.toLocaleString()})`), v: bill.energy },
            { k: t("기본요금", "Base charge"), v: bill.base },
            { k: t("부가가치세 (10%)", "VAT (10%)"), v: bill.vat },
            ...(discount ? [{ k: t("할인 (자동이체·전자고지)", "Discounts (auto-pay / e-bill)"), v: -discount }] : []),
          ].map((row) => (
            <div key={row.k} className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-[0.875rem] text-ink-600">{row.k}</dt>
              <dd className={`shrink-0 whitespace-nowrap text-[0.9375rem] font-bold tabular-nums ${row.v < 0 ? "text-sk-orange-600" : "text-ink-900"}`}>
                {row.v < 0 ? "−" : ""}{won(Math.abs(row.v), lang)}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 bg-ink-50 px-4 py-3.5">
            <dt className="text-[0.9375rem] font-extrabold text-ink-900">{t("합계 (10원 미만 절사)", "Total (rounded down to ₩10)")}</dt>
            <dd className="shrink-0 whitespace-nowrap text-lg font-extrabold tabular-nums text-sk-red-600">{won(bill.total, lang)}</dd>
          </div>
        </dl>

        <div className="print-hide mt-4 flex flex-col gap-2 sm:flex-row">
          {paid ? (
            <p className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 text-base font-extrabold text-emerald-700">
              <IconCheck className="size-5" /> {t("이번 달 요금을 납부했습니다", "This month is paid")}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setPaying(true)}
              className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 text-base font-extrabold text-white transition hover:bg-ink-800"
            >
              <IconBill className="size-5" /> {t("지금 납부하기", "Pay now")}
            </button>
          )}
          <button
            type="button"
            onClick={printArea}
            className="flex min-h-13 items-center justify-center gap-2 rounded-xl border-2 border-ink-200 px-6 text-base font-bold text-ink-700 transition hover:border-ink-300"
          >
            <IconPrint className="size-5" /> {t("청구서 출력", "Print")}
          </button>
        </div>
      </div>

      {compact ? null : (
        <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
          <h4 className="text-base font-extrabold text-ink-900">{t("최근 6개월 청구 내역", "Last 6 months")}</h4>
          <table className="mt-3 w-full text-left text-[0.875rem]">
            <thead>
              <tr className="border-b border-ink-200 text-[0.75rem] text-ink-500">
                <th className="py-2 font-semibold">{t("월", "Month")}</th>
                <th className="py-2 text-right font-semibold">{t("사용량", "Usage")}</th>
                <th className="py-2 text-right font-semibold">{t("청구금액", "Amount")}</th>
                <th className="py-2 text-right font-semibold">{t("상태", "Status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {[...usage].reverse().map((u, i) => {
                const isCurrent = i === 0;
                const amount = isCurrent ? bill.total : calcBill(u.value, acct.tariffId).total;
                const done = isCurrent ? paid : true;
                return (
                  <tr key={u.month}>
                    <td className="py-2.5 font-semibold text-ink-800">{monthLabel(u.month, lang)}</td>
                    <td className="py-2.5 text-right tabular-nums text-ink-600">{u.value}㎥</td>
                    <td className="py-2.5 text-right font-bold tabular-nums text-ink-900">{won(amount, lang)}</td>
                    <td className={`py-2.5 text-right text-[0.8125rem] font-bold ${done ? "text-emerald-600" : "text-sk-orange-600"}`}>
                      {done ? t("납부", "Paid") : t("미납", "Due")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <PayDialog
        open={paying}
        onClose={() => setPaying(false)}
        amount={bill.total}
        customerNo={acct.customerNo}
        period={period}
        vaccount={{ bank: pick(acct.virtualAccount.bank, lang), number: acct.virtualAccount.number }}
      />
    </div>
  );
}
