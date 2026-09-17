import Hero from "@/components/Hero";
import MyPanel from "@/components/MyPanel";
import NewsBoard from "@/components/NewsBoard";
import NoticeTicker from "@/components/NoticeTicker";
import QuickServices from "@/components/QuickServices";

/**
 * Five sections, in the order a customer actually needs them:
 * urgent notice → find my task → do my task → get help → read the news.
 * The situation guide, service-center finder and business overview each moved
 * to their own page (/guide, /centers, /about) rather than crowding this one.
 */
export default function Home() {
  return (
    <>
      <NoticeTicker />
      <Hero />
      <QuickServices />
      <MyPanel />
      <NewsBoard />
    </>
  );
}
