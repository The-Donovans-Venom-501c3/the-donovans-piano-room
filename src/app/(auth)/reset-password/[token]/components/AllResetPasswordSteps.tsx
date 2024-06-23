"use client";
import { useAtomValue } from 'jotai';
import ResetPasswordContent from './ResetPasswordContent';
import ResetPasswordConfirmation from './ResetPasswordConfirmation';
import { resetPasswordStepAtom } from '@/utils/stores';

export default function AllForgotPasswordSteps() {
    const forgotPasswordStep = useAtomValue(resetPasswordStepAtom);

    return (
        <>
            {forgotPasswordStep === 1 && <ResetPasswordContent />}
            {forgotPasswordStep === 2 && <ResetPasswordConfirmation />}
        </>
    );
}
