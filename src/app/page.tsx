import Hero from "@/components/Hero";
import HomeView from "@/components/HomeView";
import MyPanel from "@/components/MyPanel";
import NewsBoard from "@/components/NewsBoard";
import NoticeTicker from "@/components/NoticeTicker";
import QuickServices from "@/components/QuickServices";

/**
 * Signed out: urgent notice → search hero → quick services → sign-in /
 * emergency panel → news. Signed in (mock): the personalized dashboard
 * replaces the marketing block, with the news board kept below.
 * The situation guide, service-center finder and business overview each
 * live on their own page (/guide, /centers, /about) rather than here.
 */
export default function Home() {
  return (
    <>
      <NoticeTicker />
      <HomeView
        loggedOut={
          <>
            <Hero />
            <QuickServices />
            <MyPanel />
          </>
        }
        news={<NewsBoard />}
      />
    </>
  );
}
