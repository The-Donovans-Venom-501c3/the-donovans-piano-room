"use client";

import React, { useState } from "react";
import PaymentCard from "./PaymentCard";
import ListedItemCard from "./ListedItemCard";
import PaymentForm, { BillingAddressData } from "./PaymentForm";
import { useAtom } from "jotai";
import { addedCartItemsAtom } from "@/store/cartStore";

export default function ItemsAddedCart() {
  const [addedCartItems] = useAtom(addedCartItemsAtom);
  const [billingAddress, setBillingAddress] = useState<BillingAddressData | null>(
    null
  );

  return (
    <div className="flex flex-col lg:flex-row w-full h-full justify-between tablet:gap-8 laptop:gap-10 desktop:gap-12 tablet:pb-[6%]">
      <div className="flex flex-col tablet:w-[60%] tablet:h-[72%] desktop:w-[80%] desktop:h-full gap-8">
        {addedCartItems.map((book, index) => (
          <ListedItemCard key={index} book={book} index={index} />
        ))}

        <PaymentForm onBillingChange={(billing) => setBillingAddress(billing)} />
      </div>

      <PaymentCard billingAddress={billingAddress} />
    </div>
  );
}