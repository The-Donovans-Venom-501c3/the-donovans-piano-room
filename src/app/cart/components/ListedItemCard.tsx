import React from 'react';
import Image from 'next/image';
import { bookCartItemInterface } from '@/interfaces/bookInterface';
import { useCartOperations } from '@/store/cartStore';

const ListedItemCard = ({ book }: { book: bookCartItemInterface, index: number }) => {
  const { updateQuantity, removeFromCart } = useCartOperations();

  const increaseQuantity = () => updateQuantity(book.id, book.quantity + 1);
  const removeItem = () => removeFromCart(book.id);
  const decreaseQuantity = () => updateQuantity(book.id, book.quantity - 1);

  return (
    <div className="flex flex-row items-center p-8 gap-6 w-[62%] h-full tablet:w-full tablet:h-[72%] laptop:w-full laptop:h-[75%] bg-white rounded-[12px] shadow-md">
      {/* Image Section */}
      <div className="relative h-[28vh] w-[14vw]">
        <Image
          src={book.imageSrc}
          alt="Book Cover"
          fill
          className="absolute w-full h-full left-0 top-0 rounded-[12px]"
          style={{ objectFit: "cover", boxShadow: "2px 2px 4px 0px #AC7A2280", margin: 0, padding: 0 }}
        />
      </div>

      {/* Text and Details Section */}
      <div className="flex flex-col justify-between w-full h-[26%]">
        {/* Title */}
        <div className="flex flex-col gap-[15px]">
          <h3 className="font-montserrat font-bold text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown">
            The Donovan Piano Room {book.title}
          </h3>
          <p>Format: {book.type}</p>
        </div>

        {/* Quantity and Remove */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-start gap-[32px]">
            <div className="flex flex-row items-center gap-[4px] w-[80px] h-[24px] cursor-pointer" onClick={removeItem}>
              <span className="font-roboto font-bold text-xl 3xl:text-2xl 4xl:text-3xl text-primary-purple">
                Remove
              </span>
              <div className="relative w-[5vw] h-[5vw]">
                <Image src="/delete.svg" alt="" fill />
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-[9px] w-[72px] h-[26px] border-2 border-primary-purple rounded">
              <button onClick={decreaseQuantity} className="font-roboto text-2xl 3xl:text-3xl 4xl:text-4xl text-primary-purple font-bold">
                -
              </button>
              <span className="font-roboto font-bold text-xl 3xl:text-2xl 4xl:text-3xl text-primary-purple">
                {book.quantity}
              </span>
              <button onClick={increaseQuantity} className="font-roboto text-2xl 3xl:text-3xl 4xl:text-4xl text-primary-purple font-bold">
                +
              </button>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex flex-col items-end p-2 w-[123px] h-[68px] bg-[#F5E8FF] rounded-[12px] 4xl:mt-[2%]">
            <span className="font-roboto font-bold text-2xl 3xl:text-3xl 4xl:text-4xl text-[#714B2D]">
              Price
            </span>
            <span className="font-roboto font-semibold text-3xl 3xl:text-4xl 4xl:text-5xl text-[#1C1A1A]">
              {book.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedItemCard;
