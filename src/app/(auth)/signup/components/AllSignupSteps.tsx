
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from './SignupForm';
import EmailVerificationContent from './email-verification/components/EmailVerificationContent';
import { singupStepAtom } from '@/utils/stores';

export default function AllSignupSteps() {
  const signupStep = useAtomValue(singupStepAtom);
  const setSignupStep = useSetAtom(singupStepAtom);
  const router = useRouter();

  return (
    <>
      {signupStep === 1 && <SignupForm />}
      {signupStep === 2 && <EmailVerificationContent />}
    </>
  );
}
