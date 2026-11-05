"use client";

import { useState, type ReactNode } from "react";
import { dateLabel, digitsOnly, formatCustomerNo, lookupAccount, SLOTS, slotLabel } from "@/lib/data";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { useAuth, type User } from "@/lib/auth";
import { REQUEST_META, useStore, type RequestType, type ServiceRequest } from "@/lib/store";
import {
  Card,
  Checkbox,
  Field,
  focusFirstError,
  inputCls,
  isCustomerNo,
  isEmail,
  isIsoDate,
  isTel,
  maxVisitDate,
  minVisitDate,
  PrimaryButton,
  RadioCards,
  Receipt,
  SectionTitle,
  visitDateError,
} from "./form";
import { IconArrowRight, IconClose, IconUpload } from "./Icons";
import DateInput from "./DateInput";

type Opt = { value: string; label: Bi; sub?: Bi };

export type FieldSpec = {
  name: string;
  kind: "text" | "tel" | "email" | "textarea" | "select" | "radio" | "date" | "file" | "number";
  label: Bi;
  required?: boolean;
  help?: Bi;
  placeholder?: Bi;
  options?: Opt[];
  columns?: 2 | 3 | 4;
  accept?: string;
  multiple?: boolean;
  maxLength?: number;
  min?: string;
  max?: string;
  validate?: (v: string, all: Record<string, string>) => Bi | null;
  /** Only show (and validate) the field when this returns true. */
  when?: (all: Record<string, string>) => boolean;
};

export type RequestFormProps = {
  type: RequestType | ((values: Record<string, string>) => RequestType);
  sections: { title: Bi; sub?: Bi; fields: FieldSpec[] }[];
  /** Applicant block. `customerNo` controls whether the number is asked for. */
  applicant?: { addressLabel?: Bi; customerNo?: "required" | "optional" | false; hideAddress?: boolean };
  /** Lets the reporter stay anonymous (ethics hotline). */
  anonymousOption?: boolean;
  schedule?: { title?: Bi; help?: Bi } | false;
  consent?: Bi;
  submitLabel?: Bi;
  successTitle?: Bi;
  successNote?: Bi;
  intro?: ReactNode;
};

const MAX_FILE = 10 * 1024 * 1024;

/**
 * Remount the inner form once the session is known so a signed-in member's
 * details pre-fill without a state-syncing effect.
 */
export default function RequestForm(props: RequestFormProps) {
  const { user, ready } = useAuth();
  return <Inner key={ready ? (user?.memberId ?? "guest") : "loading"} user={user} {...props} />;
}

