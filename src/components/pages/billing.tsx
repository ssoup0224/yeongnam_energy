"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BANKS,
  CARDS,
  calcBill,
  currentPeriod,
  dateLabel,
  digitsOnly,
  DISCOUNTS,
  formatCustomerNo,
  lookupAccount,
  TARIFFS,
  todayISO,
  won,
  type Account,
} from "@/lib/data";
import { pick, useLang, useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore, type AutoPay as AutoPayT } from "@/lib/store";
import BillStatement from "../BillStatement";
import CustomerLookup from "../CustomerLookup";
import PayDialog from "../PayDialog";
import RequestForm, { STANDARD_CONSENT } from "../RequestForm";
import RequireLogin from "../RequireLogin";
import {
  Card,
  Checkbox,
  ErrorText,
  Field,
  focusFirstError,
  InfoBox,
  inputCls,
  isEmail,
  PrimaryButton,
  RadioCards,
  Receipt,
  SampleNote,
  SecondaryButton,
  SectionTitle,
} from "../form";
import { IconArrowRight, IconCheck, IconCopy, IconDownload, IconTrash } from "../Icons";

/* ═══ 간편요금조회 ═══════════════════════════════════════════════ */

export function QuickBill() {
  const t = useT();
  const { user } = useAuth();
  const [no, setNo] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <CustomerLookup
        title={t("고객번호로 바로 조회", "Look up by customer number")}
        sub={t("로그인 없이 이번 달 청구금액을 확인하고 바로 납부할 수 있습니다.", "Check and pay this month's bill without signing in.")}
        onFound={setNo}
        idPrefix="quick"
      />
      {no ? <BillStatement key={no} customerNo={no} compact own={!!user && user.customerDigits === no} /> : null}
      {!user ? (
        <p className="text-center text-[0.875rem] text-ink-500">
          {t("자주 조회하신다면 ", "Check often? ")}
          <Link href="/signup" className="font-bold text-sk-red-600 underline underline-offset-2">{t("회원가입", "Sign up")}</Link>
          {t("하고 번호 입력 없이 확인하세요.", " and skip typing the number.")}
        </p>
      ) : null}
    </div>
  );
}

/* ═══ 합산요금조회 ═══════════════════════════════════════════════ */

