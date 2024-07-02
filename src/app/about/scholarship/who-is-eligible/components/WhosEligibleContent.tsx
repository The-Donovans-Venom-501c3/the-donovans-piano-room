import React from 'react'
import AboutMembershipNav from '../../components/AboutMembershipNav'
import { aboutScholarshipNavigation } from '@/utils/general'
import Image from 'next/image'
import Link from 'next/link'

export default function WhosEligibleContent() {
    return (
        <div className='flex flex-col justify-center items-center h-full gap-[5%]'>
            <h2 className='text-primary-brown font-montserrat text-6xl 3xl:text-7xl 4xl:text-8xl font-semibold'>Unlock Potential with Scholarship Power!</h2>
            <AboutMembershipNav page={aboutScholarshipNavigation.whosEligible} />
            <div className='flex items-center justify-around w-full h-[56%] laptop:h-[60%]'>
                <div className='flex flex-1 flex-col h-full justify-center items-center' style={{position: 'relative'}}>
                    <Image src='/about/scholarship/who-is-eligible/Icon1.svg' alt="" fill/>
                </div>
                <div className='flex flex-1 flex-col p-4'>
                    <p className='text-lg mt-4 ml-6 laptop:mt-8 laptop:text-[14px] desktop:text-3xl w-[85%]'>Scholarships are currently focused on two specific age groups: individuals aged 21 and younger, and those aged 60 and older.</p>
                    <p className='text-lg mt-4 ml-6 laptop:mt-8 laptop:text-[14px] desktop:text-3xl w-[85%]'>Eligibility for the scholarships is based on family income being within the Federal Poverty Level (FPL).</p>
                    <p className='text-lg mt-4 ml-6 laptop:mt-8 laptop:text-[14px] desktop:text-3xl w-[85%]'>Even if your income exceeds the FPL, you may still be eligible for partial scholarships for music education. Applicants are encouraged to inquire for more information about this option.</p>
                    <div className="flex items-center justify-start text-lg mt-4 ml-6 laptop:mt-8 laptop:text-[14px] font-semibold p-4 text-black rounded-lg w-[85%]" style={{backgroundColor: '#FFEBD5'}}>
                        <div className='flex ml-6 items-center'>
                            <Image src='/about/scholarship/who-is-eligible/Cat.svg' alt="" width={55} height={55}/>
                        </div>
                        <div className='flex ml-6 flex-1 flex-col p-4 items-start'>
                            <p>Learn more about out scholarships and eligibility on The Donovan&apos;s Venom: <Link href='https://www.donovansvenom.com/scholarships' className='text-primary-purple underline'>Visit the site</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}