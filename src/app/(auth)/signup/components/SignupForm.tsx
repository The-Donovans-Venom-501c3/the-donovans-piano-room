import PasswordCases from '@/components/auth/PasswordCases'
import InputForm from '@/components/atoms/form-input'
import PasswordInput from '@/components/auth/password-input'
import Link from 'next/link'
import { useState } from 'react'
import SignupHeader from './SignupHeader'
import { useSetAtom } from 'jotai'
import { singupStepAtom } from '@/utils/stores'
import Button1 from '@/components/atoms/Button1'

export default function SignupForm() {

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [allPasswordCasesCorrect, setAllPasswordCasesCorrect] = useState(false)
  const setSingupStep = useSetAtom(singupStepAtom)
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setSingupStep(prev => prev+1)
  }
  return (
    <section className='w-[24vw] 3xl:w-[26vw]'>
        <SignupHeader navName='Home' navLink='/' stepNum={1} stepName='Create your account' />
        <form
        className="space-y-4 md:space-y-6"
        >
        <InputForm
        field={{
            type: "text",
            name: "fullName",
            label: "Full name",
        }}
        onChange={(e: any) => setFullName(e.target.value)}
        text={fullName}
        error={''}
                />
        
        <InputForm
            field={{
                type: "email",
                name: "email",
                label: "Email",
            }}
            onChange={(e: any) => setEmail(e.target.value)}
            text={email}
            error={""}
        />
        <PasswordInput 
            onChange={(e: any) => setPassword(e.target.value)}
            name='password'
            label='Password'
            error={(allPasswordCasesCorrect && confirmPassword.length && password !== confirmPassword) ? "The password you entered does not match" : ""}
            inputValue={password}
        />
        <PasswordCases password={password} testCasesCB={setAllPasswordCasesCorrect} allCasesIsCorrect={allPasswordCasesCorrect}/>
        {(allPasswordCasesCorrect || !password) && 
        <PasswordInput
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            name='confirm password'
            label='Confirm password'
            error={(allPasswordCasesCorrect && confirmPassword.length && password !== confirmPassword) ? "The password you entered does not match" : ""}
            inputValue={confirmPassword}
        />}
        <div> 
            <Button1 onClick={handleSubmit} text='Continue to verify account' />    
        </div>
        <div className="flex items-center">
        <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
            <input type="checkbox" required
                className="before:content[''] peer relative h-6 w-6 3xl:h-8 3xl:w-8  cursor-pointer appearance-none rounded-md border before:border-[#391f0f] checked:border-primary-yellow transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:bg-primary-yellow bg-[#fef8ee] hover:before:opacity-10"
                id="check" />
            <span
                className="absolute text-primary-purple transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 3xl:h-7 3xl:w-7" viewBox="0 0 20 20" fill="currentColor"
                    stroke="currentColor" strokeWidth="1">
                    <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd">
                    </path>
                </svg>
            </span>
        </label>
        <label className="ms-2 text-l font-medium text-white mt-4 2xl:mt-6 4xl:mt-2 2xl:text-2xl">I agree to The Donovan&apos;s piano room <Link href="#" className='text-primary-yellow underline'>terms of use</Link> and <Link href="#" className='text-primary-yellow underline'>privacy policy</Link>.</label>
        </div>
        </form>
        <p className='w-full text-center mt-[10px] text-lg 3xl:text-2xl  text-white bg-primary-purple py-3 rounded-3xl 2xl:rounded-4xl text-[12px] mt-9 2xl:py-5 3xl:py-8'>Already have an account? <Link href="/login" className='text-primary-yellow underline'>Log in</Link></p>
    </section>
  )
}
