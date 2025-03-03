import { navigationPages } from "@/utils/general";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { SxProps } from "@mui/system";

export default function Navbar3({ page }: { page: string }) {
  const highlightLink = { color: "#DA6A1C" };
  const displayBorder = () => (
    <div
      className="absolute bottom-0 w-full rounded-tl-xl rounded-tr-xl bg-tertiary-orange"
      style={{ height: "3px" }}
    ></div>
  );

  const iconStyles: SxProps = {
    fontSize: 25,
    "&:hover": {
      color: "#E98427",
    },
  };

  return (
    <nav className="fixed top-0 z-40 h-[8vh] w-full border-b-2 border-[#A135E8] backdrop-blur-sm">
      <div className="fixed top-0 h-full rounded-r-full bg-[#601D86] pl-40 pr-4">
        <Image
          src="/navbar/Logo2.svg"
          width={220}
          height={35}
          alt="The Donovan's Piano Room"
        />
      </div>
      <div className="py-50 float-right mr-36 flex h-full gap-16">
        <Link
          className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 3xl:text-2xl 4xl:text-3xl"
          style={navigationPages.home === page ? highlightLink : {}}
          href="/"
        >
          <p>HOME</p>
          {navigationPages.home === page && displayBorder()}
        </Link>
        <Link
          className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 3xl:text-2xl 4xl:text-3xl"
          style={navigationPages.about === page ? highlightLink : {}}
          href="/about/why-choose-us"
        >
          <p>ABOUT</p>
          {navigationPages.about === page && displayBorder()}
        </Link>
        <Link
          className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 3xl:text-2xl 4xl:text-3xl"
          style={navigationPages.games === page ? highlightLink : {}}
          href="https://thedonovansmusicgames.netlify.app/"
        >
          <p>GAMES</p>
          {navigationPages.games === page && displayBorder()}
        </Link>
        <Link
          className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 3xl:text-2xl 4xl:text-3xl"
          style={navigationPages.bookstore === page ? highlightLink : {}}
          href="/bookstore"
        >
          <p>BOOKSTORE</p>
          {navigationPages.bookstore === page && displayBorder()}
        </Link>
        <Link
          className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 3xl:text-2xl 4xl:text-3xl"
          style={navigationPages.contact === page ? highlightLink : {}}
          href="/contact-us"
        >
          <p>CONTACT</p>
          {navigationPages.contact === page && displayBorder()}
        </Link>
        <Link
          className="flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] 3xl:text-2xl 4xl:text-3xl"
          href="/cart"
        >
          <ShoppingCartOutlinedIcon sx={iconStyles} />
        </Link>
        <Link
          className="mt-4 flex h-12 items-center rounded-l-full rounded-r-full bg-primary-purple px-7 text-xl font-bold text-white hover:bg-[#E98427]"
          href="/signup"
        >
          Log in or register
        </Link>
      </div>
    </nav>
  );
}
