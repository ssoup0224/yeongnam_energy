import type { Bi } from "./i18n";

export const SITE = {
  company: { ko: "영남에너지서비스", en: "Yeongnam Energy Service" },
  region: { ko: "포항", en: "Pohang" },
  group: { ko: "SK이노베이션 E&S", en: "SK Innovation E&S" },
  callCenter: "1800-0098",
  safetyLine: "1544-4500",
  hours: {
    ko: "평일 09:00 ~ 18:00 (점심 12:00~13:00 / 주말·공휴일 휴무)",
    en: "Weekdays 09:00–18:00 (lunch 12:00–13:00 / closed weekends & holidays)",
  },
  /* 2026-10 개편된 원본 사이트 푸터의 실제 표기 */
  address: {
    ko: "경북 포항시 북구 소티재로 208 (창포동)",
    en: "208 Sotijae-ro, Buk-gu, Pohang, Gyeongbuk",
  },
  tel: "054-280-5114",
  fax: "054-280-5005",
  ceo: { ko: "곽원병", en: "Kwak Won-byung" },
  bizNo: "513-81-02333",
} as const;

export type NavChild = { label: Bi; href: string; desc?: Bi };
export type NavItem = {
  label: Bi;
  href: string;
  children: NavChild[];
};

export const NAV: NavItem[] = [
  {
    label: { ko: "도시가스 이용", en: "Using Gas" },
    href: "/use",
    children: [
      { label: { ko: "상황별 안내", en: "Guides by Situation" }, href: "/guide", desc: { ko: "무엇부터 할지 모르겠나요?", en: "Not sure where to start?" } },
      { label: { ko: "전입신청", en: "Move-in Request" }, href: "/move/in", desc: { ko: "이사 들어오시나요?", en: "Moving in?" } },
      { label: { ko: "전출신청", en: "Move-out Request" }, href: "/move/out", desc: { ko: "이사 나가시나요?", en: "Moving out?" } },
      { label: { ko: "가스레인지 교체·철거", en: "Replace or Remove a Stove" }, href: "/move/stove", desc: { ko: "가스레인지를 바꾸시나요?", en: "Need to change a stove?" } },
      { label: { ko: "방문예약 확인·변경", en: "Manage Visits" }, href: "/move/reservation", desc: { ko: "방문 일정을 바꾸시나요?", en: "Need to reschedule a visit?" } },
      { label: { ko: "사용계약 조회", en: "View Your Contract" }, href: "/use/contract", desc: { ko: "계약 내용이 궁금하신가요?", en: "Want to check your contract?" } },
      { label: { ko: "명의변경", en: "Change Account Holder" }, href: "/use/owner", desc: { ko: "사용자가 바뀌었나요?", en: "New account holder?" } },
      { label: { ko: "공급중지·재공급", en: "Pause or Resume Gas" }, href: "/use/supply", desc: { ko: "오래 집을 비우시나요?", en: "Away for a while?" } },
      { label: { ko: "보일러 서류접수", en: "Submit Boiler Documents" }, href: "/use/boiler", desc: { ko: "보일러를 새로 다셨나요?", en: "Installed a new boiler?" } },
      { label: { ko: "도시가스 공급 절차", en: "New Gas Connection" }, href: "/use/process", desc: { ko: "가스를 새로 연결하시나요?", en: "Need gas connected?" } },
    ],
  },
  {
    label: { ko: "요금·납부", en: "Billing" },
    href: "/bill",
    children: [
      { label: { ko: "요금 조회·납부", en: "View & Pay Your Bill" }, href: "/bill", desc: { ko: "이번 달 요금이 궁금하신가요?", en: "What do I owe this month?" } },
      { label: { ko: "간편요금조회", en: "Quick Bill Lookup" }, href: "/bill/quick", desc: { ko: "로그인 없이 확인하시나요?", en: "Checking without logging in?" } },
      { label: { ko: "자동이체 신청", en: "Set Up Auto-pay" }, href: "/bill/auto", desc: { ko: "매달 자동으로 내시겠어요?", en: "Want to pay automatically?" } },
      { label: { ko: "청구서 유형 변경", en: "Change Bill Delivery" }, href: "/bill/type", desc: { ko: "종이 대신 모바일로 받을까요?", en: "Prefer a mobile bill?" } },
      { label: { ko: "실시간 요금계산기", en: "Usage Calculator" }, href: "/bill/calculator", desc: { ko: "요금을 미리 계산해 볼까요?", en: "Want to estimate your bill?" } },
      { label: { ko: "요금경감 제도 안내", en: "Bill Discounts" }, href: "/bill/discount", desc: { ko: "할인 대상인지 궁금하신가요?", en: "Eligible for a discount?" } },
      { label: { ko: "합산요금조회", en: "Multi-unit Billing" }, href: "/bill/combined", desc: { ko: "여러 호실을 관리하시나요?", en: "Managing several units?" } },
      { label: { ko: "전용계좌 안내", en: "Your Payment Account" }, href: "/bill/account", desc: { ko: "계좌이체로 내시나요?", en: "Paying by bank transfer?" } },
      { label: { ko: "요금표·단가", en: "Gas Rates" }, href: "/bill/rates", desc: { ko: "요금 단가가 궁금하신가요?", en: "What are the current rates?" } },
    ],
  },
  {
    label: { ko: "안전·점검", en: "Safety" },
    href: "/safety",
    children: [
      { label: { ko: "가스 안전사용 요령", en: "Gas Safety Tips" }, href: "/safety", desc: { ko: "안전하게 쓰는 법이 궁금하신가요?", en: "How do I use gas safely?" } },
      { label: { ko: "안전점검 예약", en: "Book an Inspection" }, href: "/safety/inspection", desc: { ko: "점검 날짜를 정하시겠어요?", en: "Need an inspection date?" } },
      { label: { ko: "자가검침 입력", en: "Submit a Meter Reading" }, href: "/safety/meter", desc: { ko: "계량기를 직접 읽으셨나요?", en: "Read your own meter?" } },
      { label: { ko: "온라인 자율점검", en: "Home Safety Self-check" }, href: "/safety/self", desc: { ko: "집에서 직접 점검해 볼까요?", en: "Want to check at home?" } },
      { label: { ko: "안전점검 문자 안내", en: "Inspection Text Alerts" }, href: "/safety/sms", desc: { ko: "점검 일정을 문자로 받을까요?", en: "Want a text before visits?" } },
      { label: { ko: "계량기 교체 예약", en: "Replace Your Meter" }, href: "/safety/meter-swap", desc: { ko: "계량기 교체 시기인가요?", en: "Meter due for replacement?" } },
      { label: { ko: "가스누출 신고", en: "Report a Gas Leak" }, href: "/safety/report", desc: { ko: "누출이 의심되나요?", en: "Suspect a leak?" } },
    ],
  },
  {
    label: { ko: "고객지원", en: "Support" },
    href: "/support",
    children: [
      { label: { ko: "공지사항", en: "Notices" }, href: "/support", desc: { ko: "새 소식이 궁금하신가요?", en: "What's new?" } },
      { label: { ko: "자주 묻는 질문", en: "FAQ" }, href: "/support/faq", desc: { ko: "흔한 질문의 답을 찾으시나요?", en: "Have a common question?" } },
      { label: { ko: "온라인 상담", en: "Ask Us Online" }, href: "/support/qna", desc: { ko: "직접 물어보시겠어요?", en: "Need to ask us directly?" } },
      { label: { ko: "지역 서비스센터 찾기", en: "Find a Service Center" }, href: "/centers", desc: { ko: "가까운 센터를 찾으시나요?", en: "Looking for a nearby center?" } },
      { label: { ko: "서식·증명 발급", en: "Forms & Certificates" }, href: "/support/forms", desc: { ko: "증명서가 필요하신가요?", en: "Need a certificate?" } },
      { label: { ko: "자료실", en: "Downloads" }, href: "/support/library", desc: { ko: "약관·서식이 필요하신가요?", en: "Need a form or document?" } },
      { label: { ko: "열량계수 조회", en: "Heat Value Factors" }, href: "/support/calorific", desc: { ko: "사용량은 어떻게 보정되나요?", en: "How is usage adjusted?" } },
    ],
  },
  {
    label: { ko: "회사소개", en: "Company" },
    href: "/about",
    children: [
      { label: { ko: "회사 개요", en: "About Us" }, href: "/about", desc: { ko: "어떤 회사인지 궁금하신가요?", en: "Who are we?" } },
      { label: { ko: "도시가스 사업", en: "City Gas" }, href: "/about#city-gas", desc: { ko: "가스는 어떻게 공급되나요?", en: "How is gas supplied?" } },
      { label: { ko: "연료전지 사업", en: "Fuel Cells" }, href: "/about#fuel-cell", desc: { ko: "연료전지가 무엇인가요?", en: "What are fuel cells?" } },
      { label: { ko: "가스냉방 사업", en: "Gas Cooling" }, href: "/about#gas-cooling", desc: { ko: "가스로 냉방을 한다고요?", en: "Cooling with gas?" } },
      { label: { ko: "신재생에너지 사업", en: "Renewables" }, href: "/about#renewable", desc: { ko: "재생에너지도 하나요?", en: "What about renewables?" } },
      { label: { ko: "CNG 사업", en: "CNG" }, href: "/about#cng", desc: { ko: "CNG 충전소가 궁금하신가요?", en: "Looking for CNG fueling?" } },
      { label: { ko: "사회공헌", en: "Community" }, href: "/about#csr", desc: { ko: "지역과 어떻게 함께하나요?", en: "How do we give back?" } },
      { label: { ko: "보도자료", en: "Newsroom" }, href: "/about/press", desc: { ko: "최근 소식을 보시겠어요?", en: "Want the latest news?" } },
    ],
  },
];

