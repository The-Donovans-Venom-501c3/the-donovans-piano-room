"use client";

import SignupHeader from "../../SignupHeader";
import EmailVerificationForm from "./EmailVerificationForm";
import EmailVerificationSuccessForm from "./EmailVerificationSuccessForm";
import { useState } from "react";

export default function EmailVerificationContent() {
  const [isVerified, setIsVerified] = useState(false);

  const setToIsVerified = () => {
    setIsVerified(true);
  };

  return (
    <section className="w-full max-w-[540px] mx-auto py-8 px-4 flex flex-col justify-center items-center bg-transparent">
      <div className="w-full">
        <SignupHeader 
          navName="Home" 
          navLink="/" 
          stepNum={2} 
          totalSteps={5}
          stepName="Verify your account" 
        />      
        
        <div className="mt-6 w-full">
          {!isVerified ? (
            <EmailVerificationForm setToIsVerified={setToIsVerified} />
          ) : (
            <EmailVerificationSuccessForm />
          )}
        </div>
      </div>
    </section>
  );
}