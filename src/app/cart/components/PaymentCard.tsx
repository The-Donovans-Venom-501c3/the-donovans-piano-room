"use client";

import React, { useMemo, useState } from "react";
import Button3 from "@/components/atoms/Button3";
import Button4 from "@/components/atoms/Button4";
import { useAtomValue } from "jotai";
import { addedCartItemsAtom } from "@/store/cartStore";

export default function PaymentCard({
  onCheckoutCreditCardClick,
}: {
  onCheckoutCreditCardClick: () => void;
}) {
  const addedCartItems = useAtomValue(addedCartItemsAtom);
  const [checkoutStarted, setCheckoutStarted] = useState(false);

  const cartItemsPrice = useMemo(() => {
    let total = 0.0;
    addedCartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }, [addedCartItems]);

  const handleCreditCardClick = () => {
    setCheckoutStarted(true);
    onCheckoutCreditCardClick();
  };

  return (
    <div className="flex flex-col rounded-[12px] bg-white p-[32px] gap-[1vh] shadow-md tablet:w-full laptop:w-[45%] h-full">
      <h4 className="font-roboto text-4xl font-semibold leading-[28px] text-[#59371D]">Order Summary</h4>

      <div className="flex flex-col gap-[1vh]">
        <div className="flex justify-between">
          <p className="text-[1.6rem] text-[#1C1A1A]">Original Price</p>
          <p className="text-[1.6rem] text-[#1C1A1A]">${cartItemsPrice.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-[1.6rem] text-[#1C1A1A]">Shipping</p>
          <p className="text-[1.6rem] text-[#1C1A1A]">$3.00</p>
        </div>
        <div className="border-t-2 border-[#D8BCFD] my-2"></div>
        <div className="flex justify-between font-bold">
          <p className="text-[1.6rem] text-[#1C1A1A]">Total</p>
          <p className="text-[1.6rem] text-[#1C1A1A]">${(cartItemsPrice + 3).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-[16px] mt-[6%]">
        {!checkoutStarted ? (
          <>
            <Button3
              text="Check out with Credit Card"
              style={{ height: "40px", fontSize: "1.5rem" }}
              onClick={handleCreditCardClick}
            />
            <Button4 text="Check out with PayPal" style={{ height: "40px", fontSize: "1.5rem" }} />
            <Button4 text="Check out with Venmo" style={{ height: "40px", fontSize: "1.5rem" }} />
          </>
        ) : (
          <button
            className="px-6 py-2 rounded-full text-[1.5rem] font-bold bg-purple-800 text-white transition-colors duration-200"
          >
            Proceed to checkout
          </button>
        )}
      </div>
    </div>
  );
}
