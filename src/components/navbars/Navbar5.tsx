import { navigationPages } from "@/utils/general";
import Image from "next/image";
import Link from "next/link";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { SxProps } from "@mui/system";

export default function Navbar5({ page }: { page: string }) {
  const highlightLink = { color: "#DA6A1C" };
  const displayBorder = () => (
    <div className="absolute bottom-0 h-[3px] w-full rounded-tl-xl rounded-tr-xl bg-tertiary-orange xl:h-[4px] 2xl:h-[5px]"></div>
  );
  const iconStyles: SxProps = {
    fontSize: 25,
    "&:hover": {
      color: "#E98427",
    },
  };
  return (
    <>
      <div className="fixed top-0 z-40 h-[8.8vh] w-[100vw] bg-[#F5E8FF]"></div>
      <nav className="fixed top-0 z-50 h-[9vh] w-full border-b-2 border-b-[#ecd6fe] bg-[#F5E8FF]">
        <div className="absolute top-0 flex h-[8.8vh] w-[24vw] justify-end rounded-r-full bg-secondary-purple py-2 pr-4">
          <Image
            src="/navbar/Logo.svg"
            width={220}
            height={35}
            alt="The Donovan's Piano Room"
          />
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
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' style={navigationPages.games === page ? highlightLink: {}} href="https://thedonovansmusicgames.netlify.app/">
              <p>GAMES</p>
              {navigationPages.games === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' style={navigationPages.bookstore === page ? highlightLink: {}} href="/bookstore">
             <p>BOOKSTORE</p>
             {navigationPages.bookstore === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] text-xl 2xl:text-3xl font-bold flex items-center relative' style={navigationPages.contact === page ? highlightLink: {}} href="/contact-us">
             <p>CONTACT</p>
             {navigationPages.contact === page && displayBorder()}
            </Link>
            <Link className='text-primary-purple hover:text-[#E98427] flex items-center' href="#"><ShoppingCartOutlinedIcon sx={iconStyles} /></Link>
            <Link className='text-white bg-primary-purple rounded-l-full rounded-r-full px-20 h-16 hover:bg-[#E98427] flex items-center text-xl 2xl:text-3xl font-bold self-center' href="/signup">Log in or register</Link>
        </div>
      </nav>
    </>
  );
}
