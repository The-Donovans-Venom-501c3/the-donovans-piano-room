"use client";

import InputForm from "@/components/atoms/form-input";
import PasswordInput from "@/components/auth/password-input";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button1 from "@/components/atoms/Button1";
import { login } from "@/lib/api/authService";
import { getUser } from "@/lib/api/userService";
import { useAtom, useSetAtom } from "jotai";
import { profileAtom, lockoutUntilAtom, failedAttemptsAtom } from "@/utils/stores";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const setProfile = useSetAtom(profileAtom);
    const [lockoutUntil, setLockoutUntil] = useAtom(lockoutUntilAtom);
    const [failedAttempts, setFailedAttempts] = useAtom(failedAttemptsAtom);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [inputError, setInputError] = useState<string | null>(null);
    const [bannerError, setBannerError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [now, setNow] = useState<number>(Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        setNow(Date.now());
    }, []);

    useEffect(() => {
        if (!lockoutUntil) return;

        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [lockoutUntil]);

    const isLocked = Boolean(isMounted && lockoutUntil && now < lockoutUntil);

    useEffect(() => {
        if (!isMounted) return;

        if (isLocked) {
            setBannerError(
                "Due to repeated failed attempts, your access to The Donovan's piano room is temporarily disabled. Try again in 15 minutes."
            );
        } else if (lockoutUntil && now >= lockoutUntil) {
            setLockoutUntil(null);
            setFailedAttempts(0);
            setBannerError(null);
        }
    }, [isLocked, lockoutUntil, now, setLockoutUntil, setFailedAttempts, isMounted]);

    const fetchUserData = async () => {
        try {
            const { data, ok } = await getUser();
            if (ok) {
                setProfile(data);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Failed to fetch user profile:", e);
            return false;
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked || isSubmitting) return;

        setIsSubmitting(true);
        setBannerError(null);
        setInputError(null);

        try {
            if (process.env.NEXT_PUBLIC_RESTRICT_TO_ORG_DOMAIN === "true") {
                if (!email.trim().toLowerCase().endsWith("@thedonovan.org")) {
                    setInputError("Please use your thedonovan.org email!");
                    return;
                }
            }

            const { data, ok, status } = await login(email, password);

            if (ok) {
                if (await fetchUserData()) {
                    setFailedAttempts(0);
                    setLockoutUntil(null);
                    // ✅ FIXED: Redirect directly to dashboard upon successful login!
                    router.push("/dashboard");
                } else {
                    setBannerError("Cannot get Profile information");
                }
            } else {
                const nextAttempts = failedAttempts + 1;
                setFailedAttempts(nextAttempts);

                if (nextAttempts >= 5 || status === 429 || data?.status === 429) {
                    const fifteenMinutesFromNow = Date.now() + 15 * 60 * 1000;
                    setLockoutUntil(fifteenMinutesFromNow);
                    setBannerError(
                        "Due to repeated failed attempts, your access to The Donovan's piano room is temporarily disabled. Try again in 15 minutes."
                    );
                } else {
                    setBannerError("Incorrect Email or Password.\nPlease try again.");
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        setDisabled(!(email && password) || isLocked || isSubmitting);
    }, [email, password, isLocked, isSubmitting]);

    return (
        <div className="w-[24vw] 3xl:w-[26vw]">
            <Link
                href="/"
                className="text-primary-yellow text-xl font-bold flex relative w-[15%] mb-5 items-center gap-2"
            >
                <Image src="/YellowBackIcon.svg" width={30} height={30} alt="Back to Home" />
                <span>Home</span>
            </Link>

            <h1 className="text-7xl font-bold leading-tight tracking-tight text-white font-montserrat mb-3">
                Log In
            </h1>

            {/* Subtitle */}
            <div className="mb-6 2xl:mt-3 2xl:mb-6">
                <p className="text-white text-2xl 3xl:text-3xl font-medium leading-normal">
                    Log in with your The Donovan&apos;s piano room account.
                </p>
            </div>

            {/* Error Banner */}
            {bannerError && (
                <div className="mb-6 flex items-start gap-4 rounded-2xl bg-[#FDE8E8] border border-[#F8B4B4] p-5 text-[#1C1B1F]">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B3261E] text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <p className="text-xl 3xl:text-2xl font-medium leading-relaxed text-[#1C1B1F] whitespace-pre-line">
                        {bannerError}
                    </p>
                </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <InputForm
                    field={{
                        type: "email",
                        name: "email",
                        label: "Email",
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setEmail(e.target.value);
                        setInputError(null);
                        if (!isLocked) setBannerError(null);
                    }}
                    text={email}
                    error={inputError || ""}
                />
                <PasswordInput
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value);
                        if (!isLocked) setBannerError(null);
                    }}
                    name="password"
                    label="Password"
                    error=""
                    inputValue={password}
                />
                <div className="flex justify-between items-center w-full mt-1">
                    <div className="flex items-center">
                        <label
                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                            htmlFor="check"
                        >
                            <input
                                type="checkbox"
                                id="check"
                                className="before:content[''] peer relative h-6 w-6 4xl:h-8 4xl:w-8 cursor-pointer appearance-none rounded-md border before:border-[#391f0f] checked:border-primary-yellow transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:bg-primary-yellow bg-[#fef8ee] hover:before:opacity-10"
                            />
                            <span className="absolute text-primary-purple transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 4xl:h-7 4xl:w-7"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 010 1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </label>
                        <label
                            htmlFor="check"
                            className="text-xl font-medium text-white 3xl:text-2xl cursor-pointer"
                        >
                            Remember me
                        </label>
                    </div>
                    <Link
                        href="/forgot-password"
                        className="text-xl font-medium text-primary-yellow 3xl:text-2xl"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="mt-2">
                    <Button1 text={isSubmitting ? "Logging in..." : "Log In"} type="submit" disabled={disabled} />
                </div>
            </form>

            <p className="w-full text-center text-xl 3xl:text-2xl text-white bg-primary-purple py-4 rounded-3xl mt-8 2xl:py-5 2xl:rounded-full 3xl:py-6 font-medium">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary-yellow underline font-semibold">
                    Sign up
                </Link>
            </p>
        </div>
    );
}