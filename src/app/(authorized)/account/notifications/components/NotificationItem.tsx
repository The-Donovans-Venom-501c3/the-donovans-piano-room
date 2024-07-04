import React from 'react'
import { notification } from './notificationInterface'
import Image from 'next/image'
import Button4 from '@/components/atoms/Button4'

export default function NotificationItem({item}: {item: notification}) {
  return (
    <div className='flex h-[27%] w-full p-6 bg-[#FEF8EE] rounded-2xl mt-[2%] shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]'>
        <div className='w-[5%] flex items-center justify-center'>
            {item.unread && <div className='w-[1.5vh] h-[1.5vh] bg-primary-purple rounded-full'></div>}
        </div>
        <div className='w-[5%]'>
            <div className='relative w-[4.5vh] h-[4.5vh]'>
                <Image src={item.imageSrc} fill alt='' />
            </div>
        </div>
        <div className='w-[80%] ml-[2%] flex flex-col'>
            <p className='text-2xl font-medium'>{item.title}</p>
            <p className='text-xl mt-[2%]'>{item.description}</p>
            <Button4 text={item.actionTitle} style={{width: "25%", height: "35%", marginTop: "2%"}} />
        </div>
        {/* <div className='w-[5%] justify-self-end'>
        </div> */}
    </div>
  )
}
