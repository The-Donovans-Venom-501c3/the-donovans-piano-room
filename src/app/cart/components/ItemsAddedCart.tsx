import React, { useState } from "react";
import PaymentCard from "./PaymentCard";
import ListedItemCard from "./ListedItemCard";
import { useAtom } from "jotai";
import { addedCartItemsAtom } from "@/store/cartStore";
import PaymentForm from "./PaymentForm";

export default function ItemsAddedCart() {
  const [addedCartItems] = useAtom(addedCartItemsAtom);
  const [showCheckoutForms, setShowCheckoutForms] = useState(false);
  const [billingAddress, setBillingAddress] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full justify-between tablet:gap-8 laptop:gap-10 desktop:gap-12 tablet:pb-[6%]">
      <div className="flex flex-col tablet:w-[60%] tablet:h-[72%] desktop:w-[80%] desktop:h-full gap-8">
        {addedCartItems.map((book, index) => (
          <ListedItemCard key={index} book={book} index={index} />
        ))}

        {showCheckoutForms && (
          <div className="mt-8">
            <PaymentForm onBillingAddressFilled={(billing) => setBillingAddress(billing)} />
          </div>
        )}
      </div>

      <PaymentCard
        onCheckoutCreditCardClick={() => setShowCheckoutForms(true)}
      />
    </div>
  );
}























