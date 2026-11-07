/* ──────────────────────────────────────────────────────────────
   Simulated mobile identity verification (휴대폰 본인확인).

   Mirrors how carrier verification works in Korea — carrier, name,
   birthdate + gender digit, phone, captcha, consents, a 6-digit code that
   expires in 3 minutes, limited retries — but nothing leaves the browser:
   the "text message" is shown on screen as a demo notification.
   ────────────────────────────────────────────────────────────── */

import type { Bi } from "./i18n";

export const CODE_TTL_MS = 3 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const MAX_SENDS = 5;
export const RESEND_COOLDOWN_MS = 10 * 1000;

export type Carrier = "SKT" | "KT" | "LGU";
export const CARRIERS: { id: Carrier; label: string }[] = [
  { id: "SKT", label: "SKT" },
  { id: "KT", label: "KT" },
  { id: "LGU", label: "LG U+" },
];

export const VERIFY_TERMS: { id: string; label: Bi; body: Bi }[] = [
  {
    id: "privacy",
    label: { ko: "개인정보 이용 동의", en: "Use of personal data" },
    body: {
      ko: "본인확인을 위해 이름, 생년월일, 성별, 휴대폰 번호, 통신사를 이용하며 확인 후 즉시 파기합니다.",
      en: "Your name, birthdate, gender, phone number and carrier are used only to confirm your identity and are discarded right after.",
    },
  },
  {
    id: "unique",
    label: { ko: "고유식별정보 처리 동의", en: "Processing of unique identifiers" },
    body: {
      ko: "주민등록번호 앞 7자리는 통신사 가입 정보와 대조하는 데에만 쓰이며 저장하지 않습니다.",
      en: "The first 7 digits of your resident number are only matched against your carrier record and never stored.",
    },
  },
  {
    id: "service",
    label: { ko: "본인확인 서비스 이용약관 동의", en: "Verification service terms" },
    body: {
      ko: "본인확인 서비스는 인증번호 발송·확인 결과만 요청한 사이트에 전달합니다.",
      en: "The service only passes the result (verified or not) back to the requesting site.",
    },
  },
  {
    id: "carrier",
    label: { ko: "통신사 이용약관 동의", en: "Carrier terms" },
    body: {
      ko: "선택한 통신사가 가입자 정보 일치 여부를 확인합니다.",
      en: "Your carrier checks that the details match its subscriber record.",
    },
  },
];

/** 6-digit one-time code. */
export function makeCode() {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return String(a[0] % 1_000_000).padStart(6, "0");
}

/** Captcha digits (no 0/1 look-alikes issue for digits, but keep 6). */
export function makeCaptcha() {
  return makeCode();
}

/** 010-1234-5678 → 010-****-5678 */
export function maskTel(tel: string) {
  const d = tel.replace(/\D/g, "");
  if (d.length < 10) return tel;
  return `${d.slice(0, 3)}-****-${d.slice(-4)}`;
}

/** Normalise to 010-0000-0000. */
export function formatTel(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
}

/**
 * Birthdate (YYMMDD) + first digit of the back half → full ISO date, or an
 * error key. 1/2/5/6 = 1900s, 3/4/7/8 = 2000s.
 */
export function parseBirth(yymmdd: string, sex: string): { iso: string } | { error: "format" | "date" | "future" } {
  if (!/^\d{6}$/.test(yymmdd) || !/^[1-8]$/.test(sex)) return { error: "format" };
  const century = "1256".includes(sex) ? 1900 : 2000;
  const y = century + Number(yymmdd.slice(0, 2));
  const m = Number(yymmdd.slice(2, 4));
  const d = Number(yymmdd.slice(4, 6));
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return { error: "date" };
  if (dt > new Date()) return { error: "future" };
  return { iso: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` };
}

export function ageOn(iso: string, today = new Date()) {
  const [y, m, d] = iso.split("-").map(Number);
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
  return age;
}

export type Verified = {
  name: string;
  tel: string;
  /** ISO birthdate — only for identity mode. */
  birth?: string;
  carrier?: Carrier;
  method: "sms" | "app";
  at: string;
};
