export const SITE = {
  company: "영남에너지서비스",
  region: "포항",
  group: "SK이노베이션 E&S",
  callCenter: "1800-0098",
  safetyLine: "1544-4500",
  hours: "평일 09:00 ~ 18:00 (점심 12:00~13:00 / 주말·공휴일 휴무)",
  address: "경상북도 포항시 남구 대이로 89",
} as const;

export type NavItem = {
  label: string;
  href: string;
  children: { label: string; href: string; desc?: string }[];
};

export const NAV: NavItem[] = [
  {
    label: "도시가스 이용",
    href: "/use",
    children: [
      { label: "상황별 안내", href: "/guide", desc: "이럴 땐 이렇게 하세요" },
      { label: "전입신청", href: "/move/in", desc: "이사 들어올 때" },
      { label: "전출신청", href: "/move/out", desc: "이사 나갈 때" },
      { label: "가스레인지 교체·철거", href: "/move/stove", desc: "이사 없이 변경할 때" },
      { label: "방문예약 확인·변경", href: "/move/reservation", desc: "조회·수정·방문 독촉" },
      { label: "사용계약 조회", href: "/use/contract" },
      { label: "도시가스 공급 절차", href: "/use/process" },
    ],
  },
  {
    label: "요금·납부",
    href: "/bill",
    children: [
      { label: "요금 조회·납부", href: "/bill", desc: "이번 달 청구요금 확인" },
      { label: "자동이체 신청", href: "/bill/auto", desc: "은행·카드 자동납부" },
      { label: "청구서 유형 변경", href: "/bill/type", desc: "모바일·이메일 청구서" },
      { label: "실시간 요금계산기", href: "/bill/calculator" },
      { label: "전용계좌 안내", href: "/bill/account" },
      { label: "요금표·단가", href: "/bill/rates" },
    ],
  },
  {
    label: "안전·점검",
    href: "/safety",
    children: [
      { label: "가스 안전사용 요령", href: "/safety", desc: "누출 시 행동요령" },
      { label: "가스시설 점검 안내", href: "/safety/inspection" },
      { label: "자가검침 입력", href: "/safety/meter", desc: "문자·앱 검침" },
      { label: "안전점검 SMS 사전안내", href: "/safety/sms" },
      { label: "가스누출 신고", href: "/safety/report" },
    ],
  },
  {
    label: "고객지원",
    href: "/support",
    children: [
      { label: "공지사항", href: "/support" },
      { label: "자주 묻는 질문", href: "/support/faq" },
      { label: "온라인 상담 (Q&A)", href: "/support/qna" },
      { label: "지역 서비스센터 찾기", href: "/centers", desc: "우리 동네 센터 검색" },
      { label: "각종 서식·증명 발급", href: "/support/forms" },
    ],
  },
  {
    label: "회사소개",
    href: "/about",
    children: [
      { label: "회사 개요", href: "/about" },
      { label: "도시가스 사업", href: "/about#city-gas" },
      { label: "연료전지 사업", href: "/about#fuel-cell" },
      { label: "가스냉방 사업", href: "/about#gas-cooling" },
      { label: "신재생에너지 사업", href: "/about#renewable" },
      { label: "CNG 사업", href: "/about#cng" },
      { label: "보도자료", href: "/about/press" },
    ],
  },
];

export const NOTICES = [
  {
    id: 1,
    tag: "요금",
    important: true,
    title: "도시가스 주택용(가정용) 기본요금 인상 안내 (750원 → 1,000원)",
    date: "2026-06-18",
    summary: "2026년 7월 1일 검침분부터 주택용 기본요금이 월 1,000원으로 조정됩니다.",
  },
  {
    id: 2,
    tag: "신청",
    important: true,
    title: "도시가스 이사(전입) 시 Self 사용계약 작성 안내",
    date: "2026-05-30",
    summary:
      "대면 업무를 줄이고 안전한 사용을 위해, 전입 전 알림톡으로 사용계약서를 미리 작성해 주세요.",
  },
  {
    id: 3,
    tag: "서비스",
    important: false,
    title: "전자고지(모바일 청구서) 신청 안내",
    date: "2026-05-12",
    summary: "종이 청구서를 모바일·이메일로 바꾸면 매월 200원의 요금 할인이 적용됩니다.",
  },
  {
    id: 4,
    tag: "안전",
    important: false,
    title: "2026년 하반기 가스시설 정기 안전점검 일정 안내",
    date: "2026-04-28",
    summary: "점검 7일 전 SMS로 방문 일정을 미리 안내드립니다.",
  },
  {
    id: 5,
    tag: "복지",
    important: false,
    title: "에너지바우처 신청 접수 (5월 2일 ~ 12월 31일)",
    date: "2026-04-15",
    summary: "생계·의료·주거·교육 급여 수급 세대는 주민센터 또는 온라인으로 신청하세요.",
  },
  {
    id: 6,
    tag: "서비스",
    important: false,
    title: "지역 서비스센터별 연결비·수수료 내역 안내",
    date: "2026-03-22",
    summary: "표준 연결비와 부대 수수료를 센터별로 확인하실 수 있습니다.",
  },
];