export type Notice = {
  id: number;
  tag: Bi;
  important: boolean;
  title: Bi;
  date: string;
  summary: Bi;
};

export const NOTICES: Notice[] = [
  {
    id: 1,
    tag: { ko: "요금", en: "Billing" },
    important: true,
    title: {
      ko: "도시가스 주택용(가정용) 기본요금 인상 안내 (750원 → 1,000원)",
      en: "Residential base rate increase (₩750 → ₩1,000)",
    },
    date: "2026-06-18",
    summary: {
      ko: "2026년 7월 1일 검침분부터 주택용 기본요금이 월 1,000원으로 조정됩니다.",
      en: "From the July 1, 2026 reading, the residential base rate becomes ₩1,000/month.",
    },
  },
  {
    id: 2,
    tag: { ko: "신청", en: "Requests" },
    important: true,
    title: {
      ko: "도시가스 이사(전입) 시 Self 사용계약 작성 안내",
      en: "Self-service contract when moving in",
    },
    date: "2026-05-30",
    summary: {
      ko: "대면 업무를 줄이고 안전한 사용을 위해, 전입 전 알림톡으로 사용계약서를 미리 작성해 주세요.",
      en: "To reduce in-person visits, complete your service contract in advance via the notification link before moving in.",
    },
  },
  {
    id: 3,
    tag: { ko: "서비스", en: "Service" },
    important: false,
    title: {
      ko: "전자고지(모바일 청구서) 신청 안내",
      en: "Switch to a mobile (paperless) bill",
    },
    date: "2026-05-12",
    summary: {
      ko: "종이 청구서를 모바일·이메일로 바꾸면 매월 200원의 요금 할인이 적용됩니다.",
      en: "Move from a paper bill to mobile/email and get a ₩200 monthly discount.",
    },
  },
  {
    id: 4,
    tag: { ko: "안전", en: "Safety" },
    important: false,
    title: {
      ko: "2026년 하반기 가스시설 정기 안전점검 일정 안내",
      en: "H2 2026 regular gas-facility safety inspection schedule",
    },
    date: "2026-04-28",
    summary: {
      ko: "점검 7일 전 SMS로 방문 일정을 미리 안내드립니다.",
      en: "We send an SMS with your visit date 7 days beforehand.",
    },
  },
  {
    id: 5,
    tag: { ko: "복지", en: "Welfare" },
    important: false,
    title: {
      ko: "에너지바우처 신청 접수 (5월 2일 ~ 12월 31일)",
      en: "Energy voucher applications (May 2 – Dec 31)",
    },
    date: "2026-04-15",
    summary: {
      ko: "생계·의료·주거·교육 급여 수급 세대는 주민센터 또는 온라인으로 신청하세요.",
      en: "Households receiving basic benefits can apply at a community center or online.",
    },
  },
  {
    id: 6,
    tag: { ko: "서비스", en: "Service" },
    important: false,
    title: {
      ko: "지역 서비스센터별 연결비·수수료 내역 안내",
      en: "Connection fees & charges by service center",
    },
    date: "2026-03-22",
    summary: {
      ko: "표준 연결비와 부대 수수료를 센터별로 확인하실 수 있습니다.",
      en: "Check standard connection fees and additional charges for each center.",
    },
  },
];

