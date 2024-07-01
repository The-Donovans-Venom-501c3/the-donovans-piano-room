import Image from "next/image";
import Link from "next/link";

export default function Footer4() {
  return (
    <div className="relative z-50 h-[9.5vh] border-t border-[#F8DCB0] flex justify-center items-center z-40 backdrop-blur-sm">
      <div className="flex justify-between h-[28px] w-[84.7%] z-50">
        <h2 className='2xl:text-[14px] w-[290px] 2xl:w-[400px]'
          >Copyright © 2024 The Donovan&apos;s Piano Room. Powered by <Link className='text-primary-purple underline' target='_blank' href='https://www.thedonovan.org/'>The Donovan&apos;s Venom</Link>, a 501(c)(3) nonprofit organization.</h2>
        <div className='flex gap-[2vw]'>
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
