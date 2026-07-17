"use client";

import { useAtomValue } from "jotai";
import { paymentSuccessAtom, orderIdAtom } from "@/store/cartStore";
import { navigationPages } from "@/utils/general";
import Navbar7 from "@/components/navbars/Navbar7";
import YourCart from "./components/YourCart";
import Image from "next/image";
import Footer1 from "@/components/footers/Footer1";
import FrequentlyPurchasedTogether from "@/components/atoms/FrequentlyPurchasedTogether";
import OrderSuccess from "./components/OrderSuccess";

export default function CartPage() {
  const paymentSuccess = useAtomValue(paymentSuccessAtom);
  const orderId = useAtomValue(orderIdAtom);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F5E8FF]">

      <Navbar7 page={navigationPages.cart} />

      <main className="flex-grow">
        {paymentSuccess ? (
          <OrderSuccess orderId={orderId} />
        ) : (
          <>
            <YourCart />
            <FrequentlyPurchasedTogether />
          </>
        )}
      </main>

      <Footer1 />

      <div className="absolute right-0 top-[50vh] tablet:top-[82vh] laptop:top-[70vh]">
        <div className="relative h-[8vw] w-[8vw]">
          <Image src="/bookstore/background/left-star.svg" fill alt="" />
        </div>
      </div>
    </div>
  );
}
