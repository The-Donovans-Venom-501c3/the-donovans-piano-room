"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plan } from "@/interfaces/membershipInterface";

export interface PlanCardProps {
  plan: Plan;
  isScholarship?: boolean;
  showCurrentInHeader?: boolean;
  showExpirationMessage?: boolean;
  showChooseButton?: boolean;
  isBeta?: boolean;
  chooseButton?: {
    text?: string;
    onClick?: () => void;
    disabled?: boolean;
    style?: string;
  };
  onToggleBenefits?: () => void;
}

export default function PlanCard({
  plan,
  isScholarship: isScholarshipProp = false,
  showCurrentInHeader = true,
  showExpirationMessage = true,
  chooseButton,
  isBeta = true,
}: PlanCardProps) {
  const router = useRouter();
  const isScholarship = isScholarshipProp || plan?.planName === "Scholarship";
  const isCurrentPlan = isScholarship || plan?.isCurrent;

  const cleanPrice = String(plan?.price || plan?.formattedPrice || "")
    .replace(/\$/g, "")
    .trim();
  const cleanYearlyPrice = String(plan?.yearlyPrice || "")
    .replace(/\$/g, "")
    .trim();

  const getTheme = () => {
    if (isScholarship) {
      return {
        cardBorder: "border-2 border-[#E07A2A] shadow-lg ring-2 ring-[#E07A2A]/20",
        topAreaStyle: { backgroundColor: "#FFEBD5" },
        buttonBg: "bg-[#E07A2A] text-white hover:bg-[#c8671b]",
        currentBtnBg: "bg-[#FDE2C6] text-[#C05600] hover:bg-[#fbd3ad] cursor-pointer transition-colors",
        checkBg: "bg-[#EA580C] text-white",
        musicColor: "#E07A2A",
        badgeBg: "bg-[#E07A2A] text-white",
      };
    }

    switch (plan?.planName) {
      case "Yearly":
        return {
          cardBorder: "border-2 border-gray-200 shadow-md",
          topAreaStyle: { backgroundColor: "#FFF9E3" },
          buttonBg: "bg-[#D9A01D] text-white hover:bg-[#C28E18]",
          currentBtnBg: "bg-[#D4EAD6] text-[#1E6038] hover:bg-[#c3e4c6] cursor-pointer transition-colors",
          checkBg: "bg-[#D9A01D] text-white",
          musicColor: "#D9A01D",
          badgeBg: "bg-[#D9A01D] text-white",
        };
      case "Monthly":
        return {
          cardBorder: "border-2 border-gray-200 shadow-md",
          topAreaStyle: { backgroundColor: "#EBF5EC" },
          buttonBg: "bg-[#337A43] text-white hover:bg-[#286135]",
          currentBtnBg: "bg-[#D4EAD6] text-[#1E6038] hover:bg-[#c3e4c6] cursor-pointer transition-colors",
          checkBg: "bg-[#337A43] text-white",
          musicColor: "#337A43",
          badgeBg: "bg-[#337A43] text-white",
        };
      case "Day Pass":
      default:
        return {
          cardBorder: "border-2 border-gray-200 shadow-md",
          topAreaStyle: { backgroundColor: "#F7F0FC" },
          buttonBg: "bg-[#6B21A8] text-white hover:bg-[#581C87]",
          currentBtnBg: "bg-[#D4EAD6] text-[#1E6038] hover:bg-[#c3e4c6] cursor-pointer transition-colors",
          checkBg: "bg-[#6B21A8] text-white",
          musicColor: "#6B21A8",
          badgeBg: "bg-[#6B21A8] text-white",
        };
    }
  };

  const theme = getTheme();

  const handleCurrentPlanClick = () => {
    if (chooseButton?.onClick) {
      chooseButton.onClick();
    } else {
      router.push("/account/membership");
    }
  };

  return (
    <div
      className={`relative flex flex-col w-full h-full rounded-3xl overflow-hidden bg-white transition-all duration-200 ${
        theme.cardBorder
      } ${
        isCurrentPlan
          ? "scale-[1.03] z-10 shadow-xl transition-transform duration-200"
          : ""
      }`}
    >
      {/* HEADER AREA */}
      <div
        style={theme.topAreaStyle}
        className="flex flex-col relative p-6 pb-6 overflow-hidden"
      >
        {/* Background Graphic */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-15">
          <svg
            className="absolute -top-3 -left-3 w-20 h-20"
            viewBox="0 0 24 24"
            fill={theme.musicColor}
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          <svg
            className="absolute top-4 -right-3 w-24 h-24"
            viewBox="0 0 24 24"
            fill={theme.musicColor}
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>

        <div className="flex items-start justify-between z-10 mb-2 gap-2">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
            {isScholarship ? "Scholarship" : plan?.planName}
          </h3>

          <div className="flex items-center shrink-0 gap-1.5">
            {isCurrentPlan && showCurrentInHeader && (
              <span
                className={`rounded-lg px-3 py-1 text-xs font-black tracking-wide ${theme.badgeBg}`}
              >
                Current plan
              </span>
            )}

            {!isCurrentPlan && plan?.planName === "Yearly" && (
              <span className="rounded-lg bg-[#FDE047] px-3 py-1 text-xs font-black text-gray-900">
                Popular
              </span>
            )}

            {!isCurrentPlan && plan?.planName === "Monthly" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#A7F3D0] px-3 py-1 text-xs font-black text-[#065F46]">
                ★ Recommended
              </span>
            )}
          </div>
        </div>

        {/* PRICE DISPLAY */}
        <div className="flex flex-col items-center justify-center text-center my-3 z-10 min-h-[90px]">
          {isScholarship ? (
            <>
              <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                FREE
              </div>
              <p className="mt-2 text-xs sm:text-sm leading-snug text-gray-900 font-extrabold px-1">
                Eligibility for the scholarships is based on family income being
                below the Federal Poverty Level (FPL).
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                ${cleanPrice}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-gray-900 mt-1">
                {plan?.planName === "Day Pass" ? "one day" : "per month"}
              </div>
              {cleanYearlyPrice && (
                <div className="text-xs sm:text-sm font-bold text-gray-700 mt-0.5">
                  ${cleanYearlyPrice}/year, Billed{" "}
                  {plan?.planName === "Day Pass"
                    ? "daily"
                    : plan?.planName?.toLowerCase()}
                </div>
              )}
            </>
          )}
        </div>

        {/* BUTTON AREA */}
        <div className="mt-3 flex flex-col items-center w-full z-10">
          {isCurrentPlan ? (
            <div className="w-full flex flex-col items-center">
              <button
                type="button"
                onClick={handleCurrentPlanClick}
                className={`w-full py-3 px-4 rounded-full text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 ${theme.currentBtnBg}`}
              >
                <Image
                  className="h-4 w-4 shrink-0"
                  src="/memberships/upgrade/request_quote_FILL0_wght400_GRAD0_opsz24 1.svg"
                  alt="Current plan"
                  width={16}
                  height={16}
                />
                Current plan
              </button>
              {showExpirationMessage && (
                <p className="text-xs font-bold text-gray-700 text-center mt-2">
                  * Membership expires after 1 Day
                </p>
              )}
            </div>
          ) : (
            <button
              disabled={isBeta || chooseButton?.disabled}
              onClick={isBeta ? undefined : chooseButton?.onClick}
              className={`w-full py-3 px-4 rounded-full text-sm sm:text-base font-black transition-all ${
                isBeta
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 pointer-events-none shadow-none"
                  : `active:scale-95 cursor-pointer shadow-md ${theme.buttonBg}`
              }`}
            >
              {isBeta ? "Choose plan" : chooseButton?.text || "Choose plan"}
            </button>
          )}
        </div>
      </div>

      {/* LOWER BENEFITS AREA */}
      <div className="flex-1 flex flex-col justify-between p-6 bg-white">
        <ul className="space-y-3">
          {plan?.benefits?.map((benefit, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm sm:text-base font-bold text-gray-900 leading-snug"
            >
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black shrink-0 mt-0.5 ${theme.checkBg}`}
              >
                ✓
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}