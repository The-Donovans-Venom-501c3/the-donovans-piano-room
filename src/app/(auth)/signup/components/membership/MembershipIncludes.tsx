import InputForm from "@/components/atoms/form-input"
import { membershipChoiceAtom } from "@/utils/stores"
import { useAtomValue } from "jotai"
import Image from "next/image"
import { useState } from "react"

export default function MembershipIncludes() {
    const [showDiscountInput, setShowDiscountInput] = useState(false)
    const [discountCode, setDiscountCode] = useState("")
    const membershipChoice = useAtomValue(membershipChoiceAtom)
    return membershipChoice && (
        <div className="fixed right-[25vw] 3xl:right-[23vw] w-[24vw] 3xl:w-[26vw] bg-tertiary-purple h-auto rounded-3xl p-6">

            <h3 className="text-primary-yellow border-b-2 border-b-primary-yellow flex gap-2 text-[16px] 2xl:text-3xl 4xl:text-4xl font-semibold pb-3 4xl:pb-6"><Image src="/auth/membershipTitleWaring.svg" width={20} height={20} alt=""/> {membershipChoice.title}</h3>
            <ul className="my-4 border-b-2 border-primary-purple pb-3 4xl:pb-6">
                {membershipChoice.services.map((item, i) => (
                    <li className="text-white mt-2 4xl:mt-4" key={i}>
                        <p className="text-[12px] 2xl:text-2xl 4xl:text-3xl ">
                            <span className="font-semibold mr-1">{item.title}:</span>{item.description}
                        </p>
                    </li>
                ))}
            </ul>
            <div>
                <p className="text-white text-[12px] 4xl:text-2xl 2xl:text-4xl mb-2 4xl:mt-4">Enter your discount code <span className="text-primary-yellow underline cursor-pointer" onClick={()=>setShowDiscountInput(prev => !prev)}>here</span></p>
                {showDiscountInput && 
                <InputForm 
                    onChange={(e: any) => setDiscountCode(e.target.value)}
                    field={{type: "text", name: "discount-code", label: "Discount code"}}
                    text={discountCode} error=""
                />}
            </div>
        </div>
    )
}