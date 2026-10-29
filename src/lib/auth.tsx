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
};

type Ctx = {
  user: User | null;
  /** False until the saved session has been read (avoids a logged-out flash). */
  ready: boolean;
  login: (id: string, password: string) => Promise<"ok" | "invalid">;
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

  const login = useCallback(
    async (id: string, password: string) => {
      const m = findMember(id);
      if (!m) return "invalid" as const;
      const ok = m.id === DEMO_ID ? password === DEMO_PW : (await sha256(password)) === m.pwHash;
      if (!ok) return "invalid" as const;
      startSession(m.id);
      return "ok" as const;
    },
    [findMember],
  );

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
    <AuthContext.Provider value={{ user, ready, login, signup, idTaken, updateProfile, deleteAccount, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