export function CombinedBill() {
  const { lang } = useLang();
  const t = useT();
  const { isPaid } = useStore();
  const [rows, setRows] = useState<string[]>(["", ""]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [found, setFound] = useState<Account[] | null>(null);
  const [paying, setPaying] = useState(false);
  const period = currentPeriod();

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<number, string> = {};
    const accts: Account[] = [];
    const seen = new Set<string>();
    rows.forEach((r, i) => {
      if (!r.trim()) return;
      const d = digitsOnly(r);
      if (d.length !== 10) errs[i] = t("10자리 숫자를 입력해 주세요.", "Enter 10 digits.");
      else if (seen.has(d)) errs[i] = t("이미 입력한 번호입니다.", "Already entered.");
      else {
        const a = lookupAccount(d);
        if (!a) errs[i] = t("등록되지 않은 번호입니다.", "Not registered.");
        else {
          seen.add(d);
          accts.push(a);
        }
      }
    });
    if (!Object.keys(errs).length && !accts.length) errs[0] = t("고객번호를 하나 이상 입력해 주세요.", "Enter at least one customer number.");
    setErrors(errs);
    setFound(Object.keys(errs).length ? null : accts);
  }

  const items = (found ?? []).map((a) => {
    const u = a.usage[a.usage.length - 1].value;
    return { a, usage: u, amount: calcBill(u, a.tariffId).total, paid: isPaid(a.customerNo, period) };
  });
  const unpaid = items.filter((x) => !x.paid);
  const total = unpaid.reduce((s, x) => s + x.amount, 0);

  function downloadCsv() {
    const head = ["customer_no", "holder", "address", "usage_m3", "amount_krw", "status"];
    const lines = items.map((x) => [formatCustomerNo(x.a.customerNo), pick(x.a.holder, lang), pick(x.a.address, lang), x.usage, x.amount, x.paid ? "paid" : "due"].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","));
    const blob = new Blob(["﻿" + [head.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `combined-bill-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle sub={t("임대인·상가 관리자용 — 최대 10개 호실의 이번 달 요금을 한 번에 확인합니다. 체험용: 1234-567-890 또는 아무 10자리 번호", "For landlords and managers — check up to 10 units at once. Demo: 1234-567-890 or any 10 digits")}>
          {t("고객번호 입력", "Customer numbers")}
        </SectionTitle>
        <form onSubmit={lookup} noValidate className="space-y-3">
          {rows.map((r, i) => (
            <div key={i}>
              <div className="flex gap-2">
                <label htmlFor={`cb-${i}`} className="sr-only">{t(`고객번호 ${i + 1}`, `Customer number ${i + 1}`)}</label>
                <span className="flex w-8 shrink-0 items-center justify-center text-[0.875rem] font-bold text-ink-400">{i + 1}</span>
                <input
                  id={`cb-${i}`}
                  value={r}
                  inputMode="numeric"
                  onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? e.target.value : x)))}
                  className={inputCls(!!errors[i])}
                  placeholder="0000-000-000"
                />
                {rows.length > 1 ? (
                  <button type="button" aria-label={t("행 삭제", "Remove row")} onClick={() => setRows((s) => s.filter((_, j) => j !== i))} className="flex size-13 shrink-0 items-center justify-center rounded-xl border-2 border-ink-200 text-ink-500 hover:border-ink-300">
                    <IconTrash className="size-4" />
                  </button>
                ) : null}
              </div>
              {errors[i] ? <div className="pl-10"><ErrorText>{errors[i]}</ErrorText></div> : null}
            </div>
          ))}
          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <SecondaryButton onClick={() => rows.length < 10 && setRows((s) => [...s, ""])} className={rows.length >= 10 ? "pointer-events-none opacity-50" : ""}>
              + {t("호실 추가", "Add unit")} ({rows.length}/10)
            </SecondaryButton>
            <PrimaryButton className="flex-1">{t("합산 조회", "Look up all")}</PrimaryButton>
          </div>
        </form>
      </Card>

      {found ? (
        <Card className="fade-up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-ink-900">{t(`조회 결과 ${items.length}건`, `${items.length} result${items.length === 1 ? "" : "s"}`)}</h2>
            <button type="button" onClick={downloadCsv} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-[0.8125rem] font-bold text-ink-700 hover:bg-ink-50">
              <IconDownload className="size-4" /> CSV
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-[0.875rem]">
              <thead>
                <tr className="border-b border-ink-200 text-[0.75rem] text-ink-500">
                  <th className="py-2 font-semibold">{t("고객번호", "Customer no.")}</th>
                  <th className="py-2 font-semibold">{t("주소", "Address")}</th>
                  <th className="py-2 text-right font-semibold">{t("사용량", "Usage")}</th>
                  <th className="py-2 text-right font-semibold">{t("금액", "Amount")}</th>
                  <th className="py-2 text-right font-semibold">{t("상태", "Status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {items.map((x) => (
                  <tr key={x.a.customerNo} data-combined-row>
                    <td className="py-2.5 font-semibold tabular-nums">{formatCustomerNo(x.a.customerNo)}</td>
                    <td className="max-w-[14rem] truncate py-2.5 text-ink-600">{pick(x.a.address, lang)}</td>
                    <td className="py-2.5 text-right tabular-nums">{x.usage}㎥</td>
                    <td className="py-2.5 text-right font-bold tabular-nums">{won(x.amount, lang)}</td>
                    <td className={`py-2.5 text-right text-[0.8125rem] font-bold ${x.paid ? "text-emerald-600" : "text-sk-orange-600"}`}>{x.paid ? t("납부", "Paid") : t("미납", "Due")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink-200">
                  <td colSpan={3} className="py-3 font-extrabold">{t("미납 합계", "Total due")}</td>
                  <td colSpan={2} data-combined-total className="py-3 text-right text-lg font-extrabold tabular-nums text-sk-red-600">{won(total, lang)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {unpaid.length ? (
            <PrimaryButton type="button" onClick={() => setPaying(true)} className="mt-4 w-full">
              {t(`미납 ${unpaid.length}건 한 번에 납부`, `Pay all ${unpaid.length} due`)}
            </PrimaryButton>
          ) : (
            <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3.5 font-extrabold text-emerald-700">
              <IconCheck className="size-5" /> {t("모든 호실을 납부했습니다", "Every unit is paid")}
            </p>
          )}
          <PayDialog
            open={paying}
            onClose={() => setPaying(false)}
            amount={total}
            customerNo={unpaid[0]?.a.customerNo ?? ""}
            period={period}
            targets={unpaid.map((x) => ({ customerNo: x.a.customerNo, amount: x.amount }))}
          />
        </Card>
      ) : null}
    </div>
  );
}

/* ═══ 자동이체 신청 ══════════════════════════════════════════════ */

export function AutoPay() {
  return (
    <RequireLogin>
      {() => <AutoPayInner />}
    </RequireLogin>
  );
}

function AutoPayInner() {
  const { lang } = useLang();
  const t = useT();
  const { user } = useAuth();
  const { state, setSettings } = useStore();
  const current = state.settings.autoPay;
  const [editing, setEditing] = useState(!current);
  const [method, setMethod] = useState<"bank" | "card" | "">("");
  const [inst, setInst] = useState("");
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState(user ? pick(user.name, lang) : "");
  const [birth, setBirth] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<AutoPayT | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    const d = digitsOnly(number);
    if (!method) er.method = t("출금 방법을 선택해 주세요.", "Choose a payment source.");
    else {
      if (!inst) er.inst = method === "card" ? t("카드사를 선택해 주세요.", "Choose a card company.") : t("은행을 선택해 주세요.", "Choose a bank.");
      if (method === "card" ? d.length !== 16 : d.length < 10 || d.length > 14)
        er.number = method === "card" ? t("카드번호 16자리를 입력해 주세요.", "Enter the 16-digit card number.") : t("계좌번호 10~14자리를 입력해 주세요.", "Enter a 10–14 digit account number.");
      if (holder.trim().length < 2) er.holder = t("예금주(카드 소유자) 이름을 입력해 주세요.", "Enter the holder's name.");
      if (!/^\d{6}$/.test(birth)) er.birth = t("생년월일 6자리(YYMMDD)를 입력해 주세요.", "Enter date of birth as 6 digits (YYMMDD).");
    }
    if (!agree) er.agree = t("출금 동의가 필요합니다.", "Withdrawal consent is required.");
    setErrors(er);
    if (Object.keys(er).length) return focusFirstError(er);
    const rec: AutoPayT = { method: method as "bank" | "card", institution: inst, last4: d.slice(-4), holder: holder.trim(), since: todayISO() };
    setSettings({ autoPay: rec });
    setSaved(rec);
    setEditing(false);
    setNumber("");
    setBirth("");
    setAgree(false);
  }

  if (saved) {
    return (
      <Receipt
        title={t("자동이체가 등록되었습니다", "Auto-pay is set up")}
        rows={[
          [t("출금 수단", "Source"), `${saved.institution} ****${saved.last4}`],
          [t("예금주", "Holder"), saved.holder],
          [t("출금일", "Withdrawal"), t("매월 납기일(25일)", "Each due date (25th)")],
          [t("요금 할인", "Discount"), t("매월 200원", "₩200 / month")],
        ]}
        note={t("다음 청구분부터 자동 출금되며, 할인은 이번 달 청구서에 바로 반영됩니다.", "Withdrawals start with the next bill; the discount already shows on this month's statement.")}
        actions={[
          { label: t("이번 달 요금 보기", "See this month's bill"), href: "/bill", primary: true },
          { label: t("확인", "OK"), onClick: () => setSaved(null) },
        ]}
      />
    );
  }

  const options = (method === "card" ? CARDS : BANKS).map((b) => pick(b, lang));

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle>{t("현재 자동이체", "Current auto-pay")}</SectionTitle>
        {current ? (
          <div data-autopay="on" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 p-4">
            <div>
              <p className="font-extrabold text-emerald-800">{current.institution} ****{current.last4}</p>
              <p className="mt-0.5 text-[0.8125rem] text-emerald-700">
                {current.holder} · {t(`${dateLabel(current.since, lang)}부터`, `since ${dateLabel(current.since, lang)}`)} · {t("월 200원 할인 중", "₩200/mo discount")}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(true)} className="min-h-10 rounded-lg border border-emerald-300 bg-white px-3 text-[0.8125rem] font-bold text-emerald-800">{t("변경", "Change")}</button>
              <button type="button" onClick={() => setConfirmCancel(true)} className="min-h-10 rounded-lg border border-ink-200 bg-white px-3 text-[0.8125rem] font-bold text-ink-600">{t("해지", "Cancel")}</button>
            </div>
          </div>
        ) : (
          <p data-autopay="off" className="rounded-xl bg-ink-50 p-4 text-[0.875rem] text-ink-600">{t("등록된 자동이체가 없습니다. 등록하면 매월 200원이 할인됩니다.", "No auto-pay yet. Register to save ₩200 a month.")}</p>
        )}
        {confirmCancel ? (
          <div className="mt-3 rounded-xl border border-sk-red-200 bg-sk-red-50 p-4">
            <p className="text-[0.875rem] font-bold text-sk-red-800">{t("자동이체를 해지할까요? 다음 청구분부터 직접 납부해야 합니다.", "Cancel auto-pay? You'll need to pay manually from the next bill.")}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => { setSettings({ autoPay: null }); setConfirmCancel(false); setEditing(true); }} className="min-h-10 rounded-lg bg-sk-red-500 px-4 text-[0.8125rem] font-bold text-white">{t("해지하기", "Cancel auto-pay")}</button>
              <button type="button" onClick={() => setConfirmCancel(false)} className="min-h-10 rounded-lg border border-ink-200 bg-white px-4 text-[0.8125rem] font-bold">{t("유지", "Keep")}</button>
            </div>
          </div>
        ) : null}
      </Card>

      {editing ? (
        <form onSubmit={submit} noValidate>
          <Card>
            <SectionTitle sub={t("본인 또는 가족 명의 계좌·카드를 등록할 수 있습니다.", "Use your own or a family member's account or card.")}>
              {current ? t("자동이체 변경", "Change auto-pay") : t("자동이체 등록", "Set up auto-pay")}
            </SectionTitle>
            <div className="space-y-5">
              <fieldset data-field="method">
                <legend className="text-[0.875rem] font-bold text-ink-800">{t("출금 방법", "Source")} <span className="text-sk-red-600">{t("(필수)", "(required)")}</span></legend>
                <div className="mt-2.5">
                  <RadioCards name="method" columns={2} value={method} onChange={(m) => { setMethod(m); setInst(""); setErrors({}); }} invalid={!!errors.method} options={[
                    { value: "bank", label: { ko: "은행 계좌", en: "Bank account" }, sub: { ko: "납기일 출금", en: "Debited on the due date" } },
                    { value: "card", label: { ko: "신용카드", en: "Credit card" }, sub: { ko: "납기일 청구", en: "Charged on the due date" } },
                  ]} />
                </div>
                {errors.method ? <ErrorText>{errors.method}</ErrorText> : null}
              </fieldset>
              {method ? (
                <>
                  <Field id="inst" label={method === "card" ? t("카드사", "Card company") : t("은행", "Bank")} required error={errors.inst}>
                    <select id="inst" value={inst} onChange={(e) => setInst(e.target.value)} className={inputCls(!!errors.inst)}>
                      <option value="">{t("선택해 주세요", "Select…")}</option>
                      {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field id="number" label={method === "card" ? t("카드번호", "Card number") : t("계좌번호", "Account number")} required error={errors.number} help={t("숫자만 입력해도 됩니다. 뒤 4자리만 저장됩니다.", "Digits only is fine. Only the last 4 digits are stored.")}>
                    <input id="number" value={number} inputMode="numeric" autoComplete="off" onChange={(e) => setNumber(e.target.value)} className={inputCls(!!errors.number)} />
                  </Field>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field id="holder" label={method === "card" ? t("카드 소유자", "Cardholder") : t("예금주", "Account holder")} required error={errors.holder}>
                      <input id="holder" value={holder} onChange={(e) => setHolder(e.target.value)} className={inputCls(!!errors.holder)} />
                    </Field>
                    <Field id="birth" label={t("생년월일 (YYMMDD)", "Date of birth (YYMMDD)")} required error={errors.birth}>
                      <input id="birth" value={birth} maxLength={6} inputMode="numeric" onChange={(e) => setBirth(e.target.value.replace(/\D/g, ""))} className={inputCls(!!errors.birth)} placeholder="900101" />
                    </Field>
                  </div>
                </>
              ) : null}
              <div data-field="agree">
                <Checkbox checked={agree} onChange={setAgree} invalid={!!errors.agree}>
                  <strong className="font-extrabold text-ink-900">{t("출금 동의 (필수)", "Withdrawal consent (required)")}</strong>
                  <br />
                  {t("매월 청구금액을 위 계좌(카드)에서 납기일에 출금하는 데 동의합니다.", "I agree to have each month's bill debited from this account or card on the due date.")}
                </Checkbox>
                {errors.agree ? <ErrorText>{errors.agree}</ErrorText> : null}
              </div>
              <PrimaryButton className="w-full">{current ? t("변경하기", "Save changes") : t("등록하기", "Register")} <IconArrowRight className="size-4" /></PrimaryButton>
            </div>
          </Card>
        </form>
      ) : null}
    </div>
  );
}

/* ═══ 청구서 유형 변경 ═══════════════════════════════════════════ */

export function BillType() {
  return <RequireLogin>{(user) => <BillTypeInner email={user.email} tel={user.tel} />}</RequireLogin>;
}

function BillTypeInner({ email: defaultEmail, tel }: { email: string; tel: string }) {
  const t = useT();
  const { state, setSettings } = useStore();
  const s = state.settings;
  const [type, setType] = useState<"paper" | "mobile" | "email">(s.billType);
  const [email, setEmail] = useState(s.billEmail || defaultEmail);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (type === "email" && !isEmail(email)) {
      setError(t("청구서를 받을 이메일 주소를 확인해 주세요.", "Check the email address for your bill."));
      return;
    }
    setError("");
    setSettings({ billType: type, billEmail: type === "email" ? email.trim() : s.billEmail });
    setSaved(true);
  }

  const label = { paper: t("종이 청구서 (우편)", "Paper bill (post)"), mobile: t("모바일 청구서 (알림톡)", "Mobile bill (message)"), email: t("이메일 청구서", "Email bill") };

  return (
    <form onSubmit={save} noValidate className="space-y-4">
      <Card>
        <SectionTitle sub={t(`현재: ${label[s.billType]}`, `Current: ${label[s.billType]}`)}>{t("받는 방법 선택", "How you receive bills")}</SectionTitle>
        <RadioCards
          name="bill-type"
          value={type}
          onChange={(v) => { setType(v); setSaved(false); }}
          options={[
            { value: "paper", label: { ko: "종이 청구서", en: "Paper" }, sub: { ko: "우편 발송", en: "By post" } },
            { value: "mobile", label: { ko: "모바일 (알림톡)", en: "Mobile" }, sub: { ko: "월 200원 할인", en: "₩200/mo off" } },
            { value: "email", label: { ko: "이메일", en: "Email" }, sub: { ko: "월 200원 할인", en: "₩200/mo off" } },
          ]}
        />
        {type === "mobile" ? <p className="mt-4 text-[0.875rem] text-ink-600">{t(`${tel}로 매월 청구서를 보내드립니다.`, `We'll send your bill to ${tel} each month.`)}</p> : null}
        {type === "email" ? (
          <div className="mt-4">
            <Field id="bill-email" label={t("받을 이메일", "Email address")} required error={error}>
              <input id="bill-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSaved(false); }} className={inputCls(!!error)} />
            </Field>
          </div>
        ) : null}
      </Card>
      {saved ? (
        <p role="status" data-saved className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3.5 text-[0.9375rem] font-extrabold text-emerald-700">
          <IconCheck className="size-5" /> {t(`저장했습니다 — ${label[type]}`, `Saved — ${label[type]}`)}
        </p>
      ) : null}
      <PrimaryButton className="w-full">{t("저장하기", "Save")}</PrimaryButton>
    </form>
  );
}

/* ═══ 요금경감 제도 안내 ══════════════════════════════════════════ */

export function Discounts() {
  const { lang } = useLang();
  const t = useT();
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (id: string) => setChecked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const matched = DISCOUNTS.filter((d) => checked.includes(d.id));
  // Only one programme applies at a time — the most generous one.
  const best = matched.reduce<(typeof DISCOUNTS)[number] | null>((b, d) => (!b || d.monthly + d.winterExtra > b.monthly + b.winterExtra ? d : b), null);

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle sub={t("해당하는 항목을 모두 고르면 받을 수 있는 감면을 계산해 드립니다.", "Tick everything that applies and we'll show what you can get.")}>
          {t("감면 대상 확인하기", "Check eligibility")}
        </SectionTitle>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DISCOUNTS.map((d) => (
            <Checkbox key={d.id} checked={checked.includes(d.id)} onChange={() => toggle(d.id)}>
              <strong className="font-bold text-ink-900">{pick(d.label, lang)}</strong>
              <br />
              <span className="text-[0.8125rem]">{pick(d.who, lang)}</span>
            </Checkbox>
          ))}
        </div>
        <div className="mt-4" aria-live="polite">
          {best ? (
            <InfoBox tone="orange">
              <p data-discount-result className="font-extrabold">{t(`적용 가능: ${pick(best.label, lang)}`, `Eligible: ${pick(best.label, lang)}`)}</p>
              <p className="mt-1">{pick(best.amount, lang)}</p>
              {matched.length > 1 ? <p className="mt-1 text-[0.8125rem]">{t("여러 항목에 해당하면 감면액이 가장 큰 1개만 적용됩니다.", "If several apply, only the largest discount is used.")}</p> : null}
            </InfoBox>
          ) : checked.length === 0 ? (
            <p className="text-[0.875rem] text-ink-500">{t("항목을 선택하면 결과가 여기에 표시됩니다.", "Your result will appear here.")}</p>
          ) : null}
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-extrabold text-ink-900">{t("온라인 신청", "Apply online")}</h2>
        <RequestForm
          type="discount"
          applicant={{ customerNo: "required" }}
          sections={[
            {
              title: { ko: "감면 내용", en: "Discount details" },
              fields: [
                { name: "program", kind: "select", required: true, label: { ko: "감면 구분", en: "Programme" }, options: DISCOUNTS.map((d) => ({ value: d.id, label: d.label })) },
                { name: "proof", kind: "file", required: true, accept: ".pdf,.jpg,.jpeg,.png", label: { ko: "증빙서류", en: "Proof" }, help: { ko: "수급자 증명서, 장애인 증명서, 가족관계증명서 등", en: "Benefits, disability or family-relation certificate" } },
              ],
            },
          ]}
          consent={STANDARD_CONSENT}
          submitLabel={{ ko: "감면 신청하기", en: "Apply" }}
          successNote={{ ko: "서류 확인 후 다음 청구분부터 감면이 적용되며, 결과를 문자로 안내드립니다.", en: "Once your documents are checked, the discount applies from the next bill and we'll text you the result." }}
        />
      </div>
      <SampleNote />
    </div>
  );
}

