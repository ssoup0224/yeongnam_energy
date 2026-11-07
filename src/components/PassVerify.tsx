"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { won } from "@/lib/data";
import {
  ageOn,
  CARRIERS,
  CODE_TTL_MS,
  formatTel,
  makeCaptcha,
  makeCode,
  maskTel,
  MAX_ATTEMPTS,
  MAX_SENDS,
  parseBirth,
  RESEND_COOLDOWN_MS,
  VERIFY_TERMS,
  type Carrier,
  type Verified,
} from "@/lib/verify";
import { isTel } from "./form";
import { IconCheck, IconChevron, IconClose, IconLock, IconShield } from "./Icons";

type Mode = "identity" | "otp";
type Step = "form" | "sending" | "code" | "app" | "done" | "locked";

export type PassVerifyProps = {
  open: boolean;
  /**
   * identity — full carrier verification (carrier, name, birthdate, phone…).
   * otp      — a code to a known phone (login 2-step, payment approval).
   */
  mode: Mode;
  /** What the code is for, shown in the window and the text message. */
  purpose: Bi;
  /** Phone to send to (otp mode) or to prefill (identity mode). */
  tel?: string;
  /** otp mode: let the visitor type the number (guests). */
  telEditable?: boolean;
  name?: string;
  /** Payment approval: shows the amount being authorised. */
  amount?: number;
  /** identity mode: reject under-14s (sign-up). */
  minAge?: number;
  onClose: () => void;
  onVerified: (v: Verified) => void;
};

export default function PassVerify(props: PassVerifyProps) {
  if (!props.open) return null;
  // Remounts on every open, so each attempt starts clean.
  return createPortal(<VerifyWindow {...props} />, document.body);
}

