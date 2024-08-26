import { navigationPages } from '@/utils/general'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { SxProps } from '@mui/system';



export default function Navbar3({page}: {page: string}){
  const highlightLink = {color: "#DA6A1C"}
  const displayBorder = () => <div className='w-full bg-tertiary-orange absolute bottom-0 rounded-tl-xl rounded-tr-xl' style={{height: "3px"}}></div>
  
  const iconStyles: SxProps = {
    fontSize: 25,  
    '&:hover': {
      color: '#E98427', 
    },
  };

  return (
    <nav className='fixed top-0 w-full z-40 border-b-2 border-[#A135E8] h-[8vh] z-50 backdrop-blur-sm'>
        <div className='fixed bg-[#601D86] pl-40 pr-4 h-full rounded-r-full top-0'>
            <Image src="/navbar/Logo2.svg" width={220} height={35} alt='The Donovan&apos;s Piano Room' />
        </div>
        <div className='flex float-right h-full py-50 mr-36 gap-16'>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 3xl:text-2xl 4xl:text-3xl font-bold flex items-center relative'style={navigationPages.home === page ? highlightLink: {}} href="/">
             <p>HOME</p>
             {navigationPages.home === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 3xl:text-2xl 4xl:text-3xl font-bold flex items-center relative'style={navigationPages.about === page ? highlightLink: {}} href="/about/why-choose-us">
              <p>ABOUT</p>
              {navigationPages.about === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 3xl:text-2xl 4xl:text-3xl font-bold flex items-center relative'style={navigationPages.games === page ? highlightLink: {}} href="https://thedonovansmusicgames.netlify.app/">
              <p>GAMES</p>
              {navigationPages.games === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 3xl:text-2xl 4xl:text-3xl font-bold flex items-center relative'style={navigationPages.bookstore === page ? highlightLink: {}} href="/bookstore">
             <p>BOOKSTORE</p>
             {navigationPages.bookstore === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 3xl:text-2xl 4xl:text-3xl font-bold flex items-center relative'style={navigationPages.contact === page ? highlightLink: {}} href="/contact-us">
             <p>CONTACT</p>
             {navigationPages.contact === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] text-xl 3xl:text-2xl 4xl:text-3xl font-bold flex items-center'  href="/cart">
            <ShoppingCartOutlinedIcon sx={iconStyles} />
            </Link>
            <Link className='text-white bg-primary-purple rounded-l-full rounded-r-full px-20 h-16 mt-4 flex items-center text-xl font-bold hover:bg-[#E98427]' href="/signup">Log in or register</Link>
        </div>

    </nav>
  )
}
