"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { digitsOnly, todayISO } from "@/lib/data";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { IconAlert, IconArrowRight, IconCheck } from "./Icons";

/* ── validators ─────────────────────────────────────────────── */

export const isTel = (s: string) => /^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(s.replace(/\s/g, ""));
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
export const isCustomerNo = (s: string) => digitsOnly(s).length === 10;

/** Tomorrow, ISO — visits are booked at least a day ahead. */
export function minVisitDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function maxVisitDate() {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const isIsoDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Visit-date rule shared by every booking: tomorrow → 60 days, no Sundays. */
export function visitDateError(iso: string): Bi | null {
  if (!iso) return { ko: "방문 희망일을 선택해 주세요.", en: "Please choose a visit date." };
  if (!isIsoDate(iso)) return { ko: "날짜를 연도. 월. 일. 형식으로 정확히 입력해 주세요.", en: "Enter a valid date as YYYY. MM. DD." };
  if (iso < minVisitDate()) return { ko: "방문은 내일 이후로 예약할 수 있습니다.", en: "Visits can be booked from tomorrow." };
  if (iso > maxVisitDate()) return { ko: "60일 이내의 날짜를 선택해 주세요.", en: "Choose a date within 60 days." };
  if (new Date(`${iso}T12:00:00`).getDay() === 0)
    return { ko: "일요일은 방문하지 않습니다. 다른 날을 선택해 주세요.", en: "We don't visit on Sundays — pick another day." };
  return null;
}

export const notPast = (iso: string) => iso >= todayISO();

/* ── field styling ──────────────────────────────────────────── */

export function inputCls(bad?: boolean) {
  return `min-h-13 w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-ink-900 outline-none transition
    placeholder:text-ink-300 focus:border-sk-red-500 disabled:bg-ink-50 disabled:text-ink-500
    ${bad ? "border-sk-red-500 bg-sk-red-50/40" : "border-ink-200"}`;
}

export function ErrorText({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-[0.8125rem] font-bold text-sk-red-600">
      <IconAlert className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

export function Field({
  id,
  label,
  required,
  help,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  help?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <div data-field={id}>
      <label htmlFor={id} className="block text-[0.875rem] font-bold text-ink-800">
        {label}
        {required ? <span className="text-sk-red-600"> {t("(필수)", "(required)")}</span> : null}
      </label>
      {help ? <p id={`${id}-help`} className="mt-1 text-[0.8125rem] text-ink-500">{help}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </div>
  );
}

export function RadioCards<V extends string>({
  name,
  value,
  onChange,
  options,
  columns = 3,
  invalid,
}: {
  name: string;
  value: V | "";
  onChange: (v: V) => void;
  options: { value: V; label: Bi; sub?: Bi }[];
  columns?: 2 | 3 | 4;
  invalid?: boolean;
}) {
  const { lang } = useLang();
  const cols = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 gap-2 ${cols}`} role="radiogroup">
      {options.map((o) => (
        <label
          key={o.value}
          className={`flex min-h-14 cursor-pointer flex-col justify-center gap-0.5 rounded-xl border-2 px-4 py-2.5 transition
            ${value === o.value
              ? "border-sk-red-500 bg-sk-red-50 text-sk-red-700"
              : invalid
                ? "border-sk-red-300 text-ink-700"
                : "border-ink-200 text-ink-700 hover:border-ink-300"}`}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="sr-only"
          />
          <span className="text-[0.875rem] font-bold">{pick(o.label, lang)}</span>
          {o.sub ? <span className="text-[0.75rem] font-medium text-ink-500">{pick(o.sub, lang)}</span> : null}
        </label>
      ))}
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  invalid,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  invalid?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-ink-50 ${
        invalid ? "border-sk-red-400 bg-sk-red-50/40" : "border-ink-200"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-[#EA002C]"
      />
      <span className="text-[0.875rem] leading-relaxed text-ink-700">{children}</span>
    </label>
  );
}

/* ── layout bits ────────────────────────────────────────────── */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-extrabold text-ink-900">{children}</h2>
      {sub ? <p className="mt-1 text-[0.875rem] text-ink-500">{sub}</p> : null}
    </div>
  );
}

export function InfoBox({ children, tone = "ink" }: { children: ReactNode; tone?: "ink" | "orange" | "red" }) {
  const cls =
    tone === "orange"
      ? "border-sk-orange-200 bg-sk-orange-50 text-sk-orange-800"
      : tone === "red"
        ? "border-sk-red-200 bg-sk-red-50 text-sk-red-800"
        : "border-ink-200 bg-ink-50 text-ink-700";
  return <div className={`rounded-xl border p-4 text-[0.875rem] leading-relaxed ${cls}`}>{children}</div>;
}

/** Marks illustrative figures in the redesign draft. */
export function SampleNote() {
  const t = useT();
  return (
    <p className="text-[0.75rem] text-ink-400">
      {t(
        "※ 리디자인 시안의 예시 수치입니다. 실제 기준은 고객센터(1800-0098)에서 확인해 주세요.",
        "※ Illustrative figures for the redesign draft. Confirm actual values with the customer center (1800-0098).",
      )}
    </p>
  );
}

export function PrimaryButton({
  children,
  type = "submit",
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-13 items-center justify-center gap-2 rounded-xl sk-gradient px-6 text-base font-extrabold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  href,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const cls = `flex min-h-13 items-center justify-center gap-2 rounded-xl border-2 border-ink-200 bg-white px-6 text-base font-bold text-ink-700 transition hover:border-ink-300 ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/* ── receipt / success ──────────────────────────────────────── */

export function Receipt({
  title,
  id,
  rows,
  note,
  actions,
}: {
  title: ReactNode;
  id?: string;
  rows: [ReactNode, ReactNode][];
  note?: ReactNode;
  actions?: { label: ReactNode; href?: string; onClick?: () => void; primary?: boolean }[];
}) {
  const t = useT();
  return (
    <div className="fade-up rounded-[1.25rem] border border-ink-200 bg-white p-7 text-center lg:p-10" role="status">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <IconCheck className="size-8" />
      </span>
      <h2 className="mt-5 text-xl font-extrabold text-ink-900 sm:text-2xl">{title}</h2>
      {id ? (
        <p className="mt-3 text-[0.9375rem] text-ink-600">
          {t("접수번호", "Reference no.")}{" "}
          <strong data-receipt-id className="font-extrabold tabular-nums text-ink-900">{id}</strong>
        </p>
      ) : null}
      {rows.length ? (
        <dl className="mx-auto mt-6 max-w-lg divide-y divide-ink-100 rounded-2xl border border-ink-200 text-left">
          {rows.map(([k, v], i) => (
            <div key={i} className="flex gap-4 px-4 py-3">
              <dt className="w-28 shrink-0 text-[0.875rem] text-ink-500">{k}</dt>
              <dd className="min-w-0 flex-1 break-words text-[0.875rem] font-bold text-ink-900">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {note ? <p className="mx-auto mt-5 max-w-lg text-[0.8125rem] leading-relaxed text-ink-500">{note}</p> : null}
      {actions?.length ? (
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          {actions.map((a, i) =>
            a.href ? (
              <Link
                key={i}
                href={a.href}
                className={`inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl px-6 text-[0.9375rem] font-bold transition ${
                  a.primary ? "sk-gradient text-white hover:brightness-95" : "border-2 border-ink-200 text-ink-700 hover:border-ink-300"
                }`}
              >
                {a.label} {a.primary ? <IconArrowRight className="size-4" /> : null}
              </Link>
            ) : (
              <button
                key={i}
                type="button"
                onClick={a.onClick}
                className={`inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl px-6 text-[0.9375rem] font-bold transition ${
                  a.primary ? "sk-gradient text-white hover:brightness-95" : "border-2 border-ink-200 text-ink-700 hover:border-ink-300"
                }`}
              >
                {a.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Focus and scroll to the first field that has an error. */
export function focusFirstError(errors: Record<string, unknown>) {
  const first = Object.keys(errors)[0];
  if (!first) return;
  // setTimeout rather than rAF: rAF is paused in background tabs.
  window.setTimeout(() => {
    const wrap = document.querySelector<HTMLElement>(`[data-field="${first}"]`);
    wrap?.scrollIntoView({ behavior: "smooth", block: "center" });
    wrap?.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
  }, 0);
}
