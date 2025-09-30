"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Button1 from "@/components/atoms/Button1";
import Button2 from "@/components/atoms/Button2";
import Footer2 from "@/components/footers/Footer2";
import Navbar2 from "@/components/navbars/Navbar2";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/api/userService"; 
import { logout } from "@/lib/api/authService";
import { isLoggedInAtom } from "@/utils/stores";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [loading, setLoading] = useState(true);

  // check auth status
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, ok } = await getUser(); 
        if (ok && data?.id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [setIsLoggedIn]);

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (!res.error) {
        setIsLoggedIn(false); 
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <>
      <Navbar2 />
      <div className="w-full h-[100vh] bg-primary-purple flex items-center justify-center relative">
        <div className="relative z-10 w-[84.7%] h-[70vh] flex items-center justify-between">
          
          {/* Left section: only visible if user is not logged in */}
          {!isLoggedIn && (
            <div className="w-[40%]">
              <div className="w-[70%]">
                <h1 className="text-white text-2xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-7xl 2xl:text-9xl 4xl:text-9xl font-semibold font-montserrat">
                  Ready for your music lesson?
                </h1>
                <p className="text-white text-xs lg:text-base xl:text-xl mt-[5%]">
                  Embark on a fun-filled musical adventure with The Donovan&apos;s Piano Room.
                  Unlock the joy of music with our tailored and enriching music lessons!
                </p>
                <div className="flex flex-col gap-[2vh] mt-[10%]">
                  <Link href="/login">
                    <Button1 text="Login" />
                  </Link>
                  <Link href="/signup">
                    <Button2 text="Sign Up" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Right section: map */}
          <div
            className={`flex justify-center items-center h-full 
              ${isLoggedIn ? "w-full" : "w-[60%]"}`}
          >
            <div
              className={`relative h-full 
                ${isLoggedIn ? "w-[60%]" : "w-[100%]"}`}
            >
              <Image className="w-full h-full" src="/home/map.svg" fill alt="" />

               <Link href={"/bookstore"}>
              <button className="absolute font-mountains font-bold left-[11.5vw] top-[10.5vh] xl:left-[14vw] xl:top-[10.5vh] xl:text-[28px] sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200">Bookstore</button>
            </Link>
            <Link href={"/about/why-choose-us"}>
              <button className="absolute font-mountains font-bold left-[29vw] top-[16vh] xl:text-[28px] sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200">About</button>
            </Link>
            <Link href={"/games"}>
              <button className="absolute font-mountains font-bold left-[19.5vw] top-[42vh] xl:text-[28px]  sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200">Games</button>
            </Link>

              <Image
                className="absolute pt-44 sm:h-[150px] sm:w-[200px] bottom-0 left-[12vw]"
                height={50}
                width={150}
                src="/home/little.svg"
                alt=""
              />
            </div>
          </div>
        </div>

             {/* background images*/}
        <div className="absolute top-[15vh] left-[34vw]">
          <div className="relative w-[5vw] h-[3vw]">
            <Image src="/background-icons/Elipse216DarkPurple.svg" fill alt="" />
          </div>
        </div>
        <div className="absolute top-[25vh] left-[29vw]">
          <div className="relative w-[1.5vw] h-[1.5vw]">
            <Image src="/background-icons/DarkPurpleDot.svg" alt="" fill />
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <div className="relative w-[15vw] h-[22vh]">
            <Image fill src="/background-icons/RightTop1.svg" alt='' />
          </div>
        </div>
        <div className="absolute bottom-0 left-0">
          <div className="relative w-[22vw] h-[25vh]">
            <Image className='' src="/background-icons/LeftBottom.svg" alt='' fill />
          </div>
        </div>

      </div>
      <Footer2 />
    </>
  );
}
