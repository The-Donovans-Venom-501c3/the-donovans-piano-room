"use client";

import { useSetAtom } from "jotai";
import { signupStepAtom } from "@/utils/stores";

const GreenCheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#22C55E" />
    <path
      d="M7 12.5L10.5 16L17 9"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function EmailVerificationSuccessForm() {
  const setSignupStep = useSetAtom(signupStepAtom);

  return (
    <div className="mt-6 flex flex-col gap-5 w-full">
      {/* Cream Card showing Verification Successful */}
      <div className="flex items-center gap-4 w-full bg-[#FFFDF6] rounded-2xl px-6 py-5 shadow-sm">
        <GreenCheckIcon />
        <span className="text-gray-900 font-extrabold text-xl">
          Verification Successful
        </span>
      </div>

      {/* Large Yellow Continue Button */}
      <button
        type="button"
        onClick={() => setSignupStep((prev) => prev + 1)}
        className="w-full py-4 px-6 rounded-full bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-xl text-center transition-all cursor-pointer shadow-md"
      >
        Continue to Membership Selection
      </button>
    </div>
  );
}