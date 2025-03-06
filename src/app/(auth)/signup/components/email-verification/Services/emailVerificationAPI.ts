import { verify, refreshOTP } from '@/lib/api/authService';

export const sendVerificationCode = async (email: string, otp: string) => {
    return await verify(email, otp);
};

export const requestNewOTP = async (email: string) => {
    return await refreshOTP(email);
};
