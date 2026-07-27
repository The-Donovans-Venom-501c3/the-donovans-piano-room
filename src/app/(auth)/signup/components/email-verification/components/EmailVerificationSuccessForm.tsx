import { useSetAtom } from 'jotai'
import { signupStepAtom } from '@/utils/stores'
import Button1 from '@/components/atoms/Button1'

export default function EmailVerificationSuccessForm() {

    const setSignupStep = useSetAtom(signupStepAtom)
    return (
        <section>
            
            <p className='mt-4 text-white text-[14px] 2xl:text-[16px]'>Awesome! Your account has been successfully created and verified. Click below to choose your membership and start learning. </p>
            <div className='flex flex-col justify-center gap-8 mt-8'>
                <Button1 onClick={()=>setSignupStep(prev => prev+1)} text='Continue setting up membership' />
            </div>
        </section>
    )
}
