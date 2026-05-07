import Footer2 from '@/components/footers/Footer2'
import Navbar2 from '@/components/navbars/Navbar2'
import React from 'react'
import BackgroundSignup from './BackgroundAuth'

export default function AuthContentWrapper({children}: {children: React.ReactNode}) {
  return (
    <div className='bg-primary-purple'>
        <Navbar2 />
        <BackgroundSignup/>
        <section className='relative z-40 mx-auto flex flex-col items-center justify-center px-4 min-h-screen pt-[calc(9.5vh+2rem)] pb-[calc(9.3vh+2rem)]'>
          {children}

        </section>
        <Footer2 />
    </div>
  )
}
