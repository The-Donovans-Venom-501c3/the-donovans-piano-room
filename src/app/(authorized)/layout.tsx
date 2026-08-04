"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { profileAtom } from "@/utils/stores";
import { getUser } from "@/lib/api/userService";

export default function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useAtom(profileAtom);
  const [isLoading, setIsLoading] = useState(!profile?.id);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const { data, ok } = await getUser();

        if (ok && data?.id) {
          if (isMounted) {
            setProfile(data);
            setIsLoading(false);
          }
        } else {
          // Unauthenticated: clear profile & force browser redirect to login
          if (isMounted) {
            setProfile(null);
            window.location.href = "/login";
          }
        }
      } catch (err) {
        if (isMounted) {
          setProfile(null);
          window.location.href = "/login";
        }
      }
    };

    verifyAuth();

    // Re-verify session on browser back/forward button clicks
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        verifyAuth();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      isMounted = false;
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [setProfile]);

  // If profile exists in state, render immediately (no stuck loading screen)
  if (profile?.id) {
    return <>{children}</>;
  }

  // Show loading indicator only on initial load without state
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#521C75] text-white">
        <p className="text-xl font-bold">Verifying Session...</p>
      </div>
    );
  }

  return null;
}