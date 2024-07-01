import Image from 'next/image'
import Link from 'next/link'

export default function Footer1() {
  return (
    <div className='fixed flex justify-center items-center bottom-0 w-full border-t-2 border-t-primary-purple h-[9.3vh] z-40'>
        <div className='fixed h-[9.1vh] w-[100vw] backdrop-blur-lg z-40'></div>
        <div className='flex justify-between h-[28px] w-[84.7%] z-50'>
            <h2 className='2xl:text-[14px] w-[290px] 2xl:w-[400px]'
            >Copyright © 2024 The Donovan&apos;s Piano Room. Powered by <Link className='text-primary-purple underline' target='_blank' href='https://www.thedonovan.org/'>The Donovan&apos;s Venom</Link>, a 501(c)(3) nonprofit organization.</h2>
            <div className='flex gap-8'>

            <div className="relative h-[3.5vh] w-[3.5vh]">
                <Link href="https://x.com/iamthedonovan?s=11" target="_blank">
                 <Image src="/about/icons/Twitter.svg" fill alt='Twitter' />
                </Link>
            </div>

            <div className="relative h-[3.5vh] w-[3.5vh]">
                <Link href="https://www.facebook.com/TheDonovansVenomINC/" target="_blank">
                 <Image src="/about/icons/Facebook.svg" fill alt='Facebook' />
                </Link>
            </div>

            <div className="relative h-[3.5vh] w-[3.5vh]">
                <Link href="https://www.youtube.com/@thedonovansvenom2848" target="_blank">
                 <Image src="/about/icons/Youtube.svg" fill alt='Youtube' />
                </Link>
            </div>


            </div>
        </div>
    </div>
  )
}
