import Button1 from "@/components/atoms/Button1";
import Button2 from "@/components/atoms/Button2";
import InputForm from "@/components/atoms/form-input";
import { validateCouponCode } from "@/lib/api/membershipService";
import { membershipTypes, membershipChoiceAtom } from "@/utils/stores";
import { Button } from "@mui/material";
import { stat } from "fs";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { useEffect, useState } from "react";
import { set } from "zod";

export default function MembershipIncludes() {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const membershipChoice = useAtomValue(membershipChoiceAtom);

  const membershipChoiceContent = membershipIncludes[membershipChoice!];
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset the discount input and status when membershipChoice changes
    setShowDiscountInput(false);
    setDiscountCode("");
    setStatus(null);
  }, [membershipChoice]);

  const applyCouponCode = async () => {
    try {
      setIsLoading(true);
      const isValid = await validateCouponCode(
        membershipChoiceContent.id,
        discountCode,
      );
      console.log(isValid);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    membershipChoice && (
      <div className="fixed right-[26vw] h-auto w-[22vw] rounded-3xl bg-tertiary-purple p-6 3xl:right-[23vw] 3xl:w-[27vw]">
        <h3 className="flex gap-2 border-b-2 border-b-primary-yellow pb-3 text-[16px] font-semibold text-primary-yellow 2xl:text-3xl 4xl:pb-6 4xl:text-4xl">
          <Image
            src="/auth/membershipTitleWaring.svg"
            width={20}
            height={20}
            alt=""
          />{" "}
          <p className="py-3 text-5xl">{membershipChoiceContent.title}</p>
        </h3>
        <ul className="my-4 border-b-2 border-primary-purple pb-3 4xl:pb-6">
          {membershipChoiceContent.content.map((item, i) => (
            <div key={i} className="flex">
              <div className="mx-3 mt-2 flex-[1] pt-1 4xl:mt-4">
                <Image src="/auth/tick.svg" width={30} height={30} alt="" />
              </div>
              <li className="mt-2 flex-[15] text-white 4xl:mt-4">
                <p className="flex-row text-[12px] 2xl:text-2xl 4xl:text-3xl ">
                  <span className="mr-1 flex pb-4 font-semibold">
                    {item[0]}
                  </span>
                  <p className=" text-xl ">{item[1]}</p>
                </p>
              </li>
            </div>
          ))}
        </ul>
        {membershipChoice === "scholarship" && (
          <div className="py-3">
            <Button2
              text="Apply for Scholorship"
              disable={!membershipChoice ? true : false}
              // onClick={goToPayment}
            />
          </div>
        )}
        <div>
          {status === "success" ? (
            <p className="mb-2 flex items-center gap-2">
              <Image src="/Success.svg" width={18} height={18} alt="" />
              <span className="text-[12px] text-white 2xl:text-4xl 4xl:text-2xl">
                Discound code applied
              </span>
            </p>
          ) : (
            <p className="mb-2 text-[12px] text-white">
              {membershipChoice !== "scholarship"
                ? "Have a discount code?   "
                : "Apply your code here   "}
              <span
                className="cursor-pointer text-primary-yellow underline"
                onClick={() => setShowDiscountInput((prev) => !prev)}
              >
                Enter here
              </span>
            </p>
          )}

          {showDiscountInput && (
            <div className="flex items-center">
              <div style={{ flex: status !== "success" ? 1 : "none" }}>
                <InputForm
                  onChange={(e: any) => setDiscountCode(e.target.value)}
                  field={{
                    type: "text",
                    name: "discount-code",
                    label: "Discount code",
                  }}
                  text={discountCode}
                  error={
                    status === "error"
                      ? "Invalid discount code, please try again"
                      : ""
                  }
                  disabled={status === "success"}
                />
              </div>
              {status !== "success" && (
                <Button1
                  style={{
                    "margin-left": "4px",
                    width: "89px",
                    height: "40px",
                  }}
                  disabled={isLoading}
                  text="Apply"
                  onClick={applyCouponCode}
                />
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
}

const membershipIncludes = {
  ["24-hours"]: {
    id: 1,
    title: "24 hour access",
    content: [
      [
        "Flexibility",
        "Explore the full platform for a single day without commitment.",
      ],
      [
        "Full Access",
        "Try all musical education tools, including voice lessons, ear training, and resources.",
      ],
      [
        "Low Cost",
        "A budget-friendly way to preview the program before choosing a longer plan.",
      ],
    ],
  },
  ["monthly-access"]: {
    id: 2,
    title: "Monthly access",
    content: [
      [
        "Flexibility",
        "Enjoy all games, tools, and resources with the freedom to cancel anytime.",
      ],
      [
        "Full Access",
        "Unlock the complete library, including lessons, recordings, and new content.",
      ],
      [
        "Progress Tracking",
        "Monitor your learning with a personalized scoreboard to see your growth.",
      ],
    ],
  },
  ["basic"]: {
    id: 2,
    title: "Basic access",
    content: [
      ["Free to start", "Sign up at no cost and explore the platform."],
      [
        "Limited Access",
        "Try a small set of games and resources to preview the experience.",
      ],
      [
        "Upgrade Path Available",
        "Unlock progress tracking, the full library, and community features by moving to a paid membership or scholarship.",
      ],
    ],
  },
  ["scholarship"]: {
    id: 3,
    title: "Scholarship access",
    content: [
      [
        "Full Access",
        "Enjoy the same benefits as a paid membership, including the complete library of games, tools, and resources.",
      ],
      [
        "Eligibility",
        "Available for learners aged 21 and younger, or 60 and older, based on family income requirements.",
      ],
      [
        "Apply or redeem",
        "Enter a scholarship code if you already have one, or apply to request eligibility.",
      ],
    ],
  },
  ["yearly-access"]: {
    id: 4,
    title: "Yearly access",
    content: [
      [
        "Cost savings",
        "Save $59.89 compared to paying monthly for 12 individual months.",
      ],
      [
        "Long-term commitment",
        "Best if you plan to use the program consistently throughout the year.",
      ],
      [
        "One-time payment",
        "Pay once for the year and enjoy uninterrupted access without monthly renewals.",
      ],
    ],
  },
};
