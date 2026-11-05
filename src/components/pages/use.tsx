"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { dateLabel, digitsOnly, formatCustomerNo, lookupAccount, SLOTS, slotLabel, stamp, tariffById, todayISO } from "@/lib/data";
import { NAV } from "@/lib/site";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { printArea } from "@/lib/print";
import {
  REQUEST_META,
  requestStatus,
  STATUS_LABEL,
  useStore,
  type RequestStatus,
  type ServiceRequest,
} from "@/lib/store";
import CustomerLookup from "../CustomerLookup";
import DateInput from "../DateInput";
import RequestForm, { STANDARD_CONSENT } from "../RequestForm";
import {
  Card,
  ErrorText,
  Field,
  InfoBox,
  inputCls,
  isTel,
  maxVisitDate,
  minVisitDate,
  PrimaryButton,
  RadioCards,
  SampleNote,
  SectionTitle,
  visitDateError,
} from "../form";
import { IconArrowRight, IconCalendar, IconCheck, IconClock, IconDoc, IconEdit, IconFlame, IconHome, IconMoveIn, IconMoveOut, IconPrint, IconStove, IconUser } from "../Icons";

/* ═══ 가스레인지 교체·철거 ═══════════════════════════════════════ */

export function Stove() {
  return (
    <RequestForm
      type="stove"
      intro={
        <InfoBox>
          <StoveFees />
        </InfoBox>
      }
      sections={[
        {
          title: { ko: "작업 내용", en: "Work needed" },
          fields: [
            {
              name: "work",
              kind: "radio",
              required: true,
              label: { ko: "작업 구분", en: "Work type" },
              options: [
                { value: "replace", label: { ko: "교체", en: "Replace" }, sub: { ko: "기존 기기 철거 + 새 기기 연결", en: "Remove old, connect new" } },
                { value: "remove", label: { ko: "철거", en: "Remove" }, sub: { ko: "배관 막음 처리", en: "Cap the pipe" } },
                { value: "install", label: { ko: "신규 연결", en: "New connection" }, sub: { ko: "새 기기만 연결", en: "Connect a new appliance" } },
              ],
            },
            {
              name: "appliance",
              kind: "radio",
              required: true,
              label: { ko: "기기 종류", en: "Appliance" },
              options: [
                { value: "range", label: { ko: "가스레인지", en: "Gas range" } },
                { value: "oven", label: { ko: "가스오븐레인지", en: "Range with oven" } },
                { value: "builtin", label: { ko: "빌트인 쿡탑", en: "Built-in cooktop" } },
              ],
            },
            { name: "memo", kind: "textarea", maxLength: 300, label: { ko: "요청 사항", en: "Notes" }, placeholder: { ko: "예) 새 기기는 방문 전날 배송 예정입니다.", en: "e.g. The new range arrives the day before." } },
          ],
        },
      ]}
      applicant={{ customerNo: "optional" }}
      schedule={{}}
      consent={STANDARD_CONSENT}
      submitLabel={{ ko: "방문 신청하기", en: "Book a visit" }}
    />
  );
}

function StoveFees() {
  const t = useT();
  return (
    <ul className="space-y-1 text-[0.875rem]">
      <li className="font-bold text-ink-900">{t("작업 비용 (예시)", "Fees (sample)")}</li>
      <li>· {t("철거·막음 처리: 무료", "Removal / capping: free")}</li>
      <li>· {t("교체·신규 연결: 연결비 15,000원 (호스·부속 포함)", "Replace / connect: ₩15,000 (hose and fittings included)")}</li>
      <li>· {t("빌트인 쿡탑은 하부장 개방이 필요합니다.", "Built-in cooktops need the cabinet below opened.")}</li>
    </ul>
  );
}

/* ═══ 방문예약 확인·변경 ═════════════════════════════════════════ */

const STATUS_STYLE: Record<RequestStatus, string> = {
  scheduled: "bg-sk-orange-100 text-sk-orange-700",
  received: "bg-ink-100 text-ink-700",
  done: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-ink-100 text-ink-400 line-through",
};

