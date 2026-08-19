"use client";

import { FormEvent } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { 
  membershipChoiceAtom, 
  membershipTypes, 
  signupStepAtom, 
  couponVerifiedAtom // Shared state to track coupon success
} from "@/utils/stores";
import SignupHeader from "../SignupHeader";
import MembershipIncludes from "./MembershipIncludes";

interface MembershipSelectionLayoutProps {
  isBeta?: boolean;
}

export default function MembershipSelectionLayout({
  isBeta = true,
}: MembershipSelectionLayoutProps) {
  const [membershipChoice, setMembershipChoice] = useAtom(membershipChoiceAtom);
  const isCouponVerified = useAtomValue(couponVerifiedAtom);
  const setSignupStep = useSetAtom(signupStepAtom);

  const isScholarship = membershipChoice === membershipTypes["scholarship"];

  // Logic to determine if the submit button should be disabled
  const isButtonDisabled = isBeta 
    ? (isScholarship ? !isCouponVerified : true)
    : !membershipChoice;

  const goToPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!isButtonDisabled) {
      setSignupStep((stepN) => stepN + 1);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4">
      {/* Outer wrapper centered on screen */}
      <div className="w-full max-w-[880px] mx-auto flex flex-col md:flex-row gap-8 items-start justify-center">

        {/* LEFT COLUMN */}
        <div className="w-full md:w-[420px] flex flex-col items-start shrink-0">
          
          <div className="w-full mb-6">
            <SignupHeader
              stepName="Select your membership"
              stepNum={3}
              totalSteps={5}
              navLink="/"
              navName="Account"
            />
          </div>

          <form onSubmit={goToPayment} className="w-full flex flex-col gap-5">
            <fieldset className="flex flex-col gap-4 w-full">

              {/* 24-Hour membership */}
              <label
                className={`flex items-center justify-between w-full cursor-pointer rounded-2xl px-5 py-4 border-2 transition-all ${
                  membershipChoice === membershipTypes["24-hours"]
                    ? "bg-[#FDF4FF] border-[#6B21A8] shadow-md"
                    : "bg-[#FFFDF6] border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    className="sr-only"
                    name="membership_option"
                    checked={membershipChoice === membershipTypes["24-hours"]}
                    onChange={() => setMembershipChoice(membershipTypes["24-hours"])}
                  />
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                      membershipChoice === membershipTypes["24-hours"]
                        ? "border-[#6B21A8] bg-[#6B21A8]"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {membershipChoice === membershipTypes["24-hours"] && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-extrabold text-base sm:text-lg whitespace-nowrap">
                      24-Hour membership
                    </p>
                    <p className="text-gray-600 font-semibold text-xs sm:text-sm mt-0.5">
                      $1.99 now <span className="font-normal text-gray-500">($726.35/year, Billed daily)</span>
                    </p>
                  </div>
                </div>
              </label>

              {/* Monthly membership */}
              <label
                className={`flex items-center justify-between w-full cursor-pointer rounded-2xl px-5 py-4 border-2 transition-all ${
                  membershipChoice === membershipTypes["monthly-access"]
                    ? "bg-[#FDF4FF] border-[#6B21A8] shadow-md"
                    : "bg-[#FFFDF6] border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    className="sr-only"
                    name="membership_option"
                    checked={membershipChoice === membershipTypes["monthly-access"]}
                    onChange={() => setMembershipChoice(membershipTypes["monthly-access"])}
                  />
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                      membershipChoice === membershipTypes["monthly-access"]
                        ? "border-[#6B21A8] bg-[#6B21A8]"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {membershipChoice === membershipTypes["monthly-access"] && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-extrabold text-base sm:text-lg whitespace-nowrap">
                      Monthly membership
                    </p>
                    <p className="text-gray-600 font-semibold text-xs sm:text-sm mt-0.5">
                      $29.99/month <span className="font-normal text-gray-500">($359.88/year, Billed monthly)</span>
                    </p>
                  </div>
                </div>
              </label>

              {/* Yearly membership */}
              <label
                className={`relative flex items-center justify-between gap-2 w-full cursor-pointer rounded-2xl px-5 py-4 border-2 transition-all ${
                  membershipChoice === membershipTypes["yearly-access"]
                    ? "bg-[#FDF4FF] border-[#6B21A8] shadow-md"
                    : "bg-[#FFFDF6] border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    className="sr-only"
                    name="membership_option"
                    checked={membershipChoice === membershipTypes["yearly-access"]}
                    onChange={() => setMembershipChoice(membershipTypes["yearly-access"])}
                  />
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                      membershipChoice === membershipTypes["yearly-access"]
                        ? "border-[#6B21A8] bg-[#6B21A8]"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {membershipChoice === membershipTypes["yearly-access"] && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-extrabold text-base sm:text-lg whitespace-nowrap">
                      Yearly membership
                    </p>
                    <p className="text-gray-600 font-semibold text-xs sm:text-sm mt-0.5">
                      $239.88/year <span className="font-normal text-gray-500">($19.99/mo, Billed yearly)</span>
                    </p>
                  </div>
                </div>
                <span className="bg-[#FACC15] text-black font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">
                  most popular
                </span>
              </label>

              {/* Basic membership */}
              <label
                className={`flex items-center justify-between w-full cursor-pointer rounded-2xl px-5 py-4 border-2 transition-all ${
                  membershipChoice === membershipTypes["basic-access"]
                    ? "bg-[#FDF4FF] border-[#6B21A8] shadow-md"
                    : "bg-[#FFFDF6] border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    className="sr-only"
                    name="membership_option"
                    checked={membershipChoice === membershipTypes["basic-access"]}
                    onChange={() => setMembershipChoice(membershipTypes["basic-access"])}
                  />
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                      membershipChoice === membershipTypes["basic-access"]
                        ? "border-[#6B21A8] bg-[#6B21A8]"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {membershipChoice === membershipTypes["basic-access"] && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-extrabold text-base sm:text-lg whitespace-nowrap">
                      Basic membership
                    </p>
                    <p className="text-gray-600 font-semibold text-xs sm:text-sm mt-0.5">
                      Free (limited access)
                    </p>
                  </div>
                </div>
              </label>

              {/* Scholarship */}
              <label
                className={`flex items-center justify-between gap-2 w-full cursor-pointer rounded-2xl px-5 py-4 border-2 transition-all ${
                  membershipChoice === membershipTypes["scholarship"]
                    ? "bg-[#FDF4FF] border-[#6B21A8] shadow-md"
                    : "bg-[#FFFDF6] border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    className="sr-only"
                    name="membership_option"
                    checked={membershipChoice === membershipTypes["scholarship"]}
                    onChange={() => setMembershipChoice(membershipTypes["scholarship"])}
                  />
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                      membershipChoice === membershipTypes["scholarship"]
                        ? "border-[#6B21A8] bg-[#6B21A8]"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {membershipChoice === membershipTypes["scholarship"] && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-900 font-extrabold text-base sm:text-lg whitespace-nowrap">
                    Scholarship
                  </span>
                </div>
                <span className="text-gray-700 font-bold text-xs sm:text-sm underline shrink-0 whitespace-nowrap">
                  Apply or redeem
                </span>
              </label>
            </fieldset>

            {/* CTA Button Dynamic Rendering */}
            <div className="w-full pt-2">
              {isBeta && membershipChoice && !isScholarship ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-4 px-5 rounded-full bg-[#BBB5C6] text-gray-800 font-extrabold text-base cursor-not-allowed text-center transition-all shadow-md"
                >
                  Available at a Later Date
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={`w-full py-4 px-5 rounded-full font-extrabold text-base text-center transition-all shadow-md ${
                    !isButtonDisabled
                      ? "bg-[#FACC15] text-black hover:bg-[#eab308] cursor-pointer"
                      : "bg-[#BBB5C6] text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {isScholarship && !isCouponVerified 
                    ? "Enter Scholarship Code" 
                    : "Continue to payment method"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-[420px] shrink-0 md:pt-[118px]">
          <MembershipIncludes isBeta={isBeta} />
        </div>

      </div>
    </div>
  );
}