import { useSetAtom } from 'jotai'
import { singupStepAtom } from '@/utils/stores'
import Button1 from '@/components/atoms/Button1'

export default function EmailVerificationSuccessForm() {

    const setSingupStep = useSetAtom(singupStepAtom)
    return (
        <section>
            
            <p className='mt-4 font-montserrat text-white text-[14px] 2xl:text-[16px]'>Awesome! Your account has been successfully created and verified. Click below to choose your membership and start learning. </p>
            <div className='flex font-montserrat flex-col justify-center gap-8 mt-8'>
                <Button1 onClick={()=>setSingupStep(prev => prev+1)} text='Continue setting up membership' />
            </div>
        </section>
    )
}
