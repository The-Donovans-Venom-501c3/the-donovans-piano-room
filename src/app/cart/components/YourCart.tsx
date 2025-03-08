import React from "react";
import ItemsAddedCart from "./ItemsAddedCart";
import { useAtom, useAtomValue } from "jotai";
import EmptyCart from "./EmptyCart";
import { addedCartItemsAtom } from "@/store/cartStore";

export default function YourCart() {
  const addedCartItems = useAtomValue(addedCartItemsAtom);
  return (
    <div className="flex items-center justify-center bg-[#f5e8ff]">
      <div className="mt-[80px] w-[87%] rounded-lg bg-[#edd6fe] px-[4%] py-[2%] shadow-lg">
        <h2 className="mb-[1%] self-start font-montserrat text-6xl font-semibold text-primary-brown 3xl:text-7xl 4xl:text-7xl">
          Your cart
        </h2>
        {addedCartItems.length ? <ItemsAddedCart /> : <EmptyCart />}
      </div>
    </div>
  );
}
