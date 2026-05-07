"use client";

import { useRouter } from "next/navigation";
import AuthSucceedWrapper from "@/components/auth/AuthSucceedWrapper";
import { singupStepAtom, membershipChoiceAtom, membershipTypes, profileAtom } from "@/utils/stores";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { completeSignup } from "@/lib/api/authService";

const membershipLabels: Record<string, string> = {
    [membershipTypes["24-hours"]]: "24-Hour",
    [membershipTypes["monthly-access"]]: "Monthly",
    [membershipTypes["yearly-access"]]: "Yearly",
    [membershipTypes["basic"]]: "Basic",
    [membershipTypes["scholarship"]]: "Scholarship",
}

export default function SignupConfirmation() {
    const membershipChoice = useAtomValue(membershipChoiceAtom)
    const { email } = useAtomValue(profileAtom)
    const resetStep = useSetAtom(singupStepAtom)
    const resetMembership = useSetAtom(membershipChoiceAtom)
    const router = useRouter()

    const [label] = useState(() => membershipLabels[membershipChoice] ?? "")
    const [capturedEmail] = useState(() => email)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const finish = async () => {
            try {
                const { ok, data } = await completeSignup(capturedEmail)
                if (!ok) {
                    setError(data?.message || 'Failed to complete signup. Please try again.')
                    return
                }
            } catch {
                setError('Failed to complete signup. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }
        finish()
    }, [])

    const handleLogin = () => {
        resetStep(1)
        resetMembership("")
        router.push('/login')
    }

    if (isLoading) {
        return (
            <AuthSucceedWrapper>
                <div className="flex items-center justify-center py-10">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            </AuthSucceedWrapper>
        )
    }

    if (error) {
        return (
            <AuthSucceedWrapper>
                <h1 className="text-4xl md:text-8xl 2xl:text-8xl 4xl:text-9xl leading-tight tracking-tight text-white mb-5 font-montserrat">
                    Something went wrong
                </h1>
                <p className="text-white text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl mb-5">{error}</p>
                <p className="w-full text-center bg-primary-yellow-accent py-4 rounded-full text-primary-purple font-bold text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl">
                    <Link href="/signup">Try again</Link>
                </p>
            </AuthSucceedWrapper>
        )
    }

    return (
        <AuthSucceedWrapper>
            <h1 className="text-4xl md:text-8xl 2xl:text-8xl 4xl:text-9xl leading-tight tracking-tight text-white mb-5 font-montserrat">
                Hurray! You&apos;re in
            </h1>
            <div className="mb-5 2xl:mt-5 2xl:mb-[20px]">
                <p className="text-white text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl">
                    Your {label} access is now active and your account has been created.
                </p>
            </div>
            <button
                onClick={handleLogin}
                className="w-full text-center bg-primary-yellow-accent py-4 rounded-full text-primary-purple font-bold text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl"
            >
                Log in
            </button>
        </AuthSucceedWrapper>
    );
}