function Inner({
  user,
  type,
  sections,
  applicant = { customerNo: "optional" },
  anonymousOption,
  schedule = false,
  consent,
  submitLabel,
  successTitle,
  successNote,
  intro,
}: RequestFormProps & { user: User | null }) {
  const { lang } = useLang();
  const t = useT();
  const { addRequest } = useStore();

  const [name, setName] = useState(user ? pick(user.name, lang) : "");
  const [tel, setTel] = useState(user?.tel ?? "");
  const [addr, setAddr] = useState(user ? pick(user.address, lang) : "");
  const [customerNo, setCustomerNo] = useState(user?.customerNo ?? "");
  const [anonymous, setAnonymous] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<ServiceRequest | null>(null);

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));
  const visible = (f: FieldSpec) => (f.when ? f.when(values) : true);
  const optLabel = (f: FieldSpec, v: string) => {
    const o = f.options?.find((x) => x.value === v);
    return o ? pick(o.label, lang) : v;
  };

  function validate() {
    const e: Record<string, string> = {};
    if (applicant) {
      if (!anonymous) {
        if (name.trim().length < 2) e.name = t("성함을 2자 이상 입력해 주세요.", "Enter a name of at least 2 characters.");
        if (!isTel(tel)) e.tel = t("연락처를 010-0000-0000 형식으로 입력해 주세요.", "Enter a phone number like 010-0000-0000.");
      } else if (tel && !isTel(tel)) {
        e.tel = t("연락처 형식을 확인해 주세요.", "Check the phone number format.");
      }
      if (!applicant.hideAddress && !anonymous && !addr.trim()) e.addr = t("주소를 입력해 주세요.", "Please enter the address.");
      if (applicant.customerNo) {
        const has = customerNo.trim().length > 0;
        if (applicant.customerNo === "required" && !has) {
          e.customerNo = t("고객번호를 입력해 주세요.", "Please enter your customer number.");
        } else if (has && !isCustomerNo(customerNo)) {
          e.customerNo = t("고객번호는 숫자 10자리입니다.", "A customer number has 10 digits.");
        } else if (has && !lookupAccount(customerNo)) {
          e.customerNo = t("등록되지 않은 고객번호입니다.", "That customer number isn't registered.");
        }
      }
    }
    for (const s of sections) {
      for (const f of s.fields) {
        if (!visible(f)) continue;
        const v = (values[f.name] ?? "").trim();
        if (f.kind === "file") {
          const list = files[f.name] ?? [];
          if (f.required && list.length === 0) e[f.name] = t("파일을 첨부해 주세요.", "Please attach a file.");
          continue;
        }
        if (f.required && !v) {
          e[f.name] =
            f.kind === "select" || f.kind === "radio"
              ? t("항목을 선택해 주세요.", "Please choose an option.")
              : t("내용을 입력해 주세요.", "This field is required.");
          continue;
        }
        if (v && f.kind === "date" && !isIsoDate(v)) {
          e[f.name] = t("날짜를 연도. 월. 일. 형식으로 정확히 입력해 주세요.", "Enter a valid date as YYYY. MM. DD.");
          continue;
        }
        if (v && f.kind === "tel" && !isTel(v)) e[f.name] = t("연락처 형식을 확인해 주세요.", "Check the phone number format.");
        if (v && f.kind === "email" && !isEmail(v)) e[f.name] = t("이메일 형식을 확인해 주세요.", "Check the email format.");
        const custom = v && f.validate ? f.validate(v, values) : null;
        if (custom) e[f.name] = pick(custom, lang);
      }
    }
    if (schedule) {
      const de = visitDateError(date);
      if (de) e.date = pick(de, lang);
      if (!slot) e.slot = t("방문 시간대를 선택해 주세요.", "Please choose a time slot.");
    }
    if (consent && !agree) e.agree = t("개인정보 수집·이용에 동의해 주세요.", "Please agree to the use of personal data.");
    return e;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirstError(e);
      return;
    }
    const reqType = typeof type === "function" ? type(values) : type;
    const fieldVals: Record<string, string> = {};
    for (const s of sections) for (const f of s.fields) if (visible(f) && f.kind !== "file" && values[f.name]) fieldVals[f.name] = values[f.name];
    const fileNames = Object.values(files)
      .flat()
      .map((f) => `${f.name} (${Math.max(1, Math.round(f.size / 1024))}KB)`);
    const rec = addRequest({
      type: reqType,
      name: anonymous ? t("익명", "Anonymous") : name.trim(),
      tel: tel.trim(),
      addr: applicant && !applicant.hideAddress && !anonymous ? addr.trim() : undefined,
      customerNo: customerNo ? digitsOnly(customerNo) : undefined,
      date: schedule ? date : undefined,
      slot: schedule ? slot : undefined,
      fields: fieldVals,
      files: fileNames.length ? fileNames : undefined,
    });
    setDone(rec);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addFiles(f: FieldSpec, list: FileList | null) {
    if (!list) return;
    const ok: File[] = [];
    let err = "";
    for (const file of Array.from(list)) {
      const accepted = !f.accept || f.accept.split(",").some((a) => file.name.toLowerCase().endsWith(a.trim().replace("*", "")));
      if (!accepted) err = t("허용되지 않는 파일 형식입니다.", "That file type isn't allowed.");
      else if (file.size > MAX_FILE) err = t("파일은 10MB 이하만 첨부할 수 있습니다.", "Files must be 10MB or smaller.");
      else ok.push(file);
    }
    // A rejected pick must not discard files that were already accepted.
    if (ok.length) setFiles((s) => ({ ...s, [f.name]: f.multiple ? [...(s[f.name] ?? []), ...ok] : ok.slice(0, 1) }));
    setErrors((s) => {
      const n = { ...s };
      if (err) n[f.name] = err;
      else delete n[f.name];
      return n;
    });
  }

  if (done) {
    const meta = REQUEST_META[done.type];
    const rows: [ReactNode, ReactNode][] = [[t("신청 구분", "Type"), pick(meta.label, lang)]];
    if (applicant) {
      rows.push([t("신청인", "Applicant"), done.name]);
      if (done.tel) rows.push([t("연락처", "Phone"), done.tel]);
      if (done.addr) rows.push([t("주소", "Address"), done.addr]);
      if (done.customerNo) rows.push([t("고객번호", "Customer no."), formatCustomerNo(done.customerNo)]);
    }
    for (const s of sections)
      for (const f of s.fields) {
        const v = done.fields[f.name];
        if (!v) continue;
        const shown = f.kind === "select" || f.kind === "radio" ? optLabel(f, v) : f.kind === "date" ? dateLabel(v, lang) : v;
        rows.push([pick(f.label, lang), shown.length > 80 ? `${shown.slice(0, 80)}…` : shown]);
      }
    if (done.files?.length) rows.push([t("첨부파일", "Attachments"), done.files.join(", ")]);
    if (done.date) rows.push([t("방문 희망", "Preferred visit"), `${dateLabel(done.date, lang)} · ${slotLabel(done.slot, lang)}`]);

    return (
      <Receipt
        title={successTitle ? pick(successTitle, lang) : t(`${pick(meta.label, lang)}이 접수되었습니다`, `Your ${pick(meta.label, lang).toLowerCase()} request was received`)}
        id={done.id}
        rows={rows}
        note={
          successNote
            ? pick(successNote, lang)
            : meta.visit
              ? t("담당 서비스센터에서 방문 하루 전 문자로 일정을 다시 안내드립니다.", "Your service center will text you a reminder the day before the visit.")
              : t("담당자가 확인 후 1영업일 안에 연락드립니다.", "We'll contact you within one business day.")
        }
        actions={[
          ...(meta.visit ? [{ label: t("방문예약 확인·변경", "Manage visit"), href: `/move/reservation?id=${done.id}`, primary: true }] : []),
          ...(user ? [{ label: t("마이페이지", "My page"), href: "/mypage", primary: !meta.visit }] : []),
          { label: t("처음으로", "Home"), href: "/" },
        ]}
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {intro}

      {applicant ? (
        <Card>
          <SectionTitle sub={user ? t("회원 정보로 미리 채웠습니다. 필요하면 수정하세요.", "Pre-filled from your account — edit if needed.") : undefined}>
            {t("신청인 정보", "Applicant")}
          </SectionTitle>
          <div className="space-y-5">
            {anonymousOption ? (
              <Checkbox checked={anonymous} onChange={setAnonymous}>
                <strong className="font-bold text-ink-900">{t("익명으로 제보하기", "Report anonymously")}</strong>
                <br />
                {t("이름과 연락처를 남기지 않아도 됩니다. 다만 추가 확인 연락은 드릴 수 없습니다.", "You can leave your name and phone blank, but we won't be able to follow up.")}
              </Checkbox>
            ) : null}
            {!anonymous ? (
              <Field id="name" label={t("성함", "Name")} required error={errors.name}>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls(!!errors.name)} placeholder={t("예) 홍길동", "e.g. Gildong Hong")} />
              </Field>
            ) : null}
            <Field id="tel" label={t("연락처", "Phone")} required={!anonymous} error={errors.tel} help={t("진행 상황을 문자로 안내드립니다.", "We'll text you progress updates.")}>
              <input id="tel" value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" autoComplete="tel" className={inputCls(!!errors.tel)} placeholder="010-1234-5678" />
            </Field>
            {!applicant.hideAddress && !anonymous ? (
              <Field id="addr" label={applicant.addressLabel ? pick(applicant.addressLabel, lang) : t("주소", "Address")} required error={errors.addr} help={t("동·호수까지 정확히 적어주세요.", "Include building and unit number.")}>
                <input id="addr" value={addr} onChange={(e) => setAddr(e.target.value)} autoComplete="street-address" className={inputCls(!!errors.addr)} placeholder={t("예) 포항시 남구 대이로 89, 101동 1203호", "e.g. 101-1203, 89 Daei-ro, Nam-gu, Pohang")} />
              </Field>
            ) : null}
            {applicant.customerNo ? (
              <Field id="customerNo" label={t("고객번호", "Customer number")} required={applicant.customerNo === "required"} error={errors.customerNo} help={t("청구서 오른쪽 위 10자리 숫자", "The 10 digits at the top right of your bill")}>
                <input id="customerNo" value={customerNo} onChange={(e) => setCustomerNo(e.target.value)} inputMode="numeric" className={inputCls(!!errors.customerNo)} placeholder="1234-567-890" />
              </Field>
            ) : null}
          </div>
        </Card>
      ) : null}

      {sections.map((s) => (
        <Card key={s.title.ko}>
          <SectionTitle sub={s.sub ? pick(s.sub, lang) : undefined}>{pick(s.title, lang)}</SectionTitle>
          <div className="space-y-5">
            {s.fields.filter(visible).map((f) => {
              const err = errors[f.name];
              const label = pick(f.label, lang);
              const help = f.help ? pick(f.help, lang) : undefined;
              const ph = f.placeholder ? pick(f.placeholder, lang) : undefined;
              const v = values[f.name] ?? "";
              if (f.kind === "radio") {
                return (
                  <fieldset key={f.name} data-field={f.name}>
                    <legend className="text-[0.875rem] font-bold text-ink-800">
                      {label} {f.required ? <span className="text-sk-red-600">{t("(필수)", "(required)")}</span> : null}
                    </legend>
                    {help ? <p className="mt-1 text-[0.8125rem] text-ink-500">{help}</p> : null}
                    <div className="mt-2.5">
                      <RadioCards name={f.name} value={v} onChange={(x) => set(f.name, x)} options={f.options ?? []} columns={f.columns} invalid={!!err} />
                    </div>
                    {err ? <p role="alert" className="mt-2 text-[0.8125rem] font-bold text-sk-red-600">{err}</p> : null}
                  </fieldset>
                );
              }
              if (f.kind === "file") {
                const list = files[f.name] ?? [];
                return (
                  <Field key={f.name} id={f.name} label={label} required={f.required} help={help} error={err}>
                    <label className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition hover:border-sk-red-300 hover:bg-sk-red-50/40 ${err ? "border-sk-red-400" : "border-ink-300"}`}>
                      <IconUpload className="size-6 text-ink-400" />
                      <span className="text-[0.875rem] font-bold text-ink-700">{t("파일 선택", "Choose file")}</span>
                      <span className="text-[0.75rem] text-ink-400">{f.accept ? f.accept.replaceAll(",", " · ") : ""} · {t("10MB 이하", "max 10MB")}</span>
                      <input id={f.name} type="file" accept={f.accept} multiple={f.multiple} className="sr-only" onChange={(e) => { addFiles(f, e.target.files); e.target.value = ""; }} />
                    </label>
                    {list.length ? (
                      <ul className="mt-2 space-y-1.5">
                        {list.map((file, i) => (
                          <li key={i} className="flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2 text-[0.8125rem]">
                            <span className="min-w-0 flex-1 truncate font-semibold text-ink-800">{file.name}</span>
                            <span className="shrink-0 text-ink-400">{Math.max(1, Math.round(file.size / 1024))}KB</span>
                            <button type="button" aria-label={t("파일 삭제", "Remove file")} onClick={() => setFiles((s) => ({ ...s, [f.name]: (s[f.name] ?? []).filter((_, j) => j !== i) }))} className="flex size-7 items-center justify-center rounded-full text-ink-400 hover:bg-white hover:text-ink-700">
                              <IconClose className="size-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </Field>
                );
              }
              return (
                <Field key={f.name} id={f.name} label={label} required={f.required} help={help} error={err}>
                  {f.kind === "textarea" ? (
                    <>
                      <textarea id={f.name} value={v} maxLength={f.maxLength} onChange={(e) => set(f.name, e.target.value)} rows={5} className={`${inputCls(!!err)} min-h-32 resize-y`} placeholder={ph} />
                      {f.maxLength ? <p className="mt-1 text-right text-[0.75rem] tabular-nums text-ink-400">{v.length} / {f.maxLength}</p> : null}
                    </>
                  ) : f.kind === "date" ? (
                    <DateInput id={f.name} value={v} min={f.min} max={f.max} onChange={(iso) => set(f.name, iso)} invalid={!!err} />
                  ) : f.kind === "select" ? (
                    <select id={f.name} value={v} onChange={(e) => set(f.name, e.target.value)} className={inputCls(!!err)}>
                      <option value="">{t("선택해 주세요", "Select…")}</option>
                      {(f.options ?? []).map((o) => (
                        <option key={o.value} value={o.value}>{pick(o.label, lang)}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={f.name}
                      type={f.kind === "number" ? "text" : f.kind}
                      inputMode={f.kind === "number" ? "numeric" : f.kind === "tel" ? "tel" : undefined}
                      value={v}
                      min={f.min}
                      max={f.max}
                      maxLength={f.maxLength}
                      onChange={(e) => set(f.name, f.kind === "number" ? e.target.value.replace(/[^\d]/g, "") : e.target.value)}
                      className={inputCls(!!err)}
                      placeholder={ph}
                    />
                  )}
                </Field>
              );
            })}
          </div>
        </Card>
      ))}

      {schedule ? (
        <Card>
          <SectionTitle sub={schedule.help ? pick(schedule.help, lang) : t("내일부터 60일 이내, 일요일 제외", "From tomorrow, within 60 days, no Sundays")}>
            {schedule.title ? pick(schedule.title, lang) : t("방문 희망 일정", "Preferred visit")}
          </SectionTitle>
          <div className="space-y-5">
            <Field id="date" label={t("방문 희망일", "Visit date")} required error={errors.date}>
              <DateInput id="date" value={date} min={minVisitDate()} max={maxVisitDate()} onChange={setDate} invalid={!!errors.date} />
            </Field>
            <fieldset data-field="slot">
              <legend className="text-[0.875rem] font-bold text-ink-800">
                {t("방문 시간대", "Time slot")} <span className="text-sk-red-600">{t("(필수)", "(required)")}</span>
              </legend>
              <div className="mt-2.5">
                <RadioCards name="slot" value={slot} onChange={setSlot} options={SLOTS.map((s) => ({ value: s.key, label: s.label }))} invalid={!!errors.slot} />
              </div>
              {errors.slot ? <p role="alert" className="mt-2 text-[0.8125rem] font-bold text-sk-red-600">{errors.slot}</p> : null}
            </fieldset>
          </div>
        </Card>
      ) : null}

      {consent ? (
        <div data-field="agree">
          <Checkbox checked={agree} onChange={setAgree} invalid={!!errors.agree}>
            <strong className="font-extrabold text-ink-900">{t("개인정보 수집·이용 동의", "Consent to use of personal data")}</strong>
            <span className="text-sk-red-600"> {t("(필수)", "(required)")}</span>
            <br />
            {pick(consent, lang)}
          </Checkbox>
          {errors.agree ? <p role="alert" className="mt-2 text-[0.8125rem] font-bold text-sk-red-600">{errors.agree}</p> : null}
        </div>
      ) : null}

      {Object.keys(errors).length ? (
        <p role="alert" className="rounded-xl bg-sk-red-50 px-4 py-3 text-[0.875rem] font-bold text-sk-red-700">
          {t(`입력 내용을 확인해 주세요 (${Object.keys(errors).length}건).`, `Please fix ${Object.keys(errors).length} field(s).`)}
        </p>
      ) : null}

      <PrimaryButton className="w-full">
        {submitLabel ? pick(submitLabel, lang) : t("신청하기", "Submit")} <IconArrowRight className="size-4" />
      </PrimaryButton>
    </form>
  );
}

/** Standard consent copy reused by most request forms. */
export const STANDARD_CONSENT: Bi = {
  ko: "성함·연락처·주소는 신청 처리와 방문 안내 목적으로만 쓰이며, 처리 완료 후 관계 법령이 정한 기간까지 보관됩니다.",
  en: "Your name, phone and address are used only to process this request and arrange visits, and are kept for the period required by law.",
};
