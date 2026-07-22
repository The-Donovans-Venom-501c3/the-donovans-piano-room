import React, { useState } from 'react';
import Image from 'next/image';
import Button4 from "@/components/atoms/Button4";
import InputForm from '@/components/atoms/form-input';
import { bookCartItemInterface } from '@/interfaces/bookInterface';
import { useSetAtom } from 'jotai';
import { addedCartItemsAtom, useCartOperations } from '@/store/cartStore';

const ListedItemCard = ({ book, index }: { book: bookCartItemInterface, index: number }) => {
  const setAddedCartItems = useSetAtom(addedCartItemsAtom);
  const { updateQuantity, removeFromCart } = useCartOperations();
  
  // States for handling the coupon flow
  const [bookCoupon, setBookCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const increaseQuantity = () => updateQuantity(book.id, book.quantity + 1);
  const removeItem = () => removeFromCart(book.id);
  const decreaseQuantity = () => updateQuantity(book.id, book.quantity - 1);

  // Function to apply and validate the coupon
  const handleApplyCoupon = async () => {
    setCouponError(""); // Clear any previous errors

    if (!bookCoupon.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplying(true);

    try {
      // NOTE: Ensure '/api/coupons/validate' is your exact backend/API validation endpoint
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: bookCoupon, 
          bookId: book.id 
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // If API responds with an error status or validation failure
        setCouponError(data.message || "Invalid coupon code");
      } else {
        // SUCCESS: Update global state item price so the total updates
        setAddedCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === book.id && data.discountedPrice
              ? { ...item, price: data.discountedPrice }
              : item
          )
        );
        console.log("Coupon applied successfully!", data);
      }
    } catch (err) {
      // Fallback if the network call fails completely
      setCouponError("Invalid coupon code");
    } finally {
      setIsApplying(false);
    }
  };

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

        {/* Coupon Section */}
        <div className="flex flex-col gap-2 mt-[4%] w-full">
          <div className="flex flex-row items-center gap-[24px] w-full">
            <InputForm 
              field={{ label: "Coupon code", name: "coupon-field", type: "text" }} 
              onChange={(e: any) => {
                setBookCoupon(e.target.value);
                if (couponError) setCouponError(""); // Instantly clear error on typing
              }} 
              text={bookCoupon} 
              error={couponError} // Passes the dynamic error state to your styled input
            />
            <Button4 
              text={isApplying ? "Applying..." : "Apply Coupon"}
              onClick={handleApplyCoupon} // Execute verification click
              style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justify: 'center', 
                alignItems: 'center', 
                paddingLeft: '24px', 
                paddingRight: '24px', 
                paddingTop: '8px', 
                paddingBottom: '8px', 
                width: '200px', 
                height: '40px', 
                border: '1px solid #6F219E', 
                borderRadius: '31px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 'bold', 
                fontSize: '14px', 
                color: '#6F219E',
                opacity: isApplying ? 0.6 : 1,
                cursor: isApplying ? 'not-allowed' : 'pointer'
              }}
            />
          </div>
          
          {/* Safeguard: If InputForm has layout styles that hide its internal "error" prop message, this directly displays it */}
          {couponError && (
            <p className="text-red-500 font-roboto text-sm font-semibold tracking-wide ml-1">
              {couponError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListedItemCard;



















