import Button1 from "@/components/atoms/Button1"
import InputForm from "@/components/atoms/form-input"
import { validateCouponCode, validateScholarshipCode } from "@/lib/api/membershipService"
import { membershipTypes, membershipChoiceAtom } from "@/utils/stores"
import { useAtomValue } from "jotai"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function MembershipIncludes() {
    const [showDiscountInput, setShowDiscountInput] = useState(false)
    const [discountCode, setDiscountCode] = useState("")
    const [scholarshipCode, setScholarshipCode] = useState("")
    const membershipChoice = useAtomValue(membershipChoiceAtom)
    const membershipChoiceContent = membershipIncludes[membershipChoice];
    const [status, setStatus] = useState<null | "success" | "error">(null);
    const [isLoading, setIsLoading] = useState(false);

    const isScholarship = membershipChoice === membershipTypes["scholarship"]
    const isPaid = !isScholarship && membershipChoice !== membershipTypes["basic"]

    useEffect(() => {
        setShowDiscountInput(false)
        setDiscountCode("")
        setScholarshipCode("")
        setStatus(null)
    }, [membershipChoice])

    const applyCouponCode = async () => {
        try {
            setIsLoading(true);
            await validateCouponCode(membershipChoiceContent.id, discountCode);
            setStatus("success");
        } catch {
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    }

    const applyScholarshipCode = async () => {
        try {
            setIsLoading(true);
            await validateScholarshipCode(scholarshipCode);
            setStatus("success");
        } catch {
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    }

    return membershipChoice && (
        <div className="fixed right-[25vw] 3xl:right-[23vw] w-[24vw] 3xl:w-[26vw] bg-tertiary-purple h-auto rounded-3xl p-6">

            <h3 className="text-primary-yellow border-b-2 border-b-primary-yellow flex items-center gap-2 text-[16px] 2xl:text-3xl 4xl:text-4xl font-bold pb-3 4xl:pb-6">
                <span className="flex-shrink-0 w-5 h-5 2xl:w-8 2xl:h-8 rounded-full border-2 border-primary-yellow flex items-center justify-center text-primary-yellow text-[11px] 2xl:text-lg font-bold">i</span>
                {membershipChoiceContent.title}
            </h3>

            <ul className="my-4 border-b-2 border-primary-purple pb-3 4xl:pb-6 flex flex-col gap-3 2xl:gap-5">
                {membershipChoiceContent.content.map((item, i) => (
                    <li className="flex gap-3 items-start" key={i}>
                        <span className="flex-shrink-0 w-5 h-5 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 rounded-full bg-primary-yellow flex items-center justify-center mt-[2px]">
                            <svg className="w-3 h-3 2xl:w-5 2xl:h-5" viewBox="0 0 12 10" fill="none">
                                <path d="M1 5L4.5 8.5L11 1.5" stroke="#3B1E7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <div className="flex flex-col">
                            <span className="text-white font-semibold text-[12px] 2xl:text-2xl 4xl:text-3xl">{item[0].replace(/:$/, '')}</span>
                            <span className="text-white/80 text-[11px] 2xl:text-xl 4xl:text-2xl leading-snug mt-[2px]">{item[1]}</span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Scholarship code input */}
            {isScholarship && (
                <div>
                    {status === "success" ? (
                        <>
                            <p className="flex items-center gap-2 mb-3">
                                <span className="flex-shrink-0 w-5 h-5 2xl:w-7 2xl:h-7 rounded-full bg-primary-yellow flex items-center justify-center">
                                    <svg className="w-3 h-3 2xl:w-4 2xl:h-4" viewBox="0 0 12 10" fill="none">
                                        <path d="M1 5L4.5 8.5L11 1.5" stroke="#3B1E7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-white text-[12px] 2xl:text-xl 4xl:text-2xl">Scholarship code verified successfully</span>
                            </p>
                            <InputForm
                                onChange={() => {}}
                                field={{ type: "text", name: "scholarship-code", label: "Scholarship code" }}
                                text={scholarshipCode}
                                error=""
                                disabled={true}
                            />
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <InputForm
                                        onChange={(e: any) => setScholarshipCode(e.target.value)}
                                        field={{ type: "text", name: "scholarship-code", label: "Scholarship code" }}
                                        text={scholarshipCode}
                                        error={status === "error" ? "Invalid scholarship code, please try again" : ""}
                                        disabled={false}
                                    />
                                </div>
                                <Button1
                                    style={{ marginLeft: "4px", width: "89px", height: "40px" }}
                                    disabled={isLoading || !scholarshipCode}
                                    text="Apply"
                                    onClick={applyScholarshipCode}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Discount code input for paid tiers */}
            {isPaid && (
                <div>
                    {status === "success" ? (
                        <p className="flex items-center gap-2 mb-2">
                            <Image src="/Success.svg" width={18} height={18} alt="" />
                            <span className="text-white text-[12px] 4xl:text-2xl 2xl:text-4xl">Discount code applied</span>
                        </p>
                    ) : (
                        <p className="text-white text-[12px] 4xl:text-2xl 2xl:text-4xl mb-2 4xl:mt-4">
                            Enter your discount code <span className="text-primary-yellow underline cursor-pointer" onClick={() => setShowDiscountInput(prev => !prev)}>here</span>
                        </p>
                    )}
                    {showDiscountInput && (
                        <div className="flex items-center">
                            <div style={{ flex: status !== "success" ? 1 : 'none' }}>
                                <InputForm
                                    onChange={(e: any) => setDiscountCode(e.target.value)}
                                    field={{ type: "text", name: "discount-code", label: "Discount code" }}
                                    text={discountCode}
                                    error={status === "error" ? "Invalid discount code, please try again" : ""}
                                    disabled={status === "success"}
                                />
                            </div>
                            {status !== "success" && (
                                <Button1
                                    style={{ marginLeft: "4px", width: "89px", height: "40px" }}
                                    disabled={isLoading}
                                    text="Apply"
                                    onClick={applyCouponCode}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const membershipIncludes: Record<string, { id: number; title: string; content: string[][] }> = {
    [membershipTypes["24-hours"]]: {
        id: 1,
        title: "24 hour access",
        content: [
            ["Flexibility:", "A great way to explore all the wonderful games, tools, and resources The Donovan's Piano Room offers, without the long-term commitment."],
            ["Full Access:", "The 24-hour Membership allows you to explore all of our musical education tools for a day, including voice lessons, ear training, and more."],
            ["Low Cost:", "This option is great if you are curious about what we have to offer, but want to explore our programs before deciding on a long-term commitment."]
        ]
    },
    [membershipTypes["monthly-access"]]: {
        id: 2,
        title: "Monthly access",
        content: [
            ["Flexibility:", "A great way to explore all the wonderful games, tools, and resources The Donovans Piano Room offers, without the long-term commitment. Members can cancel their subscription anytime."],
            ["Full Access:", "The Monthly Membership allows you to explore all of our musical education tools, including voice lessons, ear training, and more. Monthly members can take advantage of live lessons and their recordings, as well as new and exciting content."],
            ["Progress Tracking:", "With a monthly membership, you have access to your personalized game scoreboard. You can track your progress and see how much you've learned over time!"]
        ]
    },
    [membershipTypes["yearly-access"]]: {
        id: 4,
        title: "Yearly access",
        content: [
            ["Cost savings:", "By opting for the yearly subscription, you generally receive a discounted rate compared to the monthly subscription. In this case, the yearly option offers a cost savings of $59.89 compared to paying for 12 months individually."],
            ["Long-term commitment:", "Choosing the yearly subscription shows a commitment to the program, which can be beneficial if you have a positive experience and intend to use it consistently throughout the year."]
        ]
    },
    [membershipTypes["basic"]]: {
        id: 5,
        title: "Basic access",
        content: [
            ["Free to start:", "Sign up at no cost and explore the platform with no payment required."],
            ["Limited access:", "Try a small set of games and resources to preview the experience before committing."],
            ["Upgrade path available:", "Unlock progress tracking, the full library, and community features by moving to a paid membership or applying for a scholarship."]
        ]
    },
    [membershipTypes["scholarship"]]: {
        id: 3,
        title: "Scholarship Access",
        content: [
            ["Full access:", "Enjoy the same benefits as a paid membership, which includes the complete library of games, tools, and resources."],
            ["Eligibility:", "Available for learners aged 21 and younger (or 60 and older) based on family income requirements."],
            ["Apply or redeem:", "Enter a scholarship code if you already have one, or apply to request eligibility."]
        ]
    },
}
