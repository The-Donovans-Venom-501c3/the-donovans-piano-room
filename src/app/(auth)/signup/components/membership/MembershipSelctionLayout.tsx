import {
  membershipChoiceAtom,
  membershipTypes,
  singupStepAtom,
} from "@/utils/stores";
import { useAtom, useSetAtom } from "jotai";
import Link from "next/link";
import SignupHeader from "../SignupHeader";
import Button2 from "@/components/atoms/Button2";

export default function MembershipSelctionLayout() {
  const [membershipChoice, setMembershipChoice] = useAtom(membershipChoiceAtom);
  const setSingupStep = useSetAtom(singupStepAtom);
  const goToPayment = (e: any) => {
    if (membershipChoice === null)
      alert("please select a membership type before proceding");
    e.preventDefault();
    setSingupStep((stepN) => stepN + 1);
  };
  return (
    <section
      className={membershipChoice ? "absolute left-[25vw] 3xl:left-[23vw]" : ""}
    >
      <SignupHeader
        stepName="Select your membership"
        stepNum={3}
        navLink="/"
        navName="Account"
      />
      <form>
        <fieldset className="flex w-[24vw] flex-col 3xl:w-[26vw]">
          <label
            className="mb-6 flex w-full gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8"
            onClick={() => setMembershipChoice("24-hours")}
          >
            <input
              type="radio"
              className=" h-8 w-8 bg-[#FEF8EE] accent-primary-purple"
              name="membership_option"
              value="1"
              checked={membershipChoice === "24-hours"}
              required
            />
            <div className=" w-full justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <p className="text-primary-brown">24 hour membership</p>
              <p className="text-">$1.99 now</p>
            </div>
          </label>
          <label
            className="mb-6 flex w-full gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8"
            onClick={() => setMembershipChoice("monthly-access")}
          >
            <input
              type="radio"
              className=" h-8 w-8  bg-[#FEF8EE] accent-primary-purple"
              name="membership_option"
              value="2"
              checked={membershipChoice === "monthly-access"}
              required
            />
            <div className=" w-full justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <p className="text-primary-brown">Monthly membership</p>
              <p className="text-">$29.99/month</p>
            </div>
          </label>
          <label
            className="mb-6 flex w-full gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8"
            onClick={() => setMembershipChoice("yearly-access")}
          >
            <input
              type="radio"
              className=" h-8 w-8  bg-[#FEF8EE] accent-primary-purple"
              name="membership_option"
              checked={membershipChoice === "yearly-access"}
              value="2"
              required
            />
            <div className="flex w-full justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <div>
                <p className="text-primary-brown">Yearly membership</p>
                <p className="text-">$239.88/year</p>
              </div>
              <div className=" bottom-1 right-3 top-2 z-30 flex h-10 items-center justify-center rounded-2xl bg-yellow-500 p-3 text-base">
                most popular
              </div>
            </div>
          </label>
          <label
            className="mb-6 flex w-full gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8"
            onClick={() => setMembershipChoice("basic")}
          >
            <input
              type="radio"
              className=" h-8 w-8  bg-[#FEF8EE] accent-primary-purple"
              name="membership_option"
              checked={membershipChoice === "basic"}
              value="2"
              required
            />
            <div className=" w-full justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <p className="text-primary-brown">Basic Membership</p>
              <p className="text-[#1c1a1a]">Free(limited access)</p>
            </div>
          </label>
          <label
            className="mb-6 flex w-full gap-3 rounded-2xl bg-[#FEF8EE] px-5 py-5 2xl:py-7 3xl:py-8"
            onClick={() => setMembershipChoice("scholarship")}
          >
            <input
              type="radio"
              className=" h-8 w-8  bg-[#FEF8EE] accent-primary-purple"
              name="membership_option"
              checked={membershipChoice === "scholarship"}
              value="2"
              required
            />
            <div className="flex w-full justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
              <p className="text-primary-brown">Scholarship</p>
              <p className="text-lg">Apply or Redeem</p>
            </div>
          </label>
        </fieldset>
        {membershipChoice === "basic" ? (
          <Link
            href="/login"
            className={`flex w-full cursor-pointer items-center justify-center rounded-full border bg-primary-yellow py-3 text-center text-[12px] font-semibold text-[#601D86] active:bg-[#FAF5C7] 2xl:py-4 2xl:text-2xl 4xl:text-3xl`}
          >
            Continue to Login Page
          </Link>
        ) : (
          <Button2
            className={
              membershipChoice ? "bg-primary-yellow text-[#601D86]" : ""
            }
            text={"Continue to payment method"}
            disable={!membershipChoice ? true : false}
            onClick={goToPayment}
          />
        )}
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
