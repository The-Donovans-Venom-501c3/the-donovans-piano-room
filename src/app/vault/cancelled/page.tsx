"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import AuthContentWrapper from "@/components/auth/AuthContentWrapper";
import {
  membershipChoiceAtom,
  resetSignupStateAtom,
  signupFormDataAtom,
  signupStepAtom,
} from "@/utils/stores";

function VaultCancelledContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSignupStep = useSetAtom(signupStepAtom);
  const resetSignupState = useSetAtom(resetSignupStateAtom);
  const membershipChoice = useAtomValue(membershipChoiceAtom);
  const formData = useAtomValue(signupFormDataAtom);

  const accountAlreadyCreated = searchParams.get("signup") === "success";
  const canResumeSummary = Boolean(membershipChoice && formData.email);

  const backToSummary = () => {
    setSignupStep(5);
    router.replace("/signup");
  };

  const cancelSignup = () => {
    resetSignupState();
    router.replace("/signup");
  };

  return (
    <AuthContentWrapper>
      <section className="w-full max-w-[620px] rounded-2xl bg-[#2B0A4D] p-8 text-white shadow-2xl sm:p-12">
        <h1 className="font-montserrat text-4xl font-extrabold tracking-tight sm:text-5xl">
          {accountAlreadyCreated ? "Payment method skipped" : "Payment cancelled"}
        </h1>

        {accountAlreadyCreated ? (
          <p className="mt-4 text-base text-purple-200/90 sm:text-lg">
            Your membership is already active. You chose not to link your PayPal
            wallet, so no payment method was saved — you can add one later from
            your account settings.
          </p>
        ) : (
          <p className="mt-4 text-base text-purple-200/90 sm:text-lg">
            Your membership has not been created and you have not been charged.
            You can go back to the summary to review your details and try again,
            or cancel the signup altogether.
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4">
          {accountAlreadyCreated ? (
            <Link
              href="/dashboard"
              className="w-full rounded-full bg-[#EAB308] px-6 py-4 text-center text-lg font-extrabold text-black shadow-md transition-all hover:bg-[#d97706] sm:text-xl"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              {canResumeSummary && (
                <button
                  type="button"
                  onClick={backToSummary}
                  className="w-full rounded-full bg-[#EAB308] px-6 py-4 text-lg font-extrabold text-black shadow-md transition-all hover:bg-[#d97706] sm:text-xl"
                >
                  Back to Summary
                </button>
              )}
              <button
                type="button"
                onClick={cancelSignup}
                className="w-full rounded-full border-2 border-[#FACC15] px-6 py-4 text-lg font-extrabold text-[#FACC15] transition-colors hover:bg-white/5 sm:text-xl"
              >
                Cancel Signup
              </button>
            </>
          )}
        </div>
      </section>
    </AuthContentWrapper>
  );
}

export default function VaultCancelledPage() {
  return (
    <Suspense fallback={null}>
      <VaultCancelledContent />
    </Suspense>
  );
}
