"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CERT_KINDS, dateLabel, digitsOnly, institutionLabel, lookupAccount, paymentMethodLabel, periodLabel, SELF_CHECK, slotLabel, stamp, won } from "@/lib/data";
import { pick, useLang, useT } from "@/lib/i18n";
import { useAuth, type User } from "@/lib/auth";
import { REQUEST_META, requestStatus, useStore } from "@/lib/store";
import BillStatement from "../BillStatement";
import RequireLogin from "../RequireLogin";
import { StatusBadge } from "./use";
import {
  Card,
  Checkbox,
  ErrorText,
  Field,
  focusFirstError,
  inputCls,
  isCustomerNo,
  isEmail,
  isTel,
  PrimaryButton,
  SectionTitle,
} from "../form";
import { IconArrowRight, IconCheck, IconUser } from "../Icons";

/* ═══ 회원가입 ═══════════════════════════════════════════════════ */

const ID_RE = /^[a-z][a-z0-9]{3,15}$/;

function pwScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-zA-Z]/.test(pw) && /\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
}

export function Signup() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const rawNext = params.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";
  const { signup, idTaken, user, ready } = useAuth();
  const [f, setF] = useState({ id: "", pw: "", pw2: "", name: "", tel: "", email: "", customerNo: "" });
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  if (ready && user) {
    return (
      <Card className="text-center">
        <p className="text-[0.9375rem] text-ink-700">{t("이미 로그인되어 있습니다.", "You're already signed in.")}</p>
        <Link href="/mypage" className="mt-4 inline-flex min-h-12 items-center gap-1.5 rounded-xl sk-gradient px-6 font-extrabold text-white">{t("마이페이지로", "Go to My page")} <IconArrowRight className="size-4" /></Link>
      </Card>
    );
  }

  const idState = !f.id ? null : !ID_RE.test(f.id) ? "format" : idTaken(f.id) ? "taken" : "ok";
  const score = pwScore(f.pw);
  const all = terms && privacy && marketing;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!ID_RE.test(f.id)) er["su-id"] = t("영문 소문자로 시작하는 4~16자 (영문 소문자·숫자)로 입력해 주세요.", "4–16 lowercase letters or digits, starting with a letter.");
    else if (idTaken(f.id)) er["su-id"] = t("이미 사용 중인 아이디입니다.", "That ID is taken.");
    if (f.pw.length < 8 || !/[a-zA-Z]/.test(f.pw) || !/\d/.test(f.pw)) er["su-pw"] = t("비밀번호는 영문과 숫자를 섞어 8자 이상이어야 합니다.", "Use at least 8 characters with letters and numbers.");
    else if (f.pw.toLowerCase().includes(f.id.toLowerCase()) && f.id) er["su-pw"] = t("비밀번호에 아이디를 넣을 수 없습니다.", "The password can't contain your ID.");
    if (f.pw2 !== f.pw || !f.pw2) er["su-pw2"] = t("비밀번호가 일치하지 않습니다.", "Passwords don't match.");
    if (f.name.trim().length < 2) er["su-name"] = t("이름을 입력해 주세요.", "Enter your name.");
    if (!isTel(f.tel)) er["su-tel"] = t("휴대폰 번호를 010-0000-0000 형식으로 입력해 주세요.", "Enter a mobile number like 010-0000-0000.");
    if (!isEmail(f.email)) er["su-email"] = t("이메일 형식을 확인해 주세요.", "Check the email format.");
    if (!isCustomerNo(f.customerNo)) er["su-cust"] = t("고객번호 10자리를 입력해 주세요.", "Enter your 10-digit customer number.");
    else if (!lookupAccount(f.customerNo)) er["su-cust"] = t("등록되지 않은 고객번호입니다.", "That customer number isn't registered.");
    if (!terms || !privacy) er["su-agree"] = t("필수 약관에 동의해 주세요.", "Please accept the required terms.");
    setErrors(er);
    if (Object.keys(er).length) return focusFirstError(er);
    setBusy(true);
    const res = await signup({ id: f.id, password: f.pw, name: f.name, tel: f.tel, email: f.email, customerNo: f.customerNo });
    setBusy(false);
    if (res === "taken") return setErrors({ "su-id": t("이미 사용 중인 아이디입니다.", "That ID is taken.") });
    if (res === "no-account") return setErrors({ "su-cust": t("등록되지 않은 고객번호입니다.", "That customer number isn't registered.") });
    router.push(next === "/" ? "/mypage?welcome=1" : next);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Card>
        <SectionTitle>{t("계정 정보", "Account")}</SectionTitle>
        <div className="space-y-5">
          <Field id="su-id" label={t("아이디", "ID")} required error={errors["su-id"]} help={t("영문 소문자로 시작, 4~16자", "Starts with a letter, 4–16 characters")}>
            <input id="su-id" value={f.id} onChange={(e) => setF((s) => ({ ...s, id: e.target.value.toLowerCase() }))} autoComplete="username" className={inputCls(!!errors["su-id"])} />
            {idState && !errors["su-id"] ? (
              <p data-id-state={idState} className={`mt-1.5 text-[0.8125rem] font-bold ${idState === "ok" ? "text-emerald-600" : "text-sk-orange-600"}`}>
                {idState === "ok" ? t("사용할 수 있는 아이디입니다.", "This ID is available.") : idState === "taken" ? t("이미 사용 중인 아이디입니다.", "That ID is taken.") : t("형식에 맞지 않습니다.", "Doesn't match the format.")}
              </p>
            ) : null}
          </Field>
          <Field id="su-pw" label={t("비밀번호", "Password")} required error={errors["su-pw"]} help={t("영문·숫자 포함 8자 이상", "8+ characters with letters and numbers")}>
            <input id="su-pw" type="password" value={f.pw} onChange={set("pw")} autoComplete="new-password" className={inputCls(!!errors["su-pw"])} />
            {f.pw ? (
              <div className="mt-2 flex items-center gap-2" aria-live="polite">
                <div className="flex flex-1 gap-1" aria-hidden>
                  {[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < score ? (score >= 3 ? "bg-emerald-500" : "bg-sk-orange-400") : "bg-ink-200"}`} />)}
                </div>
                <span className="text-[0.75rem] font-bold text-ink-500">{score >= 3 ? t("강함", "Strong") : score === 2 ? t("보통", "Fair") : t("약함", "Weak")}</span>
              </div>
            ) : null}
          </Field>
          <Field id="su-pw2" label={t("비밀번호 확인", "Confirm password")} required error={errors["su-pw2"]}>
            <input id="su-pw2" type="password" value={f.pw2} onChange={set("pw2")} autoComplete="new-password" className={inputCls(!!errors["su-pw2"])} />
          </Field>
        </div>
      </Card>
      <Card>
        <SectionTitle>{t("회원 정보", "About you")}</SectionTitle>
        <div className="space-y-5">
          <Field id="su-name" label={t("이름", "Name")} required error={errors["su-name"]}>
            <input id="su-name" value={f.name} onChange={set("name")} autoComplete="name" className={inputCls(!!errors["su-name"])} />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="su-tel" label={t("휴대폰", "Mobile")} required error={errors["su-tel"]}>
              <input id="su-tel" value={f.tel} onChange={set("tel")} inputMode="tel" autoComplete="tel" className={inputCls(!!errors["su-tel"])} placeholder="010-1234-5678" />
            </Field>
            <Field id="su-email" label={t("이메일", "Email")} required error={errors["su-email"]}>
              <input id="su-email" type="email" value={f.email} onChange={set("email")} autoComplete="email" className={inputCls(!!errors["su-email"])} />
            </Field>
          </div>
          <Field id="su-cust" label={t("고객번호 연결", "Link customer number")} required error={errors["su-cust"]} help={t("청구서 오른쪽 위 10자리. 연결하면 로그인만으로 요금·사용량을 볼 수 있습니다.", "The 10 digits on your bill. Linking shows your bill and usage when you sign in.")}>
            <input id="su-cust" value={f.customerNo} onChange={set("customerNo")} inputMode="numeric" className={inputCls(!!errors["su-cust"])} placeholder="0000-000-000" />
          </Field>
        </div>
      </Card>
      <Card>
        <div data-field="su-agree" className="space-y-2">
          <Checkbox checked={all} onChange={(v) => { setTerms(v); setPrivacy(v); setMarketing(v); }}>
            <strong className="font-extrabold text-ink-900">{t("전체 동의", "Agree to all")}</strong>
          </Checkbox>
          <Checkbox checked={terms} onChange={setTerms} invalid={!!errors["su-agree"] && !terms}>
            {t("[필수] 이용약관 동의", "[Required] Terms of use")} · <Link href="/policy/terms" target="_blank" className="font-bold underline">{t("보기", "View")}</Link>
          </Checkbox>
          <Checkbox checked={privacy} onChange={setPrivacy} invalid={!!errors["su-agree"] && !privacy}>
            {t("[필수] 개인정보 수집·이용 동의", "[Required] Collection and use of personal data")} · <Link href="/policy/privacy" target="_blank" className="font-bold underline">{t("보기", "View")}</Link>
          </Checkbox>
          <Checkbox checked={marketing} onChange={setMarketing}>{t("[선택] 혜택·이벤트 안내 수신", "[Optional] Offers and events")}</Checkbox>
          {errors["su-agree"] ? <ErrorText>{errors["su-agree"]}</ErrorText> : null}
        </div>
      </Card>
      <PrimaryButton disabled={busy} className="w-full">{busy ? t("가입 중…", "Signing up…") : t("가입하기", "Sign up")}</PrimaryButton>
      <p className="text-center text-[0.875rem] text-ink-500">
        {t("이미 회원이신가요? ", "Already a member? ")}
        <Link href="/login" className="font-bold text-sk-red-600 underline underline-offset-2">{t("로그인", "Log in")}</Link>
      </p>
    </form>
  );
}

/* ═══ 마이페이지 ═════════════════════════════════════════════════ */

export function MyPage() {
  return <RequireLogin>{(user) => <MyPageInner user={user} />}</RequireLogin>;
}

function MyPageInner({ user }: { user: User }) {
  const t = useT();
  const { lang } = useLang();
  const router = useRouter();
  const welcome = useSearchParams().get("welcome") === "1";
  const { logout, updateProfile, deleteAccount } = useAuth();
  const { state } = useStore();
  const [editing, setEditing] = useState(false);
  const [pf, setPf] = useState({ name: pick(user.name, lang), tel: user.tel, email: user.email });
  const [pErr, setPErr] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveOk, setLeaveOk] = useState(false);

  const mine = (tel: string, cust?: string) => digitsOnly(tel) === digitsOnly(user.tel) || cust === user.customerDigits;
  const requests = state.requests.filter((r) => mine(r.tel, r.customerNo));
  const payments = state.payments.filter((p) => p.customerNo === user.customerDigits);
  const readings = state.readings.filter((r) => r.customerNo === user.customerDigits);
  const certs = state.certificates.filter((c) => c.customerNo === user.customerDigits);
  const checks = state.selfChecks.filter((c) => c.memberId === user.memberId);
  const s = state.settings;
  const scheduled = requests.filter((r) => requestStatus(r) === "scheduled").length;

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (pf.name.trim().length < 2) er["pf-name"] = t("이름을 입력해 주세요.", "Enter your name.");
    if (!isTel(pf.tel)) er["pf-tel"] = t("휴대폰 번호 형식을 확인해 주세요.", "Check the mobile format.");
    if (!isEmail(pf.email)) er["pf-email"] = t("이메일 형식을 확인해 주세요.", "Check the email format.");
    setPErr(er);
    if (Object.keys(er).length) return;
    updateProfile({ name: pf.name.trim(), tel: pf.tel.trim(), email: pf.email.trim() });
    setEditing(false);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      {welcome ? (
        <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3.5 font-extrabold text-emerald-700">
          <IconCheck className="size-5" /> {t(`가입을 환영합니다, ${pick(user.name, lang)}님!`, `Welcome aboard, ${pick(user.name, lang)}!`)}
        </p>
      ) : null}

      {/* Profile */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-ink-900 text-white"><IconUser className="size-6" /></span>
            <div>
              <p data-mypage-name className="text-lg font-extrabold text-ink-900">{t(`${pick(user.name, lang)}님`, pick(user.name, lang))}</p>
              <p className="text-[0.8125rem] text-ink-500">ID {user.memberId} · {t(`${dateLabel(user.since, lang)} 가입`, `member since ${dateLabel(user.since, lang)}`)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!user.isDemo && !editing ? (
              <button type="button" onClick={() => { setEditing(true); setSaved(false); }} className="min-h-10 rounded-lg border border-ink-200 px-3 text-[0.8125rem] font-bold text-ink-700">{t("정보 수정", "Edit")}</button>
            ) : null}
            <button type="button" onClick={() => { logout(); router.push("/"); }} className="min-h-10 rounded-lg border border-ink-200 px-3 text-[0.8125rem] font-bold text-ink-700">{t("로그아웃", "Log out")}</button>
          </div>
        </div>
        {editing ? (
          <form onSubmit={saveProfile} noValidate className="mt-5 space-y-4 border-t border-ink-100 pt-5">
            <Field id="pf-name" label={t("이름", "Name")} error={pErr["pf-name"]}><input id="pf-name" value={pf.name} onChange={(e) => setPf((x) => ({ ...x, name: e.target.value }))} className={inputCls(!!pErr["pf-name"])} /></Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="pf-tel" label={t("휴대폰", "Mobile")} error={pErr["pf-tel"]}><input id="pf-tel" value={pf.tel} onChange={(e) => setPf((x) => ({ ...x, tel: e.target.value }))} className={inputCls(!!pErr["pf-tel"])} /></Field>
              <Field id="pf-email" label={t("이메일", "Email")} error={pErr["pf-email"]}><input id="pf-email" value={pf.email} onChange={(e) => setPf((x) => ({ ...x, email: e.target.value }))} className={inputCls(!!pErr["pf-email"])} /></Field>
            </div>
            <div className="flex gap-2">
              <PrimaryButton className="flex-1">{t("저장", "Save")}</PrimaryButton>
              <button type="button" onClick={() => setEditing(false)} className="min-h-13 rounded-xl border-2 border-ink-200 px-5 font-bold text-ink-700">{t("취소", "Cancel")}</button>
            </div>
          </form>
        ) : (
          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-ink-100 pt-5 text-[0.875rem] sm:grid-cols-2">
            {[
              [t("고객번호", "Customer no."), user.customerNo],
              [t("휴대폰", "Mobile"), user.tel],
              [t("이메일", "Email"), user.email],
              [t("사용 주소", "Address"), pick(user.address, lang)],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3"><dt className="w-20 shrink-0 text-ink-500">{k}</dt><dd className="min-w-0 font-bold text-ink-900">{v}</dd></div>
            ))}
          </dl>
        )}
        {saved ? <p role="status" className="mt-3 text-[0.875rem] font-bold text-emerald-700">{t("회원 정보를 저장했습니다.", "Profile saved.")}</p> : null}
        {user.isDemo ? <p className="mt-3 text-[0.75rem] text-ink-400">{t("체험용 계정은 정보 수정·탈퇴를 할 수 없습니다.", "The demo account can't be edited or deleted.")}</p> : null}
      </Card>

      {/* Bill */}
      <BillStatement customerNo={user.customerDigits} own compact />

      {/* Settings summary */}
      <Card>
        <SectionTitle>{t("납부·안내 설정", "Billing & alerts")}</SectionTitle>
        <ul className="divide-y divide-ink-100 text-[0.9375rem]">
          {[
            { k: t("자동이체", "Auto-pay"), v: s.autoPay ? `${institutionLabel(s.autoPay.institution, lang)} ****${s.autoPay.last4}` : t("미등록", "Not set"), href: "/bill/auto" },
            { k: t("청구서", "Bill type"), v: s.billType === "paper" ? t("종이", "Paper") : s.billType === "mobile" ? t("모바일", "Mobile") : `${t("이메일", "Email")} (${s.billEmail})`, href: "/bill/type" },
            { k: t("문자 안내", "Text alerts"), v: s.sms.enabled ? t(`${s.sms.topics.length}개 수신 중`, `${s.sms.topics.length} on`) : t("받지 않음", "Off"), href: "/safety/sms" },
          ].map((row) => (
            <li key={row.k}>
              <Link href={row.href} className="flex items-center gap-3 py-3 hover:opacity-80">
                <span className="w-24 shrink-0 text-ink-500">{row.k}</span>
                <span data-setting={row.k} className="min-w-0 flex-1 truncate font-bold text-ink-900">{row.v}</span>
                <span className="text-[0.8125rem] font-bold text-sk-red-600">{t("변경", "Change")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      {/* Requests */}
      <Card>
        <SectionTitle sub={scheduled ? t(`방문 예정 ${scheduled}건`, `${scheduled} visit(s) scheduled`) : undefined}>{t("신청 내역", "My requests")}</SectionTitle>
        {requests.length ? (
          <ul className="divide-y divide-ink-100">
            {requests.map((r) => (
              <li key={r.id} data-my-request={r.id} className="flex items-center gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-ink-900">{pick(REQUEST_META[r.type].label, lang)}</span>
                  <span className="block text-[0.8125rem] tabular-nums text-ink-500">
                    {r.id} · {r.date ? `${dateLabel(r.date, lang)} ${slotLabel(r.slot, lang)}` : stamp(r.createdAt)}
                  </span>
                </span>
                <StatusBadge r={r} />
                {REQUEST_META[r.type].visit ? (
                  <Link href={`/move/reservation?id=${r.id}`} aria-label={t("관리", "Manage")} className="text-ink-400 hover:text-sk-red-600"><IconArrowRight className="size-4" /></Link>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl bg-ink-50 p-4 text-[0.875rem] text-ink-600">{t("신청 내역이 없습니다.", "No requests yet.")}</p>
        )}
      </Card>

      {/* History */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle>{t("납부 내역", "Payments")}</SectionTitle>
          {payments.length ? (
            <ul className="divide-y divide-ink-100 text-[0.875rem]">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span><span className="block font-bold text-ink-900">{periodLabel(p.period, lang)}</span><span className="block text-[0.75rem] text-ink-500">{paymentMethodLabel(p.method, lang)} · {stamp(p.createdAt)}</span></span>
                  <span className="font-extrabold tabular-nums">{won(p.amount, lang)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-[0.875rem] text-ink-500">{t("온라인 납부 내역이 없습니다.", "No online payments yet.")}</p>}
        </Card>
        <Card>
          <SectionTitle>{t("검침·점검·증명서", "Readings, checks & certificates")}</SectionTitle>
          <ul className="space-y-2 text-[0.875rem]">
            {readings.map((r) => <li key={r.id} className="flex justify-between gap-3"><span>{t("자가검침", "Reading")} · {periodLabel(r.period, lang)}</span><strong className="tabular-nums">{r.reading.toLocaleString()}㎥ ({r.usage}㎥)</strong></li>)}
            {checks.slice(0, 3).map((c) => <li key={c.id} className="flex justify-between gap-3"><span>{t("자율점검", "Self-check")} · {stamp(c.createdAt)}</span><strong>{SELF_CHECK.length - c.failed.length}/{SELF_CHECK.length}</strong></li>)}
            {certs.map((c) => <li key={c.id} className="flex justify-between gap-3"><span>{pick(CERT_KINDS.find((k) => k.id === c.kind)!.label, lang)}</span><strong className="tabular-nums">{c.id}</strong></li>)}
            {!readings.length && !checks.length && !certs.length ? <li className="text-ink-500">{t("기록이 없습니다.", "Nothing yet.")}</li> : null}
          </ul>
        </Card>
      </div>

      {/* Leave */}
      {!user.isDemo ? (
        <Card>
          {leaving ? (
            <div className="space-y-3">
              <p className="font-bold text-sk-red-700">{t("탈퇴하면 회원 정보가 삭제되고 되돌릴 수 없습니다. 요금 납부 기록은 법령에 따라 보관됩니다.", "Leaving deletes your member details permanently. Payment records are kept as the law requires.")}</p>
              <Checkbox checked={leaveOk} onChange={setLeaveOk}>{t("위 내용을 확인했습니다.", "I understand.")}</Checkbox>
              <div className="flex gap-2">
                <button type="button" disabled={!leaveOk} onClick={() => { deleteAccount(); router.push("/"); }} className="min-h-11 rounded-xl bg-sk-red-500 px-5 font-bold text-white disabled:opacity-50">{t("탈퇴하기", "Delete account")}</button>
                <button type="button" onClick={() => setLeaving(false)} className="min-h-11 rounded-xl border-2 border-ink-200 px-5 font-bold">{t("취소", "Cancel")}</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setLeaving(true)} className="text-[0.8125rem] font-bold text-ink-500 underline underline-offset-2">{t("회원 탈퇴", "Delete my account")}</button>
          )}
        </Card>
      ) : null}
    </div>
  );
}
