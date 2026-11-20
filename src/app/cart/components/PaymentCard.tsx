"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button4 from "@/components/atoms/Button4";
import InputForm from "@/components/atoms/form-input";
import { useAtomValue, useSetAtom } from "jotai";
import { addedCartItemsAtom } from "@/store/cartStore";
import {
  checkoutCart,
  quoteCart,
  CheckoutProvider,
  CartQuoteResponse,
} from "@/lib/api/cartService";

export default function PaymentCard() {
  const addedCartItems = useAtomValue(addedCartItemsAtom)
  const setAddedCartItems = useSetAtom(addedCartItemsAtom);
  const [activeProvider, setActiveProvider] = useState<CheckoutProvider | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [quote, setQuote] = useState<CartQuoteResponse | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("checkout");
    if (status === "success") {
      setAddedCartItems([]);
      setCheckoutMessage("Payment complete - thank you for your order!");
    } else if (status === "cancelled") {
      setCheckoutMessage("Checkout was cancelled. No payment was taken.");
    } else if (status === "error" || status === "expired") {
      setCheckoutError("We couldn't complete that payment. Please try again.");
    }
  }, [setAddedCartItems]);

  const cartItemsPrice = useMemo(() => {
    let total = 0.00
    addedCartItems.forEach(item => {
      total += item.price * item.quantity
    })
    return total
  }, [addedCartItems])

  // Re-price an applied coupon when quantities/items change. The backend is
  // always the source of truth for both the discount and the final total.
  useEffect(() => {
    if (!appliedCoupon) return;

    if (addedCartItems.length === 0) {
      setAppliedCoupon(null);
      setQuote(null);
      return;
    }

    let cancelled = false;
    setIsApplyingCoupon(true);
    quoteCart(addedCartItems, appliedCoupon)
      .then((data) => {
        if (cancelled) return;
        setQuote(data);
        setCouponError("");
      })
      .catch((error: any) => {
        if (cancelled) return;
        setAppliedCoupon(null);
        setQuote(null);
        setCouponError(error?.message || "Coupon is no longer valid");
      })
      .finally(() => {
        if (!cancelled) setIsApplyingCoupon(false);
      });

    return () => {
      cancelled = true;
    };
    // Re-run only when the cart changes; applying a code is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedCartItems]);

  const subtotal = quote?.itemTotal ?? cartItemsPrice;
  const discount = quote?.discount ?? 0;
  const shipping = quote?.shipping ?? 3.00;
  const total = quote?.total ?? subtotal + shipping;
  const isCartEmpty = addedCartItems.length === 0;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");
    setCheckoutError(null);
    try {
      const data = await quoteCart(addedCartItems, code);
      setQuote(data);
      setAppliedCoupon(data.couponCode || code);
    } catch (error: any) {
      setQuote(null);
      setAppliedCoupon(null);
      setCouponError(error?.message || "Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setQuote(null);
    setCouponError("");
    setCouponInput("");
  };

  const handleCheckout = async (provider: CheckoutProvider) => {
    if (isCartEmpty || activeProvider) return;
    if (provider !== "paypal") {
      setCheckoutError("Venmo checkout isn't available yet - please use PayPal.");
      return;
    }
    setActiveProvider(provider);
    setCheckoutError(null);
    setCheckoutMessage(null);
    try {
      const result = await checkoutCart(provider, addedCartItems, appliedCoupon ?? undefined);
      if (result?.approvalUrl) {
        window.location.href = result.approvalUrl;
        return;
      }
      setCheckoutMessage(result?.message || "Order placed successfully.");
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
            <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">${subtotal.toFixed(2)}</p>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between items-center">
              <p className="font-roboto text-[1.6rem] leading-[24px] text-[#6F219E]">
                Discount {appliedCoupon ? `(${appliedCoupon})` : ""}
              </p>
              <p className="font-roboto text-[1.6rem] leading-[24px] text-[#6F219E]">
                -${discount.toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">Shipping</p>
            <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">${shipping.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t-2 border-[#D8BCFD]"></div>

        <div className="flex justify-between items-center font-bold">
          <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">Total</p>
          <p className="font-roboto text-[1.6rem] leading-[24px] text-[#1C1A1A]">${total.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-[10px] mt-[4%]">
        <InputForm
          field={{ label: "Coupon code", name: "cart-coupon-field", type: "text" }}
          text={couponInput}
          error={couponError}
          disabled={isApplyingCoupon}
          onChange={(e: any) => {
            setCouponInput(e.target.value);
            if (couponError) setCouponError("");
          }}
        />
        <div className="flex flex-row items-center gap-[10px]">
          <Button4
            text={isApplyingCoupon ? "Applying..." : "Apply Coupon"}
            style={{ height: '38px', fontSize: '1.4rem' }}
            disabled={isApplyingCoupon || isCartEmpty}
            onClick={() => void handleApplyCoupon()}
          />
          {appliedCoupon && (
            <Button4
              text="Remove"
              style={{ height: '38px', fontSize: '1.4rem' }}
              disabled={isApplyingCoupon}
              onClick={handleRemoveCoupon}
            />
          )}
        </div>
        {appliedCoupon && !couponError && (
          <p className="text-[1.3rem] font-medium text-green-700">
            Coupon {appliedCoupon} applied.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-[16px] mt-[6%]">
        <Button4
          text={activeProvider === 'paypal' ? "Redirecting..." : "Check out with PayPal"}
          style={{ height: '40px', fontSize: '1.5rem' }}
          disabled={isCartEmpty || activeProvider !== null}
          onClick={() => void handleCheckout('paypal')}
        />
        <Button4
          text="Check out with Venmo (coming soon)"
          style={{ height: '40px', fontSize: '1.5rem' }}
          disabled={isCartEmpty || activeProvider !== null}
          onClick={() => void handleCheckout('venmo')}
        />

        <p className="text-center text-[1.3rem] font-medium text-primary-gray">
          No account needed - pay securely with PayPal.
        </p>

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
