// src/app/signup/email-verification/components/VerificationCodeInput.tsx

import { useRef } from 'react';

interface VerificationCodeInputProps {
    verificationCode: string[];
    setVerificationCode: (code: string[]) => void;
}

export default function VerificationCodeInput({
    verificationCode,
    setVerificationCode
}: VerificationCodeInputProps) {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newVerificationCode = [...verificationCode]
        const value = event.target.value
        console.log(value)
        if(/^\d?$/.test(value)){
            newVerificationCode[index] = value
            setVerificationCode(newVerificationCode)

            if(value !== '' && index < inputRefs.current.length - 1){
                inputRefs.current[index + 1]?.focus()
            }
            console.log(newVerificationCode)
        }
        
    }
    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key ==='Backspace'){
            console.log("Index ", index)
            const newVerificationCode = [...verificationCode];
            if(newVerificationCode[index] === ''){
                if (index >0){
                    inputRefs.current[index - 1]?.focus()
                }
            }else {
                newVerificationCode[index] = ''
                setVerificationCode(newVerificationCode)
            }
        }
    }

    return (
        <div className='flex gap-2 w-full justify-between mb-7'>
            {verificationCode.map((code, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    maxLength={1}
                    type='text'
                    value={code}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e) }
                    className='focus:bg-white text-center text-2xl 3xl:text-4xl rounded-lg bg-[#FEF8EE] outline-none focus:border-primary-brown border border-primary-brown border 2xl:w-20 4xl:w-24 4xl:h-28 w-16 p-5'
                    required
                />
            ))}
        </div>
    );
}