export function StatusBadge({ r }: { r: ServiceRequest }) {
  const { lang } = useLang();
  const s = requestStatus(r);
  return (
    <span data-status={s} className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[0.75rem] font-extrabold ${STATUS_STYLE[s]}`}>
      {pick(STATUS_LABEL[s], lang)}
    </span>
  );
}

export function Reservation() {
  const t = useT();
  const { lang } = useLang();
  const params = useSearchParams();
  const { user, ready: authReady } = useAuth();
  const { state, ready, findRequest } = useStore();
  const [id, setId] = useState(params.get("id") ?? "");
  const [tel, setTel] = useState("");
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  if (!ready || !authReady) return <div className="min-h-64" aria-hidden />;

  const mine = user
    ? state.requests.filter((r) => REQUEST_META[r.type].visit && (digitsOnly(r.tel) === digitsOnly(user.tel) || r.customerNo === user.customerDigits))
    : [];
  const current = openId ? state.requests.find((r) => r.id === openId) : undefined;

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim() || !isTel(tel)) {
      setError(t("접수번호와 연락처를 모두 정확히 입력해 주세요.", "Enter both the reference number and phone number."));
      return;
    }
    const r = findRequest(id, tel);
    if (!r) {
      setError(t("일치하는 신청이 없습니다. 접수번호와 연락처를 확인해 주세요.", "No matching request — check the reference and phone number."));
      return;
    }
    setError("");
    setOpenId(r.id);
  }

  return (
    <div className="space-y-4">
      {user ? (
        <Card>
          <SectionTitle sub={t("회원님의 연락처·고객번호로 접수된 방문 신청입니다.", "Visits booked with your phone or customer number.")}>
            {t("내 방문 신청", "My visits")}
          </SectionTitle>
          {mine.length ? (
            <ul className="divide-y divide-ink-100">
              {mine.map((r) => (
                <li key={r.id}>
                  <button type="button" data-request={r.id} onClick={() => setOpenId(r.id)} className={`flex w-full items-center gap-3 py-3.5 text-left transition hover:opacity-80 ${openId === r.id ? "font-bold" : ""}`}>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-bold text-ink-900">{pick(REQUEST_META[r.type].label, lang)}</span>
                      <span className="block text-[0.8125rem] tabular-nums text-ink-500">
                        {r.id} · {r.date ? `${dateLabel(r.date, lang)} ${slotLabel(r.slot, lang)}` : "-"}
                      </span>
                    </span>
                    <StatusBadge r={r} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl bg-ink-50 p-4 text-[0.875rem] text-ink-600">
              {t("아직 방문 신청이 없습니다. ", "No visits booked yet. ")}
              <Link href="/move/in" className="font-bold text-sk-red-600 underline underline-offset-2">{t("전입신청", "Move-in")}</Link>
              {" · "}
              <Link href="/move/out" className="font-bold text-sk-red-600 underline underline-offset-2">{t("전출신청", "Move-out")}</Link>
            </p>
          )}
        </Card>
      ) : null}

      <Card>
        <SectionTitle sub={t("신청 완료 화면이나 문자로 받은 접수번호를 입력하세요.", "Use the reference number from your confirmation screen or text.")}>
          {t("접수번호로 조회", "Look up by reference")}
        </SectionTitle>
        <form onSubmit={lookup} noValidate className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field id="rid" label={t("접수번호", "Reference no.")}>
            <input id="rid" value={id} onChange={(e) => setId(e.target.value)} className={inputCls(!!error)} placeholder="MI-261029-0000" autoComplete="off" />
          </Field>
          <Field id="rtel" label={t("신청 연락처", "Phone used")}>
            <input id="rtel" value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" className={inputCls(!!error)} placeholder="010-1234-5678" />
          </Field>
          <PrimaryButton>{t("조회", "Find")}</PrimaryButton>
        </form>
        {error ? <ErrorText>{error}</ErrorText> : null}
      </Card>

      {current ? <RequestDetail key={current.id} r={current} /> : null}
    </div>
  );
}

function RequestDetail({ r }: { r: ServiceRequest }) {
  const t = useT();
  const { lang } = useLang();
  const { updateRequest } = useStore();
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(r.date ?? "");
  const [slot, setSlot] = useState(r.slot ?? "");
  const [err, setErr] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [notice, setNotice] = useState("");
  const status = requestStatus(r);
  const active = status === "scheduled";

  function saveDate() {
    const e = visitDateError(date);
    if (e) return setErr(pick(e, lang));
    if (!slot) return setErr(t("시간대를 선택해 주세요.", "Choose a time slot."));
    updateRequest(r.id, { date, slot });
    setErr("");
    setEditing(false);
    setNotice(t("방문 일정을 변경했습니다. 변경 내용을 문자로 보내드립니다.", "Visit rescheduled — we'll text you the new time."));
  }

  return (
    <Card className="fade-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.8125rem] tabular-nums text-ink-500">{r.id}</p>
          <h3 className="mt-1 text-lg font-extrabold text-ink-900">{pick(REQUEST_META[r.type].label, lang)}</h3>
        </div>
        <StatusBadge r={r} />
      </div>
      <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200 text-[0.875rem]">
        {[
          [t("방문 일정", "Visit"), r.date ? `${dateLabel(r.date, lang)} · ${slotLabel(r.slot, lang)}` : "-"],
          [t("신청인", "Applicant"), r.name],
          [t("주소", "Address"), r.addr ?? "-"],
          [t("접수 일시", "Received"), stamp(r.createdAt)],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-4 px-4 py-3">
            <dt className="w-24 shrink-0 text-ink-500">{k}</dt>
            <dd data-detail={k} className="min-w-0 flex-1 font-bold text-ink-900">{v}</dd>
          </div>
        ))}
      </dl>

      {r.expedited && active ? (
        <p className="mt-3 flex items-center gap-1.5 text-[0.8125rem] font-bold text-sk-orange-700">
          <IconClock className="size-4" /> {t("방문 독촉 요청이 담당 센터에 전달되었습니다.", "Your request to expedite has been passed to the center.")}
        </p>
      ) : null}
      {notice ? <p role="status" className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-[0.875rem] font-bold text-emerald-700">{notice}</p> : null}

      {active && editing ? (
        <div className="mt-4 space-y-4 rounded-2xl border border-ink-200 p-4">
          <Field id="new-date" label={t("새 방문일", "New date")} error={undefined}>
            <DateInput id="new-date" value={date} min={minVisitDate()} max={maxVisitDate()} onChange={setDate} invalid={!!err} />
          </Field>
          <RadioCards name="new-slot" value={slot} onChange={setSlot} options={SLOTS.map((s) => ({ value: s.key, label: s.label }))} />
          {err ? <ErrorText>{err}</ErrorText> : null}
          <div className="flex gap-2">
            <PrimaryButton type="button" onClick={saveDate} className="flex-1">{t("변경 저장", "Save")}</PrimaryButton>
            <button type="button" onClick={() => { setEditing(false); setErr(""); }} className="min-h-13 rounded-xl border-2 border-ink-200 px-5 font-bold text-ink-700">{t("취소", "Cancel")}</button>
          </div>
        </div>
      ) : null}

      {active && !editing ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => { setEditing(true); setNotice(""); }} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-ink-900 px-4 text-[0.875rem] font-bold text-white hover:bg-ink-800">
            <IconCalendar className="size-4" /> {t("일정 변경", "Reschedule")}
          </button>
          <button
            type="button"
            disabled={r.expedited}
            onClick={() => { updateRequest(r.id, { expedited: true }); setNotice(""); }}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-ink-200 px-4 text-[0.875rem] font-bold text-ink-700 disabled:opacity-50"
          >
            <IconClock className="size-4" /> {r.expedited ? t("독촉 요청됨", "Expedite requested") : t("방문 독촉", "Expedite")}
          </button>
          <button type="button" onClick={() => setConfirmCancel(true)} className="inline-flex min-h-11 items-center rounded-xl border-2 border-ink-200 px-4 text-[0.875rem] font-bold text-ink-600">
            {t("신청 취소", "Cancel request")}
          </button>
        </div>
      ) : null}

      {confirmCancel ? (
        <div className="mt-3 rounded-xl border border-sk-red-200 bg-sk-red-50 p-4">
          <p className="text-[0.875rem] font-bold text-sk-red-800">{t("이 신청을 취소할까요? 취소 후에는 다시 신청해야 합니다.", "Cancel this request? You'll need to apply again afterwards.")}</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => { updateRequest(r.id, { cancelled: true }); setConfirmCancel(false); setNotice(t("신청을 취소했습니다.", "Request cancelled.")); }} className="min-h-10 rounded-lg bg-sk-red-500 px-4 text-[0.8125rem] font-bold text-white">
              {t("취소하기", "Cancel it")}
            </button>
            <button type="button" onClick={() => setConfirmCancel(false)} className="min-h-10 rounded-lg border border-ink-200 bg-white px-4 text-[0.8125rem] font-bold">{t("유지", "Keep")}</button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

/* ═══ 도시가스 이용 (hub) ═══════════════════════════════════════ */

const HUB_ICONS: Record<string, typeof IconDoc> = {
  "/guide": IconDoc,
  "/move/in": IconMoveIn,
  "/move/out": IconMoveOut,
  "/move/stove": IconStove,
  "/move/reservation": IconCalendar,
  "/use/contract": IconEdit,
  "/use/owner": IconUser,
  "/use/supply": IconClock,
  "/use/boiler": IconFlame,
  "/use/process": IconHome,
};

export function UseHub() {
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();
  const { state } = useStore();
  const group = NAV.find((n) => n.href === "/use")!;
  const upcoming = user
    ? state.requests.filter((r) => requestStatus(r) === "scheduled" && (digitsOnly(r.tel) === digitsOnly(user.tel) || r.customerNo === user.customerDigits))
    : [];

  return (
    <div className="space-y-6">
      {upcoming.length ? (
        <Link href="/move/reservation" className="flex items-center gap-3 rounded-[1.25rem] border-2 border-sk-orange-200 bg-sk-orange-50 p-5 transition hover:border-sk-orange-300">
          <IconCalendar className="size-6 shrink-0 text-sk-orange-600" />
          <span className="min-w-0 flex-1">
            <span className="block font-extrabold text-ink-900">{t(`방문 예정 ${upcoming.length}건`, `${upcoming.length} upcoming visit${upcoming.length > 1 ? "s" : ""}`)}</span>
            <span className="block text-[0.8125rem] text-ink-600">
              {pick(REQUEST_META[upcoming[0].type].label, lang)} · {upcoming[0].date ? dateLabel(upcoming[0].date, lang) : ""}
            </span>
          </span>
          <IconArrowRight className="size-5 text-sk-orange-600" />
        </Link>
      ) : null}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {group.children.map((c) => {
          const Icon = HUB_ICONS[c.href] ?? IconDoc;
          return (
          <li key={c.href}>
            <Link href={c.href} className="group flex h-full items-center gap-4 rounded-[1.25rem] border border-ink-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-sk-red-300">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sk-red-50 text-sk-red-600 transition group-hover:bg-sk-red-500 group-hover:text-white">
                <Icon className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1rem] font-extrabold text-ink-900">{pick(c.label, lang)}</span>
                {c.desc ? <span className="mt-0.5 block text-[0.8125rem] text-ink-500">{pick(c.desc, lang)}</span> : null}
              </span>
              <IconArrowRight className="size-4 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
            </Link>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ═══ 명의변경 ══════════════════════════════════════════════════ */

export function Owner() {
  return (
    <RequestForm
      type="owner"
      intro={
        <InfoBox>
          <OwnerSteps />
        </InfoBox>
      }
      applicant={{ customerNo: "required", addressLabel: { ko: "사용 주소", en: "Supply address" } }}
      sections={[
        {
          title: { ko: "변경 내용", en: "Change details" },
          sub: { ko: "신청인은 새로 계약할 분(신규 사용자)입니다.", en: "The applicant is the new account holder." },
          fields: [
            { name: "prevName", kind: "text", required: true, label: { ko: "기존 사용자 성명", en: "Current holder's name" } },
            {
              name: "reason",
              kind: "radio",
              required: true,
              columns: 4,
              label: { ko: "변경 사유", en: "Reason" },
              options: [
                { value: "sale", label: { ko: "매매", en: "Sale" } },
                { value: "lease", label: { ko: "임대차", en: "Lease" } },
                { value: "inherit", label: { ko: "상속", en: "Inheritance" } },
                { value: "other", label: { ko: "기타", en: "Other" } },
              ],
            },
            {
              name: "changeDate",
              kind: "date",
              required: true,
              label: { ko: "변경 기준일", en: "Effective date" },
              help: { ko: "이날 계량기 지침으로 기존 사용자 요금을 정산합니다.", en: "The current holder's bill is settled on this day's reading." },
              validate: (v) => {
                const d = new Date(`${v}T00:00:00`);
                const diff = (d.getTime() - new Date(`${todayISO()}T00:00:00`).getTime()) / 86400000;
                return diff < -30 || diff > 30 ? { ko: "오늘 기준 앞뒤 30일 안의 날짜를 선택해 주세요.", en: "Choose a date within 30 days of today." } : null;
              },
            },
            { name: "proof", kind: "file", accept: ".pdf,.jpg,.jpeg,.png", label: { ko: "증빙서류 (선택)", en: "Proof (optional)" }, help: { ko: "매매·임대차 계약서 사본 등", en: "e.g. a copy of the sale or lease contract" } },
          ],
        },
      ]}
      consent={STANDARD_CONSENT}
      submitLabel={{ ko: "명의변경 신청", en: "Apply" }}
      successNote={{ ko: "기존 사용자 정산이 끝나면 새 사용계약서를 알림톡으로 보내드립니다.", en: "Once the previous holder is settled, we'll send your new contract by message." }}
    />
  );
}

function OwnerSteps() {
  const t = useT();
  return (
    <ol className="space-y-1 text-[0.875rem]">
      <li>1. {t("신규 사용자가 온라인으로 신청합니다.", "The new holder applies online.")}</li>
      <li>2. {t("변경 기준일 지침으로 기존 사용자 요금을 정산합니다.", "The previous holder's bill is settled on the effective date.")}</li>
      <li>3. {t("새 사용계약서를 알림톡으로 작성합니다. 방문은 필요 없습니다.", "You sign the new contract by message — no visit needed.")}</li>
    </ol>
  );
}

/* ═══ 사용계약 조회 ══════════════════════════════════════════════ */

export function Contract() {
  const t = useT();
  const { user, ready } = useAuth();
  const [no, setNo] = useState<string | null>(null);
  if (!ready) return <div className="min-h-64" aria-hidden />;
  const target = no ?? user?.customerDigits ?? null;
  const own = !!user && target === user.customerDigits;
  return (
    <div className="space-y-4">
      {!user || no ? <CustomerLookup title={t("사용계약 조회", "Find a contract")} onFound={setNo} idPrefix="ct" /> : null}
      {target ? <ContractCard key={target} customerNo={target} own={own} /> : null}
    </div>
  );
}

function ContractCard({ customerNo, own }: { customerNo: string; own: boolean }) {
  const t = useT();
  const { lang } = useLang();
  const a = lookupAccount(customerNo);
  if (!a) return null;
  const rows: [string, string][] = [
    [t("계약자", "Holder"), pick(own ? a.holderFull : a.holder, lang)],
    [t("고객번호", "Customer no."), formatCustomerNo(a.customerNo)],
    [t("사용 주소", "Supply address"), pick(a.address, lang)],
    [t("용도", "Usage type"), pick(tariffById(a.tariffId).label, lang)],
    [t("계약일", "Contract date"), dateLabel(a.contractDate, lang)],
    [t("계량기 번호", "Meter no."), a.meterNo],
    [t("계량기 검정 만료", "Meter certification expires"), a.meterExpiry.replace("-", ".")],
    [t("공급 방식", "Supply"), t("배관 공급 (저압)", "Piped (low pressure)")],
    [t("계약 상태", "Status"), t("사용 중", "Active")],
  ];
  return (
    <div className="print-area fade-up rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-extrabold text-ink-900">{t("도시가스 사용계약 정보", "Supply contract")}</h3>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[0.75rem] font-extrabold text-emerald-700">{t("사용 중", "Active")}</span>
      </div>
      <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200 text-[0.875rem]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-4 px-4 py-3">
            <dt className="w-32 shrink-0 text-ink-500">{k}</dt>
            <dd data-contract={k} className="min-w-0 flex-1 font-bold text-ink-900">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="print-hide mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={printArea} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-ink-200 px-4 text-[0.875rem] font-bold text-ink-700">
          <IconPrint className="size-4" /> {t("출력", "Print")}
        </button>
        <Link href="/support/forms" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-ink-200 px-4 text-[0.875rem] font-bold text-ink-700">
          <IconDoc className="size-4" /> {t("확인서 발급", "Issue a certificate")}
        </Link>
        <Link href="/use/owner" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-ink-200 px-4 text-[0.875rem] font-bold text-ink-700">
          {t("명의변경", "Change holder")}
        </Link>
      </div>
    </div>
  );
}

/* ═══ 보일러 서류접수 ═══════════════════════════════════════════ */

export function Boiler() {
  return (
    <RequestForm
      type="boiler"
      applicant={{ customerNo: "optional", addressLabel: { ko: "설치 주소", en: "Installation address" } }}
      sections={[
        {
          title: { ko: "시공 정보", en: "Installation" },
          fields: [
            {
              name: "work",
              kind: "radio",
              required: true,
              label: { ko: "구분", en: "Type" },
              options: [
                { value: "new", label: { ko: "신규 설치", en: "New" } },
                { value: "replace", label: { ko: "교체", en: "Replace" } },
                { value: "remove", label: { ko: "철거", en: "Remove" } },
              ],
            },
            { name: "installer", kind: "text", required: true, label: { ko: "시공업체명", en: "Installer" } },
            { name: "installerTel", kind: "tel", required: true, label: { ko: "시공업체 연락처", en: "Installer phone" }, placeholder: { ko: "054-000-0000", en: "054-000-0000" } },
            { name: "model", kind: "text", label: { ko: "제조사·모델명", en: "Make / model" }, placeholder: { ko: "예) 경동나비엔 NCB553", en: "e.g. Navien NCB553" } },
            { name: "installDate", kind: "date", required: true, label: { ko: "설치(예정)일", en: "Installation date" } },
            { name: "docs", kind: "file", required: true, multiple: true, accept: ".pdf,.jpg,.jpeg,.png", label: { ko: "제출 서류", en: "Documents" }, help: { ko: "시공확인서, 설치 사진(배기통 포함) 등 — 여러 개 첨부 가능", en: "Installation certificate and photos (incl. flue) — multiple files OK" } },
          ],
        },
      ]}
      consent={STANDARD_CONSENT}
      submitLabel={{ ko: "서류 제출하기", en: "Submit documents" }}
      successNote={{ ko: "서류 검토 후 완성검사 일정을 연락드립니다. 검사 전까지 보일러를 사용하지 마세요.", en: "After review we'll call to schedule the completion inspection. Don't use the boiler until then." }}
    />
  );
}

/* ═══ 공급중지·재공급 ═══════════════════════════════════════════ */

export function Supply() {
  return (
    <RequestForm
      type={(v) => (v.kind === "resume" ? "supply-resume" : "supply-stop")}
      applicant={{ customerNo: "required" }}
      sections={[
        {
          title: { ko: "요청 내용", en: "Request" },
          fields: [
            {
              name: "kind",
              kind: "radio",
              required: true,
              columns: 2,
              label: { ko: "구분", en: "Type" },
              options: [
                { value: "stop", label: { ko: "공급중지", en: "Stop supply" }, sub: { ko: "장기 부재·공사 등", en: "Long absence, works" } },
                { value: "resume", label: { ko: "재공급", en: "Resume supply" }, sub: { ko: "다시 사용할 때", en: "When you're back" } },
              ],
            },
            {
              name: "reason",
              kind: "select",
              required: true,
              when: (v) => v.kind === "stop",
              label: { ko: "중지 사유", en: "Reason" },
              options: [
                { value: "absence", label: { ko: "장기 부재", en: "Long absence" } },
                { value: "works", label: { ko: "인테리어·공사", en: "Renovation" } },
                { value: "vacant", label: { ko: "공실", en: "Vacant property" } },
                { value: "other", label: { ko: "기타", en: "Other" } },
              ],
            },
            { name: "until", kind: "date", when: (v) => v.kind === "stop", label: { ko: "재공급 예정일 (선택)", en: "Expected resume date (optional)" } },
            { name: "memo", kind: "textarea", maxLength: 300, label: { ko: "요청 사항", en: "Notes" } },
          ],
        },
      ]}
      schedule={{ help: { ko: "중지·재공급 모두 계량기 밸브 작업을 위해 방문합니다.", en: "Both need a visit to work the meter valve." } }}
      consent={STANDARD_CONSENT}
      submitLabel={{ ko: "방문 신청하기", en: "Book a visit" }}
    />
  );
}

/* ═══ 도시가스 공급 절차 ═════════════════════════════════════════ */

const PROCESS: { title: Bi; body: Bi; time: Bi }[] = [
  { title: { ko: "공급 상담·신청", en: "Enquiry & application" }, body: { ko: "공급 가능 여부와 예상 공사비를 상담하고 신청서를 제출합니다.", en: "Check availability and estimated cost, then submit an application." }, time: { ko: "당일", en: "Same day" } },
  { title: { ko: "현장 조사", en: "Site survey" }, body: { ko: "배관 경로와 계량기 위치를 확인합니다.", en: "We confirm the pipe route and meter location." }, time: { ko: "3~5일", en: "3–5 days" } },
  { title: { ko: "시설분담금 납부", en: "Connection fee" }, body: { ko: "공급관 설치비 중 고객 부담분을 납부합니다.", en: "Pay the customer share of the supply-pipe cost." }, time: { ko: "1~2일", en: "1–2 days" } },
  { title: { ko: "배관 공사·검사", en: "Pipework & inspection" }, body: { ko: "공급관과 내관을 시공하고 한국가스안전공사 검사를 받습니다.", en: "Supply and internal pipes are installed and inspected by KGS." }, time: { ko: "2~4주", en: "2–4 weeks" } },
  { title: { ko: "사용계약·개통", en: "Contract & first use" }, body: { ko: "사용계약을 맺고 계량기를 설치해 가스를 개통합니다.", en: "Sign the contract, fit the meter and turn the gas on." }, time: { ko: "1일", en: "1 day" } },
];

export function Process() {
  const t = useT();
  const { lang } = useLang();
  return (
    <div className="space-y-6">
      <Card>
        <ol className="relative space-y-6 border-l-2 border-ink-100 pl-6">
          {PROCESS.map((s, i) => (
            <li key={s.title.ko} className="relative">
              <span className="absolute -left-[2.15rem] flex size-8 items-center justify-center rounded-full sk-gradient text-sm font-extrabold text-white">{i + 1}</span>
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-[1rem] font-extrabold text-ink-900">{pick(s.title, lang)}</h3>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[0.75rem] font-bold text-ink-600">{pick(s.time, lang)}</span>
              </div>
              <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-600">{pick(s.body, lang)}</p>
            </li>
          ))}
        </ol>
      </Card>
      <Card>
        <SectionTitle>{t("준비 서류", "What you'll need")}</SectionTitle>
        <ul className="space-y-2 text-[0.875rem] text-ink-700">
          {[
            t("건물 등기부등본 또는 건축물대장", "Property register or building ledger"),
            t("신청인 신분증 사본", "Applicant's ID"),
            t("공동주택은 관리사무소 동의서", "Management office consent (apartments)"),
          ].map((x) => (
            <li key={x} className="flex items-start gap-2"><IconCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />{x}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href="/support/qna" className="inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl sk-gradient px-5 font-extrabold text-white">
            {t("공급 상담 신청 (온라인 상담)", "Ask about supply (online Q&A)")} <IconArrowRight className="size-4" />
          </Link>
          <a href="tel:1800-0098" className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-ink-200 px-5 font-bold text-ink-700">1800-0098</a>
        </div>
      </Card>
      <SampleNote />
    </div>
  );
}
