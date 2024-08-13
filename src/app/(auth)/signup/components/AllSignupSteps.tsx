import { singupStepAtom } from '@/utils/stores'
import { useAtomValue, useSetAtom } from 'jotai'
import SignupForm from './SignupForm'
import SignupMembershipContent from './membership/SignupMembershipContent'
import EmailVerificationContent from './email-verification/components/EmailVerificationContent'
import SignupPayment from './SignupPayment'

export default function AllSignupSteps() {

  const signupStep = useAtomValue(singupStepAtom)
  return (
    <>
        { signupStep === 1 && (<SignupForm/>) }
        { signupStep === 2 && (<EmailVerificationContent />)}
        { signupStep === 3 && (<SignupMembershipContent />)}
        {signupStep === 4 && (<SignupPayment/>)}
    </>
  )
}
