import InputForm from "@/components/atoms/form-input";
import PasswordInput from "@/components/auth/password-input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    return (
        <div className="w-[24vw] 3xl:w-[26vw]">
            <Link href="/" className="text-primary-yellow text-xl font-bold flex relative w-[15%] mb-5"><Image src="/YellowBackIcon.svg" width={30} height={30} alt=""/><p className="mt-2">Home</p></Link>
        <h1 className="text-7xl font-bold leading-tight tracking-tight text-white font-montserrat mb-5">
        Log In
        </h1>
        <div className='mb-5 2xl:mt-5 2xl:mb-[20px]'>
            <p className='text-white text-xl'>Log in with your The Donovan&apos;s piano room account.</p>
        </div>
            <form className="flex flex-col gap-4">
                
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
                    error={""}
                    inputValue={password}
                />
            <div className="flex justify-between w-full">

                <div className="flex items-center">
                    <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
                        <input type="checkbox"
                            className="before:content[''] peer relative h-6 w-6 4xl:h-8 4xl:w-8 cursor-pointer appearance-none rounded-md border before:border-[#391f0f] checked:border-primary-yellow transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:bg-primary-yellow bg-[#fef8ee] hover:before:opacity-10"
                            id="check" />
                        <span
                            className="absolute text-primary-purple transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 4xl:h-7 4xl:w-7" viewBox="0 0 20 20" fill="currentColor"
                                stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd">
                                </path>
                            </svg>
                        </span>
                    </label>
                    <label className="text-lg font-medium text-white mt-1 2xl:mt-2 3xl:text-2xl 4xl:text-[16px]">Remember me</label>
                </div>
                <Link href="/forgot-password" className="text-lg font-medium text-primary-yellow mt-3 2xl:mt-4 3xl:text-2xl 4xl:text-[16px]">Forgot password?</Link>
            </div>
            <div> 
                <button className='w-full text-center bg-primary-yellow py-3 rounded-3xl text-[12px] 3xl:text-2xl 4xl:text-[16px] text-primary-purple font-semibold 2xl:py-5 2xl:rounded-full 2xl:py-5 3xl:py-7 2xl:rounded-full' type='submit'>Continue to verify account</button>
            </div>
        </form>
        <p className='w-full text-center mt-[10px] text-lg text-white bg-primary-purple py-3 rounded-3xl text-[12px] mt-9 2xl:py-5 2xl:rounded-full 3xl:text-2xl 4xl:text-[16px] 3xl:py-8'>Don&apos;t have an account? <Link href="/signup" className='text-primary-yellow underline'>Sign up</Link></p>
    
        </div>
    )
}
