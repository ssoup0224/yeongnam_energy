import Hero from "@/components/Hero";
import HomePersonal from "@/components/HomePersonal";
import NewsBoard from "@/components/NewsBoard";
import NoticeTicker from "@/components/NoticeTicker";
import QuickServices from "@/components/QuickServices";

/**
 * One home layout for everyone: urgent notice → hero → quick services →
 * personal block → news. Signing in doesn't swap the page out; it only
 * personalizes the hero's greeting and the personal block (sign-in panel →
 * account summary). Everything else is identical signed in or out.
 */
export default function Home() {
  return (
    <>
      <NoticeTicker />
      <Hero />
      <QuickServices />
      <HomePersonal />
      <NewsBoard />
    </>
  );
}
