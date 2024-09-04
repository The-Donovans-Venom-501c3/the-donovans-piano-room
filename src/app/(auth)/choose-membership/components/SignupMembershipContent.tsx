
import MembershipIncludes from "./MembershipIncludes";
import MembershipSelctionLayout from "./MembershipSelctionLayout";
import SignupHeader from '../../signup/components/SignupHeader';

export default function SignupMembershipContent({stepNum, totalSteps}:{stepNum: number, totalSteps: number} ) {
  return (
    <>
      <MembershipSelctionLayout stepNum={stepNum} totalSteps={totalSteps}/>
      <MembershipIncludes />
    </>
  )
}
