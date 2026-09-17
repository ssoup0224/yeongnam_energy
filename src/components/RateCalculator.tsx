"use client";

import { useMemo, useState } from "react";
import { IconAlert, IconCalculator } from "./Icons";

/** Illustrative tariff table for the redesign prototype. */
const USES = [
  { id: "home", label: "주택용 (취사·난방)", base: 1000, unit: 1186.42 },
  { id: "cook", label: "주택용 (취사 전용)", base: 1000, unit: 1163.85 },
  { id: "biz", label: "일반용 (영업용 1)", base: 1500, unit: 1113.24 },
  { id: "heat", label: "업무난방용", base: 1500, unit: 1092.6 },
] as const;

const won = (n: number) => Math.round(n).toLocaleString("ko-KR");

export default function RateCalculator() {
  const [useId, setUseId] = useState<string>("home");
  const [usage, setUsage] = useState(40);
  const [auto, setAuto] = useState(true);
  const [mobile, setMobile] = useState(true);

  const tariff = USES.find((u) => u.id === useId)!;

  const calc = useMemo(() => {
    const energy = usage * tariff.unit;
    const subtotal = tariff.base + energy;
    const vat = subtotal * 0.1;
    const discount = (auto ? 200 : 0) + (mobile ? 200 : 0);
    return {
      energy,
      subtotal,
      vat,
      discount,
      total: Math.max(0, subtotal + vat - discount),
    };
  }, [usage, tariff, auto, mobile]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
      {/* Inputs */}
      <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
        <h2 className="text-lg font-extrabold text-ink-900">사용 조건 입력</h2>

        <fieldset className="mt-6">
          <legend className="text-[0.875rem] font-bold text-ink-800">용도 구분</legend>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {USES.map((u) => (
              <label
                key={u.id}
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 transition
                  ${useId === u.id
                    ? "border-sk-red-500 bg-sk-red-50"
                    : "border-ink-200 bg-white hover:border-ink-300"}`}
              >
                <input
                  type="radio"
                  name="usekind"
                  value={u.id}
                  checked={useId === u.id}
                  onChange={() => setUseId(u.id)}
                  className="size-5 accent-[#EA002C]"
                />
                <span className="text-[0.875rem] font-bold text-ink-800">{u.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7">
          <label htmlFor="usage" className="flex items-baseline justify-between text-[0.875rem] font-bold text-ink-800">
            월 사용량
            <span className="text-2xl font-extrabold tabular-nums text-sk-red-600">
              {usage}
              <span className="ml-0.5 text-base text-ink-500">㎥</span>
            </span>
          </label>
          <input
            id="usage"
            type="range"
            min={0}
            max={200}
            step={1}
            value={usage}
            onChange={(e) => setUsage(Number(e.target.value))}
            aria-describedby="usage-help"
            className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-[#EA002C]"
          />
          <div className="mt-1.5 flex justify-between text-[0.75rem] tabular-nums text-ink-400">
            <span>0㎥</span>
            <span>100㎥</span>
            <span>200㎥</span>
          </div>
          <p id="usage-help" className="mt-3 text-[0.8125rem] leading-relaxed text-ink-500">
            4인 가구 기준 여름철 약 <strong className="font-bold text-ink-700">15~25㎥</strong>,
            겨울철 약 <strong className="font-bold text-ink-700">80~150㎥</strong>를 사용합니다.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ["여름철", 20],
              ["봄·가을", 45],
              ["겨울철", 110],
            ].map(([label, v]) => (
              <button
                key={label as string}
                type="button"
                onClick={() => setUsage(v as number)}
                className="min-h-10 rounded-full border border-ink-200 px-3.5 text-[0.8125rem] font-bold text-ink-600 hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
              >
                {label} ({v}㎥)
              </button>
            ))}
          </div>
        </div>

        <fieldset className="mt-7 border-t border-ink-100 pt-6">
          <legend className="text-[0.875rem] font-bold text-ink-800">할인 적용</legend>
          <div className="mt-2.5 space-y-2">
            {[
              { id: "auto", label: "자동이체 할인", amount: 200, on: auto, set: setAuto },
              { id: "mobile", label: "모바일·이메일 청구서 할인", amount: 200, on: mobile, set: setMobile },
            ].map((d) => (
              <label
                key={d.id}
                className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-ink-200 px-4 hover:bg-ink-50"
              >
                <input
                  type="checkbox"
                  checked={d.on}
                  onChange={(e) => d.set(e.target.checked)}
                  className="size-5 accent-[#EA002C]"
                />
                <span className="text-[0.875rem] font-bold text-ink-800">{d.label}</span>
                <span className="ml-auto text-[0.875rem] font-bold tabular-nums text-ink-500">
                  −{d.amount}원
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Output */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
            <IconCalculator className="size-5 text-sk-red-500" />
            예상 청구금액
          </h2>

          <div className="mt-4 rounded-2xl sk-gradient p-6 text-white" aria-live="polite">
            <p className="text-[0.8125rem] text-white/80">{tariff.label} · 월 {usage}㎥</p>
            <p className="mt-1 text-[2.25rem] font-extrabold tabular-nums leading-none tracking-tight sm:text-[2.75rem]">
              {won(calc.total)}
              <span className="ml-1 text-xl font-bold">원</span>
            </p>
            {calc.discount > 0 && (
              <p className="mt-2 inline-block rounded-full bg-white/20 px-2.5 py-1 text-[0.75rem] font-bold">
                할인 {won(calc.discount)}원 적용됨
              </p>
            )}
          </div>

          <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200">
            {[
              ["기본요금", tariff.base],
              [`사용요금 (${usage}㎥ × ${tariff.unit.toLocaleString("ko-KR")}원)`, calc.energy],
              ["부가가치세 (10%)", calc.vat],
              ...(calc.discount ? [["할인액", -calc.discount] as [string, number]] : []),
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between gap-4 px-4 py-3.5">
                <dt className="text-[0.875rem] text-ink-600">{label}</dt>
                <dd
                  className={`text-[0.9375rem] font-bold tabular-nums ${
                    (value as number) < 0 ? "text-sk-orange-600" : "text-ink-900"
                  }`}
                >
                  {(value as number) < 0 ? "−" : ""}
                  {won(Math.abs(value as number))}원
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-ink-50 p-4 text-[0.8125rem] leading-relaxed text-ink-600">
            <IconAlert className="mt-0.5 size-4 shrink-0 text-ink-400" />
            <span>
              이 계산기는 참고용입니다. 실제 청구금액은 검침일, 열량 보정계수,
              계절별 단가에 따라 달라질 수 있습니다.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
