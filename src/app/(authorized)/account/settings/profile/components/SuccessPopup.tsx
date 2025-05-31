import { IsNavOpenAtom } from "@/utils/stores"
import { useAtomValue } from "jotai"
import Image from "next/image"

export default function SuccessPopup({ closeSuccessPopup }: { closeSuccessPopup: any }) {
    const isNavOpen = useAtomValue(IsNavOpenAtom)
    return (
        <div className="fixed z-50 flex items-center justify-between h-[48px] w-[78vw] bottom-[1vh] bg-primary-yellow-accent rounded-2xl" style={isNavOpen ? { width: '70vw' } : {}}>
            <div className="flex items-center">
                <div className="relative h-[3vh] w-[3vh] ml-[1vw]">
                    <Image src="/about/membership/Icon-include.svg" fill alt="" />
                </div>
                <h5 className="text-xl 3xl:text-2xl 4xl:text-3xl ml-[.5vw]">New changed saved!</h5>
            </div>
            <div className="flex items-center">
                <p className="text-xl 3xl:text-2xl 4xl:text-3xl ml-[.5vw] underline text-primary-purple font-semibold">Undo</p>
                <div className="relative h-[5vh] w-[5vh] mr-[1vw]" onClick={closeSuccessPopup}>
                    <Image src="/Close.svg" fill alt="" />
                </div>
            </div>
        </div>
    )
}
