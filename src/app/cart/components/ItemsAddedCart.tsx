import React from "react";
import PaymentCard from "./PaymentCard";
import ListedItemCard from "./ListedItemCard";
import { useAtom } from 'jotai';
import { addedCartItemsAtom } from "@/store/cartStore";

export default function ItemsAddedCart() {
  const [addedCartItems] = useAtom(addedCartItemsAtom);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full justify-between tablet:gap-8 laptop:gap-10 desktop:gap-12 tablet:pb-[6%]">
      <div className="flex flex-col tablet:w-[60%] tablet:h-[72%] desktop:w-[80%] desktop:h-full gap-8">

        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <div className="flex justify-between items-center border-b-2 border-purple-200 pb-5 mb-6 px-6 mx-2">
            <div className="font-montserrat font-bold text-3xl text-primary-brown mt-6">
              Your Bag
            </div>
            <div className="flex gap-12 text-primary-brown text-3xl font-roboto mt-6">
              <span>Qty</span>
              <span>Subtotal</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {addedCartItems.map((book, index) => (
              <ListedItemCard key={index} book={book} index={index} />
            ))}
          </div>
        </div>
      </div>
      <PaymentCard onCheckoutPayPalClick={function (): void {
        throw new Error("Function not implemented.");
      }} />
    </div>
  );
}