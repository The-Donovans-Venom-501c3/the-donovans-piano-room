import { useEffect, useRef, useState } from 'react'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import Button1 from '@/components/atoms/Button1'
import Button2 from '@/components/atoms/Button2'
import { profileAtom, singupStepAtom } from '@/utils/stores'
import { useAtomValue, useSetAtom } from 'jotai'
// import {verify, refreshOTP} from '@/lib/api/authService'



import {useTimer} from '../hooks/useTimer'
import { useOTPValidation } from '../hooks/useOTPValidation'
import {sendVerificationCode, requestNewOTP} from '../Services/emailVerificationAPI'

import VerificationCodeInput from './VerificationCodeInput'

export default function EmailVerificationForm({setToIsVerified}: {setToIsVerified: any}) {
    const [verificationCode, setVerificationCode] = useState(Array(6).fill(''))
    const {email} = useAtomValue(profileAtom);
    const setSingupStep = useSetAtom(singupStepAtom)

    const {timeLeft, resetTimer} = useTimer(600)

    const {isValidOTP, error} = useOTPValidation(verificationCode.join(''))

    const handleVerify = async (e: any) =>{
        e.preventDefault()
        const otp = verificationCode.join('');

        if(!isValidOTP){
            alert(error || 'Invalid OTP. Please try again.');
            return;
        }
        const {data, ok} = await sendVerificationCode(email, otp)

        if (ok){
            setSingupStep(prev => prev + 1)  
            setToIsVerified()
        }
        else{
            alert(`Error: ${data.message}`)
        }
    }
    const sendNewCode = async () => {
        const {data, ok} = await requestNewOTP(email)
        if (ok){
            resetTimer()
        }
        else{
            alert(`Error: ${data.message}`)
        }
    }

    return (
        <section>
            <p className='mt-4 text-white text-[13px] 2xl:text-[16px] 3xl:text-[18px] font-montserrat mb-5'>Enter the verification 6 digit-code we sent to {email}</p>
            <div className='w-full flex py-4 gap-4 justify-center text-center bg-[#FEF8EE] py-3 rounded-xl text-[16px] text-black font-semibold 2xl:py-5 2xl:rounded-xl'>
                <TimerOutlinedIcon className=' text-3xl' />
                {timeLeft > 0 ? (
                    <p className='text-[13px] 2xl:text-[16px]'>This code expires in {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60} minutes</p>
                ) : (
                    <p className='text-[13px] 2xl:text-[16px]'>The code has expired</p>
                )}
            </div>
            <form className="mt-8 mb-7 w-full">
                <p className='text-primary-yellow text-lg 3xl:text-2xl mb-3'>Enter the 6 digit code</p>
                <VerificationCodeInput 
                    verificationCode={verificationCode}
                    setVerificationCode={setVerificationCode}
                />
                <Button1 text="Verify" onClick={handleVerify}/>
            </form>
            <Button2 text='Send a new code' onClick={sendNewCode}/>
        </section>
    )
}
