import Button1 from "@/components/atoms/Button1";
import InputForm from "@/components/atoms/form-input";
import { validateCouponCode } from "@/lib/api/membershipService";
import { membershipTypes, membershipChoiceAtom } from "@/utils/stores";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { useEffect, useState, ChangeEvent } from "react";

const membershipIncludes = {
  [membershipTypes["24-hours"]]: {
    id: 1,
    title: "24 hour access",
    content: [
      ["Flexibility:", "A great way to explore all the wonderful games, tools, and resources The Donovan's Piano Room offers, without the long-term commitment."],
      ["Full Access:", "The 24-hour Membership allows you to explore all of our musical education tools for a day, including voice lessons, ear training, and more."],
      ["Low Cost:", "This option is great if you are curious about what we have to offer, but want to explore our programs before deciding on a long-term commitment."]
    ]
  },
  [membershipTypes["monthly-access"]]: {
    id: 2,
    title: "Monthly access",
    content: [
      ["Flexibility:", "A great way to explore all the wonderful games, tools, and resources The Donovans Piano Room offers, without the long-term commitment. Members can cancel their subscription anytime."],
      ["Full Access:", "The Monthly Membership allows you to explore all of our musical education tools, including voice lessons, ear training, and more. Monthly members can take advantage of live lessons and their recordings, as well as new and exciting content."],
      ["Progress Tracking:", "With a monthly membership, you have access to your personalized game scoreboard. You can track your progress and see how much you've learned over time!"]
    ]
  },
  [membershipTypes["scholarship"]]: {
    id: 3,
    title: "Scholarship access",
    content: [
      ["Full Access:", "Students are provided with full access to The Donovan's Piano Room, where they can use the many games, tools, and resources, to enhance their musical education."],
      ["Eligibility:", "Scholarships are available for individuals aged 21 and younger, and those aged 60 and older. Eligibility for the scholarships is based on family income being below the Federal Poverty Level (FPL)."]
    ]
  },
  [membershipTypes["yearly-access"]]: {
    id: 4,
    title: "Yearly access",
    content: [
      ["Cost savings:", "By opting for the yearly subscription, you generally receive a discounted rate compared to the monthly subscription. In this case, the yearly option offers a cost savings of $59.89 compared to paying for 12 months individually."],
      ["Long-term commitment:", "Choosing the yearly subscription shows a commitment to the program, which can be beneficial if you have a positive experience and intend to use it consistently throughout the year."]
    ]
  }
};

export default function MembershipIncludes() {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const membershipChoice = useAtomValue(membershipChoiceAtom);
  const membershipChoiceContent = membershipChoice ? membershipIncludes[membershipChoice] : null;
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset inputs when membershipChoice changes
    setShowDiscountInput(false);
    setDiscountCode("");
    setStatus(null);
  }, [membershipChoice]);

  const applyCouponCode = async () => {
    if (!discountCode.trim() || !membershipChoiceContent) return;

    try {
      setIsLoading(true);
      const isValid = await validateCouponCode(membershipChoiceContent.id, discountCode);
      if (isValid) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!membershipChoice || !membershipChoiceContent) return null;

  return (
    <div className="fixed right-[25vw] top-1/4 z-10 h-auto w-[24vw] rounded-3xl bg-tertiary-purple p-6 3xl:right-[23vw] 3xl:w-[26vw]">
      <h3 className="flex items-center gap-2 border-b-2 border-b-primary-yellow pb-3 text-[16px] font-semibold text-primary-yellow 2xl:text-3xl 4xl:pb-6 4xl:text-4xl">
        <Image src="/auth/membershipTitleWaring.svg" width={20} height={20} alt="" />
        {membershipChoiceContent.title}
      </h3>

      <ul className="my-4 border-b-2 border-primary-purple pb-3 4xl:pb-6">
        {membershipChoiceContent.content.map((item, i) => (
          <li className="mt-2 text-white 4xl:mt-4" key={i}>
            <p className="text-[12px] 2xl:text-2xl 4xl:text-3xl">
              <span className="mr-1 font-semibold">{item[0]}</span>
              {item[1]}
            </p>
          </li>
        ))}
      </ul>

      <div>
        {status === "success" ? (
          <p className="mb-2 flex items-center gap-2">
            <Image src="/Success.svg" width={18} height={18} alt="" />
            <span className="text-[12px] text-white 2xl:text-4xl 4xl:text-2xl">
              Discount code applied
            </span>
          </p>
        ) : (
          <p className="mb-2 text-[12px] text-white 2xl:text-4xl 4xl:mt-4 4xl:text-2xl">
            Enter your discount code{" "}
            <span
              className="cursor-pointer text-primary-yellow underline"
              onClick={() => setShowDiscountInput((prev) => !prev)}
            >
              here
            </span>
          </p>
        )}

        {showDiscountInput && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1">
              <InputForm
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}
                field={{ type: "text", name: "discount-code", label: "Discount code" }}
                text={discountCode}
                error={status === "error" ? "Invalid discount code, please try again" : ""}
                disabled={status === "success"}
              />
            </div>
            {status !== "success" && (
              <Button1
                style={{ width: "89px", height: "40px" }}
                disabled={isLoading}
                text={isLoading ? "..." : "Apply"}
                onClick={applyCouponCode}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}