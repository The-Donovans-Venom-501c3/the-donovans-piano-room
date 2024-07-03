import { navigationPages } from '@/utils/general'
import Image from 'next/image'
import Link from 'next/link'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { SxProps } from '@mui/system';



export default function Navbar2(){

  const iconStyles: SxProps = {
    fontSize: 25,  
    '&:hover': {
      color: '#E98427', 
    },
  };

  return (
    <>
    
    <div className='fixed h-[9.3vh] w-[100vw] backdrop-blur-sm z-40'></div>
    <nav className='fixed top-0 w-full z-40 border-b-2 border-[#A135E8] py-2 z-50 h-[9.5vh]'>
        <div className='absolute bg-[#601D86] h-[9.3vh] w-[24vw] pr-4 py-2 rounded-r-full top-0 flex justify-end'>
              <Image src="/navbar/Logo2.svg" width={220} height={35} alt='The Donovan&apos;s Piano Room' />

        </div>
        <div className='absolute flex float-right h-[9vh] p-y-50 top-[0px] right-36 gap-16 justify-center h-full'>
            <Link className='text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' href="/">
             <p>HOME</p>
            </Link>
            <Link className='text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' href="/about/why-choose-us">
              <p>ABOUT</p>
            </Link>
            <Link className='text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' href="#">
              <p>GAMES</p>
            </Link>
            <Link className='text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' href="#">
             <p>BOOKSTORE</p>
            </Link>
            <Link className='text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' href="#">
             <p>CONTACT</p>
            </Link>
            <div className='relative w-[40px] 2xl:w-[60px] flex items-center justify-center'>
              <Link className='text-primary-yellow-accent hover:text-[#E98427] text-xl 2xl:text-3xl font-bold flex items-center justify-center relative'
               href="#">
                <ShoppingCartOutlinedIcon sx={iconStyles} />
              </Link>
            </div>
            <Link className='text-primary-purple bg-primary-yellow-accent rounded-l-full rounded-r-full px-20 h-16 hover:bg-[#E98427] flex items-center text-xl 2xl:text-3xl font-bold self-center' href="/signup">Log in or register</Link>

        </div>
 
    </nav>
    </>
  )
}
