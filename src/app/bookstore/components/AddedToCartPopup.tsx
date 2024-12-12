"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { addedCartItemAtom } from "@/utils/stores";
import Link from "next/link";

export default function AddedToCartPopup() {
  const [addedCartItem, setAddedCartItem] = useAtom(addedCartItemAtom);
  const closeSuccessPopup = () => setAddedCartItem(null);
  return (
    addedCartItem && (
      <div className="fixed left-[7.4vw] top-[13vh] z-[80] flex h-[6vh] w-[85%] items-center justify-between rounded-2xl bg-primary-yellow-accent">
        <div className="flex items-center">
          <div className="relative ml-[1vw] h-[2.5vh] w-[2.5vh]">
            <Image src="/about/membership/Icon-include.svg" fill alt="" />
          </div>
          <h5 className="ml-[.5vw] text-xl 3xl:text-2xl 4xl:text-3xl">{`“${addedCartItem.title}” has been added to your cart`}</h5>
        </div>
        <div className="flex items-center">
          <Link
            href="/cart"
            className="ml-[.5vw] text-xl font-semibold text-primary-purple underline 3xl:text-2xl 4xl:text-3xl"
          >
            View cart
          </Link>
          <div
            className="relative mr-[1vw] h-[5vh] w-[5vh]"
            onClick={closeSuccessPopup}
          >
            <Image src="/Close.svg" fill alt="" />
          </div>
        </div>
      </div>
    )
  );
}
