import { membershipChoiceAtom, membershipTypes, singupStepAtom } from "@/utils/stores";
import { useAtom, useSetAtom } from "jotai";
import Link from "next/link";
import SignupHeader from "../SignupHeader";
import Button2 from "@/components/atoms/Button2";
import { FormEvent } from "react";

interface MembershipSelectionLayoutProps {
  isBeta?: boolean; // Controls Beta Launch behavior
}

export default function MembershipSelectionLayout({
  isBeta = true, // Defaults to true for Beta Launch
}: MembershipSelectionLayoutProps) {
  const [membershipChoice, setMembershipChoice] = useAtom(membershipChoiceAtom);
  const setSingupStep = useSetAtom(singupStepAtom);

  // Checks if the user selected Scholarship
  const isScholarship = membershipChoice === membershipTypes["scholarship"];

  // During Beta mode, the submission button is disabled for all plans EXCEPT Scholarship
  const isButtonDisabled = !membershipChoice || (isBeta && !isScholarship);

  const goToPayment = (e: FormEvent) => {
    e.preventDefault();
    if (membershipChoice && !isButtonDisabled) {
      setSingupStep((stepN) => stepN + 1);
    }
  };

  // Dynamic button label based on Beta state and selection
  const getButtonText = () => {
    if (isBeta && !isScholarship) {
      return "Available at a Later Date";
    }
    if (isScholarship) {
      return "Apply or Redeem";
    }
    return "Continue to payment method";
  };

  return (
    <section className={membershipChoice ? "absolute left-[25vw] 3xl:left-[23vw]" : ""}>
      <SignupHeader
        stepName="Select your membership"
        stepNum={3}
        totalSteps={4}
        navLink="#"
        navName="Account"
        onClickNav={(e) => {
          e.preventDefault();
          setSingupStep(1);
        }}
      />

      <form onSubmit={goToPayment}>
        <fieldset className="flex w-[24vw] flex-col 3xl:w-[26vw]">
          {/* Option 1: 24 Hour Membership */}
          <label className="mb-6 flex w-full cursor-pointer gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8">
            <input
              type="radio"
              className="h-6 w-6 accent-primary-purple cursor-pointer"
              name="membership_option"
              value="1"
              checked={membershipChoice === membershipTypes["24-hours"]}
              onChange={() => setMembershipChoice(membershipTypes["24-hours"])}
            />
            <div className="flex w-full justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <p className="text-primary-brown">24-Hour membership</p>
              <p className="text-black">$1.99 now</p>
            </div>
          </label>

          {/* Option 2: Monthly Membership */}
          <label className="mb-6 flex w-full cursor-pointer gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8">
            <input
              type="radio"
              className="h-6 w-6 accent-primary-purple cursor-pointer"
              name="membership_option"
              value="2"
              checked={membershipChoice === membershipTypes["monthly-access"]}
              onChange={() => setMembershipChoice(membershipTypes["monthly-access"])}
            />
            <div className="flex w-full justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <p className="text-primary-brown">Monthly membership</p>
              <p className="text-black">$29.99/month</p>
            </div>
          </label>

          {/* Option 3: Yearly Membership */}
          <label className="mb-6 flex w-full cursor-pointer gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8 relative">
            <input
              type="radio"
              className="h-6 w-6 accent-primary-purple cursor-pointer"
              name="membership_option"
              value="3"
              checked={membershipChoice === membershipTypes["yearly-access"]}
              onChange={() => setMembershipChoice(membershipTypes["yearly-access"])}
            />
            <div className="flex w-full justify-between items-center text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <p className="text-primary-brown">Yearly membership</p>
              <div className="flex items-center gap-2">
                <span className="bg-primary-yellow text-black text-[10px] 2xl:text-sm font-bold px-2 py-0.5 rounded-md">
                  most popular
                </span>
                <p className="text-black">$239.88/year</p>
              </div>
            </div>
          </label>

          {/* Option 4: Scholarship Access */}
          <label className="mb-6 flex w-full cursor-pointer gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8">
            <input
              type="radio"
              className="h-6 w-6 accent-primary-purple cursor-pointer"
              name="membership_option"
              value="4"
              checked={membershipChoice === membershipTypes["scholarship"]}
              onChange={() => setMembershipChoice(membershipTypes["scholarship"])}
            />
            <div className="flex w-full justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <p className="text-primary-brown">Scholarship</p>
              <p className="text-black">Apply or redeem</p>
            </div>
          </label>
        </fieldset>

        {/* CTA Button */}
        <Button2
          text={getButtonText()}
          onClick={goToPayment}
          disable={isButtonDisabled}
        />
      </form>

      <p className="mt-9 w-full rounded-[15px] bg-primary-purple py-3 text-center text-[12px] text-lg text-white 2xl:rounded-full 2xl:py-5 3xl:text-2xl">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-yellow underline">
          Log in
        </Link>
      </p>
    </section>
  );
}