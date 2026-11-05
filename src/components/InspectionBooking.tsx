"use client";

import Link from "next/link";
import { useState } from "react";
import {
  currentPeriod,
  dateLabel,
  digitsOnly,
  formatCustomerNo,
  INSPECTION_AREAS,
  lookupAccount,
  periodLabel,
  SLOTS,
  slotLabel,
} from "@/lib/data";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { useAuth, type User } from "@/lib/auth";
import { REQUEST_META, requestStatus, useStore } from "@/lib/store";
import { printArea } from "@/lib/print";
import {
  Card,
  Checkbox,
  ErrorText,
  Field,
  focusFirstError,
  inputCls,
  isTel,
  maxVisitDate,
  minVisitDate,
  PrimaryButton,
  RadioCards,
  Receipt,
  SectionTitle,
} from "./form";
import { STANDARD_CONSENT } from "./RequestForm";
import { IconArrowRight, IconCalendar } from "./Icons";

type Kind = "regular" | "change" | "missed";

const KINDS: { value: Kind; label: Bi; sub: Bi }[] = [
  { value: "regular", label: { ko: "정기점검 예약", en: "Book my inspection" }, sub: { ko: "원하는 날짜로 미리 예약", en: "Pick a date in advance" } },
  { value: "change", label: { ko: "안내받은 일정 변경", en: "Change my notified date" }, sub: { ko: "문자로 받은 날짜가 어려울 때", en: "If the texted date doesn't suit" } },
  { value: "missed", label: { ko: "놓친 점검 다시 받기", en: "Missed my inspection" }, sub: { ko: "부재로 받지 못했을 때", en: "Weren't home for it" } },
];

