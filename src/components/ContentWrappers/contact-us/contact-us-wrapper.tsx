import React from 'react'
import BackgroundContactUs from './background-contact-us'

export default function ContactUsContentWrapper({children}: {children: React.ReactNode}) {
  return (
    <div className='bg-primary-yellow'>
        <BackgroundContactUs/>
        <div className='relative z-40 flex flex-col items-center justify-center px-4 py-8 min-h-screen'>
          {children}
        </div>
    </div>
  )
}
