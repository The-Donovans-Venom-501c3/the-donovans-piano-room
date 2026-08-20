"use client";

import Button1 from "@/components/atoms/Button1";
import Button2 from "@/components/atoms/Button2";
import Footer2 from "@/components/footers/Footer2";
import Navbar2 from "@/components/navbars/Navbar2";
import Image from "next/image";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/utils/stores";

export default function Home() {
  const profile = useAtomValue(profileAtom);
  
  const isLoggedIn = Boolean(profile?.id);

  return (
    <>
      <Navbar2 />
      <div className="w-full h-[100vh] bg-primary-purple flex items-center justify-center">
        <div className="relative z-10 w-[84.7%] h-[70vh] flex items-center justify-between">
          
          {/* Left Text & CTA Section */}
          <div className="w-[40%]">
            <div className="w-[70%]">
              <h1 className="text-white text-2xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-7xl 2xl:text-9xl 4xl:text-9xl font-semibold font-montserrat">
                Ready for your music lesson?
              </h1>
              <p className="text-white text-xs lg:text-base xl:text-xl sm:text-xs mt-[5%]">
                Embark on a fun-filled musical adventure with The Donovan&apos;s Piano Room. Unlock the joy of music with our tailored and enriching music lessons!
              </p>
              <div className="flex flex-col gap-[2vh] mt-[10%]">
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button1 text="Enter The Donovan's Piano Room"></Button1>
                  </Link>
                ) : (
                  <>
                    <Link href="/login"><Button1 text="Login"></Button1></Link>
                    <Link href={"/signup"}><Button2 text="Sign Up"></Button2></Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Interactive Map Section */}
          <div className="relative w-[60%] h-[100%]">
            {/* Map Canvas Background */}
            <Image className="w-full h-full object-contain" src="/home/map.svg" fill alt="Map" />
            
            {/* Shop Link */}
            <Link href={"/shop"}>
              <button className="absolute font-mountains font-bold left-[34%] top-[20%] -translate-x-1/2 -translate-y-1/2 xl:text-[28px] sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200 z-10">
                Shop
              </button>
            </Link>

            {/* About Link */}
            <Link href={"/about/why-choose-us"}>
              <button className="absolute font-mountains font-bold left-[60%] top-[26%] -translate-x-1/2 -translate-y-1/2 xl:text-[28px] sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200 z-10">
                About
              </button>
            </Link>

            {/* Games Link */}
            <Link href={"/games"}>
              <button className="absolute font-mountains font-bold left-[44%] top-[63%] -translate-x-1/2 -translate-y-1/2 xl:text-[28px] sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200 z-10">
                Games
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative Background Icons */}
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
            <Image fill src="/background-icons/RightTop1.svg" alt="" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0">
          <div className="relative w-[22vw] h-[25vh]">
            <Image src="/background-icons/LeftBottom.svg" alt="" fill />
          </div>
        </div>

      </div>
      <Footer2 />
    </>
  );
}