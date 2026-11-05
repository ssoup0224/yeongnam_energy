"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BANKS, CARDS, EASY_PAY, institutionLabel, periodLabel, won } from "@/lib/data";
import { pick, useLang, useT } from "@/lib/i18n";
import { useStore, type Payment } from "@/lib/store";
import { InfoBox, PrimaryButton, RadioCards } from "./form";
import { IconCheck, IconClose, IconCopy } from "./Icons";

type Method = "card" | "easy" | "autopay" | "vaccount";

/**
 * Mock payment flow. No card or account numbers are entered here — choosing a
 * card company stands in for the issuer's own approval window. Card, easy-pay
 * and registered-account payments are recorded as paid immediately; a
 * virtual-account transfer shows the account to send to.
 */
export default function PayDialog({
  open,
  onClose,
  amount,
  customerNo,
  period,
  vaccount,
  targets,
  onPaid,
}: {
  open: boolean;
  onClose: () => void;
  amount: number;
  customerNo: string;
  period: string;
  vaccount?: { bank: string; number: string };
  /** Pay several accounts at once (combined billing); defaults to the one. */
  targets?: { customerNo: string; amount: number }[];
  onPaid?: (p: Payment) => void;
}) {
  const { lang } = useLang();
  const t = useT();
  const { state, addPayment } = useStore();
  const autoPay = state.settings.autoPay;

  const [method, setMethod] = useState<Method | "">("");
  const [card, setCard] = useState("");
  const [installment, setInstallment] = useState("0");
  const [easy, setEasy] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"form" | "processing" | "done">("form");
  const [paid, setPaid] = useState<Payment | null>(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "processing") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button, input, select")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, phase]);

  if (!open) return null;

  const methodLabel = () => {
    if (method === "card") return `${card} ${installment === "0" ? t("일시불", "full payment") : t(`${installment}개월`, `${installment} months`)}`;
    if (method === "easy") return pick(EASY_PAY.find((e) => e.id === easy)!.label, lang);
    if (method === "autopay" && autoPay) return `${institutionLabel(autoPay.institution, lang)} ****${autoPay.last4}`;
    return "";
  };

  function pay() {
    if (!method) return setError(t("결제 수단을 선택해 주세요.", "Choose a payment method."));
    if (method === "card" && !card) return setError(t("카드사를 선택해 주세요.", "Choose a card company."));
    if (method === "easy" && !easy) return setError(t("간편결제 서비스를 선택해 주세요.", "Choose an easy-pay service."));
    setError("");
    setPhase("processing");
    window.setTimeout(() => {
      const m = methodLabel();
      const list = targets?.length ? targets : [{ customerNo, amount }];
      const recs = list.map((x) => addPayment({ customerNo: x.customerNo, period, amount: x.amount, method: m }));
      const p = recs[0];
      setPaid(p);
      setPhase("done");
      onPaid?.(p);
    }, 1200);
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  }

  // Portal to <body>: an animated (transformed / translucent) ancestor would
  // otherwise become the containing block for this fixed overlay.
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="pay-title">
      <button type="button" aria-label={t("닫기", "Close")} className="absolute inset-0 bg-ink-900/55" onClick={() => phase !== "processing" && onClose()} />
      <div ref={dialogRef} className="fade-up relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[1.5rem] bg-white p-6 sm:rounded-[1.5rem] lg:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="pay-title" className="text-lg font-extrabold text-ink-900">{t("요금 납부", "Pay bill")}</h2>
            <p className="mt-1 text-[0.8125rem] text-ink-500">{t(`${periodLabel(period, lang)} 청구분`, `${periodLabel(period, lang)} statement`)}</p>
          </div>
          {phase !== "processing" ? (
            <button type="button" onClick={onClose} aria-label={t("닫기", "Close")} className="flex size-10 items-center justify-center rounded-full hover:bg-ink-100">
              <IconClose className="size-5" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 rounded-2xl bg-ink-50 px-5 py-4">
          <p className="text-[0.8125rem] text-ink-500">{t("결제 금액", "Amount")}</p>
          <p className="text-[1.75rem] font-extrabold tabular-nums text-ink-900">{won(amount, lang)}</p>
        </div>

        {phase === "done" && paid ? (
          <div className="mt-5 text-center" role="status">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <IconCheck className="size-7" />
            </span>
            <p className="mt-3 text-lg font-extrabold text-ink-900">{t("납부가 완료되었습니다", "Payment complete")}</p>
            <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200 text-left text-[0.875rem]">
              <div className="flex justify-between gap-4 px-4 py-3"><dt className="text-ink-500">{t("승인번호", "Approval no.")}</dt><dd data-approval className="font-bold tabular-nums">{paid.id}</dd></div>
              <div className="flex justify-between gap-4 px-4 py-3"><dt className="text-ink-500">{t("결제 수단", "Method")}</dt><dd className="font-bold">{paid.method}</dd></div>
            </dl>
            <PrimaryButton type="button" onClick={onClose} className="mt-5 w-full">{t("확인", "Done")}</PrimaryButton>
          </div>
        ) : phase === "processing" ? (
          <div className="mt-8 flex flex-col items-center py-6" role="status" aria-live="polite">
            <span className="size-10 animate-spin rounded-full border-4 border-ink-200 border-t-sk-red-500" aria-hidden />
            <p className="mt-4 text-[0.9375rem] font-bold text-ink-700">{t("결제 승인 중입니다…", "Authorising payment…")}</p>
          </div>
        ) : (
          <>
            <fieldset className="mt-5">
              <legend className="text-[0.875rem] font-bold text-ink-800">{t("결제 수단", "Payment method")}</legend>
              <div className="mt-2.5">
                <RadioCards<Method>
                  name="pay-method"
                  columns={2}
                  value={method}
                  onChange={(m) => { setMethod(m); setError(""); }}
                  options={[
                    { value: "card", label: { ko: "신용·체크카드", en: "Credit / debit card" } },
                    { value: "easy", label: { ko: "간편결제", en: "Easy pay" } },
                    ...(autoPay ? [{ value: "autopay" as Method, label: { ko: "자동이체 계좌", en: "Auto-pay account" }, sub: { ko: `${autoPay.institution} ****${autoPay.last4}`, en: `${institutionLabel(autoPay.institution, "en")} ****${autoPay.last4}` } }] : []),
                    { value: "vaccount", label: { ko: "가상계좌 이체", en: "Bank transfer" } },
                  ]}
                />
              </div>
            </fieldset>

            {method === "card" ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-[0.8125rem] font-bold text-ink-700">
                  {t("카드사", "Card company")}
                  <select value={card} onChange={(e) => setCard(e.target.value)} className="mt-1.5 min-h-12 w-full rounded-xl border-2 border-ink-200 bg-white px-3 text-base">
                    <option value="">{t("선택", "Select")}</option>
                    {CARDS.map((c) => <option key={c.ko} value={pick(c, lang)}>{pick(c, lang)}</option>)}
                  </select>
                </label>
                <label className="block text-[0.8125rem] font-bold text-ink-700">
                  {t("할부", "Installments")}
                  <select value={installment} onChange={(e) => setInstallment(e.target.value)} className="mt-1.5 min-h-12 w-full rounded-xl border-2 border-ink-200 bg-white px-3 text-base">
                    <option value="0">{t("일시불", "Pay in full")}</option>
                    {[2, 3, 6].map((m) => <option key={m} value={String(m)}>{t(`${m}개월`, `${m} months`)}</option>)}
                  </select>
                </label>
                <p className="text-[0.75rem] text-ink-400 sm:col-span-2">{t("다음 단계에서 카드사 인증창이 열립니다 (시안에서는 생략).", "The card issuer's own approval window opens next (skipped in this draft).")}</p>
              </div>
            ) : null}

            {method === "easy" ? (
              <div className="mt-4">
                <RadioCards name="easy" value={easy} onChange={setEasy} options={EASY_PAY.map((e) => ({ value: e.id, label: e.label }))} />
              </div>
            ) : null}

            {method === "vaccount" ? (
              <div className="mt-4">
                <InfoBox>
                  <p className="font-bold text-ink-900">{t("아래 계좌로 입금해 주세요", "Transfer to this account")}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-2">
                    <span>{vaccount?.bank ?? pick(BANKS[0], lang)}</span>
                    <strong className="tabular-nums text-ink-900">{vaccount?.number ?? "-"}</strong>
                    {vaccount ? (
                      <button type="button" onClick={() => copy(vaccount.number)} className="inline-flex items-center gap-1 rounded-lg border border-ink-200 bg-white px-2 py-1 text-[0.75rem] font-bold">
                        <IconCopy className="size-3.5" /> {copied ? t("복사됨", "Copied") : t("복사", "Copy")}
                      </button>
                    ) : null}
                  </p>
                  <p className="mt-2 text-[0.8125rem]">{t("입금 확인은 10분 안에 자동 반영됩니다.", "Transfers are reflected automatically within 10 minutes.")}</p>
                </InfoBox>
              </div>
            ) : null}

            {error ? <p role="alert" className="mt-3 text-[0.875rem] font-bold text-sk-red-600">{error}</p> : null}

            {method === "vaccount" ? (
              <PrimaryButton type="button" onClick={onClose} className="mt-5 w-full">{t("확인", "OK")}</PrimaryButton>
            ) : (
              <PrimaryButton type="button" onClick={pay} className="mt-5 w-full">
                {t(`${won(amount, lang)} 결제하기`, `Pay ${won(amount, lang)}`)}
              </PrimaryButton>
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
