"use client";

import { useState } from "react";
import { IconAlert, IconArrowRight, IconBill, IconShield } from "./Icons";

const won = (n: number) => n.toLocaleString("ko-KR");

/** Demo statement — a real build would fetch this by 고객번호. */
const DEMO = {
  customer: "1234567890",
  name: "홍*동",
  address: "포항시 남구 대이로 89, 101동 1203호",
  period: "2026년 8월",
  usage: 18,
  base: 1000,
  unit: 1_186.42,
  due: "2026-09-25",
};

export default function BillLookup() {
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
      setError("고객번호 10자리를 정확히 입력해 주세요.");
      setResult(null);
      return;
    }
    setError(null);
    setResult({ ...DEMO, customer: digits });
  }

  return (
    <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-8">
      <h2 className="text-lg font-extrabold text-ink-900 sm:text-xl">청구요금 조회</h2>
      <p className="mt-1.5 text-[0.875rem] text-ink-500">
        고객번호 10자리를 입력하시면 최근 청구 내역을 보여드립니다.
      </p>

      <form onSubmit={submit} noValidate className="mt-5">
        <label htmlFor="cust-no" className="block text-[0.875rem] font-bold text-ink-800">
          고객번호 <span className="text-sk-red-600">(필수)</span>
        </label>
        <p id="cust-no-help" className="mt-1 text-[0.8125rem] text-ink-500">
          숫자 10자리 · 하이픈(-) 없이 입력해도 됩니다.
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
            placeholder="예) 1234567890"
            className={`min-h-13 flex-1 rounded-xl border-2 bg-white px-4 py-3 text-base tabular-nums text-ink-900 outline-none transition
              placeholder:text-ink-300 focus:border-sk-red-500
              ${error ? "border-sk-red-500 bg-sk-red-50/40" : "border-ink-200"}`}
          />
          <button
            type="submit"
            className="min-h-13 shrink-0 rounded-xl sk-gradient px-7 text-base font-extrabold text-white transition hover:brightness-95"
          >
            조회하기
          </button>
        </div>

        {error && (
          <p
            id="cust-no-error"
            role="alert"
            className="mt-2.5 flex items-center gap-2 rounded-lg bg-sk-red-50 px-3 py-2.5 text-[0.875rem] font-bold text-sk-red-700"
          >
            <IconAlert className="size-4 shrink-0" />
            {error}
          </p>
        )}
      </form>

      {/* Result */}
      <div aria-live="polite">
        {result && (
          <div className="fade-up mt-7 border-t border-ink-100 pt-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[0.8125rem] text-ink-500">
                  {result.name} 고객님 · {result.address}
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-ink-900">
                  {result.period} 청구서
                </h3>
              </div>
              <span className="rounded-full bg-sk-orange-100 px-3 py-1.5 text-[0.75rem] font-extrabold text-sk-orange-700">
                납기일 {result.due.replaceAll("-", ".")}
              </span>
            </div>

            <div className="mt-4 rounded-2xl sk-gradient p-5 text-white">
              <p className="text-[0.8125rem] text-white/80">이번 달 청구금액</p>
              <p className="mt-1 text-[2rem] font-extrabold tabular-nums tracking-tight sm:text-[2.5rem]">
                {won(total)}
                <span className="ml-1 text-xl font-bold">원</span>
              </p>
              <p className="mt-1 text-[0.8125rem] text-white/80">
                사용량 {result.usage}㎥ · 전월 대비 3㎥ 감소
              </p>
            </div>

            <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200">
              {[
                ["기본요금", DEMO.base],
                [`사용요금 (${result.usage}㎥ × ${DEMO.unit.toLocaleString("ko-KR")}원)`, energy],
                ["부가가치세 (10%)", vat],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <dt className="text-[0.875rem] text-ink-600">{label}</dt>
                  <dd className="text-[0.9375rem] font-bold tabular-nums text-ink-900">
                    {won(value as number)}원
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 bg-ink-50 px-4 py-4">
                <dt className="text-[0.9375rem] font-extrabold text-ink-900">합계</dt>
                <dd className="text-lg font-extrabold tabular-nums text-sk-red-600">{won(total)}원</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 text-base font-extrabold text-white transition hover:bg-ink-800"
              >
                <IconBill className="size-5" /> 지금 납부하기
              </button>
              <button
                type="button"
                className="flex min-h-13 items-center justify-center gap-2 rounded-xl border-2 border-ink-200 px-6 text-base font-bold text-ink-700 transition hover:border-ink-300"
              >
                납부 내역 <IconArrowRight className="size-4" />
              </button>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[0.75rem] text-ink-400">
              <IconShield className="size-3.5" />
              결제는 금융결제원 인증 구간에서 안전하게 처리됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
