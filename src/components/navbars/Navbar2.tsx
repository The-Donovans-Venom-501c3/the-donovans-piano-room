'use client';
import Image from 'next/image'
import Link from 'next/link'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { SxProps } from '@mui/system';
import { useRouter } from 'next/navigation';
import { profileAtom } from '@/utils/stores';
import { useAtom } from 'jotai';



export default function Navbar2() {

  const iconStyles: SxProps = {
    fontSize: 25,
    '&:hover': {
      color: '#E98427',
    },
  };

  const router = useRouter();
  const [profile] = useAtom(profileAtom);
  console.log(profile);
  const isAuthenticated = profile.email !== "";

  const handleGamesClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert('Please log in to access the games page.');
      router.push('/login'); // Redirect to login page
    } else {
      router.push('https://thedonovansmusicgames.netlify.app/')
    }

  };

  return (
    <>
      <nav className='fixed top-0 w-full z-40 border-b-2 border-[#A135E8] backdrop-blur-sm py-2 z-50 h-[9.5vh]'>
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
          <a className='text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative cursor-pointer'
            // href="https://thedonovansmusicgames.netlify.app/"
            onClick={handleGamesClick} >
            <p>GAMES</p>
          </a>
          <Link className='text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' href="/bookstore">
            <p>BOOKSTORE</p>
          </Link>
          <Link className='text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' href="/contact-us">
            <p>CONTACT</p>
          </Link>
          <div className='relative w-[40px] 2xl:w-[60px] flex items-center justify-center'>
            <Link className='text-primary-yellow-accent hover:text-[#E98427] text-xl 2xl:text-3xl font-bold flex items-center justify-center relative'
              href="/cart">
              <ShoppingCartOutlinedIcon sx={iconStyles} />
            </Link>
          </div>
          <Link className='text-primary-purple bg-primary-yellow-accent rounded-l-full rounded-r-full px-20 h-16 hover:bg-[#E98427] flex items-center text-xl 2xl:text-3xl font-bold self-center' href="/signup">Log in or register</Link>

        </div>

      </nav>
    </>
  )
}