/* ═══ 요금표·단가 ════════════════════════════════════════════════ */

export function Rates() {
  const { lang } = useLang();
  const t = useT();
  const examples = [10, 30, 80];
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle sub={t("2026년 7월 1일 검침분부터 적용 · 부가가치세 별도", "From readings on Jul 1, 2026 · VAT excluded")}>{t("용도별 요금표", "Rates by usage type")}</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] text-left text-[0.875rem]">
            <thead>
              <tr className="border-b border-ink-200 text-[0.75rem] text-ink-500">
                <th className="py-2 font-semibold">{t("용도", "Usage type")}</th>
                <th className="py-2 text-right font-semibold">{t("기본요금 (월)", "Base (per month)")}</th>
                <th className="py-2 text-right font-semibold">{t("사용요금 (원/㎥)", "Unit (₩/㎥)")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {TARIFFS.map((tr) => (
                <tr key={tr.id}>
                  <td className="py-3 font-semibold text-ink-800">
                    {pick(tr.label, lang)}
                    {tr.note ? <span className="ml-1.5 text-[0.75rem] font-medium text-ink-400">({pick(tr.note, lang)})</span> : null}
                  </td>
                  <td className="py-3 text-right tabular-nums">{won(tr.base, lang)}</td>
                  <td className="py-3 text-right font-bold tabular-nums text-ink-900">{tr.unit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle sub={t("주택용 (취사·난방) 기준, 부가세 포함", "Residential (cooking + heating), VAT included")}>{t("이만큼 쓰면 이 정도 나와요", "What a month costs")}</SectionTitle>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {examples.map((u) => (
            <li key={u} className="rounded-xl bg-ink-50 p-4">
              <p className="text-[0.8125rem] text-ink-500">{t(`월 ${u}㎥`, `${u}㎥ / month`)}</p>
              <p className="mt-1 text-xl font-extrabold tabular-nums text-ink-900">{won(calcBill(u).total, lang)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.875rem] text-ink-600">
          {t("계산식: (기본요금 + 사용량 × 단가) × 1.1, 10원 미만 절사", "Formula: (base + usage × unit) × 1.1, rounded down to ₩10")}
        </p>
        <Link href="/bill/calculator" className="mt-4 inline-flex items-center gap-1 text-[0.9375rem] font-bold text-sk-red-600 hover:underline">
          {t("내 사용량으로 계산해 보기", "Calculate with your usage")} <IconArrowRight className="size-4" />
        </Link>
      </Card>
      <SampleNote />
    </div>
  );
}

/* ═══ 전용계좌 안내 ══════════════════════════════════════════════ */

export function DedicatedAccount() {
  const t = useT();
  const { user, ready } = useAuth();
  const [no, setNo] = useState<string | null>(null);
  if (!ready) return <div className="min-h-64" aria-hidden />;
  const target = no ?? user?.customerDigits ?? null;
  return (
    <div className="space-y-4">
      {!user || no ? (
        <CustomerLookup
          title={t("내 전용계좌 확인", "Find your dedicated account")}
          sub={t("고객님마다 다른 가상계좌가 배정됩니다. 이 계좌로 입금하면 자동으로 납부 처리됩니다.", "Each customer has their own virtual account; transfers to it are applied automatically.")}
          onFound={setNo}
          idPrefix="va"
        />
      ) : null}
      {target ? <VirtualAccountCard key={target} customerNo={target} /> : null}
      <Card>
        <SectionTitle>{t("이용 안내", "Good to know")}</SectionTitle>
        <ul className="list-disc space-y-1.5 pl-5 text-[0.875rem] leading-relaxed text-ink-600">
          <li>{t("인터넷·모바일뱅킹, ATM, 은행 창구 어디서든 이체할 수 있습니다.", "Transfer via online or mobile banking, ATM, or a branch.")}</li>
          <li>{t("청구금액과 다르게 입금하면 차액은 다음 달 청구서에서 정산됩니다.", "If you transfer a different amount, the difference is settled on next month's bill.")}</li>
          <li>{t("이체 수수료는 이용하시는 은행 기준으로 부과될 수 있습니다.", "Your bank may charge a transfer fee.")}</li>
        </ul>
      </Card>
    </div>
  );
}

function VirtualAccountCard({ customerNo }: { customerNo: string }) {
  const { lang } = useLang();
  const t = useT();
  const [copied, setCopied] = useState(false);
  const a = lookupAccount(customerNo);
  if (!a) return null;
  return (
    <div className="fade-up rounded-[1.25rem] bg-ink-900 p-6 text-white lg:p-7">
      <p className="text-[0.8125rem] text-white/60">{t("고객번호", "Customer no.")} {formatCustomerNo(a.customerNo)} · {pick(a.holder, lang)}</p>
      <p className="mt-4 text-[0.875rem] text-white/70">{pick(a.virtualAccount.bank, lang)}</p>
      <p data-vaccount className="mt-1 text-[1.75rem] font-extrabold tabular-nums tracking-tight">{a.virtualAccount.number}</p>
      <p className="mt-1 text-[0.8125rem] text-white/60">{t("예금주: 영남에너지서비스", "Account name: Yeongnam Energy Service")}</p>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(a.virtualAccount.number).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}
        className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-white px-5 text-[0.875rem] font-extrabold text-ink-900 hover:bg-ink-100"
      >
        <IconCopy className="size-4" /> {copied ? t("복사했습니다", "Copied") : t("계좌번호 복사", "Copy number")}
      </button>
    </div>
  );
}
