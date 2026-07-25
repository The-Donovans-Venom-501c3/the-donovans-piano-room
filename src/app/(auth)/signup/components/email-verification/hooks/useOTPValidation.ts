// src/app/signup/email-verification/hooks/useOTPValidation.ts

export const useOTPValidation = (otp: string) => {
  const cleanOtp = otp.trim();
  const isValidOTP = cleanOtp.length === 6 && /^\d+$/.test(cleanOtp);

  let error = "";
  if (cleanOtp.length > 0 && !isValidOTP) {
    error = "OTP must be 6 digits.";
  }

  return { isValidOTP, error };
};