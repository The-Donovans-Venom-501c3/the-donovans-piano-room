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
  
  // State to track client-side mounting
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only check profile after client mount to avoid SSR mismatch
  const isLoggedIn = Boolean(isMounted && profile?.id);

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
        <Link href="/" className="flex h-full items-center">
          <Image
            src="/navbar/Logo2.svg"
            width={220}
            height={35}
            alt="The Donovan's Piano Room"
          />
        </Link>
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
          style={navigationPages.shop === page ? highlightLink : {}}
          href="/shop"
        >
          <p>SHOP</p>
          {navigationPages.shop === page && displayBorder()}
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

        {/* Dynamic Auth / Profile Section */}
        {isLoggedIn ? (
          <div className="flex items-center self-center">
            <Profile showGreeting />
          </div>
        ) : (
          <Link
            className="mt-4 flex h-12 items-center rounded-l-full rounded-r-full bg-primary-purple px-7 text-xl font-bold text-white hover:bg-[#E98427]"
            href="/signup"
          >
            Log in or register
          </Link>
        )}
      </div>
    </nav>
  );
}