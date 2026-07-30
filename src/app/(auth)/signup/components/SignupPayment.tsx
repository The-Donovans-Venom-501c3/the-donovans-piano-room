"use client";

import Link from "next/link";
import SignupHeader from "./SignupHeader";
import Button1 from "@/components/atoms/Button1";
import { useSetAtom } from "jotai";
import { signupStepAtom } from "@/utils/stores";

export default function SignupPayment() {
  const setSignupStep = useSetAtom(signupStepAtom);

  const handleNextStep = () => {
    setSignupStep(5);
  };

  return (
    <section className="w-[26vw] min-w-[420px] max-w-[560px] mx-auto py-6 flex flex-col justify-center">
      <SignupHeader
        navName="Membership"
        navLink="#"
        stepNum={4}
        totalSteps={5}
        stepName="Add your payment method"
      />

      <div className="my-6 space-y-4 text-white">
        <p className="text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl font-medium">
          We are not accepting payment during our Beta!
        </p>
        <p className="text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl font-medium">
          If you want to support us by donating view our{" "}
          <Link
            href="https://www.paypal.com/donate?hosted_button_id=3HAXBG4AGR83Y"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            Donation Page.
          </Link>
        </p>
      </div>

      <div className="pt-2">
        <Button1
          type="button"
          text="Continue to Summary"
          onClick={handleNextStep}
        />
      </div>
    </section>
  );
}