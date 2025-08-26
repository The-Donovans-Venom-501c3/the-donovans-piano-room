"use client";
import Image from "next/image";
import Link from "next/link";
import ShoppingCartIconWithBadge from "@/app/cart/components/ShoppingCartIconWithBadge";
import Profile from "@/components/atoms/ProfileHome";
import { getUser } from "@/lib/api/userService";
import { logout } from "@/lib/api/authService";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { profileAtom, isLoggedInAtom } from "@/utils/stores";

export default function Navbar2() {
  const [profile, setProfile] = useAtom(profileAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  useEffect(() => {
    async function checkLogin() {
      const { data, ok } = await getUser();
      if (ok && data?.id) {
        setProfile(data);
        setIsLoggedIn(true);
      }
    }
    checkLogin();
  }, [setProfile, setIsLoggedIn]);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
  };

  return (
    <nav className="fixed top-0 z-50 h-[9.5vh] w-full border-b-2 border-[#A135E8] py-2 backdrop-blur-sm">
      <div className="absolute top-0 flex h-[9.3vh] w-[24vw] justify-end rounded-r-full bg-[#601D86] py-2 pr-4">
        <Image
          src="/navbar/Logo2.svg"
          width={220}
          height={35}
          alt="The Donovan's Piano Room"
        />
      </div>

      <div className="absolute right-28 top-0 flex h-[9.3vh] items-center gap-16">
        <Link
          className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] 2xl:text-3xl"
          href="/"
        >
          <p className="m-auto px-1">HOME</p>
          <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 group-hover:opacity-100"></div>
        </Link>
        <Link
          className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] 2xl:text-3xl"
          href="/about/why-choose-us"
        >
          <p className="m-auto px-1">ABOUT</p>
          <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 group-hover:opacity-100"></div>
        </Link>
        <Link
          className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] 2xl:text-3xl"
          href="/games"
        >
          <p className="m-auto px-1">GAMES</p>
          <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 group-hover:opacity-100"></div>
        </Link>
        <Link
          className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] 2xl:text-3xl"
          href="/bookstore"
        >
          <p className="m-auto px-1">BOOKSTORE</p>
          <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 group-hover:opacity-100"></div>
        </Link>
        <Link
          className="group relative flex h-full flex-col items-center justify-between text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] 2xl:text-3xl"
          href="/contact-us"
        >
          <p className="m-auto px-1">CONTACT</p>
          <div className="h-[4px] w-full rounded-t-lg bg-[#Da6a1c] opacity-0 group-hover:opacity-100"></div>
        </Link>

        <div className="relative flex w-[40px] items-center justify-center 2xl:w-[60px]">
          <Link
            className="relative flex items-center justify-center text-xl font-bold text-primary-yellow-accent hover:text-[#E98427] 2xl:text-3xl"
            href="/cart"
          >
            <ShoppingCartIconWithBadge />
          </Link>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-4 mb-4">
            <Profile />
          </div>
        ) : (
          <Link
            className="flex h-12 items-center self-center rounded-full bg-primary-yellow-accent px-7 text-xl font-bold text-purple-800 hover:bg-[#E98427] 2xl:text-3xl"
            href="/signup"
          >
            Log in or register
          </Link>
        )}
      </div>
    </nav>
  );
}
