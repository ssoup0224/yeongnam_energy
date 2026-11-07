"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Bi } from "./i18n";
import { DEMO_CUSTOMER_NO, digitsOnly, formatCustomerNo, lookupAccount, nextDueDate, type UsagePoint } from "./data";

/* ──────────────────────────────────────────────────────────────
   Member accounts (client-side).

   Members are stored in localStorage with SHA-256-hashed passwords and a
   linked customer number; the signed-in user's address, usage and bill come
   from that customer number. A built-in demo member (demo / demo1234) is
   always available. This is a prototype without a server — not real auth.
   ────────────────────────────────────────────────────────────── */

export type Member = {
  id: string;
  pwHash: string;
  name: string;
  tel: string;
  email: string;
  customerNo: string;
  createdAt: string;
  /** When the phone was confirmed by identity verification. */
  verifiedAt?: string;
};

export type User = {
  memberId: string;
  isDemo: boolean;
  name: Bi;
  tel: string;
  email: string;
  /** Display form, e.g. 1234-567-890 */
  customerNo: string;
  /** Raw 10 digits */
  customerDigits: string;
  address: Bi;
  status: Bi;
  estimatedBill: number;
  dueDate: string;
  usage: UsagePoint[];
  /** Member since (ISO). */
  since: string;
};

export const DEMO_ID = "demo";
export const DEMO_PW = "demo1234";

const DEMO_MEMBER: Member = {
  id: DEMO_ID,
  pwHash: "",
  name: "김고객",
  tel: "010-1234-5678",
  email: "demo@example.com",
  customerNo: DEMO_CUSTOMER_NO,
  createdAt: "2021-03-02T00:00:00",
};

const SESSION_KEY = "yes-auth";
const MEMBERS_KEY = "yes-members";
const FAIL_KEY = "yes-login-fail";

export const MAX_PW_FAILS = 5;
const LOCK_MS = 5 * 60 * 1000;

type Fails = Record<string, { count: number; until?: number }>;
function readFails(): Fails {
  try {
    return JSON.parse(localStorage.getItem(FAIL_KEY) ?? "{}") as Fails;
  } catch {
    return {};
  }
}
function writeFails(f: Fails) {
  try {
    localStorage.setItem(FAIL_KEY, JSON.stringify(f));
  } catch {}
}

/** qatester1 → qa*****1 */
export function maskId(id: string) {
  if (id.length <= 3) return `${id[0]}**`;
  return `${id.slice(0, 2)}${"*".repeat(id.length - 3)}${id.slice(-1)}`;
}

const telKey = (tel: string) => tel.replace(/\D/g, "");

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toUser(m: Member): User {
  const acct = lookupAccount(m.customerNo) ?? lookupAccount(DEMO_CUSTOMER_NO)!;
  const isDemo = m.id === DEMO_ID;
  return {
    memberId: m.id,
    isDemo,
    name: isDemo ? { ko: "김고객", en: "Gildong Kim" } : { ko: m.name, en: m.name },
    tel: m.tel,
    email: m.email,
    customerNo: formatCustomerNo(acct.customerNo),
    customerDigits: acct.customerNo,
    address: acct.address,
    status: { ko: "사용 중", en: "Active" },
    estimatedBill: acct.estimate,
    dueDate: nextDueDate(),
    usage: acct.usage,
    since: m.createdAt,
  };
}

export type SignupInput = {
  id: string;
  password: string;
  name: string;
  tel: string;
  email: string;
  customerNo: string;
  verifiedAt?: string;
};

export type CredentialResult =
  | { status: "ok"; memberId: string; tel: string; name: string }
  | { status: "invalid"; failures: number }
  | { status: "locked"; until: number };

