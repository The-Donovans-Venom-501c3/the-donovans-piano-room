import { navigationPages } from "@/utils/general";
import Image from "next/image";
import Link from "next/link";
import ShoppingCartIconWithBadge from "@/app/cart/components/ShoppingCartIconWithBadge";

export default function Navbar1({ page }: { page: string }) {
  const highlightLink = { color: "#DA6A1C" };
  const displayBorder = () => (
    <div className="absolute bottom-0 h-[3px] w-full rounded-tl-xl rounded-tr-xl bg-tertiary-orange xl:h-[4px] 2xl:h-[5px]"></div>
  );

  return (
    <>
      <div className="fixed top-0 z-40 h-[8.8vh] w-[100vw] bg-[#fbf7ff] backdrop-blur-sm"></div>
      <nav className="fixed top-0 z-50 h-[9vh] w-full border-b-2 border-b-[#ecd6fe] bg-white">
        <div className="absolute top-0 flex h-[8.8vh] w-[24vw] justify-end rounded-r-full bg-secondary-purple py-2 pr-4">
          <Image
            src="/navbar/Logo.svg"
            width={220}
            height={35}
            alt="The Donovan's Piano Room"
          />
        </div>

        <div className="p-y-50 absolute right-28 top-[0px] float-right flex h-[8.8vh] justify-center gap-16">
          <Link
            className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            style={navigationPages.home === page ? highlightLink : {}}
            href="/"
          >
            <p>HOME</p>
            {navigationPages.home === page && displayBorder()}
          </Link>
          <Link
            className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            style={navigationPages.about === page ? highlightLink : {}}
            href="/about/why-choose-us"
          >
            <p>ABOUT</p>
            {navigationPages.about === page && displayBorder()}
          </Link>
          <Link
            className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            style={navigationPages.games === page ? highlightLink : {}}
            href="/games"
          >
            <p>GAMES</p>
            {navigationPages.games === page && displayBorder()}
          </Link>
          <Link
            className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            style={navigationPages.bookstore === page ? highlightLink : {}}
            href="/bookstore"
          >
            <p>BOOKSTORE</p>
            {navigationPages.bookstore === page && displayBorder()}
          </Link>
          <Link
            className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            style={navigationPages.contact === page ? highlightLink : {}}
            href="/contact-us"
          >
            <p>CONTACT</p>
            {navigationPages.contact === page && displayBorder()}
          </Link>
          <Link
            className="relative flex items-center text-primary-purple hover:text-[#E98427]"
            style={navigationPages.cart === page ? highlightLink : {}}
            href="/cart"
          >
            <ShoppingCartIconWithBadge />
            {navigationPages.cart === page && displayBorder()}
          </Link>
          <Link
            className="flex h-12 items-center self-center rounded-l-full rounded-r-full bg-primary-purple px-7 text-xl font-bold text-white hover:bg-[#E98427] 2xl:text-3xl"
            href="/signup"
          >
            Log in or register
          </Link>
        </div>
      </nav>
    </>
  );
}