function VerifyWindow({ mode, purpose, tel: presetTel = "", telEditable, name: presetName = "", amount, minAge, onClose, onVerified }: PassVerifyProps) {
  const t = useT();
  const { lang } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // identity form
  const [carrier, setCarrier] = useState<Carrier | "MVNO" | "">("");
  const [mvno, setMvno] = useState<Carrier | "">("");
  const [method, setMethod] = useState<"sms" | "app">("sms");
  const [name, setName] = useState(presetName);
  const [birth, setBirth] = useState("");
  const [sex, setSex] = useState("");
  const [tel, setTel] = useState(presetTel);
  const [captcha, setCaptcha] = useState(makeCaptcha);
  const [captchaIn, setCaptchaIn] = useState("");
  const [agree, setAgree] = useState<Record<string, boolean>>({});
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // code / app
  const [step, setStep] = useState<Step>("form");
  const [code, setCode] = useState("");
  const [expires, setExpires] = useState(0);
  const [lastSent, setLastSent] = useState(0);
  const [sends, setSends] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [input, setInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [now, setNow] = useState(0);
  const [sms, setSms] = useState<string | null>(null);
  const [push, setPush] = useState<"none" | "shown" | "approved" | "denied">("none");
  const [result, setResult] = useState<Verified | null>(null);

  const remaining = expires ? Math.max(0, Math.ceil((expires - now) / 1000)) : 0;
  const cooldown = lastSent ? Math.max(0, Math.ceil((lastSent + RESEND_COOLDOWN_MS - now) / 1000)) : 0;
  const mmss = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
  const allAgreed = VERIFY_TERMS.every((x) => agree[x.id]);
  const busy = step === "sending";

  // Tick while a code or push request is live.
  useEffect(() => {
    if (!expires) return;
    const i = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(i);
  }, [expires]);

  // Escape closes (except mid-send); lock page scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
    };
  }, [busy, onClose]);

  useEffect(() => {
    box.current?.querySelector<HTMLElement>("[data-autofocus], button:not([data-close]), input")?.focus();
  }, [step]);

  // Auto-hide the demo text after a while.
  useEffect(() => {
    if (!sms) return;
    const h = window.setTimeout(() => setSms(null), 15000);
    return () => window.clearTimeout(h);
  }, [sms]);

  const carrierFinal: Carrier | "" = carrier === "MVNO" ? mvno : carrier;
  const sentTo = mode === "otp" && !telEditable ? presetTel : tel;

  function sendCode(isResend = false) {
    if (sends >= MAX_SENDS) {
      setCodeError(t("재전송 횟수를 초과했습니다. 잠시 후 처음부터 다시 진행해 주세요.", "Too many resends. Please start over in a moment."));
      return;
    }
    const c = makeCode();
    const at = Date.now();
    setCode(c);
    setSends((n) => n + 1);
    setLastSent(at);
    setExpires(at + CODE_TTL_MS);
    setNow(at);
    setInput("");
    if (isResend) setCodeError("");
    setSms(null);
    // The "text" arrives a moment later, like a real one.
    window.setTimeout(() => setSms(c), 1100);
    if (isResend) setAttempts(0);
  }

  function validateIdentity() {
    const er: Record<string, string> = {};
    if (!carrierFinal) er.carrier = t("통신사를 선택해 주세요.", "Choose your carrier.");
    if (name.trim().length < 2) er.name = t("이름을 입력해 주세요.", "Enter your name.");
    const b = parseBirth(birth, sex);
    if ("error" in b) {
      er.birth =
        b.error === "format"
          ? t("생년월일 6자리와 뒷자리 첫 숫자를 입력해 주세요.", "Enter your 6-digit birthdate and the next digit.")
          : t("생년월일을 다시 확인해 주세요.", "Check your birthdate.");
    } else if (minAge && ageOn(b.iso) < minAge) {
      er.birth = t(`만 ${minAge}세 미만은 법정대리인 동의가 필요해 온라인 가입이 어렵습니다.`, `Under-${minAge}s need a guardian's consent and can't sign up online.`);
    }
    if (!isTel(tel)) er.tel = t("휴대폰 번호를 정확히 입력해 주세요.", "Enter a valid mobile number.");
    if (method === "sms" && captchaIn !== captcha) er.captcha = t("보안문자가 일치하지 않습니다.", "The security code doesn't match.");
    if (!allAgreed) er.agree = t("필수 약관에 모두 동의해 주세요.", "Please accept all required terms.");
    return er;
  }

  function request() {
    if (mode === "identity") {
      const er = validateIdentity();
      setErrors(er);
      if (Object.keys(er).length) {
        if (er.captcha) {
          setCaptcha(makeCaptcha());
          setCaptchaIn("");
        }
        return;
      }
    } else if (telEditable && !isTel(tel)) {
      setErrors({ tel: t("휴대폰 번호를 정확히 입력해 주세요.", "Enter a valid mobile number.") });
      return;
    }
    setErrors({});
    setStep("sending");
    window.setTimeout(() => {
      if (mode === "identity" && method === "app") {
        const at = Date.now();
        setExpires(at + CODE_TTL_MS);
        setNow(at);
        setPush("none");
        setStep("app");
        window.setTimeout(() => setPush((p) => (p === "none" ? "shown" : p)), 1300);
      } else {
        sendCode();
        setStep("code");
      }
    }, 900);
  }

  function confirmCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!/^\d{6}$/.test(input)) {
      setCodeError(t("인증번호 6자리를 입력해 주세요.", "Enter the 6-digit code."));
      return;
    }
    if (!remaining) {
      setCodeError(t("인증 시간이 지났습니다. 재전송을 눌러 새 인증번호를 받아 주세요.", "The code has expired. Tap Resend for a new one."));
      return;
    }
    if (input !== code) {
      const n = attempts + 1;
      setAttempts(n);
      setInput("");
      if (n >= MAX_ATTEMPTS) {
        setSms(null);
        setExpires(0);
        setStep("locked");
        return;
      }
      setCodeError(t(`인증번호가 일치하지 않습니다. (${n}/${MAX_ATTEMPTS})`, `That code doesn't match. (${n}/${MAX_ATTEMPTS})`));
      codeRef.current?.focus();
      return;
    }
    finish("sms");
  }

  function confirmApp() {
    if (!remaining) {
      setCodeError(t("요청 시간이 지났습니다. 다시 요청해 주세요.", "The request timed out. Please try again."));
      return;
    }
    if (push === "denied") {
      setCodeError(t("앱에서 인증을 거절했습니다. 다시 요청해 주세요.", "You declined in the app. Please request again."));
      return;
    }
    if (push !== "approved") {
      setCodeError(t("아직 휴대폰에서 승인하지 않았습니다. 알림을 확인해 주세요.", "Not approved on your phone yet — check the notification."));
      return;
    }
    finish("app");
  }

  function finish(m: "sms" | "app") {
    const b = mode === "identity" ? parseBirth(birth, sex) : null;
    setSms(null);
    setExpires(0);
    setResult({
      name: (mode === "identity" ? name : presetName).trim(),
      tel: formatTel(sentTo),
      birth: b && "iso" in b ? b.iso : undefined,
      carrier: carrierFinal || undefined,
      method: m,
      at: new Date().toISOString(),
    });
    setStep("done");
  }

  function restart() {
    setStep("form");
    setSends(0);
    setAttempts(0);
    setCode("");
    setInput("");
    setCodeError("");
    setExpires(0);
    setPush("none");
    setCaptcha(makeCaptcha());
    setCaptchaIn("");
  }

  const stepIdx = step === "done" ? 2 : step === "code" || step === "app" || step === "locked" ? 1 : 0;
  const steps: Bi[] = mode === "identity"
    ? [{ ko: "정보 입력", en: "Details" }, { ko: "인증", en: "Verify" }, { ko: "완료", en: "Done" }]
    : [{ ko: "번호 확인", en: "Phone" }, { ko: "인증번호", en: "Code" }, { ko: "완료", en: "Done" }];

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="pv-title">
      <button type="button" data-close aria-label={t("닫기", "Close")} tabIndex={-1} className="absolute inset-0 bg-ink-900/60" onClick={() => !busy && onClose()} />

      <div ref={box} className="fade-up relative flex max-h-[94vh] w-full max-w-[25rem] flex-col overflow-hidden rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.25rem]">
        {/* Window bar */}
        <div className="flex items-center gap-2.5 bg-[#1a1f2b] px-5 py-3.5 text-white">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sk-red-500">
            <IconShield className="size-[1.125rem]" />
          </span>
          <div className="min-w-0 flex-1">
            <p id="pv-title" className="text-[0.9375rem] font-extrabold leading-tight">
              {mode === "identity" ? t("휴대폰 본인확인", "Mobile identity check") : t("휴대폰 인증", "Phone verification")}
            </p>
            <p className="flex items-center gap-1 text-[0.6875rem] text-white/60">
              <IconLock className="size-3" /> {t("보안 연결 · 데모 시뮬레이션", "Secure connection · demo simulation")}
            </p>
          </div>
          {!busy ? (
            <button type="button" data-close onClick={onClose} aria-label={t("닫기", "Close")} className="flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10">
              <IconClose className="size-5" />
            </button>
          ) : null}
        </div>

        {/* Steps */}
        <ol className="flex items-center gap-1.5 border-b border-ink-100 px-5 py-3" aria-label={t("진행 단계", "Progress")}>
          {steps.map((s, i) => (
            <li key={s.en} className="flex flex-1 items-center gap-1.5" aria-current={i === stepIdx ? "step" : undefined}>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-extrabold ${i < stepIdx ? "bg-ink-900 text-white" : i === stepIdx ? "bg-sk-red-500 text-white" : "bg-ink-100 text-ink-400"}`}>
                {i < stepIdx ? <IconCheck className="size-3" /> : i + 1}
              </span>
              <span className={`truncate text-[0.75rem] font-bold ${i === stepIdx ? "text-ink-900" : "text-ink-400"}`}>{pick(s, lang)}</span>
              {i < steps.length - 1 ? <span className="h-px flex-1 bg-ink-200" aria-hidden /> : null}
            </li>
          ))}
        </ol>

        <div className="overflow-y-auto px-5 pb-6 pt-4">
          {/* Purpose / amount */}
          <div className="mb-4 rounded-xl bg-ink-50 px-4 py-3">
            <p className="text-[0.75rem] text-ink-500">{t("요청 기관", "Requested by")} · {t("영남에너지서비스", "Yeongnam Energy Service")}</p>
            <p className="text-[0.9375rem] font-extrabold text-ink-900">{pick(purpose, lang)}</p>
            {amount ? <p className="mt-0.5 text-lg font-extrabold tabular-nums text-sk-red-600">{won(amount, lang)}</p> : null}
          </div>

          {step === "form" || step === "sending" ? (
            mode === "identity" ? (
              <IdentityForm
                {...{ carrier, setCarrier, mvno, setMvno, method, setMethod, name, setName, birth, setBirth, sex, setSex, tel, setTel, captcha, setCaptcha, captchaIn, setCaptchaIn, agree, setAgree, openTerm, setOpenTerm, errors, allAgreed }}
                busy={busy}
                onSubmit={request}
              />
            ) : (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  request();
                }}
              >
                {telEditable ? (
                  <label className="block">
                    <span className="text-[0.8125rem] font-bold text-ink-800">{t("휴대폰 번호", "Mobile number")}</span>
                    <input
                      data-autofocus
                      id="pv-tel"
                      value={tel}
                      onChange={(e) => setTel(formatTel(e.target.value))}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="010-1234-5678"
                      className={fieldCls(!!errors.tel)}
                    />
                    {errors.tel ? <Err>{errors.tel}</Err> : null}
                  </label>
                ) : (
                  <p className="text-[0.9375rem] leading-relaxed text-ink-700">
                    {t("회원 정보에 등록된 휴대폰 번호로 인증번호를 보냅니다.", "We'll text a code to the phone on your account.")}
                    <strong className="mt-1 block text-xl font-extrabold tabular-nums tracking-wide text-ink-900">{maskTel(presetTel)}</strong>
                  </p>
                )}
                <SubmitBtn busy={busy}>{t("인증번호 받기", "Send code")}</SubmitBtn>
              </form>
            )
          ) : null}

          {step === "code" ? (
            <form onSubmit={confirmCode} noValidate>
              <p className="text-[0.9375rem] leading-relaxed text-ink-700">
                <strong className="font-extrabold tabular-nums text-ink-900">{maskTel(sentTo)}</strong>
                {t("(으)로 인증번호를 보냈습니다.", " — we've sent you a code.")}
              </p>
              <label htmlFor="pv-code" className="mt-4 block text-[0.8125rem] font-bold text-ink-800">{t("인증번호 6자리", "6-digit code")}</label>
              <div className="relative mt-1.5">
                <input
                  ref={codeRef}
                  data-autofocus
                  id="pv-code"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setCodeError("");
                  }}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  aria-invalid={!!codeError}
                  aria-describedby="pv-timer"
                  className={`${fieldCls(!!codeError)} pr-20 text-center text-2xl font-extrabold tabular-nums tracking-[0.5em]`}
                />
                <span id="pv-timer" aria-live="off" className={`absolute right-4 top-1/2 -translate-y-1/2 text-[0.9375rem] font-extrabold tabular-nums ${remaining <= 30 ? "text-sk-red-600" : "text-ink-500"}`}>
                  {mmss}
                </span>
              </div>
              {codeError ? <Err>{codeError}</Err> : null}
              <div className="mt-3 flex items-center justify-between text-[0.8125rem]">
                <span className="text-ink-500">{t(`재전송 ${sends}/${MAX_SENDS}`, `Sent ${sends}/${MAX_SENDS}`)}</span>
                <button
                  type="button"
                  onClick={() => sendCode(true)}
                  disabled={cooldown > 0}
                  className="min-h-9 rounded-lg px-3 font-bold text-ink-800 underline underline-offset-2 disabled:text-ink-300 disabled:no-underline"
                >
                  {cooldown > 0 ? t(`${cooldown}초 후 재전송`, `Resend in ${cooldown}s`) : t("인증번호 재전송", "Resend code")}
                </button>
              </div>
              <SubmitBtn busy={false}>{t("확인", "Verify")}</SubmitBtn>
              <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-500">
                {t("문자가 오지 않으면 스팸함을 확인하거나 재전송을 눌러 주세요. 5회 틀리면 처음부터 다시 진행해야 합니다.", "No text? Check your spam folder or resend. After 5 wrong tries you'll need to start over.")}
              </p>
            </form>
          ) : null}

          {step === "app" ? (
            <div>
              <div className="flex flex-col items-center py-2 text-center">
                <span className="relative flex size-16 items-center justify-center rounded-2xl bg-sk-red-50 text-sk-red-600">
                  <IconShield className="size-8" />
                  {push === "none" || push === "shown" ? <span className="absolute -right-1 -top-1 size-4 animate-ping rounded-full bg-sk-red-400" aria-hidden /> : null}
                </span>
                <p className="mt-3 text-[0.9375rem] font-bold text-ink-900">
                  {t(`${maskTel(tel)} 휴대폰으로 인증 요청을 보냈습니다.`, `We sent a request to ${maskTel(tel)}.`)}
                </p>
                <p className="mt-1 text-[0.8125rem] text-ink-500">{t("알림에서 승인한 뒤 아래 버튼을 눌러 주세요.", "Approve it from the notification, then tap below.")}</p>
                <p className={`mt-2 text-lg font-extrabold tabular-nums ${remaining <= 30 ? "text-sk-red-600" : "text-ink-700"}`}>{mmss}</p>
              </div>
              {codeError ? <Err>{codeError}</Err> : null}
              <button type="button" data-autofocus onClick={confirmApp} className="mt-4 flex min-h-13 w-full items-center justify-center rounded-xl bg-ink-900 px-5 text-base font-extrabold text-white hover:bg-ink-800">
                {t("인증 완료", "I've approved it")}
              </button>
              <button type="button" onClick={restart} className="mt-2 min-h-11 w-full rounded-xl text-[0.875rem] font-bold text-ink-600 hover:bg-ink-50">
                {t("문자 인증으로 바꾸기", "Use a text code instead")}
              </button>
            </div>
          ) : null}

          {step === "locked" ? (
            <div className="py-2 text-center" role="alert">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-sk-red-50 text-sk-red-600">
                <IconLock className="size-7" />
              </span>
              <p className="mt-3 text-[1.0625rem] font-extrabold text-ink-900">{t("인증 시도 횟수를 초과했습니다", "Too many wrong codes")}</p>
              <p className="mt-1 text-[0.875rem] text-ink-600">{t("보안을 위해 이번 인증을 중단했습니다. 처음부터 다시 진행해 주세요.", "For your security this attempt was stopped. Please start again.")}</p>
              <button type="button" data-autofocus onClick={restart} className="mt-5 flex min-h-13 w-full items-center justify-center rounded-xl bg-ink-900 font-extrabold text-white">
                {t("처음부터 다시", "Start over")}
              </button>
            </div>
          ) : null}

          {step === "done" && result ? (
            <div className="py-2 text-center" role="status">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <IconCheck className="size-7" />
              </span>
              <p className="mt-3 text-[1.0625rem] font-extrabold text-ink-900">
                {mode === "identity" ? t("본인확인이 완료되었습니다", "Identity confirmed") : t("인증이 완료되었습니다", "Verified")}
              </p>
              {mode === "identity" ? (
                <p className="mt-1 text-[0.875rem] text-ink-600">
                  {result.name} · {maskTel(result.tel)}
                </p>
              ) : null}
              <button type="button" data-autofocus onClick={() => onVerified(result)} className="mt-5 flex min-h-13 w-full items-center justify-center rounded-xl sk-gradient font-extrabold text-white">
                {t("확인", "Continue")}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Demo "text message" — shown on screen instead of being sent. */}
      {sms ? (
        <button
          type="button"
          onClick={() => {
            setInput(sms);
            setCodeError("");
            setSms(null);
            codeRef.current?.focus();
          }}
          className="fixed inset-x-3 top-3 z-[95] mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-ink-100 bg-white/95 p-3.5 text-left shadow-[0_18px_40px_-12px_rgba(17,21,29,.45)] backdrop-blur fade-up"
          aria-label={t(`데모 문자: 인증번호 ${sms.split("").join(" ")}. 눌러서 자동 입력`, `Demo text: code ${sms.split("").join(" ")}. Tap to fill in`)}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white" aria-hidden>
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.4 6.1L4.6 21l4.2-2.3c1 .2 2.1.3 3.2.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z" /></svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between text-[0.6875rem] font-bold text-ink-400">
              <span>{t("메시지", "Messages")}</span>
              <span>{t("지금", "now")}</span>
            </span>
            <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-800">
              [Web{t("발신", "")}] {t(`[영남에너지서비스] ${pick(purpose, "ko")} 인증번호 [${sms}]를 입력해 주세요. 타인에게 절대 알려주지 마세요.`, `[Yeongnam Energy] Your ${pick(purpose, "en").toLowerCase()} code is [${sms}]. Never share it with anyone.`)}
            </span>
            <span className="mt-1.5 block text-[0.6875rem] font-bold text-sk-red-600">
              {t("데모 알림 · 실제 문자는 보내지 않습니다 · 눌러서 자동 입력", "Demo notification · no real text is sent · tap to fill in")}
            </span>
          </span>
        </button>
      ) : null}

      {/* Demo push notification for app verification. */}
      {step === "app" && push === "shown" ? (
        <div className="fixed inset-x-3 top-3 z-[95] mx-auto max-w-sm rounded-2xl border border-ink-100 bg-white/95 p-3.5 shadow-[0_18px_40px_-12px_rgba(17,21,29,.45)] backdrop-blur fade-up" role="alertdialog" aria-label={t("데모 인증 알림", "Demo approval notification")}>
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sk-red-500 text-white" aria-hidden>
              <IconShield className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between text-[0.6875rem] font-bold text-ink-400">
                <span>{t("본인확인 앱", "Identity app")}</span>
                <span>{t("지금", "now")}</span>
              </p>
              <p className="mt-0.5 text-[0.8125rem] font-bold text-ink-900">{t("본인확인 요청이 도착했습니다", "Identity check requested")}</p>
              <p className="text-[0.8125rem] text-ink-600">{t(`영남에너지서비스 · ${pick(purpose, "ko")}`, `Yeongnam Energy Service · ${pick(purpose, "en")}`)}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setPush("denied"); setCodeError(""); }} className="min-h-11 rounded-xl border-2 border-ink-200 text-[0.875rem] font-bold text-ink-700">{t("거절", "Decline")}</button>
            <button type="button" onClick={() => { setPush("approved"); setCodeError(""); }} className="min-h-11 rounded-xl bg-sk-red-500 text-[0.875rem] font-extrabold text-white">{t("승인", "Approve")}</button>
          </div>
          <p className="mt-2 text-center text-[0.6875rem] font-bold text-ink-400">{t("데모 알림 · 실제 앱으로 보내지 않습니다", "Demo notification · nothing is sent to a real app")}</p>
        </div>
      ) : null}
    </div>
  );
}

/* ── identity form ────────────────────────────────────────────── */

type IdentityProps = {
  carrier: Carrier | "MVNO" | "";
  setCarrier: (c: Carrier | "MVNO") => void;
  mvno: Carrier | "";
  setMvno: (c: Carrier) => void;
  method: "sms" | "app";
  setMethod: (m: "sms" | "app") => void;
  name: string;
  setName: (v: string) => void;
  birth: string;
  setBirth: (v: string) => void;
  sex: string;
  setSex: (v: string) => void;
  tel: string;
  setTel: (v: string) => void;
  captcha: string;
  setCaptcha: (v: string) => void;
  captchaIn: string;
  setCaptchaIn: (v: string) => void;
  agree: Record<string, boolean>;
  setAgree: (v: Record<string, boolean>) => void;
  openTerm: string | null;
  setOpenTerm: (v: string | null) => void;
  errors: Record<string, string>;
  allAgreed: boolean;
  busy: boolean;
  onSubmit: () => void;
};

function IdentityForm(p: IdentityProps) {
  const t = useT();
  const { lang } = useLang();
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        p.onSubmit();
      }}
      className="space-y-4"
    >
      <fieldset>
        <legend className="text-[0.8125rem] font-bold text-ink-800">{t("통신사", "Carrier")}</legend>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5" role="radiogroup">
          {[...CARRIERS.map((c) => ({ id: c.id as Carrier | "MVNO", label: c.label })), { id: "MVNO" as const, label: t("알뜰폰", "MVNO") }].map((c) => (
            <label
              key={c.id}
              className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl border-2 text-[0.875rem] font-extrabold transition ${
                p.carrier === c.id ? "border-sk-red-500 bg-sk-red-50 text-sk-red-700" : p.errors.carrier ? "border-sk-red-300 text-ink-700" : "border-ink-200 text-ink-700 hover:border-ink-300"
              }`}
            >
              <input type="radio" name="pv-carrier" value={c.id} checked={p.carrier === c.id} onChange={() => p.setCarrier(c.id)} className="sr-only" />
              {c.label}
            </label>
          ))}
        </div>
        {p.carrier === "MVNO" ? (
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="radiogroup" aria-label={t("알뜰폰 망", "MVNO network")}>
            {CARRIERS.map((c) => (
              <label key={c.id} className={`flex min-h-10 cursor-pointer items-center justify-center rounded-lg border text-[0.8125rem] font-bold ${p.mvno === c.id ? "border-sk-red-500 bg-sk-red-50 text-sk-red-700" : "border-ink-200 text-ink-600"}`}>
                <input type="radio" name="pv-mvno" value={c.id} checked={p.mvno === c.id} onChange={() => p.setMvno(c.id)} className="sr-only" />
                {t(`${c.label} 알뜰폰`, `${c.label} MVNO`)}
              </label>
            ))}
          </div>
        ) : null}
        {p.errors.carrier ? <Err>{p.errors.carrier}</Err> : null}
      </fieldset>

      <div className="grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1" role="tablist" aria-label={t("인증 방법", "Method")}>
        {(["sms", "app"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={p.method === m}
            onClick={() => p.setMethod(m)}
            className={`min-h-10 rounded-lg text-[0.8125rem] font-bold transition ${p.method === m ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}
          >
            {m === "sms" ? t("문자(SMS)로 인증", "Text message") : t("앱으로 인증", "Phone app")}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-[0.8125rem] font-bold text-ink-800">{t("이름", "Name")}</span>
        <input id="pv-name" value={p.name} onChange={(e) => p.setName(e.target.value)} autoComplete="name" className={fieldCls(!!p.errors.name)} />
        {p.errors.name ? <Err>{p.errors.name}</Err> : null}
      </label>

      <div>
        <span className="text-[0.8125rem] font-bold text-ink-800">{t("생년월일 / 성별", "Birthdate / gender digit")}</span>
        <div className="mt-1.5 flex items-center gap-2">
          <input
            id="pv-birth"
            value={p.birth}
            onChange={(e) => p.setBirth(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder={t("YYMMDD", "YYMMDD")}
            aria-label={t("생년월일 6자리", "Birthdate, 6 digits")}
            className={`${fieldCls(!!p.errors.birth)} mt-0 min-w-0 flex-[3] tabular-nums`}
          />
          <span className="text-ink-400" aria-hidden>–</span>
          <div className={`flex min-h-12 flex-[2] items-center gap-1 rounded-xl border-2 bg-white pl-3 ${p.errors.birth ? "border-sk-red-400" : "border-ink-200 focus-within:border-ink-900"}`}>
            <input
              id="pv-sex"
              value={p.sex}
              onChange={(e) => p.setSex(e.target.value.replace(/\D/g, "").slice(0, 1))}
              inputMode="numeric"
              maxLength={1}
              aria-label={t("주민등록번호 뒷자리 첫 숫자", "First digit of the back half")}
              className="w-5 bg-transparent text-center text-base font-bold tabular-nums outline-none"
            />
            <span className="select-none text-[0.75rem] tracking-[0.2em] text-ink-400" aria-hidden>●●●●●●</span>
          </div>
        </div>
        {p.errors.birth ? <Err>{p.errors.birth}</Err> : null}
      </div>

      <label className="block">
        <span className="text-[0.8125rem] font-bold text-ink-800">{t("휴대폰 번호", "Mobile number")}</span>
        <input id="pv-tel" value={p.tel} onChange={(e) => p.setTel(formatTel(e.target.value))} inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" className={fieldCls(!!p.errors.tel)} />
        {p.errors.tel ? <Err>{p.errors.tel}</Err> : null}
      </label>

      {p.method === "sms" ? (
        <div>
          <span className="text-[0.8125rem] font-bold text-ink-800">{t("보안문자", "Security code")}</span>
          <div className="mt-1.5 flex items-stretch gap-2">
            <Captcha value={p.captcha} />
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => { p.setCaptcha(makeCaptcha()); p.setCaptchaIn(""); }} className="min-h-[1.375rem] flex-1 rounded-lg border border-ink-200 px-2 text-[0.6875rem] font-bold text-ink-600 hover:bg-ink-50">
                {t("새로고침", "Refresh")}
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    const u = new SpeechSynthesisUtterance(p.captcha.split("").join(" "));
                    u.lang = lang === "en" ? "en-US" : "ko-KR";
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(u);
                  } catch {}
                }}
                className="min-h-[1.375rem] flex-1 rounded-lg border border-ink-200 px-2 text-[0.6875rem] font-bold text-ink-600 hover:bg-ink-50"
              >
                {t("음성 듣기", "Listen")}
              </button>
            </div>
          </div>
          <input
            id="pv-captcha"
            value={p.captchaIn}
            onChange={(e) => p.setCaptchaIn(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder={t("위 숫자 6자리 입력", "Type the 6 digits above")}
            aria-label={t("보안문자 입력", "Security code")}
            className={`${fieldCls(!!p.errors.captcha)} tabular-nums`}
          />
          {p.errors.captcha ? <Err>{p.errors.captcha}</Err> : null}
        </div>
      ) : null}

      <div className={`rounded-xl border ${p.errors.agree ? "border-sk-red-300" : "border-ink-200"}`}>
        <label className="flex min-h-12 cursor-pointer items-center gap-2.5 border-b border-ink-100 px-3.5">
          <input
            type="checkbox"
            checked={p.allAgreed}
            onChange={(e) => p.setAgree(Object.fromEntries(VERIFY_TERMS.map((x) => [x.id, e.target.checked])))}
            className="size-5 accent-[#EA002C]"
          />
          <span className="text-[0.875rem] font-extrabold text-ink-900">{t("전체 동의", "Agree to all")}</span>
        </label>
        <ul className="px-3.5 py-1.5">
          {VERIFY_TERMS.map((x) => (
            <li key={x.id}>
              <div className="flex min-h-10 items-center gap-2.5">
                <input
                  id={`pv-term-${x.id}`}
                  type="checkbox"
                  checked={!!p.agree[x.id]}
                  onChange={(e) => p.setAgree({ ...p.agree, [x.id]: e.target.checked })}
                  className="size-4 accent-[#EA002C]"
                />
                <label htmlFor={`pv-term-${x.id}`} className="flex-1 cursor-pointer text-[0.8125rem] text-ink-700">
                  {t("[필수] ", "[Required] ")}{pick(x.label, lang)}
                </label>
                <button
                  type="button"
                  aria-expanded={p.openTerm === x.id}
                  onClick={() => p.setOpenTerm(p.openTerm === x.id ? null : x.id)}
                  className="flex min-h-9 items-center gap-0.5 px-1 text-[0.75rem] font-bold text-ink-500"
                >
                  {t("보기", "View")} <IconChevron className={`size-3 transition ${p.openTerm === x.id ? "-rotate-90" : "rotate-90"}`} />
                </button>
              </div>
              {p.openTerm === x.id ? <p className="mb-2 rounded-lg bg-ink-50 p-2.5 text-[0.75rem] leading-relaxed text-ink-600">{pick(x.body, lang)}</p> : null}
            </li>
          ))}
        </ul>
      </div>
      {p.errors.agree ? <Err>{p.errors.agree}</Err> : null}

      <SubmitBtn busy={p.busy}>{p.method === "sms" ? t("인증번호 요청", "Request code") : t("인증 요청", "Send request")}</SubmitBtn>
    </form>
  );
}

/* ── bits ─────────────────────────────────────────────────────── */

function Captcha({ value }: { value: string }) {
  // Wobbly digits over noise lines — readable, but not plain text.
  const rot = [-14, 9, -6, 12, -10, 7];
  const dy = [2, -3, 3, -2, 1, -1];
  return (
    <svg viewBox="0 0 168 48" className="h-12 flex-1 rounded-lg border border-ink-200 bg-[#f4f1ea]" role="img" aria-label="CAPTCHA">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M0 ${8 + i * 9} Q 42 ${i % 2 ? 0 : 48} 84 ${20 + i * 4} T 168 ${10 + i * 8}`} stroke={i % 2 ? "#c9b98f" : "#a9b4c8"} strokeWidth="1.3" fill="none" />
      ))}
      {value.split("").map((c, i) => (
        <text
          key={i}
          x={18 + i * 26}
          y={33 + dy[i]}
          transform={`rotate(${rot[i]} ${18 + i * 26} ${28 + dy[i]})`}
          fontSize="26"
          fontWeight="800"
          fontFamily="ui-monospace, monospace"
          fill={i % 2 ? "#3b4252" : "#7a2e2e"}
          textAnchor="middle"
        >
          {c}
        </text>
      ))}
    </svg>
  );
}

const fieldCls = (bad: boolean) =>
  `mt-1.5 min-h-12 w-full rounded-xl border-2 bg-white px-3.5 text-base outline-none transition placeholder:text-ink-300 focus:border-ink-900 ${bad ? "border-sk-red-400" : "border-ink-200"}`;

function Err({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="mt-1.5 text-[0.8125rem] font-semibold text-sk-red-600">{children}</p>;
}

function SubmitBtn({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  const t = useT();
  return (
    <button
      type="submit"
      disabled={busy}
      className="mt-4 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 text-base font-extrabold text-white transition hover:bg-ink-800 disabled:opacity-70"
    >
      {busy ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
          {t("요청 중…", "Sending…")}
        </>
      ) : (
        children
      )}
    </button>
  );
}
