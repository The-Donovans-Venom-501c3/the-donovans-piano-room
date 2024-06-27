import Footer3 from '@/components/footers/Footer3'
import Navbar3 from '@/components/navbars/Navbar3'
import React from 'react'
import BackgroundContactUs from './background-contact-us'

export default function ContactUsContentWrapper({children}: {children: React.ReactNode}) {
  return (
    <div className='bg-primary-yellow'>
        <Navbar3 page='contact'/>
        <BackgroundContactUs/>
        <section className='relative z-40 mx-auto flex flex-col items-center justify-center px-4 py-8 md:h-screen'>
          {children}
        </section>
        <Footer3 />
    </div>
  )
}
