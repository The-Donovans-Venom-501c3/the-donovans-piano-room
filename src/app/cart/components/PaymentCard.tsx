import React, { useMemo, useState } from "react";
import Button3 from "@/components/atoms/Button3";
import { useAtom, useAtomValue } from "jotai";
import { addedCartItemsAtom, paymentSuccessAtom, orderIdAtom } from "@/store/cartStore";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import InputForm from "@/components/atoms/form-input";
import { createOrder, captureOrder, addCart, getCart } from "@/lib/api/orderService";

export default function PaymentCard() {
  const addedCartItems = useAtomValue(addedCartItemsAtom);
  const [showPayPalButtons, setShowPayPalButtons] = useState(false);
  const [bookCoupon, setBookCoupon] = useState("");

  const [, setPaymentSuccess] = useAtom(paymentSuccessAtom);
  const [, setOrderId] = useAtom(orderIdAtom);

  const cartItemsPrice = useMemo(() => {
    return addedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [addedCartItems]);

  return (
    <div className="flex flex-col rounded-[12px] bg-white p-[32px] gap-[1vh] shadow-md tablet:w-full laptop:w-[45%] h-full mt-6">
      <h4 className="font-roboto text-4xl font-semibold leading-[28px] text-[#59371D]">
        Order Summary
      </h4>

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

      <div className="flex flex-col gap-[16px] mt-8">
        <div className="flex flex-row items-center gap-[24px] w-full mb-8">
          <div className="flex-1">
            <InputForm
              field={{ label: "Coupon code", name: "coupon-field", type: "text" }}
              onChange={(e: any) => setBookCoupon(e.target.value)}
              text={bookCoupon}
              error=""
            />
          </div>

          <button
            type="button"
            onClick={() => console.log("Apply Coupon:", bookCoupon)}
            className="text-[#6F219E] text-[1.6rem] underline font-bold hover:text-[#4E0B76] transition-colors"
          >
            Apply Coupon
          </button>
        </div>

        {!showPayPalButtons ? (
          <Button3
            text={
              <div className="flex items-center justify-center gap-3">
                <span>Check out with PayPal</span>
                <img src="/cart/payPal_icon.svg" alt="PayPal" className="h-8 w-auto" />
              </div>
            }
            style={{ height: "40px", fontSize: "1.5rem" }}
            onClick={() => setShowPayPalButtons(true)}
          />
        ) : (
          <PayPalScriptProvider
            options={{
              clientId: "Ab-ZnNpCpMapofNSWLngt911ZgzpZMAZ2BozOp8Wj0V83OGyu2Ypui6zYGYT5PWSrAQNxZunuRFYr35F",
            "enable-funding": "venmo,card",
            }}
          >
            <PayPalButtons
              style={{
                shape: "pill",
                color: "gold",
                layout: "vertical",
                label: "paypal",
                height: 40,
              }}
              createOrder={async () => {
                const simplifiedItems = addedCartItems.map((item) => ({
                  product_id: item.id,
                  name: item.title,
                  quantity: item.quantity,
                  price: item.price,
                }));

                const cartData = {
                  items: simplifiedItems,
                  total: parseFloat((cartItemsPrice + 3).toFixed(2)),
                };

                await addCart({ cart: cartData });
                const order = await createOrder(cartData);
                return order.id;
              }}
              onApprove={async (data) => {
                try {
                  const result = await captureOrder(data.orderID);
                  setOrderId(result.id);       
                  setPaymentSuccess(true);    
                  console.log("Captured result:", result);
                } catch (error) {
                  console.error("Capture failed:", error);
                  alert("Something went wrong during payment capture.");
                }
              }}
            />
             <PayPalButtons
      fundingSource="venmo"
      style={{
        shape: "pill",
        color: "blue",
        layout: "vertical",
        label: "venmo",
        height: 40,
      }}
      />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  );
}
