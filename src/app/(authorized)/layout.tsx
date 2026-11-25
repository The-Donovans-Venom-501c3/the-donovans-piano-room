"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { profileAtom } from "@/utils/stores";
import { getUser } from "@/lib/api/userService";
import "../globals.css";

export default function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useAtom(profileAtom);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const { data, ok } = await getUser();

        if (ok && data?.id) {
          if (isMounted) {
            setProfile(data);
          }
        } else if (isMounted) {
          setProfile(null);
          window.location.href = "/login";
        }
      } catch {
        if (isMounted) {
          setProfile(null);
          window.location.href = "/login";
        }
      }
    };

    verifyAuth();

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

  if (profile?.id) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#521C75] text-white">
      <p className="text-xl font-bold">Verifying Session...</p>
    </div>
  );
}