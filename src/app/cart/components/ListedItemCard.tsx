import React from 'react';
import Image from 'next/image';
import { bookCartItemInterface } from '@/interfaces/bookInterface';
import { useSetAtom } from 'jotai';
import { addedCartItemsAtom, useCartOperations } from '@/store/cartStore';

const ListedItemCard = ({ book, index }: { book: bookCartItemInterface; index: number }) => {
  const setAddedCartItems = useSetAtom(addedCartItemsAtom);
  const { updateQuantity, removeFromCart } = useCartOperations();

  const removeItem = () => removeFromCart(book.id);
  // const saveForLater = () => { };

  return (
    <div className="w-full tablet:w-full laptop:w-full rounded-[12px] p-8">
      <div className="flex flex-row items-center gap-10 h-auto tablet:h-auto laptop:h-auto">
        {/* Image Section */}
        <div className="relative h-[24vh] w-[8vw]">
          <Image
            src={book.coverImageSrc}
            alt="Book Cover"
            fill
            className="absolute w-full h-full rounded-[12px]"
            style={{ objectFit: "cover", margin: 0, padding: 0 }}
          />
        </div>

        {/* Text and Details Section */}
        <div className="flex flex-col justify-between flex-grow h-full">
          <div className="flex flex-row justify-between items-start w-full mb-48">
            {/* Title Section */}
            <div className="flex flex-col gap-[15px]">
              <h3 className="font-montserrat font-bold text-2xl 3xl:text-3xl 4xl:text-7xl text-primary-brown">
                The Donovan <br />
                <span className="whitespace-nowrap">
                  Piano Room {book.title}
                </span>
              </h3>
              <span className="font-roboto font-semibold text-xl 3xl:text-4xl 4xl:text-5xl text-purple-800">
                ${book.price}.00
              </span>
            </div>

            {/* Quantity + Price Section */}
            <div className="flex flex-row items-start gap-6 justify-end w-full">
              {/* Quantity*/}
              <select
                value={book.quantity}
                onChange={(e) => updateQuantity(book.id, Number(e.target.value))}
                className="border-2 border-primary-purple rounded-[8px] px-3 py-1 font-roboto font-bold text-lg text-primary-purple cursor-pointer w-[54px] h-[44px]"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              {/* Price */}
              <div className="flex flex-col items-end p-2 w-[60px] h-[68px]">
                <span className="font-roboto font-semibold text-2xl 3xl:text-4xl 4xl:text-5xl text-purple-800">
                  ${book.price}.00
                </span>
              </div>
            </div>

          </div>

          {/* bottom button */}
          <div className="flex flex-row items-center gap-10">
            <div
              className="flex flex-row items-center gap-2 cursor-pointer"
              onClick={removeItem}
            >
              <span className="font-roboto font-bold text-xl 3xl:text-2xl 4xl:text-3xl text-primary-purple underline">
                Remove
              </span>
              <div className="relative w-[1.5vw] h-[1.5vw]">
                <Image src="/delete.svg" alt="delete" fill style={{ objectFit: 'contain' }} />
              </div>
            </div>

            <div
              className="flex flex-row items-center gap-2 cursor-pointer"
            // onClick={saveForLater} 
            >
              <span className="font-roboto font-bold text-xl 3xl:text-2xl 4xl:text-3xl text-primary-purple underline">
                Save for Later
              </span>
              <div className="relative w-[1.5vw] h-[1.5vw]">
                <Image src="/HeartIcon.svg" alt="save" fill style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedItemCard;