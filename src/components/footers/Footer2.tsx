import Image from 'next/image'
import Link from 'next/link'

export default function Footer2() {
  return (
    <div className='fixed flex justify-center items-center bottom-0 w-full border-t-2 border-[#A135E8] backdrop-blur-sm h-[9.3vh] z-40'>
        <div className='flex justify-between h-[28px] w-[84.7%] z-50'>
            <h2 className='text-white 2xl:text-[14px] w-[290px] 2xl:w-[400px]'
            >Copyright © 2025 The Donovan&apos;s Piano Room. Powered by <Link className='text-primary-yellow underline' target='_blank' href='https://www.thedonovan.org/'>The Donovan&apos;s Venom</Link>, a 501(c)(3) nonprofit organization.</h2>
            <div className='flex gap-8'>

                <div className="relative h-[4.5vh] w-[4.5vh]">
                <Link href="https://x.com/iamthedonovan?s=11" target="_blank">
                 <Image src="/footer/YellowTwitter.svg" fill alt='Twitter' />
                </Link>
            </div>

            <div className="relative h-[4.5vh] w-[4.5vh]">
                <Link href="https://www.facebook.com/TheDonovansVenomINC/" target="_blank">
                 <Image src="/footer/YellowFacebook.svg" fill alt='Facebook' />
                </Link>
            </div>

            <div className="relative h-[4.5vh] w-[4.5vh]">
                <Link href="https://www.youtube.com/@thedonovansvenom2848" target="_blank">
                 <Image src="/footer/YellowYoutube.svg" fill alt='Youtube' />
                </Link>
            </div>
            
            </div>
        </div>
    </div>
  )
}
