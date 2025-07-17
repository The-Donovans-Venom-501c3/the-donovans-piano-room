"use client";

import { useState } from "react";
import ShippingForm from "./ShippingForm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createOrder, captureOrder } from "@/lib/api/orderService";
import { useAtomValue } from "jotai";
import { addedCartItemsAtom } from "@/store/cartStore";

export default function PaymentPage({ onBillingAddressFilled }: { onBillingAddressFilled: (billing: any) => void }) {
  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
  });

  const cartItems = useAtomValue(addedCartItemsAtom);
  const [isShippingValid, setIsShippingValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const inputStyle =
    "w-full rounded-[12px] border border-[#391F0F] bg-[#FEF8EE] px-4 pt-6 pb-2 text-[#5C3A0F] placeholder-[#BCA29C] focus:outline-none focus:ring-2 focus:ring-[#BFA2FF]";
  const labelStyle = "absolute top-2 left-4 text-[10px] font-medium text-[#391F0F] pointer-events-none";

  const hasBillingInput = Object.values(billing).some((v) => v.trim() !== "");

  return (
    <PayPalScriptProvider options={{ clientId: "Ab-ZnNpCpMapofNSWLngt911ZgzpZMAZ2BozOp8Wj0V83OGyu2Ypui6zYGYT5PWSrAQNxZunuRFYr35F" }}>
      <form className="space-y-6 bg-white p-8 rounded-[12px] shadow-md relative">
        <h2 className="text-2xl font-semibold text-[#5C3A0F]">Payment information</h2>

        <h3 className="text-md font-semibold text-[#5C3A0F]">Billing address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "firstName", label: "First name *" },
            { id: "lastName", label: "Last name *" },
            { id: "address", label: "Street address *", colSpan: 2 },
            { id: "apt", label: "Apt/suite/other (Optional)", colSpan: 2 },
            { id: "city", label: "City *" },
            { id: "state", label: "State *", isSelect: true },
            { id: "zip", label: "ZIP Code *" },
          ].map(({ id, label, colSpan, isSelect }) => (
            <div key={id} className={colSpan ? `md:col-span-${colSpan} relative` : "relative"}>
              <label htmlFor={id} className={labelStyle}>
                {label}
              </label>
              {isSelect ? (
                <select
                  id={id}
                  name={id}
                  value={(billing as any)[id]}
                  onChange={handleBillingChange}
                  className={inputStyle}
                >
                  <option value="">Select state</option>
                  <option value="GA">GA</option>
                  <option value="NY">NY</option>
                  <option value="CA">CA</option>
                </select>
              ) : (
                <input
                  id={id}
                  name={id}
                  value={(billing as any)[id]}
                  onChange={handleBillingChange}
                  className={inputStyle}
                  autoComplete="off"
                />
              )}
            </div>
          ))}
        </div>

        {/* ✅ 按钮区域始终渲染 */}
        <div className="pt-6 space-y-8">
          <div className="flex justify-end space-x-4">
            {!hasBillingInput ? (
              <button
                type="button"
                disabled
                className="px-9 py-3 rounded-full bg-gray-200 text-gray-500 cursor-not-allowed font-semibold"
              >
                Continue
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="border border-purple-800 text-purple-800 bg-white px-9 py-3 rounded-full hover:bg-purple-50 transition font-semibold"
                  onClick={() =>
                    setBilling({
                      firstName: "",
                      lastName: "",
                      address: "",
                      apt: "",
                      city: "",
                      state: "",
                      zip: "",
                    })
                  }
                >
                  Clear all fields
                </button>

                <button
                  type="button"
                  className="px-9 py-3 rounded-full bg-purple-800 text-white hover:bg-purple-900 transition font-semibold"
                  onClick={() => onBillingAddressFilled(billing)}
                >
                  Continue
                </button>
              </>
            )}
          </div>

          {/* ✅ Show PayPal button only after billing info is filled */}
          {hasBillingInput && (
            <PayPalButtons
              createOrder={async () => {
                try {
                  const order = await createOrder({ cart: cartItems });
                  return order.id;
                } catch (err) {
                  console.error("Failed to create order:", err);
                  alert("Failed to create order");
                  return "";
                }
              }}
              onApprove={async (data) => {
                try {
                  await captureOrder(data.orderID);
                  alert("Payment successful!");
                } catch (err) {
                  console.error("Capture failed:", err);
                  alert("Payment capture failed");
                }
              }}
            />

          )}

        </div>
      </form>

      {/* Shipping 表单 */}
      <ShippingForm
        billing={billing}
      />
    </PayPalScriptProvider>
  );
}
