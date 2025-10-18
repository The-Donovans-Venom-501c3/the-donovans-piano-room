import { testPassword } from "@/utils/general";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PasswordCases({password, testCasesCB, allCasesIsCorrect}: {password: string, testCasesCB?: any, allCasesIsCorrect?: boolean}) {
    const renderCorrect = () => (<div className="w-6 3xl:w-8 h-6 3xl:h-8 relative mb-2"><Image src="/auth/CorrectPasswordCase.svg" fill alt=""/></div>)
    const renderWrong = () => (<div className="w-6 3xl:w-8 h-6 3xl:h-8 relative mb-2"><Image src="/auth/WrongPasswordCase.svg" fill alt=""/></div>)
    const [hasLowerCase, setHasLowerCase] = useState(false)
    const [hasUpperCase, setHasUpperCase] = useState(false)
    const [hasNumber, setHasNumber] = useState(false)
    const [hasSymbol, setHasSymbol] = useState(false)
    
    useEffect(()=>{
        const passwordCases = testPassword(password)
        setHasLowerCase(passwordCases.lowerCase)
        setHasUpperCase(passwordCases.upperCase)
        setHasNumber(passwordCases.numberCase)
        setHasSymbol(passwordCases.symbolCase)
        if(testCasesCB) { 
            testCasesCB(!!(
                passwordCases.correctLength && passwordCases.lowerCase &&
                passwordCases.upperCase && passwordCases.numberCase &&
                passwordCases.symbolCase
            ))
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password])

    return (
        <div style={(allCasesIsCorrect || !password) ? {display: "none"} : {}}>
            <div className="flex gap-4">
                {password.length >= 12 ? renderCorrect() : renderWrong()}
                <p className="text-white text-[12px] 3xl:text-2xl">Must be at least 12 characters long</p>
            </div>
            <div className="flex gap-4">
                {hasLowerCase ? renderCorrect() : renderWrong()}
                <p className="text-white text-[12px] 3xl:text-2xl">Must use at least 1 lowercase letter</p>
            </div>
            <div className="flex gap-4">
                {hasUpperCase ? renderCorrect() : renderWrong()}
                <p className="text-white text-[12px] 3xl:text-2xl">Must use at least 1 uppercase letter</p>
            </div>
            <div className="flex gap-4">
                {hasNumber ? renderCorrect() : renderWrong()}
                <p className="text-white text-[12px] 3xl:text-2xl">Must use at least  1 number</p>
            </div>
            <div className="flex gap-4">
                {hasSymbol ? renderCorrect() : renderWrong()}
                <p className="text-white text-[12px] 3xl:text-2xl">May use symbols like ! ” ? $ % ^ &</p>
            </div>
        </div>
    )
}
