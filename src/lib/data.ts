import type { Bi, Lang } from "./i18n";

/* ──────────────────────────────────────────────────────────────
   Reference data + a deterministic customer-account lookup.

   There is no backend in this prototype, so any well-formed 10-digit
   customer number resolves to a stable, plausible account generated from
   the number itself (same input → same account, every time). Numbers that
   start with "00" are treated as "not found" so the error path is testable.
   The demo customer is 1234-567-890.
   ────────────────────────────────────────────────────────────── */

export const DEMO_CUSTOMER_NO = "1234567890";

/* ── formatting ─────────────────────────────────────────────── */

export const digitsOnly = (s: string) => s.replace(/\D/g, "");

export function formatCustomerNo(raw: string) {
  const d = digitsOnly(raw);
  if (d.length !== 10) return raw;
  return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
}

export function won(n: number, lang: Lang) {
  const v = Math.round(n);
  return lang === "en" ? `₩${v.toLocaleString("en-US")}` : `${v.toLocaleString("ko-KR")}원`;
}

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthLabel(m: number, lang: Lang) {
  return lang === "en" ? MONTHS_EN[m - 1] : `${m}월`;
}

/** "2026-10-25" → "2026년 10월 25일" / "Oct 25, 2026" */
export function dateLabel(iso: string, lang: Lang) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return lang === "en" ? `${MONTHS_EN[m - 1]} ${d}, ${y}` : `${y}년 ${m}월 ${d}일`;
}

/** ISO date → "2026.10.29 14:05" */
export function stamp(iso: string) {
  const dt = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}

