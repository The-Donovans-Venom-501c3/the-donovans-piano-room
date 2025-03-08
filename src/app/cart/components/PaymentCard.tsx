import React, { useMemo } from "react";
import Button3 from "@/components/atoms/Button3";
import Button4 from "@/components/atoms/Button4";
import { useAtomValue } from "jotai";
import { addedCartItemsAtom } from "@/store/cartStore";

export default function PaymentCard() {
  const addedCartItems = useAtomValue(addedCartItemsAtom)
  const cartItemsPrice = useMemo(() => {
    let total = 0.00
    addedCartItems.forEach(item => {
      total += parseFloat(item.price) * item.quantity
    })
    return total
  }, [addedCartItems])

  return (
    <div className="flex flex-col rounded-[12px] bg-white p-[32px] gap-[1vh] shadow-md tablet:w-full laptop:w-[45%] h-full">
      <h4 className="font-roboto text-4xl font-semibold leading-[28px] text-[#59371D]">
        Order Summary
      </h4>


      <div className="flex flex-col gap-[1vh]">
        <div className="flex flex-col gap-[0.5vh]">
          <div className="flex justify-between items-center">
            <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">Original Price</p>
            <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">${cartItemsPrice.toFixed(2)}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">Shipping</p>
            <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">$3.00</p>
          </div>
        </div>

        <div className="border-t-2 border-[#D8BCFD]"></div>

        <div className="flex justify-between items-center font-bold">
          <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">Total</p>
          <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">${(cartItemsPrice + 3.00).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-[16px] mt-[6%]">
        <Button3 text="Check out with Credit Card" style={{ height: '40px', fontSize: '1.5rem' }} />
        <Button4 text="Check out with PayPal" style={{ height: '40px', fontSize: '1.5rem' }} />
        <Button4 text="Check out with Venmo" style={{ height: '40px', fontSize: '1.5rem' }} />
      </div>
    </div>
  );
}
















