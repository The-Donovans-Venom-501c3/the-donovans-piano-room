'use client';

import { useEffect, useRef, useState } from 'react';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import Button1 from '@/components/atoms/Button1';
import Button2 from '@/components/atoms/Button2';
import { profileAtom } from '@/utils/stores';
import { useAtomValue } from 'jotai';

import { useOTPValidation } from '../hooks/useOTPValidation';
import { sendVerificationCode, requestNewOTP } from '../Services/emailVerificationAPI';

import VerificationCodeInput from './VerificationCodeInput';

export default function EmailVerificationForm({ setToIsVerified }: { setToIsVerified: () => void }) {
    const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
    
    // SAFE ACCESS: Fixes the TypeScript build error
    const profile = useAtomValue(profileAtom);
    const email = profile?.email || '';
    
    const [resendBtnTimer, setResendBtnTimeLeft] = useState(0);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [timeLeft, setTimeLeft] = useState(600);
    const timeCounterRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const resendTimeCounterRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    const { isValidOTP, error: validationError } = useOTPValidation(verificationCode.join(''));

    // Helper function to clear input fields on error/resend
    const resetVerificationInputs = () => {
        setVerificationCode(Array(6).fill(''));
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        if (!email) {
            setApiError('User email not found. Please Log In or Sign Up again.');
            return;
        }

        const otp = verificationCode.join('');

        if (!isValidOTP) {
            setApiError(validationError || 'Code Incorrect. Please Try Again.');
            resetVerificationInputs(); // Reset OTP fields on validation error
            return;
        }

        setLoading(true);

        try {
            const { data, ok } = await sendVerificationCode(email, otp);

            if (ok) {
                setToIsVerified();
            } else {
                const msg = data?.message || data?.error || 'Code Incorrect. Please Try Again.';
                setApiError(msg);
                resetVerificationInputs(); // Reset OTP fields on incorrect API verification
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.data?.message ||
                err?.message ||
                'Code Incorrect. Please Try Again.';
            setApiError(msg);
            resetVerificationInputs(); // Reset OTP fields on API network/server error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        startTimer(600);
        return () => {
            if (timeCounterRef.current) clearInterval(timeCounterRef.current);
            if (resendTimeCounterRef.current) clearInterval(resendTimeCounterRef.current);
        };
    }, []);

    const startTimer = (seconds = 600) => {
        if (timeCounterRef.current) clearInterval(timeCounterRef.current);
        setTimeLeft(seconds);
        timeCounterRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timeCounterRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startResendTimer = (seconds = 30) => {
        if (resendTimeCounterRef.current) clearInterval(resendTimeCounterRef.current);
        setResendBtnTimeLeft(seconds);
        resendTimeCounterRef.current = setInterval(() => {
            setResendBtnTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(resendTimeCounterRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendNewCode = async () => {
        if (!email) {
            setApiError('User email not found. Please register again.');
            return;
        }

        setLoading(true);
        setApiError(null);
        resetVerificationInputs(); // Reset OTP fields when asking for a new code
        try {
            const { data, ok } = await requestNewOTP(email);
            if (!ok) {
                const msg = data?.message || 'User data not found. Please register again.';
                setApiError(msg);
            } else {
                startTimer(600);
                startResendTimer(30);
            }
        } catch (err: any) {
            setApiError('Unable to send code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full">
            {/* Header Email Subtext */}
            <p className="mt-2 text-white text-lg font-medium mb-6">
                Enter the verification 6 digit-code we sent to{' '}
                <span className="font-bold underline">{email || 'your email'}</span>
            </p>

            {/* Timer / Error Banner */}
            {apiError ? (
                <div className="w-full flex items-center justify-center gap-3 bg-[#FEF8EE] border-2 border-[#391f0f] py-4 px-6 rounded-2xl text-lg sm:text-xl font-bold text-[#391f0f] mb-6 shadow-sm">
                    <ErrorIcon className="text-red-600 !text-3xl" />
                    <span>{apiError}</span>
                </div>
            ) : (
                <div className="w-full flex items-center justify-center gap-3 bg-[#FEF8EE] border-2 border-[#391f0f] py-4 px-6 rounded-2xl text-lg sm:text-xl font-bold text-[#391f0f] mb-6 shadow-sm">
                    <TimerOutlinedIcon className="!text-3xl text-[#391f0f]" />
                    {timeLeft > 0 ? (
                        <p>
                            This code expires in {Math.floor(timeLeft / 60)}:
                            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60} minutes
                        </p>
                    ) : (
                        <p className="text-red-600">The code has expired</p>
                    )}
                </div>
            )}

            <form onSubmit={handleVerify} className="w-full mb-4">
                <p className="text-primary-yellow text-base font-bold mb-2">
                    Enter the 6 digit code
                </p>
                <VerificationCodeInput
                    verificationCode={verificationCode}
                    setVerificationCode={(code) => {
                        setVerificationCode(code);
                        if (apiError) setApiError(null);
                    }}
                />
                
                <div className="mt-8">
                    <Button1 text={loading ? "Verifying..." : "Verify"} onClick={handleVerify} />
                </div>
            </form>

            <div className="mt-4">
                {resendBtnTimer > 0 ? (
                    <Button2
                        text={`Wait for ${resendBtnTimer}s to resend`}
                        onClick={sendNewCode}
                        disable={true}
                        style={{ pointerEvents: 'none', opacity: 0.7 }}
                    />
                ) : (
                    <Button2 text="Send a new code" onClick={sendNewCode} />
                )}
            </div>
        </section>
    );
}