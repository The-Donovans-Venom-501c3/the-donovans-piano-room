import { isNavOpenAtom } from "@/utils/stores"
import { useAtomValue } from "jotai"
import Image from "next/image"

export default function SuccessPopup({ closeSuccessPopup }: { closeSuccessPopup: any }) {
    const isNavOpen = useAtomValue(isNavOpenAtom)
    return (
        <div className="w-full h-[64px] bg-[#FFD700] rounded-2xl flex items-center justify-between px-6 shadow-sm transition-all my-4">
            {/* Left Section: Icon + Big Text */}
            <div className="flex items-center gap-3">
                <div className="relative h-7 w-7 flex-shrink-0">
                    <Image 
                        src="/about/membership/Icon-include.svg" 
                        alt="Success" 
                        fill 
                        className="object-contain"
                    />
                </div>
                <span className="text-2xl 3xl:text-3xl font-semibold text-gray-900">
                    New changes saved!
                </span>
            </div>

            {/* Right Section: Undo + Close Button */}
            <div className="flex items-center gap-6">
                <button 
                    type="button"
                    className="text-2xl 3xl:text-3xl font-bold text-primary-purple underline transition-opacity hover:opacity-75 cursor-pointer"
                >
                    Undo
                </button>
                <button 
                    type="button" 
                    onClick={closeSuccessPopup}
                    className="relative h-7 w-7 flex-shrink-0 cursor-pointer transition-opacity hover:opacity-75"
                    aria-label="Close notification"
                >
                    <Image 
                        src="/Close.svg" 
                        alt="Close" 
                        fill 
                        className="object-contain"
                    />
                </button>
            </div>
        </div>
    )
}