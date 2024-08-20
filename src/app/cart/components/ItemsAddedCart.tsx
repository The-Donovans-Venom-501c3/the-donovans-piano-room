import React from "react";
import PaymentCard from "./PaymentCard";
import ListedItemCard from "./ListedItemCard";
import { addedCartItemsAtom } from '@/utils/stores';
import { useAtom } from 'jotai';

export default function ItemsAddedCart() {
    const [addedCartItems] = useAtom(addedCartItemsAtom); // Get the list of added items from the atom

    return (
        <div className="flex flex-col lg:flex-row w-full h-full justify-between tablet:gap-8 laptop:gap-10 desktop:gap-12 tablet:pb-[6%]">
            <div className="flex flex-col tablet:w-[60%] tablet:h-[72%] desktop:w-[80%] desktop:h-full gap-8">
                {addedCartItems.length > 0 ? (
                    addedCartItems.map((book, index) => (
                        <ListedItemCard key={index} book={book} /> // Pass the book details to ListedItemCard
                    ))
                ) : (
                    <ListedItemCard />
                )}
            </div>
            <PaymentCard />
        </div>
    );
}



































