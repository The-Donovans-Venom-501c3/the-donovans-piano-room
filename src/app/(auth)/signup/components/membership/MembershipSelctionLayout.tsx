import { membershipChoiceAtom, membershipTypes } from "@/utils/stores";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import SignupHeader from "../SignupHeader";
import Button2 from "@/components/atoms/Button2";

export default function MembershipSelctionLayout() {
    const [membershipChoice, setMembershipChoice] = useAtom(membershipChoiceAtom)
  return (
    <section className={membershipChoice ? 'absolute left-[25vw] 3xl:left-[23vw]' : ''}>
        <SignupHeader stepName="Select your membership" stepNum={3} navLink="/" navName="Account" />
        <form>
            <fieldset className="flex flex-col font-montserrat w-[24vw] 3xl:w-[26vw]">
                <label className="flex gap-3 w-full font-montserrat py-5 2xl:py-7 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-6" onClick={() => setMembershipChoice(membershipTypes["24-hours"])}>
                    <input type="radio" className="w-6 h-6 font-montserrat accent-primary-purple bg-[#FEF8EE]" name="membership_option" value="1" required/>
                    <div className="w-full flex justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
                        <p className="text-primary-brown font-montserrat">24 hour membership</p>
                        <p className=" font-montserrat text- ">$1.99 now</p>
                    </div>
                </label>
                <label className="flex gap-3 w-full font-montserrat py-5 2xl:py-7 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-6" onClick={() => setMembershipChoice(membershipTypes["monthly-access"])}>
                    <input type="radio" className="w-6 h-6 font-montserrat accent-primary-purple bg-[#FEF8EE]" name="membership_option" value="2" required/>
                    <div className="w-full flex justify-between text-[12px] font-montserrat font-semibold 2xl:text-2xl 4xl:text-3xl">
                        <p className="text-primary-brown">Monthly membership</p>
                        <p className="text-">$29.99/month</p>
                    </div>
                </label>
                <label className="flex gap-3 w-full font-montserrat py-5 2xl:py-7 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-6" onClick={() => setMembershipChoice(membershipTypes["yearly-access"])}>
                    <input type="radio" className="w-6 h-6  font-montserrat accent-primary-purple bg-[#FEF8EE]" name="membership_option" value="2" required/>
                    <div className="w-full flex justify-between font-montserrat text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
                        <p className="font-montserrat text-primary-brown">Yearly membership</p>
                        <p className="font-montserrat text-">$239.88/year</p>
                    </div>
                </label>
                <label className="flex gap-3 w-full py-5 2xl:py-7 3xl:py-8 px-5 bg-[#FEF8EE] rounded-2xl mb-6" onClick={() => setMembershipChoice(membershipTypes["scholarship"])}>
                    <input type="radio" className="w-6 h-6 accent-primary-purple bg-[#FEF8EE]" name="membership_option" value="2" required/>
                    <div className="font-montserrat w-full flex justify-between text-[12px] font-semibold 2xl:text-2xl 4xl:text-3xl">
                        <p className="font-montserrat text-primary-brown">Scholarship</p>
                        <p className="font-montserrat text-">Free</p>
                    </div>
                </label>
            </fieldset>
            <Button2 text="Continue to payment method" onClick={()=>{}}/>
        </form>
        <p className='w-full text-center font-montserrat text-lg 3xl:text-2xl text-white bg-primary-purple py-3 rounded-[15px] text-[12px] mt-9 2xl:py-5 2xl:rounded-full'>Already have an account? <Link href="/login" className='text-primary-yellow underline'>Log in</Link></p>
    </section>
  )
}
