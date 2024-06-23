"use client";

import Link from "next/link";
import AuthSucceedWrapper from "@/components/auth/AuthSucceedWrapper";

export default function ForgotPasswordForm() {
    return (
        <AuthSucceedWrapper>
            <h1 className="text-4xl md:text-8xl 2xl:text-8xl 4xl:text-9xl leading-tight tracking-tight text-white mb-5 font-montserrat">
                Check your email
            </h1>
            <div className="mb-5 2xl:mt-5 2xl:mb-[20px]">
                <p className="text-white text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl">You requested to reset your password and so a link has been sent to your email.</p>
                <p className="mt-9 w-full text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl text-white">
                    Didn’t receive the link? <Link href="#" className="text-primary-yellow-accent underline">Resend one</Link>
                </p>
            </div>
            <p className="w-full text-center bg-primary-yellow-accent py-4 rounded-full text-primary-purple font-bold text-lg md:text-2xl 2xl:text-2xl 4xl:text-3xl">
                <Link href="/login">Back to log in</Link>
            </p>
            <p className="w-full text-center text-lg text-white bg-primary-purple py-3 rounded-3xl text-[12px] mt-9 2xl:py-5 2xl:rounded-full">
                Don&apos;t have an account? <Link href="/signup" className="text-primary-yellow-accent underline">Sign up</Link>
            </p>
        </AuthSucceedWrapper>
    );
}
