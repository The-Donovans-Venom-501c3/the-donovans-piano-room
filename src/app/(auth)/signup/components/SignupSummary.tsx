"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { 
  membershipChoiceAtom, 
  membershipTypes, 
  signupStepAtom, 
  signupFormDataAtom, 
  profileAtom 
} from "@/utils/stores";

interface SignupSummaryProps {
  onComplete?: () => void;
}

const membershipDetails: Record<string, { label: string; price: number; id: number }> = {
  [membershipTypes["24-hours"]]: { label: "24-Hour Membership", price: 1.99, id: 1 },
  [membershipTypes["monthly-access"]]: { label: "Monthly Membership", price: 29.99, id: 2 },
  [membershipTypes["scholarship"]]: { label: "Free Beta Membership", price: 0, id: 3 },
  [membershipTypes["yearly-access"]]: { label: "Yearly Membership", price: 239.88, id: 4 },
  [membershipTypes["basic-access"]]: { label: "Basic Membership", price: 0, id: 5 },
};

export default function SignupSummary({ onComplete }: SignupSummaryProps) {
  const setSignupStep = useSetAtom(signupStepAtom);
  const membershipChoice = useAtomValue(membershipChoiceAtom);
  const formData = useAtomValue(signupFormDataAtom);
  const profile = useAtomValue(profileAtom);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selected = membershipChoice ? membershipDetails[membershipChoice] : null;

  // Safely evaluate fields using optional chaining
  const userEmail = formData?.email || profile?.email || "";
  const userName = formData?.fullName || profile?.fullName || "";
  const membershipId = selected ? selected.id : 3;

  // Fixed static end date regardless of sign-up timestamp
  const END_DATE_TEXT = "Membership ends November 27, 2026";

  const handleFinish = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/complete-signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          membershipId: membershipId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create account and membership.");
      }

      if (onComplete) {
        onComplete();
      } else {
        setSignupStep(6); // Advance to Success Screen
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSignupStep(1);
  };

  return (
    <div className="w-full flex items-center justify-center py-6">
      <section className="w-full max-w-[620px]">
        <div className="bg-[#2B0A4D] rounded-2xl p-8 sm:p-12 text-white shadow-2xl">
          
          {/* Header */}
          <h1 className="font-montserrat text-5xl sm:text-6xl font-extrabold mb-1 tracking-tight">
            Summary
          </h1>
          <p className="text-base sm:text-lg text-purple-200/90 mb-8 font-medium">
            Step 5 of 5
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl text-sm font-semibold">
              {errorMessage}
            </div>
          )}

          <div className="space-y-7">
            {/* Name */}
            <div>
              <p className="text-[#FACC15] font-extrabold text-xl sm:text-2xl">Name</p>
              <p className="text-white font-semibold text-lg sm:text-xl mt-1">
                {userName}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-[#FACC15] font-extrabold text-xl sm:text-2xl">Email</p>
              <p className="text-white font-semibold text-lg sm:text-xl mt-1">
                {userEmail}
              </p>
            </div>

            {/* Membership */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[#FACC15] font-extrabold text-xl sm:text-2xl">Membership</p>
                <p className="text-white font-semibold text-lg sm:text-xl mt-1">
                  {selected ? selected.label : "Free Beta Membership"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSignupStep(3)}
                className="text-white text-base sm:text-lg font-bold underline hover:opacity-80 transition-opacity shrink-0 mt-0.5 cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Total & Fixed End Date */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[#FACC15] font-extrabold text-xl sm:text-2xl">Total</p>
                <p className="text-white font-bold text-xl sm:text-2xl">
                  ${selected ? selected.price.toFixed(2) : "0.00"}
                </p>
              </div>
              <p className="text-right text-sm sm:text-base text-purple-200/90 font-medium mt-1">
                {END_DATE_TEXT}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col gap-4">
            <button
              type="button"
              onClick={handleFinish}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-full font-extrabold text-lg sm:text-xl transition-all shadow-md text-center ${
                isLoading
                  ? "bg-[#BBB5C6] text-gray-700 cursor-not-allowed"
                  : "bg-[#EAB308] hover:bg-[#d97706] text-black cursor-pointer"
              }`}
            >
              {isLoading ? "Setting up membership..." : "Complete Setting up Membership"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-full border-2 border-[#FACC15] text-[#FACC15] font-extrabold text-lg sm:text-xl hover:bg-white/5 transition-colors cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}