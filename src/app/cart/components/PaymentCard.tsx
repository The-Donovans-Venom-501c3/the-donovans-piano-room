"use client";
import React, { useMemo, useState } from "react";
import Button4 from "@/components/atoms/Button4";
import { useAtomValue } from "jotai";
import { addedCartItemsAtom } from "@/store/cartStore";
import { checkoutCart, CheckoutProvider } from "@/lib/api/cartService";

export default function PaymentCard() {
  const addedCartItems = useAtomValue(addedCartItemsAtom)
  const [activeProvider, setActiveProvider] = useState<CheckoutProvider | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const cartItemsPrice = useMemo(() => {
    let total = 0.00
    addedCartItems.forEach(item => {
      total += item.price * item.quantity
    })
    return total
  }, [addedCartItems])

  const isCartEmpty = addedCartItems.length === 0;

  const handleCheckout = async (provider: CheckoutProvider) => {
    if (isCartEmpty || activeProvider) return;
    setActiveProvider(provider);
    setCheckoutError(null);
    setCheckoutMessage(null);
    try {
      const result = await checkoutCart(provider, addedCartItems);
      if (result?.approvalUrl) {
        // Provider (PayPal/Venmo) requires redirect authorization
        window.location.href = result.approvalUrl;
        return;
      }
      setCheckoutMessage(result?.message || "Order placed! Check your email for confirmation.");
    } catch (error: any) {
      setCheckoutError(error?.message || "Checkout is unavailable right now. Please try again.");
    } finally {
      setActiveProvider(null);
    }
  };

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
        {/* Credit-card checkout hidden for now: raw card collection is not PCI-compliant.
            Re-enable once a PSP-hosted card element (Stripe/Braintree) is integrated. */}
        <Button4
          text={activeProvider === 'paypal' ? "Redirecting..." : "Check out with PayPal"}
          style={{ height: '40px', fontSize: '1.5rem' }}
          disabled={isCartEmpty || activeProvider !== null}
          onClick={() => void handleCheckout('paypal')}
        />
        <Button4
          text={activeProvider === 'venmo' ? "Redirecting..." : "Check out with Venmo"}
          style={{ height: '40px', fontSize: '1.5rem' }}
          disabled={isCartEmpty || activeProvider !== null}
          onClick={() => void handleCheckout('venmo')}
        />

        {isCartEmpty && (
          <p className="text-center text-[1.3rem] font-medium text-primary-gray">
            Add items to your cart to check out.
          </p>
        )}
        {checkoutError && (
          <p className="text-center text-[1.3rem] font-semibold text-red-600">{checkoutError}</p>
        )}
        {checkoutMessage && (
          <p className="text-center text-[1.3rem] font-semibold text-green-700">{checkoutMessage}</p>
        )}
      </div>
    </div>
  );
}
