"use client";

import { useState } from "react";
import { pick, useLang, useT, type Bi, type Lang } from "@/lib/i18n";
import { IconAlert, IconArrowRight, IconBill, IconShield } from "./Icons";

const money = (n: number, lang: Lang) =>
  lang === "en" ? `₩${n.toLocaleString("en-US")}` : `${n.toLocaleString("ko-KR")}원`;

/** Demo statement — a real build would fetch this by customer number. */
const DEMO = {
  customer: "1234567890",
  name: { ko: "홍*동", en: "Hong" } as Bi,
  address: {
    ko: "포항시 남구 대이로 89, 101동 1203호",
    en: "101-1203, 89 Daei-ro, Nam-gu, Pohang",
  } as Bi,
  period: { ko: "2026년 8월", en: "August 2026" } as Bi,
  usage: 18,
  base: 1000,
  unit: 1_186.42,
  due: "2026-09-25",
};

export default function BillLookup() {
  const { lang } = useLang();
  const t = useT();
  const [num, setNum] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<typeof DEMO | null>(null);

  const energy = Math.round(DEMO.usage * DEMO.unit);
  const vat = Math.round((DEMO.base + energy) * 0.1);
  const total = DEMO.base + energy + vat;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const digits = num.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError(t("고객번호 10자리를 정확히 입력해 주세요.", "Please enter your 10-digit customer number."));
      setResult(null);
      return;
    }
    setError(null);
    setResult({ ...DEMO, customer: digits });
  }

  return (
    <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-8">
      <h2 className="text-lg font-extrabold text-ink-900 sm:text-xl">{t("청구요금 조회", "Look up your bill")}</h2>
      <p className="mt-1.5 text-[0.875rem] text-ink-500">
        {t(
          "고객번호 10자리를 입력하시면 최근 청구 내역을 보여드립니다.",
          "Enter your 10-digit customer number to see your latest statement.",
        )}
      </p>

      <form onSubmit={submit} noValidate className="mt-5">
        <label htmlFor="cust-no" className="block text-[0.875rem] font-bold text-ink-800">
          {t("고객번호", "Customer number")} <span className="text-sk-red-600">{t("(필수)", "(required)")}</span>
        </label>
        <p id="cust-no-help" className="mt-1 text-[0.8125rem] text-ink-500">
          {t("숫자 10자리 · 하이픈(-) 없이 입력해도 됩니다.", "10 digits · hyphens optional.")}
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="cust-no"
            name="customer"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            aria-describedby={error ? "cust-no-help cust-no-error" : "cust-no-help"}
            aria-invalid={!!error}
            placeholder={t("예) 1234567890", "e.g. 1234567890")}
            className={`min-h-13 flex-1 rounded-xl border-2 bg-white px-4 py-3 text-base tabular-nums text-ink-900 outline-none transition
              placeholder:text-ink-300 focus:border-sk-red-500
              ${error ? "border-sk-red-500 bg-sk-red-50/40" : "border-ink-200"}`}
          />
          <button
            type="submit"
            className="min-h-13 shrink-0 rounded-xl sk-gradient px-7 text-base font-extrabold text-white transition hover:brightness-95"
          >
            {t("조회하기", "Look up")}
          </button>
        </div>

        {error ? (
          <p
            id="cust-no-error"
            role="alert"
            className="mt-2.5 flex items-center gap-2 rounded-lg bg-sk-red-50 px-3 py-2.5 text-[0.875rem] font-bold text-sk-red-700"
          >
            <IconAlert className="size-4 shrink-0" />
            {error}
          </p>
        ) : null}
      </form>

      {/* Result */}
      <div aria-live="polite">
        {result ? (
          <div className="fade-up mt-7 border-t border-ink-100 pt-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[0.8125rem] text-ink-500">
                  {t(`${pick(result.name, lang)} 고객님 · ${pick(result.address, lang)}`, `${pick(result.name, lang)} · ${pick(result.address, lang)}`)}
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-ink-900">
                  {t(`${pick(result.period, lang)} 청구서`, `${pick(result.period, lang)} statement`)}
                </h3>
              </div>
              <span className="rounded-full bg-sk-orange-100 px-3 py-1.5 text-[0.75rem] font-extrabold text-sk-orange-700">
                {t(`납기일 ${result.due.replaceAll("-", ".")}`, `Due ${result.due.replaceAll("-", ".")}`)}
              </span>
            </div>

            <div className="mt-4 rounded-2xl sk-gradient p-5 text-white">
              <p className="text-[0.8125rem] text-white/80">{t("이번 달 청구금액", "This month's charge")}</p>
              <p className="mt-1 text-[2rem] font-extrabold tabular-nums tracking-tight sm:text-[2.5rem]">
                {money(total, lang)}
              </p>
              <p className="mt-1 text-[0.8125rem] text-white/80">
                {t(`사용량 ${result.usage}㎥ · 전월 대비 3㎥ 감소`, `Usage ${result.usage}㎥ · down 3㎥ from last month`)}
              </p>
            </div>

            <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200">
              {[
                { label: t("기본요금", "Base charge"), value: DEMO.base },
                {
                  label: t(
                    `사용요금 (${result.usage}㎥ × ${DEMO.unit.toLocaleString("ko-KR")}원)`,
                    `Usage (${result.usage}㎥ × ₩${DEMO.unit.toLocaleString("en-US")})`,
                  ),
                  value: energy,
                },
                { label: t("부가가치세 (10%)", "VAT (10%)"), value: vat },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <dt className="text-[0.875rem] text-ink-600">{row.label}</dt>
                  <dd className="text-[0.9375rem] font-bold tabular-nums text-ink-900">
                    {money(row.value, lang)}
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 bg-ink-50 px-4 py-4">
                <dt className="text-[0.9375rem] font-extrabold text-ink-900">{t("합계", "Total")}</dt>
                <dd className="text-lg font-extrabold tabular-nums text-sk-red-600">{money(total, lang)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 text-base font-extrabold text-white transition hover:bg-ink-800"
              >
                <IconBill className="size-5" /> {t("지금 납부하기", "Pay now")}
              </button>
              <button
                type="button"
                className="flex min-h-13 items-center justify-center gap-2 rounded-xl border-2 border-ink-200 px-6 text-base font-bold text-ink-700 transition hover:border-ink-300"
              >
                {t("납부 내역", "Payment history")} <IconArrowRight className="size-4" />
              </button>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[0.75rem] text-ink-400">
              <IconShield className="size-3.5" />
              {t(
                "결제는 금융결제원 인증 구간에서 안전하게 처리됩니다.",
                "Payments are processed securely through the certified financial gateway.",
              )}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
