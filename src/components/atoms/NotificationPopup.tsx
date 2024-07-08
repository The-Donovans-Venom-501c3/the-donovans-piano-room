import { beenTimeAgo, dummyNoticationsData } from "@/utils/general"
import Image from "next/image"
import { useEffect, useState } from "react"
import Button3 from "./Button3"
import Link from "next/link"
import CloseIcon from '@mui/icons-material/Close';

export default function NotificationPopup() {
    const item = dummyNoticationsData[0]
    const [timeAgo, setTimeAgo] = useState('')
    useEffect(()=>{
        const {timeAgo} = beenTimeAgo(item.date)
        setTimeAgo(timeAgo)
    }, [])
  return (
    <div className="absolute w-[100vw] h-[100vh]">
        <div className='absolute z-50 right-[5%] top-[-2%] flex w-[35%] p-6 bg-[#FEF8EE] rounded-2xl mt-[2%] hover:bg-[#FBF5FF] border border-[#FCF0D8] hover:border-white shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]'>
            <div className='w-[5%]'>
                <div className='relative w-[4.5vh] h-[4.5vh]'>
                    <Image src={item.imageSrc} fill alt='' />
                </div>
            </div>
            <div className='w-[90%] ml-[4%] flex flex-col'>
                <div className='flex justify-between items-center'>
                    <p className='text-2xl 3xl:text-3xl 4xl:text-4xl font-medium'>{item.title}</p>
                    <p className='text-lg 3xl:text-xl 4xl:text-2xl text-[#817676]'>{timeAgo}</p>
                </div>
                <div>
                    <p className='text-xl 3xl:text-2xl 4xl:text-3xl mt-[2%] w-[90%]'>{item.description}</p>
                    <div className="flex items-center">
                        <Button3 text={item.actionTitle} style={{width: item.actionTitle.length > 6 ? "28%" : "22%", height: "4.3vh", marginTop: "2%"}} />
                        <Link href="/account/notifications" className="underline text-primary-purple text-xl 3xl:text-2xl 4xl:text-3xl font-semibold ml-[5%]">See all notifications</Link>
                    </div>
                </div>
            </div>
            <div className="absolute top-[-6%] right-[-0.3%] bg-[#FEF8EE] hover:bg-[#FBF5FF] w-[4vh] h-[4vh] rounded-full border-2 border-[#FCF0D8] flex items-center justify-center select-none cursor-pointer">
                <CloseIcon className="text-4xl 3xl:text-5xl 4xl:text-6xl text-primary-purple"/>
            </div>
        </div>
    </div>
  )
}
