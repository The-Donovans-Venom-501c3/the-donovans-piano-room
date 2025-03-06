// src/app/signup/email-verification/hooks/useOTPValidation.ts

export const useOTPValidation = (otp: string) => {
    const isValidOTP = otp.length === 6 && /^\d+$/.test(otp);
    const error = isValidOTP ? '' : 'OTP must be 6 digits.';
    return { isValidOTP, error };
};
