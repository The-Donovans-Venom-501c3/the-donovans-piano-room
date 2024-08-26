import { useEffect, useRef, useState } from 'react'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import Button1 from '@/components/atoms/Button1'
import Button2 from '@/components/atoms/Button2'
import { useAtomValue } from 'jotai'
import { emailAtom } from '@/utils/stores'
import * as authAPI from "../../../../../../utils/APIs/authAPIs"
export default function EmailVerificationForm({setToIsVerified}: {setToIsVerified: any}) {
    const [verificationCode, setVerificationCode] = useState(Array(6).fill(''))
    const [loading, setLoading] = useState(false)
    const email = useAtomValue(emailAtom)
    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newVerificationCode = [...verificationCode]
        newVerificationCode[index] = event.target.value
        setVerificationCode(newVerificationCode)
    }
    const handleVerify = async (e: any) =>{
        e.preventDefault()
        try{
            setLoading(true)
            
            const res = await authAPI.verify(email, verificationCode.join(""))
            console.log(res)
            setToIsVerified()
        } catch(err){
            console.log(err)
        } finally{
            setLoading(false)
        }
     
    }
    const handleRefreshOTP = async (e: any) => {
        e.preventDefault()
        try{
            const res = await authAPI.refreshOTP(email)
            setTimeLeft(600)
            console.log(res)
        } catch(err){
            console.log(err)
        }
    }
    
    const [timeLeft, setTimeLeft] = useState(600)
    const timeCounterRef = useRef<NodeJS.Timeout | null>(null)
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if(prevTime-1 <= 0 && timeCounterRef.current ){
                    clearInterval(timeCounterRef.current)
                }
                return prevTime - 1
            });
        }, 1000);

        timeCounterRef.current = timer
        return () => {
            clearInterval(timer);
        };
    }, [timeLeft]);

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
            <form className="mt-8 mb-7 w-full"  onSubmit={handleVerify}>
                <p className='text-primary-yellow text-lg 3xl:text-2xl mb-3'>Enter the 6 digit code</p>
                <div className='flex align-center gap-2 w-full justify-between mb-7'>
                    {verificationCode.map((code, index) => (
                        <input
                            key={index}
                            maxLength={1}
                            type='text'
                            value={code}
                            onChange={(event) => handleChange(index, event)}
                            className='focus:bg-white text-center text-2xl 3xl:text-4xl rounded-lg bg-[#FEF8EE] outline-none focus:border-primary-brown border border-primary-brown border 2xl:w-20 4xl:w-24 4xl:h-28 w-16 p-5'
                            required
                        />
                    ))}
                </div>
                <Button1 text="Verify" disable={loading}/>
            </form>
            <Button2 text='Send a new code' onClick={handleRefreshOTP} />
        </section>
    )
}