export function todayISO() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Bills fall due on the 25th — this month's if it hasn't passed, else next month's. */
export function nextDueDate(from = new Date()) {
  const y = from.getFullYear();
  const m = from.getMonth();
  const due = from.getDate() <= 25 ? new Date(y, m, 25) : new Date(y, m + 1, 25);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${due.getFullYear()}-${p(due.getMonth() + 1)}-${p(due.getDate())}`;
}

/** Current billing period, "YYYY-MM". */
export function currentPeriod(from = new Date()) {
  return `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}`;
}

export function periodLabel(period: string, lang: Lang) {
  const [y, m] = period.split("-").map(Number);
  return lang === "en" ? `${MONTHS_EN[m - 1]} ${y}` : `${y}년 ${m}월`;
}

/* ── tariffs (illustrative; effective 2026-07-01) ───────────── */

export type Tariff = { id: string; label: Bi; base: number; unit: number; note?: Bi };

export const TARIFFS: Tariff[] = [
  { id: "home", label: { ko: "주택용 (취사·난방)", en: "Residential (cooking + heating)" }, base: 1000, unit: 1186.42 },
  { id: "cook", label: { ko: "주택용 (취사 전용)", en: "Residential (cooking only)" }, base: 1000, unit: 1163.85 },
  { id: "biz", label: { ko: "일반용 (영업용 1)", en: "General (commercial 1)" }, base: 1500, unit: 1113.24 },
  { id: "biz2", label: { ko: "일반용 (영업용 2)", en: "General (commercial 2)" }, base: 1500, unit: 1098.7 },
  { id: "heat", label: { ko: "업무난방용", en: "Commercial heating" }, base: 1500, unit: 1092.6 },
  { id: "cool", label: { ko: "냉난방공조용 (하절기)", en: "Air-conditioning (summer)" }, base: 1500, unit: 812.4, note: { ko: "5~9월 적용", en: "May–Sep" } },
  { id: "industry", label: { ko: "산업용", en: "Industrial" }, base: 2000, unit: 1012.55 },
];

export const tariffById = (id: string) => TARIFFS.find((t) => t.id === id) ?? TARIFFS[0];

export function calcBill(usage: number, tariffId = "home", discount = 0) {
  const t = tariffById(tariffId);
  const energy = Math.round(usage * t.unit);
  const subtotal = t.base + energy;
  const vat = Math.round(subtotal * 0.1);
  // Utilities truncate to the 10-won unit.
  const total = Math.max(0, Math.floor((subtotal + vat - discount) / 10) * 10);
  return { base: t.base, unit: t.unit, energy, vat, discount, total };
}

/* ── deterministic account generator ────────────────────────── */

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SURNAMES = [
  { ko: "김", en: "Kim" }, { ko: "이", en: "Lee" }, { ko: "박", en: "Park" }, { ko: "최", en: "Choi" },
  { ko: "정", en: "Jung" }, { ko: "강", en: "Kang" }, { ko: "조", en: "Cho" }, { ko: "윤", en: "Yoon" },
];
const GIVEN_LAST = ["희", "준", "영", "민", "수", "진", "호", "연"];

const STREETS = [
  { ko: "남구 대이로", en: "Daei-ro, Nam-gu", dong: "대이동" },
  { ko: "북구 삼호로", en: "Samho-ro, Buk-gu", dong: "양덕동" },
  { ko: "남구 오천읍 냉천로", en: "Naengcheon-ro, Ocheon-eup", dong: "오천읍" },
  { ko: "북구 흥해읍 능성로", en: "Neungseong-ro, Heunghae-eup", dong: "흥해읍" },
  { ko: "남구 송도로", en: "Songdo-ro, Nam-gu", dong: "송도동" },
  { ko: "북구 죽도로", en: "Jukdo-ro, Buk-gu", dong: "죽도동" },
  { ko: "남구 해도로", en: "Haedo-ro, Nam-gu", dong: "해도동" },
  { ko: "북구 용흥로", en: "Yongheung-ro, Buk-gu", dong: "용흥동" },
];

const VBANKS: Bi[] = [
  { ko: "농협은행", en: "NongHyup Bank" },
  { ko: "국민은행", en: "KB Kookmin Bank" },
  { ko: "신한은행", en: "Shinhan Bank" },
  { ko: "우리은행", en: "Woori Bank" },
  { ko: "대구은행", en: "iM Bank (Daegu)" },
];

export type UsagePoint = { month: number; value: number };

export type Account = {
  customerNo: string;
  holder: Bi; // masked for lookups
  holderFull: Bi;
  address: Bi;
  dong: string;
  tariffId: string;
  contractDate: string;
  meterNo: string;
  meterExpiry: string;
  usage: UsagePoint[];
  /** Meter reading at the end of last month (㎥). */
  lastReading: number;
  virtualAccount: { bank: Bi; number: string };
  estimate: number;
};

const LAST_SIX = [5, 6, 7, 8, 9, 10];

export function lookupAccount(raw: string): Account | null {
  const no = digitsOnly(raw);
  if (no.length !== 10 || no.startsWith("00")) return null;

  if (no === DEMO_CUSTOMER_NO) {
    const usage = [18, 24, 30, 21, 27, 32].map((value, i) => ({ month: LAST_SIX[i], value }));
    return {
      customerNo: no,
      holder: { ko: "김*객", en: "G. Kim" },
      holderFull: { ko: "김고객", en: "Gildong Kim" },
      address: {
        ko: "경북 포항시 북구 소티재로 12, 101동 803호",
        en: "101-803, 12 Sotijae-ro, Buk-gu, Pohang, Gyeongbuk",
      },
      dong: "창포동",
      tariffId: "home",
      contractDate: "2021-03-02",
      meterNo: "G-2104-55831",
      meterExpiry: "2029-03",
      usage,
      lastReading: 3182,
      virtualAccount: { bank: VBANKS[0], number: "301-1234-5678-90" },
      estimate: calcBill(32, "home").total,
    };
  }

  const r = rng(hash(no));
  const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];
  const s = pick(SURNAMES);
  const g = pick(GIVEN_LAST);
  const st = pick(STREETS);
  const num = 10 + Math.floor(r() * 290);
  const bldg = 101 + Math.floor(r() * 8);
  const unit = (1 + Math.floor(r() * 15)) * 100 + 1 + Math.floor(r() * 4);
  const base = 12 + Math.floor(r() * 18);
  const usage = LAST_SIX.map((month, i) => ({
    month,
    // shoulder-season dip in Aug, heating climb into Oct
    value: Math.max(6, Math.round(base * [0.9, 0.85, 0.8, 0.7, 0.95, 1.4][i] + r() * 6 - 3)),
  }));
  const tariffId = r() < 0.85 ? "home" : "cook";
  const year = 2012 + Math.floor(r() * 13);
  const bank = pick(VBANKS);
  const vnum = `${300 + Math.floor(r() * 600)}-${no.slice(0, 4)}-${no.slice(4, 8)}-${no.slice(8)}`;

  return {
    customerNo: no,
    holder: { ko: `${s.ko}*${g}`, en: `${s.en.charAt(0)}. ${s.en}` },
    holderFull: { ko: `${s.ko}O${g}`, en: s.en },
    address: {
      ko: `경북 포항시 ${st.ko} ${num}, ${bldg}동 ${unit}호`,
      en: `${bldg}-${unit}, ${num} ${st.en}, Pohang`,
    },
    dong: st.dong,
    tariffId,
    contractDate: `${year}-${String(1 + Math.floor(r() * 12)).padStart(2, "0")}-${String(1 + Math.floor(r() * 27)).padStart(2, "0")}`,
    meterNo: `G-${no.slice(2, 6)}-${no.slice(5)}`,
    meterExpiry: `${2027 + Math.floor(r() * 4)}-${String(1 + Math.floor(r() * 12)).padStart(2, "0")}`,
    usage,
    lastReading: 800 + Math.floor(r() * 4000),
    virtualAccount: { bank, number: vnum },
    estimate: calcBill(usage[usage.length - 1].value, tariffId).total,
  };
}

/* ── calorific value (illustrative, MJ/㎥) ──────────────────── */

export const STANDARD_CALORIFIC = 42.7;

export const CALORIFIC: { period: string; value: number }[] = [
  { period: "2026-01", value: 42.81 },
  { period: "2026-02", value: 42.77 },
  { period: "2026-03", value: 42.69 },
  { period: "2026-04", value: 42.62 },
  { period: "2026-05", value: 42.58 },
  { period: "2026-06", value: 42.55 },
  { period: "2026-07", value: 42.6 },
  { period: "2026-08", value: 42.64 },
  { period: "2026-09", value: 42.71 },
  { period: "2026-10", value: 42.79 },
];

/* ── payment & auto-pay institutions ────────────────────────── */

export const BANKS: Bi[] = [
  { ko: "농협은행", en: "NongHyup Bank" },
  { ko: "국민은행", en: "KB Kookmin Bank" },
  { ko: "신한은행", en: "Shinhan Bank" },
  { ko: "우리은행", en: "Woori Bank" },
  { ko: "하나은행", en: "Hana Bank" },
  { ko: "iM뱅크(대구)", en: "iM Bank (Daegu)" },
  { ko: "우체국", en: "Korea Post" },
  { ko: "카카오뱅크", en: "KakaoBank" },
  { ko: "토스뱅크", en: "Toss Bank" },
];

export const CARDS: Bi[] = [
  { ko: "신한카드", en: "Shinhan Card" },
  { ko: "삼성카드", en: "Samsung Card" },
  { ko: "KB국민카드", en: "KB Kookmin Card" },
  { ko: "현대카드", en: "Hyundai Card" },
  { ko: "롯데카드", en: "Lotte Card" },
  { ko: "NH농협카드", en: "NH Card" },
  { ko: "하나카드", en: "Hana Card" },
];

/** Stored institution names are Korean; show them in the page language. */
export function institutionLabel(name: string, lang: "ko" | "en") {
  const hit = [...BANKS, ...CARDS].find((b) => b.ko === name || b.en === name);
  return hit ? hit[lang] : name;
}

export const EASY_PAY: { id: string; label: Bi }[] = [
  { id: "kakao", label: { ko: "카카오페이", en: "KakaoPay" } },
  { id: "naver", label: { ko: "네이버페이", en: "Naver Pay" } },
  { id: "toss", label: { ko: "토스페이", en: "Toss Pay" } },
];

/** Payment methods are saved as text in the language used at the time;
 *  re-render the known parts (banks, cards, easy pay, instalments) in `lang`. */
export function paymentMethodLabel(saved: string, lang: Lang) {
  const from: Lang = lang === "en" ? "ko" : "en";
  let out = saved;
  for (const b of [...BANKS, ...CARDS, ...EASY_PAY.map((e) => e.label)]) out = out.split(b[from]).join(b[lang]);
  return lang === "en"
    ? out.replace("일시불", "full payment").replace(/(\d+)개월/, "$1 months")
    : out.replace("full payment", "일시불").replace(/(\d+) months/, "$1개월");
}

/* ── visit time slots ───────────────────────────────────────── */

export const SLOTS: { key: string; label: Bi }[] = [
  { key: "am", label: { ko: "오전 09–12시", en: "Morning 09–12" } },
  { key: "pm1", label: { ko: "오후 13–15시", en: "Afternoon 13–15" } },
  { key: "pm2", label: { ko: "오후 15–18시", en: "Afternoon 15–18" } },
];

export const slotLabel = (key: string | undefined, lang: Lang) =>
  key ? (lang === "en" ? SLOTS.find((s) => s.key === key)?.label.en : SLOTS.find((s) => s.key === key)?.label.ko) ?? "" : "";

/* ── bill discount programmes (illustrative amounts) ────────── */

export type Discount = { id: string; label: Bi; who: Bi; amount: Bi; monthly: number; winterExtra: number };

export const DISCOUNTS: Discount[] = [
  {
    id: "livelihood",
    label: { ko: "기초생활수급자 (생계·의료)", en: "Basic livelihood / medical recipients" },
    who: { ko: "생계·의료급여 수급 세대", en: "Households on livelihood or medical benefits" },
    amount: { ko: "월 최대 9,000원 · 동절기 최대 36,000원", en: "Up to ₩9,000/mo · ₩36,000 in winter" },
    monthly: 9000,
    winterExtra: 27000,
  },
  {
    id: "housing",
    label: { ko: "기초생활수급자 (주거·교육)", en: "Basic livelihood / housing & education" },
    who: { ko: "주거·교육급여 수급 세대", en: "Households on housing or education benefits" },
    amount: { ko: "월 최대 4,500원 · 동절기 최대 18,000원", en: "Up to ₩4,500/mo · ₩18,000 in winter" },
    monthly: 4500,
    winterExtra: 13500,
  },
  {
    id: "nearpoor",
    label: { ko: "차상위계층", en: "Near-poverty households" },
    who: { ko: "차상위 확인서 발급 세대", en: "Households certified as near-poverty" },
    amount: { ko: "월 최대 4,500원 · 동절기 최대 18,000원", en: "Up to ₩4,500/mo · ₩18,000 in winter" },
    monthly: 4500,
    winterExtra: 13500,
  },
  {
    id: "disabled",
    label: { ko: "장애인 (심한 장애)", en: "Persons with severe disabilities" },
    who: { ko: "심한 장애 판정을 받은 분이 세대주·세대원인 세대", en: "Households with a member assessed as severely disabled" },
    amount: { ko: "월 최대 9,000원 · 동절기 최대 36,000원", en: "Up to ₩9,000/mo · ₩36,000 in winter" },
    monthly: 9000,
    winterExtra: 27000,
  },
  {
    id: "merit",
    label: { ko: "국가유공자 · 독립유공자", en: "National / independence merit holders" },
    who: { ko: "상이 1~3급 국가유공자, 독립유공자 본인", en: "Merit holders (grades 1–3) or independence patriots" },
    amount: { ko: "월 최대 9,000원 · 동절기 최대 36,000원", en: "Up to ₩9,000/mo · ₩36,000 in winter" },
    monthly: 9000,
    winterExtra: 27000,
  },
  {
    id: "multichild",
    label: { ko: "다자녀 가구", en: "Families with 3+ children" },
    who: { ko: "만 18세 이하 자녀가 3명 이상인 세대", en: "Households with three or more children aged 18 or under" },
    amount: { ko: "월 최대 4,500원 · 동절기 최대 18,000원", en: "Up to ₩4,500/mo · ₩18,000 in winter" },
    monthly: 4500,
    winterExtra: 13500,
  },
  {
    id: "welfare",
    label: { ko: "사회복지시설", en: "Social welfare facilities" },
    who: { ko: "사회복지사업법에 따른 시설", en: "Facilities under the Social Welfare Services Act" },
    amount: { ko: "사용요금의 일정 비율 감면", en: "A percentage off usage charges" },
    monthly: 0,
    winterExtra: 0,
  },
];

/* ── inspection rounds by neighbourhood ─────────────────────── */

export const INSPECTION_AREAS: { dong: Bi; first: string; second: string }[] = [
  { dong: { ko: "죽도동", en: "Jukdo" }, first: "2026-04", second: "2026-11" },
  { dong: { ko: "양덕동", en: "Yangdeok" }, first: "2026-03", second: "2026-10" },
  { dong: { ko: "용흥동", en: "Yongheung" }, first: "2026-04", second: "2026-11" },
  { dong: { ko: "창포동", en: "Changpo" }, first: "2026-05", second: "2026-11" },
  { dong: { ko: "대이동", en: "Daei" }, first: "2026-03", second: "2026-09" },
  { dong: { ko: "상도동", en: "Sangdo" }, first: "2026-05", second: "2026-12" },
  { dong: { ko: "해도동", en: "Haedo" }, first: "2026-06", second: "2026-12" },
  { dong: { ko: "송도동", en: "Songdo" }, first: "2026-06", second: "2026-12" },
  { dong: { ko: "오천읍", en: "Ocheon" }, first: "2026-04", second: "2026-10" },
  { dong: { ko: "흥해읍", en: "Heunghae" }, first: "2026-05", second: "2026-11" },
  { dong: { ko: "구룡포읍", en: "Guryongpo" }, first: "2026-06", second: "2026-12" },
];

/* ── certificates ───────────────────────────────────────────── */

export const CERT_KINDS: { id: string; label: Bi; desc: Bi }[] = [
  { id: "usage", label: { ko: "도시가스 사용증명서", en: "Gas usage certificate" }, desc: { ko: "기간별 사용량과 요금 내역", en: "Usage and charges for a period" } },
  { id: "paid", label: { ko: "요금 납부확인서", en: "Payment confirmation" }, desc: { ko: "기간 내 납부 금액 확인 (연말정산·제출용)", en: "Amounts paid in a period (for tax or submission)" } },
  { id: "clear", label: { ko: "완납증명서", en: "Certificate of no arrears" }, desc: { ko: "미납 요금이 없음을 증명", en: "Proof that nothing is outstanding" } },
  { id: "contract", label: { ko: "사용계약 확인서", en: "Contract confirmation" }, desc: { ko: "계약자·계약일·용도 확인", en: "Holder, start date and usage type" } },
];

/* ── Q&A ────────────────────────────────────────────────────── */

export const QNA_CATEGORIES: { id: string; label: Bi }[] = [
  { id: "bill", label: { ko: "요금·납부", en: "Billing" } },
  { id: "move", label: { ko: "이사·신청", en: "Moving & requests" } },
  { id: "safety", label: { ko: "안전·점검", en: "Safety" } },
  { id: "meter", label: { ko: "검침·계량기", en: "Meter" } },
  { id: "etc", label: { ko: "기타", en: "Other" } },
];

export const QNA_SEED: {
  id: string;
  createdAt: string;
  category: string;
  title: Bi;
  body: Bi;
  author: Bi;
  answer: Bi;
}[] = [
  {
    id: "Q-SEED-3",
    createdAt: "2026-10-21T10:12:00",
    category: "bill",
    title: { ko: "자동이체 출금일을 바꿀 수 있나요?", en: "Can I change my auto-pay withdrawal date?" },
    body: { ko: "월급일이 바뀌어서 출금일을 말일로 바꾸고 싶습니다.", en: "My payday changed and I'd like to move it to the end of the month." },
    author: { ko: "이*진", en: "J. Lee" },
    answer: {
      ko: "자동이체 출금일은 납기일(매월 25일) 기준으로 고정되어 있어 변경이 어렵습니다. 다만 잔액 부족으로 출금되지 않은 경우 말일에 한 번 더 재출금됩니다.",
      en: "Auto-pay is tied to the due date (the 25th) and can't be moved. If it fails for insufficient funds, we retry once on the last day of the month.",
    },
  },
  {
    id: "Q-SEED-2",
    createdAt: "2026-10-14T16:40:00",
    category: "move",
    title: { ko: "전입 당일에 가스를 바로 쓸 수 있나요?", en: "Can I use gas on my move-in day?" },
    body: { ko: "토요일에 이사하는데 당일 개통이 가능한지 궁금합니다.", en: "I'm moving on a Saturday — can it be connected the same day?" },
    author: { ko: "박*호", en: "H. Park" },
    answer: {
      ko: "전입신청 시 방문 희망일을 이사 당일로 선택하시면 됩니다. 주말은 오전 시간대만 가능하며, 3일 전까지 신청해 주시면 원하는 날짜에 방문드립니다.",
      en: "Choose your move-in day as the preferred visit date when you apply. Weekends are mornings only — apply three days ahead to secure your date.",
    },
  },
  {
    id: "Q-SEED-1",
    createdAt: "2026-10-02T09:05:00",
    category: "safety",
    title: { ko: "점검원 신분은 어떻게 확인하나요?", en: "How do I verify an inspector's identity?" },
    body: { ko: "점검을 받기 전에 진짜 직원인지 확인하고 싶습니다.", en: "I want to be sure an inspector is genuine before letting them in." },
    author: { ko: "최*영", en: "Y. Choi" },
    answer: {
      ko: "모든 점검원은 사진이 있는 사원증을 패용합니다. 의심되시면 고객센터(1800-0098)로 성명과 사원번호를 불러주시면 즉시 확인해 드립니다.",
      en: "Every inspector wears a photo ID. If in doubt, call 1800-0098 with their name and staff number and we'll confirm on the spot.",
    },
  },
];

/* ── press releases (sample copy for the redesign draft) ────── */

export const PRESS: { id: string; date: string; title: Bi; body: Bi[] }[] = [
  {
    id: "p5",
    date: "2026-10-15",
    title: { ko: "동절기 앞두고 취약계층 2,000세대 가스시설 무상 점검", en: "Free gas-safety checks for 2,000 vulnerable households ahead of winter" },
    body: [
      { ko: "영남에너지서비스는 11월부터 한 달간 포항 지역 에너지 취약계층 2,000세대를 대상으로 가스시설 무상 점검과 노후 호스 교체를 실시합니다.", en: "From November, Yeongnam Energy Service will inspect gas facilities and replace worn hoses free of charge for 2,000 energy-vulnerable households in Pohang." },
      { ko: "점검 대상은 각 행정복지센터를 통해 안내되며, 점검원은 사진이 부착된 사원증을 반드시 패용합니다.", en: "Eligible households are contacted through community service centres, and every inspector wears a photo ID." },
    ],
  },
  {
    id: "p4",
    date: "2026-09-02",
    title: { ko: "모바일 청구서 전환 고객 10만 명 돌파", en: "Mobile bills pass 100,000 customers" },
    body: [
      { ko: "종이 청구서를 모바일·이메일로 전환한 고객이 10만 명을 넘어섰습니다. 전환 고객에게는 매월 200원의 요금 할인이 적용됩니다.", en: "More than 100,000 customers have switched from paper to mobile or email bills, each receiving a ₩200 monthly discount." },
      { ko: "회사는 연간 약 120만 장의 종이를 절감한 것으로 추산합니다.", en: "The company estimates this saves about 1.2 million sheets of paper a year." },
    ],
  },
  {
    id: "p3",
    date: "2026-07-21",
    title: { ko: "포항 북구에 1MW급 연료전지 발전소 준공", en: "1 MW fuel-cell plant completed in Buk-gu, Pohang" },
    body: [
      { ko: "도심형 연료전지 발전소가 준공되어 인근 약 2,500세대가 쓸 수 있는 전력을 생산합니다.", en: "The urban fuel-cell plant generates enough electricity for about 2,500 nearby households." },
      { ko: "발전 과정에서 나오는 열은 인근 공공시설 난방에 활용됩니다.", en: "Heat from generation is reused to warm nearby public buildings." },
    ],
  },
  {
    id: "p2",
    date: "2026-05-30",
    title: { ko: "전입 시 '셀프 사용계약' 서비스 도입", en: "'Self-service contract' launched for move-ins" },
    body: [
      { ko: "전입 고객이 방문 전에 알림톡으로 사용계약서를 미리 작성할 수 있게 되어, 현장 대면 시간이 평균 12분에서 4분으로 줄었습니다.", en: "Customers moving in can now complete their contract by message before the visit, cutting time on site from 12 to 4 minutes on average." },
    ],
  },
  {
    id: "p1",
    date: "2026-03-18",
    title: { ko: "가스안전 캠페인 '밸브 먼저' 시작", en: "'Valve first' gas-safety campaign begins" },
    body: [
      { ko: "가스 냄새가 날 때 가장 먼저 밸브를 잠그는 습관을 알리는 캠페인을 포항 지역 초·중학교 40곳에서 진행합니다.", en: "A campaign teaching the habit of closing the valve first when you smell gas will run in 40 primary and middle schools across Pohang." },
    ],
  },
];

/* ── downloadable library ───────────────────────────────────── */

export type LibraryDoc = {
  id: string;
  cat: Bi;
  title: Bi;
  updated: string;
  body: Bi[];
};

export const LIBRARY: LibraryDoc[] = [
  {
    id: "supply-terms",
    cat: { ko: "약관", en: "Terms" },
    title: { ko: "도시가스 공급규정", en: "City-gas supply regulations" },
    updated: "2026-07-01",
    body: [
      { ko: "제1조 (목적) 이 규정은 회사가 공급하는 도시가스의 요금과 그 밖의 공급조건에 관한 사항을 정함을 목적으로 합니다.", en: "Art. 1 (Purpose) These regulations set out charges and other conditions for the city gas the company supplies." },
      { ko: "제2조 (적용) 이 규정은 회사와 사용계약을 체결한 모든 사용자에게 적용됩니다.", en: "Art. 2 (Scope) They apply to every user holding a supply contract with the company." },
      { ko: "제3조 (요금) 요금은 기본요금과 사용요금으로 구성되며, 사용요금은 사용량에 단가를 곱하여 산정합니다.", en: "Art. 3 (Charges) Charges consist of a base charge and a usage charge, calculated as volume × unit price." },
    ],
  },
  {
    id: "contract-form",
    cat: { ko: "서식", en: "Forms" },
    title: { ko: "도시가스 사용계약서", en: "City-gas supply contract" },
    updated: "2026-05-30",
    body: [
      { ko: "사용자 성명 / 연락처 / 사용 주소 / 용도 / 사용 개시일을 기재하고 서명합니다.", en: "Enter the user's name, phone, address, usage type and start date, then sign." },
      { ko: "사용자는 공급규정을 준수하며, 가스시설의 임의 변경을 하지 않습니다.", en: "The user agrees to follow the supply regulations and not alter gas facilities." },
    ],
  },
  {
    id: "move-form",
    cat: { ko: "서식", en: "Forms" },
    title: { ko: "전입·전출 신청서", en: "Move-in / move-out request form" },
    updated: "2026-03-02",
    body: [
      { ko: "신청 구분(전입/전출), 고객번호, 주소, 방문 희망일시, 정산 방법을 기재합니다.", en: "Enter request type, customer number, address, preferred visit time and settlement method." },
    ],
  },
  {
    id: "autopay-form",
    cat: { ko: "서식", en: "Forms" },
    title: { ko: "자동이체 신청서", en: "Auto-pay application" },
    updated: "2026-01-15",
    body: [
      { ko: "예금주 / 은행명 / 계좌번호 / 고객번호를 기재하고 예금주가 서명합니다.", en: "Enter the account holder, bank, account number and customer number; the holder signs." },
    ],
  },
  {
    id: "owner-form",
    cat: { ko: "서식", en: "Forms" },
    title: { ko: "명의변경 신청서", en: "Change-of-holder application" },
    updated: "2026-01-15",
    body: [
      { ko: "기존 사용자와 신규 사용자의 성명·연락처, 변경 사유, 변경일을 기재합니다.", en: "Enter the current and new users' names and phones, the reason and the change date." },
    ],
  },
  {
    id: "discount-form",
    cat: { ko: "서식", en: "Forms" },
    title: { ko: "요금경감 신청서", en: "Bill-discount application" },
    updated: "2026-01-15",
    body: [
      { ko: "경감 대상 구분, 증빙서류(수급자 증명서 등)를 첨부하여 제출합니다.", en: "State the discount category and attach proof such as a benefits certificate." },
    ],
  },
  {
    id: "safety-guide",
    cat: { ko: "안내책자", en: "Guides" },
    title: { ko: "가정용 가스 안전사용 안내", en: "Home gas-safety guide" },
    updated: "2026-03-18",
    body: [
      { ko: "사용 전: 냄새 확인 후 환기. 사용 중: 파란 불꽃 유지. 사용 후: 중간밸브 잠금.", en: "Before: check for smell and ventilate. During: keep a blue flame. After: close the mid-valve." },
      { ko: "가스 냄새가 나면 밸브 잠금 → 환기 → 전기 만지지 않기 → 밖에서 1544-4500 신고.", en: "If you smell gas: close the valve → ventilate → no electrics → call 1544-4500 from outside." },
    ],
  },
];

/* ── self-check questions ───────────────────────────────────── */

export const SELF_CHECK: { id: string; q: Bi; fix: Bi }[] = [
  { id: "smell", q: { ko: "평소 가스 냄새가 나지 않나요?", en: "Is there no gas smell normally?" }, fix: { ko: "냄새가 나면 즉시 밸브를 잠그고 1544-4500으로 신고하세요.", en: "If you smell gas, close the valve and call 1544-4500 now." } },
  { id: "flame", q: { ko: "불꽃이 파란색으로 고르게 타나요?", en: "Does the flame burn evenly blue?" }, fix: { ko: "붉은 불꽃은 불완전연소 신호입니다. 버너 청소나 점검을 신청하세요.", en: "A red flame means incomplete combustion — clean the burner or book a check." } },
  { id: "hose", q: { ko: "호스에 균열·꺾임이 없고 고정되어 있나요?", en: "Is the hose free of cracks and kinks, and secured?" }, fix: { ko: "호스는 사용 기간과 무관하게 손상이 보이면 교체해야 합니다.", en: "Replace any damaged hose regardless of age." } },
  { id: "soap", q: { ko: "연결부에 비눗물을 발랐을 때 거품이 생기지 않나요?", en: "No bubbles when soapy water is brushed on joints?" }, fix: { ko: "거품이 생기면 누출입니다. 사용을 멈추고 점검을 신청하세요.", en: "Bubbles mean a leak — stop using it and book a check." } },
  { id: "valve", q: { ko: "중간밸브가 부드럽게 열리고 잠기나요?", en: "Does the mid-valve open and close smoothly?" }, fix: { ko: "밸브가 뻑뻑하면 무리하게 돌리지 말고 점검을 신청하세요.", en: "If the valve is stiff, don't force it — book a check." } },
  { id: "flue", q: { ko: "보일러 배기통이 빠지거나 찌그러지지 않았나요?", en: "Is the boiler flue intact and attached?" }, fix: { ko: "배기통 이탈은 일산화탄소 중독 위험이 있습니다. 즉시 점검을 신청하세요.", en: "A detached flue risks carbon-monoxide poisoning — book a check now." } },
  { id: "vent", q: { ko: "환기구가 가구 등으로 막혀 있지 않나요?", en: "Are vents unobstructed?" }, fix: { ko: "환기구 앞 물건을 치워 주세요.", en: "Clear anything in front of the vents." } },
  { id: "alarm", q: { ko: "가스누출 경보기가 정상 작동하나요?", en: "Does the gas detector work?" }, fix: { ko: "경보기 시험 버튼을 눌러 확인하고, 작동하지 않으면 교체하세요.", en: "Press the test button; replace it if it doesn't sound." } },
];