export type Faq = { q: Bi; a: Bi; cat: Bi };

export const FAQS: Faq[] = [
  {
    q: {
      ko: "이사를 가는데 도시가스는 어떻게 해야 하나요?",
      en: "I'm moving — what do I need to do about city gas?",
    },
    a: {
      ko: "이사 3일 전까지 전출신청을 하시면 방문 일정을 잡아 드립니다. 전출 당일 계량기 지침을 확인해 요금을 정산하고 가스를 차단합니다. 새로 들어가는 집은 별도로 전입신청이 필요합니다.",
      en: "File a move-out request at least 3 days ahead and we'll schedule a visit. On the day, we read the meter, settle the bill and shut off the gas. Your new home needs a separate move-in request.",
    },
    cat: { ko: "이사", en: "Moving" },
  },
  {
    q: {
      ko: "요금이 평소보다 많이 나왔습니다. 왜 그런가요?",
      en: "My bill is much higher than usual. Why?",
    },
    a: {
      ko: "겨울철(12~2월)은 난방 사용량이 늘어 요금이 평소의 2~4배까지 오를 수 있습니다. 실시간 요금계산기로 사용량 대비 요금을 확인하시고, 그래도 이상하면 고객센터로 연락 주세요.",
      en: "In winter (Dec–Feb), heating raises usage so bills can be 2–4× higher. Use the rate calculator to check usage vs. cost, and contact us if it still looks off.",
    },
    cat: { ko: "요금", en: "Billing" },
  },
  {
    q: {
      ko: "자동이체를 신청하면 할인이 있나요?",
      en: "Is there a discount for auto-pay?",
    },
    a: {
      ko: "자동이체(은행·카드)를 신청하시면 청구금액에서 매월 일정 금액이 감액됩니다. 모바일 청구서를 함께 신청하시면 추가 할인이 적용됩니다.",
      en: "Yes — bank or card auto-pay takes a set amount off each bill. Add a mobile bill for a further discount.",
    },
    cat: { ko: "요금", en: "Billing" },
  },
  {
    q: {
      ko: "가스 냄새가 납니다. 어떻게 해야 하나요?",
      en: "I smell gas. What should I do?",
    },
    a: {
      ko: "① 중간밸브와 계량기 밸브를 잠그고 ② 창문을 열어 환기한 뒤 ③ 전기 스위치·콘센트는 절대 만지지 마시고 ④ 밖으로 나와 1544-4500 또는 119로 신고해 주세요.",
      en: "① Close the mid-valve and meter valve, ② open windows to ventilate, ③ never touch electrical switches or outlets, ④ go outside and call 1544-4500 or 119.",
    },
    cat: { ko: "안전", en: "Safety" },
  },
  {
    q: {
      ko: "안전점검은 꼭 받아야 하나요?",
      en: "Is the safety inspection mandatory?",
    },
    a: {
      ko: "도시가스사업법에 따라 가구당 연 2회 이상 안전점검이 의무입니다. 방문 7일 전 SMS로 안내드리며, 일정이 맞지 않으면 예약 변경이 가능합니다.",
      en: "By law, each household must have a safety inspection at least twice a year. We text you 7 days ahead, and you can reschedule if the time doesn't work.",
    },
    cat: { ko: "안전", en: "Safety" },
  },
  {
    q: {
      ko: "자가검침은 어떻게 하나요?",
      en: "How do I submit a self meter reading?",
    },
    a: {
      ko: "매월 검침일에 보내드리는 문자의 링크를 눌러 계량기 숫자(검은색 5자리)를 입력하시면 됩니다. 홈페이지 '자가검침 입력'에서도 가능합니다.",
      en: "Tap the link in the text we send on your reading day and enter the 5 black digits on the meter. You can also use 'Self Meter Reading' on this site.",
    },
    cat: { ko: "검침", en: "Metering" },
  },
];

