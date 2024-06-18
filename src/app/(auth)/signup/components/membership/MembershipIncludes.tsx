import InputForm from "@/components/atoms/form-input"
import { membershipTypes, membershipChoiceAtom } from "@/utils/stores"
import { useAtomValue } from "jotai"
import Image from "next/image"
import { useState } from "react"

export default function MembershipIncludes() {
    const [showDiscountInput, setShowDiscountInput] = useState(false)
    const [discountCode, setDiscountCode] = useState("")
    const membershipChoice = useAtomValue(membershipChoiceAtom)
    const membershipChoiceContent = membershipIncludes[membershipChoice]
    return membershipChoice && (
        <div className="fixed right-[25vw] w-[24vw] bg-tertiary-purple h-auto rounded-3xl p-6">

            <h3 className="text-primary-yellow border-b-2 border-b-primary-yellow flex gap-2 text-[16px] 2xl:text-3xl font-semibold pb-3"><Image src="/auth/membershipTitleWaring.svg" width={20} height={20} alt=""/> {membershipChoiceContent.title}</h3>
            <ul className="my-4 border-b-2 border-primary-purple pb-3">
                {membershipChoiceContent.content.map((item, i) => (
                    <li className="text-white mt-2" key={i}>
                        <p className="text-[12px] 2xl:text-2xl">
                            <span className="font-semibold mr-1">{item[0]}</span>{item[1]}
                        </p>
                    </li>
                ))}
            </ul>
            <div>
                <p className="text-white text-[12px] 2xl:text-xl mb-2">Enter your discount code <span className="text-primary-yellow underline cursor-pointer" onClick={()=>setShowDiscountInput(prev => !prev)}>here</span></p>
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

const membershipIncludes = {
    [membershipTypes["24-hours"]]: {
        title: "24 hour access",
        content: [
        ["Flexibility:", "A great way to explore all the wonderful games, tools, and resources The Donovan's Piano Room offers, without the long-term commitment."],
        ["Full Access:", "The 24-hour Membership allows you to explore all of our musical education tools for a day, including voice lessons, ear training, and more."],
        ["Low Cost:", "This option is great if you are curious about what we have to offer, but want to explore our programs before deciding on a long-term commitment."]
    ]},
    [membershipTypes["monthly-access"]]: {
        title: "Monthly access",
        content: [
        ["Flexibility:", 'A great way to explore all the wonderful games, tools, and resources The Donovans Piano Room offers, without the long-term commitment. Members can cancel their subscription anytime.'],
        ["Full Access:", "The Monthly Membership allows you to explore all of our musical education tools, including voice lessons, ear training, and more. Monthly members can take advantage of live lessons and their recordings, as well as new and exciting content."],
        ["Progress Tracking:", "With a monthly membership, you have access to your personalized game scoreboard. You can track your progress and see how much you've learned over time!"]
    ]},
    [membershipTypes["scholarship"]]: {
        title: "Scholarship access",
        content: [
            ["Full Access:", "Students are provided with  full access to The Donovan's Piano Room, where they can use the many games, tools, and resources, to enhance their musical education."],
            ["Eligibility:", "Scholarships are available for individuals aged 21 and younger, and those aged 60 and older. Eligibility for the scholarships is based on family income being below the Federal Poverty Level (FPL)."]
        ]
    },
    [membershipTypes["yearly-access"]]: {
        title: "Yearly access",
        content: [
            ["Cost savings:", "By opting for the yearly subscription, you generally receive a discounted reate compared to the monthly subscription. In this case, the yearly option offers a cost savings of $59.89 compared to paying for 12 months individually."],
            ["Long-term commitment:", "Choosing the yearly subscription shows a commitment to the program, which cab be beneficial if you have a positive experience and intend to use it consistently throughout the year."]
        ]
    }

}