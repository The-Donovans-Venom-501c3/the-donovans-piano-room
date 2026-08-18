"use client";

import Image from "next/image";
import Link from "next/link";
import ShoppingCartIconWithBadge from "@/app/cart/components/ShoppingCartIconWithBadge";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/utils/stores";
import Profile from "@/components/atoms/Profile";
import { useEffect, useState } from "react";

export default function Navbar2() {
  const profile = useAtomValue(profileAtom);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoggedIn = Boolean(isMounted && profile?.id);

  return (
    <>
      + <nav className="fixed top-10 z-50 h-[9.5vh] w-full border-b-2 border-[#A135E8] py-2 backdrop-blur-sm">
        <div className="absolute top-0 flex h-[9.3vh] w-[24vw] justify-end rounded-r-full bg-[#601D86] py-2 pr-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/navbar/Logo2.svg"
              width={220}
              height={35}
              alt="The Donovan's Piano Room"
            />
          </Link>
        </div>
        <div className="absolute right-28 top-[0px] float-right flex h-[9.3vh] justify-center gap-16">
          <Link
            className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            href="/"
          >
            <p className="m-auto px-1">HOME</p>
            <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 transition-opacity duration-200 ease-in group-focus-within:opacity-100 group-hover:opacity-100"></div>
          </Link>

          <Link
            className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            href="/about/why-choose-us"
          >
            <p className="m-auto px-1">ABOUT</p>
            <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 transition-opacity duration-200 ease-in group-focus-within:opacity-100 group-hover:opacity-100"></div>
          </Link>

          <Link
            className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            href="/games"
          >
            <p className="m-auto px-1">GAMES</p>
            <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 transition-opacity duration-200 ease-in group-focus-within:opacity-100 group-hover:opacity-100"></div>
          </Link>

          <Link
            className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            href="/shop"
          >
            <p className="m-auto px-1">SHOP</p>
            <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 transition-opacity duration-200 ease-in group-focus-within:opacity-100 group-hover:opacity-100"></div>
          </Link>

          <Link
            className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] active:text-[#Da6a1c] 2xl:text-3xl"
            href="/contact-us"
          >
            <p className="m-auto px-1">CONTACT</p>
            <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 transition-opacity duration-200 ease-in group-focus-within:opacity-100 group-hover:opacity-100"></div>
          </Link>

          <div className="relative flex w-[40px] items-center justify-center 2xl:w-[60px]">
            <Link
              className="relative flex items-center justify-center text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] 2xl:text-3xl"
              href="/cart"
            >
              <ShoppingCartIconWithBadge />
            </Link>
          </div>

          {/* Render Profile Component when logged in */}
          {isLoggedIn ? (
            <div className="flex items-center self-center">
              <Profile showGreeting />
            </div>
          ) : (
            <Link
              className="flex h-12 items-center self-center rounded-l-full rounded-r-full bg-primary-yellow-accent px-7 text-xl font-bold text-primary-purple hover:bg-[#E98427] 2xl:text-3xl"
              href="/login"
            >
              Log In or Sign Up
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}