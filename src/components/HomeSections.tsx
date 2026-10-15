"use client";

import { useAuth } from "@/lib/auth";
import QuickServices from "./QuickServices";
import UsagePanel from "./UsagePanel";
import EmergencyStrip from "./EmergencyStrip";
import MyPanel from "./MyPanel";

/**
 * The home sections between the hero and the news board. Order personalizes:
 *
 *  signed in → usage (bill is already in the hero) → quick services → safety
 *  signed out → quick services → sign-in / getting-started
 *
 * Until the saved session is read (`ready`), render the signed-out order so
 * the first client render matches the server output.
 */
export default function HomeSections() {
  const { user, ready } = useAuth();

  if (ready && user) {
    return (
      <>
        <UsagePanel user={user} />
        <QuickServices />
        <EmergencyStrip />
      </>
    );
  }

  return (
    <>
      <QuickServices />
      <MyPanel />
    </>
  );
}
