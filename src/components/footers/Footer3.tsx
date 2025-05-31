import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer3() {
  return (
    <div className='fixed flex justify-center items-center bottom-0 w-full border-t-2 border-[#A135E8] z-40 backdrop-blur-sm' style={{height: '70px'}}>
        <div className='flex justify-between h-[28px]' style={{width: '84.7%'}}>
            <h2 className='text-black'
            style={{width: '290px'}}
            >Copyright © 2025 The Donovan&apos;s Piano Room. Powered by <Link className='text-primary-purple underline' target='_blank' href='https://www.thedonovan.org/'>The Donovan&apos;s Venom</Link>, a 501(c)(3) nonprofit organization.</h2>
            <div className='flex gap-8'>

            <div className="relative h-[3.5vh] w-[3.5vh]">
                <Link href="https://x.com/iamthedonovan?s=11" target="_blank">
                 <Image src="/footer/Twitter.svg" fill alt='Twitter' />
                </Link>
            </div>

            <div className="relative h-[3.5vh] w-[3.5vh]">
                <Link href="https://www.facebook.com/TheDonovansVenomINC/" target="_blank">
                 <Image src="/footer/Facebook.svg" fill alt='Facebook' />
                </Link>
            </div>

            <div className="relative h-[3.5vh] w-[3.5vh]">
                <Link href="https://www.youtube.com/@thedonovansvenom2848" target="_blank">
                 <Image src="/footer/Youtube.svg" fill alt='Youtube' />
                </Link>
            </div>



            </div>
        </div>
    </div>
  )
}
