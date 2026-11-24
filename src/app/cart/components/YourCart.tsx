"use client";

import React, { useEffect, useState } from "react";
import ItemsAddedCart from "./ItemsAddedCart";
import { useAtomValue } from "jotai";
import EmptyCart from "./EmptyCart";
import { addedCartItemsAtom } from "@/store/cartStore";
import PaymentReceipt, { type PaymentReceiptItem } from "@/components/payment/PaymentReceipt";
import { CART_CHECKOUT_RECEIPT_STORAGE_KEY } from "@/lib/api/cartService";

interface CartReceiptData {
  amount: number | null;
  currency: string;
  orderId: string | null;
  items: PaymentReceiptItem[];
}

export default function YourCart() {
  const addedCartItems = useAtomValue(addedCartItemsAtom);
  const [receiptData, setReceiptData] = useState<CartReceiptData | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("checkout") !== "success") return;

    try {
      const storedReceipt = sessionStorage.getItem(CART_CHECKOUT_RECEIPT_STORAGE_KEY);
      if (storedReceipt) {
        setReceiptData(JSON.parse(storedReceipt) as CartReceiptData);
      } else {
        // Let PaymentReceipt fall back to the signed-in user's recent history.
        setReceiptData({ amount: null, currency: "USD", orderId: null, items: [] });
      }
    } catch {
      setReceiptData({ amount: null, currency: "USD", orderId: null, items: [] });
    } finally {
      sessionStorage.removeItem(CART_CHECKOUT_RECEIPT_STORAGE_KEY);
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <>
      <div className="flex items-center justify-center bg-[#f5e8ff]">
        <div className="mt-[80px] w-[87%] rounded-lg bg-[#edd6fe] px-[4%] py-[2%] shadow-lg">
          <h2 className="mb-[1%] self-start font-montserrat text-6xl font-semibold text-primary-brown 3xl:text-7xl 4xl:text-7xl">
            Your cart
          </h2>
          {addedCartItems.length ? <ItemsAddedCart /> : <EmptyCart />}
        </div>
      </div>
      {receiptData && (
        <PaymentReceipt
          open={true}
          category="cart"
          title="Cart order"
          amount={receiptData.amount}
          currency={receiptData.currency}
          transactionId={receiptData.orderId}
          items={receiptData.items}
          onClose={() => setReceiptData(null)}
        />
      )}
    </>
  );
}
