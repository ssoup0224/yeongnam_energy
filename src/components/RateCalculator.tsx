"use client";

import { useMemo, useState } from "react";
import { pick, useLang, useT, type Bi, type Lang } from "@/lib/i18n";
import { IconAlert, IconCalculator } from "./Icons";

/** Illustrative tariff table for the redesign prototype. */
const USES: { id: string; label: Bi; base: number; unit: number }[] = [
  { id: "home", label: { ko: "주택용 (취사·난방)", en: "Residential (cooking + heating)" }, base: 1000, unit: 1186.42 },
  { id: "cook", label: { ko: "주택용 (취사 전용)", en: "Residential (cooking only)" }, base: 1000, unit: 1163.85 },
  { id: "biz", label: { ko: "일반용 (영업용 1)", en: "General (commercial 1)" }, base: 1500, unit: 1113.24 },
  { id: "heat", label: { ko: "업무난방용", en: "Commercial heating" }, base: 1500, unit: 1092.6 },
];

const money = (n: number, lang: Lang) =>
  lang === "en" ? `₩${Math.round(n).toLocaleString("en-US")}` : `${Math.round(n).toLocaleString("ko-KR")}원`;

export default function RateCalculator() {
  const { lang } = useLang();
  const t = useT();
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

  const PRESETS: { label: Bi; v: number }[] = [
    { label: { ko: "여름철", en: "Summer" }, v: 20 },
    { label: { ko: "봄·가을", en: "Spring/Fall" }, v: 45 },
    { label: { ko: "겨울철", en: "Winter" }, v: 110 },
  ];

  const DISCOUNTS = [
    { id: "auto", label: t("자동이체 할인", "Auto-pay discount"), amount: 200, on: auto, set: setAuto },
    { id: "mobile", label: t("모바일·이메일 청구서 할인", "Mobile/email bill discount"), amount: 200, on: mobile, set: setMobile },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
      {/* Inputs */}
      <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
        <h2 className="text-lg font-extrabold text-ink-900">{t("사용 조건 입력", "Enter your details")}</h2>

        <fieldset className="mt-6">
          <legend className="text-[0.875rem] font-bold text-ink-800">{t("용도 구분", "Usage type")}</legend>
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
                <span className="text-[0.875rem] font-bold text-ink-800">{pick(u.label, lang)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7">
          <label htmlFor="usage" className="flex items-baseline justify-between text-[0.875rem] font-bold text-ink-800">
            {t("월 사용량", "Monthly usage")}
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
            <T4
              ko={<>4인 가구 기준 여름철 약 <strong className="font-bold text-ink-700">15~25㎥</strong>, 겨울철 약 <strong className="font-bold text-ink-700">80~150㎥</strong>를 사용합니다.</>}
              en={<>A family of four uses about <strong className="font-bold text-ink-700">15–25㎥</strong> in summer and <strong className="font-bold text-ink-700">80–150㎥</strong> in winter.</>}
              lang={lang}
            />
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label.ko}
                type="button"
                onClick={() => setUsage(p.v)}
                className="min-h-10 rounded-full border border-ink-200 px-3.5 text-[0.8125rem] font-bold text-ink-600 hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
              >
                {pick(p.label, lang)} ({p.v}㎥)
              </button>
            ))}
          </div>
        </div>

        <fieldset className="mt-7 border-t border-ink-100 pt-6">
          <legend className="text-[0.875rem] font-bold text-ink-800">{t("할인 적용", "Apply discounts")}</legend>
          <div className="mt-2.5 space-y-2">
            {DISCOUNTS.map((d) => (
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
                  −{money(d.amount, lang)}
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
            {t("예상 청구금액", "Estimated bill")}
          </h2>

          <div className="mt-4 rounded-2xl sk-gradient p-6 text-white" aria-live="polite">
            <p className="text-[0.8125rem] text-white/80">
              {t(`${pick(tariff.label, lang)} · 월 ${usage}㎥`, `${pick(tariff.label, lang)} · ${usage}㎥/mo`)}
            </p>
            <p className="mt-1 text-[2.25rem] font-extrabold tabular-nums leading-none tracking-tight sm:text-[2.75rem]">
              {money(calc.total, lang)}
            </p>
            {calc.discount > 0 ? (
              <p className="mt-2 inline-block rounded-full bg-white/20 px-2.5 py-1 text-[0.75rem] font-bold">
                {t(`할인 ${money(calc.discount, lang)} 적용됨`, `${money(calc.discount, lang)} discount applied`)}
              </p>
            ) : null}
          </div>

          <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200">
            {[
              { label: t("기본요금", "Base charge"), value: tariff.base },
              {
                label: t(
                  `사용요금 (${usage}㎥ × ${tariff.unit.toLocaleString("ko-KR")}원)`,
                  `Usage (${usage}㎥ × ₩${tariff.unit.toLocaleString("en-US")})`,
                ),
                value: calc.energy,
              },
              { label: t("부가가치세 (10%)", "VAT (10%)"), value: calc.vat },
              ...(calc.discount ? [{ label: t("할인액", "Discount"), value: -calc.discount }] : []),
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3.5">
                <dt className="text-[0.875rem] text-ink-600">{row.label}</dt>
                <dd
                  className={`text-[0.9375rem] font-bold tabular-nums ${
                    row.value < 0 ? "text-sk-orange-600" : "text-ink-900"
                  }`}
                >
                  {row.value < 0 ? "−" : ""}
                  {money(Math.abs(row.value), lang)}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-ink-50 p-4 text-[0.8125rem] leading-relaxed text-ink-600">
            <IconAlert className="mt-0.5 size-4 shrink-0 text-ink-400" />
            <span>
              {t(
                "이 계산기는 참고용입니다. 실제 청구금액은 검침일, 열량 보정계수, 계절별 단가에 따라 달라질 수 있습니다.",
                "This calculator is for reference only. Your actual bill can vary with the reading date, calorific coefficient and seasonal unit prices.",
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/** Small inline helper for rich (JSX) bilingual text. */
function T4({ ko, en, lang }: { ko: React.ReactNode; en: React.ReactNode; lang: Lang }) {
  return <>{lang === "en" ? en : ko}</>;
}
