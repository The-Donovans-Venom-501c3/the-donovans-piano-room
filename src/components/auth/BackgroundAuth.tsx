import Image from 'next/image'
import React from 'react'

export default function BackgroundAuth() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Right Orange Grid */}
        <Image className='absolute top-0 right-0' src="/background-icons/RightTop1.svg" alt='' width={135} height={135}/>
        
        {/* Yellow Star near bottom center */}
        <Image className='absolute bottom-4 left-[48%]' src="/background-icons/YellowStar.svg" alt='' width={120} height={120}/>
        
        {/* Far Left Shapes */}
        <Image className='absolute top-[45%] -left-2' src="/background-icons/OrangeCircle.svg" alt='' width={50} height={50}/>
        <Image className='absolute bottom-0 left-0' src="/background-icons/LeftBottom.svg" alt='' width={270} height={270}/>
        <Image className='absolute bottom-[10%] left-0' src="/background-icons/GreenLeftBottom.svg" alt='' width={130} height={100}/>
        
        {/* Main Dark Purple Music Note Doodle - Shifted Left to show behind Title */}
        <Image className='absolute top-[18%] left-[18%] xl:left-[22%]' src="/background-icons/DoodleDarkPurple.svg" alt='' width={480} height={430}/>

        {/* Small Purple Accent Shapes */}
        <Image className='absolute top-[16%] left-[38%]' src="/background-icons/Elipse216DarkPurple.svg" alt='' width={80} height={80}/>
        <Image className='absolute top-[28%] left-[20%]' src="/background-icons/DarkPurpleDot.svg" alt='' width={20} height={20}/>
        <Image className='absolute top-[22%] left-[44%]' src="/background-icons/DarkPurpleDot.svg" alt='' width={20} height={20}/>
    </div>
  )
}