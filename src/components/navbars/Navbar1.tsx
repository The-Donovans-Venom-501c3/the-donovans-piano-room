import { navigationPages } from '@/utils/general'
import Image from 'next/image'
import Link from 'next/link'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { SxProps } from '@mui/system';




export default function Navbar1({page}: {page: string}) {
    const highlightLink = {color: "#DA6A1C"}
    const displayBorder = () => <div className='w-full bg-tertiary-orange absolute bottom-0 rounded-tl-xl rounded-tr-xl h-[3px] 2xl:h-[5px] xl:h-[4px]'></div>
    const iconStyles: SxProps = {
      fontSize: 25, 
      '&:hover': {
        color: '#E98427', 
      },
    };
  return (
    <>
    
    <div className='fixed h-[8.8vh] w-[100vw] backdrop-blur-sm z-40 bg-[#fbf7ff]'></div>
    <nav className='fixed top-0 w-full bg-white z-50 h-[9vh] border-b-2 border-b-[#ecd6fe]'>
        <div className='absolute bg-secondary-purple h-[8.8vh] w-[24vw] pr-4 py-2 rounded-r-full top-0 flex justify-end'>
            <Image src="/navbar/Logo.svg" width={220} height={35} alt='The Donovan&apos;s Piano Room' />
        </div>

        <div className='absolute flex float-right h-[8.8vh] p-y-50 top-[0px] right-36 gap-16 justify-center h-full'>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative'style={navigationPages.home === page ? highlightLink: {}} href="/">
             <p>HOME</p>
             {navigationPages.home === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' style={navigationPages.about === page ? highlightLink : {}} href="/about/why-choose-us">
              <p>ABOUT</p>
              {navigationPages.about === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' style={navigationPages.games === page ? highlightLink: {}} href="#">
              <p>GAMES</p>
              {navigationPages.games === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' style={navigationPages.bookstore === page ? highlightLink: {}} href="#">
             <p>BOOKSTORE</p>
             {navigationPages.bookstore === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' style={navigationPages.contact === page ? highlightLink: {}} href="#">
             <p>CONTACT</p>
             {navigationPages.contact === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] flex items-center' href="#"><ShoppingCartOutlinedIcon sx={iconStyles} /></Link>
            <Link className='text-white bg-primary-purple rounded-l-full rounded-r-full px-20 h-16 hover:bg-[#E98427] flex items-center text-xl 2xl:text-3xl font-bold self-center' href="/signup">Log in or register</Link>
        </div>

    </nav>
    </>
  )
}