export type Business = { id: string; name: Bi; desc: Bi };

export const BUSINESS: Business[] = [
  {
    id: "city-gas",
    name: { ko: "도시가스", en: "City Gas" },
    desc: {
      ko: "포항 지역 약 20만 세대에 안정적으로 천연가스를 공급합니다.",
      en: "Reliable natural gas for about 200,000 households across Pohang.",
    },
  },
  {
    id: "fuel-cell",
    name: { ko: "연료전지", en: "Fuel Cells" },
    desc: {
      ko: "천연가스를 전기와 열로 바꾸는 친환경 분산형 발전 사업입니다.",
      en: "Clean distributed generation that turns natural gas into power and heat.",
    },
  },
  {
    id: "gas-cooling",
    name: { ko: "가스냉방", en: "Gas Cooling" },
    desc: {
      ko: "여름철 전력 피크를 낮추는 가스 구동 냉방 설비를 보급합니다.",
      en: "Gas-driven cooling systems that cut summer peak electricity demand.",
    },
  },
  {
    id: "renewable",
    name: { ko: "신재생에너지", en: "Renewables" },
    desc: {
      ko: "태양광·바이오가스 등 지역 기반 재생에너지를 확대합니다.",
      en: "Growing local renewables such as solar and biogas.",
    },
  },
  {
    id: "cng",
    name: { ko: "CNG", en: "CNG" },
    desc: {
      ko: "시내버스·상용차를 위한 압축천연가스 충전 인프라를 운영합니다.",
      en: "Compressed natural gas refueling infrastructure for buses and commercial vehicles.",
    },
  },
  {
    id: "csr",
    name: { ko: "사회공헌", en: "Community" },
    desc: {
      ko: "에너지 취약계층 지원과 지역 상생 활동을 이어가고 있습니다.",
      en: "Supporting energy-vulnerable households and the local community.",
    },
  },
];

