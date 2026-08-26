"use client";

import { navigationPages } from "@/utils/general";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { SxProps } from "@mui/system";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/utils/stores";
import Profile from "@/components/atoms/Profile";

export default function Navbar3({ page }: { page: string }) {
  const profile = useAtomValue(profileAtom);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoggedIn = Boolean(isMounted && profile?.id);

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
      <div className="fixed top-10 z-40 h-[8.8vh] w-[100vw] bg-[#fbf7ff] backdrop-blur-sm"></div>
      <nav className="fixed top-10 z-50 h-[9vh] w-full border-b-2 border-[#A135E8] bg-white">
        <div className="absolute top-0 flex h-[8.8vh] w-[24vw] justify-end rounded-r-full bg-[#601D86] py-2 pr-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/navbar/Logo2.svg"
              width={220}
              height={35}
              alt="The Donovan's Piano Room"
            />
          </Link>
        </div>

        {/* Fixed positioning to right-28 */}
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
            href="https://thedonovansmusicgames.netlify.app/"
          >
            <p>GAMES</p>
            {navigationPages.games === page && displayBorder()}
          </Link>

          <Link
            className="relative flex items-center text-xl font-bold text-primary-purple hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            style={navigationPages.shop === page ? highlightLink : {}}
            href="/shop"
          >
            <p>SHOP</p>
            {navigationPages.shop === page && displayBorder()}
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
            className="flex items-center text-primary-purple hover:text-[#E98427]"
            href="/cart"
          >
            <ShoppingCartOutlinedIcon sx={iconStyles} />
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center self-center">
              <Profile showGreeting />
            </div>
          ) : (
            <Link
              className="flex h-12 items-center self-center rounded-l-full rounded-r-full bg-primary-purple px-7 text-xl font-bold text-white hover:bg-[#E98427] 2xl:text-3xl"
              href="/signup"
            >
              Log In or Sign Up
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}