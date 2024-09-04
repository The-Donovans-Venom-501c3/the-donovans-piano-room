import PasswordCases from '@/components/auth/PasswordCases'
import InputForm from '@/components/atoms/form-input'
import PasswordInput from '@/components/auth/password-input'
import Link from 'next/link'
import { useState } from 'react'
import SignupHeader from './SignupHeader'
import { useAtom, useSetAtom } from 'jotai'
import { emailAtom, singupStepAtom } from '@/utils/stores'
import Button1 from '@/components/atoms/Button1'
import Checkbox from '@/components/atoms/Checkbox'
import * as authAPIs from "../../../../utils/APIs/authAPIs"

export default function SignupForm() {

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useAtom(emailAtom)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [allPasswordCasesCorrect, setAllPasswordCasesCorrect] = useState(false)
  const [loading, setLoading] = useState(false)
  const setSingupStep = useSetAtom(singupStepAtom)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try{
        setLoading(true)
        const res = await authAPIs.register(fullName, email, password)
        setSingupStep(2)
        console.log(res.data)
   
    } catch(err){
        console.log(err)
    } finally {
        setLoading(false)
    }
    // .then(res => {
    // })
    // .catch(err => {
    //     console.log(err)
    // })
  }
  return (
    <section className='w-[24vw] 3xl:w-[26vw]'>
        <SignupHeader navName='Home' navLink='/' stepNum={1} stepName='Create your account' title="Sign Up" totalSteps={4}/>
        <form onSubmit={handleSubmit}
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
            <Button1 text='Continue to verify account' disable={!allPasswordCasesCorrect || loading} />    
        </div>
        <Checkbox>
            <label className="ms-2 text-l font-medium text-white mt-4 2xl:mt-6 4xl:mt-2 2xl:text-2xl">I agree to The Donovan&apos;s piano room <Link href="#" className='text-primary-yellow underline'>terms of use</Link> and <Link href="#" className='text-primary-yellow underline'>privacy policy</Link>.</label>
        </Checkbox> 
        </form>
        <p className='w-full text-center mt-[10px] text-lg 3xl:text-2xl  text-white bg-primary-purple py-3 rounded-3xl 2xl:rounded-4xl text-[12px] mt-9 2xl:py-5 3xl:py-8'>Already have an account? <Link href="/login" className='text-primary-yellow underline'>Log in</Link></p>
    </section>
  )
}
