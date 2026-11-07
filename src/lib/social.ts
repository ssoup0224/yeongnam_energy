/* ──────────────────────────────────────────────────────────────
   Mock social login (Kakao / Naver).

   Nothing talks to Kakao or Naver: the "provider" step is an on-site demo
   sheet with a couple of sample accounts. It never asks for a Kakao/Naver
   password. Returning profiles are matched to members by the linked social
   ID, or by phone number (how Korean sites usually auto-link accounts).
   ────────────────────────────────────────────────────────────── */

import type { Bi } from "./i18n";

export type Provider = "kakao" | "naver";

export const PROVIDERS: Record<Provider, { name: Bi; bg: string; fg: string; button: Bi; start: Bi }> = {
  kakao: {
    name: { ko: "카카오", en: "Kakao" },
    bg: "#FEE500",
    fg: "rgba(0,0,0,0.85)",
    button: { ko: "카카오 로그인", en: "Log in with Kakao" },
    start: { ko: "카카오로 시작하기", en: "Continue with Kakao" },
  },
  naver: {
    name: { ko: "네이버", en: "Naver" },
    bg: "#03C75A",
    fg: "#ffffff",
    button: { ko: "네이버 로그인", en: "Log in with Naver" },
    start: { ko: "네이버로 시작하기", en: "Continue with Naver" },
  },
};

export type SocialProfile = {
  provider: Provider;
  /** Provider's user ID. */
  sub: string;
  name: string;
  tel: string;
  /** Only when the visitor agreed to share it. */
  email?: string;
};

/** Sample accounts offered on the demo provider sheet. */
export const MOCK_ACCOUNTS: Record<Provider, (Omit<SocialProfile, "provider" | "email"> & { email: string; note: Bi })[]> = {
  kakao: [
    { sub: "kakao-30117", name: "김고객", tel: "010-1234-5678", email: "gogaek.kim@example.com", note: { ko: "체험용 계정과 같은 번호 → 바로 로그인", en: "Same phone as the demo member → signs straight in" } },
    { sub: "kakao-58204", name: "최새봄", tel: "010-4821-7730", email: "saebom.choi@example.com", note: { ko: "아직 가입하지 않은 사람 → 간편 가입", en: "Not a member yet → quick sign-up" } },
  ],
  naver: [
    { sub: "naver-7Hq2x", name: "김고객", tel: "010-1234-5678", email: "gogaek_kim@example.com", note: { ko: "체험용 계정과 같은 번호 → 바로 로그인", en: "Same phone as the demo member → signs straight in" } },
    { sub: "naver-Pz81k", name: "정하늘", tel: "010-6604-1928", email: "haneul.jung@example.com", note: { ko: "아직 가입하지 않은 사람 → 간편 가입", en: "Not a member yet → quick sign-up" } },
  ],
};

/** Hand-off from the login page to sign-up for a first-time social visitor. */
const PENDING_KEY = "yes-social-pending";

export function savePendingSocial(p: SocialProfile) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
  } catch {}
}

export function readPendingSocial(): SocialProfile | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as SocialProfile) : null;
  } catch {
    return null;
  }
}

export function clearPendingSocial() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {}
}

/** a.b.kim@example.com → a.b***@example.com */
export function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!d) return email;
  return `${u.slice(0, Math.min(3, u.length))}***@${d}`;
}
