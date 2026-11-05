"use client";

import Link from "next/link";
import { useState } from "react";
import {
  calcBill,
  currentPeriod,
  digitsOnly,
  formatCustomerNo,
  INSPECTION_AREAS,
  lookupAccount,
  periodLabel,
  SELF_CHECK,
  stamp,
  won,
} from "@/lib/data";
import { SITE } from "@/lib/site";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore, type Reading } from "@/lib/store";
import CustomerLookup from "../CustomerLookup";
import InspectionBooking, { nextInspection } from "../InspectionBooking";
import RequestForm, { STANDARD_CONSENT } from "../RequestForm";
import RequireLogin from "../RequireLogin";
import {
  Card,
  Checkbox,
  ErrorText,
  Field,
  InfoBox,
  inputCls,
  isTel,
  PrimaryButton,
  RadioCards,
  SampleNote,
  SectionTitle,
} from "../form";
import { IconAlert, IconArrowRight, IconCheck, IconPhone, IconShield } from "../Icons";

/* ═══ 가스시설 점검 안내 ═════════════════════════════════════════ */

export function Inspection() {
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();
  const memberDong = user ? lookupAccount(user.customerDigits)?.dong ?? "" : "";
  const [picked, setPicked] = useState<string | null>(null);
  const dong = picked ?? (INSPECTION_AREAS.some((a) => a.dong.ko === memberDong) ? memberDong : "");
  const area = INSPECTION_AREAS.find((a) => a.dong.ko === dong);
  const next = dong ? nextInspection(dong) : null;

  return (
    <div className="space-y-6">
      <InspectionBooking dong={dong} onDong={setPicked} />

      {area && next ? (
        <Card>
          <SectionTitle sub={t("선택한 지역의 올해 정기점검 시기입니다.", "Regular inspection months for the selected area.")}>
            {t(`${pick(area.dong, lang)} 정기점검 일정`, `${pick(area.dong, lang)} inspection schedule`)}
          </SectionTitle>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-live="polite">
            <div className="rounded-xl bg-ink-50 p-4">
              <p className="text-[0.8125rem] text-ink-500">{t("상반기", "First round")}</p>
              <p className="mt-1 font-extrabold text-ink-900">{periodLabel(area.first, lang)}</p>
            </div>
            <div className="rounded-xl bg-ink-50 p-4">
              <p className="text-[0.8125rem] text-ink-500">{t("하반기", "Second round")}</p>
              <p className="mt-1 font-extrabold text-ink-900">{periodLabel(area.second, lang)}</p>
            </div>
            <div className="rounded-xl border-2 border-sk-orange-200 bg-sk-orange-50 p-4">
              <p className="text-[0.8125rem] text-sk-orange-700">{t("다음 점검", "Next")}</p>
              <p data-next-inspection className="mt-1 font-extrabold text-sk-orange-800">{periodLabel(next, lang)}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <Card>
        <SectionTitle sub={t("도시가스사업법에 따라 모든 세대는 연 2회 이상 안전점검을 받아야 합니다.", "By law every household must be inspected at least twice a year.")}>
          {t("점검은 이렇게 진행됩니다", "How inspection works")}
        </SectionTitle>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[
            t("예약 또는 방문 7일 전 문자 안내", "Book, or get a text 7 days ahead"),
            t("사원증 확인 후 입실", "Check the inspector's ID"),
            t("누출·배관·연소기 점검 (약 15분)", "Leak, pipe and appliance check (~15 min)"),
            t("점검 결과지 수령", "Receive the report"),
          ].map((s, i) => (
            <li key={s} className="rounded-xl bg-ink-50 p-3 sm:p-4">
              <span className="flex size-7 items-center justify-center rounded-full sk-gradient text-[0.8125rem] font-extrabold text-white">{i + 1}</span>
              <p className="mt-2 text-[0.8125rem] font-bold leading-snug text-ink-800 sm:text-[0.875rem]">{s}</p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

/* ═══ 온라인 자율점검 ════════════════════════════════════════════ */

export function SelfCheck() {
  const t = useT();
  const { lang } = useLang();
  const { state, addSelfCheck } = useStore();
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [missing, setMissing] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const result = resultId ? state.selfChecks.find((c) => c.id === resultId) : undefined;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (SELF_CHECK.some((q) => !answers[q.id])) {
      setMissing(true);
      return;
    }
    setMissing(false);
    const failed = SELF_CHECK.filter((q) => answers[q.id] === "no").map((q) => q.id);
    const rec = addSelfCheck({ answers, failed });
    setResultId(rec.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (result) {
    const failed = SELF_CHECK.filter((q) => result.failed.includes(q.id));
    const urgent = result.failed.includes("smell") || result.failed.includes("soap");
    const score = SELF_CHECK.length - failed.length;
    return (
      <div className="space-y-4">
        {urgent ? (
          <div className="rounded-[1.25rem] border-2 border-sk-red-300 bg-sk-red-50 p-5" role="alert">
            <p className="flex items-center gap-2 font-extrabold text-sk-red-800"><IconAlert className="size-5" /> {t("누출이 의심됩니다", "A leak is suspected")}</p>
            <p className="mt-1 text-[0.875rem] text-sk-red-800">{t("밸브를 잠그고 창문을 연 뒤, 밖에서 신고해 주세요.", "Close the valve, open windows, then call from outside.")}</p>
            <a href={`tel:${SITE.safetyLine}`} className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-xl bg-sk-red-500 px-5 font-extrabold text-white"><IconPhone className="size-5" /> {SITE.safetyLine}</a>
          </div>
        ) : null}
        <Card>
          <p className="text-[0.8125rem] text-ink-500">{stamp(result.createdAt)} · {t("결과가 저장되었습니다", "Result saved")}</p>
          <p data-selfcheck-score className="mt-2 text-3xl font-extrabold text-ink-900">
            {score} / {SELF_CHECK.length}
            <span className={`ml-2 text-base ${failed.length ? "text-sk-orange-600" : "text-emerald-600"}`}>
              {failed.length ? t("확인이 필요한 항목이 있습니다", "Some items need attention") : t("모두 양호합니다", "All good")}
            </span>
          </p>
          {failed.length ? (
            <ul className="mt-5 space-y-3">
              {failed.map((q) => (
                <li key={q.id} className="rounded-xl border border-sk-orange-200 bg-sk-orange-50 p-4">
                  <p className="font-bold text-ink-900">{pick(q.q, lang)}</p>
                  <p className="mt-1 text-[0.875rem] text-ink-700">→ {pick(q.fix, lang)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-[0.9375rem] text-emerald-700"><IconCheck className="size-5" /> {t("정기 점검 때까지 지금처럼 안전하게 사용하세요.", "Keep it up until your next regular inspection.")}</p>
          )}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {failed.length ? (
              <Link href="/safety/inspection" className="inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl sk-gradient px-5 font-extrabold text-white">
                {t("점검 신청하기", "Book an inspection")} <IconArrowRight className="size-4" />
              </Link>
            ) : null}
            <button type="button" onClick={() => { setResultId(null); setAnswers({}); }} className="min-h-12 rounded-xl border-2 border-ink-200 px-5 font-bold text-ink-700">
              {t("다시 점검하기", "Check again")}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <InfoBox>{t("각 항목을 직접 확인하고 답해 주세요. 약 5분 걸립니다. 결과는 이 기기에 저장됩니다.", "Check each item yourself and answer — about 5 minutes. Results are saved on this device.")}</InfoBox>
      <Card>
        <ol className="space-y-5">
          {SELF_CHECK.map((q, i) => (
            <li key={q.id} data-field={q.id}>
              <p className="text-[0.9375rem] font-bold text-ink-900">{i + 1}. {pick(q.q, lang)}</p>
              <div className="mt-2">
                <RadioCards
                  name={q.id}
                  columns={2}
                  value={answers[q.id] ?? ""}
                  onChange={(v) => setAnswers((s) => ({ ...s, [q.id]: v }))}
                  invalid={missing && !answers[q.id]}
                  options={[
                    { value: "yes", label: { ko: "네, 양호합니다", en: "Yes, fine" } },
                    { value: "no", label: { ko: "아니요 / 잘 모르겠어요", en: "No / not sure" } },
                  ]}
                />
              </div>
            </li>
          ))}
        </ol>
      </Card>
      {missing ? <p role="alert" className="rounded-xl bg-sk-red-50 px-4 py-3 text-[0.875rem] font-bold text-sk-red-700">{t("모든 항목에 답해 주세요.", "Please answer every item.")}</p> : null}
      <PrimaryButton className="w-full">{t("결과 보기", "See result")}</PrimaryButton>
      {state.selfChecks.length ? (
        <p className="text-center text-[0.8125rem] text-ink-500">
          {t(`최근 점검: ${stamp(state.selfChecks[0].createdAt)} (${SELF_CHECK.length - state.selfChecks[0].failed.length}/${SELF_CHECK.length})`, `Last check: ${stamp(state.selfChecks[0].createdAt)} (${SELF_CHECK.length - state.selfChecks[0].failed.length}/${SELF_CHECK.length})`)}
        </p>
      ) : null}
    </form>
  );
}

/* ═══ 자가검침 입력 ══════════════════════════════════════════════ */

export function MeterReading() {
  const t = useT();
  const { user, ready } = useAuth();
  const [no, setNo] = useState<string | null>(null);
  if (!ready) return <div className="min-h-64" aria-hidden />;
  const target = no ?? user?.customerDigits ?? null;
  return (
    <div className="space-y-4">
      {!target ? (
        <CustomerLookup
          title={t("고객번호 확인", "Your customer number")}
          sub={t("검침할 계량기의 고객번호를 입력하세요.", "Enter the customer number for the meter you're reading.")}
          onFound={setNo}
          buttonLabel={t("다음", "Next")}
          idPrefix="mr"
        />
      ) : (
        <ReadingForm key={target} customerNo={target} own={!!user && user.customerDigits === target} onChange={() => setNo(null)} canChange={!user || !!no} />
      )}
      <Card>
        <SectionTitle>{t("계량기 읽는 법", "Reading your meter")}</SectionTitle>
        <ul className="space-y-1.5 text-[0.875rem] leading-relaxed text-ink-600">
          <li>· {t("검은색 바탕의 숫자 5자리만 읽습니다. 빨간 숫자(소수점 아래)는 제외합니다.", "Read only the 5 digits on black; ignore the red ones after the decimal.")}</li>
          <li>· {t("앞자리 0도 그대로 입력해도 됩니다. 예) 03214", "Leading zeros are fine, e.g. 03214.")}</li>
          <li>· {t("검침일 전후 3일 안에 입력하면 실제 사용량으로 청구됩니다.", "Submit within 3 days of your reading date to be billed on actual usage.")}</li>
        </ul>
      </Card>
    </div>
  );
}

function ReadingForm({ customerNo, own, onChange, canChange }: { customerNo: string; own: boolean; onChange: () => void; canChange: boolean }) {
  const t = useT();
  const { lang } = useLang();
  const { state, addReading } = useStore();
  const acct = lookupAccount(customerNo)!;
  const period = currentPeriod();
  const existing = state.readings.find((r) => r.customerNo === customerNo && r.period === period);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [warn, setWarn] = useState(false);
  const [saved, setSaved] = useState<Reading | null>(null);
  const avg = Math.round(acct.usage.slice(0, -1).reduce((s, u) => s + u.value, 0) / (acct.usage.length - 1));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const d = digitsOnly(value);
    if (!d || d.length > 5) {
      setError(t("계량기 숫자 1~5자리를 입력해 주세요.", "Enter the 1–5 meter digits."));
      return;
    }
    const reading = Number(d);
    const usage = reading - acct.lastReading;
    if (usage < 0) {
      setError(t(`지난 검침값(${acct.lastReading}㎥)보다 작을 수 없습니다. 숫자를 다시 확인해 주세요.`, `Can't be lower than the last reading (${acct.lastReading}㎥) — please re-check.`));
      return;
    }
    if (usage > 999) {
      setError(t("사용량이 비정상적으로 큽니다. 숫자를 다시 확인해 주세요.", "That usage is implausibly high — please re-check."));
      return;
    }
    if (usage > avg * 3 && !warn) {
      setWarn(true);
      setError("");
      return;
    }
    setError("");
    setWarn(false);
    setSaved(addReading({ customerNo, period, reading, usage }));
  }

  if (saved) {
    // Same discount rule as the statement (auto-pay / e-bill) for the member's own account.
    const st = state.settings;
    const discount = own ? (st.autoPay ? 200 : 0) + (st.billType !== "paper" ? 200 : 0) : 0;
    const bill = calcBill(saved.usage, acct.tariffId, discount);
    return (
      <Card className="fade-up text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><IconCheck className="size-7" /></span>
        <h2 className="mt-4 text-xl font-extrabold text-ink-900">{t("검침값이 등록되었습니다", "Reading submitted")}</h2>
        <dl className="mx-auto mt-5 max-w-sm divide-y divide-ink-100 rounded-2xl border border-ink-200 text-left text-[0.875rem]">
          {[
            [t("이번 검침값", "This reading"), `${saved.reading.toLocaleString()}㎥`],
            [t("지난 검침값", "Last reading"), `${acct.lastReading.toLocaleString()}㎥`],
            [t("사용량", "Usage"), `${saved.usage}㎥`],
            [t("예상 요금", "Estimated bill"), won(bill.total, lang)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-3"><dt className="text-ink-500">{k}</dt><dd data-reading={k} className="font-bold tabular-nums text-ink-900">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-4 text-[0.8125rem] text-ink-500">{t(`${periodLabel(period, lang)} 청구서에 반영됩니다.`, `Applied to your ${periodLabel(period, lang)} bill.`)}</p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href={own ? "/bill" : "/bill/quick"} className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl sk-gradient px-6 font-extrabold text-white">{t("청구서 확인", "See the bill")} <IconArrowRight className="size-4" /></Link>
          <button type="button" onClick={() => { setSaved(null); setValue(""); }} className="min-h-12 rounded-xl border-2 border-ink-200 px-6 font-bold text-ink-700">{t("다시 입력", "Enter again")}</button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[0.8125rem] text-ink-500">{t("고객번호", "Customer no.")} {formatCustomerNo(acct.customerNo)} · {t("계량기", "Meter")} {acct.meterNo}</p>
            <p className="mt-0.5 text-[0.8125rem] text-ink-500">{pick(acct.address, lang)}</p>
          </div>
          {canChange ? <button type="button" onClick={onChange} className="text-[0.8125rem] font-bold text-ink-600 underline underline-offset-2">{t("번호 변경", "Change number")}</button> : null}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-ink-50 p-4">
            <p className="text-[0.8125rem] text-ink-500">{t("지난 검침값", "Last reading")}</p>
            <p data-last-reading className="mt-1 text-xl font-extrabold tabular-nums text-ink-900">{acct.lastReading.toLocaleString()}㎥</p>
          </div>
          <div className="rounded-xl bg-ink-50 p-4">
            <p className="text-[0.8125rem] text-ink-500">{t("월평균 사용량", "Monthly average")}</p>
            <p className="mt-1 text-xl font-extrabold tabular-nums text-ink-900">{avg}㎥</p>
          </div>
        </div>
        {existing ? (
          <p className="mt-4 rounded-xl bg-sk-orange-50 px-4 py-3 text-[0.8125rem] font-bold text-sk-orange-800">
            {t(`이번 달 이미 ${existing.reading}㎥로 제출했습니다. 다시 제출하면 바뀝니다.`, `Already submitted ${existing.reading}㎥ this month — submitting again replaces it.`)}
          </p>
        ) : null}
        <div className="mt-5">
          <Field id="reading" label={t("이번 검침값 (㎥)", "This reading (㎥)")} required error={error}>
            <input id="reading" value={value} inputMode="numeric" maxLength={5} onChange={(e) => { setValue(e.target.value.replace(/\D/g, "")); setWarn(false); }} className={`${inputCls(!!error)} text-center text-2xl font-extrabold tracking-[0.4em] tabular-nums`} placeholder="00000" />
          </Field>
        </div>
        {warn ? (
          <div role="alert" className="mt-4 rounded-xl border border-sk-orange-300 bg-sk-orange-50 p-4 text-[0.875rem] text-sk-orange-900">
            <p className="font-bold">{t("평소보다 사용량이 많습니다", "Usage is much higher than usual")}</p>
            <p className="mt-1">{t(`이번 사용량 ${Number(digitsOnly(value)) - acct.lastReading}㎥ (평균 ${avg}㎥). 숫자가 맞다면 한 번 더 눌러 제출하세요.`, `This month ${Number(digitsOnly(value)) - acct.lastReading}㎥ (avg ${avg}㎥). If it's right, press submit again.`)}</p>
          </div>
        ) : null}
        <PrimaryButton className="mt-5 w-full">{warn ? t("이대로 제출하기", "Submit anyway") : t("검침값 제출", "Submit reading")}</PrimaryButton>
      </Card>
    </form>
  );
}

/* ═══ 안전점검 SMS 사전안내 ═════════════════════════════════════ */

const SMS_TOPICS: { id: string; label: Bi }[] = [
  { id: "inspection", label: { ko: "안전점검 방문 7일 전 안내", en: "Inspection visit, 7 days ahead" } },
  { id: "reading", label: { ko: "자가검침일 안내", en: "Self-reading day" } },
  { id: "bill", label: { ko: "청구·납기 안내", en: "Bill issued / due" } },
  { id: "outage", label: { ko: "공급 중단·공사 안내", en: "Supply interruptions / works" } },
];

export function SmsAlerts() {
  return <RequireLogin>{(user) => <SmsInner defaultTel={user.tel} />}</RequireLogin>;
}

function SmsInner({ defaultTel }: { defaultTel: string }) {
  const t = useT();
  const { lang } = useLang();
  const { state, setSettings } = useStore();
  const cur = state.settings.sms;
  const [enabled, setEnabled] = useState(cur.enabled || cur.topics.length === 0);
  const [tel, setTel] = useState(cur.tel || defaultTel);
  const [topics, setTopics] = useState<string[]>(cur.topics.length ? cur.topics : ["inspection"]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (enabled && !isTel(tel)) return setError(t("문자를 받을 휴대폰 번호를 확인해 주세요.", "Check the mobile number."));
    if (enabled && !topics.length) return setError(t("받을 안내를 하나 이상 선택해 주세요.", "Choose at least one alert."));
    setError("");
    setSettings({ sms: { enabled, tel: tel.trim(), topics: enabled ? topics : [] } });
    setSaved(true);
  }

  return (
    <form onSubmit={save} noValidate className="space-y-4">
      <Card>
        <SectionTitle sub={cur.enabled ? t(`현재 ${cur.tel}로 ${cur.topics.length}개 안내를 받고 있습니다.`, `Currently ${cur.topics.length} alert(s) to ${cur.tel}.`) : t("현재 문자 안내를 받지 않고 있습니다.", "You're not receiving text alerts.")}>
          {t("문자 안내 설정", "Text alerts")}
        </SectionTitle>
        <RadioCards
          name="sms-on"
          columns={2}
          value={enabled ? "on" : "off"}
          onChange={(v) => { setEnabled(v === "on"); setSaved(false); }}
          options={[
            { value: "on", label: { ko: "받기", en: "On" } },
            { value: "off", label: { ko: "받지 않기", en: "Off" } },
          ]}
        />
        {enabled ? (
          <div className="mt-5 space-y-4">
            <Field id="sms-tel" label={t("휴대폰 번호", "Mobile number")} required error={error && !isTel(tel) ? error : undefined}>
              <input id="sms-tel" value={tel} onChange={(e) => { setTel(e.target.value); setSaved(false); }} inputMode="tel" className={inputCls()} />
            </Field>
            <div className="space-y-2">
              {SMS_TOPICS.map((tp) => (
                <Checkbox key={tp.id} checked={topics.includes(tp.id)} onChange={(c) => { setTopics((s) => (c ? [...s, tp.id] : s.filter((x) => x !== tp.id))); setSaved(false); }}>
                  {pick(tp.label, lang)}
                </Checkbox>
              ))}
            </div>
            {error && isTel(tel) ? <ErrorText>{error}</ErrorText> : null}
          </div>
        ) : null}
      </Card>
      {enabled && topics.includes("inspection") ? (
        <Card>
          <p className="text-[0.8125rem] font-bold text-ink-500">{t("문자 예시", "Sample message")}</p>
          <p className="mt-2 rounded-2xl rounded-tl-sm bg-ink-100 p-4 text-[0.875rem] leading-relaxed text-ink-800">
            {t("[영남에너지서비스] 11월 12일(목) 오후 1~3시 가스 안전점검이 예정되어 있습니다. 일정 변경: yes.skens.com/r", "[Yeongnam Energy] Gas-safety inspection scheduled Thu Nov 12, 1–3pm. Reschedule: yes.skens.com/r")}
          </p>
        </Card>
      ) : null}
      {saved ? <p role="status" data-saved className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3.5 font-extrabold text-emerald-700"><IconCheck className="size-5" /> {t("저장했습니다", "Saved")}</p> : null}
      <PrimaryButton className="w-full">{t("저장하기", "Save")}</PrimaryButton>
    </form>
  );
}

/* ═══ 계량기 교체 예약 ═══════════════════════════════════════════ */

export function MeterSwap() {
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();
  const acct = user ? lookupAccount(user.customerDigits) : null;
  return (
    <RequestForm
      type="meter-swap"
      intro={
        acct ? (
          <InfoBox tone="orange">
            {t(`회원님 계량기(${acct.meterNo})의 검정 유효기간은 ${periodLabel(acct.meterExpiry, lang)}까지입니다.`, `Your meter (${acct.meterNo}) is certified until ${periodLabel(acct.meterExpiry, lang)}.`)}
          </InfoBox>
        ) : (
          <InfoBox>{t("계량기는 법에 따라 정기적으로 교체합니다. 교체 비용은 회사가 부담합니다.", "Meters are replaced periodically by law, at our cost.")}</InfoBox>
        )
      }
      applicant={{ customerNo: "required" }}
      sections={[
        {
          title: { ko: "교체 사유", en: "Reason" },
          fields: [
            {
              name: "reason",
              kind: "radio",
              required: true,
              label: { ko: "사유", en: "Reason" },
              options: [
                { value: "expiry", label: { ko: "검정 기간 만료", en: "Certification expiring" } },
                { value: "fault", label: { ko: "고장·이상 의심", en: "Suspected fault" } },
                { value: "move", label: { ko: "설치 위치 변경", en: "Move the meter" } },
              ],
            },
            { name: "memo", kind: "textarea", maxLength: 300, label: { ko: "증상·요청 사항", en: "Symptoms / notes" } },
          ],
        },
      ]}
      schedule={{ help: { ko: "교체에는 약 30분이 걸리며, 그동안 가스를 쓸 수 없습니다.", en: "Takes about 30 minutes, during which gas is off." } }}
      consent={STANDARD_CONSENT}
      submitLabel={{ ko: "교체 예약하기", en: "Book replacement" }}
    />
  );
}

/* ═══ 가스누출 신고 ══════════════════════════════════════════════ */

export function LeakReport() {
  const t = useT();
  return (
    <div className="space-y-6">
      <div className="rounded-[1.25rem] border-2 border-sk-red-300 bg-sk-red-50 p-6">
        <p className="flex items-center gap-2 text-lg font-extrabold text-sk-red-800"><IconAlert className="size-5" /> {t("지금 가스 냄새가 난다면 전화가 가장 빠릅니다", "If you smell gas now, call — it's fastest")}</p>
        <ol className="mt-3 grid grid-cols-2 gap-2 text-[0.875rem] font-bold text-ink-800 sm:grid-cols-4">
          {[t("밸브 잠그기", "Close valve"), t("창문 열기", "Open windows"), t("전기 만지지 않기", "No electrics"), t("밖에서 신고", "Call outside")].map((s, i) => (
            <li key={s} className="rounded-lg bg-white px-3 py-2"><span className="text-sk-red-600">{i + 1}</span> {s}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a href={`tel:${SITE.safetyLine}`} className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-sk-red-500 text-lg font-extrabold text-white hover:bg-sk-red-600"><IconPhone className="size-5" /> {SITE.safetyLine} {t("(24시간)", "(24h)")}</a>
          <a href="tel:119" className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-sk-red-300 bg-white px-6 text-lg font-extrabold text-sk-red-700">119</a>
        </div>
      </div>

      <div>
        <h2 className="mb-1 flex items-center gap-2 text-lg font-extrabold text-ink-900"><IconShield className="size-5 text-ink-500" /> {t("긴급하지 않은 신고", "Non-urgent report")}</h2>
        <p className="mb-3 text-[0.875rem] text-ink-500">{t("배관 손상, 계량기 이상, 공사장 주변 냄새처럼 당장 위험하지 않은 경우 온라인으로 신고하세요.", "For things like damaged pipes, odd meter behaviour or a faint smell near works, report online.")}</p>
        <RequestForm
          type="leak"
          applicant={{ customerNo: false, addressLabel: { ko: "신고 장소", en: "Location" } }}
          sections={[
            {
              title: { ko: "상황", en: "What's happening" },
              fields: [
                {
                  name: "kind",
                  kind: "radio",
                  required: true,
                  columns: 2,
                  label: { ko: "증상", en: "Symptom" },
                  options: [
                    { value: "smell", label: { ko: "약한 냄새", en: "Faint smell" } },
                    { value: "pipe", label: { ko: "배관 손상", en: "Damaged pipe" } },
                    { value: "meter", label: { ko: "계량기 이상", en: "Meter problem" } },
                    { value: "other", label: { ko: "기타", en: "Other" } },
                  ],
                },
                {
                  name: "valve",
                  kind: "radio",
                  required: true,
                  columns: 2,
                  label: { ko: "밸브를 잠갔나요?", en: "Have you closed the valve?" },
                  options: [
                    { value: "yes", label: { ko: "네", en: "Yes" } },
                    { value: "no", label: { ko: "아니요 / 해당 없음", en: "No / n/a" } },
                  ],
                },
                { name: "detail", kind: "textarea", required: true, maxLength: 500, label: { ko: "자세한 내용", en: "Details" }, placeholder: { ko: "언제부터, 어디에서, 어떤 상황인지 적어 주세요.", en: "When it started, where, and what you notice." } },
                { name: "photo", kind: "file", accept: ".jpg,.jpeg,.png,.heic", label: { ko: "사진 (선택)", en: "Photo (optional)" } },
              ],
            },
          ]}
          consent={STANDARD_CONSENT}
          submitLabel={{ ko: "신고 접수", en: "Send report" }}
          successNote={{ ko: "순찰 담당자가 30분 안에 연락드립니다. 상황이 나빠지면 즉시 1544-4500으로 전화하세요.", en: "A patrol officer will call within 30 minutes. If it gets worse, call 1544-4500 at once." }}
        />
      </div>
      <SampleNote />
    </div>
  );
}
