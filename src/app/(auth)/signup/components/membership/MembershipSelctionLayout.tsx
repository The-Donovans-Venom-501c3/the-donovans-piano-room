import { membershipChoiceAtom, membershipTypes, singupStepAtom } from "@/utils/stores";
import { useAtom, useSetAtom } from "jotai";
import Link from "next/link";
import SignupHeader from "../SignupHeader";
import Button2 from "@/components/atoms/Button2";

const FREE_MEMBERSHIP_TYPES = [membershipTypes["basic"], membershipTypes["scholarship"]];

export default function MembershipSelctionLayout() {
    const [membershipChoice, setMembershipChoice] = useAtom(membershipChoiceAtom)
    const setSingupStep = useSetAtom(singupStepAtom)

    const isFree = FREE_MEMBERSHIP_TYPES.includes(membershipChoice)

    const handleContinue = (e: any) => {
        e.preventDefault()
        setSingupStep(isFree ? 5 : 4)
    }

    const buttonText = isFree ? "Continue" : "Continue to payment method"

    return (
        <section className={membershipChoice ? 'absolute left-[25vw] 3xl:left-[23vw]' : ''}>
            <SignupHeader stepName="Select your membership" stepNum={3} navLink="/" navName="Account" />
            <form>
                <fieldset className="flex flex-col w-[24vw] 3xl:w-[26vw]">

                    {/* 24-Hour */}
                    <label className="flex gap-3 items-center w-full py-4 2xl:py-6 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-4 cursor-pointer" onClick={() => setMembershipChoice(membershipTypes["24-hours"])}>
                        <input type="radio" className="w-5 h-5 2xl:w-7 2xl:h-7 accent-primary-purple flex-shrink-0" name="membership_option" value="1" required />
                        <div className="flex flex-col">
                            <p className="text-primary-brown font-bold text-[13px] 2xl:text-2xl 4xl:text-3xl">24-Hour membership</p>
                            <p className="text-primary-brown text-[11px] 2xl:text-xl 4xl:text-2xl">$1.99 now</p>
                        </div>
                    </label>

                    {/* Monthly */}
                    <label className="flex gap-3 items-center w-full py-4 2xl:py-6 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-4 cursor-pointer" onClick={() => setMembershipChoice(membershipTypes["monthly-access"])}>
                        <input type="radio" className="w-5 h-5 2xl:w-7 2xl:h-7 accent-primary-purple flex-shrink-0" name="membership_option" value="2" required />
                        <div className="flex flex-col">
                            <p className="text-primary-brown font-bold text-[13px] 2xl:text-2xl 4xl:text-3xl">Monthly membership</p>
                            <p className="text-primary-brown text-[11px] 2xl:text-xl 4xl:text-2xl">$29.99/month</p>
                        </div>
                    </label>

                    {/* Yearly — most popular */}
                    <label className="flex gap-3 items-center w-full py-4 2xl:py-6 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-4 cursor-pointer" onClick={() => setMembershipChoice(membershipTypes["yearly-access"])}>
                        <input type="radio" className="w-5 h-5 2xl:w-7 2xl:h-7 accent-primary-purple flex-shrink-0" name="membership_option" value="3" required />
                        <div className="flex flex-col flex-1">
                            <p className="text-primary-brown font-bold text-[13px] 2xl:text-2xl 4xl:text-3xl">Yearly membership</p>
                            <p className="text-primary-brown text-[11px] 2xl:text-xl 4xl:text-2xl">$239.88/year</p>
                        </div>
                        <span className="flex-shrink-0 bg-primary-yellow text-primary-purple text-[10px] 2xl:text-base 4xl:text-xl font-semibold px-2 py-1 2xl:px-3 2xl:py-1.5 rounded-full">most popular</span>
                    </label>

                    {/* Basic */}
                    <label className="flex gap-3 items-center w-full py-4 2xl:py-6 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-4 cursor-pointer" onClick={() => setMembershipChoice(membershipTypes["basic"])}>
                        <input type="radio" className="w-5 h-5 2xl:w-7 2xl:h-7 accent-primary-purple flex-shrink-0" name="membership_option" value="4" required />
                        <div className="flex flex-col">
                            <p className="text-primary-brown font-bold text-[13px] 2xl:text-2xl 4xl:text-3xl">Basic membership</p>
                            <p className="text-primary-brown text-[11px] 2xl:text-xl 4xl:text-2xl">Free (limited access)</p>
                        </div>
                    </label>

                    {/* Scholarship */}
                    <label className="flex gap-3 items-center w-full py-4 2xl:py-6 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-4 cursor-pointer" onClick={() => setMembershipChoice(membershipTypes["scholarship"])}>
                        <input type="radio" className="w-5 h-5 2xl:w-7 2xl:h-7 accent-primary-purple flex-shrink-0" name="membership_option" value="5" required />
                        <div className="flex-1">
                            <p className="text-primary-brown font-bold text-[13px] 2xl:text-2xl 4xl:text-3xl">Scholarship</p>
                        </div>
                        <span className="flex-shrink-0 text-primary-brown font-semibold text-[11px] 2xl:text-xl 4xl:text-2xl">Apply or redeem</span>
                    </label>

                </fieldset>
                <Button2 text={buttonText} onClick={handleContinue} />
            </form>
            <p className='w-full text-center text-lg 3xl:text-2xl text-white bg-primary-purple py-3 rounded-[15px] text-[12px] mt-9 2xl:py-5 2xl:rounded-full'>Already have an account? <Link href="/login" className='text-primary-yellow underline'>Log in</Link></p>
        </section>
    )
}
