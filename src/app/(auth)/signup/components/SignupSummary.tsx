"use client";

import Link from "next/link";
import Button1 from "@/components/atoms/Button1";
import SignupHeader from "./SignupHeader";
import { useAtomValue, useSetAtom } from "jotai";
import { membershipChoiceAtom, signupStepAtom } from "@/utils/stores";

interface SignupSummaryProps {
  isBeta?: boolean;
  onComplete?: () => void;
}

export default function SignupSummary({
  isBeta = true,
  onComplete,
}: SignupSummaryProps) {
  const setSignupStep = useSetAtom(signupStepAtom);
  const membershipChoice = useAtomValue(membershipChoiceAtom);

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <section className="w-full max-w-lg mx-auto py-8 md:py-12 px-4 flex flex-col justify-center">
      <SignupHeader
        navName="Payment Method"
        navLink="#"
        stepNum={5}
        totalSteps={5}
        stepName="Summary"
        onClickNav={(e) => {
          e.preventDefault();
          setSignupStep(4);
        }}
      />

      {/* Selected Plan Details */}
      <div className="my-6 rounded-2xl bg-[#FEF8EE] p-5 text-primary-brown">
        <h3 className="text-xl font-bold mb-2">Selected Plan</h3>
        <p className="text-2xl font-semibold capitalize">
          {membershipChoice ? membershipChoice.replace("-", " ") : "Free Beta Access"}
        </p>
        <p className="text-lg text-primary-gray mt-1">
          {isBeta ? "Price: $0.00 (Beta Launch)" : "Standard Rate"}
        </p>
      </div>

      {/* Beta Welcome Note */}
      {isBeta && (
        <div className="my-6 space-y-2 text-white">
          <p className="text-lg font-medium text-primary-yellow">
            Ready to explore The Donovan&apos;s Piano Room!
          </p>
          <p className="text-sm text-gray-200 leading-relaxed">
            By clicking finish, your account will be activated with full complimentary Beta access.
          </p>
        </div>
      )}

      {/* Complete Registration CTA */}
      <div className="mt-8">
        <Button1
          text="Complete Registration"
          onClick={handleFinish}
        />
      </div>

      <p className="mt-[4vh] w-full rounded-2xl bg-primary-purple py-3 text-center text-sm md:text-base text-white">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-yellow underline font-semibold">
          Log in
        </Link>
      </p>
    </section>
  );
}