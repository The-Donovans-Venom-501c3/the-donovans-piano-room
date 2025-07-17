"use client";

import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalPayment() {
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "sd",
        currency: "USD",
      }}
    >
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-6">Pay with PayPal</h1>

        {paid ? (
          <div className="p-4 bg-green-100 text-green-700 rounded">
            Payment successful! Thank you for your purchase.
          </div>
        ) : (
          <>
            <p className="mb-4">Amount: <strong>$10.00</strong></p>

            <PayPalButtons
              style={{ layout: "vertical", shape: "rect" }}
              createOrder={async (data, actions) => {
                setIsLoading(true);
                // 创建订单
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: "10.00",
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                setIsLoading(true);
                try {
                  const details = await actions.order?.capture();
                  setPaid(true);
                  setError(null);
                } catch (err) {
                  setError("Payment could not be completed.");
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={(err) => {
                setError("An error occurred with your payment. Please try again.");
                setIsLoading(false);
              }}
              onCancel={() => {
                setError("Payment cancelled.");
                setIsLoading(false);
              }}
            />

            {isLoading && <p className="mt-4 text-gray-500">Processing payment...</p>}

            {error && <p className="mt-4 text-red-600">{error}</p>}
          </>
        )}
      </div>
    </PayPalScriptProvider>
  );
}
