import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function WhyChooseUsContent() {
  return (
    <div className='flex h-full'>
    <div className='flex-1 flex items-center justify-center'>
      <div style={{width: "275px"}}>
        <h2 className='text-primary-brown text-5xl font-semibold w-96'>Boost your musical abilities</h2>
        <p className='text-2xl text-primary-gray mt-4'>From learning to read music on the fly to mastering essential chords and scales, understanding rhythm basics, diving into music theory, preparing for college, and honing instrument skills, our program offers a well-rounded approach to musical growth.</p>
        <div className='flex gap-5 mt-6'>
          <Link className='text-white font-bold text-xl bg-primary-purple py-4 px-8 rounded-l-full rounded-r-full' href="#">Book a demo</Link>
          <Link className='text-primary-purple font-bold text-xl py-4 px-8 border-primary-purple border rounded-l-full rounded-r-full' href='#'>Sign up free</Link>
        </div>
      </div>
    </div>
    <div className='flex-1 grid grid-cols-3 justify-center items-center'>
      <div className='w-52 h-60 bg-white border-2 border-[#FCF0D8] rounded-3xl flex flex-col items-center justify-center gap-3 shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]'>
        <Image src="/about/why-choose-us/Icon1.svg" alt="" width={68} height={56} />
        <p className='text-[#696061] text-3xl text-center font-medium'>Note Recognition</p>
      </div>
      <div className='w-52 h-60 bg-white border-2 border-[#FCF0D8] rounded-3xl flex flex-col items-center justify-center gap-3 shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]'>
        <Image src="/about/why-choose-us/Icon2.svg" alt="" width={68} height={56} />
        <p className='text-[#696061] text-3xl text-center font-medium'>Chord Recognition</p>
      </div>
      <div className='w-52 h-60 bg-white border-2 border-[#FCF0D8] rounded-3xl flex flex-col items-center justify-center gap-3 shadow-[#AC7A2280] shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px]'>
        <Image src="/about/why-choose-us/Icon3.svg" alt="" width={68} height={56} />
        <p className='text-[#696061] text-3xl text-center font-medium w-28'>Ear Training</p>
      </div>
    </div>
  </div>
  )
}
