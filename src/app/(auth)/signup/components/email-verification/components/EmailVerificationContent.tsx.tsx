import Link from "next/link";
import SignupHeader from "../../SignupHeader";
import EmailVerificationForm from "./EmailVerificationForm";
import EmailVerificationSuccessForm from "./EmailVerificationSuccessForm";
import { useState } from "react";

export default function EmailVerificationContent() {

  const [isVerified, setIsVerified] = useState(false) // switch between the components 
  const setToIsVerified = () => { setIsVerified(true) }
  return (
    <section className="w-[24vw] 3xl:w-[26vw]">
      <SignupHeader  navName="Home" navLink="/" stepNum={2} stepName="Verify your account" />      
      {!isVerified ? <EmailVerificationForm setToIsVerified={setToIsVerified}/> : <EmailVerificationSuccessForm />}
      <p className='w-full text-center text-lg 3xl:text-2xl text-white bg-primary-purple py-4 font-montserrat rounded-[15px] text-[12px] mt-9 2xl:py-5 2xl:rounded-full'>Already have an account? <Link href="/login" className='text-primary-yellow underline'>Log in</Link></p>
    </section>
  )
};
