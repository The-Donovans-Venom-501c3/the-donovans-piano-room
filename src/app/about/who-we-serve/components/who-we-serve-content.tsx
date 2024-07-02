import Image from 'next/image'
import React from 'react'

export default function WhoWeServeContent() {
  return (
    <div className='flex flex-row h-full'>
        <div className='flex flex-1 flex-col h-full justify-center items-center'>
            <div className='w-[325px]'>
                <h2 className='text-primary-brown text-6xl 3xl:text-7xl 4xl:text-8xl font-montserrat font-semibold w-96'>Music for everybody</h2>
                <p className='text-2xl text-primary-gray mt-4'>Our program offers a well-rounded approach to musical growth, from learning to read music, to help preparing for college. We offer a range of programs to help children of any age and skill level continue to learn.</p>
            </div>
        </div>
        <div className='flex-1 flex items-center justify-start'>
            <div className='flex flex-col gap-6 w-[90%]'>

                <div className='flex w-full gap-[51px] items-center bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] px-12 py-5'>
                    <div className='flex flex-col gap-2 w-36 items-center'>
                        <Image src='/about/who-we-serve/Icon1.svg' alt="" width={68} height={56}/> 
                        <p className='text-[18px] text-gray-600 font-medium text-center'>Preschool</p>
                    </div>
                    <ul className='list-disc'>
                        <li className='text-[16px] text-primary-gray'>Foster cognitive, social, & emotional growth</li>
                        <li className='text-[16px] text-primary-gray'>Develop a lifelong appreciation for the arts</li>
                        <li className='text-[16px] text-primary-gray'>Improve academic performance</li>
                    </ul>
                </div>
                <div className='flex w-full gap-[51px] items-center bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] px-12 py-5'>
                    <div className='flex flex-col gap-2 w-36 items-center'>
                        <Image src='/about/who-we-serve/Icon1.svg' alt="" width={68} height={56}/> 
                        <p className='text-[18px] text-gray-600 font-medium text-center w-56'>Middle School</p>
                    </div>
                    <ul className='list-disc'>
                        <li className='text-[16px] text-primary-gray'>Explore creative expression</li>
                        <li className='text-[16px] text-primary-gray'>Develop social skills</li>
                        <li className='text-[16px] text-primary-gray'>Band, orchestra, and choral enrichment</li>
                    </ul>
                </div>
                <div className='flex w-full gap-[51px] items-center bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] px-12 py-5'>
                    <div className='flex flex-col gap-2 w-36 items-center'>
                        <Image src='/about/who-we-serve/Icon1.svg' alt="" width={68} height={56}/> 
                        <p className='text-[18px] text-gray-600 font-medium text-center w-56'>High School</p>
                    </div>
                    <ul className='list-disc'>
                        <li className='text-[16px] text-primary-gray'>Explore self-expression and creativity</li>
                        <li className='text-[16px] text-primary-gray'>Practice discipline</li>
                        <li className='text-[16px] text-primary-gray'>Band, orchestra, and choral enrichment</li>
                        <li className='text-[16px] text-primary-gray'>AP Music Theory and college prep</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}