export type Center = { name: Bi; area: Bi; tel: string; addr: Bi };

export const CENTERS: Center[] = [
  {
    name: { ko: "포항 남부 서비스센터", en: "Pohang South Service Center" },
    area: { ko: "남구 상도동·해도동·송도동", en: "Nam-gu: Sangdo·Haedo·Songdo" },
    tel: "054-278-1300",
    addr: { ko: "포항시 남구 대이로 89", en: "89 Daei-ro, Nam-gu, Pohang" },
  },
  {
    name: { ko: "포항 북부 서비스센터", en: "Pohang North Service Center" },
    area: { ko: "북구 죽도동·용흥동·양덕동", en: "Buk-gu: Jukdo·Yongheung·Yangdeok" },
    tel: "054-241-7700",
    addr: { ko: "포항시 북구 삼호로 245", en: "245 Samho-ro, Buk-gu, Pohang" },
  },
  {
    name: { ko: "오천 서비스센터", en: "Ocheon Service Center" },
    area: { ko: "남구 오천읍·문덕리 일원", en: "Nam-gu: Ocheon-eup·Mundeok area" },
    tel: "054-292-4400",
    addr: { ko: "포항시 남구 오천읍 냉천로 512", en: "512 Naengcheon-ro, Ocheon-eup, Nam-gu, Pohang" },
  },
  {
    name: { ko: "흥해 서비스센터", en: "Heunghae Service Center" },
    area: { ko: "북구 흥해읍·곡강리 일원", en: "Buk-gu: Heunghae-eup·Gokgang area" },
    tel: "054-261-9900",
    addr: { ko: "포항시 북구 흥해읍 능성로 34", en: "34 Neungseong-ro, Heunghae-eup, Buk-gu, Pohang" },
  },
  {
    name: { ko: "구룡포 서비스센터", en: "Guryongpo Service Center" },
    area: { ko: "남구 구룡포읍·호미곶면", en: "Nam-gu: Guryongpo-eup·Homigot-myeon" },
    tel: "054-276-8800",
    addr: { ko: "포항시 남구 구룡포읍 호미로 3155", en: "3155 Homi-ro, Guryongpo-eup, Nam-gu, Pohang" },
  },
];
