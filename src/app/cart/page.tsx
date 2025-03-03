"use client";
import { navigationPages } from "@/utils/general";
import Navbar7 from "@/components/navbars/Navbar7";
import YourCart from "./components/YourCart";
import Image from "next/image";
import Footer1 from "@/components/footers/Footer1";
import FrequentlyPurchasedTogether from "@/components/atoms/FrequentlyPurchasedTogether";
export default function SignUp() {
  return (
    <div className="min-h-[100vh] w-full bg-[#F5E8FF]">
      <Navbar7 page={navigationPages.cart} />
      <YourCart />
      <FrequentlyPurchasedTogether />
      <div className="relative">
        <Footer1 />
      </div>
      <div className="absolute right-0 top-[50vh] tablet:top-[82vh] laptop:top-[70vh]">
        <div className="relative h-[8vw] w-[8vw]">
          <Image src="/bookstore/background/left-star.svg" fill alt="" />
        </div>
      </div>
    </div>
  );
}
