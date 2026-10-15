"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import Dashboard from "./Dashboard";

/**
 * Chooses the home experience based on the mock session:
 * • signed in  → personalized dashboard (+ the shared news board)
 * • signed out → the marketing home
 *
 * Until the saved session has been read (`ready`), we render the marketing
 * view — it matches the server output, so there's no hydration mismatch.
 */
export default function HomeView({
  loggedOut,
  news,
}: {
  loggedOut: ReactNode;
  news: ReactNode;
}) {
  const { user, ready } = useAuth();

  if (ready && user) {
    return (
      <>
        <Dashboard user={user} />
        {news}
      </>
    );
  }

  return (
    <>
      {loggedOut}
      {news}
    </>
  );
}
