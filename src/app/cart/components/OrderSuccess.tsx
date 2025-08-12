import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { addedCartItemsAtom, useCartOperations } from "@/store/cartStore";
import Button3 from "@/components/atoms/Button3";
import { useRouter } from "next/navigation";

export default function OrderSuccess({ orderId }: { orderId: string }) {
  const addedCartItems = useAtomValue(addedCartItemsAtom);
  const [product] = useState(addedCartItems[0]); 
  const router = useRouter();
  const { clearCart } = useCartOperations();

  useEffect(() => {
    const timer = setTimeout(() => {
      clearCart();
    }, 0); 
    return () => clearTimeout(timer);
  }, [clearCart]);

  if (!product) return null;

  return (
    <div className="flex items-center justify-center bg-[#f5e8ff] mt-12">
      <div className="mt-[80px] w-[87%] rounded-lg bg-[#edd6fe] px-[4%] py-[2%]">
        <h2 className="text-4xl font-bold text-[#4B2A16] mb-6 text-center">
          Thank you for your purchase!
        </h2>
        <p className="text-[#4B2A16] text-xl text-center mb-4">
          Your Order ID is{" "}
          <span className="font-bold">{orderId}</span>
        </p>
        <p className="text-[#4B2A16] text-xl mb-10 text-center">
          This order is saved to your account and can be tracked anytime in Order History.
        </p>
        <div className="flex justify-center items-center gap-8 mt-12">
          <Button3
            text={
              <div className="flex text-xl items-center justify-center gap-3">
                <span>Continue shopping</span>
              </div>
            }
            style={{ width: "15%", fontSize: "1.5rem" }}
            onClick={() => window.location.reload()}
          />
        </div>
        <div className="flex justify-center items-center gap-8 mt-12">
          <div className="flex justify-center items-center gap-8">
            <div className="aspect-[3/4] w-64 overflow-hidden rounded-[12px]">
              <img
                src={product.imageSrc}
                alt={product.title}
                className="w-full h-full object-cover scale-105"
              />
            </div>
          </div>
          <div className="text-left">
            <p className="font-bold text-2xl text-[#4B2A16] mb-2">
              {"Soft cover"} | {product.title}
            </p>
            <div className="h-[2px] w-full bg-purple-300 mb-2"></div>
            <p className="font-bold text-3xl text-[#4B2A16] leading-[1.5]">
              {"The Donovan's Piano "}<br />{"Room "}
              {product.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
