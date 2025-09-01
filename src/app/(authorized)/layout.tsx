"use client";

import { guestUser, modalShow, profileAtom } from "@/utils/stores";
import { useAtomValue, useSetAtom } from "jotai";
import React, { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthorizedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const setGuestUser = useSetAtom(guestUser);
  const setShowModal = useSetAtom(modalShow);
  const isGuest = useAtomValue(guestUser);
  const profile = useAtomValue(profileAtom);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/membership/user?userId=${profile.id}`, {
          method: "GET",
          cache: "no-store",
        });

        if (res.status === 410) {
          setGuestUser(true); // guest = true
          return;
        }

        if (!res.ok) {
          setGuestUser(true); // guest = true
          return;
        }

        const data = await res.json();
        console.log("Membership info:", data);
        setGuestUser(false); // guest = false → valid member
      } catch (err) {
        console.error("Error checking membership:", err);
        setGuestUser(true);
        router.replace("/login");
      }
    })();
  }, [setGuestUser, profile.id, router]);

  // 🚨 Extra restriction: Guests cannot access /lessons or /games
  useEffect(() => {
    if (
      isGuest &&
      (pathname.includes("/lessons") || pathname.includes("/games"))
    ) {
      setShowModal(true);
      router.replace("/dashboard");
    }
  }, [isGuest, pathname, router, setShowModal]);

  return <div>{children}</div>;
}
