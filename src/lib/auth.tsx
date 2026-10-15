"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Bi } from "./i18n";

/* ──────────────────────────────────────────────────────────────
   Mock authentication.

   No server, no real credentials — any non-empty id/password "logs in"
   as the demo customer below. The session is kept in localStorage so a
   reload stays signed in. This exists purely to demo the personalized
   home dashboard; it is NOT real auth and must not be treated as such.
   ────────────────────────────────────────────────────────────── */

export type UsagePoint = { month: number; value: number };

export type User = {
  name: Bi;
  customerNo: string;
  address: Bi;
  status: Bi;
  /** This month's estimated bill, in KRW. */
  estimatedBill: number;
  /** Payment due date, ISO (YYYY-MM-DD). */
  dueDate: string;
  /** Last six months of usage, in ㎥. */
  usage: UsagePoint[];
};

/** The single demo account every mock login resolves to. */
export const MOCK_USER: User = {
  name: { ko: "김고객", en: "Gildong Kim" },
  customerNo: "1234-5678",
  address: {
    ko: "경북 포항시 북구 소티재로 12, 101동 803호",
    en: "101-803, 12 Sotijae-ro, Buk-gu, Pohang, Gyeongbuk",
  },
  status: { ko: "사용 중", en: "Active" },
  estimatedBill: 42500,
  dueDate: "2026-10-25",
  usage: [
    { month: 5, value: 18 },
    { month: 6, value: 24 },
    { month: 7, value: 30 },
    { month: 8, value: 21 },
    { month: 9, value: 27 },
    { month: 10, value: 41 },
  ],
};

const STORAGE_KEY = "yes-auth";

type Ctx = {
  user: User | null;
  /** False until the saved session has been read (avoids a logged-out flash). */
  ready: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Restore the saved mock session after mount. Kept in an effect (not a lazy
  // initializer) so the first client render matches the logged-out server
  // output; `ready` then lets the UI swap in the dashboard without a mismatch.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional post-mount sync */
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setUser(MOCK_USER);
    } catch {}
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = useCallback(() => {
    setUser(MOCK_USER);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
