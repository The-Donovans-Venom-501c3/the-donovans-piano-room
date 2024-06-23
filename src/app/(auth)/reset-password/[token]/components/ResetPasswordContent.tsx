import AuthOptionalNavigation from "@/components/atoms/AuthOptionalNavigation";
import Button1 from "@/components/atoms/Button1";
import PasswordCases from "@/components/auth/PasswordCases";
import PasswordInput from "@/components/auth/password-input";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { resetPasswordStepAtom } from "@/utils/stores";

export default function ResetPasswordContent() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [allPasswordCasesCorrect, setAllPasswordCasesCorrect] = useState(false)
    const setResetPasswordStep = useSetAtom(resetPasswordStepAtom);
    
    const handleSubmit = (e: any) =>{
        e.preventDefault()
        setResetPasswordStep(2)
    }
    const passwordsError = (allPasswordCasesCorrect && confirmPassword.length && password !== confirmPassword)
    
  return (
    <section className="w-[24vw] 2xl:w-[26vw]">
        <h1 className="text-7xl 3xl:text-8xl font-bold leading-tight tracking-tight text-white mb-7">Reset your password</h1>
        <p className='text-white text-2xl 3xl:text-4xl font-semibold'>Choose a new and secure password to protect your account</p>
        <form className="flex flex-col gap-8 mt-7 mb-7">

            <PasswordInput inputValue={password} error={passwordsError ? 'The password you entered does not match' : ""} onChange={(e:any) => setPassword(e.target.value)} name="new-password" label="New password" />
            <PasswordCases  testCasesCB={setAllPasswordCasesCorrect} password={password} allCasesIsCorrect={allPasswordCasesCorrect} />
            <PasswordInput inputValue={confirmPassword} error={passwordsError ? 'The password you entered does not match' : ""} onChange={(e:any) => setConfirmPassword(e.target.value)} name="confirm-password" label="Confirm password" />
            <Button1 text="Update your password" onClick={handleSubmit} />
        </form>
        <AuthOptionalNavigation text="Don't have an account? " href="/signup" navName="Sign up"/>
    </section>
  )
}
