"use client";

import InputForm from "@/components/atoms/form-input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSetAtom } from 'jotai';
import Button1 from "@/components/atoms/Button1";
import { forgotPasswordStepAtom, userEmailAtom } from "@/utils/stores";
import { forgotPassword } from "@/lib/api/authService";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const setForgotPasswordStep = useSetAtom(forgotPasswordStepAtom);
    const setUserEmail = useSetAtom(userEmailAtom); // <--- Added Jotai setter

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (process.env.NEXT_PUBLIC_RESTRICT_TO_ORG_DOMAIN === 'true') {
            if(!email.trim().toLowerCase().endsWith('@thedonovan.org')) {
                setError('Please use your thedonovan.org email!');
                return;
            }
        }
        
        const { data, ok } = await forgotPassword(email);
        if (ok) {
            setUserEmail(email); // <--- Store email in global state for step 2
            setForgotPasswordStep(2);
        } else {
            alert(`Error: ${data?.message || "Something went wrong"}`);
        }
    };

    return (
        <div className="w-[24vw] 3xl:w-[26vw] mx-auto">
            <Link href="/login" className="text-primary-yellow-accent text-xl font-bold flex items-center w-full mb-5">
                <Image src="/YellowBackIcon.svg" width={30} height={30} alt="" />
                <p className="ml-2 font-roboto font-bold text-xl">Log in</p>
            </Link>
            <h1 className="text-7xl 2xl:text-8xl 4xl:text-9xl font-bold leading-tight tracking-tight text-white mb-5 font-montserrat w-4/6">
                Forgot password
            </h1>
            <div className='mb-5 2xl:mt-5 2xl:mb-[20px] 4xl:mt-8'>
                <p className='text-white text-lg 2xl:text-2xl 4xl:text-3xl'>Please enter your email address. You will receive a link to create a new password via email.</p>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <InputForm
                    field={{
                        type: "email",
                        name: "email",
                        label: "Email",
                    }}
                    onChange={(e: any) => {
                        setEmail(e.target.value);
                        setError(null);
                    }}
                    text={email}
                    error={error || ""}
                />
                <div>
                    <Button1 text="Send code to email" onClick={handleSubmit} />
                </div>
            </form>
            <p className='w-full text-center text-sm md:text-lg text-white bg-primary-purple py-2 md:py-3 rounded-2xl md:rounded-3xl text-[12px] mt-5 md:mt-9 2xl:py-5 2xl:rounded-full'>
                Don&apos;t have an account? <Link href="/signup" className='text-primary-yellow-accent underline'>Sign up</Link>
            </p>
        </div>
    );
}