type Ctx = {
  user: User | null;
  /** False until the saved session has been read (avoids a logged-out flash). */
  ready: boolean;
  /** Step 1 of login: check ID + password (with lockout). No session yet. */
  checkCredentials: (id: string, password: string) => Promise<CredentialResult>;
  /** Step 2 of login: start the session after the phone code is verified. */
  completeLogin: (memberId: string) => void;
  /** Member ID already using this phone number, if any. */
  telOwner: (tel: string) => string | null;
  /** IDs registered to this name + phone (find-ID). */
  findIds: (name: string, tel: string) => { id: string; createdAt: string }[];
  /** Set a new password after identity verification (not for the demo member). */
  resetPassword: (id: string, tel: string, newPassword: string) => Promise<"ok" | "mismatch" | "demo">;
  signup: (input: SignupInput) => Promise<"ok" | "taken" | "no-account">;
  idTaken: (id: string) => boolean;
  /** Edit name / phone / email. The built-in demo member can't be changed. */
  updateProfile: (patch: Pick<Member, "name" | "tel" | "email">) => boolean;
  /** Delete the signed-in member and end the session (not the demo member). */
  deleteAccount: () => boolean;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

function readMembers(): Member[] {
  try {
    return JSON.parse(localStorage.getItem(MEMBERS_KEY) ?? "[]") as Member[];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Restore after mount so the first client render matches the logged-out
  // server output; `ready` then lets the UI swap in the signed-in view.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional post-mount sync */
  useEffect(() => {
    setMembers(readMembers());
    try {
      const s = localStorage.getItem(SESSION_KEY);
      // "1" is the session value written by the earlier demo-only login.
      if (s) setSessionId(s === "1" ? DEMO_ID : s);
    } catch {}
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const findMember = useCallback(
    (id: string) => {
      const key = id.trim().toLowerCase();
      if (key === DEMO_ID) return DEMO_MEMBER;
      return members.find((m) => m.id.toLowerCase() === key);
    },
    [members],
  );

  const user = useMemo(() => {
    if (!sessionId) return null;
    const m = findMember(sessionId);
    return m ? toUser(m) : null;
  }, [sessionId, findMember]);

  const startSession = (id: string) => {
    setSessionId(id);
    try {
      localStorage.setItem(SESSION_KEY, id);
    } catch {}
  };

  const checkCredentials = useCallback(
    async (id: string, password: string): Promise<CredentialResult> => {
      const key = id.trim().toLowerCase();
      const fails = readFails();
      const f = fails[key];
      if (f?.until && f.until > Date.now()) return { status: "locked", until: f.until };
      const m = findMember(id);
      const ok = !!m && (m.id === DEMO_ID ? password === DEMO_PW : (await sha256(password)) === m.pwHash);
      if (!ok || !m) {
        // Count unknown IDs too, so the response doesn't reveal which IDs exist.
        const count = (f?.until ? 0 : f?.count ?? 0) + 1;
        fails[key] = count >= MAX_PW_FAILS ? { count, until: Date.now() + LOCK_MS } : { count };
        writeFails(fails);
        return count >= MAX_PW_FAILS ? { status: "locked", until: fails[key].until! } : { status: "invalid", failures: count };
      }
      delete fails[key];
      writeFails(fails);
      return { status: "ok", memberId: m.id, tel: m.tel, name: m.name };
    },
    [findMember],
  );

  const completeLogin = useCallback((memberId: string) => startSession(memberId), []);

  const telOwner = useCallback(
    (tel: string) => {
      const k = telKey(tel);
      if (telKey(DEMO_MEMBER.tel) === k) return DEMO_ID;
      return members.find((m) => telKey(m.tel) === k)?.id ?? null;
    },
    [members],
  );

  const findIds = useCallback(
    (name: string, tel: string) => {
      const k = telKey(tel);
      const n = name.trim();
      return [DEMO_MEMBER, ...members]
        .filter((m) => telKey(m.tel) === k && (m.name === n || (m.id === DEMO_ID && n.toLowerCase() === "gildong kim")))
        .map((m) => ({ id: m.id, createdAt: m.createdAt }));
    },
    [members],
  );

  const resetPassword = useCallback(async (id: string, tel: string, newPassword: string) => {
    const key = id.trim().toLowerCase();
    if (key === DEMO_ID) return "demo" as const;
    const list = readMembers();
    const m = list.find((x) => x.id.toLowerCase() === key);
    if (!m || telKey(m.tel) !== telKey(tel)) return "mismatch" as const;
    const pwHash = await sha256(newPassword);
    const next = list.map((x) => (x.id === m.id ? { ...x, pwHash } : x));
    try {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(next));
    } catch {}
    setMembers(next);
    const fails = readFails();
    delete fails[key];
    writeFails(fails);
    return "ok" as const;
  }, []);

  const idTaken = useCallback((id: string) => !!findMember(id), [findMember]);

  const signup = useCallback(
    async (input: SignupInput) => {
      if (findMember(input.id)) return "taken" as const;
      if (!lookupAccount(input.customerNo)) return "no-account" as const;
      const m: Member = {
        id: input.id.trim(),
        pwHash: await sha256(input.password),
        name: input.name.trim(),
        tel: input.tel.trim(),
        email: input.email.trim(),
        customerNo: digitsOnly(input.customerNo),
        createdAt: new Date().toISOString(),
        verifiedAt: input.verifiedAt,
      };
      const next = [...readMembers(), m];
      try {
        localStorage.setItem(MEMBERS_KEY, JSON.stringify(next));
      } catch {}
      setMembers(next);
      startSession(m.id);
      return "ok" as const;
    },
    [findMember],
  );

  const updateProfile = useCallback(
    (patch: Pick<Member, "name" | "tel" | "email">) => {
      if (!sessionId || sessionId === DEMO_ID) return false;
      const next = readMembers().map((m) => (m.id === sessionId ? { ...m, ...patch } : m));
      try {
        localStorage.setItem(MEMBERS_KEY, JSON.stringify(next));
      } catch {}
      setMembers(next);
      return true;
    },
    [sessionId],
  );

  const deleteAccount = useCallback(() => {
    if (!sessionId || sessionId === DEMO_ID) return false;
    const next = readMembers().filter((m) => m.id !== sessionId);
    try {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(next));
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    setMembers(next);
    setSessionId(null);
    return true;
  }, [sessionId]);

  const logout = useCallback(() => {
    setSessionId(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, checkCredentials, completeLogin, telOwner, findIds, resetPassword, signup, idTaken, updateProfile, deleteAccount, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
