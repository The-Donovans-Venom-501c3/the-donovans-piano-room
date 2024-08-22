import React, { useState } from 'react';
import Image from 'next/image';
import Button4 from "@/components/atoms/Button4";
import InputForm from '@/components/atoms/form-input';
import {bookCartItemInterface} from '@/interfaces/bookInterface';
import { useSetAtom } from 'jotai';
import { addedCartItemsAtom } from '@/utils/stores';

const ListedItemCard = ({ book, index }: {book: bookCartItemInterface, index: number}) => {
  const setAddedCartItems = useSetAtom(addedCartItemsAtom)
  const [bookCoupon, setBookCoupon] = useState("")
  const increaseQuantity = () => setAddedCartItems(prev => {
    const updated = [...prev]
    if(updated[index].quantity)
    updated[index].quantity = updated[index].quantity + 1

    return updated
  })
  const removeItem = () => setAddedCartItems(prev => {
    const updated = [...prev]
    updated.splice(index, 1)
    return updated
  })
  return (
    <div className="flex flex-row  items-center p-8 gap-6 w-[62%] h-full tablet:w-full tablet:h-[72%] laptop:w-full laptop:h-[75%] bg-white rounded-[12px] shadow-md">
      {/* Image Section */}
      <div className="relative h-[28vh] w-[14vw]">
        <Image
          src={book.imageSrc}
          alt="Book Cover"
          fill
          className="absolute w-full h-full left-0 top-0 rounded-[12px]"
          style={{objectFit : "cover", boxShadow: "2px 2px 4px 0px #AC7A2280", margin: 0, padding: 0 }}
        />
      </div>

      {/* Text and Details Section */}
      <div className="flex flex-col justify-between w-full h-[26%]">
        {/* Title */}
        <div className="flex flex-col gap-[15px]">
          <h3 className="font-montserrat font-bold text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown">
            The Donovan Piano Room {book.title}
          </h3>
        </div>

        {/* Quantity and Remove */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-start gap-[32px]">
            <div className="flex flex-row items-center gap-[4px] w-[80px] h-[24px]" onClick={removeItem}>
              <span className="font-roboto font-bold text-xl 3xl:text-2xl 4xl:text-3xl text-primary-purple">
                Remove
              </span>
              <div className="relative w-[5vw] h-[5vw]">
                <Image src="/delete.svg" alt="" fill />
              </div>
            </div>

            <div className="flex flex-row items-center gap-[9px] w-[52px] h-[26px]">
              <span className="font-roboto font-bold text-xl 3xl:text-2xl 4xl:text-3xl text-primary-purple">
                {book.quantity}X
              </span>
              <div className="relative w-[5vw] h-[5vw] bg-no-repeat bg-center bg-contain" onClick={increaseQuantity}>
                <Image src="/add.svg" alt="" fill />
              </div>
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

        {/* Coupon Section */}
        <div className="flex flex-row items-center gap-[24px] w-full mt-[4%]">
          <InputForm field={{label: "Coupon code", name: "coupon-field", type: "text"}} onChange={(e: any)=>setBookCoupon(e.target.value)} text={bookCoupon} error=''/>
          <Button4 text="Apply Coupon"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px', paddingTop: '8px', paddingBottom: '8px', width: '200px', height: '40px', border: '1px solid #6F219E', borderRadius: '31px', fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', fontSize: '14px', color: '#6F219E'}}
          />
        </div>
      </div>
    </div>
  );
};

export default ListedItemCard;



















