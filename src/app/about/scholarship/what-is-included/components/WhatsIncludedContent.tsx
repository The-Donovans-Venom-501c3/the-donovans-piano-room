import React from 'react'
import AboutMembershipNav from '../../components/AboutMembershipNav'
import { aboutScholarshipNavigation } from '@/utils/general'
import Image from 'next/image'

export default function WhatsIncludedContent() {
  return (
    <div className='flex flex-col justify-center items-center h-full gap-[5%]'>
        <h2 className='text-primary-brown text-6xl 3xl:text-7xl 4xl:text-8xl font-semibold'>Unlock Potential with Scholarship Power!</h2>
        <AboutMembershipNav page={aboutScholarshipNavigation.whatsIncluded} />
        <div className='flex items-center justify-around w-full h-[56%] laptop:h-[60%]'>
            <div className='w-[18%] h-full bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] p-5'>
                <Image src="/about/scholarship/what-is-included/Icon1.svg" height={50} width={50} alt=''/>
                <h4 className='text-2xl mt-4 laptop:mt-8 laptop:text-2xl desktop:text-5xl'>Free Access to The Donovan&apos;s Piano Room</h4>
                <p className='text-lg mt-4 laptop:mt-8 laptop:text-2l desktop:text-3xl'>Students are provided with complimentary access to The Donovan&apos;s Piano Room, where they can engage in various activities related to music learning.</p>
            </div>
            <div className='w-[18%] h-full bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] p-5'>
                <Image src="/about/scholarship/what-is-included/Icon2.svg" height={50} width={50} alt=''/>
                <h4 className='text-2xl mt-4 laptop:mt-8 laptop:text-2xl desktop:text-5xl'>Range of Learning Opportunities</h4>
                <p className='text-lg mt-4 laptop:mt-8 laptop:text-2l desktop:text-3xl'>Students learn various musical skills such as piano, guitar, vocals, sight reading, and music theory through lessons, games, books, and other resources provided.</p>
            </div>
            <div className='w-[18%] h-full bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] p-5'>
                <Image src="/about/scholarship/what-is-included/Icon3.svg" height={50} width={50} alt=''/>
                <h4 className='text-2xl mt-4 laptop:mt-8 laptop:text-2xl desktop:text-5xl'>Inclusive Learning Environment</h4>
                <p className='text-lg mt-4 laptop:mt-8 laptop:text-2l desktop:text-3xl'>The program welcomes students of all levels, indicating that it caters to beginners as well as those with prior musical experience.</p>
            </div>
            <div className='w-[18%] h-full bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] p-5'>
                <Image src="/about/scholarship/what-is-included/Icon4.svg" height={50} width={50} alt=''/>
                <h4 className='text-2xl mt-4 laptop:mt-8 laptop:text-2xl desktop:text-5xl'>Flexible Learning Options</h4>
                <p className='text-lg mt-4 laptop:mt-8 laptop:text-2l desktop:text-3xl'>Classes are offered both in-person and virtually, providing flexibility for students to choose the mode of learning that best suits their needs. </p>
            </div>
        </div>
    </div>
  )
}
