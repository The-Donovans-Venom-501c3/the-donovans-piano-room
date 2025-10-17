import Image from 'next/image'
import React from 'react'

export default function BackgroundContactUs() {
return (
    <>
        <Image className='absolute top-[0%] right-[0%]' src="/background-icons/contact-us/GreenFlower.svg" alt='' width={130} height={20}/>
        <Image className='absolute top-[5%] left-[35%]' src="/background-icons/contact-us/Note5.svg" alt='' width={50} height={20}/>
        <Image className='absolute bottom-[0%] left-[0%]' src="/background-icons/contact-us/GreenFlower.svg" alt='' width={130} height={50} style={{ transform: 'rotate(180deg)' }}/>
        <Image className='absolute top-[25%] right-[5%]' src="/background-icons/contact-us/Note1.png" alt='' width={350} height={20}/>
        <Image className='absolute top-[10%] left-[18%]' src="/background-icons/contact-us/Note2.svg" alt='' width={200} height={20}/>
        <Image className='absolute bottom-[0%] left-[50%]' src="/background-icons/contact-us/Note3.svg" alt='' width={175} height={20}/>
        <Image className='absolute top-[40%] left-[20%]' src="/background-icons/contact-us/Note4.svg" alt='' width={50} height={20}/>
        <Image className='absolute bottom-[15%] right-[10%]' src="/background-icons/contact-us/Doodle.svg" alt='' width={50} height={20}/>
        <Image className='absolute bottom-[30%] left-[15%]' src="/background-icons/contact-us/Doodle.svg" alt='' width={50} height={20} style={{ transform: 'rotate(165deg)' }}/>
        <Image className='absolute top-[5%] left-[40%]' src="/background-icons/contact-us/Doodle.svg" alt='' width={50} height={20} style={{ transform: 'rotate(320deg) scaleX(-1)' }}/>
        <Image className='absolute bottom-[0%] left-[35%]' src="/background-icons/contact-us/Star.svg" alt='' width={130} height={20}/>
    </>
)
}