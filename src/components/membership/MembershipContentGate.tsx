"use client";

import { useEffect, useState, type ReactNode } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { getUserMembership } from "@/lib/api/membershipService";
import { isMembershipRestricted } from "@/lib/membershipExpiration";
import MembershipRequiredBanner from "@/components/membership/MembershipRequiredBanner";

export default function MembershipContentGate({
  children,
  required = true,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  const [checking, setChecking] = useState(required);
  const [restricted, setRestricted] = useState(false);

  useEffect(() => {
    if (!required) {
      setChecking(false);
      setRestricted(false);
      return;
    }

    let active = true;
    const refreshMembership = async () => {
      setChecking(true);
      try {
        const membership = await getUserMembership();
        if (active) setRestricted(isMembershipRestricted(membership));
      } catch {
        // Fail closed on protected content if membership status cannot be checked.
        if (active) setRestricted(true);
      } finally {
        if (active) setChecking(false);
      }
    };

    void refreshMembership();
    window.addEventListener("membership-updated", refreshMembership);
    window.addEventListener("focus", refreshMembership);
    window.addEventListener("pageshow", refreshMembership);
    return () => {
      active = false;
      window.removeEventListener("membership-updated", refreshMembership);
      window.removeEventListener("focus", refreshMembership);
      window.removeEventListener("pageshow", refreshMembership);
    };
  }, [required]);

  if (!required || (!checking && !restricted)) return <>{children}</>;

  if (checking) {
    return (
      <div className="flex min-h-[58vh] w-full flex-col items-center justify-center gap-4">
        <CircularProgress size={48} />
        <p className="text-lg font-semibold text-gray-600">Checking membership...</p>
      </div>
    );
  }

  return (
    <section className="flex min-h-[58vh] w-full items-center justify-center px-4 py-10">
      <MembershipRequiredBanner
        membershipHref="/account/membership"
        membershipLinkText="View Membership Options"
      />
    </section>
  );
}
