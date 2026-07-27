"use client";

import Link from "next/link";
import SignupHeader from "../../SignupHeader";
import EmailVerificationForm from "./EmailVerificationForm";
import EmailVerificationSuccessForm from "./EmailVerificationSuccessForm";
import { useState } from "react";

export default function EmailVerificationContent() {
  const [isVerified, setIsVerified] = useState(false); // switch between the components 
  const setToIsVerified = () => { setIsVerified(true); };

  return (
    <section className="w-full max-w-lg mx-auto py-8 md:py-12 px-4 flex flex-col justify-center">
      <SignupHeader 
        navName="Home" 
        navLink="/" 
        stepNum={2} 
        totalSteps={5}
        stepName="Verify your account" 
      />      
      
      <div className="mt-4">
        {!isVerified ? (
          <EmailVerificationForm setToIsVerified={setToIsVerified} />
        ) : (
          <EmailVerificationSuccessForm />
        )}
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