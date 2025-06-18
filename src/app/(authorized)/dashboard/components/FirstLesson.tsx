import Button3 from '@/components/atoms/Button3'
import { IsNavOpenAtom } from '@/utils/stores'
import { useAtomValue } from 'jotai'
import Image from 'next/image'


export default function FirstLesson() {
    const isNavOpen = useAtomValue(IsNavOpenAtom)
  return (
        <div className="relative w-[45vw] h-[60vh]" style={isNavOpen ? {width: "38vw", height: "55vh"} : {}}>
            <div className="absolute w-[80%] h-[90%] z-30 left-[10%] top-[10%]">
                <div className="flex justify-between select-none mt-[4%] mb-[3%]">
                    <div className="flex gap-[10%] items-center">
                        <span className="relative h-[3vh] w-[3vh]"><Image src="/dashboard/book-icon.svg" fill alt=""/></span>
                        <p className="text-primary-brown text-xl 3xl:text-2xl 4xl:text-3xl font-semibold">Lessons</p>
                    </div>
                    <div className="bg-[#FFEBD5] flex items-center p-2 rounded-xl">
                        <span className="relative h-[2.3vh] w-[2.3vh]"><Image src="/dashboard/checkmark.svg" fill alt=""/></span>
                        <p className="text-primary-brown text-xl 3xl:text-2xl 4xl:text-3xl font-semibold ml-3">Every Monday and Thursday</p>
                    </div>
                </div>
                <iframe className="w-[100%] h-[47%]" width="560" height="315" src="https://www.youtube.com/embed/Mwt9f9H7dsE?si=D1HT7i873D3VgQ3B" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <p className="text-primary-brown text-2xl font-semibold mt-[4%] mb-[3%]">Live lessons with The Donovan</p>
                <div className="flex justify-between text-2xl 3xl:text-3xl 4xl:text-4xl h-[10%]">
                    <div>
                        <p className="">Join our next live session on</p>
                        <p className="font-semibold">March 18, at 2:00 pm EST.</p>
                    </div>
                    <Button3 text="Add to calendar" style={{width: "30%", height: "80%"}}/>
                </div>
            </div>
            <div className="relative w-full h-full">
                <Image src="/dashboard/lesson-bg.svg" fill alt=""/>
            </div>
        </div>
    )
}
