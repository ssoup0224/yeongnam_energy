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
import { todayISO } from "./data";
import { useAuth } from "./auth";

/* ──────────────────────────────────────────────────────────────
   Client-side persistent store.

   Everything a customer does on the site — applications, meter readings,
   payments, issued certificates, Q&A posts and account settings — is kept
   here and saved to localStorage, so features connect to each other: a
   move-in request shows up in "visit booking" and My Page, a payment marks
   the bill paid, a meter reading updates the usage chart, and so on.

   There is no server in this prototype; this is the single source of truth.
   ────────────────────────────────────────────────────────────── */

export type RequestType =
  | "move-in"
  | "move-out"
  | "stove"
  | "meter-swap"
  | "supply-stop"
  | "supply-resume"
  | "owner"
  | "boiler"
  | "leak"
  | "ethics"
  | "discount"
  | "inspection";

export const REQUEST_META: Record<RequestType, { label: Bi; prefix: string; visit: boolean }> = {
  "move-in": { label: { ko: "전입신청", en: "Move-in" }, prefix: "MI", visit: true },
  "move-out": { label: { ko: "전출신청", en: "Move-out" }, prefix: "MO", visit: true },
  stove: { label: { ko: "가스레인지 교체·철거", en: "Stove change / removal" }, prefix: "ST", visit: true },
  "meter-swap": { label: { ko: "계량기 교체", en: "Meter replacement" }, prefix: "MS", visit: true },
  "supply-stop": { label: { ko: "공급중지", en: "Supply stop" }, prefix: "SS", visit: true },
  "supply-resume": { label: { ko: "재공급", en: "Supply resume" }, prefix: "SR", visit: true },
  owner: { label: { ko: "명의변경", en: "Change of holder" }, prefix: "OW", visit: false },
  boiler: { label: { ko: "보일러 서류접수", en: "Boiler documents" }, prefix: "BO", visit: false },
  leak: { label: { ko: "가스누출 신고", en: "Leak report" }, prefix: "LK", visit: false },
  ethics: { label: { ko: "윤리경영 제보", en: "Ethics report" }, prefix: "ET", visit: false },
  discount: { label: { ko: "요금경감 신청", en: "Discount application" }, prefix: "DC", visit: false },
  inspection: { label: { ko: "안전점검 예약", en: "Safety inspection" }, prefix: "IN", visit: true },
};

export type ServiceRequest = {
  id: string;
  type: RequestType;
  createdAt: string;
  name: string;
  tel: string;
  addr?: string;
  customerNo?: string;
  date?: string;
  slot?: string;
  fields: Record<string, string>;
  files?: string[];
  cancelled?: boolean;
  expedited?: boolean;
};

export type RequestStatus = "cancelled" | "done" | "scheduled" | "received";

export function requestStatus(r: ServiceRequest): RequestStatus {
  if (r.cancelled) return "cancelled";
  if (!REQUEST_META[r.type].visit) return "received";
  if (r.date && r.date < todayISO()) return "done";
  return "scheduled";
}

export const STATUS_LABEL: Record<RequestStatus, Bi> = {
  cancelled: { ko: "취소됨", en: "Cancelled" },
  done: { ko: "처리 완료", en: "Completed" },
  scheduled: { ko: "방문 예정", en: "Visit scheduled" },
  received: { ko: "접수 완료", en: "Received" },
};

export type Payment = {
  id: string;
  createdAt: string;
  customerNo: string;
  period: string;
  amount: number;
  method: string;
};

export type Reading = {
  id: string;
  createdAt: string;
  customerNo: string;
  period: string;
  reading: number;
  usage: number;
};

export type Certificate = {
  id: string;
  createdAt: string;
  kind: string;
  customerNo: string;
  from: string;
  to: string;
};

export type QnaPost = {
  id: string;
  createdAt: string;
  category: string;
  title: string;
  body: string;
  author: string;
  isPrivate: boolean;
};

export type SelfCheck = {
  id: string;
  createdAt: string;
  memberId?: string;
  answers: Record<string, "yes" | "no">;
  failed: string[];
};

export type AutoPay = {
  method: "bank" | "card";
  institution: string;
  last4: string;
  holder: string;
  since: string;
};

export type Settings = {
  autoPay: AutoPay | null;
  billType: "paper" | "mobile" | "email";
  billEmail: string;
  sms: { enabled: boolean; tel: string; topics: string[] };
};

type Stored = {
  requests: ServiceRequest[];
  payments: Payment[];
  readings: Reading[];
  certificates: Certificate[];
  qna: QnaPost[];
  selfChecks: SelfCheck[];
  /** Account settings belong to a member, keyed by member id. */
  settingsBy: Record<string, Settings>;
};

/** What consumers see: the stored data plus the signed-in member's settings. */
type State = Stored & { settings: Settings };

const DEFAULT_SETTINGS: Settings = {
  autoPay: null,
  billType: "paper",
  billEmail: "",
  sms: { enabled: false, tel: "", topics: [] },
};

const EMPTY: Stored = {
  requests: [],
  payments: [],
  readings: [],
  certificates: [],
  qna: [],
  selfChecks: [],
  settingsBy: {},
};

const STORAGE_KEY = "yes-store-v1";

