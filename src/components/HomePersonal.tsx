"use client";

import { useAuth } from "@/lib/auth";
import AccountSummary from "./AccountSummary";
import MyPanel from "./MyPanel";

/**
 * The one part of the home page that changes with sign-in state. Everything
 * around it (notice ticker, hero, quick services, news) stays identical, so
 * logging in personalizes the page rather than replacing it.
 *
 * Until the saved session is read (`ready`), render the signed-out panel —
 * it matches the server output, so hydration stays clean.
 */
export default function HomePersonal() {
  const { user, ready } = useAuth();

  if (ready && user) return <AccountSummary user={user} />;
  return <MyPanel />;
}
