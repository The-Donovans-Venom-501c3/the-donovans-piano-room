"use client";

import Link from "next/link";
import SignupHeader from "./SignupHeader";
import Button1 from "@/components/atoms/Button1";
import { useSetAtom } from "jotai";
import { signupStepAtom } from "@/utils/stores";

export default function SignupPayment() {
  const setSignupStep = useSetAtom(signupStepAtom);

  const handleNextStep = () => {
    // Advance to Step 5 (Summary)
    setSignupStep(5);
  };

  return (
    <section className="w-full max-w-lg mx-auto py-8 md:py-12 px-4 flex flex-col justify-center">
      <SignupHeader
        navName="Membership"
        navLink="#"
        stepNum={4}
        totalSteps={5}
        stepName="Beta Launch Access"
        onClickNav={(e) => {
          e.preventDefault();
          setSignupStep(3);
        }}
      />

      <div className="my-6 space-y-4 rounded-2xl bg-[#FEF8EE] p-6 text-primary-brown">
        <h3 className="text-xl font-bold text-primary-purple">
          No Payment Required During Beta!
        </h3>
        <p className="text-sm md:text-base leading-relaxed">
          During our Beta testing phase, access to all piano games, voice lessons, and educational tools is completely complimentary.
        </p>
        <p className="text-xs md:text-sm text-gray-600">
          If you would like to support our mission as a non-profit organization, you can choose to make a tax-deductible donation anytime on our main site.
        </p>
      </div>

      <div className="pt-2">
        <Button1
          type="button"
          text="Continue to Summary"
          onClick={handleNextStep}
        />
      </div>

      <p className="mt-8 w-full rounded-2xl bg-primary-purple py-3 text-center text-sm md:text-base text-white font-montserrat">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-yellow underline font-semibold">
          Log in
        </Link>
      </p>
    </section>
  );
}