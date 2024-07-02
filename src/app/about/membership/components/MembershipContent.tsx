import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MembershipContent() {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-16'>
        <h2 className='text-primary-brown text-6xl 3xl:text-7xl 4xl:text-8xl font-semibold font-montserrat'>Enjoy unlimited access</h2>
        <div className='flex justify-around w-full'>
            <div className='flex flex-col bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] w-[22%] h-[32vh] p-6'>
                <h4 className='text-[20px]'>1 Day Access</h4>
                <ul className='mt-6'>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Introduction</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Access to all games and lessons</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-doesnt-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Progress tracking</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-doesnt-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Bundled savings</p>
                    </li>
                </ul>
                <Link className='w-[100%] mt-[5vh] self-center text-white bg-primary-purple rounded-l-full rounded-r-full px-20 py-3 flex items-center justify-center text-xl font-bold' href=''>Choose plan</Link>
            </div>
            <div className='flex flex-col bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] w-[22%] h-[32vh] p-6'>
                <h4 className='text-[20px]'>Monthly Access</h4>
                <ul className='mt-6'>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Introduction</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Access to all games and lessons</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Progress tracking</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-doesnt-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Bundled savings</p>
                    </li>
                </ul>
                <Link className='w-[100%] mt-[5vh] self-center text-white bg-primary-purple rounded-l-full rounded-r-full px-20 py-3 flex items-center justify-center text-xl font-bold' href=''>Choose plan</Link>
            </div>
            <div className='flex flex-col bg-white border-2 border-[#FCF0D8] rounded-3xl shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] w-[22%] h-[32vh] p-6'>
                <h4 className='text-[20px]'>Yearly Access</h4>
                <ul className='mt-6'>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Introduction</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Access to all games and lessons</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Progress tracking</p>
                    </li>
                    <li className='flex gap-6 mt-2'>
                        <Image src='/about/membership/Icon-include.svg' alt='include' width={15} height={15}></Image>
                        <p className='text-[12px]'>Bundled savings</p>
                    </li>
                </ul>
                <Link className='w-[100%] mt-[5vh] self-center text-white bg-primary-purple rounded-l-full rounded-r-full px-20 py-3 flex items-center justify-center text-xl font-bold' href=''>Choose plan</Link>
            </div>
        </div>
    </div>
  )
}
