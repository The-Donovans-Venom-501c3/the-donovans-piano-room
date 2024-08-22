import React from "react";
import ItemsAddedCart from "./ItemsAddedCart";
import { useAtom, useAtomValue } from "jotai";
import { addedCartItemsAtom } from "@/utils/stores";
import EmptyCart from "./EmptyCart";

export default function YourCart() {
  const addedCartItems = useAtomValue(addedCartItemsAtom)
  return (
    <div className="flex justify-center items-center bg-[#f5e8ff]">
      <div className="w-[87%] mt-[7%] bg-[#edd6fe] rounded-lg shadow-lg py-[2%] px-[4%]">    
        <h2 className="font-montserrat text-6xl 3xl:text-7xl 4xl:text-7xl font-semibold self-start text-primary-brown mb-[1%]">Your cart</h2>
         {addedCartItems.length ? <ItemsAddedCart /> : <EmptyCart/>}
      </div>
    </div>
  );
}
















