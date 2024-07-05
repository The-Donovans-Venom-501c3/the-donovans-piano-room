import React, { useState } from 'react'
import { notification } from './notificationInterface'
import Image from 'next/image'
import Button4 from '@/components/atoms/Button4'

export default function NotificationItem({item}: {item: notification}) {
    const [displayDropdown, setDisplayDropdown] = useState(false)
    const toggleDropdown = () => {setDisplayDropdown(!displayDropdown)}
  return (
    <div className='flex h-[26%] w-full p-6 bg-[#FEF8EE] rounded-2xl mt-[2%] hover:bg-[#FBF5FF] border border-[#FEF8EE] hover:border-white shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]'>
        <div className='w-[5%] flex items-center justify-center'>
            {item.unread && <div className='w-[1.5vh] h-[1.5vh] bg-primary-purple rounded-full'></div>}
        </div>
        <div className='w-[5%]'>
            <div className='relative w-[4.5vh] h-[4.5vh]'>
                <Image src={item.imageSrc} fill alt='' />
            </div>
        </div>
        <div className='w-[90%] ml-[2%] flex flex-col'>
            <div className='flex justify-between items-center'>
                <p className='text-2xl 3xl:text-3xl 4xl:text-4xl font-medium'>{item.title}</p>
                <p className='text-lg 3xl:text-xl 4xl:text-2xl'>{item.timeAgo}</p>
            </div>
            <div className='flex justify-between'>
                <div>
                    <p className='text-xl 3xl:text-2xl 4xl:text-3xl mt-[2%] w-[90%]'>{item.description}</p>
                    <Button4 text={item.actionTitle} style={{width: item.actionTitle.length > 6 ? "23%" : "17%", height: "39%", marginTop: "2%"}} />
                </div>
                <div className='w-[4vh] h-[4vh] rounded-full hover:bg-secondary-purple'>

                    <div className='relative w-[4vh] h-[4vh] rounded-full hover:bg-secondary-purple' onClick={toggleDropdown}>
                        <Image src="/account/notifications/options-icons.svg" fill alt=""/>
                    </div>
                   {displayDropdown &&
                        <ul className='absolute w-[20%] bg-[#FEF8EE] text-xl'>
                            <li className='p-6 hover:bg-[#F5E8FF] flex items-center gap-[2%]'>
                                <div className='relative w-[2vh] h-[2vh]'>
                                    <Image src="/account/notifications/mark-as-read.svg" alt='' fill/>
                                </div>
                                <p>Mark as read</p>
                            </li>
                            <li className='p-6 hover:bg-[#F5E8FF] flex items-center gap-[2%]'>
                                <div className='relative w-[2vh] h-[2vh]'>
                                    <Image src="/about/membership/Icon-doesnt-include.svg" alt='' fill/>
                                </div>
                                <p>Delete this notification</p>
                            </li>
                            <li className='p-6 hover:bg-[#F5E8FF] flex items-center gap-[2%]'>
                                <div className='relative w-[2vh] h-[2vh]'>
                                    <Image src="/account/notifications/turn-off.svg" alt='' fill/>
                                </div>
                                <p>Turn off this notification type</p>
                            </li>
                        </ul>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
