"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getUserMembership } from "@/lib/api/membershipService";
import { isMembershipRestricted } from "@/lib/membershipExpiration";

export default function MembershipContentGate({
  children,
  required = true,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  const router = useRouter();
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

  return (
    <section className="flex min-h-[58vh] w-full items-center justify-center px-4 py-10">
      <div
        role="status"
        className="w-full max-w-2xl rounded-3xl border border-[#E8D6F5] bg-white p-8 text-center shadow-lg sm:p-12"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8FF] text-3xl text-[#6B21A8]">
          ♫
        </div>
        <h2 className="text-3xl font-extrabold text-[#381E11] sm:text-4xl">
          {checking ? "Checking membership" : "Membership required"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#5B5560] sm:text-xl">
          {checking
            ? "Please wait while we check your membership access."
            : "An active membership is needed to use this area. Choose a plan or renew your membership to unlock it."}
        </p>
        {!checking && (
          <button
            type="button"
            onClick={() => router.push("/account/membership")}
            className="mt-7 rounded-full bg-[#6B21A8] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#581C87]"
          >
            View membership options
          </button>
        )}
      </div>
    </section>
  );
}