const WEEKDAY: Bi[] = [
  { ko: "일", en: "Sun" }, { ko: "월", en: "Mon" }, { ko: "화", en: "Tue" }, { ko: "수", en: "Wed" },
  { ko: "목", en: "Thu" }, { ko: "금", en: "Fri" }, { ko: "토", en: "Sat" },
];

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Bookable days: tomorrow → 60 days out, Mon–Sat. */
function bookableDays() {
  const out: string[] = [];
  const d = new Date(`${minVisitDate()}T12:00:00`);
  const last = maxVisitDate();
  while (iso(d) <= last) {
    if (d.getDay() !== 0) out.push(iso(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** Deterministic, illustrative capacity: some slots are already taken. */
function slotOpen(dong: string, day: string, slot: string) {
  const sat = new Date(`${day}T12:00:00`).getDay() === 6;
  if (sat && slot !== "am") return false; // Saturdays: mornings only
  let h = 0;
  for (const c of `${dong}${day}${slot}`) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 5 !== 0;
}
const dayOpen = (dong: string, day: string) => SLOTS.some((s) => slotOpen(dong, day, s.key));

/** The area's next regular inspection month (YYYY-MM). */
export function nextInspection(dongKo: string) {
  const area = INSPECTION_AREAS.find((a) => a.dong.ko === dongKo);
  if (!area) return null;
  const now = currentPeriod();
  return [area.first, area.second].find((p) => p >= now) ?? `${Number(now.slice(0, 4)) + 1}${area.first.slice(4)}`;
}

export default function InspectionBooking({ dong, onDong }: { dong: string; onDong: (d: string) => void }) {
  const { user, ready: authReady } = useAuth();
  const { ready } = useStore();
  // Dates depend on "today", so render only on the client (after the store
  // loads) — never from the build-time HTML.
  if (!ready || !authReady) return <div className="min-h-96" aria-hidden />;
  return <BookingForm key={user?.memberId ?? "guest"} user={user} dong={dong} onDong={onDong} />;
}

function BookingForm({ user, dong, onDong }: { user: User | null; dong: string; onDong: (d: string) => void }) {
  const t = useT();
  const { lang } = useLang();
  const { state, addRequest } = useStore();

  const [kind, setKind] = useState<Kind | "">("regular");
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [name, setName] = useState(user ? pick(user.name, lang) : "");
  const [tel, setTel] = useState(user?.tel ?? "");
  const [addr, setAddr] = useState(user ? pick(user.address, lang) : "");
  const [customerNo, setCustomerNo] = useState(user?.customerNo ?? "");
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ id: string } | null>(null);

  const days = bookableDays();
  const shown = showAll ? days : days.slice(0, 12);
  const next = dong ? nextInspection(dong) : null;
  const area = INSPECTION_AREAS.find((a) => a.dong.ko === dong);

  const booked = user
    ? state.requests.filter(
        (r) =>
          r.type === "inspection" &&
          requestStatus(r) === "scheduled" &&
          (digitsOnly(r.tel) === digitsOnly(user.tel) || r.customerNo === user.customerDigits),
      )
    : [];

  function pickDay(d: string) {
    setDay(d);
    if (slot && !slotOpen(dong, d, slot)) setSlot("");
    setErrors((e) => ({ ...e, day: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!kind) er.kind = t("예약 종류를 선택해 주세요.", "Choose what you need.");
    if (!dong) er.dong = t("지역을 선택해 주세요.", "Choose your neighbourhood.");
    if (!day) er.day = t("점검 받을 날짜를 선택해 주세요.", "Choose a date.");
    if (!slot) er.slot = t("시간대를 선택해 주세요.", "Choose a time slot.");
    if (!name.trim()) er.name = t("성함을 입력해 주세요.", "Enter your name.");
    if (!isTel(tel)) er.tel = t("연락처를 010-0000-0000 형식으로 입력해 주세요.", "Enter a phone number like 010-0000-0000.");
    if (addr.trim().length < 5) er.addr = t("점검 받을 주소를 동·호수까지 입력해 주세요.", "Enter the full address, including unit number.");
    if (customerNo.trim() && !lookupAccount(customerNo)) er.customerNo = t("고객번호 10자리를 확인해 주세요.", "Check the 10-digit customer number.");
    if (!agree) er.agree = t("개인정보 수집·이용에 동의해 주세요.", "Please agree to the use of personal data.");
    const real = Object.fromEntries(Object.entries(er).filter(([, v]) => v));
    setErrors(real);
    if (Object.keys(real).length) {
      focusFirstError(real);
      return;
    }
    const rec = addRequest({
      type: "inspection",
      name: name.trim(),
      tel: tel.trim(),
      addr: addr.trim(),
      customerNo: customerNo.trim() ? digitsOnly(customerNo) : undefined,
      date: day,
      slot,
      fields: { kind: kind as Kind, dong, ...(note.trim() ? { note: note.trim() } : {}) },
    });
    setDone({ id: rec.id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    const k = KINDS.find((x) => x.value === kind)!;
    return (
      <div className="print-area">
        <Receipt
          title={t("점검 예약이 완료되었습니다", "Your inspection is booked")}
          id={done.id}
          rows={[
            [t("구분", "Type"), pick(k.label, lang)],
            [t("방문 일시", "Visit"), `${dateLabel(day, lang)} (${pick(WEEKDAY[new Date(`${day}T12:00:00`).getDay()], lang)}) ${slotLabel(slot, lang)}`],
            [t("주소", "Address"), addr],
            [t("연락처", "Phone"), tel],
          ]}
          note={t(
            "방문 전날 문자로 다시 알려 드립니다. 점검원의 사원증을 꼭 확인해 주세요.",
            "We'll text you the day before. Always check the inspector's ID.",
          )}
          actions={[
            { label: t("예약 확인·변경", "View or change"), href: `/move/reservation?id=${done.id}`, primary: true },
            { label: t("인쇄", "Print"), onClick: () => printArea() },
          ]}
        />
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {booked.length ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border-2 border-sk-orange-200 bg-sk-orange-50 p-5">
          <IconCalendar className="size-6 shrink-0 text-sk-orange-600" />
          <p className="min-w-0 flex-1 text-[0.9375rem] text-ink-800">
            <strong className="font-extrabold">{t("이미 예약된 점검이 있습니다", "You already have an inspection booked")}</strong>
            <br />
            <span className="tabular-nums">
              {dateLabel(booked[0].date!, lang)} {slotLabel(booked[0].slot, lang)} · {booked[0].id}
            </span>
          </p>
          <Link
            href={`/move/reservation?id=${booked[0].id}`}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-white px-4 text-[0.875rem] font-bold text-sk-orange-700 hover:bg-sk-orange-100"
          >
            {t("변경·취소", "Change or cancel")} <IconArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}

      {/* 1 · what */}
      <Card>
        <SectionTitle>{t("1. 무엇이 필요하신가요?", "1. What do you need?")}</SectionTitle>
        <div data-field="kind">
          <RadioCards name="kind" value={kind} onChange={setKind} options={KINDS} invalid={!!errors.kind} />
          {errors.kind ? <ErrorText>{errors.kind}</ErrorText> : null}
        </div>
      </Card>

      {/* 2 · where & when */}
      <Card>
        <SectionTitle sub={t("지역을 고르면 예약 가능한 날짜가 표시됩니다.", "Pick your area to see open dates.")}>
          {t("2. 날짜와 시간", "2. Date and time")}
        </SectionTitle>
        <div className="space-y-5">
          <Field id="dong" label={t("읍·면·동", "Neighbourhood")} required error={errors.dong}>
            <select
              id="dong"
              value={dong}
              onChange={(e) => {
                onDong(e.target.value);
                setDay("");
                setSlot("");
                setErrors((x) => ({ ...x, dong: "" }));
              }}
              className={inputCls(!!errors.dong)}
            >
              <option value="">{t("선택해 주세요", "Select…")}</option>
              {INSPECTION_AREAS.map((a) => (
                <option key={a.dong.ko} value={a.dong.ko}>{pick(a.dong, lang)}</option>
              ))}
            </select>
          </Field>

          {dong && next && area ? (
            <p className="rounded-xl bg-ink-50 px-4 py-3 text-[0.875rem] text-ink-700">
              {t(
                `${pick(area.dong, lang)}의 다음 정기점검은 ${periodLabel(next, lang)}입니다. 이 기간 날짜에는 `,
                `${pick(area.dong, lang)}'s next regular inspection is in ${periodLabel(next, lang)}. Dates in that month have `,
              )}
              <span className="mx-0.5 inline-block size-2 rounded-full bg-sk-orange-500 align-middle" aria-hidden />
              {t(" 표시가 있습니다.", " a dot.")}
            </p>
          ) : null}

          <fieldset data-field="day" disabled={!dong}>
            <legend className="text-[0.875rem] font-bold text-ink-800">
              {t("날짜", "Date")} <span className="text-sk-red-600">{t("(필수)", "(required)")}</span>
            </legend>
            {!dong ? (
              <p className="mt-2 rounded-xl border border-dashed border-ink-300 p-4 text-center text-[0.875rem] text-ink-500">
                {t("먼저 지역을 선택해 주세요.", "Choose your neighbourhood first.")}
              </p>
            ) : (
              <>
                <div className="mt-2.5 grid grid-cols-4 gap-1.5 sm:grid-cols-6 sm:gap-2" role="radiogroup">
                  {shown.map((d) => {
                    const open = dayOpen(dong, d);
                    const dt = new Date(`${d}T12:00:00`);
                    const regular = next && d.startsWith(next);
                    const selected = day === d;
                    return (
                      <label
                        key={d}
                        className={`relative flex min-h-[3.75rem] flex-col items-center justify-center rounded-xl border-2 px-1 py-1.5 text-center transition sm:min-h-16
                          ${!open ? "cursor-not-allowed border-ink-100 bg-ink-50 text-ink-300"
                            : selected ? "cursor-pointer border-sk-red-500 bg-sk-red-50 text-sk-red-700"
                            : errors.day ? "cursor-pointer border-sk-red-300 text-ink-800"
                            : "cursor-pointer border-ink-200 text-ink-800 hover:border-ink-400"}`}
                      >
                        <input type="radio" name="day" value={d} checked={selected} disabled={!open} onChange={() => pickDay(d)} className="sr-only" />
                        <span className={`text-[0.75rem] font-bold ${dt.getDay() === 6 && open && !selected ? "text-blue-600" : ""}`}>
                          {pick(WEEKDAY[dt.getDay()], lang)}
                        </span>
                        <span className="text-base font-extrabold tabular-nums leading-tight sm:text-[1.0625rem]">
                          {dt.getMonth() + 1}.{dt.getDate()}
                        </span>
                        {!open ? (
                          <span className="text-[0.6875rem] font-bold">{t("마감", "Full")}</span>
                        ) : regular ? (
                          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-sk-orange-500" aria-label={t("정기점검 기간", "Regular inspection month")} />
                        ) : null}
                      </label>
                    );
                  })}
                </div>
                {days.length > shown.length ? (
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="mt-3 inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-[0.875rem] font-bold text-ink-700 hover:bg-ink-100"
                  >
                    {t("이후 날짜 더 보기", "Show later dates")} <IconArrowRight className="size-4 rotate-90" />
                  </button>
                ) : null}
                <p className="mt-2 text-[0.75rem] text-ink-500">
                  {t("일요일·공휴일은 쉽니다. 토요일은 오전만 방문합니다.", "No visits on Sundays or holidays. Saturdays: mornings only.")}
                </p>
              </>
            )}
            {errors.day ? <ErrorText>{errors.day}</ErrorText> : null}
          </fieldset>

          <fieldset data-field="slot" disabled={!day}>
            <legend className="text-[0.875rem] font-bold text-ink-800">
              {t("시간대", "Time slot")} <span className="text-sk-red-600">{t("(필수)", "(required)")}</span>
            </legend>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup">
              {SLOTS.map((s) => {
                const open = !!day && slotOpen(dong, day, s.key);
                const selected = slot === s.key;
                return (
                  <label
                    key={s.key}
                    className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 px-3 text-center text-[0.875rem] font-bold transition
                      ${!open ? "cursor-not-allowed border-ink-100 bg-ink-50 text-ink-300"
                        : selected ? "cursor-pointer border-sk-red-500 bg-sk-red-50 text-sk-red-700"
                        : errors.slot ? "cursor-pointer border-sk-red-300 text-ink-700"
                        : "cursor-pointer border-ink-200 text-ink-700 hover:border-ink-400"}`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={s.key}
                      checked={selected}
                      disabled={!open}
                      onChange={() => {
                        setSlot(s.key);
                        setErrors((x) => ({ ...x, slot: "" }));
                      }}
                      className="sr-only"
                    />
                    {pick(s.label, lang)}
                    {day && !open ? <span className="text-[0.75rem]">· {t("마감", "Full")}</span> : null}
                  </label>
                );
              })}
            </div>
            {!day ? <p className="mt-2 text-[0.75rem] text-ink-500">{t("날짜를 먼저 선택하세요.", "Choose a date first.")}</p> : null}
            {errors.slot ? <ErrorText>{errors.slot}</ErrorText> : null}
          </fieldset>
        </div>
      </Card>

      {/* 3 · who */}
      <Card>
        <SectionTitle sub={user ? t("회원 정보로 채웠습니다. 필요하면 수정하세요.", "Filled from your account — edit if needed.") : undefined}>
          {t("3. 방문 받으실 분", "3. Who we'll visit")}
        </SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="in-name" label={t("성함", "Name")} required error={errors.name}>
            <input id="in-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls(!!errors.name)} />
          </Field>
          <Field id="in-tel" label={t("연락처", "Phone")} required error={errors.tel} help={t("방문 전날 문자를 보내 드립니다.", "We'll text you the day before.")}>
            <input id="in-tel" value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" className={inputCls(!!errors.tel)} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="in-addr" label={t("점검 받을 주소", "Address")} required error={errors.addr}>
              <input id="in-addr" value={addr} onChange={(e) => setAddr(e.target.value)} autoComplete="street-address" className={inputCls(!!errors.addr)} />
            </Field>
          </div>
          <Field id="in-cno" label={t("고객번호 (선택)", "Customer no. (optional)")} error={errors.customerNo}>
            <input
              id="in-cno"
              value={customerNo}
              onChange={(e) => setCustomerNo(e.target.value)}
              onBlur={() => lookupAccount(customerNo) && setCustomerNo(formatCustomerNo(customerNo))}
              inputMode="numeric"
              placeholder="1234-567-890"
              className={inputCls(!!errors.customerNo)}
            />
          </Field>
          <Field id="in-note" label={t("요청 사항 (선택)", "Notes (optional)")}>
            <input
              id="in-note"
              value={note}
              maxLength={100}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("예: 도착 전 전화 주세요", "e.g. Please call before arriving")}
              className={inputCls()}
            />
          </Field>
        </div>
      </Card>

      <div data-field="agree">
        <Checkbox checked={agree} onChange={(v) => { setAgree(v); setErrors((x) => ({ ...x, agree: "" })); }} invalid={!!errors.agree}>
          <strong className="font-bold text-ink-900">{t("[필수] 개인정보 수집·이용 동의", "[Required] I agree to the use of my personal data")}</strong>
          <br />
          {pick(STANDARD_CONSENT, lang)}
        </Checkbox>
        {errors.agree ? <ErrorText>{errors.agree}</ErrorText> : null}
      </div>

      {day && slot ? (
        <p className="rounded-xl bg-ink-900 px-5 py-4 text-[0.9375rem] font-bold text-white" aria-live="polite">
          {t("선택한 일정", "Selected")}: {dateLabel(day, lang)} ({pick(WEEKDAY[new Date(`${day}T12:00:00`).getDay()], lang)}) {slotLabel(slot, lang)}
        </p>
      ) : null}

      <PrimaryButton className="w-full">{t("점검 예약하기", "Book inspection")}</PrimaryButton>
      <p className="text-center text-[0.75rem] text-ink-500">
        {pick(REQUEST_META.inspection.label, lang)} · {t("예약 후 ‘방문예약 확인·변경’에서 바꾸거나 취소할 수 있습니다.", "You can change or cancel later under “Manage Visits”.")}
      </p>
    </form>
  );
}
