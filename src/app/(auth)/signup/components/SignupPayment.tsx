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

      {/* Payment Form Area */}
      <div className="my-6 space-y-4 text-white">
        {/* Render payment processing / card entry components here */}
      </div>

      <div className="pt-2 text-center">
        <Button1
          type="button"
          text="Continue to Summary"
          onClick={handleNextStep}
        />
      </div>
    </section>
  );
}