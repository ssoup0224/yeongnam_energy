import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileTabBar from "@/components/MobileTabBar";

export const metadata: Metadata = {
  title: {
    default: "영남에너지서비스 포항 | 도시가스 요금·신청·안전",
    template: "%s | 영남에너지서비스 포항",
  },
  description:
    "포항 지역 도시가스 공급사 영남에너지서비스. 요금 조회·납부, 이사(전입·전출) 신청, 자가검침, 안전점검, 서비스센터 찾기를 한 곳에서.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#EA002C",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          본문 바로가기
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
