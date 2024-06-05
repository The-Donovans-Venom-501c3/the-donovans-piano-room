import { aboutScholarshipNavigation } from '@/utils/general'
import Link from 'next/link'
import React from 'react'

export default function AboutMembershipNav({page}: {page: string}) {
  return (
    <div className='flex gap-px h-12' style={{width: '45%'}}>
        <Link 
            className='flex-1 flex justify-center items-center p-8 text-[12px] laptop:text-[14px] desktop:py-10 desktop:text-[18px] rounded-l-xl' style={{backgroundColor: page !== aboutScholarshipNavigation.whatsIncluded ? '#FFEBD5': '#D8BCFD'}}
            href="/about/scholarship/what-is-included"><p className='text-primary-brown font-bold laptop:font-semibold' style={{}}>What’s included in a scholarship</p></Link>
        <Link className='flex-1 flex justify-center items-center p-8 text-[12px] laptop:text-[14px] desktop:py-10 desktop:text-[18px] rounded-r-xl' style={{backgroundColor: page !== aboutScholarshipNavigation.whosEligible ? '#FFEBD5': '#D8BCFD'}} href="/about/scholarship/who-is-eligible"><p  style={{}}className='text-primary-brown font-bold laptop:font-semibold'>Who is eligible for a scholarship</p></Link>
    </div>
  )
}
