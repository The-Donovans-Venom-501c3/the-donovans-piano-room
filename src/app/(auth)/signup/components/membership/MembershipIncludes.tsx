"use client";

import { validateCouponCode } from "@/lib/api/membershipService";
import { 
  membershipTypes, 
  membershipChoiceAtom, 
  couponVerifiedAtom,
  profileAtom,
  signupFormDataAtom
} from "@/utils/stores";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

const membershipIncludes = {
  [membershipTypes["24-hours"]]: {
    id: 1,
    title: "24 hour access",
    content: [
      ["Flexibility", "A great way to explore all the wonderful games, tools, and resources without long-term commitment."],
      ["Full Access", "Explore all of our musical education tools for a day, including voice lessons and ear training."],
      ["Low Cost", "Great if you are curious to explore our programs before committing."]
    ]
  },
  [membershipTypes["monthly-access"]]: {
    id: 2,
    title: "Monthly access",
    content: [
      ["Flexibility", "Explore all games, tools, and resources. Cancel your subscription anytime."],
      ["Full Access", "Access voice lessons, ear training, live lessons, and new content updates."],
      ["Progress Tracking", "Personalized scoreboard to track your progress over time."]
    ]
  },
  [membershipTypes["scholarship"]]: {
    id: 3,
    title: "Scholarship Access",
    content: [
      ["Full access", "Enjoy the same benefits as a paid membership, which includes the complete library of games, tools, and resources."],
      ["Eligibility", "Available for learners aged 21 and younger (or 60 and older) based on family income requirements."],
      ["Apply or redeem", "Enter a scholarship code if you already have one, or apply to request eligibility."]
    ]
  },
  [membershipTypes["yearly-access"]]: {
    id: 4,
    title: "Yearly access",
    content: [
      ["Cost savings", "By opting for the yearly subscription, you generally receive a discounted rate compared to the monthly subscription."],
      ["Long-term commitment", "Choosing the yearly subscription shows a commitment to the program, beneficial if you intend to use it consistently."]
    ]
  },
  [membershipTypes["basic-access"]]: {
    id: 5,
    title: "Basic access",
    content: [
      ["Free to start", "Sign up at no cost and explore the platform."],
      ["Limited access", "Try a small set of games and resources to preview the experience."],
      ["Upgrade Path", "Unlock full features by moving to a paid membership or scholarship."]
    ]
  }
};

const YellowCheck = () => (
  <div className="w-6 h-6 rounded-full bg-[#FACC15] flex items-center justify-center shrink-0 mt-0.5">
    <svg width="14" height="10" viewBox="0 0 12 9" fill="none">
      <path d="M1 4L4.5 7.5L11 1" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

interface DiscountSectionProps {
  membershipId: number;
  currentKey: string;
  isBeta?: boolean;
}

function DiscountSection({ membershipId, currentKey, isBeta = true }: DiscountSectionProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [isLoading, setIsLoading] = useState(false);

  // Safely retrieve user email dynamically using optional chaining
  const formData = useAtomValue(signupFormDataAtom);
  const profile = useAtomValue(profileAtom);
  const userEmail = formData?.email || profile?.email || "";

  const setIsCouponVerified = useSetAtom(couponVerifiedAtom);
  const isScholarship = currentKey === membershipTypes["scholarship"];

  if (isBeta && !isScholarship) {
    return (
      <div className="pt-2 text-center">
        <p className="text-sm sm:text-base font-bold text-purple-100 tracking-wide">
          Promo codes for this tier are available at a later date.
        </p>
      </div>
    );
  }

  const applyCouponCode = async () => {
    if (!discountCode.trim()) return;

    try {
      setIsLoading(true);
      const isValid = await validateCouponCode(membershipId, userEmail, discountCode);
      if (isValid) {
        setStatus("success");
        setIsCouponVerified(true);
      } else {
        setStatus("error");
        setIsCouponVerified(false);
      }
    } catch (error) {
      setStatus("error");
      setIsCouponVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-2">
      {status === "success" && (
        <div className="mb-3 space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#10B981"/>
              <path d="M4 8L6.5 10.5L12 5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Scholarship code verified successfully
          </p>
          <div className="bg-[#E3DFD5] p-3.5 rounded-2xl text-gray-900">
            <p className="text-xs text-gray-600 font-medium">Scholarship code</p>
            <p className="text-base font-bold tracking-wide mt-0.5">{discountCode}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="flex items-center gap-2 text-sm font-bold text-red-400 mb-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill="#EF4444"/>
            <path d="M5 5L11 11M11 5L5 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Incorrect code. Please try again.
        </p>
      )}

      {status !== "success" && (
        <div>
          <p className="text-sm text-gray-200 font-medium">Already have a code? Enter it below.</p>
          <div className="mt-2.5 flex items-center gap-2.5">
            <input
              type="text"
              placeholder="12345678"
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value);
                if (status === "error") setStatus(null);
              }}
              className={`w-full text-gray-900 text-base font-semibold px-4 py-3 rounded-2xl border transition-all focus:outline-none ${
                status === "error" 
                  ? "bg-red-50 border-red-400 text-red-900" 
                  : "bg-[#FFFDF6] border-transparent"
              }`}
            />
            <button
              type="button"
              onClick={applyCouponCode}
              disabled={isLoading}
              className="bg-[#FACC15] text-black font-extrabold text-base px-6 py-3 rounded-2xl hover:bg-[#eab308] transition-all shrink-0 cursor-pointer"
            >
              {isLoading ? "..." : "Apply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MembershipIncludes({ isBeta = true }: { isBeta?: boolean }) {
  const membershipChoice = useAtomValue(membershipChoiceAtom);

  const currentKey =
    membershipChoice && membershipChoice in membershipIncludes
      ? membershipChoice
      : membershipTypes["basic-access"];

  const membershipChoiceContent = membershipIncludes[currentKey as keyof typeof membershipIncludes];

  return (
    <div className="w-full max-w-[420px] rounded-[32px] bg-[#2A0845] border border-[#3E115E] p-7 text-white flex flex-col justify-between shadow-2xl shrink-0">
      <div>
        <h3 className="flex items-center gap-3 border-b border-purple-800/80 pb-4 text-2xl sm:text-3xl font-bold text-[#FACC15]">
          <div className="w-7 h-7 rounded-full border-2 border-[#FACC15] flex items-center justify-center text-[#FACC15] text-sm font-bold shrink-0">
            i
          </div>
          <span>{membershipChoiceContent.title}</span>
        </h3>

        <ul className="my-6 flex flex-col gap-4">
          {membershipChoiceContent.content.map((item, i) => (
            <li className="flex items-start gap-3.5" key={i}>
              <YellowCheck />
              <div>
                <p className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  {item[0]}
                </p>
                <p className="text-sm sm:text-base text-purple-200/90 mt-1 leading-relaxed font-normal">
                  {item[1]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-purple-800/60 pt-4 shrink-0">
        <DiscountSection 
          key={currentKey} 
          membershipId={membershipChoiceContent.id} 
          currentKey={currentKey}
          isBeta={isBeta}
        />
      </div>
    </div>
  );
}