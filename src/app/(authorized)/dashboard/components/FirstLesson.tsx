'use client'

import { isNavOpenAtom } from '@/utils/stores'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'

export default function FirstLesson() {
    const isNavOpen = useAtomValue(isNavOpenAtom)

    return (
        <div 
            className="relative w-full max-w-[1000px] min-w-[320px] transition-all duration-300 mx-auto"
            style={{
                maxWidth: isNavOpen ? 'calc(100vw - 26vw)' : 'calc(100vw - 12vw)'
            }}
        >
            {/* Background Graphic */}
            <div className="absolute inset-0 -z-10">
                <Image 
                    src="/dashboard/lesson-bg.svg" 
                    fill 
                    alt="" 
                    className="object-fill rounded-2xl"
                />
            </div>

            {/* Inner Content Block with Balanced Inset Padding */}
            <div className="px-[8%] py-[6%] flex flex-col justify-between gap-4">
                
                {/* Header Row */}
                <div className="flex justify-between select-none items-center gap-2">
                    <div className="flex gap-3 items-center shrink-0">
                        <span className="relative h-[24px] w-[24px] sm:h-[28px] sm:w-[28px]">
                            <Image src="/dashboard/book-icon.svg" fill alt=""/>
                        </span>
                        <Link href={{ pathname: "/lessons", query: { tab: "live-sessions" } }}>
                            <p className="text-primary-brown text-xl 2xl:text-2xl font-bold">
                                Live Lessons
                            </p>
                        </Link>
                    </div>
                    
                    {/* Top Right Badge */}
                    <div className="bg-[#FFEBD5] flex items-center px-3 py-1.5 rounded-xl gap-2 shadow-xs">
                        <span className="relative h-[18px] w-[18px] shrink-0">
                            <Image src="/dashboard/checkmark.svg" fill alt=""/>
                        </span>
                        <p className="text-primary-brown text-xs sm:text-sm 2xl:text-base font-semibold whitespace-nowrap">
                            When it&apos;s time, go to Lessons &gt; Live Session to Join
                        </p>
                    </div>
                </div>

                {/* Lesson Banner Image Container */}
                <div className="w-full aspect-[21/9] relative rounded-2xl overflow-hidden shadow-sm my-1">
                    <Image 
                        src="/dashboard/Dashboardlesson.png" 
                        alt="Join us for a fun-filled lesson!"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Footer Copy Block (Increased Font Sizes) */}
                <div className="flex flex-col gap-2 pt-1">
                    <h2 className="text-primary-brown text-2xl sm:text-3xl 2xl:text-4xl font-bold leading-tight">
                        Live lessons with The Donovan
                    </h2>
                    
                    <p className="text-[#524B46] text-base sm:text-lg 2xl:text-xl font-bold">
                        Check your Notifications for the next Live Session!
                    </p>

                    <p className="text-[#524B46] text-sm sm:text-base 2xl:text-lg leading-relaxed max-w-[95%]">
                        Explore music basics from Book I like the musical alphabet, keyboard patterns, notes, rhythms, scales, and more!
                    </p>
                </div>
            </div>
        </div>
    )
}