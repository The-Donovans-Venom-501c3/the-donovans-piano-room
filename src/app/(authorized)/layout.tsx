"use client";

import { guestUser, modalShow, profileAtom } from "@/utils/stores";
import { useAtomValue, useSetAtom } from "jotai";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import FullScreenMessage from "@/components/non_member/FullScreenMessage";

export default function AuthorizedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const setGuestUser = useSetAtom(guestUser);
  const setShowModal = useSetAtom(modalShow);
  const profile = useAtomValue(profileAtom);
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await fetch(`/api/membership/user`, {
          method: "GET",
          cache: "no-store",
        });

        if (res.status === 410) {
          if (!isMounted) return;
          setGuestUser(true);
          if (pathname.includes("/lessons") || pathname.includes("/games")) {
            setShowModal(true);
            router.replace("/dashboard");
          }
          return;
        }

        if (!res.ok) {
          if (!isMounted) return;
          setGuestUser(true);
          return;
        }

        const data = await res.json();
        console.log("Membership info:", data);

        if (isMounted) {
          setGuestUser(false);
          setAuthorized(true);
        }
      } catch (err) {
        console.error("Error checking membership:", err);
        if (isMounted) {
          setGuestUser(true);
          router.replace("/login");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [profile.id, pathname, router, setGuestUser, setShowModal]);

  if (loading && pathname.includes("/lessons")) {
    return (
      <FullScreenMessage
        title="Access Denied"
        message="🚫 You must be a member to access this page."
      />
    );
  }
  // If not authorized and on protected path, don't render anything
  if (!authorized && loading && pathname.includes("/lessons")) {
    return <></>;
  }

  return <>{children}</>;
}