export const FAQS = [
  {
    q: "이사를 가는데 도시가스는 어떻게 해야 하나요?",
    a: "이사 3일 전까지 전출신청을 하시면 방문 일정을 잡아 드립니다. 전출 당일 계량기 지침을 확인해 요금을 정산하고 가스를 차단합니다. 새로 들어가는 집은 별도로 전입신청이 필요합니다.",
    cat: "이사",
  },
  {
    q: "요금이 평소보다 많이 나왔습니다. 왜 그런가요?",
    a: "겨울철(12~2월)은 난방 사용량이 늘어 요금이 평소의 2~4배까지 오를 수 있습니다. 실시간 요금계산기로 사용량 대비 요금을 확인하시고, 그래도 이상하면 고객센터로 연락 주세요.",
    cat: "요금",
  },
  {
    q: "자동이체를 신청하면 할인이 있나요?",
    a: "자동이체(은행·카드)를 신청하시면 청구금액에서 매월 일정 금액이 감액됩니다. 모바일 청구서를 함께 신청하시면 추가 할인이 적용됩니다.",
    cat: "요금",
  },
  {
    q: "가스 냄새가 납니다. 어떻게 해야 하나요?",
    a: "① 중간밸브와 계량기 밸브를 잠그고 ② 창문을 열어 환기한 뒤 ③ 전기 스위치·콘센트는 절대 만지지 마시고 ④ 밖으로 나와 1544-4500 또는 119로 신고해 주세요.",
    cat: "안전",
  },
  {
    q: "안전점검은 꼭 받아야 하나요?",
    a: "도시가스사업법에 따라 가구당 연 2회 이상 안전점검이 의무입니다. 방문 7일 전 SMS로 안내드리며, 일정이 맞지 않으면 예약 변경이 가능합니다.",
    cat: "안전",
  },
  {
    q: "자가검침은 어떻게 하나요?",
    a: "매월 검침일에 보내드리는 문자의 링크를 눌러 계량기 숫자(검은색 5자리)를 입력하시면 됩니다. 홈페이지 ‘자가검침 입력’에서도 가능합니다.",
    cat: "검침",
  },
];

export const BUSINESS = [
  {
    id: "city-gas",
    name: "도시가스",
    desc: "포항 지역 약 20만 세대에 안정적으로 천연가스를 공급합니다.",
  },
  {
    id: "fuel-cell",
    name: "연료전지",
    desc: "천연가스를 전기와 열로 바꾸는 친환경 분산형 발전 사업입니다.",
  },
  {
    id: "gas-cooling",
    name: "가스냉방",
    desc: "여름철 전력 피크를 낮추는 가스 구동 냉방 설비를 보급합니다.",
  },
  {
    id: "renewable",
    name: "신재생에너지",
    desc: "태양광·바이오가스 등 지역 기반 재생에너지를 확대합니다.",
  },
  {
    id: "cng",
    name: "CNG",
    desc: "시내버스·상용차를 위한 압축천연가스 충전 인프라를 운영합니다.",
  },
];

export const CENTERS = [
  { name: "포항 남부 서비스센터", area: "남구 상도동·해도동·송도동", tel: "054-278-1300", addr: "포항시 남구 대이로 89" },
  { name: "포항 북부 서비스센터", area: "북구 죽도동·용흥동·양덕동", tel: "054-241-7700", addr: "포항시 북구 삼호로 245" },
  { name: "오천 서비스센터", area: "남구 오천읍·문덕리 일원", tel: "054-292-4400", addr: "포항시 남구 오천읍 냉천로 512" },
  { name: "흥해 서비스센터", area: "북구 흥해읍·곡강리 일원", tel: "054-261-9900", addr: "포항시 북구 흥해읍 능성로 34" },
  { name: "구룡포 서비스센터", area: "남구 구룡포읍·호미곶면", tel: "054-276-8800", addr: "포항시 남구 구룡포읍 호미로 3155" },
];