/** Receipt-style id: PREFIX-YYMMDD-NNNN */
export function makeId(prefix: string) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const ymd = `${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  const n = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `${prefix}-${ymd}-${n}`;
}

type Ctx = {
  ready: boolean;
  state: State;
  addRequest: (r: Omit<ServiceRequest, "id" | "createdAt">) => ServiceRequest;
  updateRequest: (id: string, patch: Partial<ServiceRequest>) => void;
  findRequest: (id: string, tel: string) => ServiceRequest | undefined;
  addPayment: (p: Omit<Payment, "id" | "createdAt">) => Payment;
  isPaid: (customerNo: string, period: string) => boolean;
  addReading: (r: Omit<Reading, "id" | "createdAt">) => Reading;
  latestReading: (customerNo: string) => Reading | undefined;
  addCertificate: (c: Omit<Certificate, "id" | "createdAt">) => Certificate;
  addQna: (q: Omit<QnaPost, "id" | "createdAt">) => QnaPost;
  addSelfCheck: (c: Omit<SelfCheck, "id" | "createdAt">) => SelfCheck;
  setSettings: (patch: Partial<Settings>) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stored, setState] = useState<Stored>(EMPTY);
  const [ready, setReady] = useState(false);
  const { user } = useAuth();
  const memberKey = user?.memberId ?? "guest";

  // Load after mount (localStorage is client-only); the first render matches
  // the server's empty state so hydration stays clean.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional post-mount sync */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Stored> & { settings?: Settings };
        // Older saves kept one browser-wide settings object (only the demo
        // member could have written it) — move it under that member.
        const settingsBy = saved.settingsBy ?? (saved.settings ? { demo: saved.settings } : {});
        const rest = { ...saved };
        delete rest.settings;
        setState({ ...EMPTY, ...rest, settingsBy });
      }
    } catch {}
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {}
  }, [stored, ready]);

  const settings = useMemo(
    () => ({ ...DEFAULT_SETTINGS, ...stored.settingsBy[memberKey] }),
    [stored.settingsBy, memberKey],
  );
  const state = useMemo<State>(() => ({ ...stored, settings }), [stored, settings]);

  const addRequest = useCallback((r: Omit<ServiceRequest, "id" | "createdAt">) => {
    const rec: ServiceRequest = { ...r, id: makeId(REQUEST_META[r.type].prefix), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, requests: [rec, ...s.requests] }));
    return rec;
  }, []);

  const updateRequest = useCallback((id: string, patch: Partial<ServiceRequest>) => {
    setState((s) => ({ ...s, requests: s.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }, []);

  const findRequest = useCallback(
    (id: string, tel: string) => {
      const t = tel.replace(/\D/g, "");
      return state.requests.find(
        (r) => r.id.toUpperCase() === id.trim().toUpperCase() && r.tel.replace(/\D/g, "") === t,
      );
    },
    [state.requests],
  );

  const addPayment = useCallback((p: Omit<Payment, "id" | "createdAt">) => {
    const rec: Payment = { ...p, id: makeId("PAY"), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, payments: [rec, ...s.payments] }));
    return rec;
  }, []);

  const isPaid = useCallback(
    (customerNo: string, period: string) =>
      state.payments.some((p) => p.customerNo === customerNo && p.period === period),
    [state.payments],
  );

  const addReading = useCallback((r: Omit<Reading, "id" | "createdAt">) => {
    const rec: Reading = { ...r, id: makeId("RD"), createdAt: new Date().toISOString() };
    // One reading per customer per period — a resubmission replaces it.
    setState((s) => ({
      ...s,
      readings: [rec, ...s.readings.filter((x) => !(x.customerNo === r.customerNo && x.period === r.period))],
    }));
    return rec;
  }, []);

  const latestReading = useCallback(
    (customerNo: string) => state.readings.find((r) => r.customerNo === customerNo),
    [state.readings],
  );

  const addCertificate = useCallback((c: Omit<Certificate, "id" | "createdAt">) => {
    const rec: Certificate = { ...c, id: makeId("CT"), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, certificates: [rec, ...s.certificates] }));
    return rec;
  }, []);

  const addQna = useCallback((q: Omit<QnaPost, "id" | "createdAt">) => {
    const rec: QnaPost = { ...q, id: makeId("Q"), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, qna: [rec, ...s.qna] }));
    return rec;
  }, []);

  const addSelfCheck = useCallback((c: Omit<SelfCheck, "id" | "createdAt">) => {
    const rec: SelfCheck = { ...c, memberId: user?.memberId, id: makeId("SC"), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, selfChecks: [rec, ...s.selfChecks] }));
    return rec;
  }, [user?.memberId]);

  const setSettings = useCallback(
    (patch: Partial<Settings>) => {
      setState((s) => ({
        ...s,
        settingsBy: { ...s.settingsBy, [memberKey]: { ...DEFAULT_SETTINGS, ...s.settingsBy[memberKey], ...patch } },
      }));
    },
    [memberKey],
  );

  const value = useMemo(
    () => ({
      ready,
      state,
      addRequest,
      updateRequest,
      findRequest,
      addPayment,
      isPaid,
      addReading,
      latestReading,
      addCertificate,
      addQna,
      addSelfCheck,
      setSettings,
    }),
    [ready, state, addRequest, updateRequest, findRequest, addPayment, isPaid, addReading, latestReading, addCertificate, addQna, addSelfCheck, setSettings],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
